import { db } from "@/lib/db"
import { providers, userProfiles } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { notFound } from "next/navigation"
import { OfferForm } from "@/components/provider/OfferForm"
import { getChainSummary } from "@/lib/loops"

type Props = { params: Promise<{ id: string }> }

export default async function OfferPage({ params }: Props) {
  const { id } = await params

  const [row] = await db
    .select({
      id: providers.id,
      walletAddress: providers.walletAddress,
      name: providers.name,
      bio: providers.bio,
      serviceImageUrl: providers.avatarUrl,
      serviceTitle: providers.serviceTitle,
      serviceDescription: providers.serviceDescription,
      role: providers.role,
      chainId: providers.chainId,
      profileAvatarUrl: userProfiles.avatarUrl,
    })
    .from(providers)
    .leftJoin(userProfiles, eq(providers.walletAddress, userProfiles.walletAddress))
    .where(eq(providers.id, parseInt(id)))

  if (!row || row.id === undefined) notFound()

  // 贈り手が中継者として輪に紐づいていれば、その輪を既定の繋ぎ先にする
  const inheritedChain = row.chainId ? await getChainSummary(row.chainId) : null

  return (
    <div className="min-h-screen" style={{ background: "#ffffff" }}>
      <div className="max-w-2xl mx-auto px-4 py-12">
        <h1
          className="font-display mb-8 leading-loose"
          style={{ fontSize: "0.9rem", color: "#000000", textShadow: "none"}}
        >
          恩送りを依頼する
        </h1>

        <OfferForm provider={row} inheritedChain={inheritedChain} />
      </div>
    </div>
  )
}
