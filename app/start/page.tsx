import Link from "next/link"
import { PageHead } from "@/components/shared/PageHead"
import { getLoopFeed } from "@/lib/loops"
import { STAGES } from "@/lib/stages"

export const dynamic = "force-dynamic"

/** 起点になる場合の図。ひとつの点から輪が生まれようとしている */
function OriginDiagram() {
  return (
    <svg viewBox="0 0 200 120" className="w-full" style={{ maxHeight: 130 }} aria-hidden>
      <circle cx="100" cy="60" r="42" fill="none" stroke="#000000" strokeWidth="1"
        strokeDasharray="5 6" opacity="0.45" />
      <circle cx="100" cy="18" r="9" fill="#000000" stroke="#000000" strokeWidth="1" />
      <text x="100" y="106" textAnchor="middle" fontSize="11" fontWeight="700" fill="#000000">
        あなたが起点
      </text>
    </svg>
  )
}

/** 加わる場合の図。伸びている連鎖の先に自分が入る */
function JoinDiagram({ accent }: { accent: string }) {
  const dots = [0, 1, 2, 3]
  return (
    <svg viewBox="0 0 200 120" className="w-full" style={{ maxHeight: 130 }} aria-hidden>
      {dots.map((i) => (
        <g key={i}>
          {i > 0 && (
            <line x1={34 + (i - 1) * 38} y1="46" x2={34 + i * 38 - 10} y2="46"
              stroke="#000000" strokeWidth="1" />
          )}
          <circle cx={34 + i * 38} cy="46" r="9"
            fill={i === 0 ? "#000000" : accent} stroke="#000000" strokeWidth="1" />
        </g>
      ))}
      <line x1="148" y1="46" x2="168" y2="46" stroke="#000000" strokeWidth="1" strokeDasharray="4 4" />
      <circle cx="182" cy="46" r="10" fill="#ffffff" stroke="#000000" strokeWidth="1" strokeDasharray="4 3" />
      <text x="182" y="76" textAnchor="middle" fontSize="11" fontWeight="700" fill="#000000">あなた</text>
      <text x="70" y="98" textAnchor="middle" fontSize="10" fill="#000000" opacity="0.6">
        いま伸びている輪
      </text>
    </svg>
  )
}

export default async function StartPage() {
  const loops = await getLoopFeed(20)
  const running = loops.filter((l) => !l.isLoop)
  const longest = running.reduce<number>((m, l) => Math.max(m, l.length), 0)
  const longestStage = STAGES.find((s) => longest >= s.min && longest <= s.max) ?? STAGES[0]
  const joinAccent = longestStage.accent

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
              <OriginDiagram />
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
          <div className="slush-card-lg p-7 flex flex-col" style={{ background: joinAccent }}>
            <span className="slush-badge self-start mb-5" style={{ background: "#ffffff" }}>
              CHOICE 02
            </span>
            <h2 className="display-md mb-4">JOIN A LOOP</h2>
            <p className="h-ja text-lg mb-5">⇢ いまある輪に加わる</p>

            <div className="slush-card p-4 mb-5" style={{ background: "#ffffff" }}>
              <JoinDiagram accent={joinAccent} />
            </div>

            <div className="flex gap-2 flex-wrap mb-4">
              <span className="slush-badge font-ja" style={{ background: "#ffffff", fontSize: "0.875rem", fontWeight: 700 }}>
                進行中の輪 {running.length} 本
              </span>
              {longest > 0 && (
                <span className="slush-badge font-ja" style={{ background: "#ffffff", fontSize: "0.875rem", fontWeight: 700 }}>
                  最長 {longest} 連鎖 {longestStage.emoji}{longestStage.name}
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
