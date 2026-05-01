type Grid = (string | null)[][]

function PixelSprite({ grid, scale = 3 }: { grid: Grid; scale?: number }) {
  const rows = grid.length
  const cols = grid[0]?.length ?? 0
  return (
    <svg
      width={cols * scale}
      height={rows * scale}
      style={{ imageRendering: "pixelated", display: "inline-block", verticalAlign: "middle" }}
    >
      {grid.flatMap((row, y) =>
        row.map((color, x) =>
          color ? (
            <rect key={`${x}-${y}`} x={x * scale} y={y * scale} width={scale} height={scale} fill={color} />
          ) : null
        )
      )}
    </svg>
  )
}

// ── ステージアイコン ──

const SPROUT: Grid = [
  [null,null,null,"#40a070",null,null,null,null],
  [null,null,"#52b788","#40a070","#52b788",null,null,null],
  [null,"#52b788","#52b788","#52b788","#52b788","#52b788",null,null],
  [null,null,"#40a070","#52b788","#40a070",null,null,null],
  [null,null,null,"#8b6040",null,null,null,null],
  [null,null,null,"#8b6040",null,null,null,null],
  [null,null,"#8b6040","#8b6040","#8b6040",null,null,null],
  [null,null,null,null,null,null,null,null],
]

const HOUSE: Grid = [
  [null,null,null,"#e63946","#e63946",null,null,null],
  [null,null,"#e63946","#e63946","#e63946","#e63946",null,null],
  [null,"#e63946","#e63946","#e63946","#e63946","#e63946","#e63946",null],
  ["#d4a870","#d4a870","#d4a870","#d4a870","#d4a870","#d4a870","#d4a870","#d4a870"],
  ["#d4a870","#c8d8e8","#d4a870","#8b5030","#8b5030","#d4a870","#c8d8e8","#d4a870"],
  ["#d4a870","#c8d8e8","#d4a870","#8b5030","#8b5030","#d4a870","#c8d8e8","#d4a870"],
  ["#d4a870","#d4a870","#d4a870","#d4a870","#d4a870","#d4a870","#d4a870","#d4a870"],
  [null,null,null,null,null,null,null,null],
]

const TORII: Grid = [
  ["#e63946","#e63946","#e63946","#e63946","#e63946","#e63946","#e63946","#e63946"],
  ["#e63946",null,null,"#e63946","#e63946",null,null,"#e63946"],
  [null,null,"#e63946","#e63946","#e63946","#e63946",null,null],
  [null,null,null,"#e63946","#e63946",null,null,null],
  [null,null,null,"#e63946","#e63946",null,null,null],
  [null,null,null,"#e63946","#e63946",null,null,null],
  [null,"#e63946","#e63946","#e63946","#e63946","#e63946","#e63946",null],
  [null,null,null,"#e63946","#e63946",null,null,null],
]

const GLOBE_ASIA: Grid = [
  [null,"#4361ee","#4361ee","#4361ee","#4361ee","#4361ee","#4361ee",null],
  ["#4361ee","#4361ee","#52b788","#52b788","#4361ee","#4361ee","#4361ee","#4361ee"],
  ["#4361ee","#52b788","#52b788","#52b788","#52b788","#4361ee","#4361ee","#4361ee"],
  ["#4361ee","#52b788","#52b788","#52b788","#52b788","#52b788","#4361ee","#4361ee"],
  ["#4361ee","#4361ee","#52b788","#52b788","#4361ee","#4361ee","#4361ee","#4361ee"],
  ["#4361ee","#4361ee","#4361ee","#4361ee","#4361ee","#4361ee","#4361ee","#4361ee"],
  [null,"#4361ee","#4361ee","#4361ee","#4361ee","#4361ee","#4361ee",null],
  [null,null,null,null,null,null,null,null],
]

