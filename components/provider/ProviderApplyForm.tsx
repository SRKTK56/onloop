"use client"

import { useState, useEffect } from "react"
import { useAccount } from "wagmi"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { WalletButton } from "@/components/shared/WalletButton"
import { ImageUpload } from "@/components/shared/ImageUpload"

// ── AI画像生成ボタン ──
function AiImageGenerator({
  title,
  description,
  onGenerated,
}: {
  title: string
  description: string
  onGenerated: (url: string) => void
}) {
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState("")

  async function handleGenerate() {
    if (!title) return
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/generate-image", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ title, description }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? "生成失敗")
      onGenerated(data.url)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={handleGenerate}
        disabled={!title || loading}
        className="pixel-btn font-pixel w-full"
        style={{
          background:  !title || loading ? "#0a1a2a" : "#060f2a",
          color:       !title || loading ? "#2a4a6a" : "#7ab0ff",
          borderColor: !title || loading ? "#1a2a3a" : "#0052FF",
          boxShadow:   !title || loading ? "none" : "3px 3px 0 #0052FF",
          padding:     "0.6rem 1rem",
          fontSize:    "0.72rem",
          cursor:      !title || loading ? "not-allowed" : "pointer",
          opacity:     loading ? 0.7 : 1,
        }}
      >
        {loading ? "✦ AI生成中... (最大30秒)" : "✦ AIで画像を自動生成"}
      </button>
      {!title && (
        <p className="font-ja text-xs" style={{ color: "#3a5a7a" }}>
          ※「提供できること」を入力すると生成できます
        </p>
      )}
      {error && (
        <p className="font-ja text-xs" style={{ color: "#e63946" }}>{error}</p>
      )}
    </div>
  )
}

// ── リアルタイムプレビューカード ──
function PreviewCard({
  serviceImageUrl,
  displayName,
  walletAddress,
  serviceTitle,
  serviceDescription,
}: {
  serviceImageUrl: string
  displayName: string
  walletAddress: string
  serviceTitle: string
  serviceDescription: string
}) {
  const shortAddr = walletAddress
    ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
    : "0x0000...0000"

  return (
    <div className="sticky top-20">
      <p className="font-pixel text-[0.72rem] mb-4" style={{ color: "#506070" }}>
        ▸ MENU PREVIEW
      </p>
      <div
        className="pixel-box flex flex-col overflow-hidden"
        style={{ background: "#0f1628", maxWidth: 320 }}
      >
        {/* サービス画像エリア */}
        <div
          className="h-36 flex items-center justify-center relative overflow-hidden"
          style={{ background: "#060610" }}
        >
          {serviceImageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={serviceImageUrl}
              alt="service"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex flex-col items-center gap-2">
              <span className="text-4xl opacity-10">🙌</span>
              <p className="font-pixel text-[0.55rem]" style={{ color: "#2a3a4a" }}>
                IMAGE PREVIEW
              </p>
            </div>
          )}

          {/* アバターオーバーレイ */}
          <div
            className="absolute -bottom-5 left-4 w-12 h-12 overflow-hidden flex items-center justify-center font-pixel text-sm"
            style={{
              border: "3px solid #0052FF",
              boxShadow: "3px 3px 0 #0052FF",
              background: "#0a1628",
              color: "#0052FF",
            }}
          >
            {displayName ? displayName[0].toUpperCase() : "?"}
          </div>
        </div>

        {/* 情報 */}
        <div className="pt-8 px-4 pb-4 flex flex-col gap-3">
          <div>
            <p className="font-ja font-bold text-base" style={{ color: "#e0e8ff" }}>
              {displayName || <span style={{ color: "#304050" }}>ユーザー名未設定</span>}
            </p>
            <p className="font-mono text-xs" style={{ color: "#3a5a7a" }}>
              {shortAddr}
            </p>
          </div>

          <div>
            <span
              className="font-pixel text-[0.72rem] px-2 py-0.5 mb-1.5 inline-block"
              style={{
                background: "#0052FF22",
                border: "2px solid #0052FF",
                color: "#7ab0ff",
              }}
            >
              提供できること
            </span>
            <p className="font-ja font-medium text-sm mt-1" style={{ color: serviceTitle ? "#c0d0e8" : "#304050" }}>
              {serviceTitle || "タイトルを入力してください"}
            </p>
          </div>

          <p
            className="font-ja text-sm leading-relaxed line-clamp-3"
            style={{ color: serviceDescription ? "#607080" : "#2a3a4a" }}
          >
            {serviceDescription || "説明を入力してください..."}
          </p>

          <div
            className="font-pixel text-center py-2 text-[0.65rem]"
            style={{
              background: "#0a0a1a",
              color: "#3a5a7a",
              border: "2px solid #1a2a3a",
            }}
          >
            ▸ 恩送りをお願いする
          </div>
        </div>
      </div>
    </div>
  )
}

