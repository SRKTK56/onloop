/**
 * ONLOOP NFT Collection — 1,000体 一括生成スクリプト
 * 出力: public/nft-full/images/0001.png〜1000.png
 *       public/nft-full/metadata/0001.json〜1000.json
 * 実行: node scripts/generate-nft-full.mjs
 */
import sharp from "sharp"
import { writeFileSync, mkdirSync } from "fs"
import { join, dirname } from "path"
import { fileURLToPath } from "url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const IMG_DIR  = join(__dirname, "../public/nft-full/images")
const META_DIR = join(__dirname, "../public/nft-full/metadata")
mkdirSync(IMG_DIR,  { recursive: true })
mkdirSync(META_DIR, { recursive: true })

// ── レイアウト ─────────────────────────────────────────────
const SC = 16, SZ = 256
const CW = 8*SC, CH = 12*SC
const CX = (SZ-CW)/2, CY = (SZ-CH)/2

function rects(grid, ox, oy, sc=SC) {
  return grid.flatMap((row,y) =>
    row.map((c,x) => c
      ? `<rect x="${ox+x*sc}" y="${oy+y*sc}" width="${sc}" height="${sc}" fill="${c}"/>`
      : "")
  ).join("")
}

// ── パレット ───────────────────────────────────────────────
const sk="#f5c19a", ey="#1a1a1a", mo="#c04040", bk="#0a0a0a", wh="#f0f0f0"

