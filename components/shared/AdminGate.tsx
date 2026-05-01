"use client"

import { useAccount } from "wagmi"
import { useState, useEffect, type ReactNode } from "react"
import { WalletButton } from "./WalletButton"

export function AdminGate({ children }: { children: ReactNode }) {
  const { address, isConnected } = useAccount()
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  const adminWallet = process.env.NEXT_PUBLIC_ADMIN_WALLET?.toLowerCase()

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#0a0a1a" }}>
        <p className="font-pixel text-[0.72rem]" style={{ color: "#304050" }}>LOADING...</p>
      </div>
    )
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6" style={{ background: "#0a0a1a" }}>
        <p className="font-pixel text-[0.85rem]" style={{ color: "#e63946" }}>ADMIN ACCESS REQUIRED</p>
        <p className="font-ja text-base" style={{ color: "#90a0b8" }}>管理アカウントでウォレット接続してください</p>
        <WalletButton />
      </div>
    )
  }

  if (!adminWallet || address?.toLowerCase() !== adminWallet) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ background: "#0a0a1a" }}>
        <p className="font-pixel text-[0.85rem]" style={{ color: "#e63946" }}>ACCESS DENIED</p>
        <p className="font-ja text-base" style={{ color: "#90a0b8" }}>このページは運営アカウント専用です</p>
        <p className="font-mono text-xs" style={{ color: "#304050" }}>{address}</p>
      </div>
    )
  }

  return <>{children}</>
}
