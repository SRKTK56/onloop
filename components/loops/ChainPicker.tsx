"use client"

import { useEffect, useState } from "react"
import { STAGES } from "@/lib/stages"
import type { LoopItem } from "@/lib/loops"

/**
 * 加わる輪を選ぶ。
 * 以前はチェーンIDを数字で手入力させていたが、どの輪があるかを知る手段が
 * 画面上に無く、事実上誰も選べなかった（2026-08-31 に置き換え）。
 */
export function ChainPicker({
  value,
  onChange,
}: {
  value: number | null
  onChange: (chainId: number | null) => void
}) {
  const [items, setItems] = useState<LoopItem[] | null>(null)

  useEffect(() => {
    fetch("/api/loops?limit=20")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => setItems((d.items ?? []).filter((i: LoopItem) => !i.isLoop)))
      .catch(() => setItems([]))
  }, [])

  if (items === null) {
    return <div className="slush-card p-5" style={{ height: 96, opacity: 0.35 }} />
  }

  if (items.length === 0) {
    return (
      <div className="slush-card p-5">
        <p className="font-ja text-sm">
          いま進行中の輪がありません。起点として登録すると、あなたから新しい輪が始まります。
        </p>
      </div>
    )
  }

  return (
    <div className="grid sm:grid-cols-2 gap-3">
      {items.map((item) => {
        const stage = STAGES.find((s) => s.id === item.stageId) ?? STAGES[0]
        const selected = value === item.chainId
        return (
          <button
            key={item.chainId}
            type="button"
            onClick={() => onChange(selected ? null : item.chainId)}
            className="slush-card p-4 text-left"
            style={{ background: selected ? stage.accent : "#ffffff", cursor: "pointer" }}
          >
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <span className="slush-badge" style={{ background: "#ffffff" }}>
                輪 #{item.chainId}
              </span>
              <span className="slush-badge font-ja" style={{ fontSize: "0.875rem", fontWeight: 700 }}>
                {stage.emoji} {item.length} 連鎖
              </span>
              <span className="slush-badge" style={{ background: "#ffd731" }}>
                完成時 ×{stage.loopMultiplier}
              </span>
            </div>
            {item.hops[0] ? (
              <p className="font-ja text-sm">
                最新：{item.hops[0].giver.name} → {item.hops[0].receiver.name}
                <br />
                「{item.hops[0].description}」
              </p>
            ) : (
              <p className="font-ja text-sm">まだ動いていません</p>
            )}
          </button>
        )
      })}
    </div>
  )
}
