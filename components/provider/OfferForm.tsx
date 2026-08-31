"use client"

import { useState } from "react"
import { useAccount } from "wagmi"
import { useRouter } from "next/navigation"
import { PixelChar, type CharType } from "@/components/shared/PixelChar"
import { Textarea } from "@/components/ui/textarea"
import { WalletButton } from "@/components/shared/WalletButton"
import { STAGES } from "@/lib/stages"
import type { ChainSummary } from "@/lib/loops"

type Provider = {
  id: number
  walletAddress: string
  name: string | null
  bio: string | null
  serviceImageUrl: string | null
  serviceTitle: string
  serviceDescription: string
  profileAvatarUrl: string | null
  role?: string
  chainId?: number | null
}

const CHARS: CharType[] = ["hero", "warrior", "mage", "villager"]
function charForWallet(wallet: string): CharType {
  const sum = wallet.toLowerCase().split("").reduce((acc, c) => acc + c.charCodeAt(0), 0)
  return CHARS[sum % CHARS.length]
}

export function OfferForm({
  provider,
  inheritedChain = null,
}: {
  provider: Provider
  /** 贈り手が中継者として紐づけている輪。あればこれが既定の繋ぎ先になる */
  inheritedChain?: ChainSummary | null
}) {
  const { address, isConnected } = useAccount()
  const router = useRouter()
  // 既定は「継承した輪に繋ぐ」。輪が無ければ新規しか選べない
  const [joinChain, setJoinChain] = useState(Boolean(inheritedChain))
  const [description, setDescription] = useState("")
  const [agreed, setAgreed] = useState(false)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const charType = charForWallet(provider.walletAddress)
  const displayName = provider.name ?? provider.walletAddress.slice(0, 8) + "..."

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!address) return
    if (!description.trim()) { setError("依頼内容を入力してください"); return }
    if (address.toLowerCase() === provider.walletAddress.toLowerCase()) {
      setError("自分自身への恩送りはできません")
      return
    }

    setError(null)
    setPending(true)
    try {
      const res = await fetch("/api/chains", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          giverWallet: provider.walletAddress,
          receiverWallet: address,
          description: description.trim(),
          // 繋ぎ先。新しい輪を選んだときは API 側の自動継承も抑止する
          chainId: joinChain && inheritedChain ? inheritedChain.chainId : undefined,
          startNewChain: !joinChain,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? "エラーが発生しました")
      router.push(`/chain/${data.chainId}`)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "エラーが発生しました")
      setPending(false)
    }
  }

  return (
    <div className="space-y-6">

      {/* ギバー情報カード */}
      <div className="slush-card overflow-visible" style={{ background: "#ffffff" }}>
        {/* サービス画像 */}
        <div className="h-36 overflow-hidden relative" style={{ background: "#dceeff" }}>
          {provider.serviceImageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={provider.serviceImageUrl} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-5xl opacity-20">🙌</span>
            </div>
          )}
          {/* アバター */}
          <div
            className="absolute -bottom-6 left-5 w-14 h-14 flex items-center justify-center overflow-hidden z-10"
            style={{
              border: "1px solid #000000",
              boxShadow: "none",
              background: "#ffffff", borderRadius: "20px"}}
          >
            {provider.profileAvatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={provider.profileAvatarUrl} alt="" className="w-full h-full object-cover" />
            ) : (
              <PixelChar type={charType} scale={5} />
            )}
          </div>
        </div>

        <div className="pt-10 px-5 pb-5 space-y-3">
          <p className="font-ja font-bold text-lg" style={{ color: "#000000" }}>{displayName}</p>
          {provider.bio && (
            <p className="font-ja text-sm leading-relaxed" style={{ color: "#606878" }}>{provider.bio}</p>
          )}
          <div>
            <span
              className="font-display text-[0.7rem] px-2 py-0.5 inline-block mb-1"
              style={{ background: "#dceeff", border: "1px solid #000000", color: "#4a4a4a" , borderRadius: "1600px"}}
            >
              提供できること
            </span>
            <p className="font-ja font-bold text-base" style={{ color: "#000000" }}>{provider.serviceTitle}</p>
          </div>
          <p className="font-ja text-sm leading-relaxed" style={{ color: "#4a4a4a" }}>
            {provider.serviceDescription}
          </p>
        </div>
      </div>

      {/* 依頼フォーム */}
      {!isConnected ? (
        <div
          className="slush-card text-center py-10 space-y-4"
          style={{ background: "#ffffff" }}
        >
          <p className="font-display text-[0.72rem]" style={{ color: "#4a4a4a" }}>
            WALLET NOT CONNECTED
          </p>
          <p className="font-ja text-base" style={{ color: "#4a4a4a" }}>
            依頼にはウォレットの接続が必要です。
          </p>
          <WalletButton />
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* ── どの輪に繋ぐか ──
              起点になるか、既にある輪に加わるか。このプロダクトの中心的な選択 */}
          {inheritedChain && (
            <div className="space-y-3">
              <p className="font-ui">この恩送りをどうしますか？</p>
              <div className="grid sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setJoinChain(true)}
                  className="slush-card p-4 text-left"
                  style={{
                    background: joinChain
                      ? (STAGES.find((x) => x.id === inheritedChain.stageId)?.accent ?? "#7ee8e8")
                      : "#ffffff",
                    cursor: "pointer",
                  }}
                >
                  <p className="h-ja text-base mb-1">⇢ いまある輪に繋ぐ</p>
                  <p className="font-ja text-sm">
                    輪 #{inheritedChain.chainId}（{inheritedChain.length} 連鎖
                    {STAGES.find((x) => x.id === inheritedChain.stageId)?.emoji}
                    {STAGES.find((x) => x.id === inheritedChain.stageId)?.name}）が伸びます。
                    長いほど完成時の報酬が大きくなります。
                  </p>
                </button>
                <button
                  type="button"
                  onClick={() => setJoinChain(false)}
                  className="slush-card p-4 text-left"
                  style={{ background: joinChain ? "#ffffff" : "#ffd731", cursor: "pointer" }}
                >
                  <p className="h-ja text-base mb-1">★ 新しい輪として始める</p>
                  <p className="font-ja text-sm">
                    {provider.name ?? "この人"}を起点に、新しい恩の輪が生まれます。
                  </p>
                </button>
              </div>
            </div>
          )}

          <div
            className="slush-card p-5 space-y-4"
            style={{ background: "#ffffff" }}
          >
            <div>
              <p className="font-display text-[0.72rem] mb-2" style={{ color: "#000000" }}>
                依頼内容
              </p>
              <p className="font-ja text-sm mb-3" style={{ color: "#4a4a4a" }}>
                {displayName} さんに何をお願いしたいか、具体的に教えてください。
              </p>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={`例：来週末に家族写真を撮っていただけますか？場所は${provider.serviceTitle.includes("写真") ? "公園" : "ご都合の良い場所"}を希望しています。`}
                rows={5}
                required
                className="font-ja"
                style={{
                  background: "#dceeff",
                  border: "1px solid #000000",
                  color: "#000000",
                  borderRadius: "20px",
                  resize: "vertical"}}
              />
            </div>

            {/* 恩の連鎖の約束（チェックボックス） */}
            <label
              className="flex items-start gap-3 p-4 cursor-pointer"
              style={{
                background: agreed ? "#ffffff" : "#080810",
                border: `1px solid ${agreed ? "#0052FF" : "#000000"}`,
                boxShadow: "none",
                transition: "border-color 0.15s, box-shadow 0.15s", borderRadius: "20px"}}
            >
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-1 w-5 h-5 shrink-0 cursor-pointer"
                style={{ accentColor: "#0052FF" }}
              />
              <div>
                <p className="font-display text-[0.7rem] mb-1.5" style={{ color: agreed ? "#000000" : "#4a4a4a" }}>
                  ▸ 恩送りの約束
                </p>
                <p className="font-ja text-sm leading-relaxed" style={{ color: agreed ? "#4a4a4a" : "#4a6080" }}>
                  恩送りを受け取ったら、あなたも次の誰かへ恩を繋ぐことを約束します。連鎖が続くほど、全員のONの積み上がりが増えます。
                </p>
              </div>
            </label>
          </div>

          {error && (
            <p
              className="font-ja text-sm px-4 py-3"
              style={{ background: "#ffe3d8", border: "1px solid #fb4903", color: "#fb4903" , borderRadius: "20px"}}
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={pending || !description.trim() || !agreed}
            className="slush-btn font-display w-full"
            style={{
              background: pending || !description.trim() || !agreed ? "#cccccc" : "#000000",
              color: pending || !description.trim() || !agreed ? "#4a4a4a" : "#fff",
              borderColor: pending || !description.trim() || !agreed ? "#000000" : "#000",
              boxShadow: "none",
              padding: "1rem",
              fontSize: "0.78rem",
              cursor: pending || !agreed ? "not-allowed" : "pointer", borderRadius: "1600px"}}
          >
            {pending ? "送信中..." : "▸ 恩送りを依頼する"}
          </button>
        </form>
      )}
    </div>
  )
}
