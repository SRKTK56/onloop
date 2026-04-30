"use client"

import { useState } from "react"
import { useAccount } from "wagmi"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { WalletButton } from "@/components/shared/WalletButton"

export function ProviderApplyForm() {
  const { address, isConnected } = useAccount()
  const [pending, setPending] = useState(false)
  const [done, setDone] = useState(false)
  const [form, setForm] = useState({
    name: "",
    avatarUrl: "",
    bio: "",
    serviceTitle: "",
    serviceDescription: "",
    interviewRequested: false,
  })

  if (!isConnected) {
    return (
      <div className="text-center py-12 space-y-4">
        <p className="text-muted-foreground">申請にはウォレットの接続が必要です。</p>
        <WalletButton />
      </div>
    )
  }

  if (done) {
    return (
      <div className="text-center py-12 space-y-4">
        <div className="text-4xl">🙌</div>
        <h2 className="text-xl font-bold">申請を受け付けました！</h2>
        <p className="text-muted-foreground">
          運営が内容を確認します。数日以内にご連絡します。
        </p>
      </div>
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setPending(true)
    try {
      await fetch("/api/providers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, walletAddress: address }),
      })
      setDone(true)
    } finally {
      setPending(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label>ウォレットアドレス</Label>
        <Input value={address} disabled className="font-mono text-sm" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">表示名（任意）</Label>
        <Input
          id="name"
          placeholder="例：田中 太郎 / たなか"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="avatarUrl">プロフィール画像URL（任意）</Label>
        <Input
          id="avatarUrl"
          placeholder="https://..."
          value={form.avatarUrl}
          onChange={(e) => setForm({ ...form, avatarUrl: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio">自己紹介（任意）</Label>
        <Textarea
          id="bio"
          placeholder="どんな人か、簡単に教えてください"
          rows={3}
          value={form.bio}
          onChange={(e) => setForm({ ...form, bio: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="serviceTitle">
          提供できること <span className="text-destructive">*</span>
        </Label>
        <Input
          id="serviceTitle"
          placeholder="例：写真撮影、ビジネスアイデア出し、料理"
          required
          value={form.serviceTitle}
          onChange={(e) => setForm({ ...form, serviceTitle: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="serviceDescription">
          詳細 <span className="text-destructive">*</span>
        </Label>
        <Textarea
          id="serviceDescription"
          placeholder="どんなことができるか、どんな人に向いているか、具体的に教えてください"
          rows={5}
          required
          value={form.serviceDescription}
          onChange={(e) => setForm({ ...form, serviceDescription: e.target.value })}
        />
      </div>

      <div className="flex items-center gap-3 border rounded-xl p-4 bg-muted/30">
        <input
          type="checkbox"
          id="interview"
          checked={form.interviewRequested}
          onChange={(e) => setForm({ ...form, interviewRequested: e.target.checked })}
          className="w-4 h-4"
        />
        <Label htmlFor="interview" className="cursor-pointer font-normal">
          運営との面談を希望する（任意）
        </Label>
      </div>

      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "送信中..." : "申請する"}
      </Button>
    </form>
  )
}
