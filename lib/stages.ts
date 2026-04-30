export type Stage = {
  id: string
  level: number
  name: string
  nameEn: string
  emoji: string
  min: number
  max: number
  accent: string      // Base Blueと共存するアクセントカラー
  bgDark: string      // ステージ背景（暗）
  bgLight: string     // ステージ背景（明）
  description: string
  nextMessage: string // 次のステージへのメッセージ
}

export const STAGES: Stage[] = [
  {
    id: "village",
    level: 1,
    name: "村",
    nameEn: "VILLAGE",
    emoji: "🌱",
    min: 1,
    max: 4,
    accent: "#52b788",
    bgDark: "#1b3a2d",
    bgLight: "#d8f3dc",
    description: "小さな恩送りの芽が育っています",
    nextMessage: "あと少しで 町 に進化！",
  },
  {
    id: "town",
    level: 2,
    name: "町",
    nameEn: "TOWN",
    emoji: "🏘️",
    min: 5,
    max: 9,
    accent: "#f4a261",
    bgDark: "#3d1f0a",
    bgLight: "#fde8cc",
    description: "恩送りが町に広がってきました",
    nextMessage: "あと少しで 地方 に進化！",
  },
  {
    id: "region",
    level: 3,
    name: "地方",
    nameEn: "REGION",
    emoji: "🗾",
    min: 10,
    max: 19,
    accent: "#48cae4",
    bgDark: "#0a2a3d",
    bgLight: "#caf0f8",
    description: "地方全体に恩の波紋が広がっています",
    nextMessage: "あと少しで 日本 に進化！",
  },
  {
    id: "japan",
    level: 4,
    name: "日本",
    nameEn: "JAPAN",
    emoji: "🗼",
    min: 20,
    max: 49,
    accent: "#e63946",
    bgDark: "#3d0a0a",
    bgLight: "#ffe0e0",
    description: "日本中に恩送りが届き始めました",
    nextMessage: "あと少しで 世界 に進化！",
  },
  {
    id: "world",
    level: 5,
    name: "世界",
    nameEn: "WORLD",
    emoji: "🌍",
    min: 50,
    max: 99,
    accent: "#4361ee",
    bgDark: "#0a1a3d",
    bgLight: "#ccd5f8",
    description: "恩送りが世界の海を越えています",
    nextMessage: "あと少しで 宇宙 に進化！",
  },
  {
    id: "universe",
    level: 6,
    name: "宇宙",
    nameEn: "UNIVERSE",
    emoji: "🚀",
    min: 100,
    max: Infinity,
    accent: "#9b5de5",
    bgDark: "#1a0a3d",
    bgLight: "#e8d5fb",
    description: "恩送りが宇宙へと旅立ちました",
    nextMessage: "最高ステージに到達！",
  },
]

export function getStage(chainLength: number): Stage {
  return STAGES.find((s) => chainLength >= s.min && chainLength <= s.max) ?? STAGES[0]
}

export function getProgressToNext(chainLength: number): number {
  const stage = getStage(chainLength)
  if (stage.max === Infinity) return 100
  const range = stage.max - stage.min + 1
  const progress = chainLength - stage.min + 1
  return Math.round((progress / range) * 100)
}
