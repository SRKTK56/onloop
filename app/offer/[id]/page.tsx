import { db } from "@/lib/db"
import { providers, userProfiles } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { notFound } from "next/navigation"
import { OfferForm } from "@/components/provider/OfferForm"

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
      profileAvatarUrl: userProfiles.avatarUrl,
    })
    .from(providers)
    .leftJoin(userProfiles, eq(providers.walletAddress, userProfiles.walletAddress))
    .where(eq(providers.id, parseInt(id)))

  if (!row || row.id === undefined) notFound()

  return (
    <div className="min-h-screen" style={{ background: "#0a0a1a" }}>
      <div className="max-w-2xl mx-auto px-4 py-12">
        <h1
          className="font-pixel mb-8 leading-loose"
          style={{ fontSize: "0.9rem", color: "#fff", textShadow: "3px 3px 0 #0052FF" }}
        >
          恩送りを依頼する
        </h1>

        <OfferForm provider={row} />
      </div>
    </div>
  )
}
