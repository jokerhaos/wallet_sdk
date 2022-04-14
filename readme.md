```

    使用扩展，项目需要两个env变量

        WALLET_ENV = '环境' //默认dev dev or prod
        VUE_APP_BLOCKCHAIN='' //默认tron tron or ethereum or binance

        // 扩展会根据环境变量自动调用对应环境的钱包

        import walletObj from 'j_wallet_sdk'

        // 加载合约
        const APENFT = await walletObj.newContract('apenft')
        // 或者使用
        const APENFT = await walletObj.getContract('apenft')

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
    开发者采用自己的abi和合约继承

        walletObj.setConfig({
            box: "@/abi/box.json",
        }, {
            dev: {
                tron: { box: 'xxx },
                ethereum: { box: 'xxx },
                binance: { box: 'xxx }
            },
            prod: {
                tron: { box: 'xxx },
                ethereum: { box: 'xxx },
                binance: { box: 'xxx }
            }
        }, '@/contract')

        1.采用自己的配置，需要先执行setConfig
        2.然后就可以调用合约方法了~
```

```

    开发者新增新合约

        1. abi目录放json文件
        2. config/abiList.json 新增一条数据
        3. config/contractAddress.json 写入合约地址
        4. 你也可以写一个自己的contract.js 写到contract/链 然后继承tron.js or ethereum.js
        5. 写自己的contract.js则使用 “getContract()” 对应的合约对象 

```