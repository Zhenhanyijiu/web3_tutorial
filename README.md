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
7. 验证的时候注意 etherscan 的延迟问题，解决办法是等待几个区块。
   

#### 合约交互脚本
请看 deployFundMe.js
合约交互的时候，两个账户众筹的资金存到了合约里，可以通过 getFund 在转到钱包里，保障测试代币重复利用。

#### hardhat task ，以任务的形式去部署合约、交互合约
1. 命令行中查看 task：npx hardhat help，会显示很多task（包括 run，compile，check，等）
2. 新建文件夹 tasks
3. 新建两个文件 deploy-fundme.js 和 interact-fundme.js
4. 具体如何导出任务请看上面两个文件代码，最后需要在 hardhat.config.js 中添加任务文件 require("./tasks/deploy-fundme");
5. 运行 npx hardhat help 就会发现任务 deploy-fundme 已经生成
6. 运行任务 npx hardhat deploy-fundme --network sepolia
7. fundMe 对象需要通过合约地址连接到已经部署的合约，请看 interact-fundme.js 代码
8. 将 interact-fundme 引入到 hardhat.config.js 中
9. 运行 npx hardhat help 检查是否含有任务 interact-fundme 
10. 也可以使用 tasks 中新建 index.js 文件集中导入，然后在 hardhat.config.js 中只引入./tasks文件夹即可。
11. 验证：
    - npx hardhat deploy-fundme --network sepolia
    - npx hardhat interact-fundme --addr 0x70761E2Bdfe9C3EaABeeEb0216972E9c99550D89 --network sepolia
    - 上面命令 --addr 是传入合约地址

## hardhat 开发框架: 合约测试
### hardhat 测试介绍
1. 浏览器中输入 mocha chai，mocha 是 js 的测试框架，chai 并不是测试框架，而是测试框架使用的一些功能，与 mocha 一起去使用。
2. 安装这两个包使用 npx 命令。不过这里 “@nomicfoundation/hardhat-toolbox” 已经给安装好了这两个包。
### 写第一个测试
对 FundMe.sol 写测试用例
1. 在 test 文件中新建 fundme.test.js，请看代码
2. 指定文件测试  npx hardhat test ./test/fundme.test.js

### hardhat deploy
hardhat 官网，请看插件 https://www.npmjs.com/package/hardhat-deploy
1. npm install -D hardhat-deploy，这里 -D 就是 --save-dev
2. 在 hardhat.config.js 中添加 require('hardhat-deploy')，这样就可以在 npx hardhat help 命令中显示 deploy 了。
3. 新建文件夹 deploy
4. 新建文件 01-deploy-fund-me.js, 01表示第一个被执行的
5. 运行 npx hardhat deploy --tags frank，由于 frank 标签不存在，所以就不会部署
6. npx hardhat deploy --tags all，all 标签存在，就会部署成功
7. 