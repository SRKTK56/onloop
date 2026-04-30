import { db } from "@/lib/db"
import { providers } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { notFound, redirect } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { headers } from "next/headers"

async function checkAdmin() {
  const headersList = await headers()
  const secret = headersList.get("x-admin-secret")
  if (secret !== process.env.ADMIN_SECRET) redirect("/")
}

type Props = { params: Promise<{ id: string }> }

export default async function ApplicationDetailPage({ params }: Props) {
  await checkAdmin()
  const { id } = await params
  const [provider] = await db
    .select()
    .from(providers)
    .where(eq(providers.id, parseInt(id)))

  if (!provider) notFound()

  async function approve() {
    "use server"
    await db
      .update(providers)
      .set({ status: "approved" })
      .where(eq(providers.id, parseInt(id)))
    redirect("/admin")
  }

  async function reject() {
    "use server"
    await db
      .update(providers)
      .set({ status: "rejected" })
      .where(eq(providers.id, parseInt(id)))
    redirect("/admin")
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="flex items-center gap-3 mb-8">
        <h1 className="text-3xl font-bold">ギバー申請詳細</h1>
        <Badge variant={provider.status === "pending" ? "secondary" : "default"}>
          {provider.status === "pending" ? "審査待ち" : provider.status}
        </Badge>
      </div>

      <div className="border rounded-2xl p-8 space-y-6 mb-8">
        <div>
          <p className="text-sm text-muted-foreground mb-1">ウォレットアドレス</p>
          <p className="font-mono text-sm">{provider.walletAddress}</p>
        </div>
        {provider.name && (
          <div>
            <p className="text-sm text-muted-foreground mb-1">表示名</p>
            <p>{provider.name}</p>
          </div>
        )}
        {provider.bio && (
          <div>
            <p className="text-sm text-muted-foreground mb-1">自己紹介</p>
            <p className="text-sm leading-relaxed">{provider.bio}</p>
          </div>
        )}
        <div>
          <p className="text-sm text-muted-foreground mb-1">提供できること</p>
          <p className="font-semibold">{provider.serviceTitle}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground mb-1">詳細</p>
          <p className="text-sm leading-relaxed whitespace-pre-wrap">
            {provider.serviceDescription}
          </p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground mb-1">申請日</p>
          <p className="text-sm">{provider.createdAt.toLocaleDateString("ja-JP")}</p>
        </div>
      </div>

      {provider.status === "pending" && (
        <div className="flex gap-4">
          <form action={approve} className="flex-1">
            <Button type="submit" className="w-full">承認してメニューに掲載</Button>
          </form>
          <form action={reject} className="flex-1">
            <Button type="submit" variant="destructive" className="w-full">却下</Button>
          </form>
        </div>
      )}
    </div>
  )
}
