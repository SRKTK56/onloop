import { ProviderApplyForm } from "@/components/provider/ProviderApplyForm"

export default function ProviderApplyPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">ギバー登録申請</h1>
        <p className="text-muted-foreground leading-relaxed">
          あなたのスキルや好意を、恩送りとして提供してください。<br />
          運営が内容を確認し、必要に応じて面談の上でメニューに掲載します。
        </p>
      </div>
      <div className="border rounded-2xl p-8 bg-muted/20 mb-6 text-sm text-muted-foreground space-y-2">
        <p>✅ ウォレット接続が必要です</p>
        <p>✅ 申請後、運営がレビューします（数日以内）</p>
        <p>✅ 顔写真・本名は任意です</p>
      </div>
      <ProviderApplyForm />
    </div>
  )
}
