const { DECIMALS, INITIAL_ANSWER, deveplopmentChains } = require("../helper-hardhat-config");
module.exports = async ({ getNamedAccounts, deployments }) => {
    if (deveplopmentChains.includes(network.name)) {
        console.log("=== Hello this is a deploy mock function");
        const { deploy } = deployments;
        const { firstAccount } = await getNamedAccounts();
        console.log(`=== first Account is:${firstAccount}`);
        // 部署 MockV3Aggregator 合约
        // 传入两个参数，decimals 和 initialAnswer
        await deploy("MockV3Aggregator", {
            from: firstAccount,
            // 8 表示小数点后8位，200000000000表示2000美元，实际值是2000*10^8
            //  使用配置文件来初始化这些值，这样更灵活
            args: [DECIMALS, INITIAL_ANSWER],
            log: true,
        });
    }
    else {
        console.log("=== You are on a real network, no need to deploy mock");
    }
}
module.exports.tags = ["all", "mock"];