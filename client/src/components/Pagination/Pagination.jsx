import { IoMdHome } from "react-icons/io";
import { useLocation, useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();
  const search = useLocation().search;
  const location = useLocation().pathname;
  const { base, sub } = paginationMap[location] || {};
  return (
    <div
      className={`text-white dark:text-black text-[12px]  md:pt-10  py-5 md:py-10 lg:pb-5 flex justify-start items-center gap-2 z-200 select-none mr-auto`}
    >
      <IoMdHome
        className="text-[24px] text-gray-400  dark:text-black cursor-pointer"
        onClick={() => navigate(`/${search}`)}
      />
      {base && (
        <span className="text-gray-400 cursor-pointer dark:text-black hover:text-white">
          {base}
        </span>
      )}
      {base && sub && <span className=" dark:text-black">/</span>}
      {sub && (
        <span className="text-gray-400 cursor-default dark:text-black">
          {sub}
        </span>
      )}
    </div>
  );
};

export default Pagination;
