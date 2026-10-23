import { ChevronRight, House } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const paginationMap = {
  "/": { base: "", sub: "Home" },
  //HTTPS
  "/https/introduction": { base: "HTTPS", sub: "Introduction" },
  "/https/generate-wallets": { base: "HTTPS", sub: "Generate Wallets" },
  "/https/fund-wallets": { base: "HTTPS", sub: "Fund Wallets" },
  "/https/claim-profits": { base: "HTTPS", sub: "Claim Profits" },
  "/https/create-ipfs": { base: "HTTPS", sub: "Create IPFS" },
  "/https/create-lookup-table": { base: "HTTPS", sub: "Create Lookup Table" },
  "/https/pump-chart": { base: "HTTPS", sub: "Pump Chart" },
  "/https/pump-token-info": { base: "HTTPS", sub: "Pump Token Info" },
  "/https/pump-bonding-curve": { base: "HTTPS", sub: "Pump Bonding Curve" },
  "/https/pump-koth": { base: "HTTPS", sub: "Pump King Of The Hill" },
  "/https/pump-token-bump": { base: "HTTPS", sub: "Pump Token Bump" },
  "/https/pump-single-buy": { base: "HTTPS", sub: "Pump Single Buy" },
  "/https/pump-single-sell": { base: "HTTPS", sub: "Pump Single Sell" },
  "/https/pump-multi-buy": { base: "HTTPS", sub: "Pump Multi Buy" },
  "/https/pump-multi-sell": { base: "HTTPS", sub: "Pump Multi Sell" },
  "/https/pump-dump-all": { base: "HTTPS", sub: "Pump Dump All" },
  "/https/pump-launch-token": { base: "HTTPS", sub: "Pump Launch Token" },
  "/https/pump-launch-bundle": { base: "HTTPS", sub: "Pump Launch Bundle" },
  "/https/dex-single-buy": { base: "HTTPS", sub: "Dex Single Buy" },
  "/https/dex-single-sell": { base: "HTTPS", sub: "Dex Single Sell" },
  "/https/dex-paid": { base: "HTTPS", sub: "Dex Paid" },
  //WebSocket
  "/websocket/introduction": { base: "WebSocket", sub: "Introduction" },
  "/websocket/token-migration": { base: "WebSocket", sub: "Token Migration" },
  "/websocket/token-creation": { base: "WebSocket", sub: "Token Creation" },
  "/websocket/token-trades": { base: "WebSocket", sub: "Token Trades" },
  "/websocket/user-trades": { base: "WebSocket", sub: "User Trades" },
  "/websocket/kol-trades": { base: "WebSocket", sub: "KOL Trades" },
  "/websocket/pool-creation": { base: "WebSocket", sub: "Pool Creation" },
  "/websocket/pool-trades": { base: "WebSocket", sub: "Pool Trades" },
  "/websocket/pool-kol-trades": { base: "WebSocket", sub: "KOL Pool Trades" },
  //Laboratory
  "/laboratory/introduction": { base: "Laboratory", sub: "Introduction" },
  "/laboratory/bump-bot": { base: "Laboratory", sub: "Bump Bot" },
  //Tools
  "/tools/lamport-converter": { base: "Tools", sub: "Lamport Converter" },
  "/tools/wallet-generator": { base: "Tools", sub: "Wallet Generator" },
  "/tools/pump-token-info": { base: "Tools", sub: "Pump Token Info" },
  "/tools/vanity-grinder": { base: "Tools", sub: "Vanity Grinder" },

  // Fees
  "/fees": { base: "Fees", sub: "" },
  // Footer
  "/privacy": { base: "Privacy", sub: "" },
};

const Pagination = () => {
  const { pathname, search } = useLocation();
  const { base, sub } = paginationMap[pathname] || {};
  const crumbs = [base === "HTTPS" ? "Docs" : base, sub].filter(Boolean);

  return (
    <nav
      className="flex items-center gap-1.5 pt-10 pb-6 text-[13px] font-normal text-fg-subtle select-none"
      aria-label="Breadcrumb"
    >
      <Link to={`/${search}`} className="hover:text-fg transition-colors" aria-label="Home">
        <House className="w-4 h-4" />
      </Link>
      {crumbs.map((crumb, index) => (
        <span key={crumb} className="flex items-center gap-1.5">
          <ChevronRight className="w-3.5 h-3.5" />
          <span className={index === crumbs.length - 1 ? "text-fg-muted" : ""}>{crumb}</span>
        </span>
      ))}
    </nav>
  );
};

export default Pagination;
