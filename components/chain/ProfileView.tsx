"use client"

import { useAccount } from "wagmi"
import { useEffect, useState, useCallback } from "react"
import { WalletButton } from "@/components/shared/WalletButton"
import { ImageUpload } from "@/components/shared/ImageUpload"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import Link from "next/link"

type Profile = { walletAddress: string; displayName: string | null; avatarUrl: string | null }
type Provider = {
  id: number; walletAddress: string; serviceTitle: string
  serviceDescription: string; status: string; createdAt: string
  avatarUrl: string | null
}
type ChainNode = {
  id: number; chainId: number; position: number
  giverWallet: string; receiverWallet: string
  description: string; status: string; createdAt: string
}
type OriginChain = { id: number; originWallet: string; createdAt: string }
type OnTx = { id: number; amount: number; reason: string; chainId: number | null; createdAt: string }
type MyChainSummary = {
  id: number
  originWallet: string
  createdAt: string
  myRole: "origin" | "giver" | "receiver"
  totalNodes: number
  confirmedNodes: number
  stage: { level: number; name: string; nameEn: string; emoji: string; accent: string }
}
type ProfileData = {
  profile: Profile | null; balance: number; history: OnTx[]
  originChains: OriginChain[]; nodes: ChainNode[]
  myChains: MyChainSummary[]
}

function shortAddr(addr: string) { return addr.slice(0, 6) + "..." + addr.slice(-4) }
function reasonLabel(reason: string) {
  if (reason.startsWith("chain_hop")) return "連鎖への参加"
  if (reason.startsWith("loop_complete")) return "ループ完成ボーナス"
  return reason
}

