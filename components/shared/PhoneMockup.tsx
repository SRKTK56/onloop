import { getStage } from "@/lib/stages"
import { PixelChar } from "./PixelChar"

const DEMO_CHAIN_LENGTH = 12  // Japanステージ (10-19)

export function PhoneMockup() {
  const stage = getStage(DEMO_CHAIN_LENGTH)

  const nodes = [
    { char: "hero"     as const, label: "たかはしA", act: "写真を撮ってあげた",      on: 5, origin: true  },
    { char: "warrior"  as const, label: "やまださん", act: "企画を一緒に考えた",      on: 2, origin: false },
    { char: "mage"     as const, label: "すずきさん", act: "料理を振る舞った",        on: 2, origin: false },
    { char: "villager" as const, label: "たなかさん", act: "次の人に繋いでいる...",   on: 1, origin: false },
  ]

  return (
    <div className="relative flex justify-center select-none">
      {/* 背景グロー（ステージカラー） */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{ filter: "blur(40px)", opacity: 0.25 }}
      >
        <div className="w-48 h-48 rounded-full" style={{ background: stage.accent }} />
      </div>

      {/* スマホ本体 */}
      <div
        className="relative w-[260px]"
        style={{
          background: "#111",
          border: "4px solid #000",
          boxShadow: "6px 6px 0 #000",
          imageRendering: "pixelated",
        }}
      >
        {/* ノッチ */}
        <div className="flex justify-center py-2" style={{ background: "#000" }}>
          <div className="w-16 h-2" style={{ background: "#222" }} />
        </div>

        {/* 画面 */}
        <div className="relative" style={{ minHeight: 500 }}>
          {/* ステージ背景画像 */}
          <div
            className="absolute inset-0 opacity-25"
            style={{
              backgroundImage: `url(${stage.image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              imageRendering: "pixelated",
            }}
          />
          <div className="absolute inset-0" style={{ background: "rgba(8,5,20,0.72)" }} />

          {/* コンテンツ */}
          <div className="relative z-10 px-3 py-3 flex flex-col gap-2">

            {/* ゲームヘッダー */}
            <div
              className="flex items-center justify-between px-2 py-1"
              style={{ background: stage.bgDark, border: `2px solid ${stage.accent}` }}
            >
              <span className="font-pixel text-[0.45rem]" style={{ color: stage.accent }}>ONLOOP</span>
              <span className="font-pixel text-[0.4rem]" style={{ color: stage.accent }}>
                {stage.emoji} {stage.nameEn}
              </span>
            </div>

            {/* EXPバー */}
            <div className="flex items-center gap-1">
              <span className="font-pixel text-[0.32rem]" style={{ color: "#405060" }}>EXP</span>
              <div className="flex-1 h-2 border border-gray-800" style={{ background: "#111" }}>
                <div
                  className="h-full"
                  style={{
                    width: `${Math.round(((DEMO_CHAIN_LENGTH - stage.min) / (stage.max - stage.min)) * 100)}%`,
                    background: stage.accent,
                  }}
                />
              </div>
              <span className="font-pixel text-[0.32rem]" style={{ color: stage.accent }}>
                {DEMO_CHAIN_LENGTH}/{stage.max}
              </span>
            </div>

            {/* チェーンノード */}
            {nodes.map((node, i) => (
              <div key={node.label}>
                <div
                  className="px-2 py-2 flex items-center gap-2"
                  style={{
                    background: node.origin ? `${stage.bgDark}dd` : "#0a0f20cc",
                    border: `2px solid ${node.origin ? stage.accent : "#1e3a5f"}`,
                    boxShadow: node.origin ? `3px 3px 0 ${stage.accent}` : "3px 3px 0 #1e3a5f",
                  }}
                >
                  {/* ピクセルキャラアイコン */}
                  <div
                    className="shrink-0 flex items-center justify-center"
                    style={{
                      width: 36,
                      height: 36,
                      background: node.origin ? `${stage.accent}33` : "#0a1628",
                      border: `2px solid ${node.origin ? stage.accent : "#1e3a5f"}`,
                    }}
                  >
                    <PixelChar type={node.char} scale={3} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-ja text-[0.58rem] font-bold truncate" style={{ color: "#dde8ff" }}>
                      {node.label}
                      {node.origin && (
                        <span className="font-pixel text-[0.32rem] ml-1 opacity-70" style={{ color: stage.accent }}>
                          ★ORIGIN
                        </span>
                      )}
                    </p>
                    <p className="font-ja text-[0.5rem] truncate" style={{ color: "#4a6a8a" }}>
                      {node.act}
                    </p>
                  </div>

                  <span className="font-pixel text-[0.38rem] shrink-0" style={{ color: stage.accent }}>
                    +{node.on}ON
                  </span>
                </div>

                {i < nodes.length - 1 && (
                  <div className="flex justify-center my-0.5">
                    <span className="font-pixel text-[0.45rem]" style={{ color: stage.accent }}>▼</span>
                  </div>
                )}
              </div>
            ))}

            {/* 次の人待ち */}
            <div
              className="px-2 py-2 text-center"
              style={{ background: "#0a0f20", border: "2px dashed #1e3a5f" }}
            >
              <p className="font-pixel text-[0.38rem] pixel-blink" style={{ color: "#304050" }}>
                ▸ NEXT PLAYER...
              </p>
            </div>

            {/* ステージボーナス表示 */}
            <div
              className="px-2 py-1.5"
              style={{ background: "rgba(230,57,70,0.08)", border: `2px solid ${stage.accent}44` }}
            >
              <p className="font-pixel text-[0.36rem] leading-relaxed" style={{ color: stage.accent }}>
                {stage.emoji} {stage.nameEn} LOOP ×{stage.loopMultiplier} BONUS
              </p>
              <p className="font-pixel text-[0.32rem]" style={{ color: "#404050" }}>
                🎉 N×{10 * stage.loopMultiplier} ON FOR ORIGIN ON LOOP
              </p>
            </div>
          </div>
        </div>

        {/* ホームバー */}
        <div className="flex justify-center py-2" style={{ background: "#000" }}>
          <div className="w-20 h-1" style={{ background: "#333" }} />
        </div>
      </div>
    </div>
  )
}
