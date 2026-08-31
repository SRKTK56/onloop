import { db } from "@/lib/db"
import { providers, userProfiles, chainNodes } from "@/lib/db/schema"
import { eq, and, inArray } from "drizzle-orm"
import Link from "next/link"
import { PageHead } from "@/components/shared/PageHead"
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
    <div className="min-h-screen band-paper">
      <PageHead
        en="KINDNESS MENU"
        ja="恩送りメニュー"
        sub="恩送りメニューに登録されたメンバーが、スキルや好意を提供してくれます。"
        band="sky"
      >
        <Link href="/start" className="slush-btn font-ja" style={{ fontWeight: 700 }}>
          ▸ 恩送りをはじめる
        </Link>
        <Link href="/request" className="slush-btn slush-btn-ghost font-ja" style={{ fontWeight: 700 }}>
          ▸ こんな恩送りが欲しい
        </Link>
      </PageHead>

      <div className="max-w-5xl mx-auto px-5 py-12">
        {/* 空の場合 */}
        {approvedProviders.length === 0 ? (
          <div
            className="slush-card text-center py-20"
            style={{ background: "#ffffff" }}
          >
            <p className="font-display text-[0.82rem] mb-4" style={{ color: "#4a4a4a" }}>
              NO MENU YET...
            </p>
            <p className="font-ja text-base mb-2" style={{ color: "#4a4a4a" }}>
              現在掲載中の恩送りメニューはありません。
            </p>
            <p className="font-ja text-sm mb-8" style={{ color: "#4a4a4a" }}>
              最初に登録しませんか？
            </p>
            <Link
              href="/provider/apply"
              className="slush-btn font-display"
              style={{
                background: "#000000",
                color: "#fff",
                borderColor: "#000000",
                padding: "0.75rem 1.5rem",
                fontSize: "0.8rem", borderRadius: "1600px"}}
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
