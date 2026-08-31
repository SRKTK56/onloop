import { PixelChar } from "./PixelChar"

// ── チェーンノードの定義 ──
const CHAIN = [
  { char: "hero" as const,     role: "ORIGIN",  label: "起点者",   reward: "+5 ON/hop", color: "#0052FF",  accent: "#0052FF" },
  { char: "warrior" as const,  role: "RELAY",   label: "中継者",   reward: "+2 ON",     color: "#ff4d6d",  accent: "#ff4d6d" },
  { char: "mage" as const,     role: "RELAY",   label: "中継者",   reward: "+2 ON",     color: "#5c4ade",  accent: "#5c4ade" },
  { char: "villager" as const, role: "NEW",     label: "新受取人", reward: "+1 ON",     color: "#55db9c",  accent: "#55db9c" },
]

function Arrow({ color }: { color: string }) {
  return (
    <div className="flex items-center" style={{ paddingBottom: "2.5rem" }}>
      <span className="font-display text-[0.9rem]" style={{ color }}>▶</span>
    </div>
  )
}

export function OnTokenDiagram() {
  return (
    <div className="space-y-6">

      {/* ── CHAIN HOP REWARDS ── */}
      <div className="slush-card p-6" style={{ background: "#ffffff" }}>
        <p className="font-display text-[0.72rem] mb-6 text-center" style={{ color: "#000000" }}>
          CHAIN HOP REWARDS
        </p>

        {/* キャラクター列 */}
        <div className="flex items-end justify-center gap-1 flex-wrap">
          {CHAIN.map((node, i) => (
            <div key={node.role + i} className="flex items-end gap-1">
              <div className="flex flex-col items-center gap-1">
                {/* 報酬バッジ */}
                <div
                  className="font-display text-[0.72rem] px-1.5 py-0.5 mb-1"
                  style={{
                    background: `${node.accent}22`,
                    border: `1px solid ${node.accent}`,
                    color: "#000000",
                    boxShadow: "none",
                    whiteSpace: "nowrap", borderRadius: "20px"}}
                >
                  {node.reward}
                </div>
                {/* キャラクター */}
                <PixelChar type={node.char} scale={4} />
                {/* ラベル */}
                <p className="font-display text-[0.72rem]" style={{ color: "#000000" }}>{node.role}</p>
                <p className="font-ja text-sm" style={{ color: "#4a4a4a" }}>{node.label}</p>
              </div>

              {/* 矢印 */}
              {i < CHAIN.length - 1 && <Arrow color="#1e3a5f" />}
            </div>
          ))}
          {/* 続く… */}
          <div className="flex items-center" style={{ paddingBottom: "2.5rem" }}>
            <span className="font-display text-[0.72rem]" style={{ color: "#4a4a4a" }}>▶▶</span>
          </div>
        </div>

        {/* 役割説明 */}
        <div className="mt-5 grid grid-cols-3 gap-2">
          {[
            { color: "#0052FF", label: "起点者",   desc: "チェーンが伸びるたびに+5 ON累積。最も多く稼げる。" },
            { color: "#ff4d6d", label: "中継者",   desc: "次の人へ渡したとき+2 ON獲得。" },
            { color: "#55db9c", label: "新受取人", desc: "恩送りを受け取ったとき+1 ON獲得。" },
          ].map((r) => (
            <div key={r.label} className="p-2" style={{ background: "#ffffff", border: `1px solid ${r.color}33` , borderRadius: "20px"}}>
              <p className="font-display text-[0.72rem] mb-1" style={{ color: "#000000" }}>{r.label}</p>
              <p className="font-ja text-sm leading-relaxed" style={{ color: "#4a4a4a" }}>{r.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── LOOP COMPLETE BONUS ── */}
      <div
        className="slush-card p-6"
        style={{ background: "#ffffff", borderColor: "#000000", boxShadow: "none", borderRadius: "20px"}}
      >
        <p className="font-display text-[0.72rem] mb-6 text-center" style={{ color: "#000000" }}>
          🎉 LOOP COMPLETE BONUS
        </p>

        {/* ループ図：上段(A→B→C→D) + 下段の帰還矢印 + 起点者Aに戻る */}
        <div className="relative">

          {/* 上段：前進チェーン */}
          <div className="flex items-end justify-between px-2">

            {/* 起点者A（出発） */}
            <div className="flex flex-col items-center gap-1">
              <div
                className="font-display text-[0.72rem] px-1.5 py-0.5"
                style={{ border: "1px solid #000000", color: "#000000", background: "#dceeff" , borderRadius: "20px"}}
              >出発</div>
              <PixelChar type="hero" scale={4} />
              <p className="font-display text-[0.72rem]" style={{ color: "#000000" }}>ORIGIN A</p>
            </div>

            {/* 中間ノード (B→C→D→...) */}
            <div className="flex-1 flex items-center justify-center gap-2 px-2">
              <span className="font-display text-[0.82rem]" style={{ color: "#4a4a4a" }}>▶▶</span>
              <div className="flex gap-3 items-end">
                {(["warrior","mage","villager"] as const).map((c, i) => (
                  <PixelChar key={i} type={c} scale={5} />
                ))}
              </div>
              <span className="font-display text-[0.82rem]" style={{ color: "#4a4a4a" }}>▶▶</span>
            </div>

            {/* 最後のノード（折返し） */}
            <div className="flex flex-col items-center gap-1">
              <div
                className="font-display text-[0.72rem] px-1.5 py-0.5"
                style={{ border: "1px solid #000000", color: "#4a4a4a", background: "#ffd73122" , borderRadius: "20px"}}
              >折返し</div>
              <PixelChar type="villager" scale={4} />
              <p className="font-display text-[0.72rem]" style={{ color: "#4a4a4a" }}>LAST</p>
            </div>
          </div>

          {/* ↓帰還ライン */}
          <div className="relative flex items-stretch mx-6 mt-1" style={{ height: 48 }}>
            {/* 左端の↓→（Aの下） */}
            <div
              className="w-1/2"
              style={{
                borderLeft: "1px solid #ffd731",
                borderBottom: "1px solid #ffd731"}}
            />
            {/* 右端の↓（Lastの下） */}
            <div
              className="w-1/2"
              style={{
                borderRight: "1px solid #ffd731",
                borderBottom: "1px solid #ffd731"}}
            />
            {/* 中央ラベル */}
            <div
              className="absolute inset-x-0 bottom-0 flex justify-center"
              style={{ transform: "translateY(50%)" }}
            >
              <span
                className="font-display text-[0.85rem] px-3 py-1"
                style={{ background: "#ffffff", color: "#000000", border: "1px solid #000000", whiteSpace: "nowrap" , borderRadius: "1600px"}}
              >
                🎉 LOOP COMPLETE!
              </span>
            </div>
          </div>

          {/* 起点者A（帰還・ボーナス受取） */}
          <div className="flex flex-col items-center gap-1 mt-8">
            {/* ▲ 矢印 */}
            <span className="font-display text-[0.9rem]" style={{ color: "#000000" }}>▲</span>

            {/* ボーナスバッジ */}
            <div
              className="font-display text-[0.85rem] px-3 py-1"
              style={{
                background: "#fff3cf",
                border: "1px solid #000000",
                boxShadow: "none",
                color: "#000000", borderRadius: "20px"}}
            >
              N × 20 ON GET!!
            </div>

            {/* キャラ（起点者・ボーナス受取） */}
            <PixelChar type="hero" scale={5} />
            <p className="font-display text-[0.72rem]" style={{ color: "#000000" }}>ORIGIN A</p>
            <p className="font-ja text-sm" style={{ color: "#4a4a4a" }}>起点者は最大4倍のボーナス！</p>
          </div>
        </div>

        {/* 参加者全員も受け取る */}
        <div
          className="mt-6 p-3 text-center"
          style={{ border: "1px solid #000000", background: "#0a0a0f" , borderRadius: "20px"}}
        >
          <p className="font-ja text-sm mb-1" style={{ color: "#4a4a4a" }}>
            中継者も <span className="font-display text-[0.7rem]" style={{ color: "#000000" }}>N × 5 ON</span> 獲得 ／ 起点者は <span className="font-display text-[0.7rem]" style={{ color: "#000000" }}>N × 20 ON</span>
          </p>
          <p className="font-ja text-sm mt-1" style={{ color: "#4a4a4a" }}>
            N = ループ参加人数 ／ ステージが上がるほど倍率UP
          </p>
        </div>

        {/* 早期中継者ボーナス */}
        <div
          className="mt-3 p-3"
          style={{ border: "1px solid #0052FF44", background: "#00091a" , borderRadius: "20px"}}
        >
          <p className="font-display text-[0.7rem] mb-2" style={{ color: "#4a4a4a" }}>
            ⚡ EARLY RELAY BONUS
          </p>
          <div className="grid grid-cols-4 gap-1">
            {[
              { pos: "1番目", mult: "×3.0", on: "N×15" },
              { pos: "2番目", mult: "×2.5", on: "N×12.5" },
              { pos: "3番目", mult: "×2.0", on: "N×10" },
              { pos: "4番目+", mult: "×1.0", on: "N×5" },
            ].map((r) => (
              <div key={r.pos} className="text-center p-1.5" style={{ background: "#ffffff", border: "1px solid #000000" , borderRadius: "20px"}}>
                <p className="font-ja text-sm mb-0.5" style={{ color: "#4a4a4a" }}>{r.pos}</p>
                <p className="font-display text-[0.7rem]" style={{ color: "#4a4a4a" }}>{r.mult}</p>
                <p className="font-display text-[0.7rem]" style={{ color: "#4a4a4a" }}>{r.on}</p>
              </div>
            ))}
          </div>
          <p className="font-ja text-sm mt-2" style={{ color: "#4a4a4a" }}>
            チェーンに早く参加するほど、ループ完成時のボーナスが大きくなります
          </p>
        </div>

        <p className="font-ja text-center text-sm mt-4" style={{ color: "#4a4a4a" }}>
          ステージが上がるほどループ倍率もUP（×1〜×20）— 詳細は下の WORLD STAGES へ
        </p>
      </div>
    </div>
  )
}
