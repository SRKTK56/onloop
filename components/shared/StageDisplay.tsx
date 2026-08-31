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
            className={`slush-card-sm flex items-center gap-1 px-2 py-1 text-[0.85rem] font-display transition-all`}
            style={{
              background: s.level <= current.level ? s.bgLight : "#e5e5e5",
              color: s.level <= current.level ? s.bgDark : "#999",
              borderColor: s.level <= current.level ? s.accent : "#ccc",
              boxShadow: "none",
              transform: s.id === current.id ? "scale(1.1)" : "scale(1)", borderRadius: "20px"}}
          >
            <span>{s.emoji}</span>
            <span>{s.name}</span>
          </div>
          {i < STAGES.length - 1 && (
            <span className="text-xs font-display text-muted-foreground">→</span>
          )}
        </div>
      ))}
    </div>
  )
}
