import { ProviderApplyForm } from "@/components/provider/ProviderApplyForm"
import { PageHead } from "@/components/shared/PageHead"

export default function ProviderApplyPage() {
  return (
    <div className="min-h-screen band-paper">
      <PageHead
        en="BECOME A GIVER"
        ja="恩送りメニュー登録"
        sub="あなたのスキルや好意を、恩送りメニューに登録しましょう。"
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

        <ProviderApplyForm />
      </div>
    </div>
  )
}
