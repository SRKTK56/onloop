// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/// @title ONLOOP NFT — 恩送りの連鎖から生まれたピクセルアートコレクション
contract OnLoopNFT is ERC721, Ownable {
    using Strings for uint256;

    uint256 public constant MAX_SUPPLY = 500;
    uint256 public constant MINT_PRICE = 0.0003 ether; // 約100円

    string  private _baseTokenURI;
    uint256 private _totalMinted;

    event Minted(address indexed to, uint256 indexed tokenId);

    constructor(string memory baseURI, address initialOwner)
        ERC721("ONLOOP", "ONL")
        Ownable(initialOwner)
    {
        _baseTokenURI = baseURI;
    }

    // ── ミント ────────────────────────────────────────────────

    /// @notice 1体ミント（誰でも可・0.0003ETH）
    function mint() external payable {
        require(_totalMinted < MAX_SUPPLY, "ONLOOP: sold out");
        require(msg.value >= MINT_PRICE,   "ONLOOP: insufficient payment");

        _totalMinted++;
        _safeMint(msg.sender, _totalMinted);
        emit Minted(msg.sender, _totalMinted);

        // 超過ETHを返金
        uint256 excess = msg.value - MINT_PRICE;
        if (excess > 0) payable(msg.sender).transfer(excess);
    }

    // ── メタデータ ────────────────────────────────────────────

    /// @notice tokenId → メタデータURL（4桁ゼロ埋め）
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_ownerOf(tokenId) != address(0), "ONLOOP: token does not exist");
        return string(abi.encodePacked(_baseTokenURI, _pad(tokenId), ".json"));
    }

    /// @dev 1 → "0001", 42 → "0042", 500 → "0500"
    function _pad(uint256 n) internal pure returns (string memory) {
        if (n < 10)   return string.concat("000", n.toString());
        if (n < 100)  return string.concat("00",  n.toString());
        if (n < 1000) return string.concat("0",   n.toString());
        return n.toString();
    }

    // ── ビュー ────────────────────────────────────────────────

    function totalMinted() external view returns (uint256) { return _totalMinted; }
    function remaining()   external view returns (uint256) { return MAX_SUPPLY - _totalMinted; }

    // ── オーナー操作 ──────────────────────────────────────────

    /// @notice ミント収益をオーナーに引き出す
    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "ONLOOP: no balance");
        payable(owner()).transfer(balance);
    }

    /// @notice Base URIの更新（メタデータ移行時に使用）
    function setBaseURI(string memory newBaseURI) external onlyOwner {
        _baseTokenURI = newBaseURI;
    }
}
