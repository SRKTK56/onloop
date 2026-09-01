"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { PixelChar, type CharType } from "@/components/shared/PixelChar"
import { getStage } from "@/lib/stages"

export type ProviderItem = {
  id: number
  walletAddress: string
  name: string | null
  bio: string | null
  serviceImageUrl: string | null
  serviceTitle: string
  serviceDescription: string
  status: string
  role: string        // "origin" | "relay"
  chainId: number | null
  chainNodeCount: number
  profileAvatarUrl: string | null
}

type ChainMember = {
  id: number
  walletAddress: string
  name: string | null
  role: string
  chainId: number | null
  serviceTitle: string
  profileAvatarUrl: string | null
}

const CHARS: CharType[] = ["hero", "warrior", "mage", "villager"]
function charForWallet(wallet: string): CharType {
  const sum = wallet.toLowerCase().split("").reduce((acc, c) => acc + c.charCodeAt(0), 0)
  return CHARS[sum % CHARS.length]
}

function RoleBadge({ role }: { role: string }) {
  const isOrigin = role === "origin"
  return (
    <span
      className="font-display text-[0.7rem] px-2 py-0.5 inline-block"
      style={{
        background: isOrigin ? "#0052FF22" : "#f9730022",
        border: `1px solid ${isOrigin ? "#0052FF" : "#fb4903"}`,
        color: isOrigin ? "#4a4a4a" : "#fb4903",
        whiteSpace: "nowrap", borderRadius: "1600px"}}
    >
      {isOrigin ? "★ 起点者" : "⇢ 中継者"}
    </span>
  )
}

function StageBadge({ chainNodeCount }: { chainNodeCount: number }) {
  if (chainNodeCount === 0) return null
  const stage = getStage(chainNodeCount)
  return (
    <span
      className="font-display text-[0.7rem] px-2 py-0.5 inline-block"
      style={{
        background: `${stage.accent}22`,
        border: `1px solid ${stage.accent}`,
        color: "#000000",
        whiteSpace: "nowrap", borderRadius: "1600px"}}
    >
      {stage.emoji} {stage.name} Lv.{stage.level}
    </span>
  )
}

