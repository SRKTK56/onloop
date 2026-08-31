import { LoopFeed } from "@/components/loops/LoopFeed"
import { PageHead } from "@/components/shared/PageHead"
import { StageLadder } from "@/components/shared/StageDisplay"

export const dynamic = "force-dynamic"

export default function LoopsPage() {
  return (
    <div className="min-h-screen band-paper">
      <PageHead
        en="LIVE LOOPS"
        ja="いま、恩が動いている"
        sub="進行中の恩送りと、閉じたループの記録。ウォレットの接続なしで見られます。"
        band="sky"
      />
      <div className="max-w-5xl mx-auto px-5 py-12">
        {/* 連鎖が伸びると世界が育つ、という軸を先に示す */}
        <div className="slush-card-lg p-6 mb-10">
          <p className="font-ui mb-4">WORLD STAGES</p>
          <StageLadder currentLength={0} />
          <p className="font-ja text-sm mt-4">
            連鎖が長いほど世界が進化し、ループが閉じたときの報酬倍率も上がります。
          </p>
        </div>

        <LoopFeed limit={30} columns={2} />
      </div>
    </div>
  )
}
