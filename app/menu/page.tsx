import { db } from "@/lib/db"
import { providers, userProfiles, chainNodes } from "@/lib/db/schema"
import { eq, and, inArray } from "drizzle-orm"
import Link from "next/link"
import { MenuGrid } from "@/components/provider/MenuGrid"
import { getStage } from "@/lib/stages"

export const dynamic = "force-dynamic"

async function getApprovedProviders() {
  const rows = await db
    .select({
      id: providers.id,
      walletAddress: providers.walletAddress,
      name: providers.name,
      bio: providers.bio,
      serviceImageUrl: providers.avatarUrl,
      serviceTitle: providers.serviceTitle,
      serviceDescription: providers.serviceDescription,
      status: providers.status,
      role: providers.role,
      chainId: providers.chainId,
      profileAvatarUrl: userProfiles.avatarUrl,
    })
    .from(providers)
    .leftJoin(userProfiles, eq(providers.walletAddress, userProfiles.walletAddress))
    .where(eq(providers.status, "approved"))

  // チェーンノード数を集計してステージを計算
  const chainIds = [...new Set(rows.map((r) => r.chainId).filter((id): id is number => id !== null))]

  const nodeCounts: Record<number, number> = {}
  if (chainIds.length > 0) {
    const nodes = await db
      .select({ chainId: chainNodes.chainId })
      .from(chainNodes)
      .where(inArray(chainNodes.chainId, chainIds))
    for (const n of nodes) {
      nodeCounts[n.chainId] = (nodeCounts[n.chainId] ?? 0) + 1
    }
  }

  return rows.map((r) => {
    const chainNodeCount = r.chainId ? (nodeCounts[r.chainId] ?? 0) : 0
    return { ...r, chainNodeCount }
  })
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
              恩送りメニューに登録されたメンバーが、スキルや好意を提供してくれます。
            </p>
          </div>
          <div className="flex gap-3 flex-wrap">
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
              ▸ こんな恩送りが欲しい
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
              ▸ 恩送りメニュー登録
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
              NO MENU YET...
            </p>
            <p className="font-ja text-base mb-2" style={{ color: "#90a0b8" }}>
              現在掲載中の恩送りメニューはありません。
            </p>
            <p className="font-ja text-sm mb-8" style={{ color: "#506070" }}>
              最初に登録しませんか？
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
              ▸ 恩送りメニューに登録する
            </Link>
          </div>
        ) : (
          <MenuGrid providers={approvedProviders} />
        )}
      </div>
    </div>
  )
}
