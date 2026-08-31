"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { STAGES } from "@/lib/stages"
import type { LoopItem, Party } from "@/lib/loops"

function stageOf(id: string) {
  return STAGES.find((s) => s.id === id) ?? STAGES[0]
}

/** 相対時刻。タイムゾーンに依存させないため差分で表現する */
function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return "たった今"
  if (m < 60) return `${m}分前`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}時間前`
  const d = Math.floor(h / 24)
  if (d < 30) return `${d}日前`
  return `${Math.floor(d / 30)}ヶ月前`
}

/** 進行中の連鎖: 点と線で「どこまで伸びたか」を見せる */
function ChainStrip({ parties, accent }: { parties: Party[]; accent: string }) {
  const shown = parties.slice(0, 10)
  const rest = parties.length - shown.length
  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      {shown.map((p, i) => (
        <div key={`${p.wallet}-${i}`} className="flex items-center gap-1.5">
          <span
            className="sticker-round shrink-0"
            style={{ width: 16, height: 16, background: i === 0 ? "#000000" : accent }}
            title={p.name}
          />
          {i < shown.length - 1 && (
            <span aria-hidden style={{ width: 14, height: 1, background: "#000000", display: "block" }} />
          )}
        </div>
      ))}
      {rest > 0 && <span className="font-ui" style={{ fontSize: "0.6875rem" }}>+{rest}</span>}
      <span aria-hidden className="font-ui ml-1" style={{ fontSize: "0.75rem" }}>▸</span>
    </div>
  )
}

/** 完成したループ: 実際に輪として描く。この形が見えることがこのプロダクトの報酬 */
function LoopRing({ parties, accent }: { parties: Party[]; accent: string }) {
  const n = Math.min(parties.length, 16)
  const r = 34
  const c = 44
  return (
    <svg viewBox="0 0 88 88" style={{ width: 88, height: 88, overflow: "visible" }} aria-hidden>
      <circle cx={c} cy={c} r={r} fill="none" stroke="#000000" strokeWidth="1" />
      <circle cx={c} cy={c} r={r} fill="none" stroke={accent} strokeWidth="6" opacity="0.85" />
      {Array.from({ length: n }).map((_, i) => {
        const a = (i / n) * Math.PI * 2 - Math.PI / 2
        return (
          <circle
            key={i}
            cx={c + r * Math.cos(a)}
            cy={c + r * Math.sin(a)}
            r={i === 0 ? 6 : 4.5}
            fill={i === 0 ? "#000000" : "#ffffff"}
            stroke="#000000"
            strokeWidth="1"
          />
        )
      })}
    </svg>
  )
}

function LoopCard({ item }: { item: LoopItem }) {
  const stage = stageOf(item.stageId)
  return (
    <Link
      href={`/chain/${item.chainId}`}
      className="slush-card block p-5 transition-transform hover:-translate-y-0.5"
      style={{ background: item.isLoop ? stage.bgDark : "#ffffff" }}
    >
      <div className="flex items-start justify-between gap-4 mb-4 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="slush-badge" style={{ background: stage.accent }}>
            {stage.emoji} STAGE {stage.level}
          </span>
          <span className="slush-badge font-ja" style={{ fontSize: "0.875rem", fontWeight: 700 }}>
            {item.length} 連鎖
          </span>
          {item.isLoop && (
            <span
              className="slush-badge"
              style={{ background: "#000000", color: "#ffffff" }}
            >
              ✓ LOOP COMPLETE ×{stage.loopMultiplier}
            </span>
          )}
        </div>
        <span className="font-ja text-sm shrink-0" style={{ opacity: 0.6 }}>
          {timeAgo(item.lastAt)}
        </span>
      </div>

      <div className="flex items-center gap-5 mb-4">
        {item.isLoop ? (
          <LoopRing parties={item.participants} accent={stage.accent} />
        ) : (
          <ChainStrip parties={item.participants} accent={stage.accent} />
        )}
      </div>

      <div className="flex flex-col gap-2">
        {item.hops.map((h) => (
          <div key={h.position} className="flex flex-col gap-0.5">
            <p className="font-ja text-sm" style={{ opacity: 0.7 }}>
              {h.giver.name} <span aria-hidden>→</span> {h.receiver.name}
            </p>
            <p className="h-ja text-base">「{h.description}」</p>
          </div>
        ))}
        {item.hops.length === 0 && (
          <p className="font-ja text-sm" style={{ opacity: 0.6 }}>まだ恩が動いていません</p>
        )}
      </div>

      {item.pendingCount > 0 && (
        <p className="font-ja text-sm mt-3" style={{ opacity: 0.6 }}>
          確認待ち {item.pendingCount} 件
        </p>
      )}
    </Link>
  )
}

export function LoopFeed({ limit = 20, columns = 2 }: { limit?: number; columns?: 1 | 2 }) {
  const [items, setItems] = useState<LoopItem[] | null>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    fetch(`/api/loops?limit=${limit}`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => setItems(d.items ?? []))
      .catch(() => setError(true))
  }, [limit])

  if (error) {
    return <p className="font-ja text-sm text-center py-10">フィードを読み込めませんでした。</p>
  }
  if (items === null) {
    return (
      <div className={`grid gap-5 ${columns === 2 ? "md:grid-cols-2" : ""}`}>
        {Array.from({ length: columns }).map((_, i) => (
          <div key={i} className="slush-card p-5" style={{ height: 200, opacity: 0.35 }} />
        ))}
      </div>
    )
  }
  if (items.length === 0) {
    return (
      <div className="slush-card-lg p-10 text-center">
        <p className="display-md mb-4">NO LOOPS YET</p>
        <p className="font-ja text-sm mb-6">まだ恩の連鎖が始まっていません。</p>
        <Link href="/menu" className="slush-btn font-ja" style={{ fontWeight: 700 }}>
          ▸ 恩送りメニューを見る
        </Link>
      </div>
    )
  }

  return (
    <div className={`grid gap-5 ${columns === 2 ? "md:grid-cols-2" : ""}`}>
      {items.map((item) => (
        <LoopCard key={item.chainId} item={item} />
      ))}
    </div>
  )
}
