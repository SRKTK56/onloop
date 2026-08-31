"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

const TABS = [
  { href: "/admin",     label: "📋 メニュー管理",      key: "menu" },
  { href: "/admin/nft", label: "🎨 NFT管理・売上",     key: "nft"  },
]

export function AdminNav() {
  const pathname = usePathname()
  const activeKey = pathname.startsWith("/admin/nft") ? "nft" : "menu"

  return (
    <div
      className="sticky top-14 z-40"
      style={{ background: "#dceeff", borderBottom: "1px solid #000000" }}
    >
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex items-center gap-0">
          {TABS.map((tab) => {
            const isActive = tab.key === activeKey
            return (
              <Link
                key={tab.key}
                href={tab.href}
                className="font-display px-5 py-3 transition-colors"
                style={{
                  fontSize:    "0.68rem",
                  color:       isActive ? "#000000" : "#4a4a4a",
                  borderBottom: isActive ? "1px solid #ffd731" : "1px solid transparent",
                  background:  isActive ? "#ffffff" : "transparent"}}
              >
                {tab.label}
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
