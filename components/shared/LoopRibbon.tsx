"use client"

/**
 * ONLOOP の署名モチーフ — 膨らんだループリボン。
 *
 * Slush 様式における「3Dリボン」の役割を担う。全セクションに必ず1つ置くことで、
 * 装飾を散らさずにブランドを反復する。グラデーション禁止の唯一の例外がこれ
 * （立体の重さを全部この要素に背負わせ、他の面はフラットに保つ）。
 */

type Props = {
  /** 管の色。既定は Electric Blue */
  color?: string
  /** 影の側の色 */
  shade?: string
  className?: string
  /** ring: 恩が還ってくる輪 / arc: セクションを横切る弧 */
  variant?: "ring" | "arc"
  opacity?: number
}

let uid = 0

export function LoopRibbon({
  color = "#4da2ff",
  shade = "#0052ff",
  className = "",
  variant = "ring",
  opacity = 1,
}: Props) {
  const id = `ribbon-${uid++}`
  const grain = `${id}-grain`

  /**
   * 管1本を3層のストロークで描く。
   * 太い影 → 少しずらした主色 → さらにずらした白ハイライト、の順に重ねると
   * グラデーションを使わずに「膨らんだチューブ」の断面が出る。
   * （1本のグラデーションストロークだと図形全体が一様に塗られ、平板に見える）
   */
  const Tube = ({ d, w }: { d: string; w: number }) => (
    <g>
      <path d={d} fill="none" stroke={shade} strokeWidth={w} strokeLinecap="round" />
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={w * 0.84}
        strokeLinecap="round"
        transform="translate(-2,-3)"
      />
      {/* ハイライトはぼかす。輪郭が立つと帯が3本に見えて管に見えなくなる */}
      <path
        d={d}
        fill="none"
        stroke="#ffffff"
        strokeWidth={w * 0.17}
        strokeLinecap="round"
        opacity="0.55"
        transform="translate(-6.5,-9.5)"
        style={{ filter: "blur(3px)" }}
      />
    </g>
  )

  const RING = "M 200 62 A 138 138 0 1 1 199.5 62"
  const CROSS = "M 116 262 Q 200 196 284 262"
  const ARC = "M -40 250 C 90 100, 200 330, 320 150 S 440 40, 470 96"

  return (
    <svg viewBox="0 0 400 400" className={className} aria-hidden="true"
      style={{ opacity, pointerEvents: "none", overflow: "visible" }}>
      <defs>
        {/* ざらついた表面。印刷物の質感を薄く乗せる */}
        <filter id={grain}>
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" result="n" />
          <feColorMatrix in="n" type="saturate" values="0" result="g" />
          <feComponentTransfer in="g" result="soft">
            <feFuncA type="linear" slope="0.18" intercept="0" />
          </feComponentTransfer>
          <feComposite in="soft" in2="SourceAlpha" operator="in" result="masked" />
          <feBlend in="SourceGraphic" in2="masked" mode="multiply" />
        </filter>
      </defs>

      <g filter={`url(#${grain})`}>
        {variant === "ring" ? (
          <>
            <Tube d={RING} w={56} />
            {/* 手前を横切る帯。これがあると輪ではなく「結んだリボン」に見える */}
            <Tube d={CROSS} w={50} />
          </>
        ) : (
          <Tube d={ARC} w={54} />
        )}
      </g>
    </svg>
  )
}

/**
 * ステッカー — 黒1px輪郭・塗り・微回転で「切り抜いて貼った」ように見せる。
 * グリッドに揃えないこと。揃えた瞬間にコラージュ感が消える。
 */
export function Sticker({
  children,
  fill = "#ffd731",
  rotate = -8,
  size = 64,
  round = false,
  className = "",
}: {
  children: React.ReactNode
  fill?: string
  rotate?: number
  size?: number
  round?: boolean
  className?: string
}) {
  return (
    <span
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: size,
        height: size,
        background: fill,
        border: "1px solid #000000",
        borderRadius: round ? 1600 : 20,
        transform: `rotate(${rotate}deg)`,
        fontSize: size * 0.46,
        lineHeight: 1,
        userSelect: "none",
      }}
    >
      {children}
    </span>
  )
}
