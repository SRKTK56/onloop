"use client"

import { useAccount, useConnect, useDisconnect, useReconnect } from "wagmi"
import { useState, useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

function shortAddr(addr: string) {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`
}

export function WalletButton() {
  const { address, isConnected } = useAccount()
  const { connect, connectors, isPending, error } = useConnect()
  const { disconnect } = useDisconnect()
  const { reconnect } = useReconnect()
  const [mounted, setMounted] = useState(false)
  const [open, setOpen] = useState(false)
  const [connectError, setConnectError] = useState<string | null>(null)
  const [displayName, setDisplayName] = useState<string | null>(null)
  const ref = useRef<HTMLDivElement>(null)

  // 接続後にユーザー名を取得
  useEffect(() => {
    if (!address) { setDisplayName(null); return }
    fetch(`/api/profile?wallet=${address}`)
      .then((r) => r.json())
      .then((d) => setDisplayName(d.profile?.displayName ?? null))
      .catch(() => setDisplayName(null))
  }, [address])

  useEffect(() => { setMounted(true) }, [])

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

  // wagmiのerrorも表示
  useEffect(() => {
    if (error) setConnectError(error.message)
  }, [error])

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
            "flex items-center gap-2 h-8 px-3 rounded-lg text-sm font-medium cursor-pointer",
            "bg-primary/10 hover:bg-primary/20 text-primary transition-colors"
          )}
        >
          <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
          <span className={displayName ? "font-ja" : "font-mono"}>
            {displayName ?? shortAddr(address)}
          </span>
        </button>
        {open && (
          <div className="absolute right-0 mt-1 w-48 rounded-xl border bg-background shadow-lg py-1 z-50">
            <div className="px-3 py-2 text-xs text-muted-foreground font-mono truncate border-b mb-1">
              {address}
            </div>
            <button
              onClick={() => { disconnect(); setOpen(false) }}
              className="w-full text-left px-3 py-2 text-sm hover:bg-muted transition-colors text-destructive cursor-pointer"
            >
              切断する
            </button>
          </div>
        )}
      </div>
    )
  }

  // 利用可能なコネクターを全て表示できるよう準備
  const availableConnectors = connectors.filter(Boolean)

  function handleConnect() {
    setConnectError(null)
    if (availableConnectors.length === 0) {
      setConnectError("利用可能なウォレットが見つかりません")
      return
    }
    connect(
      { connector: availableConnectors[0] },
      {
        onError: (err) => {
          console.error("[WalletButton] connect error:", err)
          // コネクターが既に内部的に接続済みの場合 → wagmiのReact状態に反映させる
          if (err.message.toLowerCase().includes("already connected")) {
            reconnect({ connectors: availableConnectors })
          } else {
            setConnectError(err.message)
          }
        },
      }
    )
  }

  // 未接続 → 2ボタン表示
  return (
    <div className="flex flex-col items-end gap-1.5">
      <div className="flex items-center gap-2 flex-wrap justify-end">
        {/* 既存ウォレットを接続 */}
        <button
          onClick={handleConnect}
          disabled={isPending}
          className="pixel-btn font-pixel cursor-pointer"
          style={{
            background: "#0052FF",
            color: "#fff",
            borderColor: "#000",
            padding: "0.4rem 0.75rem",
            fontSize: "0.58rem",
            whiteSpace: "nowrap",
            opacity: isPending ? 0.6 : 1,
            cursor: isPending ? "not-allowed" : "pointer",
          }}
        >
          {isPending ? "接続中..." : "既存ウォレットで参加"}
        </button>

        {/* 新規ウォレットを作成（招待リンク） */}
        <a
          href="https://base.app/invite/onloop/6JY26BX1"
          target="_blank"
          rel="noopener noreferrer"
          className="pixel-btn font-pixel"
          style={{
            background: "#0a0a1a",
            color: "#52b788",
            borderColor: "#52b788",
            boxShadow: "3px 3px 0 #52b788",
            padding: "0.4rem 0.75rem",
            fontSize: "0.58rem",
            whiteSpace: "nowrap",
            cursor: "pointer",
            display: "inline-block",
          }}
        >
          無料でウォレット作成
        </a>
      </div>
      {connectError && (
        <p className="text-xs text-destructive max-w-xs text-right leading-tight">
          {connectError}
        </p>
      )}
    </div>
  )
}
