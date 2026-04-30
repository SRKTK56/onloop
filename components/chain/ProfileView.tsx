"use client"

import { useAccount } from "wagmi"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import { WalletButton } from "@/components/shared/WalletButton"
import Link from "next/link"

type ChainNode = {
  id: number
  chainId: number
  position: number
  giverWallet: string
  receiverWallet: string
  description: string
  status: string
  confirmedAt: string | null
  createdAt: string
}

type Balance = { balance: number }

export function ProfileView() {
  const { address, isConnected } = useAccount()
  const [nodes, setNodes] = useState<ChainNode[]>([])
  const [balance, setBalance] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!address) return
    setLoading(true)
    Promise.all([
      fetch(`/api/chains?wallet=${address}`).then((r) => r.json()),
      fetch(`/api/rewards?wallet=${address}`).then((r) => r.json()),
    ])
      .then(([nodes, bal]: [ChainNode[], Balance]) => {
        setNodes(nodes)
        setBalance(bal.balance ?? 0)
      })
      .finally(() => setLoading(false))
  }, [address])

  if (!isConnected) {
    return (
      <div className="text-center py-20 space-y-4">
        <p className="text-muted-foreground">マイページを見るにはウォレットを接続してください。</p>
        <WalletButton />
      </div>
    )
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-32 w-full rounded-2xl" />
        <Skeleton className="h-48 w-full rounded-2xl" />
      </div>
    )
  }

  const sent = nodes.filter((n) => n.giverWallet === address)
  const received = nodes.filter((n) => n.receiverWallet === address)
  const pending = received.filter((n) => n.status === "pending")

  return (
    <div className="space-y-6">
      {/* ON残高 */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">ONトークン残高</p>
              <p className="text-4xl font-bold">{balance ?? 0} <span className="text-lg font-normal text-muted-foreground">ON</span></p>
            </div>
            <div className="text-right text-sm text-muted-foreground space-y-1">
              <p>送った恩：{sent.length} 件</p>
              <p>受けた恩：{received.length} 件</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 承認待ち */}
      {pending.length > 0 && (
        <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950/20">
          <CardHeader>
            <CardTitle className="text-base text-amber-700 dark:text-amber-400">
              承認待ちの恩送り {pending.length} 件
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {pending.map((node) => (
              <div key={node.id} className="flex items-center justify-between border rounded-xl p-4 bg-background">
                <div>
                  <p className="text-sm font-medium">{node.description}</p>
                  <p className="text-xs text-muted-foreground font-mono">
                    送り主：{node.giverWallet.slice(0, 8)}...
                  </p>
                </div>
                <Link href={`/match/${node.id}`} className={cn(buttonVariants({ size: "sm" }))}>
                  確認・承認する
                </Link>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* チェーン履歴 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">参加チェーン一覧</CardTitle>
        </CardHeader>
        <CardContent>
          {nodes.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p className="mb-4">まだ恩送りに参加していません。</p>
              <Link href="/menu" className={cn(buttonVariants({ variant: "outline", size: "sm" }))}>
                メニューから始める
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {nodes.map((node) => (
                <Link
                  key={node.id}
                  href={`/chain/${node.chainId}`}
                  className="flex items-center justify-between border rounded-xl p-4 hover:bg-muted/50 transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium">{node.description}</p>
                    <p className="text-xs text-muted-foreground">
                      チェーン #{node.chainId} · 位置 {node.position + 1}
                    </p>
                  </div>
                  <Badge variant={node.status === "confirmed" ? "default" : "secondary"}>
                    {node.status === "confirmed" ? "完了" : "承認待ち"}
                  </Badge>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
