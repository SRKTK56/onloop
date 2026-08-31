import { LoopRibbon } from "./LoopRibbon"

const BANDS = {
  sky: "band-sky",
  paper: "band-paper",
  concrete: "band-concrete",
  lavender: "band-lavender",
} as const

/**
 * ページ見出しブロック。
 * 英字の彫刻的ディスプレイ＋和文サブ＋署名モチーフの3点セットで、
 * 「ディスプレイ文字を単独で置かない」という様式のルールを満たす。
 */
export function PageHead({
  en,
  ja,
  sub,
  band = "sky",
  children,
}: {
  en: string
  ja?: string
  sub?: string
  band?: keyof typeof BANDS
  children?: React.ReactNode
}) {
  return (
    <section className={`${BANDS[band]} relative overflow-hidden`}>
      <div
        aria-hidden
        className="absolute -right-16 -top-12 w-[300px] h-[300px] opacity-70 pointer-events-none"
      >
        <LoopRibbon variant="ring" className="w-full h-full" />
      </div>
      <div className="relative z-10 max-w-6xl mx-auto px-5 py-12 md:py-16">
        <h1 className="display-lg">{en}</h1>
        {ja && <p className="h-ja text-lg md:text-xl mt-4">{ja}</p>}
        {sub && <p className="font-ja text-sm mt-3 max-w-2xl leading-relaxed">{sub}</p>}
        {children && <div className="mt-6 flex gap-3 flex-wrap">{children}</div>}
      </div>
    </section>
  )
}
