import { db } from "@/lib/db"
import { providers, interviews } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { notFound, redirect } from "next/navigation"
import { headers } from "next/headers"
import Link from "next/link"

async function checkAdmin() {
  const headersList = await headers()
  const secret = headersList.get("x-admin-secret")
  if (secret !== process.env.ADMIN_SECRET) redirect("/")
}

type Props = { params: Promise<{ id: string }> }

export default async function ApplicationDetailPage({ params }: Props) {
  await checkAdmin()
  const { id } = await params
  const providerId = parseInt(id)

  const [provider] = await db.select().from(providers).where(eq(providers.id, providerId))
  if (!provider) notFound()

  const existingInterviews = await db
    .select()
    .from(interviews)
    .where(eq(interviews.providerId, providerId))

  const latestInterview = existingInterviews[existingInterviews.length - 1] ?? null

  async function approve() {
    "use server"
    await db.update(providers).set({ status: "approved" }).where(eq(providers.id, providerId))
    redirect("/admin")
  }

  async function reject() {
    "use server"
    await db.update(providers).set({ status: "rejected" }).where(eq(providers.id, providerId))
    redirect("/admin")
  }

  async function requestInterview(formData: FormData) {
    "use server"
    const notes = formData.get("notes") as string | null
    await db.insert(interviews).values({
      providerId,
      notes: notes || null,
      status: "requested",
    })
    redirect(`/admin/applications/${id}`)
  }

  async function completeInterview(interviewId: number) {
    "use server"
    await db
      .update(interviews)
      .set({ status: "completed", scheduledAt: new Date() })
      .where(eq(interviews.id, interviewId))
    redirect(`/admin/applications/${id}`)
  }

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

  return (
    <div className="min-h-screen" style={{ background: "#0a0a1a" }}>
      <div className="max-w-2xl mx-auto px-4 py-12">

        {/* ヘッダー */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/admin"
            className="font-pixel text-[0.65rem]"
            style={{ color: "#506070" }}
          >
            ← 管理TOP
          </Link>
          <h1
            className="font-pixel leading-loose"
            style={{ fontSize: "0.9rem", color: "#fff", textShadow: "3px 3px 0 #0052FF" }}
          >
            申請詳細
          </h1>
          <span
            className="font-pixel text-[0.65rem] px-2 py-0.5"
            style={{
              background: `${statusColor[provider.status] ?? "#506070"}22`,
              border: `2px solid ${statusColor[provider.status] ?? "#506070"}`,
              color: statusColor[provider.status] ?? "#506070",
            }}
          >
            {statusLabel[provider.status] ?? provider.status}
          </span>
        </div>

        {/* 申請情報 */}
        <div className="pixel-box p-6 space-y-5 mb-6" style={{ background: "#0f1628" }}>
          <div>
            <p className="font-pixel text-[0.65rem] mb-1" style={{ color: "#506070" }}>WALLET</p>
            <p className="font-mono text-sm" style={{ color: "#7ab0ff" }}>{provider.walletAddress}</p>
          </div>
          {provider.name && (
            <div>
              <p className="font-pixel text-[0.65rem] mb-1" style={{ color: "#506070" }}>NAME</p>
              <p className="font-ja text-base" style={{ color: "#e0e8ff" }}>{provider.name}</p>
            </div>
          )}
          {provider.avatarUrl && (
            <div>
              <p className="font-pixel text-[0.65rem] mb-2" style={{ color: "#506070" }}>SERVICE IMAGE</p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={provider.avatarUrl} alt="" className="h-32 object-cover w-full" style={{ imageRendering: "pixelated" }} />
            </div>
          )}
          <div>
            <p className="font-pixel text-[0.65rem] mb-1" style={{ color: "#506070" }}>SERVICE TITLE</p>
            <p className="font-ja font-bold text-base" style={{ color: "#c0d0e8" }}>{provider.serviceTitle}</p>
          </div>
          <div>
            <p className="font-pixel text-[0.65rem] mb-1" style={{ color: "#506070" }}>DESCRIPTION</p>
            <p className="font-ja text-sm leading-relaxed whitespace-pre-wrap" style={{ color: "#90a0b8" }}>
              {provider.serviceDescription}
            </p>
          </div>
          {provider.bio && (
            <div>
              <p className="font-pixel text-[0.65rem] mb-1" style={{ color: "#506070" }}>BIO</p>
              <p className="font-ja text-sm leading-relaxed" style={{ color: "#90a0b8" }}>{provider.bio}</p>
            </div>
          )}
          <div>
            <p className="font-pixel text-[0.65rem] mb-1" style={{ color: "#506070" }}>APPLIED</p>
            <p className="font-ja text-sm" style={{ color: "#506070" }}>{provider.createdAt.toLocaleDateString("ja-JP")}</p>
          </div>
        </div>

        {/* 面談セクション */}
        <div className="pixel-box p-5 mb-6" style={{ background: "#0f1420", borderColor: "#aa8800", boxShadow: "4px 4px 0 #aa8800" }}>
          <p className="font-pixel text-[0.72rem] mb-4" style={{ color: "#ffcc00" }}>
            面談管理
          </p>

          {latestInterview ? (
            <div className="space-y-4">
              {/* 既存の面談情報 */}
              <div className="p-3 space-y-2" style={{ background: "#0a0800", border: "2px solid #554400" }}>
                <div className="flex items-center justify-between">
                  <span className="font-pixel text-[0.65rem]" style={{ color: "#aa8800" }}>
                    面談ステータス
                  </span>
                  <span
                    className="font-pixel text-[0.65rem] px-2 py-0.5"
                    style={{
                      background: latestInterview.status === "completed" ? "#052a10" : "#1a1000",
                      border: `2px solid ${latestInterview.status === "completed" ? "#52b788" : "#aa8800"}`,
                      color: latestInterview.status === "completed" ? "#52b788" : "#ffcc00",
                    }}
                  >
                    {latestInterview.status === "completed" ? "完了" : "設定済み・未実施"}
                  </span>
                </div>
                <p className="font-ja text-xs" style={{ color: "#806040" }}>
                  設定日: {latestInterview.requestedAt.toLocaleDateString("ja-JP")}
                </p>
                {latestInterview.notes && (
                  <div>
                    <p className="font-pixel text-[0.6rem] mb-1" style={{ color: "#806040" }}>メモ / URL</p>
                    <p className="font-ja text-sm break-all" style={{ color: "#c0a060" }}>
                      {latestInterview.notes}
                    </p>
                  </div>
                )}
              </div>

              {latestInterview.status !== "completed" && (
                <form action={completeInterview.bind(null, latestInterview.id)}>
                  <button
                    type="submit"
                    className="pixel-btn font-pixel w-full cursor-pointer"
                    style={{
                      background: "#052a10",
                      color: "#52b788",
                      borderColor: "#52b788",
                      boxShadow: "3px 3px 0 #52b788",
                      padding: "0.6rem 1rem",
                      fontSize: "0.65rem",
                    }}
                  >
                    ▸ 面談完了としてマーク
                  </button>
                </form>
              )}
            </div>
          ) : (
            /* 面談未設定 → 設定フォーム */
            <form action={requestInterview} className="space-y-3">
              <p className="font-ja text-sm" style={{ color: "#806040" }}>
                面談が必要と判断した場合は、URLやメモを入力して設定してください。
              </p>
              <textarea
                name="notes"
                rows={3}
                placeholder="Calendly URL / 日程調整リンク / メモ（任意）"
                className="w-full font-ja text-sm p-3"
                style={{
                  background: "#0a0800",
                  border: "2px solid #554400",
                  color: "#c0a060",
                  resize: "vertical",
                  outline: "none",
                  borderRadius: 0,
                }}
              />
              <button
                type="submit"
                className="pixel-btn font-pixel w-full cursor-pointer"
                style={{
                  background: "#2a1800",
                  color: "#ffcc00",
                  borderColor: "#aa8800",
                  boxShadow: "3px 3px 0 #aa8800",
                  padding: "0.6rem 1rem",
                  fontSize: "0.65rem",
                }}
              >
                ▸ 面談を設定する
              </button>
            </form>
          )}
        </div>

        {/* 承認・却下アクション */}
        {provider.status === "pending" && (
          <div className="flex gap-4">
            <form action={approve} className="flex-1">
              <button
                type="submit"
                className="pixel-btn font-pixel w-full cursor-pointer"
                style={{
                  background: "#0052FF",
                  color: "#fff",
                  borderColor: "#000",
                  padding: "0.8rem",
                  fontSize: "0.72rem",
                }}
              >
                ▸ 承認してメニューに掲載
              </button>
            </form>
            <form action={reject} className="flex-1">
              <button
                type="submit"
                className="pixel-btn font-pixel w-full cursor-pointer"
                style={{
                  background: "#2a0808",
                  color: "#e63946",
                  borderColor: "#e63946",
                  boxShadow: "3px 3px 0 #e63946",
                  padding: "0.8rem",
                  fontSize: "0.72rem",
                }}
              >
                ▸ 却下
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
