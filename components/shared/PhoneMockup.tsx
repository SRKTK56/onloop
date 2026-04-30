import { getStage } from "@/lib/stages"

const DEMO_CHAIN_LENGTH = 3

export function PhoneMockup() {
  const stage = getStage(DEMO_CHAIN_LENGTH)

  const nodes = [
    { id: "A", label: "ねこやまA", act: "写真を撮ってあげた", on: 5, origin: true },
    { id: "B", label: "いぬかわB", act: "企画を一緒に考えた", on: 2, origin: false },
    { id: "C", label: "とりなかC", act: "料理を振る舞った", on: 1, origin: false },
  ]

  return (
    <div className="relative flex justify-center select-none">
      {/* 背景グロー */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{ filter: "blur(40px)", opacity: 0.3 }}
      >
        <div className="w-48 h-48 rounded-full" style={{ background: stage.accent }} />
      </div>

      {/* スマホ本体 ─ ピクセルボックス */}
      <div
        className="relative w-[256px]"
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
        <div
          className="px-3 py-3 flex flex-col gap-2 relative"
          style={{ minHeight: 440 }}
        >
          {/* ステージ背景画像 */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `url(${stage.image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              imageRendering: "pixelated",
            }}
          />
          <div className="absolute inset-0" style={{ background: "rgba(10,10,26,0.7)" }} />
          {/* コンテンツ（背景より前面） */}
          <div className="relative z-10 flex flex-col gap-2">

          {/* ゲームヘッダー */}
          <div
            className="flex items-center justify-between px-2 py-1"
            style={{ background: stage.bgDark, border: `2px solid ${stage.accent}` }}
          >
            <span className="font-pixel text-[0.45rem]" style={{ color: stage.accent }}>
              ONLOOP
            </span>
            <span className="font-pixel text-[0.4rem]" style={{ color: stage.accent }}>
              {stage.emoji} {stage.nameEn}
            </span>
          </div>

          {/* ステージプログレスバー */}
          <div className="flex items-center gap-1">
            <span className="font-pixel text-[0.35rem] text-gray-500">EXP</span>
            <div className="flex-1 h-2 border border-gray-700" style={{ background: "#111" }}>
              <div
                className="h-full"
                style={{ width: "75%", background: stage.accent }}
              />
            </div>
            <span className="font-pixel text-[0.35rem]" style={{ color: stage.accent }}>
              3/4
            </span>
          </div>

          {/* チェーンノード */}
          {nodes.map((node, i) => (
            <div key={node.id}>
              <div
                className="px-2 py-2 flex items-center gap-2"
                style={{
                  background: node.origin ? stage.bgDark : "#0f1628",
                  border: `2px solid ${node.origin ? stage.accent : "#1e3a5f"}`,
                  boxShadow: node.origin ? `3px 3px 0 ${stage.accent}` : "3px 3px 0 #1e3a5f",
                }}
              >
                {/* ドット絵アバター */}
                <div
                  className="w-8 h-8 shrink-0 flex items-center justify-center font-pixel text-xs"
                  style={{
                    background: node.origin ? stage.accent : "#1a2a4a",
                    border: "2px solid #000",
                    color: node.origin ? "#000" : stage.accent,
                  }}
                >
                  {node.id}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-ja text-[0.55rem] font-bold truncate" style={{ color: "#e0e0ff" }}>
                    {node.label}
                    {node.origin && (
                      <span className="font-pixel text-[0.35rem] ml-1 opacity-70" style={{ color: stage.accent }}>
                        ＊ORIGIN
                      </span>
                    )}
                  </p>
                  <p className="font-ja text-[0.5rem] truncate" style={{ color: "#6080a0" }}>
                    {node.act}
                  </p>
                </div>

                {/* ONバッジ */}
                <span
                  className="font-pixel text-[0.4rem] shrink-0"
                  style={{ color: stage.accent }}
                >
                  +{node.on}ON
                </span>
              </div>

              {/* 矢印 */}
              {i < nodes.length - 1 && (
                <div className="flex justify-center my-0.5">
                  <span className="font-pixel text-[0.5rem]" style={{ color: stage.accent }}>▼</span>
                </div>
              )}
            </div>
          ))}

          {/* 次の恩送り待ち */}
          <div
            className="px-2 py-2 text-center"
            style={{
              background: "#0f1628",
              border: "2px dashed #1e3a5f",
            }}
          >
            <p className="font-pixel text-[0.4rem] pixel-blink" style={{ color: "#4a6080" }}>
              ▸ NEXT PLAYER...
            </p>
          </div>

          {/* ループボーナス予告 */}
          <div
            className="px-2 py-1"
            style={{
              background: "rgba(255,200,0,0.05)",
              border: "2px solid #554400",
            }}
          >
            <p className="font-pixel text-[0.38rem] leading-relaxed" style={{ color: "#aa8800" }}>
              🎉 LOOP BONUS: N×10 ON FOR ORIGIN
            </p>
          </div>
          </div>{/* z-10コンテンツ終わり */}
        </div>

        {/* ホームバー */}
        <div className="flex justify-center py-2" style={{ background: "#000" }}>
          <div className="w-20 h-1" style={{ background: "#333" }} />
        </div>
      </div>

      {/* サイドボタン（装飾） */}
      <div
        className="absolute right-0 top-20 w-1 h-8"
        style={{ background: "#333" }}
      />
      <div
        className="absolute left-0 top-16 w-1 h-6"
        style={{ background: "#333" }}
      />
    </div>
  )
}
