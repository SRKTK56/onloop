"use client"

import { useAccount, useConnect, useDisconnect } from "wagmi"
import { useState, useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

function shortAddr(addr: string) {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`
}

export function WalletButton() {
  const { address, isConnected } = useAccount()
  const { connect, connectors, isPending } = useConnect()
  const { disconnect } = useDisconnect()
  const [mounted, setMounted] = useState(false)
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => { setMounted(true) }, [])

  // クリック外でドロップダウンを閉じる
  useEffect(() => {
    if (!open) return
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [open])

  // SSR中はスペースを確保するだけ（レイアウトシフト防止）
  if (!mounted) {
    return <div className="h-8 w-28 rounded-lg" />
  }

  // 接続済み
  if (isConnected && address) {
    return (
      <div ref={ref} className="relative">
        <button
          onClick={() => setOpen((v) => !v)}
          className={cn(
            "flex items-center gap-2 h-8 px-3 rounded-lg text-sm font-medium",
            "bg-primary/10 hover:bg-primary/20 text-primary transition-colors"
          )}
        >
          <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
          <span className="font-mono">{shortAddr(address)}</span>
        </button>
        {open && (
          <div className="absolute right-0 mt-1 w-48 rounded-xl border bg-background shadow-lg py-1 z-50">
            <div className="px-3 py-2 text-xs text-muted-foreground font-mono truncate border-b mb-1">
              {address}
            </div>
            <button
              onClick={() => { disconnect(); setOpen(false) }}
              className="w-full text-left px-3 py-2 text-sm hover:bg-muted transition-colors text-destructive"
            >
              切断する
            </button>
          </div>
        )}
      </div>
    )
  }

  // 未接続
  return (
    <button
      onClick={() => connect({ connector: connectors[0] })}
      disabled={isPending}
      className={cn(
        "h-8 px-4 rounded-lg text-sm font-medium transition-colors",
        "bg-primary text-primary-foreground hover:bg-primary/90",
        isPending && "opacity-60 cursor-not-allowed"
      )}
    >
      {isPending ? "接続中..." : "ウォレット接続"}
    </button>
  )
}
