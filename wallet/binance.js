// const ethers = require('ethers')
// const detectEthereumProvider = require('@metamask/detect-provider')

// function startApp(provider) {
//   // If the provider returned by detectEthereumProvider is not the same as
//   // window.ethereum, something is overwriting it, perhaps another wallet.
//   if (provider !== window.ethereum) {
//     console.error('Do you have multiple wallets installed?')
//   }
//   // Access the decentralized web!
// }

// // var ethereum = '';
// var ethereum = window.ethereum
// if (ethereum == null || typeof ethereum === undefined) { alert('please install MetaMask') }

// var provider, signer, defaultAddress
// var version = 0.2

// setTimeout(async() => {
//   const metaMaskprovider = await detectEthereumProvider()
//   if (metaMaskprovider) {
//     // From now on, this should always be true:
//     // provider === window.ethereum
//     startApp(metaMaskprovider) // initialize your app
//   } else {
//     console.log('Please install MetaMask!')
//   }

//   ethereum = metaMaskprovider
//   ethereum.request({ method: 'eth_requestAccounts' })

//   // Web3Provider 包装了一个标准的 Web3 提供程序，这是
//   // MetaMask 作为 window.ethereum 注入每个页面的内容
//   provider = new ethers.providers.Web3Provider(ethereum)

//   // MetaMask 需要请求权限才能连接用户帐户
//   await provider.send('eth_requestAccounts', [])

//   // MetaMask 插件还允许签署交易
//   // 发送以太币并支付更改区块链内的状态。
//   // 为此，您需要帐户签名者...
//   signer = provider.getSigner()

//   ethereum.on('accountsChanged', function(accounts) {
//     defaultAddress = accounts
//   })
//   // 换链重新生成对象
//   ethereum.on('chainChanged', async(chainId) => {
//     ethereum = metaMaskprovider
//     ethereum.request({ method: 'eth_requestAccounts' })

//     provider = new ethers.providers.Web3Provider(ethereum)
//     await provider.send('eth_requestAccounts', [])
//     signer = provider.getSigner()
//   })
// }, 1000)

// const ethClass = class Eth {
//   constructor() {
//     this.name = ''
//     this.address = ''
//     this.defaultGas = 0
//   }

//   // 消息签名
//   async SignMessage(message = '0000000000000000000000000000000000000000000000000000000000000001') {

//   }

//   // 获取NFT的持有者
//   async getOwner(token_id) {
//     return await this.callMethod('ownerOf', token_id)
//   }

//   // 获取NFT的高品质概率
//   async highQualityProb() {
//     return await this.callMethod('_highQualityProb')
//   }

//   // 设置NFT的高品质概率
//   async setHighQualityProb(_prob) {
//     return await this.sendMethod('setHighQualityProb', 0, 0, _prob)
//   }

//   // 获取NFT的品质
//   async getQuality(token_id) {
//     return await this.callMethod('getTokenIdProb', token_id)
//   }

//   // 设置合约
//   async setContract(name, address, abi) {
//     this.name = name
//     this.address = address
//     this.abi = abi
//     this.contract = new ethers.Contract(address, abi, provider)
//     this.daiWithSigner = this.contract.connect(signer)
//     return this
//   }

//   // 获取合约
//   async getContract() {
//     return new ethers.Contract(this.address, this.abi, provider)
//   }

//   // 钱包是否已经链接
//   async isWalletConnected() {
//     return !!ethereum
//   }

//   // 获取当前钱包地址
//   async getWalletAddress() {
//     return defaultAddress
//   }

//   // 检查当前NFT存量
//   async WalletBalanceOf(user_address) {
//     return await this.callMethod('balanceOf', user_address)
//   }

//   // 获取某个地址的元币balance
//   async balanceOf(address) {
//     return await provider.getBalance(address)
//   }

//   /**
//    * 转账
//    * @param {*} to
//    * @param {*} amount
//    * @returns
//    */
//   async transfer(to, amount) {
//     return await this.sendMethod('transfer', 3e7, 0, to, amount)
//   }

//   /**
//    * 转让
//    * @param {*} to 目标地址
//    * @param {*} from 操作人地址
//    * @param {*} token_id 转让的nft tokenid
//    */
//   async transferFrom(to, from, token_id) {
//     return await this.sendMethod('transferFrom', 0, 0, from, to, token_id)
//   }

//   /**
//    * 带签名的交易购买
//    * @param {*} token_id token id
//    * @param {*} qu 是否是高质量
//    * @param {*} nonce 随机数
//    * @param {*} signature 签名字符串
//    * @returns
//    */
//   async mint(token_id, qu, signature, nonce) {
//     return await this.sendMethod('mintBySignature', 0, 0, ...[token_id, qu, signature, nonce])
//   }

//   /**
//    * 合并太空碎片
//    * @param {*} tokenIds array
//    * @param {*} callValue int 应该是 钛合金数量*合成单价
//    */
//   async combine(tokenIds, callValue) {
//     return await this.sendMethod('combine', 0, callValue, tokenIds)
//   }

//   // 设置太空舱合约地址
//   async setSCAddr(addr) {
//     return await this.sendMethod('setSCAddr', 4e8, 0, addr)
//   }

//   // call扩展函数
//   async callMethod(funName, ...arg) {
//     const my_wallet_address = await this.getWalletAddress()
//     if (version === 0.2) {
//       // 0.2版本
//       return await new Promise((resolve, reject) => {
//         this.contract[funName](
//           ...arg,
//           { from: my_wallet_address, gas: 500000, value: 0 }, function(error, result) {
//             if (!error) {
//               resolve(result)
//             } else {
//               reject(error)
//               console.error(error)
//             }
//           })
//       })
//     } else {
//       // 1.6版本
//       return await this.contract.methods[funName](...arg).call({
//         from: my_wallet_address
//       })
//     }
//   }

//   // send扩展函数
//   async sendMethod(funName, feeLimit, callValue, ...arg) {
//     const my_wallet_address = await this.getWalletAddress()
//     console.log(my_wallet_address)
//     console.log(arg)
//     console.log(this.daiWithSigner)
//     console.log(this.address)
//     return this.daiWithSigner[funName](...arg)
//   }
// }

// export default ethClass
const ethClass = require('./ethereum')

export default ethClass