// ── キャラクター 10体 ──────────────────────────────────────
const CHARS = {
  hero:[
    [null,"#3d2000","#3d2000","#3d2000","#3d2000",null,null,null],
    ["#3d2000","#5d3010","#5d3010","#5d3010","#5d3010","#3d2000",null,null],
    [null,sk,sk,sk,sk,sk,null,null],[null,sk,ey,sk,sk,ey,sk,null],[null,sk,sk,mo,mo,sk,sk,null],
    [null,"#0052FF","#0052FF","#0052FF","#0052FF","#0052FF","#0052FF",null],
    ["#0052FF","#0052FF","#0052FF","#0052FF","#0052FF","#0052FF","#0052FF","#0052FF"],
    ["#0052FF","#0052FF","#003db5","#0052FF","#0052FF","#003db5","#0052FF","#0052FF"],
    [null,"#003db5","#003db5","#003db5","#003db5","#003db5","#003db5",null],
    [null,"#1a1a4a","#1a1a4a",null,null,"#1a1a4a","#1a1a4a",null],
    [null,"#1a1a4a","#1a1a4a",null,null,"#1a1a4a","#1a1a4a",null],[null,bk,bk,null,null,bk,bk,null],
  ],
  warrior:[
    [null,"#b45309","#b45309","#b45309","#b45309","#b45309",null,null],
    ["#b45309","#b45309",null,null,null,"#b45309","#b45309",null],
    [null,sk,sk,sk,sk,sk,sk,null],[null,sk,ey,sk,sk,ey,sk,null],[null,sk,sk,mo,mo,sk,sk,null],
    [null,"#e63946","#e63946","#e63946","#e63946","#e63946","#e63946",null],
    ["#e63946","#e63946","#e63946","#e63946","#e63946","#e63946","#e63946","#e63946"],
    ["#c0392b","#e63946","#c0392b","#e63946","#e63946","#c0392b","#e63946","#c0392b"],
    [null,"#c0392b","#c0392b","#c0392b","#c0392b","#c0392b","#c0392b",null],
    [null,"#4a1010","#4a1010",null,null,"#4a1010","#4a1010",null],
    [null,"#4a1010","#4a1010",null,null,"#4a1010","#4a1010",null],[null,bk,bk,null,null,bk,bk,null],
  ],
  mage:[
    [null,null,"#6a0dad","#6a0dad","#6a0dad",null,null,null],
    [null,"#8b5cf6","#8b5cf6","#8b5cf6","#8b5cf6","#8b5cf6",null,null],
    [null,sk,sk,sk,sk,sk,sk,null],[null,sk,ey,sk,sk,ey,sk,null],[null,sk,sk,mo,mo,sk,sk,null],
    [null,"#6a0dad","#6a0dad","#6a0dad","#6a0dad","#6a0dad","#6a0dad",null],
    ["#6a0dad","#6a0dad","#9333ea","#6a0dad","#6a0dad","#9333ea","#6a0dad","#6a0dad"],
    ["#6a0dad","#9333ea","#9333ea","#9333ea","#9333ea","#9333ea","#9333ea","#6a0dad"],
    [null,"#9333ea","#9333ea","#9333ea","#9333ea","#9333ea","#9333ea",null],
    [null,"#4a0080","#4a0080",null,null,"#4a0080","#4a0080",null],
    [null,"#4a0080","#4a0080",null,null,"#4a0080","#4a0080",null],[null,bk,bk,null,null,bk,bk,null],
  ],
  villager:[
    [null,null,"#5d3010","#5d3010","#5d3010",null,null,null],
    [null,"#5d3010","#5d3010","#5d3010","#5d3010","#5d3010",null,null],
    [null,sk,sk,sk,sk,sk,sk,null],[null,sk,ey,sk,sk,ey,sk,null],[null,sk,sk,mo,mo,sk,sk,null],
    [null,"#2d6a4f","#2d6a4f","#2d6a4f","#2d6a4f","#2d6a4f","#2d6a4f",null],
    ["#2d6a4f","#2d6a4f","#52b788","#2d6a4f","#2d6a4f","#52b788","#2d6a4f","#2d6a4f"],
    ["#2d6a4f","#52b788","#52b788","#52b788","#52b788","#52b788","#52b788","#2d6a4f"],
    [null,"#52b788","#52b788","#52b788","#52b788","#52b788","#52b788",null],
    [null,"#1b4332","#1b4332",null,null,"#1b4332","#1b4332",null],
    [null,"#1b4332","#1b4332",null,null,"#1b4332","#1b4332",null],[null,bk,bk,null,null,bk,bk,null],
  ],
  archer:[
    [null,null,"#3a5c10","#3a5c10","#3a5c10",null,null,null],
    [null,"#4a7c18","#4a7c18","#4a7c18","#4a7c18","#4a7c18","#4a7c18",null],
    [null,sk,sk,sk,sk,sk,sk,null],[null,sk,ey,sk,sk,ey,sk,null],[null,sk,sk,mo,mo,sk,sk,null],
    [null,"#4a7c18","#84cc16","#4a7c18","#4a7c18","#84cc16","#4a7c18",null],
    ["#4a7c18","#84cc16","#84cc16","#84cc16","#84cc16","#84cc16","#84cc16","#4a7c18"],
    ["#4a7c18","#84cc16","#4a7c18","#84cc16","#84cc16","#4a7c18","#84cc16","#4a7c18"],
    [null,"#84cc16","#84cc16","#84cc16","#84cc16","#84cc16","#84cc16",null],
    [null,"#3a5c10","#3a5c10",null,null,"#3a5c10","#3a5c10",null],
    [null,"#3a5c10","#3a5c10",null,null,"#3a5c10","#3a5c10",null],[null,bk,bk,null,null,bk,bk,null],
  ],
  priest:[
    [null,null,"#b8860b","#b8860b","#b8860b",null,null,null],
    [null,"#f5c542","#f5c542","#f5c542","#f5c542","#f5c542",null,null],
    [null,sk,sk,sk,sk,sk,sk,null],[null,sk,ey,sk,sk,ey,sk,null],[null,sk,sk,mo,mo,sk,sk,null],
    [null,wh,"#f5c542",wh,wh,"#f5c542",wh,null],[wh,wh,"#f5c542",wh,wh,"#f5c542",wh,wh],
    [wh,"#f5c542","#f5c542","#f5c542","#f5c542","#f5c542","#f5c542",wh],
    [null,"#f5c542","#f5c542","#f5c542","#f5c542","#f5c542","#f5c542",null],
    [null,wh,wh,null,null,wh,wh,null],[null,wh,wh,null,null,wh,wh,null],[null,bk,bk,null,null,bk,bk,null],
  ],
  ninja:[
    [null,"#1e293b","#1e293b","#1e293b","#1e293b","#1e293b",null,null],
    [null,"#334155","#334155","#334155","#334155","#334155","#334155",null],
    [null,"#334155","#334155","#334155","#334155","#334155","#334155",null],
    [null,"#334155","#ff4444","#334155","#334155","#ff4444","#334155",null],
    [null,"#334155","#334155","#334155","#334155","#334155","#334155",null],
    [null,"#475569","#64748b","#475569","#475569","#64748b","#475569",null],
    ["#475569","#475569","#64748b","#475569","#475569","#64748b","#475569","#475569"],
    ["#475569","#64748b","#64748b","#64748b","#64748b","#64748b","#64748b","#475569"],
    [null,"#64748b","#64748b","#64748b","#64748b","#64748b","#64748b",null],
    [null,"#1e293b","#1e293b",null,null,"#1e293b","#1e293b",null],
    [null,"#1e293b","#1e293b",null,null,"#1e293b","#1e293b",null],[null,bk,bk,null,null,bk,bk,null],
  ],
  knight:[
    [null,"#64748b","#94a3b8","#94a3b8","#94a3b8","#64748b",null,null],
    ["#64748b","#94a3b8","#94a3b8","#94a3b8","#94a3b8","#94a3b8","#64748b",null],
    [null,"#94a3b8","#94a3b8","#94a3b8","#94a3b8","#94a3b8","#94a3b8",null],
    [null,"#64748b",ey,"#94a3b8","#94a3b8",ey,"#64748b",null],
    [null,"#94a3b8","#94a3b8","#94a3b8","#94a3b8","#94a3b8","#94a3b8",null],
    [null,"#64748b","#94a3b8","#cbd5e1","#cbd5e1","#94a3b8","#64748b",null],
    ["#64748b","#94a3b8","#64748b","#cbd5e1","#cbd5e1","#64748b","#94a3b8","#64748b"],
    ["#64748b","#cbd5e1","#cbd5e1","#cbd5e1","#cbd5e1","#cbd5e1","#cbd5e1","#64748b"],
    [null,"#94a3b8","#64748b","#94a3b8","#94a3b8","#64748b","#94a3b8",null],
    [null,"#475569","#475569",null,null,"#475569","#475569",null],
    [null,"#475569","#475569",null,null,"#475569","#475569",null],[null,bk,bk,null,null,bk,bk,null],
  ],
  sage:[
    [null,null,"#0d7a6e","#0d7a6e","#0d7a6e",null,null,null],
    [null,"#0d7a6e","#14b8a6","#14b8a6","#14b8a6","#0d7a6e",null,null],
    [null,sk,sk,sk,sk,sk,sk,null],[null,sk,ey,sk,sk,ey,sk,null],[null,sk,sk,mo,mo,sk,sk,null],
    [null,"#0d7a6e","#14b8a6","#14b8a6","#14b8a6","#14b8a6","#0d7a6e",null],
    ["#0d7a6e","#14b8a6","#2dd4bf","#14b8a6","#14b8a6","#2dd4bf","#14b8a6","#0d7a6e"],
    ["#0d7a6e","#2dd4bf","#2dd4bf","#2dd4bf","#2dd4bf","#2dd4bf","#2dd4bf","#0d7a6e"],
    [null,"#2dd4bf","#14b8a6","#2dd4bf","#2dd4bf","#14b8a6","#2dd4bf",null],
    [null,"#0d7a6e","#0d7a6e",null,null,"#0d7a6e","#0d7a6e",null],
    [null,"#0d7a6e","#0d7a6e",null,null,"#0d7a6e","#0d7a6e",null],[null,bk,bk,null,null,bk,bk,null],
  ],
  merchant:[
    [null,"#c2410c","#c2410c","#c2410c","#c2410c","#c2410c",null,null],
    ["#c2410c","#f97316","#f97316","#f97316","#f97316","#f97316","#c2410c",null],
    [null,sk,sk,sk,sk,sk,sk,null],[null,sk,ey,sk,sk,ey,sk,null],[null,sk,sk,mo,mo,sk,sk,null],
    [null,"#f97316","#f97316","#f97316","#f97316","#f97316","#f97316",null],
    ["#f97316","#f97316","#fb923c","#f97316","#f97316","#fb923c","#f97316","#f97316"],
    ["#f97316","#fb923c","#fb923c","#fb923c","#fb923c","#fb923c","#fb923c","#f97316"],
    [null,"#fb923c","#fb923c","#fb923c","#fb923c","#fb923c","#fb923c",null],
    [null,"#c2410c","#c2410c",null,null,"#c2410c","#c2410c",null],
    [null,"#c2410c","#c2410c",null,null,"#c2410c","#c2410c",null],[null,bk,bk,null,null,bk,bk,null],
  ],
}

