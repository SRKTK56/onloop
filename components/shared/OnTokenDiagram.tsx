import { PixelChar } from "./PixelChar"

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
      <span className="font-pixel text-[0.9rem]" style={{ color }}>▶</span>
    </div>
  )
}

export function OnTokenDiagram() {
  return (
    <div className="space-y-6">

      {/* ── CHAIN HOP REWARDS ── */}
      <div className="pixel-box p-6" style={{ background: "#0f1628" }}>
        <p className="font-pixel text-[0.72rem] mb-6 text-center" style={{ color: "#0052FF" }}>
          CHAIN HOP REWARDS
        </p>

        {/* キャラクター列 */}
        <div className="flex items-end justify-center gap-1 flex-wrap">
          {CHAIN.map((node, i) => (
            <div key={node.role + i} className="flex items-end gap-1">
              <div className="flex flex-col items-center gap-1">
                {/* 報酬バッジ */}
                <div
                  className="font-pixel text-[0.72rem] px-1.5 py-0.5 mb-1"
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
                <p className="font-pixel text-[0.72rem]" style={{ color: node.accent }}>{node.role}</p>
                <p className="font-ja text-xs" style={{ color: "#90a0b8" }}>{node.label}</p>
              </div>

              {/* 矢印 */}
              {i < CHAIN.length - 1 && <Arrow color="#1e3a5f" />}
            </div>
          ))}
          {/* 続く… */}
          <div className="flex items-center" style={{ paddingBottom: "2.5rem" }}>
            <span className="font-pixel text-[0.72rem] pixel-blink" style={{ color: "#3a6080" }}>▶▶</span>
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
              <p className="font-pixel text-[0.72rem] mb-1" style={{ color: r.color }}>{r.label}</p>
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
        <p className="font-pixel text-[0.72rem] mb-6 text-center" style={{ color: "#ffcc00" }}>
          🎉 LOOP COMPLETE BONUS
        </p>

        {/* ループ図：上段(A→B→C→D) + 下段の帰還矢印 + 起点者Aに戻る */}
        <div className="relative">

          {/* 上段：前進チェーン */}
          <div className="flex items-end justify-between px-2">

            {/* 起点者A（出発） */}
            <div className="flex flex-col items-center gap-1">
              <div
                className="font-pixel text-[0.72rem] px-1.5 py-0.5"
                style={{ border: "2px solid #0052FF", color: "#0052FF", background: "#0052FF22" }}
              >出発</div>
              <PixelChar type="hero" scale={4} />
              <p className="font-pixel text-[0.72rem]" style={{ color: "#0052FF" }}>ORIGIN A</p>
            </div>

            {/* 中間ノード (B→C→D→...) */}
            <div className="flex-1 flex items-center justify-center gap-2 px-2">
              <span className="font-pixel text-[0.82rem]" style={{ color: "#aa8800" }}>▶▶</span>
              <div className="flex gap-3 items-end">
                {(["warrior","mage","villager"] as const).map((c, i) => (
                  <PixelChar key={i} type={c} scale={5} />
                ))}
              </div>
              <span className="font-pixel text-[0.82rem] pixel-blink" style={{ color: "#806600" }}>▶▶</span>
            </div>

            {/* 最後のノード（折返し） */}
            <div className="flex flex-col items-center gap-1">
              <div
                className="font-pixel text-[0.72rem] px-1.5 py-0.5"
                style={{ border: "2px solid #aa8800", color: "#aa8800", background: "#aa880022" }}
              >折返し</div>
              <PixelChar type="villager" scale={4} />
              <p className="font-pixel text-[0.72rem]" style={{ color: "#aa8800" }}>LAST</p>
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
                className="font-pixel text-[0.85rem] px-3 py-1"
                style={{ background: "#0f1420", color: "#ffcc00", border: "2px solid #aa8800", whiteSpace: "nowrap" }}
              >
                🎉 LOOP COMPLETE!
              </span>
            </div>
          </div>

          {/* 起点者A（帰還・ボーナス受取） */}
          <div className="flex flex-col items-center gap-1 mt-8">
            {/* ▲ 矢印 */}
            <span className="font-pixel text-[0.9rem]" style={{ color: "#ffcc00" }}>▲</span>

            {/* ボーナスバッジ */}
            <div
              className="font-pixel text-[0.85rem] px-3 py-1 pixel-blink"
              style={{
                background: "#ffcc0033",
                border: "3px solid #ffcc00",
                boxShadow: "3px 3px 0 #ffcc00",
                color: "#ffcc00",
              }}
            >
              N × 20 ON GET!!
            </div>

            {/* キャラ（起点者・ボーナス受取） */}
            <PixelChar type="hero" scale={5} />
            <p className="font-pixel text-[0.72rem]" style={{ color: "#ffcc00" }}>ORIGIN A</p>
            <p className="font-ja text-sm" style={{ color: "#aa8800" }}>起点者は最大4倍のボーナス！</p>
          </div>
        </div>

        {/* 参加者全員も受け取る */}
        <div
          className="mt-6 p-3 text-center"
          style={{ border: "2px solid #554400", background: "#0a0a0f" }}
        >
          <p className="font-ja text-sm mb-1" style={{ color: "#aa8800" }}>
            中継者も <span className="font-pixel text-[0.7rem]" style={{ color: "#ffcc00" }}>N × 5 ON</span> 獲得 ／ 起点者は <span className="font-pixel text-[0.7rem]" style={{ color: "#ffcc00" }}>N × 20 ON</span>
          </p>
          <p className="font-ja text-xs mt-1" style={{ color: "#605040" }}>
            N = ループ参加人数 ／ ステージが上がるほど倍率UP
          </p>
        </div>

        {/* 早期中継者ボーナス */}
        <div
          className="mt-3 p-3"
          style={{ border: "2px solid #0052FF44", background: "#00091a" }}
        >
          <p className="font-pixel text-[0.7rem] mb-2" style={{ color: "#7ab0ff" }}>
            ⚡ EARLY RELAY BONUS
          </p>
          <div className="grid grid-cols-4 gap-1">
            {[
              { pos: "1番目", mult: "×3.0", on: "N×15" },
              { pos: "2番目", mult: "×2.5", on: "N×12.5" },
              { pos: "3番目", mult: "×2.0", on: "N×10" },
              { pos: "4番目+", mult: "×1.0", on: "N×5" },
            ].map((r) => (
              <div key={r.pos} className="text-center p-1.5" style={{ background: "#060a14", border: "1px solid #1a2a4a" }}>
                <p className="font-ja text-xs mb-0.5" style={{ color: "#506070" }}>{r.pos}</p>
                <p className="font-pixel text-[0.7rem]" style={{ color: "#7ab0ff" }}>{r.mult}</p>
                <p className="font-pixel text-[0.62rem]" style={{ color: "#3a5a7a" }}>{r.on}</p>
              </div>
            ))}
          </div>
          <p className="font-ja text-xs mt-2" style={{ color: "#3a5060" }}>
            チェーンに早く参加するほど、ループ完成時のボーナスが大きくなります
          </p>
        </div>

        <p className="font-ja text-center text-xs mt-4" style={{ color: "#605040" }}>
          ステージが上がるほどループ倍率もUP（×1〜×20）— 詳細は下の WORLD STAGES へ
        </p>
      </div>
    </div>
  )
}
