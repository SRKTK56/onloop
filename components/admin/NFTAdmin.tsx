"use client"

import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt, useBalance } from "wagmi"
import { base } from "wagmi/chains"
import { formatEther } from "viem"
import { NFT_CONTRACT_ADDRESS, NFT_ABI, MAX_SUPPLY } from "@/lib/web3/nft"
import { useState } from "react"

const NFT_OWNER_WALLET = process.env.NEXT_PUBLIC_NFT_OWNER_WALLET?.toLowerCase()

export function NFTAdmin() {
  const { address } = useAccount()
  const isOwner = !!address && address.toLowerCase() === NFT_OWNER_WALLET
  const [withdrawDone, setWithdrawDone] = useState(false)

  const { data: totalMinted, refetch: refetchMinted } = useReadContract({
    address:      NFT_CONTRACT_ADDRESS,
    abi:          NFT_ABI,
    functionName: "totalMinted",
    chainId:      base.id,
  })
  const { data: remaining } = useReadContract({
    address:      NFT_CONTRACT_ADDRESS,
    abi:          NFT_ABI,
    functionName: "remaining",
    chainId:      base.id,
  })
  const { data: contractBalance, refetch: refetchBalance } = useBalance({
    address: NFT_CONTRACT_ADDRESS,
    chainId: base.id,
  })

  const { writeContract, data: txHash, isPending, error: writeError } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash: txHash })

  const minted  = totalMinted ? Number(totalMinted) : 0
  const remain  = remaining   ? Number(remaining)   : MAX_SUPPLY
  const balance = contractBalance?.value ?? BigInt(0)
  const balanceEth = formatEther(balance)
  const pct = Math.round((minted / MAX_SUPPLY) * 100)

  async function handleWithdraw() {
    writeContract({
      address:      NFT_CONTRACT_ADDRESS,
      abi:          NFT_ABI,
      functionName: "withdraw",
      chainId:      base.id,
    }, {
      onSuccess: () => {
        setWithdrawDone(true)
        refetchBalance()
        refetchMinted()
      }
    })
  }

  const isBusy = isPending || isConfirming

  return (
    <div className="space-y-6">

      {/* ── ミント状況 ── */}
      <div className="pixel-box p-6" style={{ background: "#0f1628" }}>
        <p className="font-pixel text-[0.72rem] mb-4" style={{ color: "#0052FF" }}>MINT STATUS</p>
        <div className="grid grid-cols-3 gap-4 mb-4">
          {[
            { label: "ミント済み",  value: minted,           color: "#0052FF" },
            { label: "残り",        value: remain,           color: "#52b788" },
            { label: "MAX",         value: MAX_SUPPLY,       color: "#506070" },
          ].map((s) => (
            <div key={s.label} className="text-center p-3" style={{ background: "#060610", border: "2px solid #1a2a3a" }}>
              <p className="font-pixel text-[0.62rem] mb-1" style={{ color: "#506070" }}>{s.label}</p>
              <p className="font-pixel" style={{ fontSize: "1.4rem", color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>
        {/* プログレスバー */}
        <div className="h-3" style={{ background: "#1a2a3a", border: "2px solid #1a2a3a" }}>
          <div className="h-full" style={{ width: `${pct}%`, background: "#0052FF" }} />
        </div>
        <p className="font-pixel text-[0.62rem] mt-1 text-right" style={{ color: "#3a5a7a" }}>{pct}% minted</p>
        <div className="mt-3 pt-3" style={{ borderTop: "1px solid #1a2a3a" }}>
          <a
            href={`https://basescan.org/address/${NFT_CONTRACT_ADDRESS}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-pixel text-[0.62rem]"
            style={{ color: "#3a6aaa" }}
          >
            ↗ Basescanで確認
          </a>
        </div>
      </div>

      {/* ── 売上 / 引き出し ── */}
      <div
        className="pixel-box p-6"
        style={{ background: "#0f1628", borderColor: "#ffcc00", boxShadow: "4px 4px 0 #aa8800" }}
      >
        <p className="font-pixel text-[0.72rem] mb-4" style={{ color: "#ffcc00" }}>REVENUE & WITHDRAWAL</p>

        {/* コントラクト残高 */}
        <div className="p-4 mb-4 text-center" style={{ background: "#0a0800", border: "2px solid #554400" }}>
          <p className="font-pixel text-[0.62rem] mb-1" style={{ color: "#806040" }}>コントラクト残高</p>
          <p className="font-pixel" style={{ fontSize: "2rem", color: "#ffcc00" }}>
            {Number(balanceEth).toFixed(6)} ETH
          </p>
          <p className="font-pixel text-[0.62rem] mt-1" style={{ color: "#604020" }}>
            ≈ ¥{Math.round(Number(balanceEth) * 2297 * 151).toLocaleString()} 円
          </p>
        </div>

        {/* 引き出し先 */}
        <div className="p-3 mb-4" style={{ background: "#060610", border: "2px solid #1a2a3a" }}>
          <p className="font-pixel text-[0.62rem] mb-1" style={{ color: "#506070" }}>引き出し先（オーナー）</p>
          <p className="font-mono text-xs break-all" style={{ color: "#7090a8" }}>
            {NFT_OWNER_WALLET}
          </p>
        </div>

        {/* 引き出しボタン / 権限確認 */}
        {!isOwner ? (
          <div className="p-4 text-center" style={{ background: "#1a0a0a", border: "2px solid #3a1010" }}>
            <p className="font-pixel text-[0.62rem] mb-1" style={{ color: "#e63946" }}>⚠ オーナー権限が必要</p>
            <p className="font-ja text-sm" style={{ color: "#7090a8" }}>
              引き出しにはオーナーウォレット（0x050a...）での接続が必要です
            </p>
          </div>
        ) : balance === BigInt(0) ? (
          <div className="p-4 text-center" style={{ background: "#060610", border: "2px solid #1a2a3a" }}>
            <p className="font-ja text-sm" style={{ color: "#506070" }}>引き出し可能な残高がありません</p>
          </div>
        ) : isSuccess || withdrawDone ? (
          <div className="p-4 text-center space-y-2" style={{ background: "#0a1a0a", border: "2px solid #52b788" }}>
            <p className="font-pixel text-[0.72rem]" style={{ color: "#52b788" }}>✓ 引き出し完了</p>
            {txHash && (
              <a
                href={`https://basescan.org/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-pixel text-[0.62rem] block"
                style={{ color: "#3a6aaa" }}
              >
                ↗ トランザクションを確認
              </a>
            )}
          </div>
        ) : (
          <>
            <button
              onClick={handleWithdraw}
              disabled={isBusy}
              className="pixel-btn font-pixel w-full"
              style={{
                background:   isBusy ? "#1a1000" : "#c8a000",
                color:        "#000",
                borderColor:  "#000",
                padding:      "0.9rem",
                fontSize:     "0.8rem",
                cursor:       isBusy ? "not-allowed" : "pointer",
                opacity:      isBusy ? 0.7 : 1,
              }}
            >
              {isPending ? "ウォレットで承認中..." : isConfirming ? "チェーン確認中..." : `▸ ${Number(balanceEth).toFixed(6)} ETH を引き出す`}
            </button>
            {writeError && (
              <p className="font-ja text-xs mt-2" style={{ color: "#e63946" }}>
                {writeError.message.includes("rejected") ? "キャンセルされました" : writeError.message}
              </p>
            )}
            <p className="font-ja text-xs mt-2 text-center" style={{ color: "#506070" }}>
              オーナーウォレット（0x050a...）に送金されます
            </p>
          </>
        )}
      </div>

      {/* ── コントラクト情報 ── */}
      <div className="pixel-box p-5" style={{ background: "#060610" }}>
        <p className="font-pixel text-[0.72rem] mb-3" style={{ color: "#506070" }}>CONTRACT INFO</p>
        <div className="space-y-2 font-mono text-xs" style={{ color: "#3a5a7a" }}>
          <div className="flex justify-between gap-2">
            <span>NFT Contract</span>
            <a href={`https://basescan.org/address/${NFT_CONTRACT_ADDRESS}`} target="_blank" rel="noopener noreferrer" style={{ color: "#3a6aaa" }}>
              {NFT_CONTRACT_ADDRESS.slice(0, 10)}...{NFT_CONTRACT_ADDRESS.slice(-8)} ↗
            </a>
          </div>
          <div className="flex justify-between gap-2">
            <span>Mint Price</span>
            <span style={{ color: "#7090a8" }}>0.0003 ETH（約100円）</span>
          </div>
          <div className="flex justify-between gap-2">
            <span>Network</span>
            <span style={{ color: "#7090a8" }}>Base Mainnet</span>
          </div>
        </div>
      </div>
    </div>
  )
}
