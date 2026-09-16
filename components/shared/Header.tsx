"use client"

import Link from "next/link"
import { WalletButton } from "./WalletButton"
import { AdminButton } from "./AdminButton"
import { LangToggle } from "./LangToggle"
import { useLang } from "@/lib/i18n/context"

/** ナビはピル。地は紙白・1px黒縁で統一し、影と下線は置かない */
const NAV = [
  { href: "/start",   key: "start"  as const, primary: true },
  { href: "/loops",   key: "loops"  as const, primary: false },
  { href: "/menu",    key: "menu"   as const, primary: false },
  { href: "/profile", key: "mypage" as const, primary: false },
]

export function Header() {
  const { T } = useLang()

  return (
    <header className="sticky top-0 z-50 band-paper">
      <div className="max-w-6xl mx-auto px-5 py-3 flex items-center justify-between gap-3">
        {/* ワードマークのみ。丸バッジのアイコンは削除した */}
        <Link href="/" className="shrink-0">
          <span className="font-display" style={{ fontSize: "1.15rem" }}>ONLOOP</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1.5">
          <Link
            href="/start"
            className="slush-badge font-ja"
            style={{ background: "#000000", color: "#ffffff", fontSize: "0.875rem", fontWeight: 700 }}
          >
            {T.nav.start}
          </Link>
          <Link href="/loops" className="slush-badge font-ja" style={{ fontSize: "0.875rem", fontWeight: 700 }}>
            {T.nav.loops}
          </Link>
          <Link href="/menu" className="slush-badge font-ja" style={{ fontSize: "0.875rem", fontWeight: 700 }}>
            {T.nav.menu}
          </Link>
          <Link href="/profile" className="slush-badge font-ja" style={{ fontSize: "0.875rem", fontWeight: 700 }}>
            {T.nav.mypage}
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <LangToggle />
          <AdminButton />
          <WalletButton />
        </div>
      </div>

      {/* モバイル: 4つの導線を消さずに、横スクロールのピル行として残す（ハンバーガーは様式に合わない） */}
      <nav
        className="md:hidden flex items-center gap-1.5 px-5 pb-2.5 overflow-x-auto"
        style={{ scrollbarWidth: "none" }}
        aria-label="main"
      >
        {NAV.map((n) => (
          <Link
            key={n.href}
            href={n.href}
            className="slush-badge font-ja shrink-0 whitespace-nowrap"
            style={{
              background: n.primary ? "#000000" : "#ffffff",
              color: n.primary ? "#ffffff" : "#000000",
              fontSize: "0.875rem",
              fontWeight: 700,
            }}
          >
            {T.nav[n.key]}
          </Link>
        ))}
      </nav>
    </header>
  )
}
