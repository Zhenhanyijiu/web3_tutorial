const { assert } = require("chai");
const { ethers, deployments, getNamedAccounts } = require("hardhat");
describe("test fundme contract", async function () {
    let firstAccount;
    let fundMe
    // 每次测试前先部署合约，beforeEach 里的函数会在每个 it 函数前运行
    // 这里可以简化下面it函数里重复的部署代码
    beforeEach(async function () {
        // 意思是部署所有带有 all 标签的合约
        // 使用我们写的deploy中01-deploy-fund-me.js脚本
        await deployments.fixture(["all"]);
        firstAccount = (await getNamedAccounts()).firstAccount;
        const fundMeDeployment = await deployments.get("FundMe")
        fundMe = await ethers.getContractAt("FundMe", fundMeDeployment.address);
    })
    it("test if the owner is msg.sender", async function () {
        // const [firstAccount] = await ethers.getSigners();
        // const fundMeFactory = await ethers.getContractFactory("FundMe");
        // const fundMe = await fundMeFactory.deploy(150);
        await fundMe.waitForDeployment()
        const owner = await fundMe.owner();
        // console.log(`owner is ${owner}, firstAccount is ${firstAccount.address}`);
        console.log(`owner is ${owner}, firstAccount is ${firstAccount}`);
        assert.equal(owner, firstAccount);
    })

    it("test if the dataFeed is assigned correctly", async function () {
        // const fundMeFactory = await ethers.getContractFactory("FundMe");
        // const fundMe = await fundMeFactory.deploy(150);
        await fundMe.waitForDeployment()
        const dataFeed = await fundMe.dataFeed();
        assert.equal(dataFeed, "0x694AA1769357215DE4FAC081bf1f309aDC325306");
    })
});