// ピクセルスタイルのタブ
function PixelTabs({ tabs, active, onChange }: {
  tabs: { key: string; label: string }[]
  active: string
  onChange: (key: string) => void
}) {
  return (
    <div className="flex" style={{ borderBottom: "1px solid #000000" }}>
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className="flex-1 font-display py-3 transition-colors"
          style={{
            fontSize: "0.72rem",
            color: active === tab.key ? "#000000" : "#4a4a4a",
            background: active === tab.key ? "#ffffff" : "transparent",
            borderBottom: active === tab.key ? "1px solid #0052FF" : "1px solid transparent",
            marginBottom: "-3px"}}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}

// ステータスバッジ
function StatusBadge({ confirmed }: { confirmed: boolean }) {
  return (
    <span
      className="font-display text-[0.85rem] px-2 py-0.5 shrink-0"
      style={{
        background: confirmed ? "#052a10" : "#2a1a00",
        border: `1px solid ${confirmed ? "#55db9c" : "#ffd731"}`,
        color: confirmed ? "#000000" : "#000000", borderRadius: "1600px"}}
    >
      {confirmed ? "完了" : "承認待ち"}
    </span>
  )
}

export function ProfileView() {
  const { address, isConnected } = useAccount()
  const [data, setData] = useState<ProfileData | null>(null)
  const [providers, setProviders] = useState<Provider[]>([])
  const [loading, setLoading] = useState(false)
  const [editName, setEditName] = useState("")
  const [saving, setSaving] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState("")
  const [activeTab, setActiveTab] = useState("chains")

  const load = useCallback(async () => {
    if (!address) return
    setLoading(true)
    try {
      const [profileRes, providersRes] = await Promise.all([
        fetch(`/api/profile?wallet=${address}`),
        fetch(`/api/providers?wallet=${address}`),
      ])
      const json = await profileRes.json()
      const provs = await providersRes.json()
      setData(json)
      setProviders(Array.isArray(provs) ? provs : [])
      setEditName(json.profile?.displayName ?? "")
      setAvatarUrl(json.profile?.avatarUrl ?? "")
    } finally {
      setLoading(false)
    }
  }, [address])

  useEffect(() => { load() }, [load])

  async function saveProfile() {
    if (!address) return
    setSaving(true)
    try {
      await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ walletAddress: address, displayName: editName, avatarUrl }),
      })
      await load()
    } finally {
      setSaving(false)
    }
  }

  if (!isConnected) {
    return (
      <div
        className="slush-card text-center py-16 space-y-6"
        style={{ background: "#ffffff" }}
      >
        <p className="font-display text-[0.82rem]" style={{ color: "#4a4a4a" }}>
          WALLET NOT CONNECTED
        </p>
        <p className="font-ja text-base" style={{ color: "#4a4a4a" }}>
          マイページを見るにはウォレットを接続してください。
        </p>
        <div className="flex justify-center">
          <WalletButton />
        </div>
      </div>
    )
  }

  if (loading || !data) {
    return (
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="slush-card h-32 animate-pulse"
            style={{ background: "#ffffff" }}
          />
        ))}
      </div>
    )
  }

  const sentNodes = data.nodes.filter((n) => n.giverWallet === address)
  const receivedNodes = data.nodes.filter((n) => n.receiverWallet === address)
  const pendingNodes = receivedNodes.filter((n) => n.status === "pending")

  return (
    <div className="space-y-5">

      {/* プロフィールカード */}
      <div className="slush-card p-6" style={{ background: "#ffffff" }}>
        <div className="flex items-start gap-6 flex-wrap">
          {/* アバター */}
          <div className="flex flex-col items-center gap-2">
            <ImageUpload
              value={avatarUrl}
              onChange={(url) => setAvatarUrl(url)}
              size="lg"
              label="アイコン変更"
            />
          </div>

          {/* 名前・アドレス */}
          <div className="flex-1 space-y-3 min-w-48">
            <div className="space-y-1.5">
              <p className="font-display text-[0.85rem]" style={{ color: "#4a4a4a" }}>DISPLAY NAME</p>
              <Input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="名前を設定する（任意）"
                className="max-w-xs font-ja"
                style={{
                  background: "#dceeff",
                  border: "1px solid #000000",
                  color: "#000000",
                  borderRadius: "20px"}}
              />
              {/* 公開範囲の明示。フィードは誰でも見られるため、登録前に必ず伝える */}
              <p className="font-ja text-sm" style={{ opacity: 0.7 }}>
                設定した名前は
                <a href="/loops" className="underline">公開ループフィード</a>
                に表示されます。空欄にするとウォレットアドレスの短縮表示になります。
              </p>
            </div>
            <p className="font-mono text-xs" style={{ color: "#4a4a4a" }}>{address}</p>
            <button
              onClick={saveProfile}
              disabled={saving}
              className="slush-btn font-display"
              style={{
                background: "#000000",
                color: "#fff",
                borderColor: "#000000",
                padding: "0.5rem 1rem",
                fontSize: "0.72rem",
                opacity: saving ? 0.6 : 1, borderRadius: "1600px"}}
            >
              {saving ? "保存中..." : "▸ 保存する"}
            </button>
          </div>

          {/* ONの積み上げ（残高ではなく実績として見せる） */}
          <div
            className="slush-card p-4 text-right"
            style={{ background: "#dceeff", borderColor: "#000000", boxShadow: "none", borderRadius: "20px"}}
          >
            <p className="font-display text-[0.85rem] mb-1" style={{ color: "#4a4a4a" }}>ON RECORD</p>
            <p className="font-display" style={{ fontSize: "1.8rem", color: "#000000", textShadow: "none"}}>
              {data.balance}
            </p>
            <p className="font-display text-[0.72rem]" style={{ color: "#4a4a4a" }}>ON TOKEN</p>
            <div className="mt-3 space-y-1">
              <p className="font-display text-[0.82rem]" style={{ color: "#4a4a4a" }}>送った恩: {sentNodes.length}</p>
              <p className="font-display text-[0.82rem]" style={{ color: "#4a4a4a" }}>受けた恩: {receivedNodes.length}</p>
              <p className="font-display text-[0.82rem]" style={{ color: "#4a4a4a" }}>起点: {data.originChains.length}</p>
            </div>
          </div>
        </div>

        {/* ギバー登録ボタン */}
        <div className="mt-5 pt-5" style={{ borderTop: "1px solid #000000" }}>
          <Link
            href="/provider/apply"
            className="slush-btn font-display inline-flex items-center gap-2"
            style={{
              background: "#ffffff",
              color: "#4a4a4a",
              borderColor: "#000000",
              boxShadow: "none",
              padding: "0.75rem 1.5rem",
              fontSize: "0.72rem", borderRadius: "1600px"}}
          >
            ▸ ギバーとして登録する
          </Link>
          <p className="font-ja text-sm mt-2" style={{ color: "#4a4a4a" }}>
            スキルや好意を提供してメニューに掲載されます
          </p>
        </div>
      </div>

      {/* 承認待ち */}
      {pendingNodes.length > 0 && (
        <div
          className="slush-card p-4 space-y-3"
          style={{ background: "#fff3cf", borderColor: "#000000", boxShadow: "none", borderRadius: "20px"}}
        >
          <p className="font-display text-[0.9rem]" style={{ color: "#000000" }}>
            ⚡ 承認待ち {pendingNodes.length} 件
          </p>
          {pendingNodes.map((node) => (
            <div
              key={node.id}
              className="flex items-center justify-between p-3"
              style={{ background: "#ffffff", border: "1px solid #000000" , borderRadius: "20px"}}
            >
              <div>
                <p className="font-ja text-sm font-medium" style={{ color: "#e0d0a0" }}>{node.description}</p>
                <p className="font-mono text-xs mt-0.5" style={{ color: "#4a4a4a" }}>
                  送り主：{shortAddr(node.giverWallet)}
                </p>
              </div>
              <Link
                href={`/match/${node.id}`}
                className="slush-btn font-display shrink-0 ml-3"
                style={{
                  background: "#000000",
                  color: "#fff",
                  borderColor: "#000000",
                  padding: "0.4rem 0.8rem",
                  fontSize: "0.7rem", borderRadius: "1600px"}}
              >
                ▸ 確認する
              </Link>
            </div>
          ))}
        </div>
      )}

      {/* タブ */}
      <div className="slush-card overflow-hidden" style={{ background: "#ffffff" }}>
        <PixelTabs
          tabs={[
            { key: "chains", label: "参加チェーン" },
            { key: "tokens", label: "ON獲得履歴" },
            { key: "giver",  label: "メニュー登録" },
          ]}
          active={activeTab}
          onChange={setActiveTab}
        />

        <div className="p-4 space-y-3">
          {/* 参加チェーン一覧 */}
          {activeTab === "chains" && (
            !data.myChains || data.myChains.length === 0 ? (
              <div className="text-center py-10 space-y-4">
                <p className="font-display text-[0.72rem]" style={{ color: "#4a4a4a" }}>NO CHAINS YET</p>
                <p className="font-ja text-sm" style={{ color: "#4a4a4a" }}>まだ恩送りのチェーンに参加していません。</p>
                <Link href="/menu" className={cn(buttonVariants({ variant: "outline", size: "sm" }), "font-ja")}>
                  メニューから始める
                </Link>
              </div>
            ) : (
              data.myChains.map((chain) => {
                const roleLabel  = chain.myRole === "origin"   ? "★ 起点者"
                                 : chain.myRole === "giver"    ? "▸ 送り人"
                                 : "✦ 受取人"
                const roleColor  = chain.myRole === "origin"   ? "#0052FF"
                                 : chain.myRole === "giver"    ? "#55db9c"
                                 : "#ffd731"
                const isLoop = chain.confirmedNodes >= 5
                return (
                  <Link
                    key={chain.id}
                    href={`/chain/${chain.id}`}
                    className="flex items-start justify-between gap-3 p-4 transition-colors"
                    style={{ background: "#dceeff", border: `1px solid #000000` , borderRadius: "1600px"}}
                    onMouseEnter={(e) => (e.currentTarget.style.borderColor = chain.stage.accent)}
                    onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#000000")}
                  >
                    {/* 左：チェーン情報 */}
                    <div className="space-y-2 min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-display text-[0.7rem]" style={{ color: "#4a4a4a" }}>
                          CHAIN #{chain.id}
                        </span>
                        {isLoop && (
                          <span className="font-display text-[0.7rem] px-1.5 py-0.5"
                            style={{ background: "#fff3cf", border: "1px solid #000000", color: "#000000" , borderRadius: "1600px"}}>
                            🎉 LOOP
                          </span>
                        )}
                      </div>

                      {/* ステージ + 役割 バッジ行 */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className="font-display text-[0.7rem] px-1.5 py-0.5"
                          style={{
                            background: `${chain.stage.accent}22`,
                            border: `1px solid ${chain.stage.accent}`,
                            color: chain.stage.accent, borderRadius: "1600px"}}
                        >
                          {chain.stage.emoji} {chain.stage.name}
                        </span>
                        <span
                          className="font-display text-[0.7rem] px-1.5 py-0.5"
                          style={{
                            background: `${roleColor}22`,
                            border: `1px solid ${roleColor}`,
                            color: roleColor, borderRadius: "1600px"}}
                        >
                          {roleLabel}
                        </span>
                      </div>

                      {/* ノード進捗バー */}
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 max-w-[120px]" style={{ background: "#e9e9e9" }}>
                          <div
                            className="h-full"
                            style={{
                              width: chain.totalNodes > 0
                                ? `${Math.round((chain.confirmedNodes / Math.max(chain.totalNodes, 1)) * 100)}%`
                                : "0%",
                              background: chain.stage.accent}}
                          />
                        </div>
                        <span className="font-display text-[0.7rem]" style={{ color: "#4a4a4a" }}>
                          {chain.confirmedNodes}/{chain.totalNodes} 完了
                        </span>
                      </div>
                    </div>

                    {/* 右：矢印 */}
                    <span className="font-display text-[0.7rem] shrink-0 mt-1" style={{ color: "#4a4a4a" }}>▸</span>
                  </Link>
                )
              })
            )
          )}

          {/* ON獲得履歴 */}
          {activeTab === "tokens" && (
            data.history.length === 0 ? (
              <p className="text-center py-10 font-ja text-sm" style={{ color: "#4a4a4a" }}>
                まだONが積み上がっていません。
              </p>
            ) : (
              data.history.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between p-3"
                  style={{ background: "#dceeff", border: "1px solid #000000" , borderRadius: "20px"}}
                >
                  <div className="space-y-0.5">
                    <p className="font-ja text-sm font-medium" style={{ color: "#000000" }}>
                      {reasonLabel(tx.reason)}
                    </p>
                    <div className="flex gap-3">
                      {tx.chainId && (
                        <p className="font-display text-[0.82rem]" style={{ color: "#4a4a4a" }}>
                          CHAIN #{tx.chainId}
                        </p>
                      )}
                      <p className="font-display text-[0.82rem]" style={{ color: "#4a4a4a" }}>
                        {new Date(tx.createdAt).toLocaleDateString("ja-JP")}
                      </p>
                    </div>
                  </div>
                  <span
                    className="font-display text-[0.9rem] shrink-0"
                    style={{ color: "#000000", textShadow: "none"}}
                  >
                    +{tx.amount} ON
                  </span>
                </div>
              ))
            )
          )}

          {/* ギバー登録 */}
          {activeTab === "giver" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="font-ja text-sm" style={{ color: "#4a4a4a" }}>
                  あなたのギバー申請状況
                </p>
                <Link
                  href="/provider/apply"
                  className="slush-btn font-display"
                  style={{
                    background: "#000000",
                    color: "#fff",
                    borderColor: "#000000",
                    padding: "0.4rem 0.8rem",
                    fontSize: "0.7rem", borderRadius: "1600px"}}
                >
                  ▸ 新規申請
                </Link>
              </div>

              {providers.length === 0 ? (
                <div className="text-center py-10 space-y-4">
                  <p className="font-display text-[0.72rem]" style={{ color: "#4a4a4a" }}>NO APPLICATIONS</p>
                  <p className="font-ja text-sm" style={{ color: "#4a4a4a" }}>
                    まだギバー申請をしていません。
                  </p>
                </div>
              ) : (
                providers.map((prov) => {
                  const sc: Record<string, string> = {
                    pending: "#ffd731", approved: "#55db9c", rejected: "#ff4d6d",
                  }
                  const sl: Record<string, string> = {
                    pending: "審査待ち", approved: "承認済み・掲載中", rejected: "却下",
                  }
                  return (
                    <div
                      key={prov.id}
                      className="p-4 space-y-3"
                      style={{
                        background: "#dceeff",
                        border: `1px solid ${sc[prov.status] ?? "#000000"}`, borderRadius: "20px"}}
                    >
                      <div className="flex items-start justify-between gap-3 flex-wrap">
                        <p className="font-ja font-bold text-base" style={{ color: "#000000" }}>
                          {prov.serviceTitle}
                        </p>
                        <span
                          className="font-display text-[0.7rem] px-2 py-0.5 shrink-0"
                          style={{
                            background: `${sc[prov.status] ?? "#506070"}22`,
                            border: `1px solid ${sc[prov.status] ?? "#000000"}`,
                            color: sc[prov.status] ?? "#4a4a4a", borderRadius: "1600px"}}
                        >
                          {sl[prov.status] ?? prov.status}
                        </span>
                      </div>
                      <p className="font-ja text-sm line-clamp-2 leading-relaxed" style={{ color: "#4a4a4a" }}>
                        {prov.serviceDescription}
                      </p>
                      <p className="font-display text-[0.7rem]" style={{ color: "#4a4a4a" }}>
                        申請日: {new Date(prov.createdAt).toLocaleDateString("ja-JP")}
                      </p>
                    </div>
                  )
                })
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
