import { db } from "@/lib/db"
import { providers, serviceRequests } from "@/lib/db/schema"
import { eq, not } from "drizzle-orm"
import Link from "next/link"

export const dynamic = "force-dynamic"

export default async function AdminPage() {
  const pending = await db.select().from(providers).where(eq(providers.status, "pending"))
  const approved = await db.select().from(providers).where(eq(providers.status, "approved"))
  const openRequests = await db.select().from(serviceRequests).where(eq(serviceRequests.status, "open"))

  const statusColor: Record<string, string> = {
    pending: "#aa8800",
    approved: "#52b788",
    rejected: "#e63946",
  }
  const statusLabel: Record<string, string> = {
    pending: "審査待ち",
    approved: "承認済み",
    rejected: "却下",
  }

  const allProviders = await db.select().from(providers)

  return (
    <div className="min-h-screen" style={{ background: "#0a0a1a" }}>
      <div className="max-w-5xl mx-auto px-4 py-12">

        <h1
          className="font-pixel mb-10 leading-loose"
          style={{ fontSize: "1rem", color: "#ffcc00", textShadow: "3px 3px 0 #aa8800" }}
        >
          ⚙ 管理ダッシュボード
        </h1>

        {/* サマリー */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          {[
            { label: "審査待ち", value: pending.length, color: "#aa8800" },
            { label: "承認済みギバー", value: approved.length, color: "#52b788" },
            { label: "未対応リクエスト", value: openRequests.length, color: "#4361ee" },
          ].map((s) => (
            <div
              key={s.label}
              className="pixel-box p-4 text-center"
              style={{ background: "#0f1628", borderColor: s.color, boxShadow: `3px 3px 0 ${s.color}` }}
            >
              <p className="font-pixel text-[0.55rem] mb-2" style={{ color: s.color }}>{s.label}</p>
              <p className="font-pixel" style={{ fontSize: "2rem", color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">

          {/* ギバー申請一覧 */}
          <div className="pixel-box p-5" style={{ background: "#0f1628" }}>
            <p className="font-pixel text-[0.72rem] mb-5" style={{ color: "#0052FF" }}>
              ギバー申請一覧
            </p>
            {allProviders.length === 0 ? (
              <p className="font-ja text-sm" style={{ color: "#304050" }}>申請はありません</p>
            ) : (
              <div className="space-y-3">
                {allProviders.map((p) => (
                  <div
                    key={p.id}
                    className="p-3 space-y-2"
                    style={{ background: "#060610", border: "2px solid #1a2a3a" }}
                  >
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <p className="font-ja font-medium text-sm" style={{ color: "#c0d0e8" }}>
                        {p.serviceTitle}
                      </p>
                      <span
                        className="font-pixel text-[0.55rem] px-2 py-0.5 shrink-0"
                        style={{
                          background: `${statusColor[p.status] ?? "#506070"}22`,
                          border: `2px solid ${statusColor[p.status] ?? "#506070"}`,
                          color: statusColor[p.status] ?? "#506070",
                        }}
                      >
                        {statusLabel[p.status] ?? p.status}
                      </span>
                    </div>
                    <p className="font-mono text-xs" style={{ color: "#3a5a7a" }}>
                      {p.walletAddress.slice(0, 12)}...
                    </p>
                    <Link
                      href={`/admin/applications/${p.id}`}
                      className="pixel-btn font-pixel block text-center"
                      style={{
                        background: "#0a0a1a",
                        color: "#7ab0ff",
                        borderColor: "#0052FF",
                        boxShadow: "2px 2px 0 #0052FF",
                        padding: "0.4rem 0.8rem",
                        fontSize: "0.6rem",
                      }}
                    >
                      ▸ 詳細・承認
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* サービスリクエスト */}
          <div className="pixel-box p-5" style={{ background: "#0f1628" }}>
            <p className="font-pixel text-[0.72rem] mb-5" style={{ color: "#4361ee" }}>
              サービスリクエスト
            </p>
            {openRequests.length === 0 ? (
              <p className="font-ja text-sm" style={{ color: "#304050" }}>未対応のリクエストはありません</p>
            ) : (
              <div className="space-y-3">
                {openRequests.map((r) => (
                  <div
                    key={r.id}
                    className="p-3 space-y-1"
                    style={{ background: "#060610", border: "2px solid #1a2a3a" }}
                  >
                    <p className="font-ja text-sm" style={{ color: "#c0d0e8" }}>{r.description}</p>
                    {r.requesterEmail && (
                      <p className="font-mono text-xs" style={{ color: "#3a5a7a" }}>{r.requesterEmail}</p>
                    )}
                    <p className="font-pixel text-[0.55rem]" style={{ color: "#304050" }}>
                      {r.createdAt.toLocaleDateString("ja-JP")}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
