"use client"

import { useLang } from "@/lib/i18n/context"

export function LangToggle() {
  const { lang, setLang } = useLang()
  return (
    <div
      className="flex items-center font-display shrink-0"
      // 選択中の塗りを角丸で切り取るため overflow: hidden が要る。
      // これが無いと子の矩形の背景がピルの円弧からはみ出す
      style={{
        fontSize: "0.75rem",
        border: "1px solid #000000",
        background: "#dceeff",
        borderRadius: "1600px",
        overflow: "hidden",
      }}
    >
      {(["ja", "en"] as const).map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          className="px-2 py-1 transition-colors cursor-pointer whitespace-nowrap"
          // 選択中は黒塗り。青は装飾専用で、選択状態＝操作の結果なので CTA と同じ扱いにする（STYLE.md ルール3）
          style={{
            color:      lang === l ? "#ffffff" : "#000000",
            background: lang === l ? "#000000" : "transparent"}}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  )
}
