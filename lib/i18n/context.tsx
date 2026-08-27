"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import t, { type Lang } from "./translations"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type CtxType = { lang: Lang; setLang: (l: Lang) => void; T: any }
const Ctx = createContext<CtxType | null>(null)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("ja")

  useEffect(() => {
    const saved = localStorage.getItem("onloop_lang") as Lang | null
    if (saved === "en" || saved === "ja") setLangState(saved)
  }, [])

  function setLang(l: Lang) {
    setLangState(l)
    localStorage.setItem("onloop_lang", l)
  }

  return (
    <Ctx.Provider value={{ lang, setLang, T: t[lang] }}>
      {children}
    </Ctx.Provider>
  )
}

export function useLang() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error("useLang must be used inside LanguageProvider")
  return ctx
}
