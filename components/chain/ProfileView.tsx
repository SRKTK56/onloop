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
type ProfileData = {
  profile: Profile | null; balance: number; history: OnTx[]
  originChains: OriginChain[]; nodes: ChainNode[]
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
    <div className="flex" style={{ borderBottom: "3px solid #1a2a3a" }}>
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className="flex-1 font-pixel py-3 transition-colors"
          style={{
            fontSize: "0.72rem",
            color: active === tab.key ? "#0052FF" : "#506070",
            background: active === tab.key ? "#0a1628" : "transparent",
            borderBottom: active === tab.key ? "3px solid #0052FF" : "3px solid transparent",
            marginBottom: "-3px",
          }}
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
      className="font-pixel text-[0.85rem] px-2 py-0.5 shrink-0"
      style={{
        background: confirmed ? "#052a10" : "#2a1a00",
        border: `2px solid ${confirmed ? "#52b788" : "#aa8800"}`,
        color: confirmed ? "#52b788" : "#ffcc00",
      }}
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
        className="pixel-box text-center py-16 space-y-6"
        style={{ background: "#0f1628" }}
      >
        <p className="font-pixel text-[0.82rem]" style={{ color: "#3a6080" }}>
          WALLET NOT CONNECTED
        </p>
        <p className="font-ja text-base" style={{ color: "#90a0b8" }}>
          マイページを見るにはウォレットを接続してください。
        </p>
        <WalletButton />
      </div>
    )
  }

  if (loading || !data) {
    return (
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="pixel-box h-32 animate-pulse"
            style={{ background: "#0f1628" }}
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
      <div className="pixel-box p-6" style={{ background: "#0f1628" }}>
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
              <p className="font-pixel text-[0.85rem]" style={{ color: "#506070" }}>DISPLAY NAME</p>
              <Input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="名前を設定する（任意）"
                className="max-w-xs font-ja"
                style={{
                  background: "#060610",
                  border: "2px solid #1a2a3a",
                  color: "#e0e8ff",
                  borderRadius: 0,
                }}
              />
            </div>
            <p className="font-mono text-xs" style={{ color: "#3a5a7a" }}>{address}</p>
            <button
              onClick={saveProfile}
              disabled={saving}
              className="pixel-btn font-pixel"
              style={{
                background: "#0052FF",
                color: "#fff",
                borderColor: "#000",
                padding: "0.5rem 1rem",
                fontSize: "0.72rem",
                opacity: saving ? 0.6 : 1,
              }}
            >
              {saving ? "保存中..." : "▸ 保存する"}
            </button>
          </div>

          {/* ONトークン残高 */}
          <div
            className="pixel-box p-4 text-right"
            style={{ background: "#060610", borderColor: "#0052FF", boxShadow: "3px 3px 0 #0052FF" }}
          >
            <p className="font-pixel text-[0.85rem] mb-1" style={{ color: "#506070" }}>ON BALANCE</p>
            <p className="font-pixel" style={{ fontSize: "1.8rem", color: "#0052FF", textShadow: "3px 3px 0 #ffffff" }}>
              {data.balance}
            </p>
            <p className="font-pixel text-[0.72rem]" style={{ color: "#3a6080" }}>ON TOKEN</p>
            <div className="mt-3 space-y-1">
              <p className="font-pixel text-[0.82rem]" style={{ color: "#405060" }}>送った恩: {sentNodes.length}</p>
              <p className="font-pixel text-[0.82rem]" style={{ color: "#405060" }}>受けた恩: {receivedNodes.length}</p>
              <p className="font-pixel text-[0.82rem]" style={{ color: "#405060" }}>起点: {data.originChains.length}</p>
            </div>
          </div>
        </div>

        {/* ギバー登録ボタン */}
        <div className="mt-5 pt-5" style={{ borderTop: "2px solid #1a2a3a" }}>
          <Link
            href="/provider/apply"
            className="pixel-btn font-pixel inline-flex items-center gap-2"
            style={{
              background: "#0a0a1a",
              color: "#7ab0ff",
              borderColor: "#0052FF",
              boxShadow: "4px 4px 0 #0052FF",
              padding: "0.75rem 1.5rem",
              fontSize: "0.72rem",
            }}
          >
            ▸ ギバーとして登録する
          </Link>
          <p className="font-ja text-sm mt-2" style={{ color: "#405060" }}>
            スキルや好意を提供してメニューに掲載されます
          </p>
        </div>
      </div>

      {/* 承認待ち */}
      {pendingNodes.length > 0 && (
        <div
          className="pixel-box p-4 space-y-3"
          style={{ background: "#1a1000", borderColor: "#aa8800", boxShadow: "4px 4px 0 #aa8800" }}
        >
          <p className="font-pixel text-[0.9rem]" style={{ color: "#ffcc00" }}>
            ⚡ 承認待ち {pendingNodes.length} 件
          </p>
          {pendingNodes.map((node) => (
            <div
              key={node.id}
              className="flex items-center justify-between p-3"
              style={{ background: "#0a0800", border: "2px solid #554400" }}
            >
              <div>
                <p className="font-ja text-sm font-medium" style={{ color: "#e0d0a0" }}>{node.description}</p>
                <p className="font-mono text-xs mt-0.5" style={{ color: "#806040" }}>
                  送り主：{shortAddr(node.giverWallet)}
                </p>
              </div>
              <Link
                href={`/match/${node.id}`}
                className="pixel-btn font-pixel shrink-0 ml-3"
                style={{
                  background: "#0052FF",
                  color: "#fff",
                  borderColor: "#000",
                  padding: "0.4rem 0.8rem",
                  fontSize: "0.45rem",
                }}
              >
                ▸ 確認する
              </Link>
            </div>
          ))}
        </div>
      )}

      {/* タブ */}
      <div className="pixel-box overflow-hidden" style={{ background: "#0f1628" }}>
        <PixelTabs
          tabs={[
            { key: "chains", label: "チェーン履歴" },
            { key: "origin", label: "起点チェーン" },
            { key: "tokens", label: "ON獲得履歴" },
            { key: "giver", label: "ギバー登録" },
          ]}
          active={activeTab}
          onChange={setActiveTab}
        />

        <div className="p-4 space-y-3">
          {/* チェーン履歴 */}
          {activeTab === "chains" && (
            data.nodes.length === 0 ? (
              <div className="text-center py-10 space-y-4">
                <p className="font-pixel text-[0.72rem]" style={{ color: "#304050" }}>NO CHAIN HISTORY</p>
                <p className="font-ja text-sm" style={{ color: "#506070" }}>まだ恩送りに参加していません。</p>
                <Link href="/menu" className={cn(buttonVariants({ variant: "outline", size: "sm" }), "font-ja")}>
                  メニューから始める
                </Link>
              </div>
            ) : (
              data.nodes.map((node) => (
                <Link
                  key={node.id}
                  href={`/chain/${node.chainId}`}
                  className="flex items-center justify-between p-3 transition-colors"
                  style={{ background: "#060610", border: "2px solid #1a2a3a" }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#0052FF")}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#1a2a3a")}
                >
                  <div className="space-y-1">
                    <p className="font-ja text-sm font-medium" style={{ color: "#c0d0e8" }}>
                      {node.description}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="font-pixel text-[0.82rem]" style={{ color: "#3a5a7a" }}>
                        CHAIN #{node.chainId}
                      </span>
                      <span className="font-pixel text-[0.82rem]" style={{ color: "#3a5a7a" }}>·</span>
                      <span className="font-ja text-xs" style={{ color: "#506070" }}>
                        {node.giverWallet === address ? "🌱 送った" : "🤝 受けた"}
                      </span>
                      <span className="font-pixel text-[0.82rem]" style={{ color: "#3a5a7a" }}>
                        POS.{node.position + 1}
                      </span>
                    </div>
                  </div>
                  <StatusBadge confirmed={node.status === "confirmed"} />
                </Link>
              ))
            )
          )}

          {/* 起点チェーン */}
          {activeTab === "origin" && (
            data.originChains.length === 0 ? (
              <div className="text-center py-10 space-y-4">
                <p className="font-pixel text-[0.72rem]" style={{ color: "#304050" }}>NO ORIGIN CHAINS</p>
                <p className="font-ja text-sm" style={{ color: "#506070" }}>まだ連鎖を起こしていません。</p>
                <Link href="/menu" className={cn(buttonVariants({ variant: "outline", size: "sm" }), "font-ja")}>
                  恩送りを始める
                </Link>
              </div>
            ) : (
              data.originChains.map((chain) => {
                const chainNodeList = data.nodes.filter((n) => n.chainId === chain.id)
                const confirmed = chainNodeList.filter((n) => n.status === "confirmed").length
                return (
                  <Link
                    key={chain.id}
                    href={`/chain/${chain.id}`}
                    className="flex items-center justify-between p-3"
                    style={{ background: "#060a18", border: "2px solid #0a1a4a" }}
                    onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#0052FF")}
                    onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#0a1a4a")}
                  >
                    <div className="space-y-1">
                      <p className="font-pixel text-[0.72rem]" style={{ color: "#7ab0ff" }}>
                        CHAIN #{chain.id}
                      </p>
                      <p className="font-ja text-xs" style={{ color: "#506070" }}>
                        参加者 {chainNodeList.length} 人 · 確認済み {confirmed} 件
                      </p>
                    </div>
                    <span
                      className="font-pixel text-[0.85rem] px-2 py-0.5"
                      style={{ background: "#0a1628", border: "2px solid #0052FF", color: "#0052FF" }}
                    >
                      🌱 起点
                    </span>
                  </Link>
                )
              })
            )
          )}

          {/* ON獲得履歴 */}
          {activeTab === "tokens" && (
            data.history.length === 0 ? (
              <p className="text-center py-10 font-ja text-sm" style={{ color: "#506070" }}>
                まだONトークンを獲得していません。
              </p>
            ) : (
              data.history.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between p-3"
                  style={{ background: "#060610", border: "2px solid #1a2a3a" }}
                >
                  <div className="space-y-0.5">
                    <p className="font-ja text-sm font-medium" style={{ color: "#c0d0e8" }}>
                      {reasonLabel(tx.reason)}
                    </p>
                    <div className="flex gap-3">
                      {tx.chainId && (
                        <p className="font-pixel text-[0.82rem]" style={{ color: "#3a5a7a" }}>
                          CHAIN #{tx.chainId}
                        </p>
                      )}
                      <p className="font-pixel text-[0.82rem]" style={{ color: "#3a5a7a" }}>
                        {new Date(tx.createdAt).toLocaleDateString("ja-JP")}
                      </p>
                    </div>
                  </div>
                  <span
                    className="font-pixel text-[0.9rem] shrink-0"
                    style={{ color: "#0052FF", textShadow: "2px 2px 0 #ffffff" }}
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
                <p className="font-ja text-sm" style={{ color: "#90a0b8" }}>
                  あなたのギバー申請状況
                </p>
                <Link
                  href="/provider/apply"
                  className="pixel-btn font-pixel"
                  style={{
                    background: "#0052FF",
                    color: "#fff",
                    borderColor: "#000",
                    padding: "0.4rem 0.8rem",
                    fontSize: "0.65rem",
                  }}
                >
                  ▸ 新規申請
                </Link>
              </div>

              {providers.length === 0 ? (
                <div className="text-center py-10 space-y-4">
                  <p className="font-pixel text-[0.72rem]" style={{ color: "#304050" }}>NO APPLICATIONS</p>
                  <p className="font-ja text-sm" style={{ color: "#506070" }}>
                    まだギバー申請をしていません。
                  </p>
                </div>
              ) : (
                providers.map((prov) => {
                  const sc: Record<string, string> = {
                    pending: "#aa8800", approved: "#52b788", rejected: "#e63946",
                  }
                  const sl: Record<string, string> = {
                    pending: "審査待ち", approved: "承認済み・掲載中", rejected: "却下",
                  }
                  return (
                    <div
                      key={prov.id}
                      className="p-4 space-y-3"
                      style={{
                        background: "#060610",
                        border: `2px solid ${sc[prov.status] ?? "#1a2a3a"}`,
                      }}
                    >
                      <div className="flex items-start justify-between gap-3 flex-wrap">
                        <p className="font-ja font-bold text-base" style={{ color: "#c0d0e8" }}>
                          {prov.serviceTitle}
                        </p>
                        <span
                          className="font-pixel text-[0.62rem] px-2 py-0.5 shrink-0"
                          style={{
                            background: `${sc[prov.status] ?? "#506070"}22`,
                            border: `2px solid ${sc[prov.status] ?? "#506070"}`,
                            color: sc[prov.status] ?? "#506070",
                          }}
                        >
                          {sl[prov.status] ?? prov.status}
                        </span>
                      </div>
                      <p className="font-ja text-sm line-clamp-2 leading-relaxed" style={{ color: "#607080" }}>
                        {prov.serviceDescription}
                      </p>
                      <p className="font-pixel text-[0.62rem]" style={{ color: "#304050" }}>
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
