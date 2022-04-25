const { sleep } = require("../utils/MyUtils")
const Web3 = require('web3')
// const detectEthereumProvider = require('@metamask/detect-provider');
// var ethereum = '';
var ethereum = window.ethereum
var web3 = ''
var defaultAddress = ''
var version = 0.2

const t = setInterval(() => {
  if (ethereum == null || typeof ethereum === undefined) {
    console.log('please install MetaMask')
    return
  }
  ethereum = window.ethereum
  ethereum.request({ method: 'eth_requestAccounts' })
  web3 = new Web3(ethereum)
  const v = parseFloat(web3.version.api || web3.version)
  version = v < 0.30 && v >= 0.2 ? 0.2 : 1.7
  console.log('version:' + v)
  console.log('version-result:' + version)
  ethereum.on('accountsChanged', function (accounts) {
    defaultAddress = accounts[0]
  })
  // 换链重新生成对象
  ethereum.on('chainChanged', (chainId) => {
    ethereum = window.ethereum
    ethereum.request({ method: 'eth_requestAccounts' })
    web3 = new Web3(ethereum)
    // window.location.reload();
  })
  window.addEventListener('load', async () => {
    try {
      console.log('ethereum.enable')
      await ethereum.enable()
    } catch (error) {
      console.log(error)
    }
  })
  clearInterval(t)

}, 1000);


