const DECIMALS = 8;
const INITIAL_ANSWER = 450000000000;  // 4500 * 10^8, 模拟 4500 美元
const deveplopmentChains = ["hardhat", "local"];
const LockTime = 150; //锁定时间 150 秒
const CONFIRMATION_NUM = 3; // 部署合约时等待的区块数
const networkConfig = {
    11155111: {
        name: "sepolia",
        ethUsdDataFeed: "0x694AA1769357215DE4FAC081bf1f309aDC325306"
    },
    31337: {
        name: "localhost",
        // 这里的地址是 MockV3Aggregator 部署后的地址
        ethUsdDataFeed: "0x5FbDB2315678afecb367f032d93F642f64180aa3"
    },
    97: {
        name: "bscTestnet",
        ethUsdDataFeed: "0x143db3CEEfbdfe5631aDD3E50f7614B6ba708BA7"
    }
};

// 导出这些常量，方便在部署脚本中使用
module.exports = {
    DECIMALS: DECIMALS,
    INITIAL_ANSWER: INITIAL_ANSWER,
    deveplopmentChains: deveplopmentChains,
    networkConfig: networkConfig,
    LockTime: LockTime,
    CONFIRMATION_NUM: CONFIRMATION_NUM,
};