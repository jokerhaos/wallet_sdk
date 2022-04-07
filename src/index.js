// 链
const block_chain = process.env.VUE_APP_BLOCKCHAIN || 'tron';
// 环境
const wallet_env = process.env.WALLET_ENV || 'dev';
// 合约地址
const contractObj = require("./config/contractAddress.json")[wallet_env][block_chain]
// abi
const abiList = require("./config/abiList.json");

class Js_SDK {
  constructor(block_chain, contractObj) {
    this.block_chain = block_chain
    // eslint-disable-next-line new-cap
    this.wallet = new (require(`@/js_sdk/wallet/${block_chain}.js`).default)()
    this.contractObj = contractObj
    this.defaultGas = this.wallet.defaultGas
  }

  /**
   * 新的合约对象
   * @param {*} name
   * @returns {this} 返回一个新的合约对象
   */
  async newContract(name) {
    try {
      const wallet = new (await require(`@/js_sdk/wallet/${this.block_chain}.js`).default)()
      return await wallet.setContract(name, this.contractObj[name], require(abiList[name]))
    } catch (error) {
      console.log(error)
      return error
    }
  }

  /**
     * 获取合约
     * @param {*} name
     * @returns {object} web3合约对象
     */
  async getContract(name) {
    return await this.wallet.getContract(name)
  }

}

/**
 * js_sdk
 * 两个以上合约介意调用 newContract 创建合约对象之后使用
 * this.walletSCF = await walletObj.newContract("SpaceCapsuleFragment");
 * this.walletSC = await walletObj.newContract("SpaceCapsule");
 * 然后使用 this.walletSCF | this.walletSC 对象
 */
export default new Js_SDK(block_chain, contractObj)
