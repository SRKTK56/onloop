import { db } from "@/lib/db"
import { chains, chainNodes, userProfiles } from "@/lib/db/schema"
import { eq, inArray } from "drizzle-orm"
import { notFound } from "next/navigation"
import { ChainGraph } from "@/components/chain/ChainGraph"
import { StageBanner } from "@/components/shared/StageDisplay"
import { MessageThread } from "@/components/chain/MessageThread"
import Link from "next/link"

export const dynamic = "force-dynamic"

type Props = { params: Promise<{ id: string }> }

export default async function ChainPage({ params }: Props) {
  const { id } = await params
  const chainId = parseInt(id)

  const [chain] = await db.select().from(chains).where(eq(chains.id, chainId))
  if (!chain) notFound()

  const nodes = await db.select().from(chainNodes).where(eq(chainNodes.chainId, chainId))

  const confirmed = nodes.filter((n) => n.status === "confirmed")
  const confirmedCount = confirmed.length
  const isLoop = nodes.length >= 5 && nodes[nodes.length - 1]?.receiverWallet === chain.originWallet

  // 報酬計算（lib/rewards.ts）と同じ数え方。ここがずれるとステージ表示と報酬が食い違う
  const chainLength = [chain.originWallet, ...confirmed.map((n) => n.receiverWallet)]
    .filter((w, i, arr) => arr.findIndex((x) => x.toLowerCase() === w.toLowerCase()) === i).length

  // 各ノードの参加者プロフィールを一括取得
  const wallets = [...new Set(nodes.flatMap((n) => [n.giverWallet, n.receiverWallet]))]
  const profiles = wallets.length
    ? await db.select().from(userProfiles).where(inArray(userProfiles.walletAddress, wallets))
    : []
  const profileMap = Object.fromEntries(profiles.map((p) => [p.walletAddress.toLowerCase(), p.displayName]))

  const statusColor: Record<string, string> = { confirmed: "#55db9c", pending: "#ffd731" }

  return (
    <div className="min-h-screen" style={{ background: "#ffffff" }}>
      <div className="max-w-5xl mx-auto px-4 py-12">

        {/* ヘッダー */}
        <div className="flex items-start justify-between mb-8 flex-wrap gap-3">
          <div>
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <h1
                className="font-display leading-loose"
                style={{ fontSize: "0.9rem", color: "#000000", textShadow: "none"}}
              >
                チェーン #{chainId}
              </h1>
              {isLoop && (
                <span
                  className="font-display text-[0.7rem] px-2 py-0.5"
                  style={{ background: "#fff3cf", border: "1px solid #000000", color: "#000000" , borderRadius: "1600px"}}
                >
                  🎉 ループ完成！
                </span>
              )}
            </div>
            <p className="font-ja text-sm" style={{ color: "#4a4a4a" }}>
              参加者：{chainLength} 人 · 確認済み：{confirmedCount} 件
            </p>
          </div>
        </div>

        {/* ステージ ─ 連鎖が伸びるほど世界が育つ、という主軸 */}
        <div className="mb-10">
          <StageBanner chainLength={chainLength} isLoop={isLoop} />
        </div>

        {/* チェーン可視化 */}
        <ChainGraph nodes={nodes} originWallet={chain.originWallet} isLoop={isLoop} />

        {/* ノード一覧 + メッセージスレッド */}
        <div className="mt-10 space-y-6">
          <h2
            className="font-display"
            style={{ fontSize: "0.75rem", color: "#000000", textShadow: "none"}}
          >
            恩送りの流れ
          </h2>

          {nodes.map((node) => (
            <div key={node.id} className="space-y-3">
              {/* ノード行 */}
              <div
                className="slush-card flex items-center gap-4 p-4"
                style={{ background: "#ffffff" }}
              >
                <div
                  className="font-display text-lg w-10 h-10 flex items-center justify-center shrink-0"
                  style={{ background: "#dceeff", border: "1px solid #000000", color: "#4a4a4a" , borderRadius: "20px"}}
                >
                  {node.position + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-ja font-medium text-base" style={{ color: "#000000" }}>
                    {node.description}
                  </p>
                  <p className="font-mono text-xs mt-0.5" style={{ color: "#4a4a4a" }}>
                    {profileMap[node.giverWallet.toLowerCase()] ?? node.giverWallet.slice(0, 8) + "..."}
                    {" → "}
                    {profileMap[node.receiverWallet.toLowerCase()] ?? node.receiverWallet.slice(0, 8) + "..."}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className="font-display text-[0.7rem] px-2 py-0.5"
                    style={{
                      background: `${statusColor[node.status] ?? "#506070"}22`,
                      border: `1px solid ${statusColor[node.status] ?? "#000000"}`,
                      color: statusColor[node.status] ?? "#4a4a4a", borderRadius: "1600px"}}
                  >
                    {node.status === "confirmed" ? "完了" : "承認待ち"}
                  </span>
                  {node.status === "pending" && (
                    <Link
                      href={`/match/${node.id}`}
                      className="font-display text-[0.7rem] px-2 py-0.5"
                      style={{
                        background: "#ffffff",
                        border: "1px solid #000000",
                        color: "#4a4a4a", borderRadius: "1600px"}}
                    >
                      確認 →
                    </Link>
                  )}
                </div>
              </div>

              {/* メッセージスレッド */}
              <MessageThread
                nodeId={node.id}
                giverWallet={node.giverWallet}
                receiverWallet={node.receiverWallet}
                giverName={profileMap[node.giverWallet.toLowerCase()] ?? null}
                receiverName={profileMap[node.receiverWallet.toLowerCase()] ?? null}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
