import { getStage } from "@/lib/stages"
import { PixelChar } from "./PixelChar"


const DEMO_CHAIN_LENGTH = 12

export function PhoneMockup() {
  const stage = getStage(DEMO_CHAIN_LENGTH)

  // 表示ノードを3件に絞って縦を圧縮
  const nodes = [
    { char: "hero"     as const, label: "えぐちさん",   act: "写真を撮ってあげた",    on: 5, origin: true  },
    { char: "warrior"  as const, label: "やまやさん",   act: "企画を手伝った",        on: 2, origin: false },
    { char: "mage"     as const, label: "まつしたさん", act: "料理を振る舞った",      on: 2, origin: false },
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
          background: "#ffffff",
          border: "1px solid #000000",
          borderRadius: "2.5rem",
          boxShadow: "none"}}
      >
        {/* ダイナミックアイランド風ノッチ */}
        <div className="flex justify-center pt-3 pb-1" style={{ background: "#ffffff" }}>
          <div
            className="w-20 h-5 flex items-center justify-center gap-1.5"
            style={{ background: "#000000", borderRadius: "1600px" }}
          >
            <div className="w-2 h-2 rounded-full" style={{ background: "#333333" }} />
            <div className="w-3 h-3 rounded-full" style={{ background: "#333333" }} />
          </div>
        </div>

        {/* 画面 ─ 背景画像そのまま表示（オーバーレイなし） */}
        <div
          className="relative"
          style={{
            minHeight: 340,
            backgroundImage: `url(${stage.image})`,
            backgroundSize: "cover",
            backgroundPosition: "center"}}
        >
          {/* コンテンツ：各要素に個別の背景を設定して視認性を確保 */}
          <div className="px-3 py-3 flex flex-col gap-2">

            {/* ロゴ - 左上 */}
            <div>
              <span className="font-display text-[0.82rem]" style={{ color: "#000000", textShadow: "none"}}>
                <span style={{ color: "#000000", textShadow: "none"}}>ON</span>LOOP
              </span>
            </div>

            {/* ゲームヘッダー（ステージ情報のみ） */}
            <div
              className="flex items-center justify-center px-3 py-1.5"
              style={{
                background: "#ffffff",
                border: "1px solid #000000",
                backdropFilter: "blur(4px)", borderRadius: "20px"}}
            >
              <span className="font-display text-[0.7rem]" style={{ color: "#000000" }}>
                STAGE{stage.level} {stage.emoji}{stage.nameEn}
              </span>
            </div>

            {/* チェーンノード */}
            {nodes.map((node, i) => (
              <div key={node.label}>
                <div
                  className="px-2 py-2 flex items-center gap-2"
                  style={{
                    background: "#ffffff",
                    border: "1px solid #000000",
                    boxShadow: "none", borderRadius: "20px"}}
                >
                  <div
                    className="shrink-0 flex items-center justify-center"
                    style={{
                      width: 36, height: 36,
                      background: node.origin ? stage.accent : "#e9e9e9",
                      border: "1px solid #000000", borderRadius: "20px"}}
                  >
                    <PixelChar type={node.char} scale={3} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-ja text-sm font-bold truncate" style={{ color: "#000000" }}>
                      {node.label}
                      {node.origin && (
                        <span className="font-display text-[0.82rem] ml-1" style={{ color: "#000000" }}>
                          ★
                        </span>
                      )}
                    </p>
                    <p className="font-ja text-[0.85rem] truncate" style={{ color: "#4a4a4a" }}>
                      {node.act}
                    </p>
                  </div>

                  <span className="font-display text-[0.72rem] shrink-0" style={{ color: "#000000" }}>
                    +{node.on}ON
                  </span>
                </div>

                {i < nodes.length - 1 && (
                  <div className="flex justify-center my-0.5">
                    <span className="font-display text-[0.9rem]" style={{ color: "#000000" }}>▼</span>
                  </div>
                )}
              </div>
            ))}

            {/* ループボーナス（コンパクト） */}
            <div
              className="px-2 py-1.5"
              style={{ background: "#ffffff", border: "1px solid #000000" , borderRadius: "20px"}}
            >
              <p className="font-display" style={{ color: "#000000", fontSize: "0.7rem", whiteSpace: "nowrap" }}>
                {stage.emoji}{stage.nameEn} LOOPボーナス ×{stage.loopMultiplier}
              </p>
            </div>
          </div>
        </div>

        {/* ホームバー */}
        <div className="flex justify-center py-3" style={{ background: "#ffffff" }}>
          <div className="w-24 h-1.5" style={{ background: "#000000", borderRadius: "1600px" }} />
        </div>
      </div>
    </div>
  )
}
