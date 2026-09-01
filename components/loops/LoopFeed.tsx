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

/** 進行中の連鎖: 点と線で「どこまで伸びたか」を見せる。カードの主役なので大きく描く */
function ChainStrip({ parties, accent }: { parties: Party[]; accent: string }) {
  const shown = parties.slice(0, 8)
  const rest = parties.length - shown.length
  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      {shown.map((p, i) => (
        <div key={`${p.wallet}-${i}`} className="flex items-center gap-1.5">
          <span
            className="sticker-round shrink-0"
            style={{ width: 22, height: 22, background: i === 0 ? "#000000" : accent }}
            title={p.name}
          />
          {i < shown.length - 1 && (
            <span aria-hidden style={{ width: 16, height: 2, background: "#000000", display: "block" }} />
          )}
        </div>
      ))}
      {rest > 0 && <span className="font-ui" style={{ fontSize: "0.75rem" }}>+{rest}</span>}
      {/* まだ続く、を示す点線と空きスロット */}
      <span aria-hidden style={{ width: 14, borderTop: "2px dashed #000000", display: "block", opacity: 0.45 }} />
      <span
        aria-hidden
        className="sticker-round shrink-0"
        style={{ width: 22, height: 22, background: "#ffffff", borderStyle: "dashed", opacity: 0.6 }}
      />
    </div>
  )
}

/** 完成したループ: 実際に輪として描く。この形が見えることがこのプロダクトの報酬 */
function LoopRing({ parties, accent }: { parties: Party[]; accent: string }) {
  const n = Math.min(parties.length, 16)
  const r = 40
  const c = 52
  return (
    <svg viewBox="0 0 104 104" style={{ width: 104, height: 104, overflow: "visible" }} aria-hidden>
      <circle cx={c} cy={c} r={r} fill="none" stroke="#000000" strokeWidth="1" />
      <circle cx={c} cy={c} r={r} fill="none" stroke={accent} strokeWidth="8" />
      {Array.from({ length: n }).map((_, i) => {
        const a = (i / n) * Math.PI * 2 - Math.PI / 2
        return (
          <circle
            key={i}
            cx={c + r * Math.cos(a)}
            cy={c + r * Math.sin(a)}
            r={i === 0 ? 7 : 5.5}
            fill={i === 0 ? "#000000" : "#ffffff"}
            stroke="#000000"
            strokeWidth="1"
          />
        )
      })}
    </svg>
  )
}

/** カード地の巡回色。1色をアクセントに選ばず、複数色を並べるのが様式のルール */
const CARD_TINTS = ["#ffffff", "#dceeff", "#e9ccff", "#fff3cf"]

function LoopCard({ item, index }: { item: LoopItem; index: number }) {
  const stage = stageOf(item.stageId)
  const top = item.hops[0]

  return (
    <Link
      href={`/chain/${item.chainId}`}
      className="slush-card flex flex-col overflow-hidden transition-transform hover:-translate-y-1"
      style={{ background: "#ffffff" }}
    >
      {/* ステージ画。どの世界まで育った輪なのかが一目で分かる */}
      <div
        className="relative img-pixel shrink-0"
        style={{
          height: 84,
          backgroundImage: `url(${stage.image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          borderBottom: "1px solid #000000",
          borderRadius: "19px 19px 0 0",
        }}
      >
        <span className="slush-badge absolute left-3 top-3" style={{ background: stage.accent }}>
          {stage.emoji} STAGE {stage.level}
        </span>
        <span
          className="slush-badge absolute right-3 top-3 font-ja"
          style={{ background: "#ffffff", fontSize: "0.875rem", fontWeight: 700 }}
        >
          {timeAgo(item.lastAt)}
        </span>
      </div>

      <div className="p-5 flex-1" style={{ background: item.isLoop ? stage.bgDark : CARD_TINTS[index % CARD_TINTS.length] }}>
        {/* 連鎖数を数字の主役として大きく置き、右に輪の形を並べる */}
        <div className="flex items-center gap-4 mb-4">
          <span className="flex items-baseline gap-1.5 shrink-0">
            <span className="display-lg" style={{ fontSize: "3.4rem", lineHeight: 0.8 }}>
              {item.length}
            </span>
            <span className="h-ja text-base">連鎖</span>
          </span>
          <span className="ml-auto">
            {item.isLoop ? (
              <LoopRing parties={item.participants} accent={stage.accent} />
            ) : (
              <ChainStrip parties={item.participants} accent={stage.accent} />
            )}
          </span>
        </div>

        {item.isLoop ? (
          <span className="slush-badge mb-4" style={{ background: "#000000", color: "#ffffff" }}>
            ✓ LOOP COMPLETE ×{stage.loopMultiplier}
          </span>
        ) : (
          <span className="slush-badge mb-4 font-ja" style={{ background: "#ffffff", fontSize: "0.875rem", fontWeight: 700 }}>
            <span className="live-pulse" aria-hidden /> いま伸びている
          </span>
        )}

        {/* 恩の中身を一番大きく見せる。ここがこのカードで一番読ませたい部分 */}
        {top ? (
          <>
            <p className="h-ja text-lg leading-snug mb-2">「{top.description}」</p>
            <p className="font-ja text-sm" style={{ opacity: 0.65 }}>
              {top.giver.name} <span aria-hidden>→</span> {top.receiver.name}
            </p>
          </>
        ) : (
          <p className="font-ja text-sm" style={{ opacity: 0.6 }}>まだ恩が動いていません</p>
        )}

        {item.hops.length > 1 && (
          <p className="font-ja text-sm mt-3" style={{ opacity: 0.55 }}>
            ほか {item.hops.length - 1} 件の恩送り
          </p>
        )}
        {item.pendingCount > 0 && (
          <p className="font-ja text-sm mt-1" style={{ opacity: 0.55 }}>
            確認待ち {item.pendingCount} 件
          </p>
        )}
      </div>
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
      {items.map((item, i) => (
        <LoopCard key={item.chainId} item={item} index={i} />
      ))}
    </div>
  )
}
