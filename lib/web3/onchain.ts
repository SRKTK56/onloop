import { createWalletClient, http } from "viem"
import { base } from "viem/chains"
import { privateKeyToAccount } from "viem/accounts"

const RECORD_NODE_ABI = [
  {
    name: "recordNode",
    type: "function" as const,
    inputs: [
      { name: "chainId",      type: "uint256" },
      { name: "originWallet", type: "address" },
      { name: "position",     type: "uint256" },
      { name: "giver",        type: "address" },
      { name: "receiver",     type: "address" },
      { name: "description",  type: "string"  },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    name: "confirmNode",
    type: "function" as const,
    inputs: [
      { name: "chainId",  type: "uint256" },
      { name: "position", type: "uint256" },
      { name: "isLoop",   type: "bool"    },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
] as const

function getWalletClient() {
  const pk      = process.env.ADMIN_PRIVATE_KEY?.trim()        as `0x${string}`
  const address = process.env.ON_CHAIN_CONTRACT_ADDRESS?.trim() as `0x${string}`
  if (!pk || !address) throw new Error("ADMIN_PRIVATE_KEY / ON_CHAIN_CONTRACT_ADDRESS が未設定")
  return {
    wallet:  createWalletClient({ account: privateKeyToAccount(pk), chain: base, transport: http() }),
    address,
  }
}

/** 恩送りノードの作成をオンチェーンに記録 */
export async function recordNodeOnChain(params: {
  chainId:      number
  originWallet: string
  position:     number
  giver:        string
  receiver:     string
  description:  string
}): Promise<void> {
  try {
    const { wallet, address } = getWalletClient()
    const hash = await wallet.writeContract({
      address,
      abi: RECORD_NODE_ABI,
      functionName: "recordNode",
      args: [
        BigInt(params.chainId),
        params.originWallet as `0x${string}`,
        BigInt(params.position),
        params.giver         as `0x${string}`,
        params.receiver      as `0x${string}`,
        params.description,
      ],
    })
    console.log(`[onchain] recordNode chain=${params.chainId} pos=${params.position} tx:${hash}`)
  } catch (err) {
    console.error("[onchain] recordNode failed:", err)
  }
}

/** 恩送りノードの確認をオンチェーンに記録 */
export async function confirmNodeOnChain(params: {
  chainId:  number
  position: number
  isLoop:   boolean
}): Promise<void> {
  try {
    const { wallet, address } = getWalletClient()
    const hash = await wallet.writeContract({
      address,
      abi: RECORD_NODE_ABI,
      functionName: "confirmNode",
      args: [BigInt(params.chainId), BigInt(params.position), params.isLoop],
    })
    console.log(`[onchain] confirmNode chain=${params.chainId} pos=${params.position} loop=${params.isLoop} tx:${hash}`)
  } catch (err) {
    console.error("[onchain] confirmNode failed:", err)
  }
}
