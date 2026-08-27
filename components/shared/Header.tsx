"use client"

import Link from "next/link"
import { WalletButton } from "./WalletButton"
import { AdminButton } from "./AdminButton"
import { LangToggle } from "./LangToggle"
import { useLang } from "@/lib/i18n/context"

export function Header() {
  const { T } = useLang()

  return (
    <header
      className="sticky top-0 z-50"
      style={{
        background: "#060610",
        borderBottom: "none",
        boxShadow: "0 2px 12px rgba(0,0,0,0.6)",
      }}
    >
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link
          href="/"
          className="font-pixel"
          style={{ fontSize: "1rem", color: "#fff", textShadow: "3px 3px 0 #0052FF" }}
        >
          <span style={{ color: "#ffffff", textShadow: "2px 2px 0 #0052FF" }}>ON</span>LOOP
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/menu" className="nav-link font-ja text-sm">{T.nav.menu}</Link>
          <Link href="/mint" className="nav-link font-pixel text-[0.72rem]">{T.nav.mint}</Link>
          <Link href="/profile" className="nav-link font-ja text-sm">{T.nav.mypage}</Link>
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
