import { MintSection } from "@/components/nft/MintSection"
import { MintGallery } from "@/components/nft/MintGallery"
import { PageHead } from "@/components/shared/PageHead"

export default function MintPage() {
  return (
    <div className="min-h-screen band-paper">
      <PageHead
        en="MINT"
        ja="NFTを発行する"
        sub="恩送りで稼いだONトークンと約100円でMINTできます。保有すると恩送り報酬が最大×2倍に。"
        band="lavender"
      />
      <div className="max-w-2xl mx-auto px-5 py-12">
        <MintSection />
        <MintGallery />
      </div>
    </div>
  )
}
