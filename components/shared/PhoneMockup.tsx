export function PhoneMockup() {
  const nodes = [
    { id: "A", label: "Aさん", sub: "写真撮影", color: "#0052FF", text: "#fff", origin: true },
    { id: "B", label: "Bさん", sub: "企画を支援", color: "#fff", text: "#0f172a", origin: false },
    { id: "C", label: "Cさん", sub: "料理を振る舞う", color: "#fff", text: "#0f172a", origin: false },
    { id: "D", label: "Dさん", sub: "次へ繋ぐ…", color: "#f0f4ff", text: "#0052FF", origin: false },
  ]

  return (
    <div className="relative flex justify-center select-none">
      {/* 背景グロー */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-64 h-64 rounded-full bg-primary/10 blur-3xl" />
      </div>

      {/* スマホ本体 */}
      <div className="relative w-[260px] rounded-[2.5rem] border-[6px] border-foreground/10 bg-background shadow-2xl overflow-hidden">
        {/* ノッチ */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-5 bg-foreground/10 rounded-b-2xl z-10" />

        {/* 画面コンテンツ */}
        <div className="bg-background px-4 pt-8 pb-6 min-h-[480px] flex flex-col gap-3">
          {/* アプリヘッダー */}
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold tracking-tight" style={{ color: "#0052FF" }}>ONLOOP</span>
            <span className="text-[10px] text-muted-foreground">チェーン #12</span>
          </div>

          {/* チェーンノード */}
          {nodes.map((node, i) => (
            <div key={node.id}>
              <div
                className="rounded-2xl px-3 py-2.5 flex items-center gap-2.5 border"
                style={{
                  background: node.color,
                  borderColor: node.origin ? "#0052FF" : "#e2e8f0",
                }}
              >
                {/* アバター */}
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                  style={{
                    background: node.origin ? "#fff" : "#0052FF",
                    color: node.origin ? "#0052FF" : "#fff",
                  }}
                >
                  {node.id}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold truncate" style={{ color: node.text }}>
                    {node.label}
                    {node.origin && (
                      <span className="ml-1 text-[9px] font-normal opacity-70">起点</span>
                    )}
                  </p>
                  <p className="text-[10px] truncate" style={{ color: node.text, opacity: 0.65 }}>
                    {node.sub}
                  </p>
                </div>
                {/* ONバッジ */}
                {!node.origin && i < 3 && (
                  <span className="text-[9px] font-bold shrink-0" style={{ color: "#0052FF" }}>
                    +{i === 1 ? 2 : 1} ON
                  </span>
                )}
              </div>

              {/* 矢印 */}
              {i < nodes.length - 1 && (
                <div className="flex justify-center my-0.5">
                  <svg width="16" height="14" viewBox="0 0 16 14" fill="none">
                    <path d="M8 0v10M3 7l5 7 5-7" stroke="#0052FF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              )}
            </div>
          ))}

          {/* ループ完成バナー */}
          <div className="mt-1 rounded-2xl px-3 py-2 text-center"
            style={{ background: "linear-gradient(135deg, #0052FF15, #0052FF30)", border: "1px solid #0052FF40" }}>
            <p className="text-[10px] font-bold" style={{ color: "#0052FF" }}>
              🎉 ループが完成すると全員にボーナス！
            </p>
            <p className="text-[9px] text-muted-foreground mt-0.5">Aさんには N × 10 ON 追加報酬</p>
          </div>
        </div>

        {/* ホームバー */}
        <div className="flex justify-center pb-2">
          <div className="w-20 h-1 rounded-full bg-foreground/20" />
        </div>
      </div>

      {/* サイドボタン */}
      <div className="absolute right-0 top-24 w-[3px] h-8 rounded-l bg-foreground/15" />
      <div className="absolute left-0 top-20 w-[3px] h-6 rounded-r bg-foreground/15" />
      <div className="absolute left-0 top-28 w-[3px] h-6 rounded-r bg-foreground/15" />
    </div>
  )
}
