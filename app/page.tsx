import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export default function Home() {
  return (
    <div className="min-h-[calc(100vh-3.5rem)]">
      {/* Hero */}
      <section className="max-w-5xl mx-auto px-4 py-24 text-center">
        <Badge variant="secondary" className="mb-6">Base ブロックチェーン上で動く</Badge>
        <h1 className="text-5xl font-bold tracking-tight mb-6 leading-tight">
          恩送りが繋がり、<br />
          <span className="text-primary">ループ</span>して戻ってくる。
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
          写真を撮ってあげる、企画を一緒に考える、マッサージをする——<br />
          お金のやり取りなしに、あなたの好意が連鎖していく。
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link href="/menu" className={cn(buttonVariants({ size: "lg" }), "rounded-full px-8")}>
            恩送りメニューを見る
          </Link>
          <Link href="/provider/apply" className={cn(buttonVariants({ size: "lg", variant: "outline" }), "rounded-full px-8")}>
            ギバーとして登録する
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-muted/40 py-20">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">ONLOOPの仕組み</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "恩を届ける",
                desc: "メニューに掲載されたギバーを選んで依頼。または自分の好意をリンクにして送る。",
              },
              {
                step: "02",
                title: "恩を受け取り、繋ぐ",
                desc: "恩を受け取った人は、次の誰かに恩を送ることを約束。連鎖が広がっていく。",
              },
              {
                step: "03",
                title: "ループが完成する",
                desc: "連鎖がぐるりと回って起点の人に戻ったとき、全員にONトークンのボーナスが降り注ぐ。",
              },
            ].map((item) => (
              <div key={item.step} className="bg-background rounded-2xl p-8 border">
                <div className="text-4xl font-bold text-primary/20 mb-4">{item.step}</div>
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ON Token */}
      <section className="max-w-5xl mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-4">ONトークンとは</h2>
        <p className="text-center text-muted-foreground mb-12 max-w-xl mx-auto">
          恩送りの連鎖に参加するたびに獲得できる報酬トークン。<br />
          連鎖を起こした人ほど、より多くのONを受け取れます。
        </p>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="border rounded-2xl p-8">
            <div className="text-2xl font-bold mb-2">連鎖に参加するたびに</div>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex justify-between"><span>🌱 起点者（連鎖を始めた人）</span><span className="font-mono font-bold text-foreground">+5 ON / hop</span></li>
              <li className="flex justify-between"><span>🔗 中継者（つないだ人）</span><span className="font-mono font-bold text-foreground">+2 ON</span></li>
              <li className="flex justify-between"><span>🤝 新受取人</span><span className="font-mono font-bold text-foreground">+1 ON</span></li>
            </ul>
          </div>
          <div className="border rounded-2xl p-8 bg-accent">
            <div className="text-2xl font-bold mb-2">🎉 ループ完成ボーナス</div>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex justify-between"><span>全参加者</span><span className="font-mono font-bold text-foreground">N × 5 ON</span></li>
              <li className="flex justify-between"><span>起点者（2倍）</span><span className="font-mono font-bold text-foreground">N × 10 ON</span></li>
              <li className="text-sm mt-4 text-primary">N = ループの参加人数</li>
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary text-primary-foreground py-16 text-center">
        <h2 className="text-3xl font-bold mb-4">あなたの「できること」で、誰かを助けよう</h2>
        <p className="text-primary-foreground/70 mb-8">まずはメニューを眺めるだけでも。ウォレット不要で閲覧できます。</p>
        <Link href="/menu" className={cn(buttonVariants({ size: "lg", variant: "secondary" }), "rounded-full px-8")}>
          恩送りメニューを見る →
        </Link>
      </section>
    </div>
  )
}
