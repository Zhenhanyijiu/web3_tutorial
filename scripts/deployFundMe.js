// import ethers.js
// create main function
// execute main function

const { ethers } = require("hardhat");
async function main() {
    const timeLock = 120 + 30
    console.log(`FundMe contract lock time is set to ${timeLock} seconds`);
    // create factory for the contract
    console.log(`creating factory for FundMe contract at: ${get_date().toLocaleString()}`);
    const fundMeFactory = await ethers.getContractFactory("FundMe");
    //    deploy contract using the factory
    console.log("Deploying FundMe contract ...");
    const fundMe = await fundMeFactory.deploy(timeLock);
    await fundMe.waitForDeployment()
    // wait for the deployment to finish
    // await fundMe.deployed();
    // log the address of the deployed contract
    console.log(`FundMe deployed successfully, contract address is: ${fundMe.target}`);
    start = get_date();
    console.log(`After deploy FundMe at: ${start.toLocaleString()}`);
    const chainId = await ethers.provider.getNetwork().then(network => network.chainId);
    console.log(`=== Current chain ID: ${chainId},begin verifyFundMe`);
    if (chainId == 11155111 && process.env.ETHERSCAN_API_KEY) {
        console.log("waiting for 3 blocks:")
        await fundMe.deploymentTransaction().wait(3);
        await verifyFundMe(fundMe.target, [timeLock]);
    } else {
        console.log("You are on a local network, contract verification is skipped.");
    }
    console.log(`After verifyFundMe at: ${get_date().toLocaleString()}`);
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
    tPoint = get_date();
    // calculate time passed since deployment
    time_pass = tPoint - start;
    console.log(`Time passed since deployment: ${time_pass} ms`);
    // 
    const sleepTime = timeLock * 1000 - time_pass;
    console.log(`Sleeping for ${sleepTime} ms before getFund ...`);
    if (sleepTime < 0) {
        console.log("No need to sleep, time lock has already passed.");
    } else {
        const sleepTime2 = sleepTime + 1000
        await sleep(sleepTime2);
        console.log(`After sleep for ${sleepTime2} ms at: ${get_date().toLocaleString()}`);
    }
    console.log(`begin getFund ...`);
    const getFundTx = await fundMe.connect(account1).getFund()
    getFundTx.wait();
    console.log(`Account 1 getFund transaction hash: ${getFundTx.hash},at: ${get_date().toLocaleString()}`);
}
// verify fundMe
async function verifyFundMe(fundMeAddr, args) {
    // 在代码里运行命令行命令
    await hre.run("verify:verify", {
        address: fundMeAddr,
        constructorArguments: args,
    });
}
// 
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
function get_date() {
    return new Date();
}
// execute main function
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
// run the script using npx hardhat run scripts/deployFundMe.js --network goerli
// or npx hardhat run scripts/deployFundMe.js --network localhost
// or npx hardhat run scripts/deployFundMe.js --network sepolia
// or npx hardhat run scripts/deployFundMe.js --network mainnet         