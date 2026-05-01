"use client"

import { useState } from "react"
import Link from "next/link"
import { PixelChar, type CharType } from "@/components/shared/PixelChar"

export type ProviderItem = {
  id: number
  walletAddress: string
  name: string | null
  serviceImageUrl: string | null
  serviceTitle: string
  serviceDescription: string
  status: string
  profileAvatarUrl: string | null
}

const CHARS: CharType[] = ["hero", "warrior", "mage", "villager"]
function charForWallet(wallet: string): CharType {
  const sum = wallet.toLowerCase().split("").reduce((acc, c) => acc + c.charCodeAt(0), 0)
  return CHARS[sum % CHARS.length]
}

function ProviderModal({ provider, onClose }: { provider: ProviderItem; onClose: () => void }) {
  const charType = charForWallet(provider.walletAddress)

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.85)" }}
      onClick={onClose}
    >
      <div
        className="pixel-box w-full max-w-lg max-h-[90vh] overflow-y-auto"
        style={{ background: "#0f1628" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* サービス画像 */}
        <div className="relative h-48 overflow-hidden" style={{ background: "#060610" }}>
          {provider.serviceImageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={provider.serviceImageUrl}
              alt=""
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-6xl opacity-20">🙌</span>
            </div>
          )}

          {/* 閉じるボタン */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center font-pixel cursor-pointer"
            style={{
              background: "rgba(0,0,0,0.8)",
              border: "2px solid #506070",
              color: "#90a0b8",
              fontSize: "0.7rem",
            }}
          >
            ✕
          </button>

          {/* プロフィールアイコン */}
          <div
            className="absolute -bottom-6 left-5 w-14 h-14 flex items-center justify-center overflow-hidden z-10"
            style={{
              border: "3px solid #0052FF",
              boxShadow: "3px 3px 0 #0052FF",
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

        {/* コンテンツ */}
        <div className="pt-10 px-6 pb-6 space-y-5">
          {/* 名前・アドレス */}
          <div>
            <p className="font-ja font-bold text-xl" style={{ color: "#e0e8ff" }}>
              {provider.name ?? provider.walletAddress.slice(0, 8) + "..."}
            </p>
            <p className="font-mono text-xs mt-1" style={{ color: "#3a5a7a" }}>
              {provider.walletAddress}
            </p>
          </div>

          {/* サービスタイトル */}
          <div>
            <span
              className="font-pixel text-[0.72rem] px-2 py-0.5 inline-block mb-2"
              style={{
                background: "#0052FF22",
                border: "2px solid #0052FF",
                color: "#7ab0ff",
              }}
            >
              提供できること
            </span>
            <p className="font-ja font-bold text-lg" style={{ color: "#c0d0e8" }}>
              {provider.serviceTitle}
            </p>
          </div>

          {/* 詳細説明（全文） */}
          <div
            className="p-4"
            style={{ background: "#060610", border: "2px solid #1a2a3a" }}
          >
            <p className="font-pixel text-[0.65rem] mb-2" style={{ color: "#506070" }}>
              DESCRIPTION
            </p>
            <p className="font-ja text-sm leading-relaxed whitespace-pre-wrap" style={{ color: "#90a0b8" }}>
              {provider.serviceDescription}
            </p>
          </div>

          {/* 恩送りボタン */}
          <Link
            href={`/offer/${provider.id}`}
            className="pixel-btn font-pixel block text-center"
            style={{
              background: "#0052FF",
              color: "#fff",
              borderColor: "#000",
              padding: "0.9rem 1rem",
              fontSize: "0.78rem",
            }}
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
              className="pixel-box flex flex-col overflow-visible cursor-pointer"
              style={{ background: "#0f1628" }}
              onClick={() => setSelected(provider)}
            >
              {/* サービス画像エリア */}
              <div
                className="h-32 flex items-center justify-center relative"
                style={{ background: "#060610" }}
              >
                <div className="absolute inset-0 overflow-hidden">
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

                {/* プロフィールアイコン */}
                <div
                  className="absolute -bottom-6 left-4 w-12 h-12 flex items-center justify-center overflow-hidden z-10"
                  style={{
                    border: "3px solid #0052FF",
                    boxShadow: "3px 3px 0 #0052FF",
                    background: "#0a0a1a",
                  }}
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
                <div>
                  <p className="font-ja font-bold text-base" style={{ color: "#e0e8ff" }}>
                    {provider.name ?? provider.walletAddress.slice(0, 8) + "..."}
                  </p>
                  <p className="font-mono text-xs" style={{ color: "#3a5a7a" }}>
                    {provider.walletAddress.slice(0, 6)}...{provider.walletAddress.slice(-4)}
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
                  <p className="font-ja font-medium text-sm" style={{ color: "#c0d0e8" }}>
                    {provider.serviceTitle}
                  </p>
                </div>

                <p className="font-ja text-sm leading-relaxed line-clamp-3" style={{ color: "#607080" }}>
                  {provider.serviceDescription}
                </p>

                {/* クリック誘導 */}
                <div
                  className="font-pixel text-center py-2 mt-auto"
                  style={{
                    background: "#060a18",
                    border: "2px solid #1a2a3a",
                    color: "#3a5a7a",
                    fontSize: "0.65rem",
                  }}
                >
                  ▸ タップして詳細を見る
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* モーダル */}
      {selected && (
        <ProviderModal provider={selected} onClose={() => setSelected(null)} />
      )}
    </>
  )
}
