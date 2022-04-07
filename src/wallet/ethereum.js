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

  // 获取合约
  async getContract() {
    if (version === 0.2) {
      // 0.2版本
      return web3.eth.contract(this.abi).at(this.address)
    } else {
      // 1.6版本
      return await new web3.eth.Contract(this.abi, this.address)
    }
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
   * 合并太空碎片
   * @param {*} tokenIds array
   * @param {*} callValue int 应该是 钛合金数量*合成单价
   */
  async combine(tokenIds, callValue) {
    return await this.sendMethod('combine', 0, callValue, tokenIds)
  }

  // 设置太空舱合约地址
  async setSCAddr(addr) {
    return await this.sendMethod('setSCAddr', 4e8, 0, addr)
  }

  // call扩展函数
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

  // send扩展函数
  async sendMethod(funName, feeLimit, callValue, ...arg) {
    const my_wallet_address = await this.getWalletAddress()
    if (version === 0.2) {
      // 0.2版本
      let gas = await new Promise((resolve, reject) => {
        this.contract[funName].estimateGas(
          ...arg,
          {
            from: my_wallet_address,
            value: callValue
          }, function (error, gas) {
            if (!error) {
              resolve(gas * 2)
            } else {
              // Bianca测试链估值会有问题
              resolve(feeLimit || 3e6)
              // reject(error)
            }
          })
      })
      // 防止估计有误
      feeLimit = feeLimit > 3e6 ? 3e6 : feeLimit
      gas = (gas + 1000) > 3e6 ? 3e6 : gas + 1000
      gas = gas < feeLimit ? feeLimit : gas
      console.log(gas)
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
      let gas = (await this.contract.methods[funName](...arg).estimateGas({
        from: my_wallet_address,
        value: callValue
      }).catch((err) => {
        console.log(err)
      }) || 3e6)
      // 防止估计有误
      feeLimit = feeLimit > 3e6 ? 3e6 : feeLimit
      gas = (gas + 1000) > 3e6 ? 3e6 : gas + 1000
      gas = gas < feeLimit ? feeLimit : gas
      console.log(gas)
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

export default ethClass
