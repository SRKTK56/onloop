import Link from "next/link"
import { cn } from "@/lib/utils"
import { PhoneMockup } from "@/components/shared/PhoneMockup"
import { OnTokenDiagram } from "@/components/shared/OnTokenDiagram"
import { STAGES } from "@/lib/stages"


export default function Home() {
  return (
    <div className="min-h-[calc(100vh-3.5rem)]" style={{ background: "#0a0a1a" }}>

      {/* ── HERO ── */}
      <section
        className="relative overflow-hidden"
        style={{
          backgroundImage: "url(/onloop_baner.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* 透かしオーバーレイ */}
        <div
          className="absolute inset-0"
          style={{ background: "rgba(6, 6, 18, 0.78)" }}
        />

        <div className="relative z-10 max-w-5xl mx-auto px-4 pt-10 pb-16 md:pt-12 md:pb-24">
          <div className="flex flex-col md:flex-row items-start gap-10 md:gap-16">

            {/* テキスト */}
            <div className="flex-1 text-center md:text-left">
              {/* タイトルバー */}
              <div
                className="inline-flex items-center gap-2 px-3 py-1.5 mb-6 font-pixel text-[0.82rem]"
                style={{
                  background: "rgba(0, 82, 255, 0.25)",
                  border: "2px solid #0052FF",
                  color: "#7ab0ff",
                  boxShadow: "3px 3px 0 #0052FF",
                }}
              >
                ▸ BUILT ON BASE BLOCKCHAIN
              </div>

              {/* メインタイトル */}
              <h1
                className="font-pixel mb-6 leading-loose"
                style={{
                  fontSize: "clamp(1.4rem, 4vw, 2.2rem)",
                  color: "#ffffff",
                  textShadow: "4px 4px 0 #0052FF",
                }}
              >
                <span style={{ color: "#0052FF", textShadow: "4px 4px 0 #ffffff" }}>ON</span>LOOP
              </h1>

              <p className="font-ja text-2xl mb-4 leading-relaxed" style={{ color: "#e8f0ff" }}>
                恩送りが繋がり、<br />
                <span style={{ color: "#7ab0ff" }}>ループ</span>して戻ってくる。
              </p>
              <p className="font-ja text-lg mb-10 leading-relaxed" style={{ color: "#a8c0d8" }}>
                写真・企画・料理——お金なしで好意が連鎖し、<br />
                チェーンが長くなるほど全員の報酬が増える。
              </p>

              <div className="flex gap-5 flex-wrap justify-center md:justify-start">
                <Link
                  href="/menu"
                  className="pixel-btn font-pixel"
                  style={{
                    background: "#0052FF",
                    color: "#fff",
                    borderColor: "#000",
                    padding: "1rem 2rem",
                    fontSize: "0.85rem",
                  }}
                >
                  ▸ メニューを見る
                </Link>
                <Link
                  href="/provider/apply"
                  className="pixel-btn font-pixel"
                  style={{
                    background: "rgba(0,0,0,0.6)",
                    color: "#7ab0ff",
                    borderColor: "#0052FF",
                    boxShadow: "4px 4px 0 #0052FF",
                    padding: "1rem 2rem",
                    fontSize: "0.85rem",
                  }}
                >
                  ▸ ギバー登録
                </Link>
              </div>

              {/* ウォレット未所持ユーザー向け */}
              <p className="font-ja text-sm mt-5" style={{ color: "#506070" }}>
                ウォレットをお持ちでない方は
                <a
                  href="https://base.app/invite/onloop/6JY26BX1"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#7ab0ff", textDecoration: "underline", textUnderlineOffset: "3px" }}
                >
                  こちらから無料作成
                </a>
                できます
              </p>
            </div>

            {/* スマホモックアップ */}
            <div className="shrink-0">
              <PhoneMockup />
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-16" style={{ background: "#0a0a1a" }}>
        <div className="max-w-5xl mx-auto px-4">
          <h2
            className="font-pixel text-center mb-10"
            style={{ fontSize: "0.9rem", color: "#fff", textShadow: "3px 3px 0 #0052FF" }}
          >
            HOW IT WORKS
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { step: "01", icon: "🎁", title: "恩を届ける",   desc: "メニューからギバーを選んで依頼。または自分の好意をリンクにして誰かに送る。" },
              { step: "02", icon: "🔗", title: "受け取り、繋ぐ", desc: "受け取った人は次の誰かへ恩を送ることを約束。連鎖が広がっていく。" },
              { step: "03", icon: "🎉", title: "ループ完成",   desc: "連鎖が起点に戻ったとき、全員にONトークンのボーナスが降り注ぐ。" },
            ].map((item) => (
              <div key={item.step} className="pixel-box p-6" style={{ background: "#0f1628" }}>
                <div className="font-pixel text-[0.82rem] mb-3" style={{ color: "#0052FF" }}>
                  STEP {item.step}
                </div>
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="font-ja font-bold text-lg mb-2" style={{ color: "#e0e8ff" }}>
                  {item.title}
                </h3>
                <p className="font-ja text-sm leading-relaxed" style={{ color: "#90a0b8" }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ON TOKEN / REWARDS ── */}
      <section className="py-16" style={{ background: "#060610" }}>
        <div className="max-w-3xl mx-auto px-4">
          <h2
            className="font-pixel text-center mb-10"
            style={{ fontSize: "0.9rem", color: "#fff", textShadow: "3px 3px 0 #0052FF" }}
          >
            ON TOKEN REWARDS
          </h2>
          <OnTokenDiagram />
        </div>
      </section>

      {/* ── WORLD STAGES ── */}
      <section className="py-16" style={{ background: "#0a0a1a" }}>
        <div className="max-w-5xl mx-auto px-4">
          <h2
            className="font-pixel text-center mb-2"
            style={{ fontSize: "0.9rem", color: "#fff", textShadow: "3px 3px 0 #0052FF" }}
          >
            WORLD STAGES
          </h2>
          <p className="font-ja text-center text-base mb-10" style={{ color: "#8095aa" }}>
            連鎖が長くなるほど世界が進化していく
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {STAGES.map((stage) => (
              <div
                key={stage.id}
                className="pixel-box flex flex-col overflow-hidden"
                style={{ borderColor: stage.accent, boxShadow: `4px 4px 0 ${stage.accent}` }}
              >
                <div
                  className="w-full aspect-video"
                  style={{
                    backgroundImage: `url(${stage.image})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
                <div className="p-3 flex flex-col gap-1.5" style={{ background: stage.bgDark }}>
                  <p className="font-pixel text-[0.72rem]" style={{ color: stage.accent }}>
                    STAGE {stage.level} · {stage.nameEn}
                  </p>
                  <p className="font-ja font-bold text-sm" style={{ color: "#e8eeff" }}>
                    {stage.emoji} {stage.name}
                  </p>
                  <p className="font-pixel text-[0.85rem]" style={{ color: stage.accent }}>
                    {stage.max === Infinity ? `${stage.min}+ 連鎖` : `${stage.min}〜${stage.max} 連鎖`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section
        className="py-16 text-center"
        style={{ background: "#0052FF", borderTop: "4px solid #000" }}
      >
        <h2
          className="font-pixel mb-4"
          style={{ fontSize: "0.9rem", color: "#fff", textShadow: "3px 3px 0 #0030aa" }}
        >
          READY PLAYER ONE?
        </h2>
        <p className="font-ja text-base mb-8" style={{ color: "#cce0ff" }}>
          ウォレット不要でメニューを閲覧できます
        </p>
        <Link
          href="/menu"
          className="pixel-btn inline-flex px-7 py-3.5 font-pixel text-[0.85rem]"
          style={{ background: "#fff", color: "#0052FF", borderColor: "#000" }}
        >
          ▸ START GAME →
        </Link>
      </section>
    </div>
  )
}
