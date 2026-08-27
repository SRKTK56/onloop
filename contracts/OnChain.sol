// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/// @title OnChain — ONLOOP恩送り連鎖の永久記録コントラクト
/// @notice 恩送りの「誰が・誰に・何を」という連鎖構造をBase上に刻む
contract OnChain is Ownable {

    struct ChainNode {
        uint256 chainId;
        uint256 position;
        address giverWallet;
        address receiverWallet;
        bytes32 descriptionHash; // keccak256(description) — 本文はオフチェーンで参照
        uint256 createdAt;
        uint256 confirmedAt;
        bool confirmed;
    }

    /// chainId => ノード配列
    mapping(uint256 => ChainNode[]) private _nodes;

    /// chainId => 起点者ウォレット
    mapping(uint256 => address) public chainOrigin;

    // ── イベント ────────────────────────────────────────────────
    event ChainCreated(uint256 indexed chainId, address indexed origin);

    event NodeAdded(
        uint256 indexed chainId,
        uint256 position,
        address indexed giver,
        address indexed receiver,
        bytes32 descriptionHash
    );

    event NodeConfirmed(
        uint256 indexed chainId,
        uint256 position,
        address indexed giver,
        address indexed receiver
    );

    event LoopCompleted(
        uint256 indexed chainId,
        uint256 participantCount
    );

    constructor(address initialOwner) Ownable(initialOwner) {}

    // ── 書き込み（オーナー専用）────────────────────────────────

    /// @notice 恩送りノードをチェーンに追加する
    /// @param chainId      DBのchain.id
    /// @param originWallet 起点者のウォレット（position=0のときのみ使用）
    /// @param position     チェーン内の順番（0始まり）
    /// @param giver        恩送りを行う人
    /// @param receiver     恩送りを受け取る人
    /// @param description  恩送りの内容（平文 — コントラクト内でハッシュ化して保存）
    function recordNode(
        uint256 chainId,
        address originWallet,
        uint256 position,
        address giver,
        address receiver,
        string calldata description
    ) external onlyOwner {
        if (position == 0) {
            chainOrigin[chainId] = originWallet;
            emit ChainCreated(chainId, originWallet);
        }

        bytes32 descHash = keccak256(abi.encodePacked(description));

        _nodes[chainId].push(ChainNode({
            chainId:         chainId,
            position:        position,
            giverWallet:     giver,
            receiverWallet:  receiver,
            descriptionHash: descHash,
            createdAt:       block.timestamp,
            confirmedAt:     0,
            confirmed:       false
        }));

        emit NodeAdded(chainId, position, giver, receiver, descHash);
    }

    /// @notice 恩送りの完了を記録する
    /// @param chainId  DBのchain.id
    /// @param position 確認するノードの順番
    /// @param isLoop   この確認でループが完成したか
    function confirmNode(
        uint256 chainId,
        uint256 position,
        bool isLoop
    ) external onlyOwner {
        require(position < _nodes[chainId].length, "OnChain: node not found");
        ChainNode storage node = _nodes[chainId][position];
        require(!node.confirmed, "OnChain: already confirmed");

        node.confirmed    = true;
        node.confirmedAt  = block.timestamp;

        emit NodeConfirmed(chainId, position, node.giverWallet, node.receiverWallet);

        if (isLoop) {
            emit LoopCompleted(chainId, _nodes[chainId].length);
        }
    }

    // ── 読み取り ────────────────────────────────────────────────

    function getNodes(uint256 chainId) external view returns (ChainNode[] memory) {
        return _nodes[chainId];
    }

    function getNode(uint256 chainId, uint256 position) external view returns (ChainNode memory) {
        return _nodes[chainId][position];
    }

    function getChainLength(uint256 chainId) external view returns (uint256) {
        return _nodes[chainId].length;
    }

    function getConfirmedCount(uint256 chainId) external view returns (uint256 count) {
        ChainNode[] storage nodes = _nodes[chainId];
        for (uint256 i = 0; i < nodes.length; i++) {
            if (nodes[i].confirmed) count++;
        }
    }
}
