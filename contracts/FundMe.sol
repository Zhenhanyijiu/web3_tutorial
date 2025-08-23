// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

// import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";

// 0x5B38Da6a701c568545dCfcB03FcB875f56beddC4
// 0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2
// 0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db

// 1. 创建一个收款函数
// 2. 记录投资人并且查看
// 3. 在锁定期内，达到目标值，发起人可以提款
// 4. 在锁定期内，没有达到目标值，投资人在锁定期以后退款

contract FundMe {
    mapping(address => uint256) private fundersToAmount;
    address[] private funders;
    // uint256[] private amount;
    AggregatorV3Interface public dataFeed;
    // uint256 constant ETH_PRICE = 335885000000;//3358*10**8
    // 为了方便测试这里假设一个以太币是1000美元
    // uint256 constant ETH_PRICE = 1000 * 10 ** 8; //3358*10**8
    //每个参与者最少众筹 10 USD
    uint256 constant MINIMUM_VALUE = 10 * 10 ** 18;
    uint256 locktime;
    //总的众筹金额最少100 USD
    uint256 constant TARGET = 100 * 10 ** 18;
    address public owner;
    bool public getFundSuccess = false;
    address erc20Addr;

    constructor(uint256 _locktimes, address dataFeedAddr) {
        // 0x694AA1769357215DE4FAC081bf1f309aDC325306
        dataFeed = AggregatorV3Interface(dataFeedAddr);
        owner = msg.sender; //记录发起人地址
        // 从合约部署时间算起到，加上锁定时间，这段时间就是众筹期
        locktime = block.timestamp + _locktimes; //记录
    }

    // 这是一个收款函数,往合约里打钱address(this).balance
    function fundMe() external payable {
        // 目前每个人只能众筹一次
        require(fundersToAmount[msg.sender] == 0, "you have funded");
        // 限制众筹资金不能小于某个值，最少众筹10美元
        require(
            convertEthToUsd(msg.value) >= MINIMUM_VALUE,
            "you must send more ETH than 100 usd"
        );
        // 窗口关闭不能再众筹了
        require(
            block.timestamp <= locktime,
            "fund windows has closed,you cant found"
        );
        // 记录投资人的众筹资金并保存下来并能查看
        fundersToAmount[msg.sender] = msg.value;
        funders.push(msg.sender);
        // amount.push(msg.value);
    }

    // function getContractBlance()public view returns(uint256){
    //     require(msg.sender==owner,"not owner,can not view");
    //     return address(this).balance;
    // }
    function getFoundersToAmount()
        external
        view
        returns (address[] memory, uint256[] memory)
    {
        // require(msg.sender==owner,"not owner,can not view");
        // address[] memory _funder;
        uint256 length = funders.length;
        uint256[] memory _amount = new uint256[](length);
        for (uint256 i = 0; i < length; i++) {
            // _founder.push(funders[i]);
            _amount[i] = fundersToAmount[funders[i]];
        }
        return (funders, _amount);
    }

    function getFundersToAmount(
        address funder
    ) external view returns (uint256) {
        return fundersToAmount[funder];
    }

    // 只有erc20合约地址才能调用
    function setFundersToAmount(address funder, uint256 amountUpdate) external {
        require(
            msg.sender == erc20Addr,
            "you do not have permission to call this funtion"
        );
        fundersToAmount[funder] = amountUpdate;
    }

    // 提款,只有众筹到一定目标值的时候，发起人才能提款，只有owner才能提款
    function getFund() external {
        require(msg.sender == owner, "not owner,can not getFund");
        // 窗口关闭才能提款
        require(block.timestamp > locktime, "windows has not closed");
        // 如果没有达到目标值，说明这次众筹失败，不能提款
        require(
            convertEthToUsd(address(this).balance) >= TARGET,
            "you cant get fund, it has not reach target"
        );
        // payable (msg.sender).transfer(address(this).balance);
        // 将合约里的资金发送给提款人
        (bool success, ) = payable(msg.sender).call{
            value: address(this).balance
        }("");
        // 保证交易成功
        require(success, "transfer tx failed");
        fundersToAmount[msg.sender] = 0;
        getFundSuccess = true; // flag
        // address(this).balance=0;
    }

    // 退款，没有达到目标值，投资人可以退款
    function reFund() external {
        // 窗口关闭才能退
        require(block.timestamp > locktime, "windows has not closed");
        // 只有众筹过的人才能退款，且只能退款一次
        require(
            fundersToAmount[msg.sender] != 0,
            "you are not funder or have reFunded"
        );
        require(
            convertEthToUsd(address(this).balance) < TARGET,
            "it has reached target,you cant reFound"
        );
        // 将合约里的资金退还给投资人
        (bool suc, ) = payable(msg.sender).call{
            value: fundersToAmount[msg.sender]
        }("");
        require(suc, "transfer tx failed");
        // 退还成功，并将记录置为 0
        fundersToAmount[msg.sender] = 0;
    }

    function getChainlinkDataFeedLatestAnswer() public view returns (uint256) {
        // prettier-ignore
        (
            /* uint80 roundID */,
            int256 answer,
            /*uint startedAt*/,
            /*uint timeStamp*/,
            /*uint80 answeredInRound*/
        ) = dataFeed.latestRoundData();
        return uint256(answer);
        // return 335885000000;
    }

    function convertEthToUsd(
        uint256 ethAmount
    ) internal view returns (uint256) {
        uint256 ethPrice = uint256(getChainlinkDataFeedLatestAnswer());
        // uint256 ethPrice = ETH_PRICE;
        return (ethAmount * ethPrice) / (10 ** 8);
    }

    function setErc20Addr(address _erc20Addr) public {
        require(msg.sender == owner, "not owner,can not setErc20Addr");
        erc20Addr = _erc20Addr;
    }
}
