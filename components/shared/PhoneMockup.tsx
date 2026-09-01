import { getStage } from "@/lib/stages"
import { PixelChar } from "./PixelChar"

const DEMO_CHAIN_LENGTH = 12

const FRAME_W = 252   // 端末の外形幅
const BEZEL = 9       // ベゼルの太さ
const SCREEN_W = FRAME_W - BEZEL * 2
const SCREEN_H = 452  // 実機に近い縦横比（約1.9:1）

const INK = "#000000"

/** ステータスバーのアイコン群。ここが有るかどうかで実機らしさが大きく変わる */
function StatusIcons() {
  return (
    <span className="flex items-center gap-[5px]">
      {/* 電波 */}
      <svg width="15" height="10" viewBox="0 0 15 10" aria-hidden>
        {[0, 1, 2, 3].map((i) => (
          <rect key={i} x={i * 3.9} y={7.4 - i * 2.2} width="2.6" height={2.6 + i * 2.2} rx="0.9" fill={INK} />
        ))}
      </svg>
      {/* Wi-Fi */}
      <svg width="13" height="10" viewBox="0 0 13 10" aria-hidden>
        <path d="M0.9 3.2a8.2 8.2 0 0 1 11.2 0" stroke={INK} strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <path d="M3.1 5.6a5 5 0 0 1 6.8 0" stroke={INK} strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <circle cx="6.5" cy="8.2" r="1.2" fill={INK} />
      </svg>
      {/* バッテリー */}
      <svg width="22" height="11" viewBox="0 0 22 11" aria-hidden>
        <rect x="0.55" y="0.55" width="18.4" height="9.9" rx="2.9" stroke={INK} strokeWidth="1.1" fill="none" />
        <rect x="2.1" y="2.1" width="12.2" height="6.8" rx="1.6" fill={INK} />
        <path d="M20.6 3.8v3.4a1.8 1.8 0 0 0 0-3.4z" fill={INK} />
      </svg>
    </span>
  )
}

