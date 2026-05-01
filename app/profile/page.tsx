import { ProfileView } from "@/components/chain/ProfileView"

export default function ProfilePage() {
  return (
    <div className="min-h-screen" style={{ background: "#0a0a1a" }}>
      <div className="max-w-5xl mx-auto px-4 py-12">
        <h1
          className="font-pixel mb-8 leading-loose"
          style={{ fontSize: "1rem", color: "#fff", textShadow: "3px 3px 0 #0052FF" }}
        >
          マイページ
        </h1>
        <ProfileView />
      </div>
    </div>
  )
}
