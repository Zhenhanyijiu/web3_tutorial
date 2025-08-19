// import ethers.js
// create main function
// execute main function
const { ethers } = require("hardhat");
async function main() {
    // create factory for the contract
    const fundMeFactory = await ethers.getContractFactory("FundMe");
    console.log("Deploying FundMe contract...");
    //    deploy contract using the factory
    const fundMe = await fundMeFactory.deploy();
    await fundMe.waitForDeployment
    // wait for the deployment to finish
    // await fundMe.deployed();
    // log the address of the deployed contract
    console.log(`FundMe deployed successfully, contract address is: ${fundMe.address}`);
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