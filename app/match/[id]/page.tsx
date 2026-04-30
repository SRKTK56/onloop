import { MatchConfirm } from "@/components/chain/MatchConfirm"

type Props = { params: Promise<{ id: string }> }

export default async function MatchPage({ params }: Props) {
  const { id } = await params
  return (
    <div className="max-w-lg mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">恩送りの確認</h1>
      <p className="text-muted-foreground mb-8">
        あなたへの恩送りを確認・承認してください。<br />
        承認すると、次の誰かへ恩送りを繋ぐ約束が始まります。
      </p>
      <MatchConfirm nodeId={parseInt(id)} />
    </div>
  )
}
