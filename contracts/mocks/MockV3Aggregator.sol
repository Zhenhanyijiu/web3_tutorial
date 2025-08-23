// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.26;
// 导入这个 MockV3Aggregator 合约时遇到不少困难，因为原先的路径变化了，最后在 node_modules 里找到了正确的路径
import "@chainlink/contracts/src/v0.8/shared/mocks/MockV3Aggregator.sol";
