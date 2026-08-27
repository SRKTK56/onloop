// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title ON Token — ONLOOP恩送りプロトコルのネイティブトークン
/// @notice 発行上限900,000枚。恩送りの確認ごとにMintされる。
contract OnToken is ERC20, Ownable {
    uint256 public constant MAX_SUPPLY = 900_000 * 10 ** 18;

    constructor(address initialOwner)
        ERC20("ON Token", "ON")
        Ownable(initialOwner)
    {}

    /// @notice 恩送り報酬としてトークンをMintする（オーナーのみ）
    function mint(address to, uint256 amount) external onlyOwner {
        require(totalSupply() + amount <= MAX_SUPPLY, "ON: max supply exceeded");
        _mint(to, amount);
    }

    /// @notice 現在の残り発行可能枚数
    function remainingSupply() external view returns (uint256) {
        return MAX_SUPPLY - totalSupply();
    }
}
