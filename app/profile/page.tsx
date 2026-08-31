import { ProfileView } from "@/components/chain/ProfileView"
import { PageHead } from "@/components/shared/PageHead"

export default function ProfilePage() {
  return (
    <div className="min-h-screen band-paper">
      <PageHead en="MY PAGE" ja="マイページ" band="sky" />
      <div className="max-w-5xl mx-auto px-5 py-12">
        <ProfileView />
      </div>
    </div>
  )
}
