"use client"

import { useAccount, usePublicClient } from "wagmi"
import { useState, useEffect, useCallback } from "react"
import { base } from "wagmi/chains"
import { NFT_CONTRACT_ADDRESS, NFT_ABI, MAX_SUPPLY, padId, nftImageUrl, nftMetaUrl } from "@/lib/web3/nft"
import Link from "next/link"

type NFTMeta = {
  tokenId: number
  name:    string
  image:   string
  stage:   string
  rarity:  string
  accent:  string
}

const RARITY_ACCENT: Record<string, string> = {
  Common: "#55db9c", Uncommon: "#ffd731", Rare: "#4da2ff", Epic: "#7ee8e8", Legendary: "#5c4ade",
}

export function NFTGallery({ walletAddress }: { walletAddress: string }) {
  const { address } = useAccount()
  // ウォレットのネットワークに関わらず常にBase mainnetで検索
  const publicClient = usePublicClient({ chainId: base.id })
  const [nfts,    setNfts]    = useState<NFTMeta[]>([])
  const [loading, setLoading] = useState(true)
  const [saving,  setSaving]  = useState<number | null>(null)
  const [saved,   setSaved]   = useState<number | null>(null)

  const load = useCallback(async () => {
    if (!publicClient || !walletAddress) return
    setLoading(true)
    try {
      // 全500トークンのオーナーをmulticallで一括取得
      const results = await publicClient.multicall({
        contracts: Array.from({ length: MAX_SUPPLY }, (_, i) => ({
          address:      NFT_CONTRACT_ADDRESS,
          abi:          NFT_ABI,
          functionName: "ownerOf" as const,
          args:         [BigInt(i + 1)] as const,
        })),
        allowFailure: true,
      })

      const ownedIds = results
        .map((r, i) => ({ tokenId: i + 1, owner: r.status === "success" ? r.result as string : null }))
        .filter(({ owner }) => owner?.toLowerCase() === walletAddress.toLowerCase())
        .map(({ tokenId }) => tokenId)

      // メタデータを並列取得
      const metas = await Promise.all(
        ownedIds.map(async (tokenId) => {
          try {
            const res  = await fetch(nftMetaUrl(tokenId))
            const json = await res.json()
            const stageAttr  = json.attributes?.find((a: { trait_type: string }) => a.trait_type === "Stage")?.value ?? ""
            const rarityAttr = json.attributes?.find((a: { trait_type: string }) => a.trait_type === "Rarity")?.value ?? ""
            return {
              tokenId,
              name:   json.name,
              image:  nftImageUrl(tokenId),
              stage:  stageAttr,
              rarity: rarityAttr,
              accent: RARITY_ACCENT[rarityAttr] ?? "#506070",
            }
          } catch {
            return { tokenId, name: `ONLOOP #${padId(tokenId)}`, image: nftImageUrl(tokenId), stage: "", rarity: "", accent: "#506070" }
          }
        })
      )
      setNfts(metas)
    } finally {
      setLoading(false)
    }
  }, [publicClient, walletAddress])

  useEffect(() => { load() }, [load])

  async function setAsIcon(nft: NFTMeta) {
    if (!address) return
    setSaving(nft.tokenId)
    try {
      // 絶対URLに変換（/nft-full/images/... → https://...）
      const absoluteUrl = `https://onloop-one.vercel.app${nft.image}`
      await fetch("/api/profile", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ walletAddress: address, avatarUrl: absoluteUrl }),
      })
      setSaved(nft.tokenId)
      setTimeout(() => setSaved(null), 3000)
    } finally {
      setSaving(null)
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {[1,2,3].map(i => (
          <div key={i} className="slush-card animate-pulse aspect-square" style={{ background: "#ffffff" }} />
        ))}
      </div>
    )
  }

  if (nfts.length === 0) {
    return (
      <div className="text-center py-12 space-y-4">
        <p className="font-display text-[0.72rem]" style={{ color: "#4a4a4a" }}>NO NFTs YET</p>
        <p className="font-ja text-sm" style={{ color: "#4a4a4a" }}>まだONLOOP NFTを保有していません</p>
        <Link
          href="/mint"
          className="slush-btn font-display inline-block"
          style={{ background: "#000000", color: "#fff", borderColor: "#000000", padding: "0.6rem 1.5rem", fontSize: "0.75rem" , borderRadius: "1600px"}}
        >
          ▸ MINTする
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <p className="font-ja text-sm" style={{ color: "#4a4a4a" }}>
        {nfts.length}体のNFTを保有しています
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {nfts.map((nft) => (
          <div
            key={nft.tokenId}
            className="slush-card flex flex-col overflow-hidden"
            style={{ borderColor: nft.accent, boxShadow: "none", borderRadius: "20px"}}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={nft.image}
              alt={nft.name}
              className="w-full aspect-square object-cover"
              style={{ imageRendering: "pixelated" }}
            />
            <div className="p-2 space-y-1.5" style={{ background: "#ffffff" }}>
              <p className="font-display text-[0.7rem]" style={{ color: "#000000" }}>
                {nft.name}
              </p>
              {nft.stage && (
                <p className="font-ja text-sm" style={{ color: "#4a4a4a" }}>{nft.stage}</p>
              )}
              {nft.rarity && (
                <span
                  className="font-display text-[0.7rem] px-1 py-0.5 inline-block"
                  style={{ background: `${nft.accent}22`, border: `1px solid ${nft.accent}`, color: "#000000" , borderRadius: "1600px"}}
                >
                  {nft.rarity}
                </span>
              )}
              <button
                onClick={() => setAsIcon(nft)}
                disabled={saving === nft.tokenId}
                className="w-full font-display text-center py-1.5 mt-1 transition-colors"
                style={{
                  fontSize:   "0.55rem",
                  background: saved === nft.tokenId ? "#ddf7ea" : "#ffffff",
                  border:     `1px solid ${saved === nft.tokenId ? "#55db9c" : "#000000"}`,
                  color:      saved === nft.tokenId ? "#000000" : "#4a4a4a",
                  cursor:     saving === nft.tokenId ? "not-allowed" : "pointer", borderRadius: "1600px"}}
              >
                {saved === nft.tokenId ? "✓ 設定済み" : saving === nft.tokenId ? "設定中..." : "アイコンに設定"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
