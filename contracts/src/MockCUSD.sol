// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @notice Testnet stand-in for cUSD (18 decimals). Minting is owner-gated so the
///         backend signer funds users who have no gas of their own. Includes a
///         one-time welcome deposit and an arbitrary mint for the faucet page.
contract MockCUSD is ERC20, Ownable {
    uint256 public constant WELCOME_AMOUNT = 500e18; // one-time signup bonus

    mapping(address => bool) public welcomed;

    event Welcomed(address indexed user, uint256 amount);

    constructor() ERC20("Celo Dollar", "cUSD") Ownable(msg.sender) {}

    /// @notice One-time 500 cUSD deposit for a new user. Idempotent per address.
    function welcome(address user) external onlyOwner {
        require(!welcomed[user], "already welcomed");
        welcomed[user] = true;
        _mint(user, WELCOME_AMOUNT);
        emit Welcomed(user, WELCOME_AMOUNT);
    }

    /// @notice Mint an arbitrary amount (faucet page top-ups).
    function mint(address to, uint256 amt) external onlyOwner {
        _mint(to, amt);
    }
}