export function PhoneMockup() {
  const stage = getStage(DEMO_CHAIN_LENGTH)

  const nodes = [
    { char: "hero"     as const, label: "えぐちさん",   act: "写真を撮ってあげた", on: 5, origin: true  },
    { char: "warrior"  as const, label: "やまやさん",   act: "企画を手伝った",     on: 2, origin: false },
    { char: "mage"     as const, label: "まつしたさん", act: "料理を振る舞った",   on: 2, origin: false },
  ]

  return (
    <div className="relative select-none" style={{ width: FRAME_W }}>
      {/* 側面ボタン。フレームの外へわずかに覗かせると実機らしくなる */}
      <span aria-hidden style={{ position: "absolute", left: -3, top: 96,  width: 3, height: 26, background: INK, borderRadius: 2 }} />
      <span aria-hidden style={{ position: "absolute", left: -3, top: 134, width: 3, height: 44, background: INK, borderRadius: 2 }} />
      <span aria-hidden style={{ position: "absolute", left: -3, top: 188, width: 3, height: 44, background: INK, borderRadius: 2 }} />
      <span aria-hidden style={{ position: "absolute", right: -3, top: 150, width: 3, height: 62, background: INK, borderRadius: 2 }} />

      {/* 端末フレーム（ベゼル） */}
      <div
        style={{
          width: FRAME_W,
          background: INK,
          borderRadius: 46,
          padding: BEZEL,
          border: `1px solid ${INK}`,
        }}
      >
        {/* 画面 */}
        <div
          className="relative overflow-hidden"
          style={{
            width: SCREEN_W,
            height: SCREEN_H,
            borderRadius: 38,
            backgroundImage: `url(${stage.image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            imageRendering: "pixelated",
          }}
        >
          {/* ステータスバー */}
          <div
            className="flex items-center justify-between px-4 pt-2.5"
            style={{ height: 30 }}
          >
            <span className="font-ui" style={{ fontSize: "0.75rem", fontVariantNumeric: "tabular-nums" }}>
              9:41
            </span>
            <StatusIcons />
          </div>

          {/* ダイナミックアイランド（画面の上に載る） */}
          <span
            aria-hidden
            style={{
              position: "absolute", left: "50%", transform: "translateX(-50%)", top: 7,
              width: 64, height: 22, background: INK, borderRadius: 1600,
            }}
          />

          {/* アプリ本体 */}
          <div className="px-3 pt-2 flex flex-col gap-2">
            <span className="font-display" style={{ fontSize: "0.85rem" }}>ONLOOP</span>

            <div
              className="flex items-center justify-center px-3 py-1.5"
              style={{ background: "#ffffff", border: `1px solid ${INK}`, borderRadius: 20 }}
            >
              <span className="font-display" style={{ fontSize: "0.7rem" }}>
                STAGE{stage.level} {stage.emoji}{stage.nameEn}
              </span>
            </div>

            {nodes.map((node, i) => (
              <div key={node.label}>
                <div
                  className="px-2 py-2 flex items-center gap-2"
                  style={{ background: "#ffffff", border: `1px solid ${INK}`, borderRadius: 20 }}
                >
                  <div
                    className="shrink-0 flex items-center justify-center"
                    style={{
                      width: 36, height: 36,
                      background: node.origin ? stage.accent : "#e9e9e9",
                      border: `1px solid ${INK}`, borderRadius: 20,
                    }}
                  >
                    <PixelChar type={node.char} scale={3} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-ja text-sm font-bold truncate">
                      {node.label}
                      {node.origin && <span className="font-display ml-1" style={{ fontSize: "0.82rem" }}>★</span>}
                    </p>
                    <p className="font-ja truncate" style={{ fontSize: "0.85rem", color: "#4a4a4a" }}>
                      {node.act}
                    </p>
                  </div>
                  <span className="font-display shrink-0" style={{ fontSize: "0.72rem" }}>
                    +{node.on}ON
                  </span>
                </div>
                {i < nodes.length - 1 && (
                  <div className="flex justify-center my-0.5">
                    <span className="font-display" style={{ fontSize: "0.9rem" }}>▼</span>
                  </div>
                )}
              </div>
            ))}

            <div
              className="px-2 py-1.5"
              style={{ background: "#ffffff", border: `1px solid ${INK}`, borderRadius: 20 }}
            >
              <p className="font-display" style={{ fontSize: "0.7rem", whiteSpace: "nowrap" }}>
                {stage.emoji}{stage.nameEn} LOOPボーナス ×{stage.loopMultiplier}
              </p>
            </div>
          </div>

          {/* タブバー。文字が小さくなりすぎないようアイコンのみにしてある */}
          <div
            className="absolute left-0 right-0 flex items-center justify-around"
            style={{
              bottom: 0, height: 54, paddingBottom: 14,
              background: "#ffffff", borderTop: `1px solid ${INK}`,
            }}
          >
            {/* ループ（選択中） */}
            <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden>
              <circle cx="11" cy="11" r="7.5" stroke={INK} strokeWidth="2.4" fill="none" />
            </svg>
            {/* メニュー */}
            <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden opacity="0.32">
              {[0, 1, 2].map((i) => (
                <rect key={i} x="4" y={5 + i * 5} width="14" height="2.4" rx="1.2" fill={INK} />
              ))}
            </svg>
            {/* マイページ */}
            <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden opacity="0.32">
              <circle cx="11" cy="8" r="3.6" fill={INK} />
              <path d="M3.8 18.5a7.2 7.2 0 0 1 14.4 0z" fill={INK} />
            </svg>
          </div>

          {/* ホームインジケータ（画面内の最下部） */}
          <span
            aria-hidden
            style={{
              position: "absolute", left: "50%", transform: "translateX(-50%)", bottom: 8,
              width: 108, height: 5, background: INK, borderRadius: 1600, opacity: 0.85,
            }}
          />
        </div>
      </div>
    </div>
  )
}
