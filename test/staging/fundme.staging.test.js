const { assert, expect } = require("chai");
const { ethers, deployments, getNamedAccounts } = require("hardhat");
// const helpers = require("@nomicfoundation/hardhat-network-helpers");
const { LockTime, deveplopmentChains } = require("../../helper-hardhat-config");

deveplopmentChains.includes(network.name)
    ? describe.skip
    : describe("test fundme contract", async function () {
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

        // test fundMe and getFund successfully
        // test fundMe and reFund successfully
        it("fundMe and reFund successfully", async function () {
            // 确保众筹资金达到目标值
            await fundMe.fundMe({ value: ethers.parseEther("0.1") })
            // 确保众筹窗口关闭
            await new Promise(resolve => setTimeout(resolve, (LockTime + 1) * 1000));
            // 考虑网络延迟，可以增加下面的代码，先拿到交易
            const getFundTx = await fundMe.getFund();
            // 确保交易上链，拿到回执
            const receipt = await getFundTx.wait();
            expect(receipt).to.emit(fundMe, "FundWithdrawByOwner").withArgs(ethers.parseEther("0.1"));
        });
        it("fundMe and reFund successfully", async function () {
            // 确保众筹资金未达到目标值
            await fundMe.fundMe({ value: ethers.parseEther("0.01") })
            // 确保众筹窗口关闭
            await new Promise(resolve => setTimeout(resolve, (LockTime + 1) * 1000));
            // 考虑网络延迟，可以增加下面的代码，先拿到交易
            const reFundTx = await fundMe.reFund();
            // 确保交易上链，拿到回执
            const receipt = await reFundTx.wait();
            expect(receipt).to.emit(fundMe, "RefundByFunder").withArgs(firstAccount, ethers.parseEther("0.01"));
        });
    });