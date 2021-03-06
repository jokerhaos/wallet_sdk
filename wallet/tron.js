// var tronweb = require("tronweb");
const { sleep } = require("../utils/MyUtils")
var tronweb = window.tronWeb

const t = setInterval(() => {
  if (tronweb == null || typeof tronweb === undefined) {
    console.log('please install tronlink')
    return
  }
  tronweb = window.tronWeb
  clearInterval(t)
}, 1000);

const tronClass = class Tron {
  constructor() {
    this.name = ''
    this.address = ''
    this.defaultGas = 100000000
  }

  // 消息签名
  async SignMessage(message = '0000000000000000000000000000000000000000000000000000000000000001') {
    return await tronweb.trx.sign(message)
  }

  // 获取NFT的持有者
  async getOwner(token_id) {
    return tronweb.address.fromHex(await this.callMethod('ownerOf', token_id))
  }

  /**
   * 设置合约
   * @param {*} name 逻辑合约名称
   * @param {*} address 合约地址
   * @param {*} abi 逻辑合约ABI
   * @returns 
   */
  async setContract(name, address, abi = {}) {
    console.log('name', name)
    console.log('address', address)
    if (!tronweb) {
      console.log('……')
      // 等待3s重新递归
      await sleep(3)
      return await this.setContract(name, address, abi)
    }
    this.name = name
    this.address = address
    /** .at绑定废弃，因为代理合约需要ABI */
    // this.contract = await tronweb.contract().at(address)
    this.contract = await tronweb.contract(abi,address)
    return this
  }

  // 钱包是否已经链接
  async isWalletConnected() {
    if (!tronweb) { return false }
    if (tronweb.defaultAddress == null || tronweb.defaultAddress.base58 === false) {
      console.info('isWalletConnectedTron false')
      return false
    }
    console.info('isWalletConnectedTron true')
    return true
  }

  // 获取当前钱包地址
  async getWalletAddress() {
    return tronweb.defaultAddress.base58
  }

  // 检查当前NFT存量
  async WalletBalanceOf(user_address) {
    return (await this.callMethod('balanceOf', user_address)).toString()
  }

  // 获取某个地址的元币balance
  async balanceOf(address) {
    return tronweb.trx.getBalance(address)
  }

  /**
   * 转账
   * @param {*} to
   * @param {*} amount
   * @returns
   */
  async transfer(to, amount) {
    console.log('===========transfer==============')
    return await this.sendMethod('transfer', 1e8, 0, to, amount)
  }

  /**
   * 转让
   * @param {*} from 操作人地址
   * @param {*} to 目标地址
   * @param {*} token_id 转让的nft tokenid
   */
  async transferFrom(from, to, token_id) {
    return await this.sendMethod('transferFrom', 1e8, 0, from, to, token_id)
  }

  /**
   * 带签名的交易购买
   * @param {*} nonce 随机数
   * @param {*} signature 签名字符串
   * @param {*} call_value 购买金额
   * @param {*} num 数量
   * @returns
   */
  async mint(token_id, qu, signature, nonce) {
    return await this.sendMethod('mintBySignature', 1e8, 0, ...[token_id, qu, signature, nonce])
  }

  /**
   * 合并太空碎片
   * @param {*} tokenIds array
   */
  async combine(tokenIds) {
    return await this.sendMethod('combine', 4e8, 0, tokenIds)
  }

  // 设置太空舱合约地址
  async setSCAddr(addr) {
    return await this.sendMethod('setSCAddr', 4e8, 0, addr)
  }

  /**
   * 获取估值
   * @param {*} funName 方法名
   * @param {*} callValue 支付元币
   * @param  {...any} arg 参数
   * @return int
   */
  async estimateGas(funName, callValue, ...arg) {
    // 最大的来吧~
    return 4e8
  }

  // call扩展函数
  async callMethod(funName, ...arg) {
    return await this.contract[funName](...arg).call({})
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
    const gas = !feeLimit ? await this.estimateGas(funName, callValue, ...arg) : feeLimit
    console.log(gas)
    return await this.contract[funName](...arg).send(
      {
        feeLimit: gas,
        callValue: callValue,
        shouldPollResponse: false
      })
  }
}
module.exports = tronClass