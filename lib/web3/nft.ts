import { getAddress } from "viem"

// getAddress でEIP-55チェックサム形式に正規化
export const NFT_CONTRACT_ADDRESS: `0x${string}` = process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS
  ? getAddress(process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS.trim())
  : "0x0000000000000000000000000000000000000000"

export const NFT_ABI = [
  { name: "mint",         type: "function", stateMutability: "payable",     inputs: [],                                    outputs: []                     },
  { name: "withdraw",     type: "function", stateMutability: "nonpayable",  inputs: [],                                    outputs: []                     },
  { name: "owner",        type: "function", stateMutability: "view",        inputs: [],                                    outputs: [{ type: "address" }]  },
  { name: "totalMinted",  type: "function", stateMutability: "view",        inputs: [],                                    outputs: [{ type: "uint256" }]  },
  { name: "remaining",    type: "function", stateMutability: "view",        inputs: [],                                    outputs: [{ type: "uint256" }]  },
  { name: "MINT_PRICE",   type: "function", stateMutability: "view",        inputs: [],                                    outputs: [{ type: "uint256" }]  },
  { name: "MAX_SUPPLY",   type: "function", stateMutability: "view",        inputs: [],                                    outputs: [{ type: "uint256" }]  },
  { name: "ownerOf",      type: "function", stateMutability: "view",        inputs: [{ name: "tokenId", type: "uint256" }], outputs: [{ type: "address" }] },
  { name: "tokenURI",     type: "function", stateMutability: "view",        inputs: [{ name: "tokenId", type: "uint256" }], outputs: [{ type: "string" }]  },
] as const

export const MAX_SUPPLY  = 500
export const MINT_PRICE  = BigInt("300000000000000") // 0.0003 ETH

export function padId(n: number): string {
  return String(n).padStart(4, "0")
}
export function nftImageUrl(tokenId: number): string {
  return `/nft-full/images/${padId(tokenId)}.png`
}
export function nftMetaUrl(tokenId: number): string {
  return `/nft-full/metadata/${padId(tokenId)}.json`
}
