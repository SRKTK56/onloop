export function OnTokenDiagram() {
  const nodes = [
    { id: "A", label: "起点者", sub: "ORIGIN", bg: "#0052FF", text: "#fff", accent: "#0052FF" },
    { id: "B", label: "中継者", sub: "RELAY", bg: "#1b3a2d", text: "#52b788", accent: "#52b788" },
    { id: "C", label: "中継者", sub: "RELAY", bg: "#1b3a2d", text: "#52b788", accent: "#52b788" },
    { id: "D", label: "受取人", sub: "NEW", bg: "#0a2030", text: "#90e0ef", accent: "#90e0ef" },
  ]

  return (
    <div className="space-y-6">

      {/* ── チェーン連鎖図 ── */}
      <div
        className="pixel-box p-6"
        style={{ background: "#0f1628" }}
      >
        <p className="font-pixel text-[0.5rem] mb-6 text-center" style={{ color: "#0052FF" }}>
          CHAIN HOP REWARDS
        </p>

        {/* ノード列 */}
        <div className="flex items-center justify-center flex-wrap gap-0">
          {nodes.map((node, i) => (
            <div key={node.id} className="flex items-center">

              {/* ノード */}
              <div className="flex flex-col items-center gap-1">
                {/* 報酬バッジ（上） */}
                <div
                  className="font-pixel text-[0.42rem] px-2 py-0.5"
                  style={{
                    background: node.id === "A" ? "#0052FF22" : `${node.accent}22`,
                    border: `2px solid ${node.accent}`,
                    color: node.accent,
                    boxShadow: `2px 2px 0 ${node.accent}`,
                    whiteSpace: "nowrap",
                  }}
                >
                  {node.id === "A" ? "+5 ON / hop" : node.id === "D" ? "+1 ON" : "+2 ON"}
                </div>

                {/* キャラクターボックス */}
                <div
                  className="w-14 h-14 flex flex-col items-center justify-center"
                  style={{
                    background: node.bg,
                    border: `3px solid ${node.accent}`,
                    boxShadow: `3px 3px 0 ${node.accent}`,
                  }}
                >
                  <span className="font-pixel text-lg" style={{ color: node.text }}>
                    {node.id}
                  </span>
                  <span className="font-pixel text-[0.32rem]" style={{ color: node.accent, opacity: 0.8 }}>
                    {node.sub}
                  </span>
                </div>

                {/* ラベル（下） */}
                <span className="font-ja text-[0.6rem]" style={{ color: "#607080" }}>
                  {node.label}
                </span>
              </div>

              {/* 矢印 */}
              {i < nodes.length - 1 && (
                <div className="flex flex-col items-center px-1 mb-5">
                  <span className="font-pixel text-[0.6rem]" style={{ color: "#1e3a5f" }}>
                    ▶▶
                  </span>
                </div>
              )}
            </div>
          ))}

          {/* 「続く...」 */}
          <div className="flex items-center mb-5 ml-1">
            <span className="font-pixel text-[0.5rem] pixel-blink" style={{ color: "#1e3a5f" }}>
              ▶▶▶
            </span>
          </div>
        </div>

        {/* ループ矢印（下） */}
        <div className="relative mt-2 mx-4">
          <div
            className="font-pixel text-[0.38rem] text-center py-2 px-4"
            style={{ border: "2px dashed #1e3a5f", color: "#2a4a6a" }}
          >
            ↩ 連鎖が起点 A に戻るとループ完成！
          </div>
        </div>

        {/* 仕組み説明 */}
        <div className="mt-4 grid grid-cols-3 gap-2">
          {[
            { color: "#0052FF", label: "起点者 A", desc: "チェーンが1つ伸びるたびに+5 ON獲得。一番多く溜まる。" },
            { color: "#52b788", label: "中継者 B・C…", desc: "受け取り次の人へ渡したとき+2 ON獲得。" },
            { color: "#90e0ef", label: "新受取人", desc: "恩送りを受け取ったとき+1 ON獲得。" },
          ].map((r) => (
            <div
              key={r.label}
              className="p-2"
              style={{ background: "#0a0a1a", border: `2px solid ${r.color}22` }}
            >
              <p className="font-pixel text-[0.38rem] mb-1" style={{ color: r.color }}>{r.label}</p>
              <p className="font-ja text-[0.6rem] leading-relaxed" style={{ color: "#607080" }}>{r.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── ループ完成ボーナス ── */}
      <div
        className="pixel-box p-6"
        style={{
          background: "#0f1420",
          borderColor: "#aa8800",
          boxShadow: "4px 4px 0 #aa8800",
        }}
      >
        <p className="font-pixel text-[0.5rem] mb-6 text-center" style={{ color: "#ffcc00" }}>
          🎉 LOOP COMPLETE BONUS
        </p>

        {/* ビジュアル: ループ図 (A→B→C→D→A) */}
        <div className="relative px-2 mb-6">

          {/* 上段: ノード列 */}
          <div className="flex items-center justify-between">
            {/* A（起点・左） */}
            <div className="flex flex-col items-center gap-1">
              <div
                className="w-12 h-12 flex items-center justify-center font-pixel text-base"
                style={{
                  background: "#0052FF",
                  border: "3px solid #ffcc00",
                  boxShadow: "3px 3px 0 #ffcc00",
                  color: "#fff",
                }}
              >A</div>
              <span className="font-pixel text-[0.36rem]" style={{ color: "#ffcc00" }}>N×10 ON</span>
              <span className="font-pixel text-[0.32rem]" style={{ color: "#0052FF" }}>ORIGIN</span>
            </div>

            {/* 上の矢印ライン (A→B→C→D) */}
            <div className="flex-1 flex items-center justify-center gap-1 px-1">
              {["B", "C", "D"].map((id, i) => (
                <div key={id} className="flex items-center gap-1">
                  <span className="font-pixel text-[0.5rem]" style={{ color: "#aa8800" }}>▶</span>
                  <div className="flex flex-col items-center gap-0.5">
                    <div
                      className="w-10 h-10 flex items-center justify-center font-pixel text-sm"
                      style={{
                        background: "#1b3a2d",
                        border: "2px solid #52b788",
                        boxShadow: "2px 2px 0 #52b788",
                        color: "#52b788",
                      }}
                    >{id}</div>
                    <span className="font-pixel text-[0.32rem]" style={{ color: "#52b788" }}>N×5 ON</span>
                  </div>
                </div>
              ))}
              {/* 「...」 */}
              <span className="font-pixel text-[0.5rem] pixel-blink ml-1" style={{ color: "#554400" }}>▶</span>
            </div>
          </div>

          {/* ループ矢印（下のU字ライン） */}
          <div
            className="mt-3 mx-6 relative flex items-center justify-center"
            style={{
              height: 32,
              borderLeft: "3px solid #aa8800",
              borderRight: "3px solid #aa8800",
              borderBottom: "3px solid #aa8800",
            }}
          >
            {/* 真ん中のテキスト */}
            <span
              className="font-pixel text-[0.42rem] px-3 py-0.5"
              style={{ background: "#0f1420", color: "#ffcc00", position: "relative", zIndex: 1 }}
            >
              🎉 LOOP COMPLETE!
            </span>
            {/* 左の矢印（Aへの帰還） */}
            <span
              className="font-pixel text-[0.6rem] absolute left-0 -bottom-3"
              style={{ color: "#ffcc00", transform: "translateX(-50%)" }}
            >▲</span>
          </div>
        </div>

        {/* Nの説明 */}
        <div
          className="text-center py-3 font-ja text-sm"
          style={{ border: "2px dashed #554400", color: "#aa8800" }}
        >
          <span className="font-pixel text-[0.55rem]" style={{ color: "#ffcc00" }}>N</span>
          {" "}= ループに参加した人数が多いほど、全員の報酬が大きくなる
        </div>

        {/* 例 */}
        <div className="mt-4 grid grid-cols-3 gap-2">
          {[
            { n: 5, origin: 50, others: 25 },
            { n: 10, origin: 100, others: 50 },
            { n: 20, origin: 200, others: 100 },
          ].map((ex) => (
            <div
              key={ex.n}
              className="p-3 text-center"
              style={{ background: "#0a0a0f", border: "2px solid #554400" }}
            >
              <p className="font-pixel text-[0.42rem] mb-2" style={{ color: "#aa8800" }}>
                N = {ex.n}人
              </p>
              <p className="font-pixel text-[0.38rem]" style={{ color: "#ffcc00" }}>
                起点: {ex.origin} ON
              </p>
              <p className="font-pixel text-[0.38rem]" style={{ color: "#52b788" }}>
                他員: {ex.others} ON
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
