import { getStage, getProgressToNext, STAGES } from "@/lib/stages"
import { PixelIcon } from "./PixelIcon"

type Props = {
  chainLength: number
  showProgress?: boolean
  size?: "sm" | "md" | "lg"
}

export function StageDisplay({ chainLength, showProgress = true, size = "md" }: Props) {
  const stage = getStage(chainLength)
  const progress = getProgressToNext(chainLength)
  const nextStage = STAGES.find((s) => s.level === stage.level + 1)

  const textSize = size === "sm" ? "text-[0.45rem]" : size === "lg" ? "text-[0.7rem]" : "text-[0.55rem]"
  const iconScale = size === "sm" ? 2 : size === "lg" ? 5 : 3

  return (
    <div className="flex flex-col gap-2">
      {/* ステージバッジ */}
      <div
        className={`stage-badge ${textSize}`}
        style={{ color: stage.accent, borderColor: stage.accent }}
      >
        <PixelIcon type={stage.pixelIcon} scale={iconScale} />
        <span>STAGE {stage.level}</span>
        <span style={{ color: stage.accent }}>{stage.nameEn}</span>
      </div>

      {/* プログレスバー */}
      {showProgress && nextStage && (
        <div className="flex flex-col gap-1">
          <div
            className="h-3 w-full border-2 border-black"
            style={{ background: "#111" }}
          >
            <div
              className="h-full transition-all duration-500"
              style={{
                width: `${progress}%`,
                background: stage.accent,
                imageRendering: "pixelated",
              }}
            />
          </div>
          <p
            className="font-pixel text-[0.45rem] leading-relaxed"
            style={{ color: stage.accent }}
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
            className={`pixel-box-sm flex items-center gap-1 px-2 py-1 text-[0.45rem] font-pixel transition-all`}
            style={{
              background: s.level <= current.level ? s.bgLight : "#e5e5e5",
              color: s.level <= current.level ? s.bgDark : "#999",
              borderColor: s.level <= current.level ? s.accent : "#ccc",
              boxShadow: s.level <= current.level ? `3px 3px 0 ${s.accent}` : "3px 3px 0 #ccc",
              transform: s.id === current.id ? "scale(1.1)" : "scale(1)",
            }}
          >
            <PixelIcon type={s.pixelIcon} scale={2} />
            <span>{s.name}</span>
          </div>
          {i < STAGES.length - 1 && (
            <span className="text-xs font-pixel text-muted-foreground">→</span>
          )}
        </div>
      ))}
    </div>
  )
}
