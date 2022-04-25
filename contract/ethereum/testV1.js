const Ethereum = require("j_wallet_sdk/wallet/ethereum")

const testV1Class = class testV1 extends Ethereum {
  // 写入多余的扩展方法

  /**
   * 设置key
   * @param {*} key 
   * @param {*} value 
   * @returns 
   */
  async SetUint256Param(key, value) {
    return await this.sendMethod('SetUint256Param', 0, 0, ...[
      key, value
    ])
  }

  /**
   * 获取key
   * @param {*} key 
   */
  async GetUint256Param(key) {
    return await this.callMethod('GetUint256Param', key)
  }
}

module.exports = testV1Class
