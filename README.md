# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a Hardhat Ignition module that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat ignition deploy ./ignition/modules/Lock.js
```
# sol_study

## remix 环境
- 测试网水龙头：[https://faucets.chain.link/](https://faucets.chain.link/)
- 喂价: [ETH/USD](https://docs.chain.link/data-feeds/getting-started)
- 继承 [ERC-20 合约](https://docs.openzeppelin.com/contracts/5.x/erc20)
  - [代码](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/ERC20.sol)
- 链上验证合约：https://sepolia.etherscan.io/
  -  将合约地址输入到搜索框中
  -  点击contract
  -  点击 Verfiy and Publish
  -  选择编译器类型 solidity (single file)
  -  选择编译器版本
  -  选择开源协议 MIT
  -  Enter the solidity contract code below
  -  Flatten 到同一个文件中
  -  然后就可以在线上调试合约了，说明代码是开源的，任何人都可以调试代码
  
## hardhat 环境
### 创建 hardhat 项目
1. mkdir web3_tutorial
2. 安装 nodejs：nvm install 22.10.0
3. 创建 npm 项目：npm init
4. 安装 hardhat ：npm install hardhat --save-dev 或 npm install hardhat@^2.22.2 --save-dev
5. 创建 hardhat 项目：npx hardhat
### 通过 hardhat 编译和部署合约 
1. [npm cache clean --force]
2. 安装 chainlink 包：npm install @chainlink/contracts --save-dev --registry=https://registry.npmmirror.com
3. 编译合约：npx hardhat compile (Compiled 2 Solidity files successfully (evm target: paris).)
4. 部署合约：
   - 创建 scripts 文件夹
   - 在 scripts 中新建 deployFundMe.js
   - [ether.js](https://docs.ethers.org/v6/getting-started/)
   - 写好这个 deployFundMe.js 脚本之后执行
   - npx hardhat run scripts/deployFundMe.js