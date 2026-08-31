import { db } from "@/lib/db"
import { providers, serviceRequests } from "@/lib/db/schema"
import { eq, not } from "drizzle-orm"
import Link from "next/link"
import { PageHead } from "@/components/shared/PageHead"
import { MenuImageSeeder } from "@/components/admin/MenuImageSeeder"

export const dynamic = "force-dynamic"

export default async function AdminPage() {
  const pending = await db.select().from(providers).where(eq(providers.status, "pending"))
  const approved = await db.select().from(providers).where(eq(providers.status, "approved"))
  const openRequests = await db.select().from(serviceRequests).where(eq(serviceRequests.status, "open"))

  const statusColor: Record<string, string> = {
    pending: "#ffd731",
    approved: "#55db9c",
    rejected: "#ff4d6d",
  }
  const statusLabel: Record<string, string> = {
    pending: "審査待ち",
    approved: "承認済み",
    rejected: "却下",
  }

  const allProviders = await db.select().from(providers)

  return (
    <div className="min-h-screen band-paper">
      <PageHead en="ADMIN" ja="⚙ メニュー管理" band="concrete" />
      <div className="max-w-5xl mx-auto px-5 py-12">

        {/* サマリー */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          {[
            { label: "審査待ち", value: pending.length, color: "#ffd731" },
            { label: "承認済みギバー", value: approved.length, color: "#55db9c" },
            { label: "未対応リクエスト", value: openRequests.length, color: "#4da2ff" },
          ].map((s) => (
            <div
              key={s.label}
              className="slush-card p-4 text-center"
              style={{ background: "#ffffff", borderColor: s.color, boxShadow: "none", borderRadius: "20px"}}
            >
              <p className="font-display text-[0.7rem] mb-2" style={{ color: "#000000" }}>{s.label}</p>
              <p className="font-display" style={{ fontSize: "2rem", color: "#000000" }}>{s.value}</p>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">

          {/* ギバー申請一覧 */}
          <div className="slush-card p-5" style={{ background: "#ffffff" }}>
            <p className="font-display text-[0.72rem] mb-5" style={{ color: "#000000" }}>
              ギバー申請一覧
            </p>
            {allProviders.length === 0 ? (
              <p className="font-ja text-sm" style={{ color: "#4a4a4a" }}>申請はありません</p>
            ) : (
              <div className="space-y-3">
                {allProviders.map((p) => (
                  <div
                    key={p.id}
                    className="p-3 space-y-2"
                    style={{ background: "#dceeff", border: "1px solid #000000" , borderRadius: "20px"}}
                  >
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <p className="font-ja font-medium text-sm" style={{ color: "#000000" }}>
                        {p.serviceTitle}
                      </p>
                      <span
                        className="font-display text-[0.7rem] px-2 py-0.5 shrink-0"
                        style={{
                          background: `${statusColor[p.status] ?? "#506070"}22`,
                          border: `1px solid ${statusColor[p.status] ?? "#000000"}`,
                          color: statusColor[p.status] ?? "#4a4a4a", borderRadius: "1600px"}}
                      >
                        {statusLabel[p.status] ?? p.status}
                      </span>
                    </div>
                    <p className="font-mono text-xs" style={{ color: "#4a4a4a" }}>
                      {p.walletAddress.slice(0, 12)}...
                    </p>
                    <Link
                      href={`/admin/applications/${p.id}`}
                      className="slush-btn font-display block text-center"
                      style={{
                        background: "#ffffff",
                        color: "#4a4a4a",
                        borderColor: "#000000",
                        boxShadow: "none",
                        padding: "0.4rem 0.8rem",
                        fontSize: "0.7rem", borderRadius: "1600px"}}
                    >
                      ▸ 詳細・承認
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* サービスリクエスト */}
          <div className="slush-card p-5" style={{ background: "#ffffff" }}>
            <p className="font-display text-[0.72rem] mb-5" style={{ color: "#5c4ade" }}>
              サービスリクエスト
            </p>
            {openRequests.length === 0 ? (
              <p className="font-ja text-sm" style={{ color: "#4a4a4a" }}>未対応のリクエストはありません</p>
            ) : (
              <div className="space-y-3">
                {openRequests.map((r) => (
                  <div
                    key={r.id}
                    className="p-3 space-y-1"
                    style={{ background: "#dceeff", border: "1px solid #000000" , borderRadius: "20px"}}
                  >
                    <p className="font-ja text-sm" style={{ color: "#000000" }}>{r.description}</p>
                    {r.requesterEmail && (
                      <p className="font-mono text-xs" style={{ color: "#4a4a4a" }}>{r.requesterEmail}</p>
                    )}
                    <p className="font-display text-[0.7rem]" style={{ color: "#4a4a4a" }}>
                      {r.createdAt.toLocaleDateString("ja-JP")}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* メニュー画像管理 */}
        <div className="mt-10">
          <h2
            className="font-display mb-2 leading-loose"
            style={{ fontSize: "0.85rem", color: "#4a4a4a", textShadow: "none"}}
          >
            🖼 メニュー画像管理
          </h2>
          <p className="font-ja text-sm mb-4" style={{ color: "#4a4a4a" }}>
            画像が未設定のメニューにSVG画像を自動生成してLighthouseに保存します
          </p>
          <div className="slush-card p-5" style={{ background: "#ffffff" }}>
            <MenuImageSeeder />
          </div>
        </div>

      </div>
    </div>
  )
}
