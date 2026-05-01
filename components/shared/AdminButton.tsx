"use client"

import { useAccount } from "wagmi"
import Link from "next/link"

export function AdminButton() {
  const { address, isConnected } = useAccount()
  const adminWallet = process.env.NEXT_PUBLIC_ADMIN_WALLET?.toLowerCase()

  if (!isConnected || !address || !adminWallet) return null
  if (address.toLowerCase() !== adminWallet) return null

  return (
    <Link
      href="/admin"
      className="font-pixel"
      style={{
        fontSize: "0.65rem",
        color: "#ffcc00",
        border: "2px solid #aa8800",
        boxShadow: "2px 2px 0 #aa8800",
        padding: "0.3rem 0.6rem",
        background: "#1a1000",
        transition: "none",
      }}
    >
      ⚙ 管理画面
    </Link>
  )
}
