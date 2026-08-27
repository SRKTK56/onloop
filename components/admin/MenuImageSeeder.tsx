"use client"

import { useState, useEffect } from "react"

type Target = { id: number; name: string | null; serviceTitle: string }
type Result  = { id: number; status: "success" | "error"; url?: string; error?: string }

export function MenuImageSeeder() {
  const [targets,  setTargets]  = useState<Target[]>([])
  const [results,  setResults]  = useState<Result[]>([])
  const [running,  setRunning]  = useState(false)
  const [loaded,   setLoaded]   = useState(false)

  useEffect(() => {
    fetch("/api/admin/seed-images")
      .then(r => r.json())
      .then(d => { setTargets(d.targets ?? []); setLoaded(true) })
      .catch(() => setLoaded(true))
  }, [])

  async function handleRun() {
    if (running || targets.length === 0) return
    setRunning(true)
    setResults([])

    for (const t of targets) {
      const res = await fetch("/api/admin/seed-images", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ providerId: t.id }),
      })
      const data = await res.json()
      setResults(prev => [
        ...prev,
        res.ok
          ? { id: t.id, status: "success", url: data.imageUrl }
          : { id: t.id, status: "error",   error: data.error  },
      ])
    }
    setRunning(false)
    // 完了後にリストを再取得
    fetch("/api/admin/seed-images")
      .then(r => r.json())
      .then(d => setTargets(d.targets ?? []))
  }

  if (!loaded) {
    return <p className="font-ja text-sm" style={{ color: "#506070" }}>読み込み中...</p>
  }

  const done = results.filter(r => r.status === "success").length
  const errCount = results.filter(r => r.status === "error").length

  return (
    <div className="space-y-4">

      {/* ステータス */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <p className="font-pixel text-[0.72rem] mb-1" style={{ color: "#506070" }}>
            IMAGE NOT SET
          </p>
          <p className="font-ja text-base font-bold" style={{ color: "#e0e8ff" }}>
            {targets.length === 0 && results.length === 0
              ? "全メニューに画像が設定済みです ✓"
              : `画像未設定 ${targets.length} 件`}
          </p>
        </div>
        {targets.length > 0 && (
          <button
            onClick={handleRun}
            disabled={running}
            className="pixel-btn font-pixel"
            style={{
              background:  running ? "#0a1a2a" : "#060f2a",
              color:       running ? "#2a4a6a" : "#7ab0ff",
              borderColor: running ? "#1a2a3a" : "#0052FF",
              boxShadow:   running ? "none" : "3px 3px 0 #0052FF",
              padding:     "0.6rem 1.2rem",
              fontSize:    "0.72rem",
              cursor:      running ? "not-allowed" : "pointer",
            }}
          >
            {running ? `✦ 生成中... (${done}/${targets.length})` : "✦ 全件の画像を一括生成"}
          </button>
        )}
      </div>

      {/* 未設定一覧 */}
      {targets.length > 0 && results.length === 0 && (
        <div className="space-y-1">
          {targets.map(t => (
            <div key={t.id} className="flex items-center gap-2 px-3 py-2"
              style={{ background: "#060610", border: "1px solid #1a2a3a" }}>
              <span className="font-mono text-xs" style={{ color: "#3a5a7a" }}>#{t.id}</span>
              <span className="font-ja text-sm" style={{ color: "#90a0b8" }}>
                {t.name ?? "名前未設定"} — {t.serviceTitle}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* 実行結果 */}
      {results.length > 0 && (
        <div className="space-y-1">
          {results.map(r => {
            const t = targets.find(x => x.id === r.id)
            return (
              <div key={r.id} className="flex items-start gap-2 px-3 py-2"
                style={{ background: "#060610", border: `1px solid ${r.status === "success" ? "#1a3a1a" : "#3a1a1a"}` }}>
                <span style={{ color: r.status === "success" ? "#52b788" : "#e63946" }}>
                  {r.status === "success" ? "✓" : "✗"}
                </span>
                <div className="min-w-0">
                  <p className="font-ja text-sm" style={{ color: "#90a0b8" }}>
                    #{r.id} {t?.name} — {t?.serviceTitle}
                  </p>
                  {r.status === "error" && (
                    <p className="font-ja text-xs mt-0.5" style={{ color: "#e63946" }}>{r.error}</p>
                  )}
                </div>
              </div>
            )
          })}
          {!running && (
            <p className="font-pixel text-[0.65rem] pt-1"
              style={{ color: errCount > 0 ? "#aa8800" : "#52b788" }}>
              完了 — 成功: {done} / エラー: {errCount}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
