"use client"

import { useAccount } from "wagmi"
import Link from "next/link"
import { isAdminAddress } from "@/lib/admin"

export function AdminButton() {
  const { address, isConnected } = useAccount()

  if (!isConnected || !isAdminAddress(address)) return null

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
