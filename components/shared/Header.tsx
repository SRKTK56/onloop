"use client"

import Link from "next/link"
import { WalletButton } from "./WalletButton"
import { AdminButton } from "./AdminButton"
import { LangToggle } from "./LangToggle"
import { useLang } from "@/lib/i18n/context"

/** ナビはピル。地は紙白・1px黒縁で統一し、影と下線は置かない */
export function Header() {
  const { T } = useLang()

  return (
    <header className="sticky top-0 z-50 band-paper">
      <div className="max-w-6xl mx-auto px-5 py-3 flex items-center justify-between gap-3">
        {/* ロゴマーク: 黒縁の丸バッジ */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <span
            className="sticker-round"
            style={{ width: 34, height: 34, background: "#0052ff", color: "#ffffff" }}
          >
            <span className="font-display" style={{ fontSize: "0.95rem", lineHeight: 1 }}>O</span>
          </span>
          <span className="font-display" style={{ fontSize: "1.15rem" }}>ONLOOP</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1.5">
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
    </header>
  )
}
