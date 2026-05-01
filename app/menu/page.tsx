import { db } from "@/lib/db"
import { providers } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import Link from "next/link"

export const dynamic = "force-dynamic"

async function getApprovedProviders() {
  return db.select().from(providers).where(eq(providers.status, "approved"))
}

export default async function MenuPage() {
  const approvedProviders = await getApprovedProviders()

  return (
    <div className="min-h-screen" style={{ background: "#0a0a1a" }}>
      <div className="max-w-5xl mx-auto px-4 py-12">

        {/* ヘッダー */}
        <div className="flex items-start justify-between mb-10 flex-wrap gap-4">
          <div>
            <h1
              className="font-pixel mb-3 leading-loose"
              style={{ fontSize: "1rem", color: "#fff", textShadow: "3px 3px 0 #0052FF" }}
            >
              恩送りメニュー
            </h1>
            <p className="font-ja text-base" style={{ color: "#90a0b8" }}>
              審査済みのギバーが、スキルや好意を提供してくれます。
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/request"
              className="pixel-btn font-pixel"
              style={{
                background: "#0a0a1a",
                color: "#7ab0ff",
                borderColor: "#0052FF",
                boxShadow: "3px 3px 0 #0052FF",
                padding: "0.5rem 1rem",
                fontSize: "0.55rem",
              }}
            >
              ▸ こんなギバーが欲しい
            </Link>
            <Link
              href="/provider/apply"
              className="pixel-btn font-pixel"
              style={{
                background: "#0052FF",
                color: "#fff",
                borderColor: "#000",
                padding: "0.5rem 1rem",
                fontSize: "0.55rem",
              }}
            >
              ▸ ギバー登録
            </Link>
          </div>
        </div>

        {/* 空の場合 */}
        {approvedProviders.length === 0 ? (
          <div
            className="pixel-box text-center py-20"
            style={{ background: "#0f1628" }}
          >
            <p className="font-pixel text-[0.6rem] mb-4" style={{ color: "#3a6080" }}>
              NO GIVERS YET...
            </p>
            <p className="font-ja text-base mb-2" style={{ color: "#90a0b8" }}>
              現在掲載中のギバーはいません。
            </p>
            <p className="font-ja text-sm mb-8" style={{ color: "#506070" }}>
              最初のギバーになりませんか？
            </p>
            <Link
              href="/provider/apply"
              className="pixel-btn font-pixel"
              style={{
                background: "#0052FF",
                color: "#fff",
                borderColor: "#000",
                padding: "0.75rem 1.5rem",
                fontSize: "0.6rem",
              }}
            >
              ▸ ギバーとして登録する
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {approvedProviders.map((provider) => (
              <div
                key={provider.id}
                className="pixel-box flex flex-col overflow-hidden"
                style={{ background: "#0f1628" }}
              >
                {/* カバー画像 */}
                <div
                  className="h-32 flex items-center justify-center relative overflow-hidden"
                  style={{ background: "#060610" }}
                >
                  {provider.avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={provider.avatarUrl}
                      alt={provider.name ?? ""}
                      className="w-full h-full object-cover"
                      style={{ imageRendering: "pixelated" }}
                    />
                  ) : (
                    <span className="text-5xl opacity-20">🙌</span>
                  )}
                  {/* アバターアイコン */}
                  <div
                    className="absolute -bottom-5 left-4 w-12 h-12 overflow-hidden"
                    style={{
                      border: "3px solid #0052FF",
                      boxShadow: "3px 3px 0 #0052FF",
                      background: "#0a0a1a",
                    }}
                  >
                    {provider.avatarUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={provider.avatarUrl} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div
                        className="w-full h-full flex items-center justify-center font-pixel text-sm"
                        style={{ background: "#0a1628", color: "#0052FF" }}
                      >
                        {(provider.name ?? "?")[0].toUpperCase()}
                      </div>
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
                      className="font-pixel text-[0.45rem] px-2 py-0.5 mb-1.5 inline-block"
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

                  <Link
                    href={`/offer/${provider.id}`}
                    className="pixel-btn font-pixel text-center mt-auto"
                    style={{
                      background: "#0a0a1a",
                      color: "#7ab0ff",
                      borderColor: "#0052FF",
                      boxShadow: "3px 3px 0 #0052FF",
                      padding: "0.6rem 1rem",
                      fontSize: "0.5rem",
                      display: "block",
                    }}
                  >
                    ▸ 恩送りをお願いする
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
