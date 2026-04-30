import Link from "next/link"
import { cn } from "@/lib/utils"
import { PhoneMockup } from "@/components/shared/PhoneMockup"
import { StageLadder } from "@/components/shared/StageDisplay"
import { STAGES } from "@/lib/stages"

export default function Home() {
  return (
    <div className="min-h-[calc(100vh-3.5rem)]" style={{ background: "#0a0a1a" }}>

      {/* ── HERO ── */}
      <section className="max-w-5xl mx-auto px-4 py-12 md:py-20">
        <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">

          {/* テキスト */}
          <div className="flex-1 text-center md:text-left">
            {/* タイトルバー（ゲーム風） */}
            <div
              className="inline-flex items-center gap-2 px-3 py-1 mb-6 font-pixel text-[0.5rem]"
              style={{
                background: "#0052FF22",
                border: "2px solid #0052FF",
                color: "#0052FF",
                boxShadow: "3px 3px 0 #0052FF",
              }}
            >
              ▸ BUILT ON BASE BLOCKCHAIN
            </div>

            {/* メインタイトル */}
            <h1
              className="font-pixel mb-6 leading-loose"
              style={{
                fontSize: "clamp(1.1rem, 3.5vw, 2rem)",
                color: "#ffffff",
                textShadow: "4px 4px 0 #0052FF",
              }}
            >
              <span style={{ color: "#0052FF" }}>ON</span>LOOP
            </h1>

            {/* サブタイトル（日本語） */}
            <p
              className="font-ja text-lg mb-4 leading-relaxed"
              style={{ color: "#a0b4d0" }}
            >
              恩送りが繋がり、<br />
              <span style={{ color: "#0052FF" }}>ループ</span>して戻ってくる。
            </p>
            <p
              className="font-ja text-sm mb-8 leading-relaxed"
              style={{ color: "#607080" }}
            >
              写真・企画・料理——お金なしで好意が連鎖し、<br />
              チェーンが長くなるほど全員の報酬が増える。
            </p>

            {/* ボタン群 */}
            <div className="flex gap-4 flex-wrap justify-center md:justify-start">
              <Link
                href="/menu"
                className="pixel-btn px-5 py-3 font-pixel text-[0.55rem]"
                style={{ background: "#0052FF", color: "#fff", borderColor: "#000" }}
              >
                ▸ メニューを見る
              </Link>
              <Link
                href="/provider/apply"
                className="pixel-btn px-5 py-3 font-pixel text-[0.55rem]"
                style={{ background: "#0a0a1a", color: "#0052FF", borderColor: "#0052FF", boxShadow: "4px 4px 0 #0052FF" }}
              >
                ▸ ギバー登録
              </Link>
            </div>
          </div>

          {/* スマホモックアップ */}
          <div className="shrink-0 pixel-float">
            <PhoneMockup />
          </div>
        </div>
      </section>

      {/* ── STAGE LADDER ── */}
      <section style={{ background: "#060610", borderTop: "4px solid #111", borderBottom: "4px solid #111" }} className="py-8">
        <div className="max-w-5xl mx-auto px-4">
          <p className="font-pixel text-[0.5rem] text-center mb-4" style={{ color: "#405060" }}>
            ▸ WORLD PROGRESSION
          </p>
          <div className="flex justify-center">
            <StageLadder currentLength={1} />
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-16" style={{ background: "#0a0a1a" }}>
        <div className="max-w-5xl mx-auto px-4">
          <h2
            className="font-pixel text-center mb-10"
            style={{ fontSize: "0.75rem", color: "#fff", textShadow: "3px 3px 0 #0052FF" }}
          >
            HOW IT WORKS
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { step: "01", icon: "🎁", title: "恩を届ける", desc: "メニューからギバーを選んで依頼。または自分の好意をリンクにして誰かに送る。" },
              { step: "02", icon: "🔗", title: "受け取り、繋ぐ", desc: "受け取った人は次の誰かへ恩を送ることを約束。連鎖が広がっていく。" },
              { step: "03", icon: "🎉", title: "ループ完成", desc: "連鎖が起点に戻ったとき、全員にONトークンのボーナスが降り注ぐ。" },
            ].map((item) => (
              <div
                key={item.step}
                className="pixel-box p-6"
                style={{ background: "#0f1628" }}
              >
                <div className="font-pixel text-[0.5rem] mb-3" style={{ color: "#0052FF" }}>
                  STEP {item.step}
                </div>
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="font-ja font-bold text-base mb-2" style={{ color: "#e0e8ff" }}>
                  {item.title}
                </h3>
                <p className="font-ja text-sm leading-relaxed" style={{ color: "#607080" }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ON TOKEN / REWARDS ── */}
      <section className="py-16" style={{ background: "#060610" }}>
        <div className="max-w-5xl mx-auto px-4">
          <h2
            className="font-pixel text-center mb-10"
            style={{ fontSize: "0.75rem", color: "#fff", textShadow: "3px 3px 0 #0052FF" }}
          >
            ON TOKEN REWARDS
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="pixel-box p-6" style={{ background: "#0f1628" }}>
              <p className="font-pixel text-[0.5rem] mb-4" style={{ color: "#0052FF" }}>
                CHAIN HOP BONUS
              </p>
              <ul className="font-ja space-y-4 text-sm">
                {[
                  { role: "🌱 起点者", reward: "+5 ON / hop", color: "#52b788" },
                  { role: "🔗 中継者", reward: "+2 ON", color: "#f4a261" },
                  { role: "🤝 新受取人", reward: "+1 ON", color: "#48cae4" },
                ].map((r) => (
                  <li key={r.role} className="flex justify-between items-center border-b border-dashed border-gray-800 pb-2">
                    <span style={{ color: "#a0b4d0" }}>{r.role}</span>
                    <span className="font-pixel text-[0.55rem]" style={{ color: r.color }}>{r.reward}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div
              className="pixel-box p-6"
              style={{ background: "#0f1420", boxShadow: "4px 4px 0 #aa8800", borderColor: "#554400" }}
            >
              <p className="font-pixel text-[0.5rem] mb-4" style={{ color: "#ffcc00" }}>
                🎉 LOOP COMPLETE BONUS
              </p>
              <ul className="font-ja space-y-4 text-sm">
                <li className="flex justify-between items-center border-b border-dashed border-gray-800 pb-2">
                  <span style={{ color: "#a0b4d0" }}>全参加者</span>
                  <span className="font-pixel text-[0.55rem]" style={{ color: "#ffcc00" }}>N × 5 ON</span>
                </li>
                <li className="flex justify-between items-center">
                  <span style={{ color: "#a0b4d0" }}>起点者（2倍）</span>
                  <span className="font-pixel text-[0.55rem]" style={{ color: "#ffcc00" }}>N × 10 ON</span>
                </li>
              </ul>
              <p className="font-pixel text-[0.4rem] mt-4" style={{ color: "#554400" }}>
                N = ループ参加人数
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── WORLD STAGES ── */}
      <section className="py-16" style={{ background: "#0a0a1a" }}>
        <div className="max-w-5xl mx-auto px-4">
          <h2
            className="font-pixel text-center mb-2"
            style={{ fontSize: "0.75rem", color: "#fff", textShadow: "3px 3px 0 #0052FF" }}
          >
            WORLD STAGES
          </h2>
          <p className="font-ja text-center text-sm mb-10" style={{ color: "#607080" }}>
            連鎖が長くなるほど世界が進化していく
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {STAGES.map((stage) => (
              <div
                key={stage.id}
                className="pixel-box p-4 flex flex-col gap-2"
                style={{ background: stage.bgDark, borderColor: stage.accent, boxShadow: `4px 4px 0 ${stage.accent}` }}
              >
                <div className="text-3xl">{stage.emoji}</div>
                <div>
                  <p className="font-pixel text-[0.5rem]" style={{ color: stage.accent }}>
                    STAGE {stage.level} · {stage.nameEn}
                  </p>
                  <p className="font-ja font-bold text-sm mt-1" style={{ color: "#e0e8ff" }}>
                    {stage.name}
                  </p>
                </div>
                <p className="font-pixel text-[0.4rem]" style={{ color: stage.accent }}>
                  {stage.min === stage.max
                    ? `${stage.min}+ 連鎖`
                    : `${stage.min}〜${stage.max} 連鎖`}
                </p>
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
          style={{ fontSize: "0.75rem", color: "#fff", textShadow: "3px 3px 0 #0030aa" }}
        >
          READY PLAYER ONE?
        </h2>
        <p className="font-ja text-sm mb-8" style={{ color: "#cce0ff" }}>
          ウォレット不要でメニューを閲覧できます
        </p>
        <Link
          href="/menu"
          className="pixel-btn inline-flex px-6 py-3 font-pixel text-[0.55rem]"
          style={{ background: "#fff", color: "#0052FF", borderColor: "#000" }}
        >
          ▸ START GAME →
        </Link>
      </section>
    </div>
  )
}
