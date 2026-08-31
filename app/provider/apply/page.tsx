import { ProviderApplyForm } from "@/components/provider/ProviderApplyForm"
import { PageHead } from "@/components/shared/PageHead"

type Props = { searchParams: Promise<{ role?: string; chain?: string }> }

export default async function ProviderApplyPage({ searchParams }: Props) {
  const sp = await searchParams
  const initialRole = sp.role === "relay" ? "relay" : "origin"
  return (
    <div className="min-h-screen band-paper">
      <PageHead
        en={initialRole === "relay" ? "JOIN A LOOP" : "START A LOOP"}
        ja={initialRole === "relay" ? "いまある輪に加わる" : "新しい輪を始める"}
        sub={
          initialRole === "relay"
            ? "加わる輪を選んで登録します。あなたが恩を送ると、その輪が伸びます。"
            : "あなたが提供できることを登録します。誰かが受け取った瞬間に、あなたを起点とする輪が生まれます。"
        }
        band="lavender"
      />
      <div className="max-w-5xl mx-auto px-5 py-12">
        <div className="flex flex-wrap gap-2 mb-8">
          {[
            "ウォレット接続が必要",
            "申請後、運営がレビュー（数日以内）",
            "本名・顔写真は任意",
          ].map((text, i) => (
            <span
              key={text}
              className="slush-badge font-ja"
              style={{ background: ["#55db9c", "#ffd731", "#7ee8e8"][i], fontSize: "0.875rem", fontWeight: 700 }}
            >
              ✓ {text}
            </span>
          ))}
        </div>

        <ProviderApplyForm initialRole={initialRole} />
      </div>
    </div>
  )
}
