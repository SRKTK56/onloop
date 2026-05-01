import { getStage } from "@/lib/stages"
import { PixelChar } from "./PixelChar"


const DEMO_CHAIN_LENGTH = 12

export function PhoneMockup() {
  const stage = getStage(DEMO_CHAIN_LENGTH)

  const nodes = [
    { char: "hero"     as const, label: "たかはしA", act: "写真を撮ってあげた",    on: 5, origin: true  },
    { char: "warrior"  as const, label: "やまださん", act: "企画を一緒に考えた",    on: 2, origin: false },
    { char: "mage"     as const, label: "すずきさん", act: "料理を振る舞った",      on: 2, origin: false },
    { char: "villager" as const, label: "たなかさん", act: "次の人に繋いでいる...", on: 1, origin: false },
  ]

  return (
    <div className="relative flex justify-center select-none">
      {/* 背景グロー */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{ filter: "blur(50px)", opacity: 0.3 }}
      >
        <div className="w-48 h-48 rounded-full" style={{ background: stage.accent }} />
      </div>

      {/* スマホ本体 ─ 本物のスマホ形状 */}
      <div
        className="relative w-[260px] overflow-hidden"
        style={{
          background: "#0a0a14",
          border: "6px solid #1a1a2a",
          borderRadius: "2.5rem",
          boxShadow: "0 8px 40px rgba(0,0,0,0.8), inset 0 0 0 1px rgba(255,255,255,0.06)",
        }}
      >
        {/* ダイナミックアイランド風ノッチ */}
        <div className="flex justify-center pt-3 pb-1" style={{ background: "#0a0a14" }}>
          <div
            className="w-20 h-5 flex items-center justify-center gap-1.5"
            style={{ background: "#000", borderRadius: "0.75rem" }}
          >
            <div className="w-2 h-2 rounded-full" style={{ background: "#222" }} />
            <div className="w-3 h-3 rounded-full" style={{ background: "#181818" }} />
          </div>
        </div>

        {/* 画面 ─ 背景画像そのまま表示（オーバーレイなし） */}
        <div
          className="relative"
          style={{
            minHeight: 490,
            backgroundImage: `url(${stage.image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* コンテンツ：各要素に個別の背景を設定して視認性を確保 */}
          <div className="px-3 py-3 flex flex-col gap-2">

            {/* ゲームヘッダー */}
            <div
              className="flex items-center justify-between px-3 py-1.5"
              style={{
                background: "rgba(0,0,0,0.75)",
                border: `2px solid ${stage.accent}`,
                backdropFilter: "blur(4px)",
              }}
            >
              <span className="font-pixel text-[0.82rem]" style={{ color: stage.accent }}>ONLOOP</span>
              <span className="font-pixel text-[0.9rem]" style={{ color: "#fff" }}>
                {stage.emoji} {stage.nameEn}
              </span>
            </div>

            {/* EXPバー */}
            <div
              className="flex items-center gap-1.5 px-2 py-1"
              style={{ background: "rgba(0,0,0,0.6)" }}
            >
              <span className="font-pixel text-[0.85rem]" style={{ color: "#90a0b0" }}>EXP</span>
              <div className="flex-1 h-2.5 border border-gray-600" style={{ background: "#111" }}>
                <div
                  className="h-full"
                  style={{
                    width: `${Math.round(((DEMO_CHAIN_LENGTH - stage.min) / (stage.max - stage.min)) * 100)}%`,
                    background: stage.accent,
                  }}
                />
              </div>
              <span className="font-pixel text-[0.85rem]" style={{ color: stage.accent }}>
                {DEMO_CHAIN_LENGTH}/{stage.max}
              </span>
            </div>

            {/* チェーンノード */}
            {nodes.map((node, i) => (
              <div key={node.label}>
                <div
                  className="px-2 py-2 flex items-center gap-2"
                  style={{
                    background: node.origin ? `rgba(0,0,0,0.82)` : "rgba(0,0,0,0.7)",
                    border: `2px solid ${node.origin ? stage.accent : "rgba(255,255,255,0.15)"}`,
                    boxShadow: node.origin ? `3px 3px 0 ${stage.accent}` : "none",
                  }}
                >
                  <div
                    className="shrink-0 flex items-center justify-center"
                    style={{
                      width: 36, height: 36,
                      background: node.origin ? `${stage.accent}44` : "rgba(0,0,0,0.5)",
                      border: `2px solid ${node.origin ? stage.accent : "rgba(255,255,255,0.2)"}`,
                    }}
                  >
                    <PixelChar type={node.char} scale={3} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-ja text-xs font-bold truncate" style={{ color: "#ffffff" }}>
                      {node.label}
                      {node.origin && (
                        <span className="font-pixel text-[0.82rem] ml-1" style={{ color: stage.accent }}>
                          ★
                        </span>
                      )}
                    </p>
                    <p className="font-ja text-[0.85rem] truncate" style={{ color: "#b0c4d8" }}>
                      {node.act}
                    </p>
                  </div>

                  <span className="font-pixel text-[0.72rem] shrink-0" style={{ color: stage.accent }}>
                    +{node.on}ON
                  </span>
                </div>

                {i < nodes.length - 1 && (
                  <div className="flex justify-center my-0.5">
                    <span className="font-pixel text-[0.9rem]" style={{ color: stage.accent }}>▼</span>
                  </div>
                )}
              </div>
            ))}

            {/* 次の人待ち */}
            <div
              className="px-2 py-2 text-center"
              style={{ background: "rgba(0,0,0,0.65)", border: "2px dashed rgba(255,255,255,0.15)" }}
            >
              <p className="font-pixel text-[0.72rem] pixel-blink" style={{ color: "#7090b0" }}>
                ▸ NEXT PLAYER...
              </p>
            </div>

            {/* ステージボーナス */}
            <div
              className="px-2 py-2"
              style={{ background: "rgba(0,0,0,0.75)", border: `2px solid ${stage.accent}88` }}
            >
              <p className="font-pixel text-[0.72rem]" style={{ color: stage.accent }}>
                {stage.emoji} {stage.nameEn} LOOP ×{stage.loopMultiplier}
              </p>
              <p className="font-ja text-[0.85rem] mt-0.5" style={{ color: "#c0d0e0" }}>
                🎉 起点者に N×{10 * stage.loopMultiplier} ON
              </p>
            </div>
          </div>
        </div>

        {/* ホームバー */}
        <div className="flex justify-center py-3" style={{ background: "#0a0a14" }}>
          <div className="w-24 h-1.5" style={{ background: "#333", borderRadius: "1rem" }} />
        </div>
      </div>
    </div>
  )
}
