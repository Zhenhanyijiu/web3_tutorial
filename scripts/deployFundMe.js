// import ethers.js
// create main function
// execute main function


const { ethers } = require("hardhat");
async function main() {
    const timeLock = 60
    // create factory for the contract
    const fundMeFactory = await ethers.getContractFactory("FundMe");
    console.log("Deploying FundMe contract ...");
    //    deploy contract using the factory
    const fundMe = await fundMeFactory.deploy(timeLock);
    await fundMe.waitForDeployment()
    // wait for the deployment to finish
    // await fundMe.deployed();
    // log the address of the deployed contract
    console.log(`FundMe deployed successfully, contract address is: ${fundMe.target}`);
    // verify fundMe
    // if (hre.chainId) { }
    // const chainId = await hre.ethers.args.chainId
    const chainId = await ethers.provider.getNetwork().then(network => network.chainId);
    console.log(`=== Current chain ID: ${chainId}`);
    if (chainId == 11155111 && process.env.ETHERSCAN_API_KEY) {
        console.log("waiting for 3 blocks:")
        await fundMe.deploymentTransaction().wait(3);
        await verifyFundMe(fundMe.target, [timeLock]);
    } else {
        console.log("You are on a local network, contract verification is skipped.");
    }
    // init 2 accounts
    const [account1, account2] = await ethers.getSigners();
    console.log(`Account 1: ${account1.address}`);
    console.log(`Account 2: ${account2.address}`);
    // fund contract with first account
    const fundTx = await fundMe.fundMe({ value: ethers.parseEther("0.1") })
    await fundTx.wait();
    // check balance of contract
    const balanceOfContract = await ethers.provider.getBalance(fundMe.target);
    console.log(`Contract balance after funding: ${ethers.formatEther(balanceOfContract)} ETH`);
    // fund contract with second account
    const fundTx2 = await fundMe.connect(account2).fundMe({ value: ethers.parseEther("0.15") });
    await fundTx2.wait();
    // check balance of contract
    const balanceOfContract2 = await ethers.provider.getBalance(fundMe.target);
    console.log(`Contract balance after second funding: ${ethers.formatEther(balanceOfContract2)} ETH`);

    // check mapping fundersToAmount
    const balance1 = await fundMe.getFundersToAmount(account1.address)
    const balance2 = await fundMe.getFundersToAmount(account2.address)
    console.log(`Account 1 balance in contract: ${ethers.formatEther(balance1)} ETH`);
    console.log(`Account 2 balance in contract: ${ethers.formatEther(balance2)} ETH`);
    // 
    const sleepTime = 55 * 1000; //  seconds
    console.log(`Sleeping for ${sleepTime} ms before withdrawing...`);
    await sleep(sleepTime);
    const getFundTx = await fundMe.connect(account1).getFund()
    getFundTx.wait();
    console.log(`Account 1 getFund transaction hash: ${getFundTx.hash}`);
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