import { ServiceRequestForm } from "@/components/shared/ServiceRequestForm"
import { PageHead } from "@/components/shared/PageHead"

export default function RequestPage() {
  return (
    <div className="min-h-screen band-paper">
      <PageHead
        en="REQUEST"
        ja="こんなギバーが欲しい"
        sub="「こんなことを手伝ってもらいたい」というリクエストを運営に送ってください。需要が多いサービスは、積極的にギバーを募集します。"
        band="concrete"
      />
      <div className="max-w-2xl mx-auto px-5 py-12">
        <ServiceRequestForm />
      </div>
    </div>
  )
}
