"use client"

import Link from "next/link"
import { PhoneMockup } from "@/components/shared/PhoneMockup"
import { LoopRibbon, Sticker } from "@/components/shared/LoopRibbon"
import { LoopFeed } from "@/components/loops/LoopFeed"
import { STAGES } from "@/lib/stages"
import { useLang } from "@/lib/i18n/context"

/* ステッカーパレット。1画面で必ず複数使う（1色をアクセントに選ばない） */
const PALETTE = ["#55db9c", "#ffd731", "#e9ccff", "#7ee8e8", "#fb4903", "#5c4ade"]

/** セクション見出し。英字の彫刻的ディスプレイ＋和文サブの2段組が基本形 */
function SectionHead({ en, sub }: { en: string; sub?: string }) {
  return (
    <div className="mb-8 md:mb-12">
      <h2 className="display-lg text-center">{en}</h2>
      {sub && (
        <p className="h-ja text-center text-sm md:text-base mt-4 max-w-2xl mx-auto">{sub}</p>
      )}
    </div>
  )
}

export default function Home() {
  const { T, lang } = useLang()

  return (
    <div>
      {/* ══ マーキー（動くのはここだけ） ══ */}
      <div className="marquee py-2">
        <div className="marquee-track">
          {Array.from({ length: 8 }).map((_, i) => (
            <span key={i} className="mx-6">
              PAY IT FORWARD · ON CHAIN · BUILT ON BASE · 恩を、次の誰かへ ·
            </span>
          ))}
        </div>
      </div>

      {/* ══ HERO ══ */}
      <section className="band-sky relative overflow-hidden">
        {/* 署名モチーフ。見出しの背後に回り込ませ、グリッドには揃えない */}
        <div
          aria-hidden
          className="absolute -right-16 -top-10 w-[420px] h-[420px] md:w-[560px] md:h-[560px]"
        >
          <LoopRibbon variant="ring" opacity={0.9} className="w-full h-full" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-5 pt-14 pb-16 md:pt-20 md:pb-24">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-10 md:gap-14">
            <div className="flex-1 w-full text-center md:text-left">
              {/* 巨大ディスプレイは英字専用。和文はこの下の階層に置く */}
              <h1 className="display-xl">ONLOOP</h1>

              <p className="h-ja text-lg sm:text-xl md:text-2xl mt-6 mb-6">
                {T.hero.tagline}
              </p>

              <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-8">
                {[T.hero.v1, T.hero.v2, T.hero.v3].map((v, i) => (
                  <span
                    key={i}
                    className="slush-badge font-ja"
                    style={{ background: PALETTE[i], fontSize: "0.875rem", fontWeight: 700 }}
                  >
                    {["🤝", "🔗", "🎨"][i]} {v}
                  </span>
                ))}
              </div>

              <div className="flex gap-3 flex-wrap justify-center md:justify-start mb-6">
                <Link href="/menu" className="slush-btn font-ja" style={{ fontWeight: 700 }}>
                  {T.hero.cta_menu}
                </Link>
                <Link href="/request" className="slush-btn slush-btn-ghost font-ja" style={{ fontWeight: 700 }}>
                  {T.hero.cta_request}
                </Link>
              </div>

              <p className="font-ui" style={{ fontSize: "0.75rem", opacity: 0.65 }}>
                {T.hero.builton}
              </p>
            </div>

            {/* 貼り付けたステッカー群。回転させて整列を崩す */}
            <div className="shrink-0 relative">
              <div className="absolute -left-6 -top-4 z-20 sticker-float">
                <Sticker fill="#fb4903" rotate={-14} size={58}>🚀</Sticker>
              </div>
              <div className="absolute -right-5 top-24 z-20">
                <Sticker fill="#ffd731" rotate={12} size={52} round>🪙</Sticker>
              </div>
              <div className="absolute -left-8 bottom-10 z-20">
                <Sticker fill="#55db9c" rotate={8} size={50}>✓</Sticker>
              </div>
              <PhoneMockup />
            </div>
          </div>
        </div>
      </section>

      {/* ══ LIVE LOOPS ══ 初めて来た人が最初に見る「今、恩が動いている」 */}
      <section className="band-paper relative overflow-hidden py-16 md:py-24">
        <div
          aria-hidden
          className="absolute -right-24 -bottom-16 w-[340px] h-[340px] opacity-70 pointer-events-none"
        >
          <LoopRibbon variant="ring" className="w-full h-full" />
        </div>
        <div className="relative z-10 max-w-5xl mx-auto px-5">
          <SectionHead en="LIVE LOOPS" sub="いま動いている恩送りと、閉じたループ。ウォレットなしで見られます。" />
          <LoopFeed limit={4} columns={2} />
          <div className="text-center mt-10">
            <Link href="/loops" className="slush-btn slush-btn-ghost font-ja" style={{ fontWeight: 700 }}>
              ▸ すべてのループを見る
            </Link>
          </div>
        </div>
      </section>

      {/* ══ HOW IT WORKS ══ */}
      <section className="band-paper relative overflow-hidden py-16 md:py-24">
        <div
          aria-hidden
          className="absolute -left-24 -top-8 w-[420px] h-[420px] opacity-75 pointer-events-none"
        >
          <LoopRibbon variant="arc" className="w-full h-full" />
        </div>
        <div className="relative z-10 max-w-5xl mx-auto px-5">
          <SectionHead en="HOW IT WORKS" sub={T.how.sub} />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {T.how.steps.map((item: any, i: number) => (
              <div
                key={item.step}
                className="slush-card p-6 flex flex-col"
                style={{ background: PALETTE[i % PALETTE.length] }}
              >
                <span className="slush-badge mb-4 self-start" style={{ background: "#ffffff" }}>
                  STEP {item.step}
                </span>
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="h-ja text-base mb-2">{item.title}</h3>
                <p className="font-ja text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ ON TOKEN ══ */}
      <section className="band-concrete relative overflow-hidden py-16 md:py-24">
        <div
          aria-hidden
          className="absolute -right-10 -bottom-20 w-[360px] h-[360px] opacity-80 pointer-events-none"
        >
          <LoopRibbon variant="ring" className="w-full h-full" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-5">
          <SectionHead en="ON TOKEN" sub={T.token.sub} />
          <div className="grid md:grid-cols-3 gap-5 mb-8">
            {T.token.cards.map((item: any, i: number) => (
              <div
                key={item.label}
                className="slush-card p-6 text-center"
                style={{ background: ["#ffffff", "#ffd731", "#e9ccff"][i] }}
              >
                <div className="text-4xl mb-3">{item.icon}</div>
                <p className="h-ja text-sm mb-2">{item.label}</p>
                <p className="display-md mb-2">{item.value}</p>
                <p className="font-ja text-sm">{item.note}</p>
              </div>
            ))}
          </div>
          <div className="slush-card-lg p-6 text-center">
            <p className="font-ja text-sm leading-relaxed">{T.token.chain}</p>
          </div>
        </div>
      </section>

      {/* ══ WORLD STAGES ══ */}
      <section className="band-sky relative overflow-hidden py-16 md:py-24">
        <div
          aria-hidden
          className="absolute -right-16 top-8 w-[320px] h-[320px] opacity-80 pointer-events-none"
        >
          <LoopRibbon variant="ring" className="w-full h-full" />
        </div>
        <div className="relative z-10 max-w-5xl mx-auto px-5">
          <SectionHead en="WORLD STAGES" sub={T.stages.sub} />
          <p className="font-ja text-center text-sm mb-8">
            <span className="slush-badge" style={{ background: "#ffd731" }}>×N</span>{" "}
            {T.stages.note}
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {STAGES.map((stage) => (
              <div key={stage.id} className="slush-card flex flex-col overflow-hidden">
                <div
                  className="w-full aspect-video img-pixel"
                  style={{
                    backgroundImage: `url(${stage.image})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    borderBottom: "1px solid #000000",
                  }}
                />
                <div className="p-4 flex flex-col gap-2" style={{ background: stage.bgDark }}>
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-ui" style={{ fontSize: "0.7rem" }}>
                      STAGE {stage.level}
                    </p>
                    <span className="slush-badge" style={{ background: stage.accent, fontSize: "0.7rem" }}>
                      ×{stage.loopMultiplier}
                    </span>
                  </div>
                  <p className="h-ja text-base">
                    {stage.emoji} {lang === "ja" ? stage.name : stage.nameEn}
                  </p>
                  <p className="display-md" style={{ fontSize: "1.35rem" }}>
                    {stage.max === Infinity
                      ? `${stage.min}+`
                      : `${stage.min}–${stage.max}`}
                  </p>
                  <p className="font-ja text-sm">{T.stages.chain}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CTA ══ */}
      <section className="band-lavender relative overflow-hidden py-20 md:py-28 text-center">
        <div
          aria-hidden
          className="absolute left-1/2 -translate-x-1/2 -bottom-40 w-[520px] h-[520px] opacity-60 pointer-events-none"
        >
          <LoopRibbon variant="ring" className="w-full h-full" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto px-5">
          <h2 className="display-lg mb-6">JOIN THE LOOP</h2>
          <p className="h-ja text-lg md:text-xl mb-3">{T.cta.title}</p>
          <p className="font-ja text-sm mb-2">{T.cta.sub}</p>
          <p className="font-ja text-sm mb-8" style={{ opacity: 0.7 }}>{T.cta.wallet_note}</p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link href="/menu" className="slush-btn font-ja" style={{ fontWeight: 700 }}>
              {T.cta.btn_menu}
            </Link>
            <Link href="/request" className="slush-btn slush-btn-ghost font-ja" style={{ fontWeight: 700 }}>
              {T.cta.btn_request}
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
