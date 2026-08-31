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
  { num: 8, label: "🚀 宇宙",   rarity: "Legendary", accent: "#5c4ade", count: 25,  pct: "5%" },
  { num: 7, label: "🌐 地球",   rarity: "Epic",      accent: "#7ee8e8", count: 30,  pct: "6%" },
  { num: 6, label: "🌍 世界",   rarity: "Rare",      accent: "#4da2ff", count: 45,  pct: "9%" },
  { num: 5, label: "🗽 欧米",   rarity: "Rare",      accent: "#7ee8e8", count: 55,  pct: "11%" },
  { num: 4, label: "🌏 アジア", rarity: "Uncommon",  accent: "#ffd731", count: 65,  pct: "13%" },
  { num: 3, label: "🗼 日本",   rarity: "Uncommon",  accent: "#ff4d6d", count: 80,  pct: "16%" },
  { num: 2, label: "🏘️ 街",     rarity: "Common",    accent: "#fb4903", count: 90,  pct: "18%" },
  { num: 1, label: "🌱 村",     rarity: "Common",    accent: "#55db9c", count: 110, pct: "22%" },
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
      <div className="slush-card p-6" style={{ background: "#ffffff" }}>
        <div className="flex items-start justify-between flex-wrap gap-4 mb-5">
          <div>
            <p className="font-display text-[0.72rem] mb-1" style={{ color: "#000000" }}>ONLOOP NFT COLLECTION</p>
            <h2 className="font-ja font-bold text-xl" style={{ color: "#000000" }}>恩送りの連鎖が宿るNFT</h2>
            <p className="font-ja text-sm mt-1" style={{ color: "#4a4a4a" }}>ミントするたびにステージがランダムに決まる</p>
          </div>
          <div className="text-right">
            <p className="font-display" style={{ fontSize: "1.6rem", color: "#000000", textShadow: "none"}}>
              {remain}
            </p>
            <p className="font-display text-[0.72rem]" style={{ color: "#4a4a4a" }}>/ {MAX_SUPPLY} REMAINING</p>
          </div>
        </div>

        {/* プログレスバー */}
        <div className="h-3 w-full" style={{ background: "#e9e9e9", border: "1px solid #000000" , borderRadius: "20px"}}>
          <div className="h-full transition-all" style={{ width: `${pct}%`, background: "#0052FF" }} />
        </div>
        <p className="font-display text-[0.7rem] mt-1 text-right" style={{ color: "#4a4a4a" }}>
          {minted} / {MAX_SUPPLY} MINTED
        </p>
      </div>

      {/* ── サンプルグリッド ── */}
      <div>
        <p className="font-display text-[0.72rem] mb-4" style={{ color: "#4a4a4a" }}>PREVIEW — ランダムで以下のいずれかが当たります</p>
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
          {PREVIEW_IDS.map((id, i) => (
            <div key={id} className="flex flex-col items-center gap-1">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={nftImageUrl(id)}
                alt={`Stage ${8 - i}`}
                className="w-full aspect-square object-cover"
                style={{ imageRendering: "pixelated", border: `1px solid ${SAMPLE_STAGES[i].accent}` , borderRadius: "16px"}}
              />
              <p className="font-display text-[0.7rem] text-center leading-tight" style={{ color: SAMPLE_STAGES[i].accent }}>
                {SAMPLE_STAGES[i].label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── レアリティ表 ── */}
      <div className="slush-card overflow-hidden" style={{ background: "#ffffff" }}>
        <div className="grid grid-cols-4 text-center py-2 px-3" style={{ borderBottom: "1px solid #000000" }}>
          {["STAGE", "レアリティ", "枚数", "確率"].map(h => (
            <p key={h} className="font-display text-[0.7rem]" style={{ color: "#4a4a4a" }}>{h}</p>
          ))}
        </div>
        {SAMPLE_STAGES.map((s) => (
          <div key={s.num} className="grid grid-cols-4 text-center py-2 px-3" style={{ borderBottom: "1px solid #000000" }}>
            <p className="font-ja text-sm" style={{ color: "#000000" }}>{s.label}</p>
            <p className="font-display text-[0.7rem]" style={{ color: "#4a4a4a" }}>{s.rarity}</p>
            <p className="font-display text-[0.7rem]" style={{ color: "#000000" }}>{s.count}</p>
            <p className="font-display text-[0.7rem]" style={{ color: "#000000" }}>{s.pct}</p>
          </div>
        ))}
      </div>

      {/* ── ミントボタン ── */}
      <div className="slush-card p-6 text-center space-y-4" style={{ background: "#ffffff" }}>
        {!isConnected ? (
          <>
            <p className="font-ja text-sm mb-4" style={{ color: "#4a4a4a" }}>
              ミントにはウォレットの接続が必要です
            </p>
            <div className="flex justify-center">
              <WalletButton />
            </div>
          </>
        ) : soldOut ? (
          <p className="font-display text-[0.85rem]" style={{ color: "#fb4903" }}>SOLD OUT</p>
        ) : isWrongNetwork ? (
          <>
            <p className="font-display text-[0.72rem] mb-2" style={{ color: "#fb4903" }}>
              ⚠ ネットワークが違います
            </p>
            <p className="font-ja text-sm mb-1" style={{ color: "#4a4a4a" }}>
              現在のネットワーク: <span style={{ color: "#fb4903" }}>Chain ID {chainId}</span>
            </p>
            <p className="font-ja text-sm mb-4" style={{ color: "#4a4a4a" }}>
              MINTにはBaseネットワーク（Chain ID 8453）が必要です
            </p>
            <button
              onClick={handleMint}
              disabled={isSwitching}
              className="slush-btn font-display w-full"
              style={{
                background: "#000000",
                color: "#fff",
                borderColor: "#000000",
                padding: "1rem",
                fontSize: "0.8rem",
                cursor: isSwitching ? "not-allowed" : "pointer",
                opacity: isSwitching ? 0.7 : 1, borderRadius: "1600px"}}
            >
              {isSwitching ? "Baseに切り替え中..." : "▸ Baseに切り替えてMINTする"}
            </button>
          </>
        ) : isSuccess ? (
          <div className="space-y-4">
            <div className="text-4xl">🎉</div>
            <p className="font-display text-[0.85rem]" style={{ color: "#000000" }}>MINT SUCCESS!</p>
            {mintedId && (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={nftImageUrl(mintedId)}
                  alt={`NFT #${mintedId}`}
                  className="w-36 h-36 mx-auto"
                  style={{ imageRendering: "pixelated", border: "1px solid #000000", boxShadow: "none", borderRadius: "16px"}}
                />
                <p className="font-display text-[0.72rem]" style={{ color: "#000000" }}>
                  ONLOOP #{String(mintedId).padStart(4, "0")} GET！
                </p>
              </>
            )}
            <p className="font-ja text-sm" style={{ color: "#4a4a4a" }}>
              下のギャラリーで保有NFTを確認できます
            </p>
            <button
              onClick={() => {
                resetWrite()      // wagmiのisSuccess/txHashを完全リセット
                setMintedId(null)
                invalidateMintQueries()
              }}
              className="slush-btn font-display"
              style={{ background: "#ffffff", color: "#4a4a4a", borderColor: "#000000", padding: "0.5rem 1.2rem", fontSize: "0.72rem" , borderRadius: "1600px"}}
            >
              ▸ もう1体MINTする
            </button>
          </div>
        ) : (
          <>
            <p className="font-display text-[0.72rem] mb-2" style={{ color: "#4a4a4a" }}>
              ミント価格: <span style={{ color: "#000000" }}>0.0003 ETH</span>（約100円）
            </p>
            <button
              onClick={handleMint}
              disabled={isBusy}
              className="slush-btn font-display w-full"
              style={{
                background: isBusy ? "#cccccc" : "#000000",
                color: "#000000",
                borderColor: "#000000",
                padding: "1rem",
                fontSize: "0.85rem",
                cursor: isBusy ? "not-allowed" : "pointer",
                opacity: isBusy ? 0.7 : 1, borderRadius: "1600px"}}
            >
              {isPending ? "ウォレットで承認中..." : isConfirming ? "チェーン確認中..." : "▸ MINT する"}
            </button>
            {writeError && (
              <p className="font-ja text-sm" style={{ color: "#fb4903" }}>
                {writeError.message.includes("rejected") ? "キャンセルされました" : writeError.message}
              </p>
            )}
            <p className="font-ja text-sm" style={{ color: "#4a4a4a" }}>
              どのステージが当たるかはミント時にランダムで決まります
            </p>
          </>
        )}
      </div>
    </div>
  )
}