const ethClass = class Eth {
  constructor() {
    this.name = ''
    this.address = ''
    this.defaultGas = 0
  }

  // 消息签名
  async SignMessage(message = '0000000000000000000000000000000000000000000000000000000000000001') {
    // 0.2
    if (version === 0.2) {
      return await new Promise(async (resolve, reject) => {
        ethereum.personal.sign(message, await this.getWalletAddress(), (err, res) => {
          if (err != null) {
            reject(err)
          } else {
            resolve(res)
          }
        })
      })
    }
    // 1.6
    return await web3.eth.personal.sign(message, await this.getWalletAddress())
  }

  // 获取NFT的持有者
  async getOwner(token_id) {
    return await this.callMethod('ownerOf', token_id)
  }

  // 获取NFT的高品质概率
  async highQualityProb() {
    return await this.callMethod('_highQualityProb')
  }

  // 设置NFT的高品质概率
  async setHighQualityProb(_prob) {
    return await this.sendMethod('setHighQualityProb', 0, 0, _prob)
  }

  // 获取NFT的品质
  async getQuality(token_id) {
    return await this.callMethod('getTokenIdProb', token_id)
  }

  // 设置合约
  async setContract(name, address, abi) {
    console.log('name', name)
    console.log('address', address)
    if (!web3) {
      console.log('……')
      // 等待3s重新递归
      await sleep(3)
      return await this.setContract(name, address, abiList)
    }

    this.name = name
    this.address = address
    this.abi = abi
    if (version === 0.2) {
      // 0.2版本
      address = web3.toChecksumAddress(address.replace('0X', '0x'))
      this.contract = web3.eth.contract(abi).at(address)
    } else {
      // 1.6版本
      address = web3.utils.toChecksumAddress(address.replace('0X', '0x'))
      this.contract = await new web3.eth.Contract(this.abi, address)
    }
    return this
  }

  // 钱包是否已经链接
  async isWalletConnected() {
    return !!ethereum
  }

  // 获取当前钱包地址
  async getWalletAddress() {
    if (version === 0.2) {
      return defaultAddress || web3.eth.accounts[0].toLowerCase()
    } else {
      return defaultAddress || (await web3.eth.getAccounts())[0]
    }
  }

  // 检查当前NFT存量
  async WalletBalanceOf(user_address) {
    return await this.callMethod('balanceOf', user_address)
  }

  // 获取某个地址的元币balance
  async balanceOf(address) {
    if (version === 0.2) {
      return await new Promise((resolve, reject) => {
        web3.eth.getBalance(address, (err, balance) => {
          if (err) {
            reject(err)
          }
          resolve(Number(balance.toString()))
        })
      })
    } else {
      return (await web3.eth.getBalance(address)).toString()
    }
  }

  /**
   * 转账
   * @param {*} to
   * @param {*} amount
   * @returns
   */
  async transfer(to, amount) {
    return await this.sendMethod('transfer', 3e6, 0, to, amount)
  }

  /**
   * 转让
   * @param {*} to 目标地址
   * @param {*} from 操作人地址
   * @param {*} token_id 转让的nft tokenid
   */
  async transferFrom(to, from, token_id) {
    return await this.sendMethod('transferFrom', 0, 0, from, to, token_id)
  }

  /**
   * 带签名的交易购买
   * @param {*} token_id token id
   * @param {*} qu 是否是高质量
   * @param {*} nonce 随机数
   * @param {*} signature 签名字符串
   * @returns
   */
  async mint(token_id, qu, signature, nonce) {
    return await this.sendMethod('mintBySignature', 0, 0, ...[token_id, qu, signature, nonce])
  }

  /**
   * call扩展函数
   * @param {*} funName 方法名
   * @param  {...any} arg 
   * @returns {*}
   */
  async callMethod(funName, ...arg) {
    const my_wallet_address = await this.getWalletAddress()
    if (version === 0.2) {
      // 0.2版本
      return await new Promise((resolve, reject) => {
        this.contract[funName](
          ...arg,
          { from: my_wallet_address, gas: 500000, value: 0 }, function (error, result) {
            if (!error) {
              resolve(result)
            } else {
              reject(error)
              console.error(error)
            }
          })
      })
    } else {
      // 1.6版本
      return await this.contract.methods[funName](...arg).call({
        from: my_wallet_address
      })
    }
  }

  /**
   * 获取估值
   * @param {*} funName 方法名
   * @param {*} callValue 支付元币
   * @param  {...any} arg 参数
   * @return int
   */
  async estimateGas(funName, callValue, ...arg) {
    const my_wallet_address = await this.getWalletAddress()
    var gas;
    if (version === 0.2) {
      // 0.2版本
      gas = await new Promise((resolve, reject) => {
        this.contract[funName].estimateGas(
          ...arg,
          {
            from: my_wallet_address,
            value: callValue
          }, function (error, gas) {
            if (!error) {
              resolve(gas)
            } else {
              // Bianca测试链估值会有问题
              resolve(feeLimit || 3e6)
              // reject(error)
            }
          })
      })
    } else {
      // 1.6版本
      gas = (await this.contract.methods[funName](...arg).estimateGas({
        from: my_wallet_address,
        value: callValue
      }).catch((err) => {
        console.log(err)
      })) || 3e6
    }
    // 防止估计过少
    return (gas + 1000) > 3e6 ? 3e6 : gas + 1000
  }

  /**
   * send扩展函数
   * @param {*} funName 方法名
   * @param {*} feeLimit gas限额,false自动估值
   * @param {*} callValue 消耗元币
   * @param  {...any} arg 多个参数 a,b,c,d....
   * @returns tx 交易单号
   */
  async sendMethod(funName, feeLimit, callValue, ...arg) {
    const my_wallet_address = await this.getWalletAddress()
    const gas = !feeLimit ? await this.estimateGas(funName, callValue, ...arg) : feeLimit
    console.log(gas)
    if (version === 0.2) {
      // 0.2版本
      return await new Promise((resolve, reject) => {
        this.contract[funName](
          ...arg,
          {
            from: my_wallet_address,
            gas: gas,
            value: callValue
          }, function (error, result) {
            if (!error) {
              resolve(result)
            } else {
              reject(error)
            }
          })
      })
    } else {
      // 1.6版本
      const tx = await this.contract.methods[funName](...arg).send({
        gas: gas,
        from: my_wallet_address,
        value: callValue
      })
      console.log(tx)
      return tx.transactionHash
    }
  }
}

module.exports = ethClass
