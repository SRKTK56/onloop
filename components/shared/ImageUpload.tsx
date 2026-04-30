"use client"

import { useRef, useState } from "react"
import { cn } from "@/lib/utils"

type Props = {
  value?: string
  onChange: (url: string) => void
  className?: string
  size?: "sm" | "lg"
  label?: string
}

export function ImageUpload({ value, onChange, className, size = "lg", label = "画像を追加" }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setError(null)
    setUploading(true)
    try {
      const form = new FormData()
      form.append("file", file)
      const res = await fetch("/api/upload", { method: "POST", body: form })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      onChange(data.url)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "アップロード失敗")
    } finally {
      setUploading(false)
    }
  }

  const sizeClass = size === "sm"
    ? "w-16 h-16 rounded-full"
    : "w-24 h-24 rounded-2xl"

  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className={cn(
          sizeClass,
          "border-2 border-dashed border-border bg-muted/50 hover:bg-accent transition-colors overflow-hidden flex items-center justify-center relative cursor-pointer"
        )}
      >
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="uploaded" className="w-full h-full object-cover" />
        ) : (
          <span className="text-2xl text-muted-foreground">
            {uploading ? "⏳" : "📷"}
          </span>
        )}
      </button>
      <span className="text-xs text-muted-foreground">
        {uploading ? "アップロード中..." : error ?? label}
      </span>
      {error && <span className="text-xs text-destructive">{error}</span>}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFile}
      />
    </div>
  )
}
