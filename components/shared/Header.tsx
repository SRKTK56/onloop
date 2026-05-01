import Link from "next/link"
import { WalletButton } from "./WalletButton"

export function Header() {
  return (
    <header
      className="sticky top-0 z-50"
      style={{
        background: "#060610",
        borderBottom: "4px solid #0052FF",
        boxShadow: "0 4px 0 #000",
      }}
    >
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link
          href="/"
          className="font-pixel"
          style={{ fontSize: "0.7rem", color: "#fff", textShadow: "2px 2px 0 #0052FF" }}
        >
          <span style={{ color: "#0052FF", textShadow: "2px 2px 0 #ffffff" }}>ON</span>LOOP
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/menu" className="nav-link font-ja text-sm">
            恩送りメニュー
          </Link>
          <Link href="/profile" className="nav-link font-ja text-sm">
            マイページ
          </Link>
        </nav>
        <WalletButton />
      </div>
    </header>
  )
}
