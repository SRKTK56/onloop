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
      style={{ background: "#060610", borderBottom: "2px solid #1a1a2a" }}
    >
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex items-center gap-0">
          {TABS.map((tab) => {
            const isActive = tab.key === activeKey
            return (
              <Link
                key={tab.key}
                href={tab.href}
                className="font-pixel px-5 py-3 transition-colors"
                style={{
                  fontSize:    "0.68rem",
                  color:       isActive ? "#ffcc00" : "#506070",
                  borderBottom: isActive ? "3px solid #ffcc00" : "3px solid transparent",
                  background:  isActive ? "#0a0800" : "transparent",
                }}
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