// ── バリアント ─────────────────────────────────────────────
const CHAR_PALETTE = {
  hero:     {p:["#0052FF"],          s:["#003db5"],          t:["#1a1a4a"]},
  warrior:  {p:["#e63946"],          s:["#c0392b"],          t:["#4a1010"]},
  mage:     {p:["#9333ea","#8b5cf6"],s:["#6a0dad"],          t:["#4a0080"]},
  villager: {p:["#52b788"],          s:["#2d6a4f"],          t:["#1b4332"]},
  archer:   {p:["#84cc16"],          s:["#4a7c18"],          t:["#3a5c10"]},
  priest:   {p:["#f0f0f0"],          s:[],                   t:[]},
  ninja:    {p:["#64748b"],          s:["#475569","#334155"],t:["#1e293b"]},
  knight:   {p:["#94a3b8","#cbd5e1"],s:["#64748b"],          t:["#475569"]},
  sage:     {p:["#2dd4bf","#14b8a6"],s:["#0d7a6e"],          t:[]},
  merchant: {p:["#fb923c"],          s:["#f97316"],          t:["#c2410c"]},
}
const VARIANTS = [
  {name:"Standard", p:null,      s:null,      t:null},
  {name:"Emerald",  p:"#4ade80", s:"#16a34a", t:"#052e16"},
  {name:"Shadow",   p:"#9ca3af", s:"#374151", t:"#111827"},
  {name:"Crimson",  p:"#f87171", s:"#b91c1c", t:"#450a0a"},
  {name:"Gold",     p:"#fcd34d", s:"#b45309", t:"#78350f"},
  {name:"Amethyst", p:"#c4b5fd", s:"#7c3aed", t:"#2e1065"},
]
function applyVariant(grid, charKey, vi) {
  if (vi===0) return grid
  const pal=CHAR_PALETTE[charKey], v=VARIANTS[vi], map={}
  if(v.p) pal.p.forEach(c=>{map[c]=v.p})
  if(v.s) pal.s.forEach(c=>{map[c]=v.s})
  if(v.t) pal.t.forEach(c=>{map[c]=v.t})
  return grid.map(row=>row.map(c=>map[c]??c))
}

