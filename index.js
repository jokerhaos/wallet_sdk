const path = require('path')
const { sleep } = require("./utils/MyUtils")
// 项目根目录
const root_path = path.join(__dirname, 'src')
// 链
const block_chain = process.env.VUE_APP_BLOCKCHAIN || 'tron';
// 合约地址
const contractObj = require(`/src/config/contractAddress.js`)[block_chain]

class Js_SDK {

  constructor() {
    this.block_chain = block_chain
    this.wallet = new (require(`./wallet/${block_chain}.js`).default)()
    this.defaultGas = this.wallet.defaultGas
  }

  /**
   * 新的合约对象
   * @param {*} name
   * @param {*} proxy 是否使用代理合约 default:false
   * @returns {this} 返回一个新的合约对象
   */
  async newContract(name, proxy = false) {
    try {
      await sleep(0.2)
      // 获取合约地址
      if (contractObj.hasOwnProperty(name) === false) {
        alert(`${name}合约地址未设置`)
        return
      }
      let contractAddress = contractObj[name];
      // 获取代理合约地址
      if (proxy) {
        if (contractObj.hasOwnProperty(proxy) === false) {
          alert(`代理合约地址未设置`)
          return
        }
        contractAddress = contractObj[proxy]
      }
      let abi = await require(`/src/abi/${name}.json`)
      if (abi === undefined) {
        alert(`${name}合约的abi文件不存在`)
        return
      }
      const wallet = new (await require(`./wallet/${block_chain}.js`).default)()
      return await wallet.setContract(name, contractAddress, abi)
    } catch (error) {
      console.log(error)
      return error
    }
  }

  /**
   * 调用自己的contract合约对象
   * @param {*} name
   * @param {*} proxy 是否使用代理合约 default:false
   * @returns {this} 返回一个新的合约对象
   */
  async getContract(name, proxy = false) {
    try {
      // 获取合约地址
      if (contractObj.hasOwnProperty(name) === false) {
        alert(`${name}合约地址未设置`)
        return
      }
      let contractAddress = contractObj[name];
      // 获取代理合约地址
      if (proxy) {
        if (contractObj.hasOwnProperty('proxy') === false) {
          alert(`代理合约地址未设置`)
          return
        }
        contractAddress = contractObj['proxy']
      }
      let abi = await require(`/src/abi/${name}.json`)
      if (abi === undefined) {
        alert(`${name}合约的abi文件不存在`)
        return
      }
      const wallet = new (await require(`/src/contract/${block_chain}/${name}.js`).default)()
      return await wallet.setContract(name, contractAddress, abi)
      
    } catch (error) {
      console.log(error)
      return error
    }
  }

  /**
   * 钱包是否已经链接
   * @returns {bool}
   */
  async isWalletConnected() {
    return await this.wallet.isWalletConnected()
  }

  /**
   * 获取当前钱包地址
   * @returns
   */
  async getWalletAddress() {
    return await this.wallet.getWalletAddress()
  }

  /**
   * 获取某个地址的元币balance
   * @param {*} address
   * @returns {uint}
   */
  async balanceOf(address) {
    return await this.wallet.balanceOf(address)
  }

}

/**
 * js_sdk
 * 两个以上合约介意调用 newContract 创建合约对象之后使用
 * this.walletSCF = await walletObj.newContract("SpaceCapsuleFragment");
 * this.walletSC = await walletObj.newContract("SpaceCapsule");
 * 然后使用 this.walletSCF | this.walletSC 对象
 */
export default new Js_SDK()
