import { AdminGate } from "@/components/shared/AdminGate"
import { AdminNav } from "@/components/admin/AdminNav"
import type { ReactNode } from "react"

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AdminGate>
      <AdminNav />
      {children}
    </AdminGate>
  )
}
