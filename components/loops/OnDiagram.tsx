/**
 * ON がどう増えるかの図。
 *
 * ON は連鎖の中でしか意味を持たないので、数字だけ並べても伝わらない。
 * 「恩がひとつ進むとき」と「輪が閉じたとき」の2枚に分けて、
 * 誰にどれだけ入るかを絵の上で見せる。
 *
 * 数値は lib/rewards.ts の calcHopRewards / calcLoopRewards に合わせている。
 */

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
        N×20
      </text>
      <text x={cx} y="108" textAnchor="middle" fontSize="9.5" fill={INK} opacity="0.55">
        起点はN×20、中継した人もまとめて
      </text>
      <text x={cx} y="120" textAnchor="middle" fontSize="9.5" fill={INK} opacity="0.55">
        連鎖が長いほど倍率が上がる
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
