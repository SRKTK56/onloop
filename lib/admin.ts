/**
 * 管理者ウォレットチェックの一元管理
 * 新しい管理者ウォレットを追加する場合はここだけ変更する
 */
export function isAdminAddress(address: string | undefined): boolean {
  if (!address) return false
  const lower = address.toLowerCase()
  const wallets = [
    process.env.NEXT_PUBLIC_ADMIN_WALLET,       // onloop.base.eth（既存管理者）
    process.env.NEXT_PUBLIC_NFT_OWNER_WALLET,   // NFTオーナーウォレット
  ].filter(Boolean).map((w) => w!.trim().toLowerCase()) // .trim() で \n 混入を防御
  return wallets.includes(lower)
}
