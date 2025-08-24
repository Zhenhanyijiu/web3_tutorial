// function deployFunction() {
//     console.log("1 Hello this is a deploy function");
// }
// module.exports.default = deployFunction;

const { network } = require("hardhat");
const { deveplopmentChains, networkConfig, LockTime, CONFIRMATION_NUM } = require("../helper-hardhat-config");
// 上面注释掉的代码也可以简写如下
// module.exports = async (hre) => {
//     const deployments = hre.deployments; // 部署相关的功能
//     const getNamedAccounts = hre.getNamedAccounts; // 获取命名账户
//     console.log("2 Hello this is a deploy function");
// }
// 继续简写上面的代码如下
module.exports = async ({ getNamedAccounts, deployments }) => {
    // console.log("2 Hello this is a deploy function");
    // 对于 getNamedAccounts，需要在 hardhat.config.js 中配置 namedAccounts
    // 方便我们使用命名账户，而不是使用 index 号，请看 hardhat.config.js
    // const firstAccount = (await getNamedAccounts()).firstAccount;
    // {}的作用是等号右边有很多个属性时，只取需要的属性
    const { firstAccount } = await getNamedAccounts();
    console.log(`=== first Account is:${firstAccount}`);
    // const secondAccount = (await getNamedAccounts()).secondAccount;
    // console.log(`second Account is:${secondAccount}`);
    //{}的作用是等号右边有多个属性时，只取需要的属性
    // const deploy=deployments.deploy 
    const { deploy } = deployments;
    // 判断是否是本地环境还是 sepolia 测试网络
    // 有个问题是如果有多个本地网络，如何判断?这样 if 语句就很复杂了
    // 可以在 heilper-hardhat.config.js 里设置一个数组，包含所有网络的名字
    let dataFeedAddr;
    let confirm_num;
    if (deveplopmentChains.includes(network.name)) {
        // const mockDataFeed = await deployments.get("MockV3Aggregator")
        dataFeedAddr = (await deployments.get("MockV3Aggregator")).address
        confirm_num = 0; // 本地网络不需要等待区块确认

    } else {
        // dataFeedAddr = "0x694AA1769357215DE4FAC081bf1f309aDC325306"
        dataFeedAddr = networkConfig[network.config.chainId].ethUsdDataFeed
        confirm_num = CONFIRMATION_NUM;
    }

    // 部署 FundMe 合约
    const fundMe = await deploy("FundMe", {
        from: firstAccount,
        args: [LockTime, dataFeedAddr], // 构造函数的参数，这里假设锁定时间是150秒
        // 就不需要 await fundMe.deploymentTransaction().wait(3);
        // 如果是本地网络，CONFIRMATION_NUM 是0才行,否则会卡死
        waitConfirmations: confirm_num, // 部署后等待区块确认数
        log: true,
    }
    );
    // 如果想重新部署合约,需要删除deployments文件夹,或者运行命令 npx hardhat deploy --network sepolia --reset
    console.log(`=== FundMe deployed at ${fundMe.address} , ok`);
    // 部署完成后，进行合约验证
    if (network.config.chainId == 11155111 && process.env.ETHERSCAN_API_KEY) {
        // console.log("=== waiting for 3 blocks:")
        // await fundMe.deploymentTransaction().wait(3)
        // await fundMe.deploymentTransaction().wait(3);
        // await fundMe.transactionHash.wait(3);
        console.log("=== verifying fundMe contract ...");
        await hre.run("verify:verify", {
            address: fundMe.address,
            constructorArguments: [LockTime, dataFeedAddr],
        });
    } else {
        console.log("=== network is not sepolia, skip verify");
    }
}
// tags 可以用来指定执行哪些脚本
// 运行部署脚本的命令的时候加上 --tags fundme 或 --tags all，就可以运行这个脚本
// 如果不加 --tags 参数，则会运行 deploy 目录下的所有脚本
// 在fundme.test.js 里的 beforeEach 函数里可以添加 tags，这样测试前会先部署合约
module.exports.tags = ["all", "fundme", "fundme01"];

// 运行命令 npx hardhat deploy --tags fundme
// 运行命令 npx hardhat deploy --tags all
// 运行命令 npx hardhat deploy
