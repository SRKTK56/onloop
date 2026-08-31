/**
 * ON がどう増えるかの図。
 *
 * ON は連鎖の中でしか意味を持たないので、数字だけ並べても伝わらない。
 * 「恩がひとつ進むとき」と「輪が閉じたとき」の2枚に分けて、
 * 誰にどれだけ入るかを絵の上で見せる。
 *
 * 数値は lib/rewards.ts の calcHopRewards / calcLoopRewards に合わせている。
 */

import { calcHopRewards, calcLoopRewards } from "@/lib/rewards"
import { getStage } from "@/lib/stages"

const INK = "#000000"

/** 恩がひとつ進むとき。関わった全員に少しずつ入る */
function HopPanel() {
  const xs = [30, 88, 146, 204]
  const y = 54
  const gains = ["+5", "+1", "+2", "+1"]
  const roles = ["起点", "", "渡した人", "受け取った人"]
  const fills = [INK, "#7ee8e8", "#7ee8e8", "#ffffff"]

  return (
    <svg viewBox="0 0 234 118" className="w-full" style={{ maxHeight: 168 }} role="img"
      aria-label="恩がひとつ進むと、起点に+5、渡した人に+2、間の人と受け取った人に+1ずつ入る">
      {xs.map((x, i) => (
        <g key={i}>
          {i > 0 && (
            <line x1={xs[i - 1] + 10} y1={y} x2={x - 10} y2={y}
              stroke={INK} strokeWidth="1"
              strokeDasharray={i === 3 ? "3 3" : undefined} />
          )}
          <circle cx={x} cy={y} r="10" fill={fills[i]} stroke={INK} strokeWidth="1"
            strokeDasharray={i === 3 ? "3 3" : undefined} />
          {/* 獲得量を各人の上に置く */}
          <rect x={x - 17} y={y - 34} width="34" height="18" rx="9"
            fill="#ffd731" stroke={INK} strokeWidth="1" />
          <text x={x} y={y - 21} textAnchor="middle" fontSize="11" fontWeight="700" fill={INK}>
            {gains[i]}
          </text>
          {roles[i] && (
            <text x={x} y={y + 30} textAnchor="middle" fontSize="8.5" fill={INK} opacity="0.65">
              {roles[i]}
            </text>
          )}
        </g>
      ))}
      <text x="117" y="110" textAnchor="middle" fontSize="9.5" fill={INK} opacity="0.55">
        関わった全員に少しずつ
      </text>
    </svg>
  )
}

/** 輪が閉じたとき。全員にまとめて入る */
function LoopPanel() {
  const n = 6
  const cx = 117
  const cy = 50
  // 中央のバッジと輪の点が重ならないよう、半径とバッジ幅を対で決める
  const r = 38
  const pos = (i: number) => {
    const a = (i / n) * Math.PI * 2 - Math.PI / 2
    return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) }
  }

  return (
    <svg viewBox="0 0 234 124" className="w-full" style={{ maxHeight: 168 }} role="img"
      aria-label="輪が閉じると、起点に連鎖の長さ×20、中継した人に×5から×15が入る">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#55db9c" strokeWidth="7" />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={INK} strokeWidth="1" />
      {Array.from({ length: n }).map((_, i) => {
        const { x, y } = pos(i)
        return (
          <circle key={i} cx={x} cy={y} r={i === 0 ? 8 : 6.5}
            fill={i === 0 ? INK : "#ffffff"} stroke={INK} strokeWidth="1" />
        )
      })}
      {/* 中央にまとめて入ることを示す */}
      <rect x={cx - 27} y={cy - 10} width="54" height="20" rx="10"
        fill="#ffd731" stroke={INK} strokeWidth="1" />
      <text x={cx} y={cy + 4.5} textAnchor="middle" fontSize="11.5" fontWeight="700" fill={INK}>
        N = 6
      </text>
      <text x={cx} y="108" textAnchor="middle" fontSize="9.5" fill={INK} opacity="0.55">
        輪の全員にまとめて入る
      </text>
      <text x={cx} y="120" textAnchor="middle" fontSize="9.5" fill={INK} opacity="0.55">
        N＝この輪に参加した人数（図では6人）
      </text>
    </svg>
  )
}

export function OnDiagram({ labels }: { labels: { hop: string; loop: string } }) {
  return (
    <div className="grid md:grid-cols-2 gap-5">
      <div className="slush-card p-5" style={{ background: "#ffffff" }}>
        <p className="h-ja text-base mb-3">{labels.hop}</p>
        <HopPanel />
      </div>
      <div className="slush-card p-5" style={{ background: "#ffffff" }}>
        <p className="h-ja text-base mb-3">{labels.loop}</p>
        <LoopPanel />
      </div>
    </div>
  )
}

