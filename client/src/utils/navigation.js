import { CandlestickChart, Layers, Rocket } from "lucide-react";

export const docsNav = [
  {
    title: "Getting started",
    items: [
      { label: "Introduction", path: "/https/introduction" },
      { label: "Pricing & fees", path: "/fees" },
    ],
  },
  {
    title: "Wallets",
    items: [
      { label: "Generate Wallets", path: "/https/generate-wallets" },
      { label: "Fund Wallets", path: "/https/fund-wallets" },
      { label: "Claim Profits", path: "/https/claim-profits" },
      { label: "Create Lookup Table", path: "/https/create-lookup-table" },
    ],
  },
  {
    title: "Launch",
    items: [
      { label: "Create IPFS", path: "/https/create-ipfs" },
      { label: "Launch Token", path: "/https/pump-launch-token" },
      { label: "Launch Bundle", path: "/https/pump-launch-bundle" },
    ],
  },
  {
    title: "Trade on pump.fun",
    items: [
      { label: "Single Buy", path: "/https/pump-single-buy" },
      { label: "Single Sell", path: "/https/pump-single-sell" },
      { label: "Multi Buy", path: "/https/pump-multi-buy" },
      { label: "Multi Sell", path: "/https/pump-multi-sell" },
      { label: "Dump All", path: "/https/pump-dump-all" },
      { label: "Token Bump", path: "/https/pump-token-bump" },
    ],
  },
  {
    title: "Trade on DEX",
    items: [
      { label: "DEX Single Buy", path: "/https/dex-single-buy" },
      { label: "DEX Single Sell", path: "/https/dex-single-sell" },
    ],
  },
  {
    title: "Market data",
    items: [
      { label: "Pump Chart", path: "/https/pump-chart" },
      { label: "Token Info", path: "/https/pump-token-info" },
      { label: "Bonding Curve", path: "/https/pump-bonding-curve" },
      { label: "DEX Paid", path: "/https/dex-paid" },
    ],
  },
  {
    title: "Tools",
    items: [
      { label: "Wallet Generator", path: "/tools/wallet-generator" },
      { label: "Vanity Grinder", path: "/tools/vanity-grinder" },
      { label: "Token Lookup", path: "/tools/pump-token-info" },
      { label: "Lamport Converter", path: "/tools/lamport-converter" },
    ],
  },
];

export const appNav = [
  {
    label: "Trading Terminal",
    path: "/dex",
    icon: CandlestickChart,
    description:
      "Live KOL trades and new pump.fun pairs with charts and one-click buys and sells.",
  },
  {
    label: "Launch Bundler",
    path: "/bundler",
    icon: Layers,
    description:
      "Launch a token on pump.fun and buy from up to 20 wallets in one bundle.",
  },
  {
    label: "Bump Bot",
    path: "/bump",
    icon: Rocket,
    description:
      "Small buy-and-sell bumps on a set interval to keep a token active on pump.fun.",
  },
];

export const endpointCount = docsNav
  .filter((group) => group.title !== "Getting started" && group.title !== "Tools")
  .reduce((total, group) => total + group.items.length, 0);

export const APP_ROUTES = ["/dex", "/dexv2", "/bundler", "/bump"];

const DOCS_PREFIXES = ["/https", "/websocket", "/tools", "/fees", "/privacy"];

export const isDocsRoute = (pathname) =>
  DOCS_PREFIXES.some((prefix) => pathname.startsWith(prefix));
