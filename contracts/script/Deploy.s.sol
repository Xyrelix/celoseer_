// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "../src/PredictionMarket.sol";

contract Deploy is Script {
    // cUSD addresses per chain
    function cUSDForChain(uint256 chainId) internal pure returns (address) {
        if (chainId == 44787)    return 0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1; // Alfajores
        if (chainId == 11142220) return 0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1; // Celo Sepolia (verify addr)
        if (chainId == 42220)    return 0x765DE816845861e75A25fCA122bb6898B8B1282a; // Celo mainnet
        revert("Unsupported chain");
    }

    function run() external {
        uint256 chainId = block.chainid;
        address cUSD    = cUSDForChain(chainId);

        console.log("Chain:", chainId);
        console.log("cUSD: ", cUSD);

        vm.startBroadcast();
        PredictionMarket pm = new PredictionMarket(cUSD);
        vm.stopBroadcast();

        console.log("PredictionMarket:", address(pm));
    }
}
