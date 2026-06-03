// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "../src/PredictionMarket.sol";

contract CreateMarkets is Script {
    // Pass contract address via env: CONTRACT_ADDRESS=0x...
    function run() external {
        address contractAddr = vm.envAddress("CONTRACT_ADDRESS");
        PredictionMarket pm = PredictionMarket(contractAddr);

        vm.startBroadcast();

        // ── Tournament winner markets (no draw) ──────────────────────────────
        pm.createMarket("Argentina to Win World Cup 2026?",   1749657600, false); // 2026-06-11
        pm.createMarket("France to Win World Cup 2026?",      1749657600, false);
        pm.createMarket("England to Win World Cup 2026?",     1749657600, false);
        pm.createMarket("Brazil to Win World Cup 2026?",      1749657600, false);
        pm.createMarket("Spain to Win World Cup 2026?",       1749657600, false);
        pm.createMarket("USA to Reach Semi-Finals?",          1749657600, false);
        pm.createMarket("Morocco to Reach Quarter-Finals?",   1749657600, false);
        pm.createMarket("Final Match Over 2.5 Goals?",        1753574400, false); // 2026-07-27

        // ── Group stage match markets (draw available) ───────────────────────
        // Group A
        pm.createMarket("Argentina to beat Canada (Group A)", 1749672000, true);  // gA1
        pm.createMarket("Portugal to beat Argentina (Group A)",1749844800, true); // gA2
        pm.createMarket("Canada to beat Portugal (Group A)",  1750017600, true);  // gA3
        // Group B
        pm.createMarket("France to beat Mexico (Group B)",    1749758400, true);  // gB1
        pm.createMarket("Mexico to beat Germany (Group B)",   1749931200, true);  // gB2
        pm.createMarket("Germany to beat France (Group B)",   1750104000, true);  // gB3
        // Group C
        pm.createMarket("Brazil to beat Morocco (Group C)",   1749758400, true);  // gC1
        pm.createMarket("Morocco to beat Colombia (Group C)", 1749931200, true);  // gC2
        pm.createMarket("Colombia to beat Brazil (Group C)",  1750104000, true);  // gC3
        // Group D
        pm.createMarket("England to beat USA (Group D)",      1749844800, true);  // gD1
        pm.createMarket("USA to beat Netherlands (Group D)",  1750017600, true);  // gD2
        pm.createMarket("Netherlands to beat England (Group D)",1750190400, true); // gD3
        // Group E
        pm.createMarket("Spain to beat Japan (Group E)",      1749844800, true);  // gE1
        pm.createMarket("Japan to beat Uruguay (Group E)",    1750017600, true);  // gE2
        pm.createMarket("Uruguay to beat Spain (Group E)",    1750190400, true);  // gE3
        // Group F
        pm.createMarket("Belgium to beat Senegal (Group F)",  1749931200, true);  // gF1
        pm.createMarket("Senegal to beat Croatia (Group F)",  1750104000, true);  // gF2
        pm.createMarket("Croatia to beat Belgium (Group F)",  1750276800, true);  // gF3

        vm.stopBroadcast();

        console.log("Created 26 markets on contract:", contractAddr);
        console.log("Market count:", pm.marketCount());
    }
}
