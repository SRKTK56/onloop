"use client"

import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt, useChainId, useSwitchChain } from "wagmi"
import { readContractQueryOptions } from "wagmi/query"
import { base } from "wagmi/chains"
import { useQueryClient } from "@tanstack/react-query"
import { useConfig } from "wagmi"
import { WalletButton } from "@/components/shared/WalletButton"
import { NFT_CONTRACT_ADDRESS, NFT_ABI, MAX_SUPPLY, MINT_PRICE, nftImageUrl } from "@/lib/web3/nft"
import { useState } from "react"
import Link from "next/link"

const SAMPLE_STAGES = [
  { num: 8, label: "🚀 宇宙",   rarity: "Legendary", accent: "#9b5de5", count: 25,  pct: "5%" },
  { num: 7, label: "🌐 地球",   rarity: "Epic",      accent: "#48cae4", count: 30,  pct: "6%" },
  { num: 6, label: "🌍 世界",   rarity: "Rare",      accent: "#4361ee", count: 45,  pct: "9%" },
  { num: 5, label: "🗽 欧米",   rarity: "Rare",      accent: "#90e0ef", count: 55,  pct: "11%" },
  { num: 4, label: "🌏 アジア", rarity: "Uncommon",  accent: "#f9c74f", count: 65,  pct: "13%" },
  { num: 3, label: "🗼 日本",   rarity: "Uncommon",  accent: "#e63946", count: 80,  pct: "16%" },
  { num: 2, label: "🏘️ 街",     rarity: "Common",    accent: "#f4a261", count: 90,  pct: "18%" },
  { num: 1, label: "🌱 村",     rarity: "Common",    accent: "#52b788", count: 110, pct: "22%" },
]

// サンプル表示用トークンID（各ステージから1体ずつ）
const PREVIEW_IDS = [476, 421, 376, 316, 236, 156, 76, 1]

