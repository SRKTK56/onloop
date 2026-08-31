"use client"

import { useAccount } from "wagmi"
import { useState, useEffect, type ReactNode } from "react"
import { WalletButton } from "./WalletButton"
import { isAdminAddress } from "@/lib/admin"

export function AdminGate({ children }: { children: ReactNode }) {
  const { address, isConnected } = useAccount()
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  const isAdmin = isAdminAddress(address)

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#ffffff" }}>
        <p className="font-display text-[0.72rem]" style={{ color: "#4a4a4a" }}>LOADING...</p>
      </div>
    )
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6" style={{ background: "#ffffff" }}>
        <p className="font-display text-[0.85rem]" style={{ color: "#fb4903" }}>ADMIN ACCESS REQUIRED</p>
        <p className="font-ja text-base" style={{ color: "#4a4a4a" }}>管理アカウントでウォレット接続してください</p>
        <WalletButton />
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ background: "#ffffff" }}>
        <p className="font-display text-[0.85rem]" style={{ color: "#fb4903" }}>ACCESS DENIED</p>
        <p className="font-ja text-base" style={{ color: "#4a4a4a" }}>このページは運営アカウント専用です</p>
        <p className="font-mono text-xs" style={{ color: "#4a4a4a" }}>{address}</p>
      </div>
    )
  }

  return <>{children}</>
}