// 欧米 → エッフェル塔風タワー
const TOWER: Grid = [
  [null,null,null,"#c8d0a0","#c8d0a0",null,null,null],
  [null,null,"#c8d0a0","#c8d0a0","#c8d0a0","#c8d0a0",null,null],
  [null,"#c8d0a0",null,"#c8d0a0","#c8d0a0",null,"#c8d0a0",null],
  ["#c8d0a0",null,null,"#c8d0a0","#c8d0a0",null,null,"#c8d0a0"],
  [null,null,"#c8d0a0","#c8d0a0","#c8d0a0","#c8d0a0",null,null],
  [null,null,null,"#c8d0a0","#c8d0a0",null,null,null],
  [null,null,null,"#c8d0a0","#c8d0a0",null,null,null],
  [null,"#c8d0a0","#c8d0a0","#c8d0a0","#c8d0a0","#c8d0a0","#c8d0a0",null],
]

const WORLD_GLOBE: Grid = [
  [null,"#4361ee","#4361ee","#4361ee","#4361ee","#4361ee","#4361ee",null],
  ["#4361ee","#4361ee","#52b788","#4361ee","#52b788","#4361ee","#4361ee","#4361ee"],
  ["#4361ee","#52b788","#52b788","#52b788","#52b788","#52b788","#4361ee","#4361ee"],
  ["#4361ee","#52b788","#4361ee","#4361ee","#4361ee","#52b788","#4361ee","#4361ee"],
  ["#4361ee","#4361ee","#52b788","#4361ee","#4361ee","#4361ee","#4361ee","#4361ee"],
  ["#4361ee","#4361ee","#4361ee","#52b788","#4361ee","#4361ee","#4361ee","#4361ee"],
  [null,"#4361ee","#4361ee","#4361ee","#4361ee","#4361ee","#4361ee",null],
  [null,null,null,null,null,null,null,null],
]

const EARTH_GRID: Grid = [
  [null,"#48cae4","#48cae4","#48cae4","#48cae4","#48cae4","#48cae4",null],
  ["#48cae4","#48cae4","#ffffff","#48cae4","#ffffff","#48cae4","#48cae4","#48cae4"],
  ["#48cae4","#ffffff","#48cae4","#ffffff","#48cae4","#ffffff","#48cae4","#48cae4"],
  ["#48cae4","#48cae4","#ffffff","#48cae4","#ffffff","#48cae4","#48cae4","#48cae4"],
  ["#48cae4","#ffffff","#48cae4","#ffffff","#48cae4","#ffffff","#48cae4","#48cae4"],
  ["#48cae4","#48cae4","#ffffff","#48cae4","#ffffff","#48cae4","#48cae4","#48cae4"],
  [null,"#48cae4","#48cae4","#48cae4","#48cae4","#48cae4","#48cae4",null],
  [null,null,null,null,null,null,null,null],
]

const ROCKET: Grid = [
  [null,null,null,"#e0e0e0","#e0e0e0",null,null,null],
  [null,null,"#e0e0e0","#0052FF","#0052FF","#e0e0e0",null,null],
  [null,"#e0e0e0","#0052FF","#0052FF","#0052FF","#0052FF","#e0e0e0",null],
  [null,"#e0e0e0","#0052FF","#e8e8e8","#e8e8e8","#0052FF","#e0e0e0",null],
  [null,null,"#e0e0e0","#0052FF","#0052FF","#e0e0e0",null,null],
  ["#ff6600",null,"#e0e0e0","#ff9900","#ff9900","#e0e0e0",null,"#ff6600"],
  ["#ff4400","#ff8800",null,null,null,null,"#ff8800","#ff4400"],
  [null,null,null,null,null,null,null,null],
]

// ── UIアイコン ──

const GIFT: Grid = [
  [null,"#ffcc00","#ffcc00","#ffcc00","#ffcc00","#ffcc00","#ffcc00",null],
  ["#ffcc00","#ffcc00","#ffcc00","#ffcc00","#ffcc00","#ffcc00","#ffcc00","#ffcc00"],
  ["#e63946","#e63946","#e63946","#e63946","#e63946","#e63946","#e63946","#e63946"],
  ["#e63946","#e63946","#ffcc00","#e63946","#e63946","#ffcc00","#e63946","#e63946"],
  ["#e63946","#e63946","#ffcc00","#e63946","#e63946","#ffcc00","#e63946","#e63946"],
  ["#e63946","#e63946","#ffcc00","#e63946","#e63946","#ffcc00","#e63946","#e63946"],
  ["#e63946","#e63946","#e63946","#e63946","#e63946","#e63946","#e63946","#e63946"],
  [null,null,null,null,null,null,null,null],
]

