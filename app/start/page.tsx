import Link from "next/link"
import { PageHead } from "@/components/shared/PageHead"
import { getLoopFeed } from "@/lib/loops"
import { STAGES } from "@/lib/stages"

export const dynamic = "force-dynamic"

/**
 * 2択の図。
 *
 * どちらも同じ横並びの連鎖で描き、「あなた」が先頭に立つか末尾に加わるかだけを変える。
 * 選択の本質は位置の違いなので、図の形を変えるより位置を変えたほうが伝わる。
 */
function ChainDiagram({ mode, accent }: { mode: "origin" | "join"; accent: string }) {
  const slots = [0, 1, 2, 3, 4]
  const x = (i: number) => 30 + i * 35
  const y = 44
  const isOrigin = mode === "origin"
  // 起点モードでは自分だけが確定、加わるモードでは末尾以外が確定済み
  const filled = (i: number) => (isOrigin ? i === 0 : i < 4)
  const youIndex = isOrigin ? 0 : 4

  return (
    <svg viewBox="4 2 192 92" className="w-full" style={{ maxHeight: 150 }} aria-hidden>
      {/* 一周して戻ってくることを示す破線の弧。両方の選択肢に共通の「輪」 */}
      <path
        d={`M ${x(4)} ${y - 13} C ${x(4)} 8, ${x(0)} 8, ${x(0)} ${y - 13}`}
        fill="none"
        stroke="#000000"
        strokeWidth="1"
        strokeDasharray="4 4"
        opacity="0.4"
      />
      <path d={`M ${x(0)} ${y - 13} l -3.5 -6 l 7 0 z`} fill="#000000" opacity="0.4" />

      {slots.map((i) => (
        <g key={i}>
          {i > 0 && (
            <line
              x1={x(i - 1) + 9}
              y1={y}
              x2={x(i) - 9}
              y2={y}
              stroke="#000000"
              strokeWidth="1"
              strokeDasharray={filled(i) ? undefined : "3 3"}
              opacity={filled(i) ? 1 : 0.5}
            />
          )}
          <circle
            cx={x(i)}
            cy={y}
            r={i === youIndex ? 10 : 8}
            fill={i === 0 ? "#000000" : filled(i) ? accent : "#ffffff"}
            stroke="#000000"
            strokeWidth="1"
            strokeDasharray={filled(i) || i === youIndex ? undefined : "3 3"}
            opacity={filled(i) || i === youIndex ? 1 : 0.55}
          />
        </g>
      ))}

      <text x={x(youIndex)} y={y + 26} textAnchor="middle" fontSize="11" fontWeight="700" fill="#000000">
        あなた
      </text>
      <text x={100} y={y + 46} textAnchor="middle" fontSize="9.5" fill="#000000" opacity="0.55">
        {isOrigin ? "ここから輪が伸びて、いつか戻ってくる" : "伸びている輪の続きを担う"}
      </text>
    </svg>
  )
}

export default async function StartPage() {
  const loops = await getLoopFeed(20)
  const running = loops.filter((l) => !l.isLoop)
  const longest = running.reduce<number>((m, l) => Math.max(m, l.length), 0)
  const longestStage = STAGES.find((s) => longest >= s.min && longest <= s.max) ?? STAGES[0]

  return (
    <div className="min-h-screen band-paper">
      <PageHead
        en="START GIVING"
        ja="恩送りをはじめる"
        sub="はじめ方はふたつあります。あなたから輪を始めるか、いま動いている輪に加わるか。"
        band="sky"
      />

      <div className="max-w-5xl mx-auto px-5 py-12">
        <div className="grid md:grid-cols-2 gap-6">

          {/* ── 起点になる ── */}
          <div className="slush-card-lg p-7 flex flex-col" style={{ background: "#ffd731" }}>
            <span className="slush-badge self-start mb-5" style={{ background: "#ffffff" }}>
              CHOICE 01
            </span>
            <h2 className="display-md mb-4">START A LOOP</h2>
            <p className="h-ja text-lg mb-5">★ あたらしい輪を始める</p>

            <div className="slush-card p-4 mb-5" style={{ background: "#ffffff" }}>
              <ChainDiagram mode="origin" accent="#ffd731" />
            </div>

            <p className="font-ja text-sm leading-relaxed mb-2">
              あなたが提供できることをメニューに登録します。
              誰かがそれを受け取った瞬間に、あなたを起点とする輪が生まれます。
            </p>
            <p className="font-ja text-sm leading-relaxed mb-6">
              輪が一周してあなたに戻ってきたとき、
              <span className="h-ja">起点者にいちばん大きなボーナス</span>が入ります。
            </p>

            <Link
              href="/provider/apply?role=origin"
              className="slush-btn font-ja mt-auto self-start"
              style={{ fontWeight: 700 }}
            >
              ▸ 起点として登録する
            </Link>
          </div>

          {/* ── 輪に加わる ── */}
          <div className="slush-card-lg p-7 flex flex-col" style={{ background: "#7ee8e8" }}>
            <span className="slush-badge self-start mb-5" style={{ background: "#ffffff" }}>
              CHOICE 02
            </span>
            <h2 className="display-md mb-4">JOIN A LOOP</h2>
            <p className="h-ja text-lg mb-5">⇢ いまある輪に加わる</p>

            <div className="slush-card p-4 mb-5" style={{ background: "#ffffff" }}>
              <ChainDiagram mode="join" accent="#7ee8e8" />
            </div>

            <div className="flex gap-2 flex-wrap mb-4">
              <span className="slush-badge font-ja" style={{ background: "#ffffff", fontSize: "0.875rem", fontWeight: 700 }}>
                進行中の輪 {running.length} 本
              </span>
              {longest > 0 && (
                <span className="slush-badge font-ja" style={{ background: "#ffffff", fontSize: "0.875rem", fontWeight: 700 }}>
                  最長 {longest} 連鎖 {longestStage.emoji} {longestStage.name}
                </span>
              )}
            </div>

            <p className="font-ja text-sm leading-relaxed mb-6">
              すでに動いている輪を選んで、その続きを担います。
              <span className="h-ja">長く続いている輪ほど、閉じたときの報酬倍率が大きく</span>
              なります（最大 ×20）。
            </p>

            <Link
              href="/provider/apply?role=relay"
              className="slush-btn font-ja mt-auto self-start"
              style={{ fontWeight: 700 }}
            >
              ▸ 加わる輪を選ぶ
            </Link>
          </div>
        </div>

        {/* 迷ったとき */}
        <div className="slush-card-lg p-6 mt-6 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="h-ja text-base mb-1">どちらか決められないときは</p>
            <p className="font-ja text-sm">
              いま動いている輪を眺めてから決められます。ウォレットの接続は要りません。
            </p>
          </div>
          <Link href="/loops" className="slush-btn slush-btn-ghost font-ja shrink-0" style={{ fontWeight: 700 }}>
            ▸ 動いている輪を見る
          </Link>
        </div>

        {/* 受け取りたい人向け */}
        <div className="slush-card p-5 mt-4 flex items-center justify-between gap-4 flex-wrap">
          <p className="font-ja text-sm">恩を「受け取りたい」場合はこちら。</p>
          <Link href="/menu" className="slush-btn slush-btn-ghost font-ja shrink-0" style={{ fontWeight: 700 }}>
            ▸ 恩送りメニューを見る
          </Link>
        </div>
      </div>
    </div>
  )
}