// ── 帽子 ──────────────────────────────────────────────────
const HATS = {
  none:     null,
  straw:    {extraRows:0,grid:[["#e8c050","#e8c050","#e8c050","#e8c050","#e8c050","#e8c050","#e8c050","#e8c050"],[null,"#c8900a","#c8900a","#c8900a","#c8900a","#c8900a","#c8900a",null]]},
  beanie:   {extraRows:0,grid:[[null,"#cc3344","#aa2233","#cc3344","#aa2233","#cc3344","#aa2233",null],[null,"#aa2233","#cc3344","#aa2233","#cc3344","#aa2233","#cc3344",null]]},
  kabuto:   {extraRows:1,grid:[[null,null,null,"#909090","#909090",null,null,null],[null,"#707080","#909090","#a0a0b0","#a0a0b0","#909090","#707080",null],[null,"#606070","#808090","#606070","#606070","#808090","#606070",null]]},
  tophat:   {extraRows:2,grid:[[null,null,"#2a2a2a","#2a2a2a","#2a2a2a","#2a2a2a",null,null],[null,null,"#2a2a2a","#2a2a2a","#2a2a2a","#2a2a2a",null,null],[null,null,"#333333","#2a2a2a","#2a2a2a","#333333",null,null],["#1a1a1a","#1a1a1a","#1a1a1a","#1a1a1a","#1a1a1a","#1a1a1a","#1a1a1a","#1a1a1a"]]},
  explorer: {extraRows:0,grid:[["#b87040","#b87040","#b87040","#b87040","#b87040","#b87040","#b87040","#b87040"],[null,"#8B5E3C","#b87040","#b87040","#b87040","#b87040","#8B5E3C",null]]},
  crown:    {extraRows:1,grid:[[null,"#FFD700",null,"#FFD700",null,"#FFD700",null,null],[null,"#FFD700","#FFD700","#FFD700","#FFD700","#FFD700","#FFD700",null],[null,"#FFB800","#FFD700","#FFD700","#FFD700","#FFD700","#FFB800",null]]},
  halo:     {extraRows:2,grid:[[null,"#FFE840","#FFE840","#FFE840","#FFE840","#FFE840",null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null]]},
}

