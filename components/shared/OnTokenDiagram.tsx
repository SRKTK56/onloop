import { PixelChar } from "./PixelChar"
import { STAGES } from "@/lib/stages"

// ── チェーンノードの定義 ──
const CHAIN = [
  { char: "hero" as const,     role: "ORIGIN",  label: "起点者",   reward: "+5 ON/hop", color: "#0052FF",  accent: "#0052FF" },
  { char: "warrior" as const,  role: "RELAY",   label: "中継者",   reward: "+2 ON",     color: "#e63946",  accent: "#e63946" },
  { char: "mage" as const,     role: "RELAY",   label: "中継者",   reward: "+2 ON",     color: "#9333ea",  accent: "#9333ea" },
  { char: "villager" as const, role: "NEW",     label: "新受取人", reward: "+1 ON",     color: "#52b788",  accent: "#52b788" },
]

function Arrow({ color }: { color: string }) {
  return (
    <div className="flex items-center" style={{ paddingBottom: "2.5rem" }}>
      <span className="font-pixel text-[0.7rem]" style={{ color }}>▶</span>
    </div>
  )
}

export function OnTokenDiagram() {
  return (
    <div className="space-y-6">

      {/* ── CHAIN HOP REWARDS ── */}
      <div className="pixel-box p-6" style={{ background: "#0f1628" }}>
        <p className="font-pixel text-[0.5rem] mb-6 text-center" style={{ color: "#0052FF" }}>
          CHAIN HOP REWARDS
        </p>

        {/* キャラクター列 */}
        <div className="flex items-end justify-center gap-1 flex-wrap">
          {CHAIN.map((node, i) => (
            <div key={node.role + i} className="flex items-end gap-1">
              <div className="flex flex-col items-center gap-1">
                {/* 報酬バッジ */}
                <div
                  className="font-pixel text-[0.5rem] px-1.5 py-0.5 mb-1"
                  style={{
                    background: `${node.accent}22`,
                    border: `2px solid ${node.accent}`,
                    color: node.accent,
                    boxShadow: `2px 2px 0 ${node.accent}`,
                    whiteSpace: "nowrap",
                  }}
                >
                  {node.reward}
                </div>
                {/* キャラクター */}
                <PixelChar type={node.char} scale={4} />
                {/* ラベル */}
                <p className="font-pixel text-[0.5rem]" style={{ color: node.accent }}>{node.role}</p>
                <p className="font-ja text-xs" style={{ color: "#90a0b8" }}>{node.label}</p>
              </div>

              {/* 矢印 */}
              {i < CHAIN.length - 1 && <Arrow color="#1e3a5f" />}
            </div>
          ))}
          {/* 続く… */}
          <div className="flex items-center" style={{ paddingBottom: "2.5rem" }}>
            <span className="font-pixel text-[0.5rem] pixel-blink" style={{ color: "#3a6080" }}>▶▶</span>
          </div>
        </div>

        {/* 役割説明 */}
        <div className="mt-5 grid grid-cols-3 gap-2">
          {[
            { color: "#0052FF", label: "起点者",   desc: "チェーンが伸びるたびに+5 ON累積。最も多く稼げる。" },
            { color: "#e63946", label: "中継者",   desc: "次の人へ渡したとき+2 ON獲得。" },
            { color: "#52b788", label: "新受取人", desc: "恩送りを受け取ったとき+1 ON獲得。" },
          ].map((r) => (
            <div key={r.label} className="p-2" style={{ background: "#0a0a1a", border: `2px solid ${r.color}33` }}>
              <p className="font-pixel text-[0.5rem] mb-1" style={{ color: r.color }}>{r.label}</p>
              <p className="font-ja text-xs leading-relaxed" style={{ color: "#90a0b8" }}>{r.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── LOOP COMPLETE BONUS ── */}
      <div
        className="pixel-box p-6"
        style={{ background: "#0f1420", borderColor: "#aa8800", boxShadow: "4px 4px 0 #aa8800" }}
      >
        <p className="font-pixel text-[0.5rem] mb-6 text-center" style={{ color: "#ffcc00" }}>
          🎉 LOOP COMPLETE BONUS
        </p>

        {/* ループ図：上段(A→B→C→D) + 下段の帰還矢印 + 起点者Aに戻る */}
        <div className="relative">

          {/* 上段：前進チェーン */}
          <div className="flex items-end justify-between px-2">

            {/* 起点者A（出発） */}
            <div className="flex flex-col items-center gap-1">
              <div
                className="font-pixel text-[0.5rem] px-1.5 py-0.5"
                style={{ border: "2px solid #0052FF", color: "#0052FF", background: "#0052FF22" }}
              >出発</div>
              <PixelChar type="hero" scale={4} />
              <p className="font-pixel text-[0.5rem]" style={{ color: "#0052FF" }}>ORIGIN A</p>
            </div>

            {/* 中間ノード (B→C→D→...) */}
            <div className="flex-1 flex items-center justify-center gap-1 px-2">
              <span className="font-pixel text-[0.5rem]" style={{ color: "#aa8800" }}>▶▶</span>
              <div className="flex gap-2">
                {(["warrior","mage","villager"] as const).map((c, i) => (
                  <PixelChar key={i} type={c} scale={3} />
                ))}
              </div>
              <span className="font-pixel text-[0.5rem] pixel-blink" style={{ color: "#806600" }}>▶▶</span>
            </div>

            {/* 最後のノード（折返し） */}
            <div className="flex flex-col items-center gap-1">
              <div
                className="font-pixel text-[0.5rem] px-1.5 py-0.5"
                style={{ border: "2px solid #aa8800", color: "#aa8800", background: "#aa880022" }}
              >折返し</div>
              <PixelChar type="villager" scale={4} />
              <p className="font-pixel text-[0.5rem]" style={{ color: "#aa8800" }}>LAST</p>
            </div>
          </div>

          {/* ↓帰還ライン */}
          <div className="relative flex items-stretch mx-6 mt-1" style={{ height: 48 }}>
            {/* 左端の↓→（Aの下） */}
            <div
              className="w-1/2"
              style={{
                borderLeft: "3px solid #ffcc00",
                borderBottom: "3px solid #ffcc00",
              }}
            />
            {/* 右端の↓（Lastの下） */}
            <div
              className="w-1/2"
              style={{
                borderRight: "3px solid #ffcc00",
                borderBottom: "3px solid #ffcc00",
              }}
            />
            {/* 中央ラベル */}
            <div
              className="absolute inset-x-0 bottom-0 flex justify-center"
              style={{ transform: "translateY(50%)" }}
            >
              <span
                className="font-pixel text-[0.42rem] px-3 py-1"
                style={{ background: "#0f1420", color: "#ffcc00", border: "2px solid #aa8800", whiteSpace: "nowrap" }}
              >
                🎉 LOOP COMPLETE!
              </span>
            </div>
          </div>

          {/* 起点者A（帰還・ボーナス受取） */}
          <div className="flex flex-col items-center gap-1 mt-8">
            {/* ▲ 矢印 */}
            <span className="font-pixel text-[0.7rem]" style={{ color: "#ffcc00" }}>▲</span>

            {/* ボーナスバッジ */}
            <div
              className="font-pixel text-[0.45rem] px-3 py-1 pixel-blink"
              style={{
                background: "#ffcc0033",
                border: "3px solid #ffcc00",
                boxShadow: "3px 3px 0 #ffcc00",
                color: "#ffcc00",
              }}
            >
              N × 10 ON GET!!
            </div>

            {/* キャラ（起点者・ボーナス受取） */}
            <PixelChar type="hero" scale={5} />
            <p className="font-pixel text-[0.5rem]" style={{ color: "#ffcc00" }}>ORIGIN A</p>
            <p className="font-ja text-xs" style={{ color: "#aa8800" }}>起点者は2倍のボーナス！</p>
          </div>
        </div>

        {/* 参加者全員も受け取る */}
        <div
          className="mt-6 p-3 text-center"
          style={{ border: "2px solid #554400", background: "#0a0a0f" }}
        >
          <p className="font-ja text-sm mb-1" style={{ color: "#aa8800" }}>
            ループに参加した全員も <span className="font-pixel text-[0.5rem]" style={{ color: "#ffcc00" }}>N × 5 ON</span> 獲得
          </p>
          <p className="font-ja text-xs" style={{ color: "#605040" }}>
            N = ループ参加人数 ／ ステージが上がるほど倍率UP！
          </p>
        </div>

        {/* ── ステージ別ループ倍率テーブル ── */}
        <div className="mt-4">
          <p className="font-pixel text-[0.45rem] mb-3 text-center" style={{ color: "#aa8800" }}>
            STAGE LOOP MULTIPLIER
          </p>
          <div className="grid grid-cols-4 gap-1.5">
            {STAGES.map((s) => (
              <div
                key={s.id}
                className="p-2 flex flex-col items-center gap-1"
                style={{ background: s.bgDark, border: `2px solid ${s.accent}`, boxShadow: `2px 2px 0 ${s.accent}` }}
              >
                <span className="text-lg">{s.emoji}</span>
                <p className="font-pixel text-[0.45rem]" style={{ color: s.accent }}>{s.nameEn}</p>
                <div
                  className="font-pixel text-[0.42rem] px-1"
                  style={{ background: `${s.accent}22`, color: "#ffcc00" }}
                >
                  ×{s.loopMultiplier}
                </div>
                <p className="font-pixel text-[0.42rem] text-center leading-relaxed" style={{ color: s.accent }}>
                  起点<br />{10 * s.loopMultiplier}N ON
                </p>
              </div>
            ))}
          </div>
          <p className="font-ja text-center text-xs mt-3" style={{ color: "#405060" }}>
            宇宙ステージでは起点者が <span className="font-pixel text-[0.45rem]" style={{ color: "#9b5de5" }}>N×200 ON</span> を獲得！
          </p>
        </div>
      </div>
    </div>
  )
}
