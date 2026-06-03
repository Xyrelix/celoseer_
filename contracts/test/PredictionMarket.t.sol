// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../src/PredictionMarket.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockCUSD is ERC20 {
    constructor() ERC20("Celo Dollar", "cUSD") {}
    function mint(address to, uint256 amt) external { _mint(to, amt); }
}

contract PredictionMarketTest is Test {
    PredictionMarket pm;
    MockCUSD         cusd;

    address owner = address(this);
    address alice = makeAddr("alice");
    address bob   = makeAddr("bob");
    address carol = makeAddr("carol");

    uint256 CLOSE = block.timestamp + 1 hours;
    uint256 ONE   = 1e18;
    uint256 TEN   = 10e18;
    uint256 FIVE  = 5e18;

    function setUp() public {
        cusd = new MockCUSD();
        pm   = new PredictionMarket(address(cusd));

        for (address a = alice; a != address(0); ) {
            cusd.mint(a, 1000e18);
            vm.prank(a); cusd.approve(address(pm), type(uint256).max);
            if (a == alice) a = bob;
            else if (a == bob) a = carol;
            else break;
        }
    }

    // ─── createMarket ─────────────────────────────────────────────────────────

    function test_createMarket() public {
        uint256 id = pm.createMarket("Brazil to win?", CLOSE, false);
        assertEq(id, 1);
        (string memory q,,,,, , , ,) = pm.getMarket(1);
        assertEq(q, "Brazil to win?");
    }

    function test_createMarket_revertsPastCloseTime() public {
        vm.expectRevert(PredictionMarket.InvalidCloseTime.selector);
        pm.createMarket("Test?", block.timestamp - 1, false);
    }

    function test_createMarket_revertsNonOwner() public {
        vm.prank(alice);
        vm.expectRevert();
        pm.createMarket("Test?", CLOSE, false);
    }

    // ─── placeBet ─────────────────────────────────────────────────────────────

    function test_placeBet_recordsAndUpdatesPool() public {
        pm.createMarket("Test?", CLOSE, false);
        vm.prank(alice); pm.placeBet(1, PredictionMarket.Outcome.YES, TEN);

        (uint256 amt, PredictionMarket.Outcome outcome,) = pm.getBet(1, alice);
        assertEq(amt, TEN);
        assertEq(uint8(outcome), uint8(PredictionMarket.Outcome.YES));

        (,,,,, uint256 yesPool,, , uint256 totalPool) = pm.getMarket(1);
        assertEq(yesPool, TEN);
        assertEq(totalPool, TEN);
    }

    function test_placeBet_revertsBelow01() public {
        pm.createMarket("Test?", CLOSE, false);
        vm.prank(alice);
        vm.expectRevert(PredictionMarket.BelowMinimum.selector);
        pm.placeBet(1, PredictionMarket.Outcome.YES, 0.05e18);
    }

    function test_placeBet_revertsDoubleBet() public {
        pm.createMarket("Test?", CLOSE, false);
        vm.prank(alice); pm.placeBet(1, PredictionMarket.Outcome.YES, TEN);
        vm.prank(alice);
        vm.expectRevert(PredictionMarket.AlreadyBet.selector);
        pm.placeBet(1, PredictionMarket.Outcome.NO, TEN);
    }

    function test_placeBet_revertsDrawOnNonDrawMarket() public {
        pm.createMarket("Test?", CLOSE, false);
        vm.prank(alice);
        vm.expectRevert(PredictionMarket.DrawNotAvailable.selector);
        pm.placeBet(1, PredictionMarket.Outcome.DRAW, TEN);
    }

    function test_placeBet_acceptsDraw() public {
        pm.createMarket("Test?", CLOSE, true);
        vm.prank(alice); pm.placeBet(1, PredictionMarket.Outcome.DRAW, TEN);
        (uint256 amt,,) = pm.getBet(1, alice);
        assertEq(amt, TEN);
    }

    function test_placeBet_revertsAfterClose() public {
        pm.createMarket("Test?", CLOSE, false);
        vm.warp(CLOSE + 1);
        vm.prank(alice);
        vm.expectRevert(PredictionMarket.MarketClosed.selector);
        pm.placeBet(1, PredictionMarket.Outcome.YES, TEN);
    }

    // ─── resolveMarket + claimWinnings ────────────────────────────────────────

    function test_resolve_paysWinnersProportionally() public {
        pm.createMarket("Test?", CLOSE, false);

        // alice: 10 YES, bob: 10 YES, carol: 10 NO → total 30
        vm.prank(alice); pm.placeBet(1, PredictionMarket.Outcome.YES, TEN);
        vm.prank(bob);   pm.placeBet(1, PredictionMarket.Outcome.YES, TEN);
        vm.prank(carol); pm.placeBet(1, PredictionMarket.Outcome.NO,  TEN);

        uint256 ownerBefore = cusd.balanceOf(owner);
        pm.resolveMarket(1, PredictionMarket.Outcome.YES);

        // fee = 2% of 30 = 0.6 cUSD
        assertEq(cusd.balanceOf(owner) - ownerBefore, 0.6e18);

        // alice and bob split 29.4 cUSD = 14.7 each
        uint256 aliceBefore = cusd.balanceOf(alice);
        vm.prank(alice); pm.claimWinnings(1);
        assertEq(cusd.balanceOf(alice) - aliceBefore, 14.7e18);

        vm.prank(bob); pm.claimWinnings(1);

        // carol (NO) cannot claim
        vm.prank(carol);
        vm.expectRevert(PredictionMarket.DidNotWin.selector);
        pm.claimWinnings(1);
    }

    function test_resolve_revertsDoubleClaim() public {
        pm.createMarket("Test?", CLOSE, false);
        vm.prank(alice); pm.placeBet(1, PredictionMarket.Outcome.YES, TEN);
        pm.resolveMarket(1, PredictionMarket.Outcome.YES);
        vm.prank(alice); pm.claimWinnings(1);
        vm.prank(alice);
        vm.expectRevert(PredictionMarket.AlreadyClaimed.selector);
        pm.claimWinnings(1);
    }

    // ─── cancelMarket + claimRefund ───────────────────────────────────────────

    function test_cancel_refundsFullAmount() public {
        pm.createMarket("Test?", CLOSE, false);
        vm.prank(alice); pm.placeBet(1, PredictionMarket.Outcome.YES, TEN);

        uint256 before = cusd.balanceOf(alice);
        pm.cancelMarket(1);
        vm.prank(alice); pm.claimRefund(1);
        assertEq(cusd.balanceOf(alice) - before, TEN);
    }

    // ─── getOdds ──────────────────────────────────────────────────────────────

    function test_getOdds_reflectsPoolRatios() public {
        pm.createMarket("Test?", CLOSE, false);
        vm.prank(alice); pm.placeBet(1, PredictionMarket.Outcome.YES, TEN);  // YES 10
        vm.prank(bob);   pm.placeBet(1, PredictionMarket.Outcome.NO,  FIVE); // NO  5
        vm.prank(carol); pm.placeBet(1, PredictionMarket.Outcome.YES, FIVE); // YES 5

        (uint256 yesOdds, uint256 noOdds,) = pm.getOdds(1);
        // pool after fee = 20 * 0.98 = 19.6
        // YES pool = 15 → 19.6/15 * 1e4 = 13066
        // NO  pool = 5  → 19.6/5  * 1e4 = 39200
        assertApproxEqAbs(yesOdds, 13066, 5);
        assertApproxEqAbs(noOdds,  39200, 5);
    }

    // ─── fuzz ─────────────────────────────────────────────────────────────────

    function testFuzz_placeBet_amount(uint256 amt) public {
        amt = bound(amt, 0.1e18, 500e18);
        cusd.mint(alice, amt);
        pm.createMarket("Fuzz?", CLOSE, false);
        vm.prank(alice); pm.placeBet(1, PredictionMarket.Outcome.YES, amt);
        (uint256 stored,,) = pm.getBet(1, alice);
        assertEq(stored, amt);
    }
}