// ── アイテム ───────────────────────────────────────────────
const ITEMS = {
  none:   null,
  scroll: {col:6,row:7,grid:[["#c8a050","#c8a050"],["#e8d090","#e8d090"],["#e8d090","#e8d090"],["#c8a050","#c8a050"]]},
  torch:  {col:6,row:4,grid:[["#ff8800",null],["#ffaa00","#ff6600"],["#8B5E3C","#8B5E3C"],["#8B5E3C","#8B5E3C"],["#6B3E2C","#6B3E2C"]]},
  sword:  {col:6,row:3,grid:[["#d0d8e0",null],["#d0d8e0",null],["#d0d8e0","#FFD700"],["#c0c8d0","#c0c8d0"],[null,"#888890"]]},
  staff:  {col:6,row:2,grid:[["#9333ea"],["#8B5E3C"],["#8B5E3C"],["#8B5E3C"],["#6B3E2C"],["#6B3E2C"]]},
  globe:  {col:5,row:6,grid:[[null,"#1a8aaa","#1a8aaa",null],["#1a8aaa","#3aaa3a","#1a8aaa","#1a8aaa"],["#1a8aaa","#1a8aaa","#3aaa3a","#1a8aaa"],[null,"#1a8aaa","#1a8aaa",null]]},
  star:   {col:5,row:5,grid:[[null,"#FFD700",null],["#FFD700","#FFF080","#FFD700"],[null,"#FFD700",null]]},
  galaxy: {col:5,row:5,grid:[[null,"#8a3aaa","#6a2a8a",null],["#8a3aaa","#d090f0","#8a3aaa","#8a3aaa"],["#6a2a8a","#8a3aaa","#d090f0","#6a2a8a"],[null,"#6a2a8a","#8a3aaa",null]]},
}

// ── ステージ設定 ───────────────────────────────────────────
// 500体・旧パターンに寄せた分布（Common多め・Legendaryは希少）
const STAGES = [
  {num:1, name:"村",    nameEn:"VILLAGE",  emoji:"🌱", rarity:"Common",    accent:"#52b788", count:110},
  {num:2, name:"街",    nameEn:"TOWN",     emoji:"🏘️", rarity:"Common",    accent:"#f4a261", count:90},
  {num:3, name:"日本",  nameEn:"JAPAN",    emoji:"🗼", rarity:"Uncommon",  accent:"#e63946", count:80},
  {num:4, name:"アジア",nameEn:"ASIA",     emoji:"🌏", rarity:"Uncommon",  accent:"#f9c74f", count:65},
  {num:5, name:"欧米",  nameEn:"THE WEST", emoji:"🗽", rarity:"Rare",      accent:"#90e0ef", count:55},
  {num:6, name:"世界",  nameEn:"WORLD",    emoji:"🌍", rarity:"Rare",      accent:"#4361ee", count:45},
  {num:7, name:"地球",  nameEn:"EARTH",    emoji:"🌐", rarity:"Epic",      accent:"#48cae4", count:30},
  {num:8, name:"宇宙",  nameEn:"SPACE",    emoji:"🚀", rarity:"Legendary", accent:"#9b5de5", count:25},
]

// ── トレイト解放条件 ───────────────────────────────────────
// バリアントはStage1から全色解放（ステージの希少性は背景/枠で表現）
// 帽子・アイテムはStage1から基本3種、高ステージで追加解放
const HAT_UNLOCK   = {none:1,straw:1,beanie:1,kabuto:3,tophat:4,explorer:5,crown:6,halo:8}
const ITEM_UNLOCK  = {none:1,scroll:1,torch:1,sword:3,staff:4,globe:6,star:7,galaxy:8}
const EFFECT_UNLOCK= {none:1,glow:5,sparkle:6,aura:7,cosmic:8}
const VARIANT_UNLOCK={0:1,1:1,2:1,3:1,4:1,5:1}  // 全バリアントStage1から
const CHAR_KEYS    = Object.keys(CHARS)