// ── メインフォーム ──
export function ProviderApplyForm() {
  const { address, isConnected } = useAccount()
  const [pending, setPending] = useState(false)
  const [done, setDone] = useState(false)
  const [displayName, setDisplayName] = useState("")
  const [role, setRole] = useState<"origin" | "relay">("origin")
  const [chainIdInput, setChainIdInput] = useState("")
  const [form, setForm] = useState({
    serviceImageUrl: "",
    bio: "",
    serviceTitle: "",
    serviceDescription: "",
  })

  // ユーザー名を取得
  useEffect(() => {
    if (!address) return
    fetch(`/api/profile?wallet=${address}`)
      .then((r) => r.json())
      .then((d) => setDisplayName(d.profile?.displayName ?? ""))
      .catch(() => {})
  }, [address])

  if (!isConnected) {
    return (
      <div
        className="pixel-box text-center py-16 space-y-5"
        style={{ background: "#0f1628" }}
      >
        <p className="font-pixel text-[0.72rem]" style={{ color: "#3a6080" }}>
          WALLET NOT CONNECTED
        </p>
        <p className="font-ja text-base" style={{ color: "#90a0b8" }}>
          申請にはウォレットの接続が必要です。
        </p>
        <WalletButton />
      </div>
    )
  }

  if (done) {
    return (
      <div
        className="pixel-box text-center py-16 space-y-5"
        style={{ background: "#0f1628" }}
      >
        <div className="text-5xl">🙌</div>
        <p className="font-pixel text-[0.85rem]" style={{ color: "#52b788" }}>
          申請を受け付けました！
        </p>
        <p className="font-ja text-base" style={{ color: "#90a0b8" }}>
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
        body: JSON.stringify({
          walletAddress: address,
          name: displayName || null,
          avatarUrl: form.serviceImageUrl || null,
          bio: form.bio || null,
          serviceTitle: form.serviceTitle,
          serviceDescription: form.serviceDescription,
          role,
          chainId: role === "relay" && chainIdInput ? parseInt(chainIdInput) : null,
        }),
      })
      setDone(true)
    } finally {
      setPending(false)
    }
  }

  const inputStyle = {
    background: "#060610",
    border: "2px solid #1a2a3a",
    color: "#e0e8ff",
    borderRadius: 0,
    fontFamily: "inherit",
  }
  const focusStyle = "focus:border-primary"

  return (
    <div className="flex flex-col lg:flex-row gap-10 items-start">

      {/* ── 左：入力フォーム ── */}
      <form onSubmit={handleSubmit} className="flex-1 space-y-6 min-w-0">

        {/* ロール選択 */}
        <div className="space-y-3">
          <p className="font-pixel text-[0.72rem]" style={{ color: "#90a0b8" }}>
            登録タイプを選んでください <span style={{ color: "#e63946" }}>*</span>
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* 起点者 */}
            <button
              type="button"
              onClick={() => setRole("origin")}
              className="pixel-box p-4 text-left transition-all"
              style={{
                background: role === "origin" ? "#001a66" : "#060610",
                border: `2px solid ${role === "origin" ? "#0052FF" : "#1a2a3a"}`,
                boxShadow: role === "origin" ? "4px 4px 0 #0052FF" : "none",
                cursor: "pointer",
              }}
            >
              <p className="font-pixel text-[0.72rem] mb-1" style={{ color: "#0052FF" }}>★ 起点者として登録</p>
              <p className="font-ja text-sm" style={{ color: "#90a0b8" }}>新しい恩送りチェーンを始める</p>
            </button>
            {/* 中継者 */}
            <button
              type="button"
              onClick={() => setRole("relay")}
              className="pixel-box p-4 text-left transition-all"
              style={{
                background: role === "relay" ? "#2a1000" : "#060610",
                border: `2px solid ${role === "relay" ? "#f97316" : "#1a2a3a"}`,
                boxShadow: role === "relay" ? "4px 4px 0 #f97316" : "none",
                cursor: "pointer",
              }}
            >
              <p className="font-pixel text-[0.72rem] mb-1" style={{ color: "#f97316" }}>⇢ 中継者として登録</p>
              <p className="font-ja text-sm" style={{ color: "#90a0b8" }}>既存のチェーンに参加してつなぐ</p>
            </button>
          </div>

          {/* 中継者の場合：チェーンID入力 */}
          {role === "relay" && (
            <div className="space-y-2">
              <Label className="font-pixel text-[0.72rem]" style={{ color: "#90a0b8" }}>
                参加するチェーンID <span style={{ color: "#e63946" }}>*</span>
              </Label>
              <p className="font-ja text-sm" style={{ color: "#506070" }}>
                参加したいチェーンのIDを入力してください（例：12）
              </p>
              <Input
                type="number"
                placeholder="チェーンIDを入力"
                required={role === "relay"}
                value={chainIdInput}
                onChange={(e) => setChainIdInput(e.target.value)}
                className="font-ja focus:border-primary"
                style={{ background: "#060610", border: "2px solid #f9731655", color: "#e0e8ff", borderRadius: 0 }}
              />
            </div>
          )}
        </div>

        {/* ウォレット・ユーザー名 */}
        <div
          className="p-4 space-y-2"
          style={{ background: "#060610", border: "2px solid #1a2a3a" }}
        >
          <p className="font-pixel text-[0.72rem]" style={{ color: "#506070" }}>ACCOUNT</p>
          <p className="font-mono text-xs" style={{ color: "#3a5a7a" }}>{address}</p>
          {displayName ? (
            <p className="font-ja text-base font-bold" style={{ color: "#7ab0ff" }}>
              {displayName}
            </p>
          ) : (
            <p className="font-ja text-sm" style={{ color: "#506070" }}>
              ※ マイページで名前を設定するとカードに表示されます
            </p>
          )}
        </div>

        {/* サービス画像 */}
        <div className="space-y-2">
          <Label className="font-pixel text-[0.72rem]" style={{ color: "#90a0b8" }}>
            サービス画像（任意）
          </Label>
          <p className="font-ja text-xs" style={{ color: "#506070" }}>
            提供するサービスの内容が伝わる画像をアップロードするか、AIで自動生成できます
          </p>
          <ImageUpload
            value={form.serviceImageUrl}
            onChange={(url) => setForm({ ...form, serviceImageUrl: url })}
            size="lg"
            label="画像をアップロード（5MB以内）"
          />
          <AiImageGenerator
            title={form.serviceTitle}
            description={form.serviceDescription}
            onGenerated={(url) => setForm({ ...form, serviceImageUrl: url })}
          />
        </div>

        {/* 提供できること */}
        <div className="space-y-2">
          <Label htmlFor="serviceTitle" className="font-pixel text-[0.72rem]" style={{ color: "#90a0b8" }}>
            提供できること <span style={{ color: "#e63946" }}>*</span>
          </Label>
          <Input
            id="serviceTitle"
            placeholder="例：写真撮影、ビジネスアイデア出し、料理"
            required
            value={form.serviceTitle}
            onChange={(e) => setForm({ ...form, serviceTitle: e.target.value })}
            className={`font-ja ${focusStyle}`}
            style={inputStyle}
          />
        </div>

        {/* 詳細説明 */}
        <div className="space-y-2">
          <Label htmlFor="serviceDescription" className="font-pixel text-[0.72rem]" style={{ color: "#90a0b8" }}>
            詳細説明 <span style={{ color: "#e63946" }}>*</span>
          </Label>
          <Textarea
            id="serviceDescription"
            placeholder="どんなことができるか、どんな人に向いているか、具体的に教えてください"
            rows={5}
            required
            value={form.serviceDescription}
            onChange={(e) => setForm({ ...form, serviceDescription: e.target.value })}
            className={`font-ja ${focusStyle}`}
            style={inputStyle}
          />
        </div>

        {/* 自己紹介 */}
        <div className="space-y-2">
          <Label htmlFor="bio" className="font-pixel text-[0.72rem]" style={{ color: "#90a0b8" }}>
            自己紹介（任意）
          </Label>
          <Textarea
            id="bio"
            placeholder="どんな人か、簡単に教えてください"
            rows={3}
            value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
            className={`font-ja ${focusStyle}`}
            style={inputStyle}
          />
        </div>

        {/* 送信 */}
        <button
          type="submit"
          disabled={pending}
          className="pixel-btn font-pixel w-full"
          style={{
            background: "#0052FF",
            color: "#fff",
            borderColor: "#000",
            padding: "1rem",
            fontSize: "0.8rem",
            opacity: pending ? 0.6 : 1,
            cursor: pending ? "not-allowed" : "pointer",
          }}
        >
          {pending ? "送信中..." : "▸ 申請する"}
        </button>
      </form>

      {/* ── 右：リアルタイムプレビュー ── */}
      <div className="w-full lg:w-80 shrink-0">
        <PreviewCard
          serviceImageUrl={form.serviceImageUrl}
          displayName={displayName}
          walletAddress={address ?? ""}
          serviceTitle={form.serviceTitle}
          serviceDescription={form.serviceDescription}
        />
      </div>
    </div>
  )
}
