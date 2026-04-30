"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export function ServiceRequestForm() {
  const [pending, setPending] = useState(false)
  const [done, setDone] = useState(false)
  const [form, setForm] = useState({ description: "", email: "" })

  if (done) {
    return (
      <div className="text-center py-12 space-y-4">
        <div className="text-4xl">📮</div>
        <h2 className="text-xl font-bold">リクエストを送りました！</h2>
        <p className="text-muted-foreground">
          運営が確認し、該当ギバーの募集を検討します。
        </p>
      </div>
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setPending(true)
    try {
      await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      setDone(true)
    } finally {
      setPending(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="description">
          どんなことを手伝ってほしいですか？ <span className="text-destructive">*</span>
        </Label>
        <Textarea
          id="description"
          placeholder="例：英語の文章を日本語に訳してほしい、動画編集を手伝ってほしい、など"
          rows={5}
          required
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">連絡先メール（任意）</Label>
        <Input
          id="email"
          type="email"
          placeholder="ギバーが見つかったときにお知らせします"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
      </div>
      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "送信中..." : "リクエストを送る"}
      </Button>
    </form>
  )
}