export function MintSection() {
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  const config = useConfig()
  const queryClient = useQueryClient()
  const { switchChainAsync, isPending: isSwitching } = useSwitchChain()
  const isWrongNetwork = isConnected && chainId !== base.id
  const [mintedId, setMintedId] = useState<number | null>(null)

  const { data: totalMinted } = useReadContract({
    address: NFT_CONTRACT_ADDRESS,
    abi:     NFT_ABI,
    functionName: "totalMinted",
  })
  const { data: remaining } = useReadContract({
    address: NFT_CONTRACT_ADDRESS,
    abi:     NFT_ABI,
    functionName: "remaining",
  })

  function invalidateMintQueries() {
    queryClient.invalidateQueries({
      queryKey: readContractQueryOptions(config, {
        address: NFT_CONTRACT_ADDRESS,
        abi:     NFT_ABI,
        functionName: "totalMinted",
      }).queryKey,
    })
    queryClient.invalidateQueries({
      queryKey: readContractQueryOptions(config, {
        address: NFT_CONTRACT_ADDRESS,
        abi:     NFT_ABI,
        functionName: "remaining",
      }).queryKey,
    })
  }

  const { writeContract, data: txHash, isPending, error: writeError, reset: resetWrite } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash: txHash })

  async function handleMint() {
    // ミント前にトークンIDを確定（送信前のtotalMinted + 1）
    const expectedId = totalMinted ? Number(totalMinted) + 1 : null
    setMintedId(expectedId)

    if (chainId !== base.id) {
      try {
        await switchChainAsync({ chainId: base.id })
      } catch {
        setMintedId(null)
        return
      }
    }
    writeContract({
      address:  NFT_CONTRACT_ADDRESS,
      abi:      NFT_ABI,
      functionName: "mint",
      value:    MINT_PRICE,
      gas:      BigInt(200000),
    }, {
      onSuccess: () => { invalidateMintQueries() },
      onError:   () => { setMintedId(null) },
    })
  }

  const minted    = totalMinted ? Number(totalMinted) : 0
  const remain    = remaining   ? Number(remaining)   : MAX_SUPPLY
  const soldOut   = remain === 0
  const pct       = Math.round((minted / MAX_SUPPLY) * 100)
  const isBusy    = isPending || isConfirming || isSwitching

  return (
    <div className="space-y-8">

      {/* ── ヘッダー ── */}
      <div className="pixel-box p-6" style={{ background: "#0f1628" }}>
        <div className="flex items-start justify-between flex-wrap gap-4 mb-5">
          <div>
            <p className="font-pixel text-[0.72rem] mb-1" style={{ color: "#0052FF" }}>ONLOOP NFT COLLECTION</p>
            <h2 className="font-ja font-bold text-xl" style={{ color: "#e0e8ff" }}>恩送りの連鎖が宿るNFT</h2>
            <p className="font-ja text-sm mt-1" style={{ color: "#7090a8" }}>ミントするたびにステージがランダムに決まる</p>
          </div>
          <div className="text-right">
            <p className="font-pixel" style={{ fontSize: "1.6rem", color: "#0052FF", textShadow: "2px 2px 0 #fff" }}>
              {remain}
            </p>
            <p className="font-pixel text-[0.72rem]" style={{ color: "#506070" }}>/ {MAX_SUPPLY} REMAINING</p>
          </div>
        </div>

        {/* プログレスバー */}
        <div className="h-3 w-full" style={{ background: "#1a2a3a", border: "2px solid #1a2a3a" }}>
          <div className="h-full transition-all" style={{ width: `${pct}%`, background: "#0052FF" }} />
        </div>
        <p className="font-pixel text-[0.62rem] mt-1 text-right" style={{ color: "#3a5a7a" }}>
          {minted} / {MAX_SUPPLY} MINTED
        </p>
      </div>

      {/* ── サンプルグリッド ── */}
      <div>
        <p className="font-pixel text-[0.72rem] mb-4" style={{ color: "#506070" }}>PREVIEW — ランダムで以下のいずれかが当たります</p>
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
          {PREVIEW_IDS.map((id, i) => (
            <div key={id} className="flex flex-col items-center gap-1">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={nftImageUrl(id)}
                alt={`Stage ${8 - i}`}
                className="w-full aspect-square object-cover"
                style={{ imageRendering: "pixelated", border: `2px solid ${SAMPLE_STAGES[i].accent}` }}
              />
              <p className="font-pixel text-[0.5rem] text-center leading-tight" style={{ color: SAMPLE_STAGES[i].accent }}>
                {SAMPLE_STAGES[i].label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── レアリティ表 ── */}
      <div className="pixel-box overflow-hidden" style={{ background: "#0a0a1a" }}>
        <div className="grid grid-cols-4 text-center py-2 px-3" style={{ borderBottom: "2px solid #1a2a3a" }}>
          {["STAGE", "レアリティ", "枚数", "確率"].map(h => (
            <p key={h} className="font-pixel text-[0.6rem]" style={{ color: "#3a5a7a" }}>{h}</p>
          ))}
        </div>
        {SAMPLE_STAGES.map((s) => (
          <div key={s.num} className="grid grid-cols-4 text-center py-2 px-3" style={{ borderBottom: "1px solid #0f1628" }}>
            <p className="font-ja text-xs" style={{ color: s.accent }}>{s.label}</p>
            <p className="font-pixel text-[0.6rem]" style={{ color: "#7090a8" }}>{s.rarity}</p>
            <p className="font-pixel text-[0.62rem]" style={{ color: "#e0e8ff" }}>{s.count}</p>
            <p className="font-pixel text-[0.62rem]" style={{ color: s.accent }}>{s.pct}</p>
          </div>
        ))}
      </div>

      {/* ── ミントボタン ── */}
      <div className="pixel-box p-6 text-center space-y-4" style={{ background: "#0f1628" }}>
        {!isConnected ? (
          <>
            <p className="font-ja text-sm mb-4" style={{ color: "#7090a8" }}>
              ミントにはウォレットの接続が必要です
            </p>
            <div className="flex justify-center">
              <WalletButton />
            </div>
          </>
        ) : soldOut ? (
          <p className="font-pixel text-[0.85rem]" style={{ color: "#e63946" }}>SOLD OUT</p>
        ) : isWrongNetwork ? (
          <>
            <p className="font-pixel text-[0.72rem] mb-2" style={{ color: "#e63946" }}>
              ⚠ ネットワークが違います
            </p>
            <p className="font-ja text-sm mb-1" style={{ color: "#7090a8" }}>
              現在のネットワーク: <span style={{ color: "#e63946" }}>Chain ID {chainId}</span>
            </p>
            <p className="font-ja text-sm mb-4" style={{ color: "#7090a8" }}>
              MINTにはBaseネットワーク（Chain ID 8453）が必要です
            </p>
            <button
              onClick={handleMint}
              disabled={isSwitching}
              className="pixel-btn font-pixel w-full"
              style={{
                background: "#0052FF",
                color: "#fff",
                borderColor: "#000",
                padding: "1rem",
                fontSize: "0.8rem",
                cursor: isSwitching ? "not-allowed" : "pointer",
                opacity: isSwitching ? 0.7 : 1,
              }}
            >
              {isSwitching ? "Baseに切り替え中..." : "▸ Baseに切り替えてMINTする"}
            </button>
          </>
        ) : isSuccess ? (
          <div className="space-y-4">
            <div className="text-4xl">🎉</div>
            <p className="font-pixel text-[0.85rem]" style={{ color: "#52b788" }}>MINT SUCCESS!</p>
            {mintedId && (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={nftImageUrl(mintedId)}
                  alt={`NFT #${mintedId}`}
                  className="w-36 h-36 mx-auto"
                  style={{ imageRendering: "pixelated", border: "3px solid #52b788", boxShadow: "4px 4px 0 #52b788" }}
                />
                <p className="font-pixel text-[0.72rem]" style={{ color: "#52b788" }}>
                  ONLOOP #{String(mintedId).padStart(4, "0")} GET！
                </p>
              </>
            )}
            <p className="font-ja text-sm" style={{ color: "#7090a8" }}>
              下のギャラリーで保有NFTを確認できます
            </p>
            <button
              onClick={() => {
                resetWrite()      // wagmiのisSuccess/txHashを完全リセット
                setMintedId(null)
                invalidateMintQueries()
              }}
              className="pixel-btn font-pixel"
              style={{ background: "#0a0a1a", color: "#7ab0ff", borderColor: "#0052FF", padding: "0.5rem 1.2rem", fontSize: "0.72rem" }}
            >
              ▸ もう1体MINTする
            </button>
          </div>
        ) : (
          <>
            <p className="font-pixel text-[0.72rem] mb-2" style={{ color: "#506070" }}>
              ミント価格: <span style={{ color: "#0052FF" }}>0.0003 ETH</span>（約100円）
            </p>
            <button
              onClick={handleMint}
              disabled={isBusy}
              className="pixel-btn font-pixel w-full"
              style={{
                background: isBusy ? "#1a2a3a" : "#0052FF",
                color: "#fff",
                borderColor: "#000",
                padding: "1rem",
                fontSize: "0.85rem",
                cursor: isBusy ? "not-allowed" : "pointer",
                opacity: isBusy ? 0.7 : 1,
              }}
            >
              {isPending ? "ウォレットで承認中..." : isConfirming ? "チェーン確認中..." : "▸ MINT する"}
            </button>
            {writeError && (
              <p className="font-ja text-xs" style={{ color: "#e63946" }}>
                {writeError.message.includes("rejected") ? "キャンセルされました" : writeError.message}
              </p>
            )}
            <p className="font-ja text-xs" style={{ color: "#405060" }}>
              どのステージが当たるかはミント時にランダムで決まります
            </p>
          </>
        )}
      </div>
    </div>
  )
}
