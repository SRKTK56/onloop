import { db } from "@/lib/db"
import { providers } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Link from "next/link"

export const dynamic = "force-dynamic"

async function getApprovedProviders() {
  return db
    .select()
    .from(providers)
    .where(eq(providers.status, "approved"))
}

export default async function MenuPage() {
  const approvedProviders = await getApprovedProviders()

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">恩送りメニュー</h1>
          <p className="text-muted-foreground">
            審査済みのギバーが、スキルや好意を提供してくれます。
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/request" className={cn(buttonVariants({ variant: "outline", size: "sm" }))}>
            こんなギバーが欲しい →
          </Link>
          <Link href="/provider/apply" className={cn(buttonVariants({ size: "sm" }))}>
            ギバー登録
          </Link>
        </div>
      </div>

      {approvedProviders.length === 0 ? (
        <div className="text-center py-24 text-muted-foreground">
          <p className="text-lg mb-4">現在掲載中のギバーはいません。</p>
          <p className="text-sm">最初のギバーになりませんか？</p>
          <Link href="/provider/apply" className={cn(buttonVariants({ variant: "outline" }), "mt-6")}>
            ギバーとして登録する
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {approvedProviders.map((provider) => (
            <Card key={provider.id} className="hover:shadow-md transition-shadow overflow-hidden">
              {/* カバー画像エリア */}
              <div className="h-32 bg-accent flex items-center justify-center relative">
                {provider.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={provider.avatarUrl}
                    alt={provider.name ?? ""}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-5xl opacity-30">🙌</span>
                )}
                {/* アバターアイコン */}
                <div className="absolute -bottom-6 left-4 w-14 h-14 rounded-full border-4 border-background bg-muted overflow-hidden shadow">
                  {provider.avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={provider.avatarUrl} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-primary/10 flex items-center justify-center text-lg">
                      {(provider.name ?? "?")[0]}
                    </div>
                  )}
                </div>
              </div>
              <CardContent className="pt-9 space-y-3">
                <div>
                  <p className="font-semibold">
                    {provider.name ?? provider.walletAddress.slice(0, 8) + "..."}
                  </p>
                  <p className="text-xs text-muted-foreground font-mono">
                    {provider.walletAddress.slice(0, 6)}...{provider.walletAddress.slice(-4)}
                  </p>
                </div>
                <div>
                  <Badge variant="secondary" className="mb-1">提供できること</Badge>
                  <p className="font-medium text-sm">{provider.serviceTitle}</p>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {provider.serviceDescription}
                </p>
                <Link href={`/offer/${provider.id}`} className={cn(buttonVariants({ variant: "outline", size: "sm" }), "w-full text-center")}>
                  この人に恩送りをお願いする
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
