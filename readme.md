```

    使用扩展，项目需要两个env变量

        VUE_APP_BLOCKCHAIN='' //默认tron tron or ethereum or binance

        // 扩展会根据环境变量自动调用对应环境的钱包

        import walletObj from 'j_wallet_sdk'

    contract、abi、config 目录请配置在根目录/src
    三个文件夹可以去 https://github.com/jokerhaos/wallet_sdk 获取

    contractAddress.js的key就是加载合约时用的参数
    contractAddress.js的key又是abi的文件名

    contractAddress.js 合约地址你可以写env配置，方便环境加载

    使用代理合约的话，newContract的时候设置第二个参数，参数名是contractAddress的key

    <<<<<<<<<<<<<<<<<<<<<< HelloWorld.vue 是使用例子

```


```
        /**
        * 新的合约对象
        * @param {*} name
        * @param {*} proxy 是否使用代理合约，default:false
        * @returns {this} 返回一个新的合约对象
        */
        const APENFT = await walletObj.newContract('apenft','apenftProxy')
        // 或者使用
        const APENFT = await walletObj.getContract('apenft')
        // 或者使用
        const APENFT = await walletObj.contract(abi,合约地址)

        // 转账
        const tx = APPNFT.transfer('0x',100)

        // 获取地址余额
        const balanceOf = APPNFT.WalletBalanceOf('0x');

        // 不消耗gas调用
        const result = APPNFT.callMethod('方法名',...参数)
        // 例如查看地址余额
        const result = APPNFT.callMethod('balanceOf','0x')

        /**
        * 获取估值
        * @param {*} funName 方法名
        * @param {*} callValue 支付元币
        * @param  {...any} arg 参数
        * @return int
        */
        const feeLimit = APPNFT.estimateGas('transfer',0,'0x',100);

        /**
        * send扩展函数
        * @param {*} funName 方法名
        * @param {*} feeLimit gas限额,false或者0自动估值
        * @param {*} callValue 消耗元币
        * @param  {...any} arg 多个参数 a,b,c,d....
        * @returns tx 交易单号
        */
        // 例如转账
        const tx1 = APPNFT.sendMethod('transfer',0,0,'0x',100)

        // 获取元币余额
        const balanceOf2 = walletObj.balanceOf('0x')
        
```

```

    开发者新增新合约

        1. config/contractAddress.js 写入合约地址
        2. abi目录放json文件
        3. 你也可以写一个自己的contract.js 写到contract/链 然后继承tron.js or ethereum.js
        4. 写自己的contract.js则使用 “getContract()” 对应的合约对象 

```