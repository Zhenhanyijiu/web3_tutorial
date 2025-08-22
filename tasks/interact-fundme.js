const { task } = require("hardhat/config");

task("interact-fundme", "Interact with the FundMe contract")
    .addParam("addr", "contract address")
    .setAction(async (args, hre) => {
        // attach to deployed contract,通过合约地址连接到已经部署的合约
        const fundMeFactory = await hre.ethers.getContractFactory("FundMe");
        const fundMe = await fundMeFactory.attach(args.addr);
        // init 2 accounts
        const [account1, account2] = await ethers.getSigners();
        console.log(`Account 1: ${account1.address}`);
        console.log(`Account 2: ${account2.address}`);
        console.log(`After create two accountd at: ${get_date().toLocaleString()}`);
        // fund contract with first account
        const fundTx = await fundMe.fundMe({ value: ethers.parseEther("0.1") })
        await fundTx.wait();
        console.log(`After account1 fundMe at: ${get_date().toLocaleString()}`);
        // check balance of contract
        const balanceOfContract = await ethers.provider.getBalance(fundMe.target);
        console.log(`Contract balance after funding: ${ethers.formatEther(balanceOfContract)} ETH`);
        console.log(`After account1 getBalance at: ${get_date().toLocaleString()}`);
        // fund contract with second account
        const fundTx2 = await fundMe.connect(account2).fundMe({ value: ethers.parseEther("0.15") });
        await fundTx2.wait();
        console.log(`After account2 fundMe at: ${get_date().toLocaleString()}`);
        // check balance of contract
        const balanceOfContract2 = await ethers.provider.getBalance(fundMe.target);
        console.log(`Contract balance after second funding: ${ethers.formatEther(balanceOfContract2)} ETH`);
        console.log(`After account2 getBalance at: ${get_date().toLocaleString()}`);

        // check mapping fundersToAmount
        const balance1 = await fundMe.getFundersToAmount(account1.address)
        const balance2 = await fundMe.getFundersToAmount(account2.address)
        console.log(`Account 1 balance in contract: ${ethers.formatEther(balance1)} ETH`);
        console.log(`Account 2 balance in contract: ${ethers.formatEther(balance2)} ETH`);
        console.log(`After getFundersToAmount at: ${get_date().toLocaleString()}`);
    });
function get_date() {
    return new Date();
}
// 通过 module.exports 导出任务
module.exports = {}