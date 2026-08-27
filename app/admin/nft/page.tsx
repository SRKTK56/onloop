import { NFTAdmin } from "@/components/admin/NFTAdmin"

export default function AdminNFTPage() {
  return (
    <div className="min-h-screen" style={{ background: "#0a0a1a" }}>
      <div className="max-w-2xl mx-auto px-4 py-12">

        <h1
          className="font-pixel mb-2 leading-loose"
          style={{ fontSize: "1rem", color: "#ffcc00", textShadow: "3px 3px 0 #aa8800" }}
        >
          🎨 NFT管理
        </h1>
        <p className="font-ja text-sm mb-8" style={{ color: "#506070" }}>
          ミント状況・売上の確認と引き出し
        </p>

        <NFTAdmin />
      </div>
    </div>
  )
}
