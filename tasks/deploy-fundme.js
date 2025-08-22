const { task } = require("hardhat/config");
task("deploy-fundme", "Deploys the FundMe contract").setAction(async (args, hre) => {
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
});

// verify fundMe
async function verifyFundMe(fundMeAddr, args) {
    // 在代码里运行命令行命令
    await hre.run("verify:verify", {
        address: fundMeAddr,
        constructorArguments: args,
    });
}

function get_date() {
    return new Date();
}
// 通过 module.exports 导出任务
module.exports = {}