const { assert } = require("chai");
const { ethers } = require("hardhat");
describe("test fundme contract", async function () {
    it("test if the owner is msg.sender", async function () {
        const [account1] = await ethers.getSigners();
        const fundMeFactory = await ethers.getContractFactory("FundMe");
        const fundMe = await fundMeFactory.deploy(150);
        await fundMe.waitForDeployment()
        const owner = await fundMe.owner();
        console.log(`owner is ${owner}, account1 is ${account1.address}`);
        assert.equal(owner, account1.address);
    })

    it("test if the dataFeed is assigned correctly", async function () {
        const fundMeFactory = await ethers.getContractFactory("FundMe");
        const fundMe = await fundMeFactory.deploy(150);
        await fundMe.waitForDeployment()
        const dataFeed = await fundMe.dataFeed();
        assert.equal(dataFeed, "0x694AA1769357215DE4FAC081bf1f309aDC325306");
    })
});