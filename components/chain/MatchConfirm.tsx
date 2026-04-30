"use client"

import { useEffect, useState } from "react"
import { useAccount } from "wagmi"
import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
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
}

export function MatchConfirm({ nodeId }: { nodeId: number }) {
  const { address, isConnected } = useAccount()
  const [node, setNode] = useState<ChainNode | null>(null)
  const [loading, setLoading] = useState(true)
  const [confirming, setConfirming] = useState(false)
  const [confirmed, setConfirmed] = useState(false)
  const [nextDescription, setNextDescription] = useState("")

  useEffect(() => {
    fetch(`/api/chains/${nodeId}`)
      .then((r) => r.json())
      .then(setNode)
      .finally(() => setLoading(false))
  }, [nodeId])

  if (!isConnected) {
    return (
      <div className="text-center py-12 space-y-4">
        <p className="text-muted-foreground">確認にはウォレットの接続が必要です。</p>
        <WalletButton />
      </div>
    )
  }

  if (loading) {
    return <p className="text-muted-foreground text-center py-12">読み込み中...</p>
  }

  if (!node) {
    return <p className="text-destructive text-center py-12">恩送りが見つかりませんでした。</p>
  }

  if (node.receiverWallet.toLowerCase() !== address?.toLowerCase()) {
    return (
      <p className="text-destructive text-center py-12">
        この恩送りはあなた宛てではありません。
      </p>
    )
  }

  if (node.status === "confirmed") {
    return (
      <div className="text-center py-12 space-y-4">
        <div className="text-4xl">✅</div>
        <p className="font-semibold">この恩送りは承認済みです。</p>
        <Link href={`/chain/${node.chainId}`} className={cn(buttonVariants({ variant: "outline" }))}>
          チェーンを見る
        </Link>
      </div>
    )
  }

  if (confirmed) {
    return (
      <div className="text-center py-12 space-y-4">
        <div className="text-4xl">🙏</div>
        <h2 className="text-xl font-bold">ありがとうございます！</h2>
        <p className="text-muted-foreground">
          恩送りを受け取りました。次の誰かへ恩を繋いでいきましょう。
        </p>
        <Link href={`/chain/${node.chainId}`} className={cn(buttonVariants())}>
          チェーンの広がりを見る
        </Link>
      </div>
    )
  }

  async function handleConfirm() {
    if (!address || !node) return
    setConfirming(true)
    try {
      await fetch("/api/chains", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nodeId: node.id, receiverWallet: address }),
      })
      setConfirmed(true)
    } finally {
      setConfirming(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="border rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">チェーン #{node.chainId}</span>
          <Badge variant="secondary">位置 {node.position + 1}</Badge>
        </div>
        <div>
          <p className="text-sm text-muted-foreground mb-1">あなたへの恩送り</p>
          <p className="text-lg font-semibold">{node.description}</p>
        </div>
        <div className="text-sm text-muted-foreground font-mono">
          送り主：{node.giverWallet.slice(0, 10)}...{node.giverWallet.slice(-6)}
        </div>
      </div>

      <div className="border rounded-2xl p-6 bg-accent space-y-2">
        <p className="text-sm font-semibold text-primary">
          承認すると…
        </p>
        <ul className="text-sm text-primary/80 space-y-1">
          <li>✓ +1 ON トークンを獲得</li>
          <li>✓ 次の誰かへ恩送りを繋ぐ約束が始まります</li>
        </ul>
      </div>

      <div className="space-y-2">
        <Label htmlFor="next">
          次にどんな恩送りをしたいか（任意・後で決めてもOK）
        </Label>
        <Textarea
          id="next"
          placeholder="例：料理が得意なので誰かにご飯を作ってあげたい"
          rows={3}
          value={nextDescription}
          onChange={(e) => setNextDescription(e.target.value)}
        />
      </div>

      <Button
        className="w-full"
        size="lg"
        onClick={handleConfirm}
        disabled={confirming}
      >
        {confirming ? "承認中..." : "恩送りを受け取る・承認する"}
      </Button>
    </div>
  )
}
