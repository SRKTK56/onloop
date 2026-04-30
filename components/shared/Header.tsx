import Link from "next/link"
import { WalletButton } from "./WalletButton"

export function Header() {
  return (
    <header className="border-b border-border bg-background/95 backdrop-blur sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="font-bold text-xl tracking-tight">
          ONLOOP
          <span className="text-xs font-normal text-muted-foreground ml-2">恩ループ</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
          <Link href="/menu" className="hover:text-foreground transition-colors">恩送りメニュー</Link>
          <Link href="/profile" className="hover:text-foreground transition-colors">マイページ</Link>
        </nav>
        <WalletButton />
      </div>
    </header>
  )
}
