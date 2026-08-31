import { db } from "@/lib/db"
import { providers, interviews } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { notFound, redirect } from "next/navigation"
import Link from "next/link"

type Props = { params: Promise<{ id: string }> }

export default async function ApplicationDetailPage({ params }: Props) {
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
    pending: "#ffd731",
    approved: "#55db9c",
    rejected: "#ff4d6d",
  }
  const statusLabel: Record<string, string> = {
    pending: "審査待ち",
    approved: "承認済み",
    rejected: "却下",
  }

  return (
    <div className="min-h-screen" style={{ background: "#ffffff" }}>
      <div className="max-w-2xl mx-auto px-4 py-12">

        {/* ヘッダー */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/admin"
            className="font-display text-[0.7rem]"
            style={{ color: "#4a4a4a" }}
          >
            ← 管理TOP
          </Link>
          <h1
            className="font-display leading-loose"
            style={{ fontSize: "0.9rem", color: "#000000", textShadow: "none"}}
          >
            申請詳細
          </h1>
          <span
            className="font-display text-[0.7rem] px-2 py-0.5"
            style={{
              background: `${statusColor[provider.status] ?? "#506070"}22`,
              border: `1px solid ${statusColor[provider.status] ?? "#000000"}`,
              color: statusColor[provider.status] ?? "#4a4a4a", borderRadius: "1600px"}}
          >
            {statusLabel[provider.status] ?? provider.status}
          </span>
        </div>

        {/* 申請情報 */}
        <div className="slush-card p-6 space-y-5 mb-6" style={{ background: "#ffffff" }}>
          <div>
            <p className="font-display text-[0.7rem] mb-1" style={{ color: "#4a4a4a" }}>WALLET</p>
            <p className="font-mono text-sm" style={{ color: "#4a4a4a" }}>{provider.walletAddress}</p>
          </div>
          {provider.name && (
            <div>
              <p className="font-display text-[0.7rem] mb-1" style={{ color: "#4a4a4a" }}>NAME</p>
              <p className="font-ja text-base" style={{ color: "#000000" }}>{provider.name}</p>
            </div>
          )}
          {provider.avatarUrl && (
            <div>
              <p className="font-display text-[0.7rem] mb-2" style={{ color: "#4a4a4a" }}>SERVICE IMAGE</p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={provider.avatarUrl} alt="" className="h-32 object-cover w-full" style={{ imageRendering: "pixelated" }} />
            </div>
          )}
          <div>
            <p className="font-display text-[0.7rem] mb-1" style={{ color: "#4a4a4a" }}>SERVICE TITLE</p>
            <p className="font-ja font-bold text-base" style={{ color: "#000000" }}>{provider.serviceTitle}</p>
          </div>
          <div>
            <p className="font-display text-[0.7rem] mb-1" style={{ color: "#4a4a4a" }}>DESCRIPTION</p>
            <p className="font-ja text-sm leading-relaxed whitespace-pre-wrap" style={{ color: "#4a4a4a" }}>
              {provider.serviceDescription}
            </p>
          </div>
          {provider.bio && (
            <div>
              <p className="font-display text-[0.7rem] mb-1" style={{ color: "#4a4a4a" }}>BIO</p>
              <p className="font-ja text-sm leading-relaxed" style={{ color: "#4a4a4a" }}>{provider.bio}</p>
            </div>
          )}
          <div>
            <p className="font-display text-[0.7rem] mb-1" style={{ color: "#4a4a4a" }}>APPLIED</p>
            <p className="font-ja text-sm" style={{ color: "#4a4a4a" }}>{provider.createdAt.toLocaleDateString("ja-JP")}</p>
          </div>
        </div>

        {/* 面談セクション */}
        <div className="slush-card p-5 mb-6" style={{ background: "#ffffff", borderColor: "#000000", boxShadow: "none", borderRadius: "20px"}}>
          <p className="font-display text-[0.72rem] mb-4" style={{ color: "#000000" }}>
            面談管理
          </p>

          {latestInterview ? (
            <div className="space-y-4">
              {/* 既存の面談情報 */}
              <div className="p-3 space-y-2" style={{ background: "#ffffff", border: "1px solid #000000" , borderRadius: "20px"}}>
                <div className="flex items-center justify-between">
                  <span className="font-display text-[0.7rem]" style={{ color: "#4a4a4a" }}>
                    面談ステータス
                  </span>
                  <span
                    className="font-display text-[0.7rem] px-2 py-0.5"
                    style={{
                      background: latestInterview.status === "completed" ? "#052a10" : "#1a1000",
                      border: `1px solid ${latestInterview.status === "completed" ? "#55db9c" : "#ffd731"}`,
                      color: latestInterview.status === "completed" ? "#000000" : "#000000", borderRadius: "1600px"}}
                  >
                    {latestInterview.status === "completed" ? "完了" : "設定済み・未実施"}
                  </span>
                </div>
                <p className="font-ja text-sm" style={{ color: "#4a4a4a" }}>
                  設定日: {latestInterview.requestedAt.toLocaleDateString("ja-JP")}
                </p>
                {latestInterview.notes && (
                  <div>
                    <p className="font-display text-[0.7rem] mb-1" style={{ color: "#4a4a4a" }}>メモ / URL</p>
                    <p className="font-ja text-sm break-all" style={{ color: "#4a4a4a" }}>
                      {latestInterview.notes}
                    </p>
                  </div>
                )}
              </div>

              {latestInterview.status !== "completed" && (
                <form action={completeInterview.bind(null, latestInterview.id)}>
                  <button
                    type="submit"
                    className="slush-btn font-display w-full cursor-pointer"
                    style={{
                      background: "#ddf7ea",
                      color: "#000000",
                      borderColor: "#000000",
                      boxShadow: "none",
                      padding: "0.6rem 1rem",
                      fontSize: "0.7rem", borderRadius: "1600px"}}
                  >
                    ▸ 面談完了としてマーク
                  </button>
                </form>
              )}
            </div>
          ) : (
            /* 面談未設定 → 設定フォーム */
            <form action={requestInterview} className="space-y-3">
              <p className="font-ja text-sm" style={{ color: "#4a4a4a" }}>
                面談が必要と判断した場合は、URLやメモを入力して設定してください。
              </p>
              <textarea
                name="notes"
                rows={3}
                placeholder="Calendly URL / 日程調整リンク / メモ（任意）"
                className="w-full font-ja text-sm p-3"
                style={{
                  background: "#ffffff",
                  border: "1px solid #000000",
                  color: "#4a4a4a",
                  resize: "vertical",
                  outline: "none",
                  borderRadius: "20px"}}
              />
              <button
                type="submit"
                className="slush-btn font-display w-full cursor-pointer"
                style={{
                  background: "#fff3cf",
                  color: "#000000",
                  borderColor: "#000000",
                  boxShadow: "none",
                  padding: "0.6rem 1rem",
                  fontSize: "0.7rem", borderRadius: "1600px"}}
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
                className="slush-btn font-display w-full cursor-pointer"
                style={{
                  background: "#000000",
                  color: "#fff",
                  borderColor: "#000000",
                  padding: "0.8rem",
                  fontSize: "0.72rem", borderRadius: "1600px"}}
              >
                ▸ 承認してメニューに掲載
              </button>
            </form>
            <form action={reject} className="flex-1">
              <button
                type="submit"
                className="slush-btn font-display w-full cursor-pointer"
                style={{
                  background: "#ffe3d8",
                  color: "#fb4903",
                  borderColor: "#fb4903",
                  boxShadow: "none",
                  padding: "0.8rem",
                  fontSize: "0.72rem", borderRadius: "1600px"}}
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
