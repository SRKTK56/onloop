import { MatchConfirm } from "@/components/chain/MatchConfirm"
import { MessageThread } from "@/components/chain/MessageThread"
import { db } from "@/lib/db"
import { chainNodes, userProfiles } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

type Props = { params: Promise<{ id: string }> }

export const dynamic = "force-dynamic"

export default async function MatchPage({ params }: Props) {
  const { id } = await params
  const nodeId = parseInt(id)

  const [node] = await db.select().from(chainNodes).where(eq(chainNodes.id, nodeId))

  // ギバー・受取人の表示名を取得
  const [giverProfile] = node
    ? await db.select().from(userProfiles).where(eq(userProfiles.walletAddress, node.giverWallet))
    : [undefined]
  const [receiverProfile] = node
    ? await db.select().from(userProfiles).where(eq(userProfiles.walletAddress, node.receiverWallet))
    : [undefined]

  return (
    <div className="min-h-screen" style={{ background: "#0a0a1a" }}>
      <div className="max-w-lg mx-auto px-4 py-12 space-y-8">
        <div>
          <h1
            className="font-pixel mb-3 leading-loose"
            style={{ fontSize: "0.9rem", color: "#fff", textShadow: "3px 3px 0 #0052FF" }}
          >
            恩送りの確認
          </h1>
          <p className="font-ja text-base" style={{ color: "#90a0b8" }}>
            承認前に日程や場所をメッセージで調整できます。
          </p>
        </div>

        {/* メッセージスレッド（承認前後どちらでも使える） */}
        {node && (
          <MessageThread
            nodeId={nodeId}
            giverWallet={node.giverWallet}
            receiverWallet={node.receiverWallet}
            giverName={giverProfile?.displayName ?? null}
            receiverName={receiverProfile?.displayName ?? null}
          />
        )}

        {/* 承認フォーム */}
        <MatchConfirm nodeId={nodeId} />
      </div>
    </div>
  )
}
