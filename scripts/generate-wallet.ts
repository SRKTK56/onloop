import { generatePrivateKey, privateKeyToAccount } from "viem/accounts"

const privateKey = generatePrivateKey()
const account = privateKeyToAccount(privateKey)

console.log("\n========================================")
console.log("  ONLOOP Mint専用ウォレット")
console.log("========================================")
console.log("\n⚠️  以下の情報は絶対にチャットに貼らないでください\n")
console.log("アドレス（公開OK）:")
console.log(" ", account.address)
console.log("\n秘密鍵（絶対に非公開）:")
console.log(" ", privateKey)
console.log("\n========================================")
console.log("次のステップ:")
console.log("1. 上のアドレスにBase MainnetのETHを少額送金（0.01ETH程度）")
console.log("2. ! vercel env add ADMIN_PRIVATE_KEY を実行")
console.log("3. 秘密鍵をVercelのプロンプトに貼り付け")
console.log("========================================\n")