function getAvail(unlockMap, stageNum) {
  return Object.entries(unlockMap)
    .filter(([,min]) => {
      if (stageNum === 8) return min <= 8 && min >= 8  // Stage8は解放stage=8のみ
      return min <= stageNum && min < 8                 // 他のstageはmin<=stageかつstage8専用除外
    })
    .map(([k]) => k)
}
function getAvailVariants(stageNum) {
  return Object.entries(VARIANT_UNLOCK)
    .filter(([,min]) => parseInt(min) <= stageNum)
    .map(([k]) => parseInt(k))
}
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)] }

// ── 背景レイヤー ───────────────────────────────────────────
function bgLayer(stageNum) {
  const cfgs = [
    {base:"#3a6a2a",tile:"#4a7a3a",type:"hstripe"},
    {base:"#28283a",tile:"#363648",type:"brick"},
    {base:"#a03050",tile:"#c85080",type:"dot"},
    {base:"#1a3a2a",tile:"#c8a000",type:"diamond"},
    {base:"#181c30",tile:"#384060",type:"cross"},
    {base:"#0a3a5a",tile:"#1a6a9a",type:"wave"},
    {base:"#080e28",tile:"#1a2a60",type:"arc"},
    {base:"#06060e",tile:"#ffffff",type:"stars"},
  ]
  const {base,tile,type} = cfgs[stageNum-1]
  let p = ""
  if(type==="hstripe"){for(let i=0;i<SZ;i+=16)p+=`<rect x="0" y="${i}" width="${SZ}" height="8" fill="${tile}" opacity="0.35"/>`}
  else if(type==="brick"){for(let r=0;r<SZ/16;r++){const off=r%2===0?0:16;for(let c=0;c<SZ/32+1;c++)p+=`<rect x="${c*32+off}" y="${r*16}" width="30" height="14" fill="${tile}" opacity="0.25"/>`}}
  else if(type==="dot"){for(let r=0;r<SZ/24;r++)for(let c=0;c<SZ/24;c++)p+=`<rect x="${c*24+4}" y="${r*24+4}" width="8" height="8" fill="${tile}" opacity="0.3"/>`}
  else if(type==="diamond"){for(let r=0;r<SZ/16;r++)for(let c=0;c<SZ/16;c++)if((r+c)%2===0)p+=`<rect x="${c*16}" y="${r*16}" width="16" height="16" fill="${tile}" opacity="0.25"/>`}
  else if(type==="cross"){for(let i=0;i<SZ;i+=32){p+=`<rect x="${i}" y="0" width="1" height="${SZ}" fill="${tile}" opacity="0.2"/>`;p+=`<rect x="0" y="${i}" width="${SZ}" height="1" fill="${tile}" opacity="0.2"/>`}}
  else if(type==="wave"){for(let r=0;r<SZ/16;r++)p+=`<rect x="0" y="${r*16+(r%2)*6}" width="${SZ}" height="6" fill="${tile}" opacity="0.3"/>`}
  else if(type==="arc"){for(let i=1;i<=4;i++)p+=`<rect x="${SZ/2-i*40}" y="${SZ-i*30}" width="${i*80}" height="8" fill="${tile}" opacity="${0.15*i}"/>`}
  else if(type==="stars"){const pts=[[12,18],[45,8],[88,25],[130,12],[178,30],[220,8],[248,20],[30,55],[70,42],[110,60],[160,48],[200,55],[240,40],[15,90],[55,80],[100,95],[145,85],[190,100],[235,88],[25,130],[75,120],[120,138],[165,125],[210,130],[250,118],[10,165],[50,158],[95,172],[140,160],[185,168],[230,155],[252,170],[20,200],[60,195],[105,210],[150,198],[195,205],[238,198],[35,235],[80,228],[125,242],[170,230],[215,238],[248,230]];for(const[x,y]of pts){const sz=(x+y)%3===0?3:(x+y)%2===0?2:1;p+=`<rect x="${x}" y="${y}" width="${sz}" height="${sz}" fill="${tile}"/>`}}
  return `<rect width="${SZ}" height="${SZ}" fill="${base}"/>${p}`
}

