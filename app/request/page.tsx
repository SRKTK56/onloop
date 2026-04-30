import { ServiceRequestForm } from "@/components/shared/ServiceRequestForm"

export default function RequestPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">こんなギバーが欲しい</h1>
        <p className="text-muted-foreground leading-relaxed">
          「こんなことを手伝ってもらいたい」というリクエストを運営に送ってください。<br />
          需要が多いサービスは、積極的にギバーを募集します。
        </p>
      </div>
      <ServiceRequestForm />
    </div>
  )
}
