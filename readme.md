```

    使用扩展，项目需要两个env变量

        MY_ENV = '环境' //dev or prod
        VUE_APP_BLOCKCHAIN='' // tron or ethereum or binance

        // 扩展会根据环境变量自动调用对应环境的钱包

        import walletObj from 'j_wallet_sdk'

        // 加载合约
        const APENFT = await walletObj.newContract('apenft')
        // 或者使用
        const APENFT = await walletObj.myContract('apenft')

        // 转账
        const tx = APPNFT.transfer('0x',100)

        // 获取地址余额
        const balanceOf = APPNFT.WalletBalanceOf('0x');

        // 不消耗gas调用
        const result = APPNFT.callMethod('方法名',...参数)
        // 例如查看地址余额
        const result = APPNFT.callMethod('balanceOf','0x')

        // 消耗gas funName, feeLimit, callValue, ...arg
        const tx1 = APPNFT.sendMethod(方法名,gasLimit,支付元币,参数)
        // 例如转账
        const tx1 = APPNFT.sendMethod('transfer',0,0,'0x',100)

        // 获取元币余额
        const balanceOf2 = walletObj.
        
```
```

    开发者新增新合约

        1. abi目录放json文件
        2. config/abiList.json 新增一条数据
        3. config/contractAddress.json 写入合约地址
        4. 你也可以写一个自己的contract.js 写到contract/链 然后继承tron.js or ethereum.js
        5. 写自己的contract.js则使用 “myContract()” 对应的合约对象 

```