// function deployFunction() {
//     console.log("1 Hello this is a deploy function");
// }
// module.exports.default = deployFunction;

// 上面注释掉的代码也可以简写如下
// module.exports = async (hre) => {
//     const deployments = hre.deployments; // 部署相关的功能
//     const getNamedAccounts = hre.getNamedAccounts; // 获取命名账户
//     console.log("2 Hello this is a deploy function");
// }
// 继续简写上面的代码如下
module.exports = async ({ getNamedAccounts, deployments }) => {
    console.log("2 Hello this is a deploy function");
    // 对于 getNamedAccounts，需要在 hardhat.config.js 中配置 namedAccounts
    // 方便我们使用命名账户，而不是使用 index 号，请看 hardhat.config.js
    // const firstAccount = (await getNamedAccounts()).firstAccount;
    // {}的作用是等号右边有很多个属性时，只取需要的属性
    const { firstAccount } = await getNamedAccounts();
    console.log(`first Account is:${firstAccount}`);
    // const secondAccount = (await getNamedAccounts()).secondAccount;
    // console.log(`second Account is:${secondAccount}`);
    //{}的作用是等号右边有多个属性时，只取需要的属性
    // const deploy=deployments.deploy 
    const { deploy } = deployments;
    // 部署 FundMe 合约
    await deploy("FundMe", {
        from: firstAccount,
        args: [150], // 构造函数的参数，这里假设锁定时间是150秒
        waitConfirmations: 1,
        log: true,
    }
    );

}
// tags 可以用来指定执行哪些脚本
// 运行部署脚本的命令的时候加上 --tags fundme 或 --tags all，就可以运行这个脚本
// 如果不加 --tags 参数，则会运行 deploy 目录下的所有脚本
// 在fundme.test.js 里的 beforeEach 函数里可以添加 tags，这样测试前会先部署合约
module.exports.tags = ["all", "fundme", "fundme01"];

// 运行命令 npx hardhat deploy --tags fundme
// 运行命令 npx hardhat deploy --tags all
// 运行命令 npx hardhat deploy
