import { getStage, getProgressToNext, STAGES } from "@/lib/stages"

type Props = {
  chainLength: number
  showProgress?: boolean
  size?: "sm" | "md" | "lg"
}

export function StageDisplay({ chainLength, showProgress = true, size = "md" }: Props) {
  const stage = getStage(chainLength)
  const progress = getProgressToNext(chainLength)
  const nextStage = STAGES.find((s) => s.level === stage.level + 1)

  const textSize = size === "sm" ? "text-[0.85rem]" : size === "lg" ? "text-[0.9rem]" : "text-[0.9rem]"
  const emojiSize = size === "sm" ? "text-base" : size === "lg" ? "text-3xl" : "text-xl"

  return (
    <div className="flex flex-col gap-2">
      {/* ステージバッジ */}
      <div
        className={`slush-badge ${textSize}`}
        style={{ color: "#000000", background: stage.accent, borderColor: "#000000", borderRadius: "1600px" }}
      >
        <span className={emojiSize}>{stage.emoji}</span>
        <span>STAGE {stage.level}</span>
        <span style={{ color: "#000000" }}>{stage.nameEn}</span>
      </div>

      {/* プログレスバー */}
      {showProgress && nextStage && (
        <div className="flex flex-col gap-1">
          <div
            className="h-3 w-full overflow-hidden"
            style={{ background: "#e9e9e9", border: "1px solid #000000", borderRadius: "1600px" }}
          >
            <div
              className="h-full transition-all duration-500"
              style={{
                width: `${progress}%`,
                background: stage.accent }}
            />
          </div>
          <p
            className="font-display text-[0.85rem] leading-relaxed"
            style={{ color: "#000000" }}
          >
            {stage.nextMessage}（{chainLength}/{nextStage.min - 1}）
          </p>
        </div>
      )}
    </div>
  )
}

export function StageLadder({ currentLength }: { currentLength: number }) {
  const current = getStage(currentLength)

  return (
    <div className="flex items-center gap-1 flex-wrap">
      {STAGES.map((s, i) => (
        <div key={s.id} className="flex items-center gap-1">
          <div
            className="flex items-center gap-1 px-2.5 py-1 font-ja text-sm font-bold border transition-all"
            style={{
              // 文字は常に Carbon。bgDark は様式移行で淡色になったため文字色には使えない
              background: s.level <= current.level ? s.accent : "#e9e9e9",
              color: "#000000",
              borderColor: "#000000",
              opacity: s.level <= current.level ? 1 : 0.45,
              boxShadow: "none",
              transform: s.id === current.id ? "scale(1.12)" : "scale(1)",
              borderRadius: "1600px",
            }}
          >
            <span>{s.emoji}</span>
            <span>{s.name}</span>
          </div>
          {i < STAGES.length - 1 && (
            <span className="font-ui" style={{ fontSize: "0.7rem", opacity: 0.5 }}>→</span>
          )}
        </div>
      ))}
    </div>
  )
}

/**
 * ステージバナー — 「連鎖が伸びると世界が育つ」を主役として見せる大型表示。
 *
 * ステージ絵・倍率・次のステージまでの残りを1枚にまとめる。
 * 報酬倍率が実際にこの値で計算されるため、ここは飾りではなく仕様の表示。
 */
export function StageBanner({ chainLength, isLoop = false }: { chainLength: number; isLoop?: boolean }) {
  const stage = getStage(chainLength)
  const progress = getProgressToNext(chainLength)
  const nextStage = STAGES.find((s) => s.level === stage.level + 1)
  const remain = nextStage ? Math.max(nextStage.min - chainLength, 0) : 0

  return (
    <div className="slush-card-lg overflow-hidden">
      <div
        className="w-full h-40 md:h-56 img-pixel"
        style={{
          backgroundImage: `url(${stage.image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          borderBottom: "1px solid #000000",
        }}
      />
      <div className="p-6" style={{ background: stage.bgDark }}>
        <div className="flex items-center gap-2 flex-wrap mb-4">
          <span className="slush-badge" style={{ background: stage.accent }}>
            STAGE {stage.level}
          </span>
          <span className="slush-badge font-ja" style={{ fontSize: "0.875rem", fontWeight: 700 }}>
            {stage.emoji} {stage.name}
          </span>
          <span className="slush-badge" style={{ background: "#ffd731" }}>
            LOOP ×{stage.loopMultiplier}
          </span>
          {isLoop && (
            <span className="slush-badge" style={{ background: "#000000", color: "#ffffff" }}>
              ✓ LOOP COMPLETE
            </span>
          )}
        </div>

        <p className="display-md mb-2">{chainLength} 連鎖</p>
        <p className="font-ja text-sm mb-5">{stage.description}</p>

        {nextStage ? (
          <>
            <div
              className="h-3 w-full overflow-hidden mb-2"
              style={{ background: "#ffffff", border: "1px solid #000000", borderRadius: "1600px" }}
            >
              <div
                className="h-full transition-all duration-500"
                style={{ width: `${progress}%`, background: stage.accent }}
              />
            </div>
            <p className="font-ja text-sm">
              あと <span className="h-ja">{remain}</span> 連鎖で{" "}
              <span className="h-ja">{nextStage.emoji} {nextStage.name}</span> へ
              （ループ報酬 ×{stage.loopMultiplier} → ×{nextStage.loopMultiplier}）
            </p>
          </>
        ) : (
          <p className="font-ja text-sm">最終ステージに到達しています。</p>
        )}

        <div className="mt-6">
          <StageLadder currentLength={chainLength} />
        </div>
      </div>
    </div>
  )
}
