"use client"

import { useAccount } from "wagmi"
import { useEffect, useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { WalletButton } from "@/components/shared/WalletButton"
import { ImageUpload } from "@/components/shared/ImageUpload"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Link from "next/link"

type Profile = { walletAddress: string; displayName: string | null; avatarUrl: string | null }
type ChainNode = {
  id: number; chainId: number; position: number
  giverWallet: string; receiverWallet: string
  description: string; status: string; createdAt: string
}
type OriginChain = { id: number; originWallet: string; createdAt: string }
type OnTx = { id: number; amount: number; reason: string; chainId: number | null; createdAt: string }

type ProfileData = {
  profile: Profile | null
  balance: number
  history: OnTx[]
  originChains: OriginChain[]
  nodes: ChainNode[]
}

function shortAddr(addr: string) {
  return addr.slice(0, 6) + "..." + addr.slice(-4)
}

function reasonLabel(reason: string) {
  if (reason.startsWith("chain_hop")) return "連鎖への参加"
  if (reason.startsWith("loop_complete")) return "ループ完成ボーナス"
  return reason
}

export function ProfileView() {
  const { address, isConnected } = useAccount()
  const [data, setData] = useState<ProfileData | null>(null)
  const [loading, setLoading] = useState(false)
  const [editName, setEditName] = useState("")
  const [saving, setSaving] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState("")

  const load = useCallback(async () => {
    if (!address) return
    setLoading(true)
    try {
      const res = await fetch(`/api/profile?wallet=${address}`)
      const json = await res.json()
      setData(json)
      setEditName(json.profile?.displayName ?? "")
      setAvatarUrl(json.profile?.avatarUrl ?? "")
    } finally {
      setLoading(false)
    }
  }, [address])

  useEffect(() => { load() }, [load])

  async function saveProfile() {
    if (!address) return
    setSaving(true)
    try {
      await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ walletAddress: address, displayName: editName, avatarUrl }),
      })
      await load()
    } finally {
      setSaving(false)
    }
  }

  if (!isConnected) {
    return (
      <div className="text-center py-20 space-y-4">
        <p className="text-muted-foreground">マイページを見るにはウォレットを接続してください。</p>
        <WalletButton />
      </div>
    )
  }

  if (loading || !data) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-32 w-full rounded-2xl" />
        <Skeleton className="h-48 w-full rounded-2xl" />
      </div>
    )
  }

  const sentNodes = data.nodes.filter((n) => n.giverWallet === address)
  const receivedNodes = data.nodes.filter((n) => n.receiverWallet === address)
  const pendingNodes = receivedNodes.filter((n) => n.status === "pending")

  return (
    <div className="space-y-6">
      {/* プロフィール */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start gap-6 flex-wrap">
            <div className="flex flex-col items-center gap-2">
              <ImageUpload
                value={avatarUrl}
                onChange={(url) => setAvatarUrl(url)}
                size="lg"
                label="アイコン変更"
              />
            </div>
            <div className="flex-1 space-y-3 min-w-48">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">表示名</p>
                <Input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="名前を設定する（任意）"
                  className="max-w-xs"
                />
              </div>
              <p className="text-xs text-muted-foreground font-mono">{address}</p>
              <Button size="sm" onClick={saveProfile} disabled={saving}>
                {saving ? "保存中..." : "プロフィールを保存"}
              </Button>
            </div>
            <div className="text-right space-y-1">
              <p className="text-3xl font-bold">{data.balance} <span className="text-base font-normal text-muted-foreground">ON</span></p>
              <p className="text-xs text-muted-foreground">送った恩：{sentNodes.length} 件</p>
              <p className="text-xs text-muted-foreground">受けた恩：{receivedNodes.length} 件</p>
              <p className="text-xs text-muted-foreground">起点チェーン：{data.originChains.length} 本</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 承認待ち */}
      {pendingNodes.length > 0 && (
        <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950/20">
          <CardHeader>
            <CardTitle className="text-base text-amber-700 dark:text-amber-400">
              承認待ちの恩送り {pendingNodes.length} 件
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {pendingNodes.map((node) => (
              <div key={node.id} className="flex items-center justify-between border rounded-xl p-4 bg-background">
                <div>
                  <p className="text-sm font-medium">{node.description}</p>
                  <p className="text-xs text-muted-foreground font-mono">送り主：{shortAddr(node.giverWallet)}</p>
                </div>
                <Link href={`/match/${node.id}`} className={cn(buttonVariants({ size: "sm" }))}>
                  確認・承認する
                </Link>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* タブ */}
      <Tabs defaultValue="chains">
        <TabsList className="w-full">
          <TabsTrigger value="chains" className="flex-1">チェーン履歴</TabsTrigger>
          <TabsTrigger value="origin" className="flex-1">起点チェーン</TabsTrigger>
          <TabsTrigger value="tokens" className="flex-1">ON獲得履歴</TabsTrigger>
        </TabsList>

        {/* チェーン履歴 */}
        <TabsContent value="chains" className="mt-4 space-y-3">
          {data.nodes.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              <p className="mb-4">まだ恩送りに参加していません。</p>
              <Link href="/menu" className={cn(buttonVariants({ variant: "outline", size: "sm" }))}>
                メニューから始める
              </Link>
            </div>
          ) : (
            data.nodes.map((node) => (
              <Link
                key={node.id}
                href={`/chain/${node.chainId}`}
                className="flex items-center justify-between border rounded-xl p-4 hover:bg-muted/50 transition-colors"
              >
                <div className="space-y-1">
                  <p className="text-sm font-medium">{node.description}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>チェーン #{node.chainId}</span>
                    <span>·</span>
                    <span>{node.giverWallet === address ? "🌱 送った" : "🤝 受けた"}</span>
                    <span>·</span>
                    <span>位置 {node.position + 1}</span>
                  </div>
                </div>
                <Badge variant={node.status === "confirmed" ? "default" : "secondary"}>
                  {node.status === "confirmed" ? "完了" : "承認待ち"}
                </Badge>
              </Link>
            ))
          )}
        </TabsContent>

        {/* 起点チェーン */}
        <TabsContent value="origin" className="mt-4 space-y-3">
          {data.originChains.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              <p className="mb-4">まだ恩送りの連鎖を起こしていません。</p>
              <Link href="/menu" className={cn(buttonVariants({ variant: "outline", size: "sm" }))}>
                恩送りを始める
              </Link>
            </div>
          ) : (
            data.originChains.map((chain) => {
              const chainNodeList = data.nodes.filter((n) => n.chainId === chain.id)
              const confirmed = chainNodeList.filter((n) => n.status === "confirmed").length
              return (
                <Link
                  key={chain.id}
                  href={`/chain/${chain.id}`}
                  className="flex items-center justify-between border rounded-xl p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-medium">チェーン #{chain.id}</p>
                    <p className="text-xs text-muted-foreground">
                      参加者 {chainNodeList.length} 人 · 確認済み {confirmed} 件
                    </p>
                  </div>
                  <Badge variant="secondary">🌱 起点</Badge>
                </Link>
              )
            })
          )}
        </TabsContent>

        {/* ON獲得履歴 */}
        <TabsContent value="tokens" className="mt-4 space-y-3">
          {data.history.length === 0 ? (
            <p className="text-center py-10 text-muted-foreground">まだONトークンを獲得していません。</p>
          ) : (
            data.history.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between border rounded-xl p-4">
                <div className="space-y-0.5">
                  <p className="text-sm font-medium">{reasonLabel(tx.reason)}</p>
                  {tx.chainId && (
                    <p className="text-xs text-muted-foreground">チェーン #{tx.chainId}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    {new Date(tx.createdAt).toLocaleDateString("ja-JP")}
                  </p>
                </div>
                <span className="font-mono font-bold text-primary">+{tx.amount} ON</span>
              </div>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
