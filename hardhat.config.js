require("@nomicfoundation/hardhat-toolbox");
// require("dotenv").config();
require("@chainlink/env-enc").config();
// require("./tasks/deploy-fundme");
// require("./tasks/interact-fundme");
// 在 tasks 目录下的 index.js 里集中导入任务，替换上面两行
require("./tasks")
require("hardhat-deploy");
require("@nomicfoundation/hardhat-ethers");
require("hardhat-deploy");
require("hardhat-deploy-ethers");
const SEPOLIA_URL = process.env.SEPOLIA_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;
const PRIVATE_KEY_1 = process.env.PRIVATE_KEY_1;
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    solidity: "0.8.28",
    // 不写默认就是 hardhat
    defaultNetwork: "hardhat",
    mocha: {
        timeout: 500000 // 500 seconds max for running tests
    },
    networks: {
        sepolia: {
            // url 从第三方拿到，如 Infura 、Alchemy 、QuickNode 等
            // accounts 是你的钱包私钥，注意不要泄露
            // 此处使用 Alchemy 的 Sepolia 测试网络
            // https://www.alchemy.com/ 需要注册
            // QuickNode https://www.quicknode.com/,这里使用quicknode
            // url: "https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID",
            url: SEPOLIA_URL,
            // url: "https://alpha-autumn-pool.ethereum-sepolia.quiknode.pro/840d7b121a8141a3b4de75a7a6c4badce55b466e/",
            // 私钥账户
            accounts: [PRIVATE_KEY, PRIVATE_KEY_1],
            chainId: 11155111   // Sepolia chain ID 
        },

    },
    etherscan: {
        // apiKey: {
        //     sepolia: ETHERSCAN_API_KEY,
        //     // sepolia: "NRSKP3FCD3D1RTTUTTSH5J9WVEXXYCU9VJ"
        // }
        apiKey: ETHERSCAN_API_KEY,
    },
    namedAccounts: {
        firstAccount: {
            default: 0,//0表示数组 accounts 的第一个账户
        },
        secondAccount: {
            default: 1//1表示数组 accounts的第二个账户
        }
    },
    gasReporter: {
        enabled: true,
        // currency: "USD",
        // outputFile: "gas-report.txt",
        // noColors: true,
        // coinmarketcap: process.env.COINMARKETCAP_API_KEY,
        // token: "ETH"
    }
};