const CHAIN_LINK: Grid = [
  [null,"#a0a8b8","#a0a8b8","#a0a8b8",null,null,null,null],
  ["#a0a8b8","#606878",null,"#606878","#a0a8b8",null,null,null],
  ["#a0a8b8","#606878",null,"#606878","#a0a8b8","#a0a8b8","#a0a8b8",null],
  ["#a0a8b8","#606878",null,null,null,"#606878","#a0a8b8","#a0a8b8"],
  [null,"#a0a8b8","#a0a8b8",null,"#a0a8b8","#606878",null,"#a0a8b8"],
  [null,null,null,"#a0a8b8","#a0a8b8","#606878",null,"#a0a8b8"],
  [null,null,null,null,"#a0a8b8","#a0a8b8","#a0a8b8",null],
  [null,null,null,null,null,null,null,null],
]

const PARTY: Grid = [
  ["#ffcc00",null,"#e63946",null,"#52b788",null,null,null],
  [null,"#ffcc00",null,"#e63946",null,"#52b788",null,null],
  [null,null,"#9b5de5",null,null,null,"#e63946",null],
  ["#e63946",null,null,"#ffcc00",null,null,null,null],
  [null,null,null,null,"#52b788",null,null,null],
  [null,"#9b5de5",null,null,null,"#9b5de5",null,null],
  [null,null,"#9b5de5",null,"#9b5de5",null,null,null],
  [null,null,null,"#9b5de5",null,null,null,null],
]

const HANDSHAKE: Grid = [
  [null,null,"#f5c19a","#f5c19a","#f5c19a",null,null,null],
  ["#f5c19a","#f5c19a","#f5c19a","#d4905a","#f5c19a","#f5c19a","#f5c19a",null],
  ["#f5c19a","#d4905a","#f5c19a","#f5c19a","#f5c19a","#f5c19a","#f5c19a","#f5c19a"],
  [null,"#f5c19a","#f5c19a","#f5c19a","#f5c19a","#f5c19a","#d4905a",null],
  [null,null,"#f5c19a","#f5c19a","#f5c19a","#f5c19a",null,null],
  [null,null,null,"#f5c19a","#f5c19a",null,null,null],
  [null,null,null,null,null,null,null,null],
  [null,null,null,null,null,null,null,null],
]

const STAR: Grid = [
  [null,null,null,"#ffcc00","#ffcc00",null,null,null],
  [null,null,null,"#ffcc00","#ffcc00",null,null,null],
  ["#ffcc00","#ffcc00","#ffcc00","#ffcc00","#ffcc00","#ffcc00","#ffcc00","#ffcc00"],
  [null,"#ffcc00","#ffcc00","#ffcc00","#ffcc00","#ffcc00","#ffcc00",null],
  [null,null,"#ffcc00","#ffcc00","#ffcc00","#ffcc00",null,null],
  [null,"#ffcc00",null,"#ffcc00","#ffcc00",null,"#ffcc00",null],
  ["#ffcc00",null,null,"#ffcc00","#ffcc00",null,null,"#ffcc00"],
  [null,null,null,null,null,null,null,null],
]

export type IconType =
  | "sprout" | "house" | "torii" | "globe_asia" | "tower"
  | "world_globe" | "earth_grid" | "rocket"
  | "gift" | "chain_link" | "party" | "handshake" | "star"

const ICON_MAP: Record<IconType, Grid> = {
  sprout:      SPROUT,
  house:       HOUSE,
  torii:       TORII,
  globe_asia:  GLOBE_ASIA,
  tower:       TOWER,
  world_globe: WORLD_GLOBE,
  earth_grid:  EARTH_GRID,
  rocket:      ROCKET,
  gift:        GIFT,
  chain_link:  CHAIN_LINK,
  party:       PARTY,
  handshake:   HANDSHAKE,
  star:        STAR,
}

type Props = {
  type: IconType
  scale?: number
  className?: string
}

export function PixelIcon({ type, scale = 3, className }: Props) {
  return (
    <span className={className} style={{ display: "inline-flex", alignItems: "center" }}>
      <PixelSprite grid={ICON_MAP[type]} scale={scale} />
    </span>
  )
}
