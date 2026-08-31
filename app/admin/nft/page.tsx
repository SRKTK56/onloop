import { NFTAdmin } from "@/components/admin/NFTAdmin"

export default function AdminNFTPage() {
  return (
    <div className="min-h-screen" style={{ background: "#ffffff" }}>
      <div className="max-w-2xl mx-auto px-4 py-12">

        <h1
          className="font-display mb-2 leading-loose"
          style={{ fontSize: "1rem", color: "#000000", textShadow: "none"}}
        >
          🎨 NFT管理
        </h1>
        <p className="font-ja text-sm mb-8" style={{ color: "#4a4a4a" }}>
          ミント状況・売上の確認と引き出し
        </p>

        <NFTAdmin />
      </div>
    </div>
  )
}
