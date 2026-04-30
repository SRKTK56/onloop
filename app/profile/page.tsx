import { ProfileView } from "@/components/chain/ProfileView"

export default function ProfilePage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">マイページ</h1>
      <ProfileView />
    </div>
  )
}
