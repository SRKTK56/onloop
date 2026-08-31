"use client"

import { useAccount } from "wagmi"
import { NFTGallery } from "./NFTGallery"

export function MintGallery() {
  const { address, isConnected } = useAccount()

  if (!isConnected || !address) return null

  return (
    <div className="mt-12">
      <div
        className="slush-card p-5"
        style={{ background: "#ffffff", borderColor: "#5c4ade", boxShadow: "none", borderRadius: "20px"}}
      >
        <p className="font-display text-[0.72rem] mb-1" style={{ color: "#5c4ade" }}>
          MY COLLECTION
        </p>
        <p className="font-ja text-sm mb-5" style={{ color: "#4a4a4a" }}>
          あなたが保有するONLOOP NFT
        </p>
        <NFTGallery walletAddress={address} />
      </div>
    </div>
  )
}