// ── エフェクトレイヤー ─────────────────────────────────────
function effectLayer(type, accent) {
  if(!type||type==="none") return ""
  if(type==="glow") return [`<rect x="${CX-6}" y="${CY-6}" width="${CW+12}" height="${CH+12}" fill="none" stroke="${accent}" stroke-width="3" opacity="0.5"/>`,`<rect x="${CX-12}" y="${CY-12}" width="${CW+24}" height="${CH+24}" fill="none" stroke="${accent}" stroke-width="1" opacity="0.2"/>`].join("")
  if(type==="sparkle"){const pts=[[CX-8,CY-8],[CX+CW+8,CY-8],[CX-8,CY+CH+8],[CX+CW+8,CY+CH+8],[SZ/2,CY-14]];return pts.map(([x,y])=>[`<rect x="${x-1}" y="${y-5}" width="2" height="10" fill="${accent}" opacity="0.8"/>`,`<rect x="${x-5}" y="${y-1}" width="10" height="2" fill="${accent}" opacity="0.8"/>`].join("")).join("")}
  if(type==="aura") return [1,2,3,4].map(i=>`<rect x="${CX-i*4}" y="${CY-i*4}" width="${CW+i*8}" height="${CH+i*8}" fill="none" stroke="${accent}" stroke-width="2" opacity="${0.5-i*0.1}"/>`).join("")
  if(type==="cosmic"){const cx=SZ/2,cy=SZ/2;return[`<rect x="${cx-50}" y="${cy-2}" width="100" height="4" fill="${accent}" opacity="0.4"/>`,`<rect x="${cx-2}" y="${cy-50}" width="4" height="100" fill="${accent}" opacity="0.4"/>`,...[30,50,70].map(r=>`<rect x="${cx-r}" y="${cy-r}" width="${r*2}" height="${r*2}" fill="none" stroke="${accent}" stroke-width="1" opacity="${0.4-r/200}"/>`)].join("")}
  return ""
}

// ── フレームレイヤー ───────────────────────────────────────
function frameLayer(stageNum, accent) {
  const w=SZ
  if(stageNum<=2) return `<rect x="0" y="0" width="${w}" height="${w}" fill="none" stroke="${accent}" stroke-width="3"/>`
  if(stageNum<=4) return [`<rect x="0" y="0" width="${w}" height="${w}" fill="none" stroke="${accent}" stroke-width="4"/>`,`<rect x="4" y="4" width="${w-8}" height="${w-8}" fill="none" stroke="${accent}" stroke-width="1" opacity="0.5"/>`].join("")
  if(stageNum<=6){const corners=[[0,0],[w-12,0],[0,w-12],[w-12,w-12]];const deco=corners.map(([x,y])=>`<rect x="${x}" y="${y}" width="12" height="12" fill="${accent}"/>`).join("");return[`<rect x="0" y="0" width="${w}" height="${w}" fill="none" stroke="${accent}" stroke-width="5"/>`,`<rect x="5" y="5" width="${w-10}" height="${w-10}" fill="none" stroke="${accent}" stroke-width="1" opacity="0.4"/>`,deco].join("")}
  if(stageNum===7){const dm=[[0,w/2-8],[w-16,w/2-8],[w/2-8,0],[w/2-8,w-16]];const deco=dm.map(([x,y])=>`<rect x="${x}" y="${y}" width="16" height="16" fill="${accent}" transform="rotate(45,${x+8},${y+8})"/>`).join("");return[`<rect x="0" y="0" width="${w}" height="${w}" fill="none" stroke="#FFD700" stroke-width="6"/>`,`<rect x="6" y="6" width="${w-12}" height="${w-12}" fill="none" stroke="#FFD700" stroke-width="2" opacity="0.5"/>`,deco].join("")}
  const colors=["#FF4444","#FF8800","#FFD700","#44FF44","#4488FF","#AA44FF"]
  return colors.map((c,i)=>`<rect x="${i}" y="${i}" width="${w-i*2}" height="${w-i*2}" fill="none" stroke="${c}" stroke-width="1" opacity="${0.7-i*0.08}"/>`).join("")
}

