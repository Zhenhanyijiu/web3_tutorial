const { assert, expect } = require("chai");
const { ethers, deployments, getNamedAccounts } = require("hardhat");
const helpers = require("@nomicfoundation/hardhat-network-helpers");
describe("test fundme contract", async function () {
    let firstAccount;
    let fundMe
    let fundMeSecondAccount
    let secondAccount
    let mockV3Aggregator
    // 每次测试前先部署合约，beforeEach 里的函数会在每个 it 函数前运行
    // 这里可以简化下面it函数里重复的部署代码
    beforeEach(async function () {
        // 意思是部署所有带有 all 标签的合约
        // 使用我们写的deploy中01-deploy-fund-me.js脚本
        await deployments.fixture(["all"]);
        firstAccount = (await getNamedAccounts()).firstAccount;
        secondAccount = (await getNamedAccounts()).secondAccount;
        const fundMeDeployment = await deployments.get("FundMe")
        fundMe = await ethers.getContractAt("FundMe", fundMeDeployment.address);
        fundMeSecondAccount = await ethers.getContract("FundMe", secondAccount)
        mockV3Aggregator = await deployments.get("MockV3Aggregator")
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
        assert.equal(dataFeed, mockV3Aggregator.address);
    })
    // fundMe 函数,getFund 函数,reFund 函数
    // unit test for fundMe
    // window open,value > minmum,value balance updated
    it("window closed,value > minmum,fundMe faild", async function () {
        // 模拟时间流逝 160 秒,确保众筹窗口关闭
        await helpers.time.increase(160);
        // 通过挖矿来模拟时间流逝
        await helpers.mine();
        // 预计会失败，虽然金额正确,但是窗口关闭了
        await expect(fundMe.fundMe({ value: ethers.parseEther("0.01") }))
            .to.be.revertedWith("windows is closed");

    });
    it("window open,value < minmum,fundMe faild", async function () {
        // 预计会失败，窗口开着但金额不足
        await expect(fundMe.fundMe({ value: ethers.parseEther("0.001") }))
            .to.be.revertedWith("send more ETH");
    });
    it("window open,value > minmum,fundMe success", async function () {
        // 预计会成功,窗口开着且金额足够
        await fundMe.fundMe({ value: ethers.parseEther("0.01") });
        const amount = await fundMe.getFundersToAmount(firstAccount);
        await assert.equal(amount.toString(), ethers.parseEther("0.01").toString());
        await expect(amount).to.equal(ethers.parseEther("0.01"));
    });
    // unit test for getFund
    // onlyowner,window closed,balance>target
    it("not owner, window closed,balance>target, getFund failed", async function () {
        // 先众筹一些钱进去
        await fundMe.fundMe({ value: ethers.parseEther("0.1") });
        // 模拟时间流逝 160 秒,确保众筹窗口关闭
        await helpers.time.increase(160);
        // 通过挖矿来模拟时间流逝
        await helpers.mine();
        // 预计会失败,因为不是owner
        await expect(fundMeSecondAccount.getFund())
            .to.be.revertedWith("not the owner");
    });
});