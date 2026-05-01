import { AdminGate } from "@/components/shared/AdminGate"
import type { ReactNode } from "react"

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <AdminGate>{children}</AdminGate>
}
