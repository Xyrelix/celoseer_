// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/// @title CeloSeer Prediction Market
/// @notice Pool-based prediction market settled in cUSD on Celo
contract PredictionMarket is Ownable, ReentrancyGuard {

    IERC20 public immutable cUSD;

    uint256 public constant FEE_BPS = 200;    // 2% protocol fee
    uint256 public constant BPS     = 10_000;
    uint256 public constant MIN_BET = 0.1e18; // 0.1 cUSD

    // ─── Types ────────────────────────────────────────────────────────────────

    enum Outcome { YES, NO, DRAW }
    enum Status  { OPEN, RESOLVED, CANCELLED }

    struct Market {
        string    question;
        uint256   closeTime;
        Status    status;
        Outcome   result;
        bool      hasDraw;
        uint256[3] pools;   // [YES, NO, DRAW] in cUSD wei
        uint256   totalPool;
    }

    struct Bet {
        uint256 amount;
        Outcome outcome;
        bool    claimed;
    }

    // ─── State ────────────────────────────────────────────────────────────────

    uint256 public marketCount;
    mapping(uint256 => Market)                  public markets;
    mapping(uint256 => mapping(address => Bet)) public bets;

    // ─── Events ───────────────────────────────────────────────────────────────

    event MarketCreated  (uint256 indexed id, string question, uint256 closeTime, bool hasDraw);
    event BetPlaced      (uint256 indexed id, address indexed bettor, Outcome outcome, uint256 amount);
    event MarketResolved (uint256 indexed id, Outcome result);
    event MarketCancelled(uint256 indexed id);
    event WinningsClaimed(uint256 indexed id, address indexed bettor, uint256 payout);
    event RefundClaimed  (uint256 indexed id, address indexed bettor, uint256 amount);

    // ─── Errors ───────────────────────────────────────────────────────────────

    error InvalidCloseTime();
    error MarketNotOpen();
    error MarketClosed();
    error BelowMinimum();
    error DrawNotAvailable();
    error AlreadyBet();
    error TransferFailed();
    error NotResolved();
    error NotCancelled();
    error NoBet();
    error AlreadyClaimed();
    error DidNotWin();
    error MarketDoesNotExist();

    // ─── Constructor ──────────────────────────────────────────────────────────

    constructor(address _cUSD) Ownable(msg.sender) {
        require(_cUSD != address(0), "Invalid cUSD");
        cUSD = IERC20(_cUSD);
    }

    // ─── Admin ────────────────────────────────────────────────────────────────

    function createMarket(
        string calldata question,
        uint256 closeTime,
        bool hasDraw
    ) external onlyOwner returns (uint256 id) {
        if (closeTime <= block.timestamp) revert InvalidCloseTime();
        id = ++marketCount;
        markets[id].question  = question;
        markets[id].closeTime = closeTime;
        markets[id].status    = Status.OPEN;
        markets[id].hasDraw   = hasDraw;
        emit MarketCreated(id, question, closeTime, hasDraw);
    }

    function resolveMarket(uint256 id, Outcome result) external onlyOwner {
        Market storage m = _get(id);
        if (m.status != Status.OPEN)                  revert MarketNotOpen();
        if (result == Outcome.DRAW && !m.hasDraw)     revert DrawNotAvailable();

        m.status = Status.RESOLVED;
        m.result = result;

        uint256 fee = (m.totalPool * FEE_BPS) / BPS;
        if (fee > 0) {
            m.totalPool -= fee;
            if (!cUSD.transfer(owner(), fee)) revert TransferFailed();
        }
        emit MarketResolved(id, result);
    }

    function cancelMarket(uint256 id) external onlyOwner {
        Market storage m = _get(id);
        if (m.status != Status.OPEN) revert MarketNotOpen();
        m.status = Status.CANCELLED;
        emit MarketCancelled(id);
    }

    // ─── User actions ─────────────────────────────────────────────────────────

    function placeBet(uint256 id, Outcome outcome, uint256 amount) external nonReentrant {
        Market storage m = _get(id);
        if (m.status != Status.OPEN)                       revert MarketNotOpen();
        if (block.timestamp >= m.closeTime)                revert MarketClosed();
        if (amount < MIN_BET)                              revert BelowMinimum();
        if (outcome == Outcome.DRAW && !m.hasDraw)         revert DrawNotAvailable();
        if (bets[id][msg.sender].amount > 0)               revert AlreadyBet();

        if (!cUSD.transferFrom(msg.sender, address(this), amount)) revert TransferFailed();

        bets[id][msg.sender] = Bet({ amount: amount, outcome: outcome, claimed: false });
        m.pools[uint8(outcome)] += amount;
        m.totalPool             += amount;

        emit BetPlaced(id, msg.sender, outcome, amount);
    }

    function claimWinnings(uint256 id) external nonReentrant {
        Market storage m = _get(id);
        if (m.status != Status.RESOLVED) revert NotResolved();

        Bet storage b = bets[id][msg.sender];
        if (b.amount == 0)         revert NoBet();
        if (b.claimed)             revert AlreadyClaimed();
        if (b.outcome != m.result) revert DidNotWin();

        b.claimed = true;

        uint256 winPool = m.pools[uint8(m.result)];
        uint256 payout  = (b.amount * m.totalPool) / winPool;

        if (!cUSD.transfer(msg.sender, payout)) revert TransferFailed();
        emit WinningsClaimed(id, msg.sender, payout);
    }

    function claimRefund(uint256 id) external nonReentrant {
        Market storage m = _get(id);
        if (m.status != Status.CANCELLED) revert NotCancelled();

        Bet storage b = bets[id][msg.sender];
        if (b.amount == 0) revert NoBet();
        if (b.claimed)     revert AlreadyClaimed();

        uint256 refund = b.amount;
        b.claimed = true;

        if (!cUSD.transfer(msg.sender, refund)) revert TransferFailed();
        emit RefundClaimed(id, msg.sender, refund);
    }

    // ─── Views ────────────────────────────────────────────────────────────────

    /// @notice Live pool odds — returns multiplier * 1e4 (25000 = 2.5x)
    function getOdds(uint256 id) external view returns (
        uint256 yesOdds, uint256 noOdds, uint256 drawOdds
    ) {
        Market storage m = markets[id];
        if (m.totalPool == 0) return (0, 0, 0);
        uint256 pool = (m.totalPool * (BPS - FEE_BPS)) / BPS;
        yesOdds  = m.pools[0] > 0 ? (pool * 1e4) / m.pools[0] : 0;
        noOdds   = m.pools[1] > 0 ? (pool * 1e4) / m.pools[1] : 0;
        drawOdds = m.pools[2] > 0 ? (pool * 1e4) / m.pools[2] : 0;
    }

    function getMarket(uint256 id) external view returns (
        string memory question, uint256 closeTime, Status status, Outcome result,
        bool hasDraw, uint256 yesPool, uint256 noPool, uint256 drawPool, uint256 totalPool
    ) {
        Market storage m = markets[id];
        return (m.question, m.closeTime, m.status, m.result,
                m.hasDraw, m.pools[0], m.pools[1], m.pools[2], m.totalPool);
    }

    function getBet(uint256 id, address bettor) external view returns (
        uint256 amount, Outcome outcome, bool claimed
    ) {
        Bet storage b = bets[id][bettor];
        return (b.amount, b.outcome, b.claimed);
    }

    // ─── Internal ─────────────────────────────────────────────────────────────

    function _get(uint256 id) internal view returns (Market storage m) {
        m = markets[id];
        if (m.closeTime == 0) revert MarketDoesNotExist();
    }
}
