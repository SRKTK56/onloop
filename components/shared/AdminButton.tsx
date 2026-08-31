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
      className="font-display"
      style={{
        fontSize: "0.7rem",
        color: "#000000",
        border: "1px solid #000000",
        boxShadow: "none",
        padding: "0.3rem 0.6rem",
        background: "#fff3cf",
        transition: "none", borderRadius: "1600px"}}
    >
      ⚙ 管理画面
    </Link>
  )
}
