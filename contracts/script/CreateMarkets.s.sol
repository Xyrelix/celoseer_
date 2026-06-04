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
        pm.createMarket("Argentina to Win World Cup 2026?",   1781193600, false); // 2026-06-11
        pm.createMarket("France to Win World Cup 2026?",      1781193600, false);
        pm.createMarket("England to Win World Cup 2026?",     1781193600, false);
        pm.createMarket("Brazil to Win World Cup 2026?",      1781193600, false);
        pm.createMarket("Spain to Win World Cup 2026?",       1781193600, false);
        pm.createMarket("USA to Reach Semi-Finals?",          1781193600, false);
        pm.createMarket("Morocco to Reach Quarter-Finals?",   1781193600, false);
        pm.createMarket("Final Match Over 2.5 Goals?",        1785110400, false); // 2026-07-27

        // ── Group stage match markets (draw available) ───────────────────────
        // Group A
        pm.createMarket("Argentina to beat Canada (Group A)", 1781208000, true);
        pm.createMarket("Portugal to beat Argentina (Group A)",1781380800, true);
        pm.createMarket("Canada to beat Portugal (Group A)",  1781553600, true);
        // Group B
        pm.createMarket("France to beat Mexico (Group B)",    1781294400, true);
        pm.createMarket("Mexico to beat Germany (Group B)",   1781467200, true);
        pm.createMarket("Germany to beat France (Group B)",   1781640000, true);
        // Group C
        pm.createMarket("Brazil to beat Morocco (Group C)",   1781294400, true);
        pm.createMarket("Morocco to beat Colombia (Group C)", 1781467200, true);
        pm.createMarket("Colombia to beat Brazil (Group C)",  1781640000, true);
        // Group D
        pm.createMarket("England to beat USA (Group D)",      1781380800, true);
        pm.createMarket("USA to beat Netherlands (Group D)",  1781553600, true);
        pm.createMarket("Netherlands to beat England (Group D)",1781726400, true);
        // Group E
        pm.createMarket("Spain to beat Japan (Group E)",      1781380800, true);
        pm.createMarket("Japan to beat Uruguay (Group E)",    1781553600, true);
        pm.createMarket("Uruguay to beat Spain (Group E)",    1781726400, true);
        // Group F
        pm.createMarket("Belgium to beat Senegal (Group F)",  1781467200, true);
        pm.createMarket("Senegal to beat Croatia (Group F)",  1781640000, true);
        pm.createMarket("Croatia to beat Belgium (Group F)",  1781812800, true);

        vm.stopBroadcast();

        console.log("Created 26 markets on contract:", contractAddr);
        console.log("Market count:", pm.marketCount());
    }
}
