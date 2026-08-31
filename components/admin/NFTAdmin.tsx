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
      <div className="slush-card p-6" style={{ background: "#ffffff" }}>
        <p className="font-display text-[0.72rem] mb-4" style={{ color: "#000000" }}>MINT STATUS</p>
        <div className="grid grid-cols-3 gap-4 mb-4">
          {[
            { label: "ミント済み",  value: minted,           color: "#0052FF" },
            { label: "残り",        value: remain,           color: "#55db9c" },
            { label: "MAX",         value: MAX_SUPPLY,       color: "#506070" },
          ].map((s) => (
            <div key={s.label} className="text-center p-3" style={{ background: "#dceeff", border: "1px solid #000000" , borderRadius: "20px"}}>
              <p className="font-display text-[0.7rem] mb-1" style={{ color: "#4a4a4a" }}>{s.label}</p>
              <p className="font-display" style={{ fontSize: "1.4rem", color: "#000000" }}>{s.value}</p>
            </div>
          ))}
        </div>
        {/* プログレスバー */}
        <div className="h-3" style={{ background: "#e9e9e9", border: "1px solid #000000" , borderRadius: "20px"}}>
          <div className="h-full" style={{ width: `${pct}%`, background: "#0052FF" }} />
        </div>
        <p className="font-display text-[0.7rem] mt-1 text-right" style={{ color: "#4a4a4a" }}>{pct}% minted</p>
        <div className="mt-3 pt-3" style={{ borderTop: "1px solid #000000" }}>
          <a
            href={`https://basescan.org/address/${NFT_CONTRACT_ADDRESS}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-display text-[0.7rem]"
            style={{ color: "#4a4a4a" }}
          >
            ↗ Basescanで確認
          </a>
        </div>
      </div>

      {/* ── 売上 / 引き出し ── */}
      <div
        className="slush-card p-6"
        style={{ background: "#ffffff", borderColor: "#000000", boxShadow: "none", borderRadius: "20px"}}
      >
        <p className="font-display text-[0.72rem] mb-4" style={{ color: "#000000" }}>REVENUE & WITHDRAWAL</p>

        {/* コントラクト残高 */}
        <div className="p-4 mb-4 text-center" style={{ background: "#ffffff", border: "1px solid #000000" , borderRadius: "20px"}}>
          <p className="font-display text-[0.7rem] mb-1" style={{ color: "#4a4a4a" }}>コントラクト残高</p>
          <p className="font-display" style={{ fontSize: "2rem", color: "#000000" }}>
            {Number(balanceEth).toFixed(6)} ETH
          </p>
          <p className="font-display text-[0.7rem] mt-1" style={{ color: "#604020" }}>
            ≈ ¥{Math.round(Number(balanceEth) * 2297 * 151).toLocaleString()} 円
          </p>
        </div>

        {/* 引き出し先 */}
        <div className="p-3 mb-4" style={{ background: "#dceeff", border: "1px solid #000000" , borderRadius: "20px"}}>
          <p className="font-display text-[0.7rem] mb-1" style={{ color: "#4a4a4a" }}>引き出し先（オーナー）</p>
          <p className="font-mono text-xs break-all" style={{ color: "#4a4a4a" }}>
            {NFT_OWNER_WALLET}
          </p>
        </div>

        {/* 引き出しボタン / 権限確認 */}
        {!isOwner ? (
          <div className="p-4 text-center" style={{ background: "#ffe3d8", border: "1px solid #000000" , borderRadius: "20px"}}>
            <p className="font-display text-[0.7rem] mb-1" style={{ color: "#fb4903" }}>⚠ オーナー権限が必要</p>
            <p className="font-ja text-sm" style={{ color: "#4a4a4a" }}>
              引き出しにはオーナーウォレット（0x050a...）での接続が必要です
            </p>
          </div>
        ) : balance === BigInt(0) ? (
          <div className="p-4 text-center" style={{ background: "#dceeff", border: "1px solid #000000" , borderRadius: "20px"}}>
            <p className="font-ja text-sm" style={{ color: "#4a4a4a" }}>引き出し可能な残高がありません</p>
          </div>
        ) : isSuccess || withdrawDone ? (
          <div className="p-4 text-center space-y-2" style={{ background: "#ddf7ea", border: "1px solid #000000" , borderRadius: "20px"}}>
            <p className="font-display text-[0.72rem]" style={{ color: "#000000" }}>✓ 引き出し完了</p>
            {txHash && (
              <a
                href={`https://basescan.org/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-display text-[0.7rem] block"
                style={{ color: "#4a4a4a" }}
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
              className="slush-btn font-display w-full"
              style={{
                background:   isBusy ? "#1a1000" : "#c8a000",
                color: "#000",
                borderColor: "#000000",
                padding:      "0.9rem",
                fontSize:     "0.8rem",
                cursor:       isBusy ? "not-allowed" : "pointer",
                opacity:      isBusy ? 0.7 : 1, borderRadius: "1600px"}}
            >
              {isPending ? "ウォレットで承認中..." : isConfirming ? "チェーン確認中..." : `▸ ${Number(balanceEth).toFixed(6)} ETH を引き出す`}
            </button>
            {writeError && (
              <p className="font-ja text-sm mt-2" style={{ color: "#fb4903" }}>
                {writeError.message.includes("rejected") ? "キャンセルされました" : writeError.message}
              </p>
            )}
            <p className="font-ja text-sm mt-2 text-center" style={{ color: "#4a4a4a" }}>
              オーナーウォレット（0x050a...）に送金されます
            </p>
          </>
        )}
      </div>

      {/* ── コントラクト情報 ── */}
      <div className="slush-card p-5" style={{ background: "#dceeff" }}>
        <p className="font-display text-[0.72rem] mb-3" style={{ color: "#4a4a4a" }}>CONTRACT INFO</p>
        <div className="space-y-2 font-mono text-xs" style={{ color: "#4a4a4a" }}>
          <div className="flex justify-between gap-2">
            <span>NFT Contract</span>
            <a href={`https://basescan.org/address/${NFT_CONTRACT_ADDRESS}`} target="_blank" rel="noopener noreferrer" style={{ color: "#4a4a4a" }}>
              {NFT_CONTRACT_ADDRESS.slice(0, 10)}...{NFT_CONTRACT_ADDRESS.slice(-8)} ↗
            </a>
          </div>
          <div className="flex justify-between gap-2">
            <span>Mint Price</span>
            <span style={{ color: "#4a4a4a" }}>0.0003 ETH（約100円）</span>
          </div>
          <div className="flex justify-between gap-2">
            <span>Network</span>
            <span style={{ color: "#4a4a4a" }}>Base Mainnet</span>
          </div>
        </div>
      </div>
    </div>
  )
}
