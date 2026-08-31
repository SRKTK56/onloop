// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title ON — ONLOOP の恩送り実績レコード
/// @notice 恩送りの確認ごとに発行される「積み上がる記録」。上限900,000。
///
/// 【重要】このトークンは譲渡できません。
///
/// 譲渡可能な ERC-20 をパブリックチェーンに置くと、発行者の意図と無関係に
/// 第三者が DEX で市場を作れてしまい、「不特定の者を相手方として購入・売却できる」
/// 状態が成立し得る。ONLOOP の価値は恩の連鎖が可視化されることであって
/// 通貨としての流通ではないため、譲渡そのものを実装レベルで塞いでいる。
///
/// 発行（mint）と本人による焼却（burn）だけを許可する。
contract OnToken is ERC20, Ownable {
    uint256 public constant MAX_SUPPLY = 900_000 * 10 ** 18;

    /// @notice 譲渡が試みられたときに返す
    error OnTokenNonTransferable();

    constructor(address initialOwner)
        ERC20("ON Record", "ON")
        Ownable(initialOwner)
    {}

    /// @notice 恩送り実績としてONを発行する（オーナーのみ）
    function mint(address to, uint256 amount) external onlyOwner {
        require(totalSupply() + amount <= MAX_SUPPLY, "ON: max supply exceeded");
        _mint(to, amount);
    }

    /// @notice 保有者が自分の記録を消す
    function burn(uint256 amount) external {
        _burn(msg.sender, amount);
    }

    /// @notice 現在の残り発行可能枚数
    function remainingSupply() external view returns (uint256) {
        return MAX_SUPPLY - totalSupply();
    }

    /// @dev 発行(from=0)と焼却(to=0)以外の移転をすべて拒否する
    function _update(address from, address to, uint256 value) internal override {
        if (from != address(0) && to != address(0)) revert OnTokenNonTransferable();
        super._update(from, to, value);
    }

    /// @dev 譲渡できない以上、承認は意味を持たないため塞ぐ
    function approve(address, uint256) public pure override returns (bool) {
        revert OnTokenNonTransferable();
    }
}
