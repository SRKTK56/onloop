"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useAccount } from "wagmi"

type Message = {
  id: number
  nodeId: number
  senderWallet: string
  message: string
  createdAt: string
}

type Props = {
  nodeId: number
  giverWallet: string
  receiverWallet: string
  giverName?: string | null
  receiverName?: string | null
}

function shortAddr(addr: string) {
  return addr.slice(0, 6) + "..." + addr.slice(-4)
}

export function MessageThread({ nodeId, giverWallet, receiverWallet, giverName, receiverName }: Props) {
  const { address } = useAccount()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [sending, setSending] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  const isParticipant = address && (
    address.toLowerCase() === giverWallet.toLowerCase() ||
    address.toLowerCase() === receiverWallet.toLowerCase()
  )

  const fetchMessages = useCallback(async () => {
    const res = await fetch(`/api/chains/${nodeId}/messages`)
    if (res.ok) {
      const data = await res.json()
      setMessages(data)
    }
  }, [nodeId])

  useEffect(() => {
    fetchMessages()
    // 10秒ごとにポーリング
    const timer = setInterval(fetchMessages, 10000)
    return () => clearInterval(timer)
  }, [fetchMessages])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  async function handleSend(e: React.FormEvent) {
    e.preventDefault()
    if (!address || !input.trim()) return
    setSending(true)
    try {
      await fetch(`/api/chains/${nodeId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ senderWallet: address, message: input.trim() }),
      })
      setInput("")
      await fetchMessages()
    } finally {
      setSending(false)
    }
  }

  function senderLabel(wallet: string) {
    if (wallet.toLowerCase() === giverWallet.toLowerCase()) {
      return giverName ?? shortAddr(wallet) + "（ギバー）"
    }
    return receiverName ?? shortAddr(wallet) + "（依頼者）"
  }

  function isMe(wallet: string) {
    return address?.toLowerCase() === wallet.toLowerCase()
  }

  return (
    <div
      className="pixel-box overflow-hidden"
      style={{ background: "#0a0f1a" }}
    >
      {/* ヘッダー */}
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{ background: "#060a14", borderBottom: "2px solid #1a2a3a" }}
      >
        <p className="font-pixel text-[0.72rem]" style={{ color: "#0052FF" }}>
          💬 日程・場所の調整
        </p>
        <p className="font-ja text-xs" style={{ color: "#3a5a7a" }}>
          ギバーと依頼者のみ参加できます
        </p>
      </div>

      {/* メッセージ一覧 */}
      <div
        className="px-4 py-4 space-y-3 overflow-y-auto"
        style={{ minHeight: 200, maxHeight: 360 }}
      >
        {messages.length === 0 ? (
          <div className="text-center py-8">
            <p className="font-pixel text-[0.65rem] mb-2" style={{ color: "#2a3a4a" }}>
              NO MESSAGES YET
            </p>
            <p className="font-ja text-sm" style={{ color: "#3a5060" }}>
              日時・場所などを相談しましょう
            </p>
          </div>
        ) : (
          messages.map((msg) => {
            const mine = isMe(msg.senderWallet)
            return (
              <div
                key={msg.id}
                className={`flex flex-col gap-1 ${mine ? "items-end" : "items-start"}`}
              >
                <p className="font-pixel text-[0.55rem]" style={{ color: "#3a5a7a" }}>
                  {senderLabel(msg.senderWallet)}
                </p>
                <div
                  className="max-w-xs px-3 py-2"
                  style={{
                    background: mine ? "#0a1a4a" : "#0f1628",
                    border: `2px solid ${mine ? "#0052FF" : "#1a2a3a"}`,
                    boxShadow: mine ? "3px 3px 0 #0052FF" : "3px 3px 0 #1a2a3a",
                  }}
                >
                  <p className="font-ja text-sm leading-relaxed whitespace-pre-wrap" style={{ color: "#c0d0e8" }}>
                    {msg.message}
                  </p>
                </div>
                <p className="font-pixel text-[0.5rem]" style={{ color: "#2a3a4a" }}>
                  {new Date(msg.createdAt).toLocaleString("ja-JP", {
                    month: "numeric", day: "numeric",
                    hour: "2-digit", minute: "2-digit",
                  })}
                </p>
              </div>
            )
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* 入力欄 */}
      {isParticipant ? (
        <form
          onSubmit={handleSend}
          className="flex gap-2 px-4 py-3"
          style={{ borderTop: "2px solid #1a2a3a" }}
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="日時・場所などを入力..."
            className="flex-1 font-ja text-sm px-3 py-2"
            style={{
              background: "#060610",
              border: "2px solid #1a2a3a",
              color: "#e0e8ff",
              outline: "none",
              borderRadius: 0,
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "#0052FF")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "#1a2a3a")}
          />
          <button
            type="submit"
            disabled={sending || !input.trim()}
            className="pixel-btn font-pixel shrink-0"
            style={{
              background: sending || !input.trim() ? "#1a2a3a" : "#0052FF",
              color: sending || !input.trim() ? "#3a5a7a" : "#fff",
              borderColor: sending || !input.trim() ? "#1a2a3a" : "#000",
              padding: "0.5rem 1rem",
              fontSize: "0.65rem",
              cursor: sending || !input.trim() ? "not-allowed" : "pointer",
            }}
          >
            送信
          </button>
        </form>
      ) : (
        <div
          className="px-4 py-3 text-center"
          style={{ borderTop: "2px solid #1a2a3a" }}
        >
          <p className="font-ja text-xs" style={{ color: "#2a3a4a" }}>
            このチェーンの参加者のみメッセージできます
          </p>
        </div>
      )}
    </div>
  )
}