// ── コンポジター ───────────────────────────────────────────
function compose(charKey, hatKey, itemKey, effectType, stageNum, accent, variantIdx) {
  const charGrid = applyVariant(CHARS[charKey], charKey, variantIdx)
  const hat  = HATS[hatKey]
  const item = ITEMS[itemKey]
  const charEl = rects(charGrid, CX, CY)
  const hatEl  = hat  ? rects(hat.grid,  CX,              CY - hat.extraRows*SC) : ""
  const itemEl = item ? rects(item.grid, CX + item.col*SC, CY + item.row*SC)     : ""
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${SZ}" height="${SZ}" shape-rendering="crispEdges">
  ${bgLayer(stageNum)}${charEl}${hatEl}${itemEl}${effectLayer(effectType,accent)}${frameLayer(stageNum,accent)}
</svg>`
}

// ── メイン生成ループ ───────────────────────────────────────
async function main() {
  console.log("🎨 ONLOOP NFT 1,000体 生成開始...\n")
  const used = new Set()
  let tokenId = 1
  let totalGenerated = 0

  for (const stage of STAGES) {
    const availHats     = getAvail(HAT_UNLOCK,    stage.num)
    const availItems    = getAvail(ITEM_UNLOCK,   stage.num)
    const availEffects  = getAvail(EFFECT_UNLOCK, stage.num)
    const availVariants = getAvailVariants(stage.num)

    process.stdout.write(`Stage ${stage.num} ${stage.emoji} ${stage.name} (${stage.count}体)`)

    let generated = 0
    let attempts  = 0

    while (generated < stage.count) {
      attempts++
      if (attempts > 50000) {
        console.error(`\n⚠️ Stage${stage.num}: 試行超過 (${generated}/${stage.count})`)
        break
      }

      const charKey   = pick(CHAR_KEYS)
      const hatKey    = pick(availHats)
      const itemKey   = pick(availItems)
      const effectKey = pick(availEffects)
      const variantIdx= pick(availVariants)

      // 帽子・アイテム・エフェクトのどれかは必須（素のキャラクターを排除）
      if (hatKey === "none" && itemKey === "none" && effectKey === "none") continue

      const key = `${stage.num}:${charKey}:${variantIdx}:${hatKey}:${itemKey}:${effectKey}`
      if (used.has(key)) continue
      used.add(key)

      const id  = String(tokenId).padStart(4, "0")
      const svg = compose(charKey, hatKey, itemKey, effectKey, stage.num, stage.accent, variantIdx)

      // 画像保存
      await sharp(Buffer.from(svg)).png().toFile(join(IMG_DIR, `${id}.png`))

      // メタデータ生成
      const metadata = {
        name:         `ONLOOP #${id}`,
        description:  "恩送りの連鎖から生まれたピクセルアートNFT。連鎖が長いほど、レアなキャラクターが宿る。",
        image:        `ipfs://TBD/${id}.png`,
        external_url: "https://onloop-one.vercel.app",
        attributes: [
          { trait_type: "Stage",       value: `${stage.name} ${stage.nameEn}` },
          { trait_type: "Rarity",      value: stage.rarity },
          { trait_type: "Class",       value: charKey },
          { trait_type: "Outfit",      value: VARIANTS[variantIdx].name },
          { trait_type: "Hat",         value: hatKey },
          { trait_type: "Item",        value: itemKey },
          { trait_type: "Effect",      value: effectKey },
        ],
      }
      writeFileSync(join(META_DIR, `${id}.json`), JSON.stringify(metadata, null, 2))

      tokenId++
      generated++
      totalGenerated++
      if (generated % 50 === 0) process.stdout.write(".")
    }
    console.log(` ✓ ${generated}体`)
  }

  console.log(`\n✅ 完了！ ${totalGenerated}体生成`)
  console.log(`   画像    → public/nft-full/images/  (${totalGenerated}ファイル)`)
  console.log(`   メタデータ → public/nft-full/metadata/ (${totalGenerated}ファイル)`)
  console.log("\n次のステップ:")
  console.log("  1. Pinataにアカウント作成 → IPFSにアップロード")
  console.log("  2. IPFSのCIDでメタデータのimage URLを更新")
  console.log("  3. ERC-721コントラクトデプロイ")
}

main().catch(console.error)
