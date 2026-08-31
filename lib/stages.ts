import type { IconType } from "@/components/shared/PixelIcon"

export type Stage = {
  id: string
  level: number
  name: string
  nameEn: string
  emoji: string
  pixelIcon: IconType
  min: number
  max: number
  accent: string
  bgDark: string   // 旧ダーク様式の名残。現在は「濃いめの淡色パネル地」。文字色には使わない
  bgLight: string  // より淡い面
  image: string
  description: string
  nextMessage: string
  loopMultiplier: number  // ループボーナスの倍率（基本値 N×5/N×10 に乗算）
}

export const STAGES: Stage[] = [
  {
    id: "village",
    level: 1,
    name: "村",
    nameEn: "VILLAGE",
    emoji: "🌱", pixelIcon: "sprout" as const,
    min: 1,
    max: 4,
    accent: "#55db9c",
    bgDark: "#ddf7ea",
    bgLight: "#d8f3dc",
    image: "/stages/1_village.png",
    description: "小さな恩送りの芽が育っています",
    nextMessage: "あと少しで 街 に進化！",
    loopMultiplier: 1,
  },
  {
    id: "town",
    level: 2,
    name: "街",
    nameEn: "TOWN",
    emoji: "🏘️", pixelIcon: "house" as const,
    min: 5,
    max: 9,
    accent: "#fb4903",
    bgDark: "#ffe3d8",
    bgLight: "#fde8cc",
    image: "/stages/2_town.png",
    description: "恩送りが街に広がってきました",
    nextMessage: "あと少しで 日本 に進化！",
    loopMultiplier: 2,
  },
  {
    id: "japan",
    level: 3,
    name: "日本",
    nameEn: "JAPAN",
    emoji: "🗼", pixelIcon: "torii" as const,
    min: 10,
    max: 19,
    accent: "#ff4d6d",
    bgDark: "#ffe0e6",
    bgLight: "#ffe0e0",
    image: "/stages/3_japan.png",
    description: "日本中に恩送りが届き始めました",
    nextMessage: "あと少しで アジア に進化！",
    loopMultiplier: 3,
  },
  {
    id: "asia",
    level: 4,
    name: "アジア",
    nameEn: "ASIA",
    emoji: "🌏", pixelIcon: "globe_asia" as const,
    min: 20,
    max: 34,
    accent: "#ffd731",
    bgDark: "#fff3cf",
    bgLight: "#fff3cc",
    image: "/stages/4_asia.png",
    description: "アジア全体に恩の輪が広がっています",
    nextMessage: "あと少しで 欧米 に進化！",
    loopMultiplier: 5,
  },
  {
    id: "the-west",
    level: 5,
    name: "欧米",
    nameEn: "THE WEST",
    emoji: "🗽", pixelIcon: "tower" as const,
    min: 35,
    max: 49,
    accent: "#7ee8e8",
    bgDark: "#dbf7f7",
    bgLight: "#caf0f8",
    image: "/stages/5_the-west.png",
    description: "欧米へと恩送りの波が届きました",
    nextMessage: "あと少しで 世界 に進化！",
    loopMultiplier: 7,
  },
  {
    id: "world",
    level: 6,
    name: "世界",
    nameEn: "WORLD",
    emoji: "🌍", pixelIcon: "world_globe" as const,
    min: 50,
    max: 74,
    accent: "#4da2ff",
    bgDark: "#dceeff",
    bgLight: "#ccd5f8",
    image: "/stages/6_world.png",
    description: "恩送りが世界の海を越えています",
    nextMessage: "あと少しで 地球 に進化！",
    loopMultiplier: 10,
  },
  {
    id: "earth",
    level: 7,
    name: "地球",
    nameEn: "EARTH",
    emoji: "🌐", pixelIcon: "earth_grid" as const,
    min: 75,
    max: 99,
    accent: "#0052ff",
    bgDark: "#d6e3ff",
    bgLight: "#caf0f8",
    image: "/stages/7_earth.png",
    description: "地球全体が恩送りで繋がっています",
    nextMessage: "あと少しで 宇宙 に進化！",
    loopMultiplier: 15,
  },
  {
    id: "space",
    level: 8,
    name: "宇宙",
    nameEn: "SPACE",
    emoji: "🚀", pixelIcon: "rocket" as const,
    min: 100,
    max: Infinity,
    accent: "#5c4ade",
    bgDark: "#e9ccff",
    bgLight: "#e8d5fb",
    image: "/stages/8_space.png",
    description: "恩送りが宇宙へと旅立ちました",
    nextMessage: "最高ステージに到達！",
    loopMultiplier: 20,
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
