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
      className="slush-card overflow-hidden"
      style={{ background: "#0a0f1a" }}
    >
      {/* ヘッダー */}
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{ background: "#ffffff", borderBottom: "1px solid #000000" }}
      >
        <p className="font-display text-[0.72rem]" style={{ color: "#000000" }}>
          💬 日程・場所の調整
        </p>
        <p className="font-ja text-sm" style={{ color: "#4a4a4a" }}>
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
            <p className="font-display text-[0.7rem] mb-2" style={{ color: "#4a4a4a" }}>
              NO MESSAGES YET
            </p>
            <p className="font-ja text-sm" style={{ color: "#4a4a4a" }}>
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
                <p className="font-display text-[0.7rem]" style={{ color: "#4a4a4a" }}>
                  {senderLabel(msg.senderWallet)}
                </p>
                <div
                  className="max-w-xs px-3 py-2"
                  style={{
                    background: mine ? "#0a1a4a" : "#ffffff",
                    border: `1px solid ${mine ? "#0052FF" : "#000000"}`,
                    boxShadow: "none", borderRadius: "20px"}}
                >
                  <p className="font-ja text-sm leading-relaxed whitespace-pre-wrap" style={{ color: "#000000" }}>
                    {msg.message}
                  </p>
                </div>
                <p className="font-display text-[0.7rem]" style={{ color: "#4a4a4a" }}>
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
          style={{ borderTop: "1px solid #000000" }}
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="日時・場所などを入力..."
            className="flex-1 font-ja text-sm px-3 py-2"
            style={{
              background: "#dceeff",
              border: "1px solid #000000",
              color: "#000000",
              outline: "none",
              borderRadius: "20px"}}
            onFocus={(e) => (e.currentTarget.style.borderColor = "#0052FF")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "#000000")}
          />
          <button
            type="submit"
            disabled={sending || !input.trim()}
            className="slush-btn font-display shrink-0"
            style={{
              background: sending || !input.trim() ? "#cccccc" : "#000000",
              color: sending || !input.trim() ? "#4a4a4a" : "#fff",
              borderColor: sending || !input.trim() ? "#000000" : "#000",
              padding: "0.5rem 1rem",
              fontSize: "0.7rem",
              cursor: sending || !input.trim() ? "not-allowed" : "pointer", borderRadius: "1600px"}}
          >
            送信
          </button>
        </form>
      ) : (
        <div
          className="px-4 py-3 text-center"
          style={{ borderTop: "1px solid #000000" }}
        >
          <p className="font-ja text-sm" style={{ color: "#4a4a4a" }}>
            このチェーンの参加者のみメッセージできます
          </p>
        </div>
      )}
    </div>
  )
}
