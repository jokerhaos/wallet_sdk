
exports.sleep = async (s) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, s * 1000);
    })
}
/**
 * 获取UUID
 * @returns uuid
 */
exports.getUUID = function () {
    return `${new Date().getTime()}-${Math.round(Math.random() * 9)}${Math.round(Math.random() * 9)}${Math.round(Math.random() * 9)}${Math.round(Math.random() * 9)}`;
}



/**
 * Math.random();                  //0.0 ~ 1.0 之间的一个伪随机数。【包含0不包含1】 //比如0.8647578968666494
 * Math.ceil(Math.random()*10);    // 获取从1到10的随机整数 ，取0的概率极小。
 * Math.round(Math.random());      //可均衡获取0到1的随机整数。
 * Math.floor(Math.random()*10);   //可均衡获取0到9的随机整数。
 * Math.round(Math.random()*10);   //基本均衡获取0到10的随机整数，其中获取最小值0和最大值10的几率少一半。
 * 中级概率
 */
exports.probability = function (arr) {
    let total = arr.reduce((prev, curr) => { return prev + curr }); //概率总和
    if (total <= 0)
        return false;
    for (let i = 0; i < arr.length; i++) {
        const randNum = Math.ceil(Math.random() * total);
        if(randNum <= arr[i]){
            return i;
        }
        //大于随机值则--
        total -= arr[i];
    }
}