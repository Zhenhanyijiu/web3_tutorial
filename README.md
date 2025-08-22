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
   - npx hardhat run scripts/deployFundMe.js(此时会出错Error: incorrect number of arguments to constructor，即部署合约的时候没有穿参数)
   - 加上参数部署成功，此时是部署到一个本地网路上了，显示如下
   ```
    Deploying FundMe contract...
    FundMe deployed successfully, contract address is: 0x5FbDB2315678afecb367f032d93F642f64180aa3
   ```
#### hardhat 网络和私钥配置
如何部署到测试网络上？

1. hardhat 官方[文档](https://v2.hardhat.org/docs)，General overview->hardhat network
2. 网络配置在hardhat.config.js中
3. 请看 hardhat.config.js 配置详情
4. npx hardhat run scripts/deployFundMe.js --network sepolia ，这样就部署成功了
   ```
    Deploying FundMe contract...
    FundMe deployed successfully, contract address is:      0x257484bD12B1062a00a91d5A7Ba213b2fBc00ffF
   ```
5. 这里有不合理的地方，账户处的私钥暴露
#### .env 文件
1. 创建 .env 文件
2. npm install --save-dev dotenv
3. 解析环境变量，请看 hardhat.config.js

#### .env.enc
1. npm install --save-dev @chainlink/env-enc  
2. npx env-enc set-pw 设置密码
3. npx env-enc set 设置变量

#### hardhat verfiy
1. hardhat 官方文档找到这个插件 [@nomicfoundation/hardhat-verify](https://v2.hardhat.org/hardhat-runner/plugins/nomicfoundation-hardhat-verify)
2. 注册 etherscan 并生成一个apikey
3. 在 hardhat.config.js 中添加 etherscan 配置。
4. 使用命令行验证 npx hardhat verify --network sepolia 0xB0bAAba0e05825681B410C0fde0DE29ee2C3223E "120"，后面跟的是合约地址以及部署合约所用的参数。运行成功后能在etherscan上发现有代码已经上传
5. 也可以在脚本里写代码进行验证,请看 deployFundMe.js 脚本
6. npx hardhat run scripts/deployFundMe.js --network sepolia

#### 合约交互脚本
请看 deployFundMe.js