"use client"

import { useAccount } from "wagmi"
import { NFTGallery } from "./NFTGallery"

export function MintGallery() {
  const { address, isConnected } = useAccount()

  if (!isConnected || !address) return null

  return (
    <div className="mt-12">
      <div
        className="pixel-box p-5"
        style={{ background: "#0f1628", borderColor: "#9b5de5", boxShadow: "4px 4px 0 #9b5de5" }}
      >
        <p className="font-pixel text-[0.72rem] mb-1" style={{ color: "#9b5de5" }}>
          MY COLLECTION
        </p>
        <p className="font-ja text-sm mb-5" style={{ color: "#7090a8" }}>
          あなたが保有するONLOOP NFT
        </p>
        <NFTGallery walletAddress={address} />
      </div>
    </div>
  )
}
