// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "../src/PredictionMarket.sol";
import "../src/MockCUSD.sol";

contract Deploy is Script {
    // Real cUSD per chain (mainnet only). Testnets deploy a fresh MockCUSD.
    function realCUSD(uint256 chainId) internal pure returns (address) {
        if (chainId == 42220) return 0x765DE816845861e75A25fCA122bb6898B8B1282a; // Celo mainnet
        return address(0); // testnet → deploy MockCUSD
    }

    function run() external {
        uint256 chainId = block.chainid;
        console.log("Chain:", chainId);

        vm.startBroadcast();

        address cUSD = realCUSD(chainId);
        if (cUSD == address(0)) {
            MockCUSD mock = new MockCUSD();
            cUSD = address(mock);
            console.log("MockCUSD: ", cUSD);
        } else {
            console.log("cUSD:     ", cUSD);
        }

        PredictionMarket pm = new PredictionMarket(cUSD);
        console.log("PredictionMarket:", address(pm));

        vm.stopBroadcast();
    }
}
