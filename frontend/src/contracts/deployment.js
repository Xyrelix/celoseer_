const deployment = {
  // Hardcoded fallback so the app works even when VITE_CONTRACT_ADDRESS isn't
  // set in the deploy env (e.g. Vercel). Override via .env to point elsewhere.
  address: import.meta.env.VITE_CONTRACT_ADDRESS ?? '0x91F8763B119CA7EC990ECCD0Db6A19ca13cAfDDa',
  cUSD:    import.meta.env.VITE_CUSD_ADDRESS    ?? '0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1',
  chainId: 11142220, // Celo Sepolia
  /* Maps frontend market ID → on-chain market ID (uint256).
   * On-chain creation order matches CreateMarkets.s.sol:
   * 1  Argentina to Win   2  France to Win    3  England to Win
   * 4  Brazil to Win      5  Spain to Win     6  USA Semi-Finals
   * 7  Morocco QF         8  Final Over 2.5   9-26 Group matches */
  marketMappings: {
    1: 1, // Argentina to Win
    2: 2, // France to Win
    3: 3, // England to Win
    4: 4, // Brazil to Win
    5: 6, // USA to Reach Semi-Finals (on-chain #6)
    6: 5, // Spain to Win (on-chain #5)
    7: 7, // Morocco to Reach QF (on-chain #7)
    8: 8, // Final Over 2.5 Goals
  },
  abi: [
    "function createMarket(string question, uint256 closeTime, bool hasDraw) returns (uint256)",
    "function placeBet(uint256 id, uint8 outcome, uint256 amount)",
    "function resolveMarket(uint256 id, uint8 result)",
    "function cancelMarket(uint256 id)",
    "function claimWinnings(uint256 id)",
    "function claimRefund(uint256 id)",
    "function getOdds(uint256 id) view returns (uint256 yesOdds, uint256 noOdds, uint256 drawOdds)",
    "function getMarket(uint256 id) view returns (string question, uint256 closeTime, uint8 status, uint8 result, bool hasDraw, uint256 yesPool, uint256 noPool, uint256 drawPool, uint256 totalPool)",
    "function getBet(uint256 id, address bettor) view returns (uint256 amount, uint8 outcome, bool claimed)",
    "function marketCount() view returns (uint256)",
    "event BetPlaced(uint256 indexed id, address indexed bettor, uint8 outcome, uint256 amount)",
    "event MarketResolved(uint256 indexed id, uint8 result)",
    "event WinningsClaimed(uint256 indexed id, address indexed bettor, uint256 payout)",
  ],
};

export default deployment;
