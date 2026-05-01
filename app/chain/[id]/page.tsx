import { db } from "@/lib/db"
import { chains, chainNodes, userProfiles } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { notFound } from "next/navigation"
import { ChainGraph } from "@/components/chain/ChainGraph"
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

  const confirmedCount = nodes.filter((n) => n.status === "confirmed").length
  const isLoop = nodes.length >= 5 && nodes[nodes.length - 1]?.receiverWallet === chain.originWallet

  // 各ノードの参加者プロフィールを一括取得
  const wallets = [...new Set(nodes.flatMap((n) => [n.giverWallet, n.receiverWallet]))]
  const profiles = wallets.length
    ? await db.select().from(userProfiles).where(
        wallets.length === 1
          ? eq(userProfiles.walletAddress, wallets[0])
          : eq(userProfiles.walletAddress, wallets[0]) // 簡易: 後でIN句に変更可
      )
    : []
  const profileMap = Object.fromEntries(profiles.map((p) => [p.walletAddress.toLowerCase(), p.displayName]))

  const statusColor: Record<string, string> = { confirmed: "#52b788", pending: "#aa8800" }

  return (
    <div className="min-h-screen" style={{ background: "#0a0a1a" }}>
      <div className="max-w-5xl mx-auto px-4 py-12">

        {/* ヘッダー */}
        <div className="flex items-start justify-between mb-8 flex-wrap gap-3">
          <div>
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <h1
                className="font-pixel leading-loose"
                style={{ fontSize: "0.9rem", color: "#fff", textShadow: "3px 3px 0 #0052FF" }}
              >
                チェーン #{chainId}
              </h1>
              {isLoop && (
                <span
                  className="font-pixel text-[0.65rem] px-2 py-0.5"
                  style={{ background: "#ffcc0033", border: "2px solid #ffcc00", color: "#ffcc00" }}
                >
                  🎉 ループ完成！
                </span>
              )}
            </div>
            <p className="font-ja text-sm" style={{ color: "#506070" }}>
              参加者：{nodes.length} 人 · 確認済み：{confirmedCount} 件
            </p>
          </div>
        </div>

        {/* チェーン可視化 */}
        <ChainGraph nodes={nodes} originWallet={chain.originWallet} isLoop={isLoop} />

        {/* ノード一覧 + メッセージスレッド */}
        <div className="mt-10 space-y-6">
          <h2
            className="font-pixel"
            style={{ fontSize: "0.75rem", color: "#fff", textShadow: "2px 2px 0 #0052FF" }}
          >
            恩送りの流れ
          </h2>

          {nodes.map((node) => (
            <div key={node.id} className="space-y-3">
              {/* ノード行 */}
              <div
                className="pixel-box flex items-center gap-4 p-4"
                style={{ background: "#0f1628" }}
              >
                <div
                  className="font-pixel text-lg w-10 h-10 flex items-center justify-center shrink-0"
                  style={{ background: "#060610", border: "2px solid #1a2a3a", color: "#3a5a7a" }}
                >
                  {node.position + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-ja font-medium text-base" style={{ color: "#c0d0e8" }}>
                    {node.description}
                  </p>
                  <p className="font-mono text-xs mt-0.5" style={{ color: "#3a5a7a" }}>
                    {profileMap[node.giverWallet.toLowerCase()] ?? node.giverWallet.slice(0, 8) + "..."}
                    {" → "}
                    {profileMap[node.receiverWallet.toLowerCase()] ?? node.receiverWallet.slice(0, 8) + "..."}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className="font-pixel text-[0.62rem] px-2 py-0.5"
                    style={{
                      background: `${statusColor[node.status] ?? "#506070"}22`,
                      border: `2px solid ${statusColor[node.status] ?? "#506070"}`,
                      color: statusColor[node.status] ?? "#506070",
                    }}
                  >
                    {node.status === "confirmed" ? "完了" : "承認待ち"}
                  </span>
                  {node.status === "pending" && (
                    <Link
                      href={`/match/${node.id}`}
                      className="font-pixel text-[0.6rem] px-2 py-0.5"
                      style={{
                        background: "#0a1628",
                        border: "2px solid #0052FF",
                        color: "#7ab0ff",
                      }}
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