/**
 * 具体例。
 *
 * 数字は lib/rewards.ts の calcHopRewards / calcLoopRewards を
 * app/api/chains/route.ts と同じ手順で回して生成する。
 * 手で書くと実装と乖離するため、必ず実際の計算式から出すこと。
 */

const NUM: React.CSSProperties = { fontVariantNumeric: "tabular-nums" }

/** 6人の輪（p0→p1→…→p5→p0）を最初から最後まで再現する */
function simulateLoop(n: number) {
  const people = Array.from({ length: n }, (_, i) => `p${i}`)
  const receivers = people.map((_, k) => people[(k + 1) % n])
  const stage = getStage(n)

  // 連鎖が1つ進むたびの報酬を、APIと同じ引数の作り方で積み上げる
  const hop: Record<string, number> = {}
  for (let k = 0; k < n; k++) {
    const parts = [people[0], ...receivers.slice(0, k + 1)].filter(
      (w, i, a) => a.indexOf(w) === i
    )
    const r = calcHopRewards(parts.slice(0, -1), receivers[k])
    for (const [w, v] of Object.entries(r)) hop[w] = (hop[w] ?? 0) + v
  }

  const loop = calcLoopRewards(people, people[0], stage.loopMultiplier)
  return { people, stage, hop, loop }
}

export function OnExample() {
  const N = 6
  const { people, stage, hop, loop } = simulateLoop(N)
  const rows = people.map((w, i) => ({
    role: i === 0 ? "起点者（輪を始めた人）" : `${i}番目に繋いだ人`,
    origin: i === 0,
    hop: hop[w] ?? 0,
    loop: loop[w] ?? 0,
    total: (hop[w] ?? 0) + (loop[w] ?? 0),
  }))
  const sum = (k: "hop" | "loop" | "total") => rows.reduce((a, r) => a + r[k], 0)

  return (
    <div className="slush-card-lg p-6">
      <p className="h-ja text-base mb-4">例：6人の輪が閉じるまで</p>

      <div className="flex flex-wrap gap-2 mb-5">
        <span className="slush-badge font-ja" style={{ background: "#ffffff", fontSize: "0.875rem", fontWeight: 700 }}>
          N = {N}人
        </span>
        <span className="slush-badge font-ja" style={{ background: stage.accent, fontSize: "0.875rem", fontWeight: 700 }}>
          {stage.emoji} {stage.name}（倍率 ×{stage.loopMultiplier}）
        </span>
      </div>

      {/* 横に広いので、はみ出す場合はこの中だけスクロールさせる */}
      <div className="overflow-x-auto">
        <div style={{ minWidth: 460 }}>
          <div className="flex items-end gap-3 pb-2" style={{ borderBottom: "1px solid #000000" }}>
            <span className="flex-1 font-ui" style={{ fontSize: "0.6875rem" }}>WHO</span>
            <span className="w-24 text-right font-ja text-sm" style={{ opacity: 0.7 }}>連鎖の途中</span>
            <span className="w-24 text-right font-ja text-sm" style={{ opacity: 0.7 }}>輪が閉じて</span>
            <span className="w-24 text-right font-ja text-sm font-bold">合計</span>
          </div>

          {rows.map((r) => (
            <div
              key={r.role}
              className="flex items-center gap-3 py-2.5"
              style={{ borderBottom: "1px solid #000000" }}
            >
              <span className="flex-1 flex items-center gap-2.5 min-w-0">
                <span
                  className="sticker-round shrink-0"
                  style={{ width: 14, height: 14, background: r.origin ? INK : "#ffffff" }}
                />
                <span className="font-ja text-sm truncate">{r.role}</span>
              </span>
              <span className="w-24 text-right font-ja text-sm" style={{ ...NUM, opacity: 0.7 }}>
                +{r.hop}
              </span>
              <span className="w-24 text-right font-ja text-sm" style={NUM}>
                +{r.loop}
              </span>
              <span className="w-24 text-right shrink-0">
                <span className="slush-badge" style={{ background: r.origin ? "#ffd731" : "#ffffff", ...NUM }}>
                  {r.total} ON
                </span>
              </span>
            </div>
          ))}

          <div className="flex items-center gap-3 pt-3">
            <span className="flex-1 h-ja text-sm">この輪ぜんぶで</span>
            <span className="w-24 text-right font-ja text-sm" style={{ ...NUM, opacity: 0.7 }}>{sum("hop")}</span>
            <span className="w-24 text-right font-ja text-sm" style={NUM}>{sum("loop")}</span>
            <span className="w-24 text-right display-md" style={{ fontSize: "1.35rem", ...NUM }}>
              {sum("total")}
            </span>
          </div>
        </div>
      </div>

      <p className="font-ja text-sm mt-4" style={{ opacity: 0.7 }}>
        連鎖の途中でも少しずつ入りますが、大きいのは輪が閉じたときです。
        輪が長くなるほど N が増え、ステージ倍率も上がるので取り分が大きくなります。
      </p>
    </div>
  )
}
