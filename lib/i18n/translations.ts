export type Lang = "ja" | "en"

const t = {
  ja: {
    nav: {
      start:  "はじめる",
      loops:  "ループを見る",
      menu:   "恩送りメニュー",
      mypage: "マイページ",
    },
    hero: {
      tagline: "お金で買えない幸せを、恩送りで。",
      desc:    "写真を撮る・企画を手伝う・料理を振る舞う——など、金銭を介さない好意（GIVE）の連鎖をゲームのように楽しむアプリ。連鎖を長くすること、連鎖をループさせることで獲得できるON（恩）トークンがUP！",
      v1:     "金銭不要の恩送りでON（実績）が積み上がる",
      v2:     "恩の連鎖をBase上に記録する仕組み",
      v3:     "輪が閉じると連鎖の全員にボーナス",
      builton: "BUILT ON BASE BLOCKCHAIN",
      cta_start: "▸ 恩送りをはじめる",
      cta_menu: "▸ 恩送りメニューを見る",
    },
    how: {
      title: "HOW IT WORKS",
      sub:   "4ステップで恩送りを始めよう",
      steps: [
        { step:"01", icon:"🔍", title:"メニューから選ぶ",   desc:"登録された恩送りメニューを見て、気になる人にお願いする。ウォレット不要で閲覧できます。" },
        { step:"02", icon:"🤝", title:"恩送りが届く",       desc:"好意を受け取ったら自動でONが積み上がる。次の誰かへ繋いで連鎖を伸ばしていく。" },
        { step:"03", icon:"🎉", title:"ループが完成",       desc:"連鎖が起点に戻ったとき、全員にボーナスが降り注ぐ。連鎖が長いほど報酬も大きい。" },
        { step:"04", icon:"🌏", title:"世界が進化する",     desc:"連鎖が伸びると世界が村→街→日本→…→宇宙へ育つ。ステージが上がるほど、ループが閉じたときの報酬倍率も上がる。" },
      ],
    },
    token: {
      title: "ON（恩）とは？",
      sub:   "恩送りをするたびに積み上がる実績の記録です。売買も譲渡もできません。",
      cards: [
        { icon:"🤝", label:"恩送り参加",  value:"+1〜5 ON",  note:"送る・受け取るたびに積み上がる", accent:"#0052FF" },
        { icon:"🎉", label:"ループ完成",  value:"N×20 ON",   note:"起点者には最大4倍ボーナス",   accent:"#ffcc00" },
        { icon:"🌏", label:"ステージ倍率", value:"最大×20",   note:"連鎖が長いほどループ報酬UP", accent:"#5c4ade" },
      ],
      chain: "ONは譲渡も売買もできない設計です。使うためのものではなく、「どれだけ恩を送ったか」が積み上がる記録として増えていきます。連鎖の記録はBase上のコントラクトに刻まれます。",
    },
    stages: {
      title: "WORLD STAGES",
      sub:   "恩送りの連鎖が長くなるほど世界が進化していく",
      note:  "はループ完成ボーナスの倍率です",
      chain: "連鎖",
    },
    cta: {
      title: "さあ、はじめよう",
      sub:   "ウォレット不要でメニューを閲覧できます",
      wallet_note: "ウォレットはCoinbase Walletで無料作成できます",
      btn_start: "▸ 恩送りをはじめる",
      btn_menu: "▸ 恩送りメニューを見る",
    },
    menu_page: {
      title: "恩送りメニュー",
      sub:   "恩送りメニューに登録されたメンバーが、スキルや好意を提供してくれます。",
      req_btn: "▸ こんな恩送りが欲しい",
      reg_btn: "▸ 恩送りメニュー登録",
      empty_title: "NO GIVERS YET...",
      empty_sub:   "現在掲載中のメニューはありません。",
      empty_cta:   "最初に登録しませんか？",
      tap:    "▸ タップして詳細を見る",
      offer:  "▸ この人に恩送りをお願いする",
    },
  },

  en: {
    nav: {
      start:  "Start",
      loops:  "Live Loops",
      menu:   "Kindness Menu",
      mypage: "My Page",
    },
    hero: {
      tagline: "Happiness money can't buy — through pay-it-forward.",
      desc:    "Photography, planning, cooking — enjoy chains of non-monetary kindness like a game. The longer the chain and the more loops you create, the more ON (gratitude) tokens you earn!",
      v1:     "Build up ON — a record of kindness given, not a currency",
      v2:     "Kindness chains are recorded to a contract on Base",
      v3:     "When the loop closes, everyone in the chain is rewarded",
      builton: "BUILT ON BASE BLOCKCHAIN",
      cta_start: "▸ Start Giving",
      cta_menu: "▸ Browse Kindness Menu",
    },
    how: {
      title: "HOW IT WORKS",
      sub:   "Get started in 4 simple steps",
      steps: [
        { step:"01", icon:"🔍", title:"Browse the Menu",       desc:"View registered kindness menus and request someone. No wallet needed to browse." },
        { step:"02", icon:"🤝", title:"Receive Kindness",      desc:"Receive a kind act and your ON record grows. Pass it forward to extend the chain." },
        { step:"03", icon:"🎉", title:"Loop Completed",        desc:"When the chain returns to its origin, everyone receives a bonus. Longer chains = bigger rewards." },
        { step:"04", icon:"🌏", title:"The World Evolves",     desc:"As the chain grows, the world evolves from Village to Town to Japan and on to Space. Higher stages mean bigger rewards when the loop closes." },
      ],
    },
    token: {
      title: "What is ON?",
      sub:   "A record that builds up each time you pass kindness forward. It cannot be sold or transferred.",
      cards: [
        { icon:"🤝", label:"Participating",  value:"+1–5 ON",   note:"For each give or receive",         accent:"#0052FF" },
        { icon:"🎉", label:"Loop Complete",  value:"N×20 ON",   note:"Origin earns up to 4× bonus",      accent:"#ffcc00" },
        { icon:"🌏", label:"Stage Bonus",   value:"up to ×20",  note:"Longer chains, bigger loop rewards", accent:"#5c4ade" },
      ],
      chain: "ON cannot be sold or transferred by design. It is not something you spend — it is a record of how much kindness you have passed on. Chain records are written to a contract on Base.",
    },
    stages: {
      title: "WORLD STAGES",
      sub:   "The longer your kindness chain, the more the world evolves",
      note:  "is the loop bonus multiplier",
      chain: "chain(s)",
    },
    cta: {
      title: "Let's get started",
      sub:   "Browse the menu without a wallet",
      wallet_note: "Create a free wallet with Coinbase Wallet",
      btn_start: "▸ Start Giving",
      btn_menu: "▸ Browse Kindness Menu",
    },
    menu_page: {
      title: "Kindness Menu",
      sub:   "Members registered in the kindness menu offer their skills and goodwill.",
      req_btn: "▸ Request kindness",
      reg_btn: "▸ Register your menu",
      empty_title: "NO GIVERS YET...",
      empty_sub:   "No menus listed yet.",
      empty_cta:   "Be the first to register?",
      tap:    "▸ Tap for details",
      offer:  "▸ Request kindness from this person",
    },
  },
} as const

export type Translations = typeof t.ja
export default t
