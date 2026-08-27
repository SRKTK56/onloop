import { MintSection } from "@/components/nft/MintSection"
import { MintGallery } from "@/components/nft/MintGallery"

export default function MintPage() {
  return (
    <div className="min-h-screen" style={{ background: "#0a0a1a" }}>
      <div className="max-w-2xl mx-auto px-4 py-12">
        <h1
          className="font-pixel mb-8 leading-loose"
          style={{ fontSize: "1rem", color: "#fff", textShadow: "3px 3px 0 #0052FF" }}
        >
          MINT
        </h1>
        <MintSection />
        <MintGallery />
      </div>
    </div>
  )
}
