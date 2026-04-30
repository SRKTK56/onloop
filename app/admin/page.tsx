import { db } from "@/lib/db"
import { providers, serviceRequests } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

async function checkAdmin() {
  const headersList = await headers()
  const secret = headersList.get("x-admin-secret")
  // 簡易認証：本番ではより堅牢な認証を実装すること
  if (secret !== process.env.ADMIN_SECRET) redirect("/")
}

export default async function AdminPage() {
  await checkAdmin()

  const pending = await db
    .select()
    .from(providers)
    .where(eq(providers.status, "pending"))

  const openRequests = await db
    .select()
    .from(serviceRequests)
    .where(eq(serviceRequests.status, "open"))

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">管理ダッシュボード</h1>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">審査待ちのギバー申請</p>
            <p className="text-4xl font-bold">{pending.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">未対応のサービスリクエスト</p>
            <p className="text-4xl font-bold">{openRequests.length}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">ギバー申請</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {pending.length === 0 ? (
              <p className="text-muted-foreground text-sm">審査待ちの申請はありません。</p>
            ) : (
              pending.map((p) => (
                <div key={p.id} className="border rounded-xl p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-sm">{p.serviceTitle}</p>
                    <Badge variant="secondary">審査待ち</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground font-mono">
                    {p.walletAddress.slice(0, 12)}...
                  </p>
                  <Link href={`/admin/applications/${p.id}`} className={cn(buttonVariants({ size: "sm" }), "w-full text-center")}>
                    詳細・承認
                  </Link>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">サービスリクエスト</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {openRequests.length === 0 ? (
              <p className="text-muted-foreground text-sm">未対応のリクエストはありません。</p>
            ) : (
              openRequests.map((r) => (
                <div key={r.id} className="border rounded-xl p-3 space-y-1">
                  <p className="text-sm">{r.description}</p>
                  {r.requesterEmail && (
                    <p className="text-xs text-muted-foreground">{r.requesterEmail}</p>
                  )}
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
