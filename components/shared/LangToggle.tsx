"use client"

import { useLang } from "@/lib/i18n/context"

export function LangToggle() {
  const { lang, setLang } = useLang()
  return (
    <div
      className="flex items-center font-pixel"
      style={{ fontSize: "0.62rem", border: "2px solid #1a2a3a", background: "#060610" }}
    >
      {(["ja", "en"] as const).map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          className="px-2 py-1 transition-colors cursor-pointer"
          style={{
            color:      lang === l ? "#ffffff" : "#3a5a7a",
            background: lang === l ? "#0052FF" : "transparent",
          }}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  )
}
