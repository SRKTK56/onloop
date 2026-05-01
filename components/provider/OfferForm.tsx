"use client"

import { useState } from "react"
import { useAccount } from "wagmi"
import { useRouter } from "next/navigation"
import { PixelChar, type CharType } from "@/components/shared/PixelChar"
import { Textarea } from "@/components/ui/textarea"
import { WalletButton } from "@/components/shared/WalletButton"

type Provider = {
  id: number
  walletAddress: string
  name: string | null
  bio: string | null
  serviceImageUrl: string | null
  serviceTitle: string
  serviceDescription: string
  profileAvatarUrl: string | null
}

const CHARS: CharType[] = ["hero", "warrior", "mage", "villager"]
function charForWallet(wallet: string): CharType {
  const sum = wallet.toLowerCase().split("").reduce((acc, c) => acc + c.charCodeAt(0), 0)
  return CHARS[sum % CHARS.length]
}

export function OfferForm({ provider }: { provider: Provider }) {
  const { address, isConnected } = useAccount()
  const router = useRouter()
  const [description, setDescription] = useState("")
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
      <div className="pixel-box overflow-visible" style={{ background: "#0f1628" }}>
        {/* サービス画像 */}
        <div className="h-36 overflow-hidden relative" style={{ background: "#060610" }}>
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
              border: "3px solid #0052FF",
              boxShadow: "4px 4px 0 #0052FF",
              background: "#0a0a1a",
            }}
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
          <p className="font-ja font-bold text-lg" style={{ color: "#e0e8ff" }}>{displayName}</p>
          {provider.bio && (
            <p className="font-ja text-sm leading-relaxed" style={{ color: "#606878" }}>{provider.bio}</p>
          )}
          <div>
            <span
              className="font-pixel text-[0.65rem] px-2 py-0.5 inline-block mb-1"
              style={{ background: "#0052FF22", border: "2px solid #0052FF", color: "#7ab0ff" }}
            >
              提供できること
            </span>
            <p className="font-ja font-bold text-base" style={{ color: "#c0d0e8" }}>{provider.serviceTitle}</p>
          </div>
          <p className="font-ja text-sm leading-relaxed" style={{ color: "#607080" }}>
            {provider.serviceDescription}
          </p>
        </div>
      </div>

      {/* 依頼フォーム */}
      {!isConnected ? (
        <div
          className="pixel-box text-center py-10 space-y-4"
          style={{ background: "#0f1628" }}
        >
          <p className="font-pixel text-[0.72rem]" style={{ color: "#3a6080" }}>
            WALLET NOT CONNECTED
          </p>
          <p className="font-ja text-base" style={{ color: "#90a0b8" }}>
            依頼にはウォレットの接続が必要です。
          </p>
          <WalletButton />
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div
            className="pixel-box p-5 space-y-4"
            style={{ background: "#0f1628" }}
          >
            <div>
              <p className="font-pixel text-[0.72rem] mb-2" style={{ color: "#0052FF" }}>
                依頼内容
              </p>
              <p className="font-ja text-sm mb-3" style={{ color: "#506070" }}>
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
                  background: "#060610",
                  border: "2px solid #1a2a3a",
                  color: "#e0e8ff",
                  borderRadius: 0,
                  resize: "vertical",
                }}
              />
            </div>

            {/* 恩の連鎖の説明 */}
            <div
              className="p-3"
              style={{ background: "#060a14", border: "2px solid #0a1a4a" }}
            >
              <p className="font-pixel text-[0.65rem] mb-1" style={{ color: "#3a5a7a" }}>
                ▸ 恩送りの約束
              </p>
              <p className="font-ja text-sm leading-relaxed" style={{ color: "#4a6080" }}>
                恩送りを受け取ったら、あなたも次の誰かへ恩を繋ぐことを約束します。連鎖が続くほど、全員のONトークン報酬が増えます。
              </p>
            </div>
          </div>

          {error && (
            <p
              className="font-ja text-sm px-4 py-3"
              style={{ background: "#2a0808", border: "2px solid #e63946", color: "#e63946" }}
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={pending || !description.trim()}
            className="pixel-btn font-pixel w-full cursor-pointer"
            style={{
              background: pending || !description.trim() ? "#1a2a3a" : "#0052FF",
              color: pending || !description.trim() ? "#3a5a7a" : "#fff",
              borderColor: pending || !description.trim() ? "#1a2a3a" : "#000",
              padding: "1rem",
              fontSize: "0.78rem",
              cursor: pending ? "not-allowed" : "pointer",
            }}
          >
            {pending ? "送信中..." : "▸ 恩送りを依頼する"}
          </button>
        </form>
      )}
    </div>
  )
}
