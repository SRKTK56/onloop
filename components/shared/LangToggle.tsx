"use client"

import { useLang } from "@/lib/i18n/context"

export function LangToggle() {
  const { lang, setLang } = useLang()
  return (
    <div
      className="flex items-center font-display"
      // 選択中の塗りを角丸で切り取るため overflow: hidden が要る。
      // これが無いと子の矩形の背景がピルの円弧からはみ出す
      style={{
        fontSize: "0.7rem",
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
          className="px-2 py-1 transition-colors cursor-pointer"
          style={{
            color:      lang === l ? "#ffffff" : "#4a4a4a",
            background: lang === l ? "#0052FF" : "transparent"}}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  )
}
