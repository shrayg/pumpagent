export const blogPaths = {
  "https/introduction": {
    prev: null,
    next: {
      title: "Generate Wallets",
      path: "/https/generate-wallets",
    },
  },
  "https/generate-wallets": {
    prev: {
      title: "Introduction",
      path: "/https/introduction",
    },
    next: {
      title: "Fund Wallets",
      path: "/https/fund-wallets",
    },
  },
  "https/fund-wallets": {
    prev: {
      title: "Generate Wallets",
      path: "/https/generate-wallets",
    },
    next: {
      title: "Claim Profits",
      path: "/https/claim-profits",
    },
  },
  "https/claim-profits": {
    prev: {
      title: "Fund Wallets",
      path: "/https/fund-wallets",
    },
    next: {
      title: "Create IPFS",
      path: "/https/create-ipfs",
    },
  },
  "https/create-ipfs": {
    prev: {
      title: "Claim Profits",
      path: "/https/claim-profits",
    },
    next: {
      title: "Create Lookup Table",
      path: "/https/create-lookup-table",
    },
  },
  "https/create-lookup-table": {
    prev: {
      title: "Create IPFS",
      path: "/https/create-ipfs",
    },
    next: {
      title: "Pump Chart",
      path: "/https/pump-chart",
    },
  },
  "https/pump-chart": {
    prev: {
      title: "Create Lookup Table",
      path: "/https/create-lookup-table",
    },
    next: {
      title: "Pump Token Info",
      path: "/https/pump-token-info",
    },
  },
  "https/pump-token-info": {
    prev: {
      title: "Pump Chart",
      path: "/https/pump-chart",
    },
    next: {
      title: "Pump Bonding Curve",
      path: "/https/pump-bonding-curve",
    },
  },
  "https/pump-bonding-curve": {
    prev: {
      title: "Pump Token Info",
      path: "/https/pump-token-info",
    },
    next: {
      title: "Pump Token Bump",
      path: "/https/pump-token-bump",
    },
  },
  "https/pump-token-bump": {
    prev: {
      title: "Pump Bonding Curve",
      path: "/https/pump-bonding-curve",
    },
    next: {
      title: "Pump Single Buy",
      path: "/https/pump-single-buy",
    },
  },
  "https/pump-single-buy": {
    prev: {
      title: "Pump Token Bump",
      path: "/https/pump-token-bump",
    },
    next: {
      title: "Pump Single Sell",
      path: "/https/pump-single-sell",
    },
  },
  "https/pump-single-sell": {
    prev: {
      title: "Pump Single Buy",
      path: "/https/pump-single-buy",
    },
    next: {
      title: "Pump Multi Buy",
      path: "/https/pump-multi-buy",
    },
  },
  "https/pump-multi-buy": {
    prev: {
      title: "Pump Single Sell",
      path: "/https/pump-single-sell",
    },
    next: {
      title: "Pump Multi Sell",
      path: "/https/pump-multi-sell",
    },
  },
  "https/pump-multi-sell": {
    prev: {
      title: "Pump Multi Buy",
      path: "/https/pump-multi-buy",
    },
    next: {
      title: "Pump Dump All",
      path: "/https/dex-dump-all",
    },
  },
  "https/pump-dump-all": {
    prev: {
      title: "Pump Multi Sell",
      path: "/https/pump-multi-sell",
    },
    next: {
      title: "Pump Token Launch",
      path: "/https/dex-launch-token",
    },
  },
  "https/pump-launch-token": {
    prev: {
      title: "Pump Dump All",
      path: "/https/pump-dump-all",
    },
    next: {
      title: "Pump Launch Bundle",
      path: "/https/pump-launch-bundle",
    },
  },
  "https/pump-launch-bundle": {
    prev: {
      title: "Pump Launch Token",
      path: "/https/pump-launch-token",
    },
    next: {
      title: "DEX Single Buy",
      path: "/https/dex-single-buy",
    },
  },
  "https/dex-single-buy": {
    prev: {
      title: "Pump Launch Bundle",
      path: "/https/pump-launch-bundle",
    },
    next: {
      title: "DEX Single Sell",
      path: "/https/dex-single-sell",
    },
  },
  "https/dex-single-sell": {
    prev: {
      title: "DEX Single Buy",
      path: "/https/dex-single-buy",
    },
    next: {
      title: "DEX Paid",
      path: "/https/dex-paid",
    },
  },
  "https/dex-paid": {
    prev: {
      title: "DEX Single Sell",
      path: "/https/dex-single-sell",
    },
    next: {
      title: "Pump Single Sell",
      path: "/https/pump-single-sell",
    },
  },
  "websocket/introduction": {
    prev: null,
    next: {
      title: "Token Migration Event",
      path: "/websocket/token-migration",
    },
  },
  "websocket/token-migration": {
    prev: {
      title: "WebSocket Introduction",
      path: "/websocket/introduction",
    },
    next: {
      title: "Token Creation Event",
      path: "/websocket/token-creation",
    },
  },
  "websocket/token-creation": {
    prev: {
      title: "Token Migration Event",
      path: "/websocket/token-migration",
    },
    next: {
      title: "Token Trades Event",
      path: "/websocket/token-trades",
    },
  },
  "websocket/token-trades": {
    prev: {
      title: "Token Creation Event",
      path: "/websocket/token-creation",
    },
    next: {
      title: "User Trades Event",
      path: "/websocket/user-trades",
    },
  },
  "websocket/user-trades": {
    prev: {
      title: "Token Trades Event",
      path: "/websocket/token-trades",
    },
    next: {
      title: "KOL Trades Event",
      path: "/websocket/kol-trades",
    },
  },
  "websocket/kol-trades": {
    prev: {
      title: "User Trades Event",
      path: "/websocket/user-trades",
    },
    next: {
      title: "Pool Creation",
      path: "/websocket/pool-creation",
    },
  },
  "websocket/pool-creation": {
    prev: {
      title: "KOL Trades Event",
      path: "/websocket/kol-trades",
    },
    next: {
      title: "Pool Trades",
      path: "/websocket/pool-trades",
    },
  },
  "websocket/pool-trades": {
    prev: {
      title: "Pool Creation",
      path: "/websocket/pool-creation",
    },
    next: {
      title: "KOL Pool Trades",
      path: "/websocket/pool-kol-trades",
    },
  },
  "websocket/pool-kol-trades": {
    prev: {
      title: "KOL Pool Trades",
      path: "/websocket/pool-kol-trades",
    },
    next: null,
  },
  "laboratory/introduction": {
    prev: null,
    next: {
      title: "Build a Bump Bot Service",
      path: "/laboratory/bump-bot",
    },
  },
  "laboratory/bump-bot": {
    prev: {
      title: "Laboratory Introduction",
      path: "/laboratory/introduction",
    },
    next: {
      title: "Coming Soon",
      path: "",
    },
  },
  "tools/lamport-converter": {
    prev: null,
    next: {
      title: "Wallet Generator",
      path: "/tools/wallet-generator",
    },
  },
  "tools/wallet-generator": {
    prev: {
      title: "Lamport Converter",
      path: "tools/lamport-converter",
    },
    next: {
      title: "Vanity Grinder",
      path: "/tools/vanity-grinder",
    },
  },
  "tools/vanity-grinder": {
    prev: {
      title: "Wallet Generator",
      path: "tools/wallet-generator",
    },
    next: {
      title: "Some Tool",
      path: "/tools/wallet-generator",
    },
  },
  "tools/pump-token-info": {
    prev: {
      title: "Wallet Generator",
      path: "tools/wallet-generator",
    },
    next: {
      title: "Some Tool",
      path: "/tools/wallet-generator",
    },
  },
};