function ChainSection({ provider }: { provider: ProviderItem }) {
  const [members, setMembers] = useState<ChainMember[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!provider.chainId) return
    setLoading(true)
    fetch(`/api/providers/chain-members?chainId=${provider.chainId}`)
      .then((r) => r.json())
      .then((data: ChainMember[]) => {
        // origin first, then relays
        const sorted = [...data].sort((a, b) =>
          a.role === "origin" ? -1 : b.role === "origin" ? 1 : a.id - b.id
        )
        setMembers(sorted)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [provider.chainId])

  return (
    <div
      className="p-4"
      style={{ background: "#ffffff", border: "1px solid #000000" , borderRadius: "20px"}}
    >
      <p className="font-display text-[0.7rem] mb-3" style={{ color: "#000000" }}>
        🔗 このチェーンの繋がり
      </p>

      {!provider.chainId ? (
        <p className="font-ja text-sm leading-relaxed" style={{ color: "#4a4a4a" }}>
          このメニューは新しいチェーンの起点です。あなたが最初の受取人になれます。
        </p>
      ) : loading ? (
        <p className="font-display text-[0.7rem]" style={{ color: "#4a4a4a" }}>LOADING...</p>
      ) : members.length === 0 ? (
        <p className="font-ja text-sm" style={{ color: "#4a4a4a" }}>チェーン情報を取得中...</p>
      ) : (
        <div className="flex flex-wrap items-center gap-2">
          {members.map((m, i) => {
            const charType = charForWallet(m.walletAddress)
            const isOrigin = m.role === "origin"
            return (
              <div key={m.id} className="flex items-center gap-2">
                <div className="flex flex-col items-center gap-1">
                  <div
                    className="w-10 h-10 flex items-center justify-center overflow-hidden"
                    style={{
                      border: `1px solid ${isOrigin ? "#0052FF" : "#fb4903"}`,
                      background: isOrigin ? "#dceeff" : "#fff3cf", borderRadius: "20px"}}
                  >
                    {m.profileAvatarUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={m.profileAvatarUrl} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <PixelChar type={charType} scale={3} />
                    )}
                  </div>
                  <p className="font-ja text-sm text-center" style={{ color: "#4a4a4a", maxWidth: 60 }}>
                    {m.name ?? m.walletAddress.slice(0, 6) + "..."}
                  </p>
                  <RoleBadge role={m.role} />
                </div>
                {i < members.length - 1 && (
                  <span className="font-display text-[0.7rem] mb-6" style={{ color: "#4a4a4a" }}>▶</span>
                )}
              </div>
            )
          })}
          {provider.chainNodeCount > 0 && (
            <div className="ml-1">
              <StageBadge chainNodeCount={provider.chainNodeCount} />
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function ProviderModal({ provider, onClose }: { provider: ProviderItem; onClose: () => void }) {
  const charType = charForWallet(provider.walletAddress)

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "#ffffff" }}
      onClick={onClose}
    >
      <div
        className="slush-card w-full max-w-lg max-h-[90vh] overflow-y-auto"
        style={{ background: "#ffffff" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* サービス画像 + アバター */}
        <div className="relative">
          <div className="h-48 overflow-hidden" style={{ background: "#dceeff", borderRadius: "19px 19px 0 0" }}>
            {provider.serviceImageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={provider.serviceImageUrl} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-6xl opacity-20">🙌</span>
              </div>
            )}
          </div>

          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center font-display cursor-pointer"
            style={{
              background: "#ffffff",
              border: "1px solid #000000",
              color: "#4a4a4a",
              fontSize: "0.7rem", borderRadius: "1600px"}}
          >
            ✕
          </button>

          <div
            className="absolute left-5 w-16 h-16 flex items-center justify-center overflow-hidden z-10"
            style={{
              bottom: "-2rem",
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

        {/* コンテンツ */}
        <div className="pt-12 px-6 pb-6 space-y-5">
          {/* 名前 + バッジ */}
          <div className="space-y-2">
            <p className="font-ja font-bold text-xl" style={{ color: "#000000" }}>
              {provider.name ?? provider.walletAddress.slice(0, 8) + "..."}
            </p>
            <div className="flex flex-wrap gap-2">
              <RoleBadge role={provider.role} />
              {provider.chainNodeCount > 0 && <StageBadge chainNodeCount={provider.chainNodeCount} />}
            </div>
          </div>

          {/* 自己紹介 */}
          {provider.bio && (
            <div className="p-4" style={{ background: "#ffffff", border: "1px solid #000000" , borderRadius: "20px"}}>
              <p className="font-display text-[0.7rem] mb-2" style={{ color: "#4a4a4a" }}>自己紹介</p>
              <p className="font-ja text-sm leading-relaxed" style={{ color: "#4a4a4a" }}>
                {provider.bio}
              </p>
            </div>
          )}

          {/* サービス */}
          <div>
            <span
              className="font-display text-[0.7rem] px-2 py-0.5 mb-2 inline-block"
              style={{ background: "#dceeff", border: "1px solid #000000", color: "#4a4a4a" , borderRadius: "1600px"}}
            >
              提供できること
            </span>
            <p className="font-ja font-bold text-lg" style={{ color: "#000000" }}>
              {provider.serviceTitle}
            </p>
          </div>

          <div className="p-4" style={{ background: "#dceeff", border: "1px solid #000000" , borderRadius: "20px"}}>
            <p className="font-display text-[0.7rem] mb-2" style={{ color: "#4a4a4a" }}>内容</p>
            <p className="font-ja text-sm leading-relaxed whitespace-pre-wrap" style={{ color: "#4a4a4a" }}>
              {provider.serviceDescription}
            </p>
          </div>

          {/* チェーンの繋がり */}
          <ChainSection provider={provider} />

          {/* 恩送りボタン */}
          <Link
            href={`/offer/${provider.id}`}
            className="slush-btn font-display block text-center"
            style={{
              background: "#000000",
              color: "#fff",
              borderColor: "#000000",
              padding: "0.9rem 1rem",
              fontSize: "0.78rem", borderRadius: "1600px"}}
          >
            ▸ この人に恩送りをお願いする
          </Link>
        </div>
      </div>
    </div>
  )
}

export function MenuGrid({ providers }: { providers: ProviderItem[] }) {
  const [selected, setSelected] = useState<ProviderItem | null>(null)

  return (
    <>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {providers.map((provider) => {
          const charType = charForWallet(provider.walletAddress)

          return (
            <div
              key={provider.id}
              className="slush-card flex flex-col cursor-pointer"
              style={{ background: "#ffffff", overflow: "visible" }}
              onClick={() => setSelected(provider)}
            >
              {/* サービス画像。カードは overflow: visible（アバターを枠外に出すため）なので、
                   画像側で上の角を丸めないとカードの円弧からはみ出す */}
              <div
                className="h-32 flex items-center justify-center relative"
                style={{ background: "#dceeff", borderRadius: "19px 19px 0 0" }}
              >
                <div className="absolute inset-0 overflow-hidden" style={{ borderRadius: "19px 19px 0 0" }}>
                  {provider.serviceImageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={provider.serviceImageUrl}
                      alt=""
                      className="w-full h-full object-cover"
                      style={{ imageRendering: "pixelated" }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-5xl opacity-20">🙌</span>
                    </div>
                  )}
                </div>
                <div
                  className="absolute -bottom-6 left-4 w-12 h-12 flex items-center justify-center overflow-hidden z-10"
                  style={{ border: "1px solid #000000", boxShadow: "none", background: "#ffffff" , borderRadius: "20px"}}
                >
                  {provider.profileAvatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={provider.profileAvatarUrl} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <PixelChar type={charType} scale={4} />
                  )}
                </div>
              </div>

              {/* 情報 */}
              <div className="pt-8 px-4 pb-4 flex flex-col gap-3 flex-1">
                <p className="font-ja font-bold text-base" style={{ color: "#000000" }}>
                  {provider.name ?? provider.walletAddress.slice(0, 8) + "..."}
                </p>

                {/* バッジ */}
                <div className="flex flex-wrap gap-1.5">
                  <RoleBadge role={provider.role} />
                  {provider.chainNodeCount > 0 && <StageBadge chainNodeCount={provider.chainNodeCount} />}
                </div>

                <div>
                  <span
                    className="font-display text-[0.7rem] px-2 py-0.5 mb-1.5 inline-block"
                    style={{ background: "#dceeff", border: "1px solid #000000", color: "#4a4a4a" , borderRadius: "1600px"}}
                  >
                    提供できること
                  </span>
                  <p className="font-ja font-medium text-sm" style={{ color: "#000000" }}>
                    {provider.serviceTitle}
                  </p>
                </div>

                <p className="font-ja text-sm leading-relaxed line-clamp-3" style={{ color: "#4a4a4a" }}>
                  {provider.serviceDescription}
                </p>

                <div
                  className="font-display text-center py-2 mt-auto"
                  style={{ background: "#ffffff", border: "1px solid #000000", color: "#4a4a4a", fontSize: "0.7rem" , borderRadius: "20px"}}
                >
                  ▸ タップして詳細を見る
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {selected && (
        <ProviderModal provider={selected} onClose={() => setSelected(null)} />
      )}
    </>
  )
}
