"use client"

import Link from "next/link"
import { PhoneMockup } from "@/components/shared/PhoneMockup"
import { STAGES } from "@/lib/stages"
import { useLang } from "@/lib/i18n/context"

const STAGE_SAMPLES = [
  { file: "stage8_宇宙.png",   label: "🚀 SPACE",  accent: "#9b5de5" },
  { file: "stage7_地球.png",   label: "🌐 EARTH",  accent: "#48cae4" },
  { file: "stage6_世界.png",   label: "🌍 WORLD",  accent: "#4361ee" },
  { file: "stage5_欧米.png",   label: "🗽 WEST",   accent: "#90e0ef" },
  { file: "stage4_アジア.png", label: "🌏 ASIA",   accent: "#f9c74f" },
  { file: "stage3_日本.png",   label: "🗼 JAPAN",  accent: "#e63946" },
  { file: "stage2_街.png",     label: "🏘️ TOWN",   accent: "#f4a261" },
  { file: "stage1_村.png",     label: "🌱 VILLAGE",accent: "#52b788" },
]

export default function Home() {
  const { T, lang } = useLang()

  return (
    <div className="min-h-[calc(100vh-3.5rem)]" style={{ background: "#0a0a1a" }}>

      {/* ── HERO ── */}
      <section
        className="relative overflow-hidden"
        style={{ backgroundImage: "url(/onloop_baner.png)", backgroundSize: "cover", backgroundPosition: "center" }}
      >
        <div className="absolute inset-0" style={{ background: "rgba(6, 6, 18, 0.50)" }} />
        <div className="relative z-10 max-w-5xl mx-auto px-4 pt-8 pb-0 md:pt-12 md:pb-24">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-16">
            <div className="flex-1 text-center md:text-left w-full">
              <h1 className="font-pixel mb-4 leading-loose"
                style={{ fontSize: "clamp(1.4rem, 4vw, 2.2rem)", color: "#ffffff", textShadow: "4px 4px 0 #0052FF" }}>
                <span style={{ color: "#ffffff", textShadow: "4px 4px 0 #0052FF" }}>ON</span>LOOP
              </h1>
              <p className="font-ja text-xl sm:text-2xl mb-5 font-bold leading-relaxed" style={{ color: "#ffffff" }}>
                {T.hero.tagline}
              </p>
              <div className="space-y-2 mb-6 text-left inline-block w-full max-w-sm mx-auto md:mx-0">
                {[T.hero.v1, T.hero.v2, T.hero.v3].map((v, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="text-base">{["🤝","🔗","🎨"][i]}</span>
                    <p className="font-ja text-sm" style={{ color: "#c0d8f0" }}>{v}</p>
                  </div>
                ))}
              </div>
              <p className="font-pixel mb-4 text-center md:text-left"
                style={{ fontSize: "0.7rem", color: "#3a6aaa", letterSpacing: "0.08em" }}>
                {T.hero.builton}
              </p>
              <div className="flex gap-3 flex-wrap justify-center md:justify-start">
                <Link href="/menu" className="pixel-btn font-pixel"
                  style={{ background: "#0052FF", color: "#fff", borderColor: "#000", padding: "0.75rem 1.25rem", fontSize: "0.75rem" }}>
                  {T.hero.cta_menu}
                </Link>
                <Link href="/mint" className="pixel-btn font-pixel"
                  style={{ background: "#0a0a1a", color: "#9b5de5", borderColor: "#9b5de5", boxShadow: "3px 3px 0 #9b5de5", padding: "0.75rem 1.25rem", fontSize: "0.75rem" }}>
                  {T.hero.cta_mint}
                </Link>
              </div>
            </div>
            <div className="shrink-0 w-full flex justify-center md:block md:w-auto">
              <PhoneMockup />
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-10 md:py-16" style={{ background: "#0a0a1a" }}>
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="font-pixel text-center mb-2"
            style={{ fontSize: "0.9rem", color: "#fff", textShadow: "3px 3px 0 #0052FF" }}>
            {T.how.title}
          </h2>
          <p className="font-ja text-center text-sm mb-8 md:mb-10" style={{ color: "#506070" }}>
            {T.how.sub}
          </p>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
            {T.how.steps.map((item: any) => (
              <div key={item.step} className="pixel-box p-5" style={{ background: "#0f1628" }}>
                <div className="font-pixel text-[0.72rem] mb-3" style={{ color: "#0052FF" }}>STEP {item.step}</div>
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="font-ja font-bold text-base mb-2" style={{ color: "#e0e8ff" }}>{item.title}</h3>
                <p className="font-ja text-sm leading-relaxed" style={{ color: "#90a0b8" }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ON TOKEN ── */}
      <section className="py-10 md:py-16" style={{ background: "#060610" }}>
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="font-pixel text-center mb-2"
            style={{ fontSize: "0.9rem", color: "#fff", textShadow: "3px 3px 0 #0052FF" }}>
            {T.token.title}
          </h2>
          <p className="font-ja text-center text-sm mb-8" style={{ color: "#506070" }}>
            {T.token.sub}
          </p>
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            {T.token.cards.map((item: any) => (
              <div key={item.label} className="pixel-box p-5 text-center"
                style={{ background: "#0a0a1a", borderColor: item.accent, boxShadow: `3px 3px 0 ${item.accent}` }}>
                <div className="text-3xl mb-2">{item.icon}</div>
                <p className="font-ja text-sm font-bold mb-1" style={{ color: "#c0d0e8" }}>{item.label}</p>
                <p className="font-pixel mb-1" style={{ fontSize: "1.1rem", color: item.accent }}>{item.value}</p>
                <p className="font-ja text-xs" style={{ color: "#506070" }}>{item.note}</p>
              </div>
            ))}
          </div>
          <div className="pixel-box p-4 text-center" style={{ background: "#0a0a1a", border: "2px solid #1a2a3a" }}>
            <p className="font-ja text-sm" style={{ color: "#8095aa" }}>{T.token.chain}</p>
          </div>
        </div>
      </section>

      {/* ── NFT COLLECTION ── */}
      <section className="py-10 md:py-16" style={{ background: "#0a0a1a" }}>
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="font-pixel text-center mb-2"
            style={{ fontSize: "0.9rem", color: "#fff", textShadow: "3px 3px 0 #9b5de5" }}>
            ONLOOP NFT
          </h2>
          <p className="font-ja text-center text-sm mb-2" style={{ color: "#506070" }}>{T.nft.sub}</p>
          <div className="pixel-box p-4 mb-6 text-center"
            style={{ background: "#0f0f20", border: "2px solid #2a2a4a" }}>
            <p className="font-pixel text-[0.7rem] mb-2" style={{ color: "#7ab0ff" }}>{T.nft.what_q}</p>
            <p className="font-ja text-sm leading-relaxed" style={{ color: "#8095aa" }}>
              {T.nft.what_a.split("約100円")[0]}
              <span style={{ color: "#c0d0e8" }}>{lang === "ja" ? "約100円" : "~$0.70"}</span>
              {T.nft.what_a.split("約100円")[1]}
            </p>
          </div>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-2 mb-6">
            {STAGE_SAMPLES.map((s) => (
              <div key={s.file} className="flex flex-col items-center gap-1">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`/nft-samples/${s.file}`} alt={s.label} className="w-full aspect-square object-cover"
                  style={{ imageRendering: "pixelated", border: `2px solid ${s.accent}` }} />
                <p className="font-pixel text-center leading-tight" style={{ fontSize: "0.5rem", color: s.accent }}>
                  {s.label}
                </p>
              </div>
            ))}
          </div>
          <p className="font-ja text-center text-xs mb-8" style={{ color: "#506070" }}>{T.nft.count}</p>
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            {T.nft.merits.map((item: any) => (
              <div key={item.title} className="pixel-box p-5" style={{ background: "#0f1628" }}>
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="font-ja font-bold text-base mb-2" style={{ color: "#e0e8ff" }}>{item.title}</h3>
                <p className="font-ja text-sm leading-relaxed" style={{ color: "#90a0b8" }}>{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="pixel-box overflow-hidden mb-8" style={{ background: "#060610" }}>
            <div className="px-4 py-3" style={{ borderBottom: "2px solid #1a2a3a" }}>
              <p className="font-pixel text-center text-[0.72rem]" style={{ color: "#9b5de5" }}>NFT BOOST RATE</p>
            </div>
            <div className="grid grid-cols-3 md:grid-cols-6">
              {[
                { label:"Common",    mult:"×1.1", accent:"#52b788" },
                { label:"Uncommon",  mult:"×1.3", accent:"#f9c74f" },
                { label:"Rare",      mult:"×1.6", accent:"#4361ee" },
                { label:"Epic",      mult:"×1.8", accent:"#48cae4" },
                { label:"Legendary", mult:"×2.0", accent:"#9b5de5" },
                { label: lang === "ja" ? "未保有" : "No NFT", mult:"×1.0", accent:"#3a5a7a" },
              ].map((r) => (
                <div key={r.label} className="p-3 text-center" style={{ borderRight: "1px solid #1a2a3a" }}>
                  <p className="font-pixel text-[0.62rem] mb-1" style={{ color: r.accent }}>{r.label}</p>
                  <p className="font-pixel text-[0.85rem]" style={{ color: r.mult === "×1.0" ? "#3a5a7a" : "#fff" }}>{r.mult}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="text-center">
            <p className="font-ja text-sm mb-4" style={{ color: "#7090a8" }}>{T.nft.wallet_note}</p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link href="/mint" className="pixel-btn font-pixel"
                style={{ background: "#9b5de5", color: "#fff", borderColor: "#000", padding: "0.85rem 2rem", fontSize: "0.8rem" }}>
                {T.nft.cta_mint}
              </Link>
              <Link href="/menu" className="pixel-btn font-pixel"
                style={{ background: "#0a0a1a", color: "#7ab0ff", borderColor: "#0052FF", boxShadow: "3px 3px 0 #0052FF", padding: "0.85rem 2rem", fontSize: "0.8rem" }}>
                {T.nft.cta_menu}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── WORLD STAGES ── */}
      <section className="py-10 md:py-16" style={{ background: "#060610" }}>
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="font-pixel text-center mb-2"
            style={{ fontSize: "0.9rem", color: "#fff", textShadow: "3px 3px 0 #0052FF" }}>
            {T.stages.title}
          </h2>
          <p className="font-ja text-center text-base mb-1" style={{ color: "#8095aa" }}>{T.stages.sub}</p>
          <p className="font-ja text-center text-xs mb-8" style={{ color: "#506070" }}>
            <span className="font-pixel" style={{ color: "#ffcc00" }}>×N</span>{" "}{T.stages.note}
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {STAGES.map((stage) => (
              <div key={stage.id} className="pixel-box flex flex-col overflow-hidden"
                style={{ borderColor: stage.accent, boxShadow: `4px 4px 0 ${stage.accent}` }}>
                <div className="w-full aspect-video"
                  style={{ backgroundImage: `url(${stage.image})`, backgroundSize: "cover", backgroundPosition: "center" }} />
                <div className="p-3 flex flex-col gap-1.5" style={{ background: stage.bgDark }}>
                  <div className="flex items-center justify-between">
                    <p className="font-pixel text-[0.72rem]" style={{ color: stage.accent }}>
                      STAGE {stage.level} · {stage.nameEn}
                    </p>
                    <span className="font-pixel text-[0.62rem] px-1 py-0.5"
                      style={{ background: "#ffcc0022", border: "1px solid #aa8800", color: "#ffcc00" }}>
                      ×{stage.loopMultiplier}
                    </span>
                  </div>
                  <p className="font-ja font-bold text-sm" style={{ color: "#e8eeff" }}>
                    {stage.emoji} {lang === "ja" ? stage.name : stage.nameEn}
                  </p>
                  <p className="font-pixel text-[0.85rem]" style={{ color: stage.accent }}>
                    {stage.max === Infinity
                      ? `${stage.min}+ ${T.stages.chain}`
                      : `${stage.min}〜${stage.max} ${T.stages.chain}`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-10 md:py-16 text-center"
        style={{ background: "#0052FF", borderTop: "4px solid #000" }}>
        <h2 className="font-pixel mb-3"
          style={{ fontSize: "0.9rem", color: "#fff", textShadow: "3px 3px 0 #0030aa" }}>
          {T.cta.title}
        </h2>
        <p className="font-ja text-sm mb-2" style={{ color: "#cce0ff" }}>{T.cta.sub}</p>
        <p className="font-ja text-xs mb-8" style={{ color: "#99bbdd" }}>{T.cta.wallet_note}</p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link href="/menu" className="pixel-btn font-pixel"
            style={{ background: "#fff", color: "#0052FF", borderColor: "#000", padding: "0.85rem 2rem", fontSize: "0.8rem" }}>
            {T.cta.btn_menu}
          </Link>
          <Link href="/mint" className="pixel-btn font-pixel"
            style={{ background: "#0030aa", color: "#fff", borderColor: "#000", padding: "0.85rem 2rem", fontSize: "0.8rem" }}>
            {T.cta.btn_mint}
          </Link>
        </div>
      </section>
    </div>
  )
}
