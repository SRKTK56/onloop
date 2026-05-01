import { db } from "@/lib/db"
import { providers, userProfiles } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import Link from "next/link"
import { PixelChar, type CharType } from "@/components/shared/PixelChar"

export const dynamic = "force-dynamic"

// ウォレットアドレスから毎回同じキャラを返す（ランダムだが一意）
const CHARS: CharType[] = ["hero", "warrior", "mage", "villager"]
function charForWallet(wallet: string): CharType {
  const sum = wallet.toLowerCase().split("").reduce((acc, c) => acc + c.charCodeAt(0), 0)
  return CHARS[sum % CHARS.length]
}

async function getApprovedProviders() {
  return db
    .select({
      id: providers.id,
      walletAddress: providers.walletAddress,
      name: providers.name,
      serviceImageUrl: providers.avatarUrl,      // サービス画像
      serviceTitle: providers.serviceTitle,
      serviceDescription: providers.serviceDescription,
      status: providers.status,
      profileAvatarUrl: userProfiles.avatarUrl,  // プロフィールアイコン
    })
    .from(providers)
    .leftJoin(userProfiles, eq(providers.walletAddress, userProfiles.walletAddress))
    .where(eq(providers.status, "approved"))
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
                fontSize: "0.75rem",
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
                fontSize: "0.75rem",
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
            <p className="font-pixel text-[0.82rem] mb-4" style={{ color: "#3a6080" }}>
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
                fontSize: "0.8rem",
              }}
            >
              ▸ ギバーとして登録する
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {approvedProviders.map((provider) => {
              const charType = charForWallet(provider.walletAddress)

              return (
                <div
                  key={provider.id}
                  className="pixel-box flex flex-col overflow-hidden"
                  style={{ background: "#0f1628" }}
                >
                  {/* サービス画像エリア（overflow-hiddenなし → アバターが見切れない） */}
                  <div
                    className="h-32 flex items-center justify-center relative"
                    style={{ background: "#060610" }}
                  >
                    {/* 画像だけを別コンテナでクリップ */}
                    <div className="absolute inset-0 overflow-hidden">
                      {provider.serviceImageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={provider.serviceImageUrl}
                          alt={provider.name ?? ""}
                          className="w-full h-full object-cover"
                          style={{ imageRendering: "pixelated" }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-5xl opacity-20">🙌</span>
                        </div>
                      )}
                    </div>

                    {/* プロフィールアイコン（カバー外にはみ出してOK） */}
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
                        <img
                          src={provider.profileAvatarUrl}
                          alt=""
                          className="w-full h-full object-cover"
                        />
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

                    <Link
                      href={`/offer/${provider.id}`}
                      className="pixel-btn font-pixel text-center mt-auto"
                      style={{
                        background: "#0a0a1a",
                        color: "#7ab0ff",
                        borderColor: "#0052FF",
                        boxShadow: "3px 3px 0 #0052FF",
                        padding: "0.6rem 1rem",
                        fontSize: "0.72rem",
                        display: "block",
                      }}
                    >
                      ▸ 恩送りをお願いする
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
