import { db } from "@/lib/db"
import { chains, chainNodes } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { notFound } from "next/navigation"
import { ChainGraph } from "@/components/chain/ChainGraph"
import { Badge } from "@/components/ui/badge"

export const dynamic = "force-dynamic"

type Props = { params: Promise<{ id: string }> }

export default async function ChainPage({ params }: Props) {
  const { id } = await params
  const chainId = parseInt(id)

  const [chain] = await db.select().from(chains).where(eq(chains.id, chainId))
  if (!chain) notFound()

  const nodes = await db
    .select()
    .from(chainNodes)
    .where(eq(chainNodes.chainId, chainId))

  const confirmedCount = nodes.filter((n) => n.status === "confirmed").length
  const totalCount = nodes.length

  // ループ完成チェック：最後のreceiverWalletが起点者と一致するか
  const isLoop =
    nodes.length >= 5 &&
    nodes[nodes.length - 1]?.receiverWallet === chain.originWallet

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold">チェーン #{chainId}</h1>
            {isLoop && (
              <Badge className="bg-amber-500 text-white text-sm">🎉 ループ完成！</Badge>
            )}
          </div>
          <p className="text-muted-foreground">
            参加者：{totalCount} 人 · 確認済み：{confirmedCount} 件
          </p>
        </div>
      </div>

      <ChainGraph
        nodes={nodes}
        originWallet={chain.originWallet}
        isLoop={isLoop}
      />

      {/* 恩送り一覧 */}
      <div className="mt-8 space-y-3">
        <h2 className="text-xl font-semibold">恩送りの流れ</h2>
        {nodes.map((node) => (
          <div
            key={node.id}
            className="border rounded-xl p-4 flex items-center gap-4"
          >
            <div className="text-2xl font-bold text-muted-foreground w-8 text-center">
              {node.position + 1}
            </div>
            <div className="flex-1">
              <p className="font-medium">{node.description}</p>
              <p className="text-xs text-muted-foreground font-mono">
                {node.giverWallet.slice(0, 8)}... → {node.receiverWallet.slice(0, 8)}...
              </p>
            </div>
            <Badge variant={node.status === "confirmed" ? "default" : "secondary"}>
              {node.status === "confirmed" ? "完了" : "承認待ち"}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  )
}
