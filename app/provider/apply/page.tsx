import { ProviderApplyForm } from "@/components/provider/ProviderApplyForm"

export default function ProviderApplyPage() {
  return (
    <div className="min-h-screen" style={{ background: "#0a0a1a" }}>
      <div className="max-w-5xl mx-auto px-4 py-12">

        <div className="mb-10">
          <h1
            className="font-pixel mb-3 leading-loose"
            style={{ fontSize: "1rem", color: "#fff", textShadow: "3px 3px 0 #0052FF" }}
          >
            ギバー登録申請
          </h1>
          <p className="font-ja text-base" style={{ color: "#90a0b8" }}>
            あなたのスキルや好意を、恩送りとして提供しましょう。
          </p>
        </div>

        <div
          className="pixel-box p-4 mb-8 flex flex-wrap gap-x-8 gap-y-1"
          style={{ background: "#060610" }}
        >
          {[
            "ウォレット接続が必要",
            "申請後、運営がレビュー（数日以内）",
            "本名・顔写真は任意",
          ].map((text) => (
            <p key={text} className="font-ja text-sm" style={{ color: "#506070" }}>
              <span style={{ color: "#52b788" }}>✓</span> {text}
            </p>
          ))}
        </div>

        <ProviderApplyForm />
      </div>
    </div>
  )
}
