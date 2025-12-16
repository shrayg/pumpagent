import { useEffect, useState, useRef } from "react";
import { PublicKey } from "@solana/web3.js";
import { formatTokens } from "../../../../../utils/functions";

function timeAgo(timestamp) {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

const Orderbook = ({ currentTrade, trackedHolders }) => {
  const [trackedOrders, setTrackedOrders] = useState([]);
  const tokenImage = currentTrade?.image_uri;
  const tokenSymbol = currentTrade?.symbol;
  const topRowRef = useRef(null);
  const mint = currentTrade?.mint;
  const trackedTrades = trackedHolders[mint];
  const holders = trackedTrades?.holders;
  const [curveAddress, setCurveAddress] = useState("");

  // console.log("Tracked trades: ", trackedTrades);

  useEffect(() => {
    // Clear tracked orders on mint change
    setTrackedOrders([]);
  }, [mint]);

  useEffect(() => {
    if (!mint) return;
    const [bondingCurve] = PublicKey.findProgramAddressSync(
      [Buffer.from("bonding-curve"), new PublicKey(mint).toBytes()],
      new PublicKey("6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P") //PF
    );
    const curve = bondingCurve.toBase58();
    setCurveAddress(curve);
  }, [mint]);

  useEffect(() => {
    const lastTrade = trackedTrades?.lastTrade;
    if (!lastTrade) return;
    const isFromCurve = lastTrade.recipient === curveAddress;
    if (isFromCurve) return; // 🧼 Filter out bonding curve trades

    const newOrder = {
      wallet: lastTrade.recipient,
      side: lastTrade.type === "Buy" ? "Buy" : "Sell",
      amount: lastTrade.tokens_received || lastTrade.tokens_sold,
      timestamp: Date.now(),
    };
    // console.log("New order: ", newOrder);
    if (!newOrder.amount) return;

    setTrackedOrders((prev) => [newOrder, ...prev].slice(0, 75));

    // Trigger shake-flash animation
    if (topRowRef.current) {
      topRowRef.current.classList.remove("shake-flash-buy");
      topRowRef.current.classList.remove("shake-flash-sell");
      void topRowRef.current.offsetWidth; // Force reflow
      topRowRef.current.classList.add(
        lastTrade.type === "Buy" ? "shake-flash-buy" : "shake-flash-sell"
      );
    }
  }, [holders]);

  return (
    <div className="border-t border-gray-900 overflow-y-auto overflow-x-hidden  min-h-[250px] max-h-[250px] flex flex-col">
      {/* Header */}
      <div className="grid grid-cols-5 gap-4 text-[12px] text-greener mb-2 font-medium sticky top-0 bg-black py-2 px-2 pl-2  z-100">
        <div className="pl-6">Wallet</div>
        <div>Type</div>
        <div>{tokenSymbol || "Amount"}</div>
        <div>Time</div>
        <div>New Balance</div>
      </div>

      {/* Rows */}
      {trackedOrders.length
        ? trackedOrders
            .filter((order) => order.amount >= 10)
            .map((order, index) => {
              const recipient = order.wallet;
              const holdersObj = trackedTrades?.holders || {};
              const balance = Number(holdersObj[recipient]) || 0;
              const formattedBalance = formatTokens(
                Math.floor(order.amount / 1e6)
              );
              const rawBalance =
                balance / 1e6 < 0 ? 0 : Math.floor(balance / 1e6);
              const newBalance = formatTokens(rawBalance);
              const newHolder =
                balance > 0 &&
                !trackedOrders.some(
                  (o) => o.wallet === recipient && o !== order
                );

              return (
                <div
                  key={index}
                  className={`grid grid-cols-5 gap-4 py-2 border-b border-gray-900 text-sm text-white text-[10px] px-2`}
                  ref={index === 0 ? topRowRef : null}
                >
                  <div
                    className="flex items-center gap-1 cursor-pointer hover:underline hover:text-greener"
                    onClick={() =>
                      window.open(
                        `https://solscan.io/account/${order.wallet}`,
                        "_blank"
                      )
                    }
                  >
                    <img
                      src="/Pepe.png"
                      alt="Pepe"
                      className="w-5 h-5 object-contain"
                    />
                    {order?.wallet?.slice(0, 6) + "..."}
                  </div>

                  <div
                    className={
                      order.side === "Buy" ? "text-green-400" : "text-red-400"
                    }
                  >
                    {order.side}
                  </div>

                  <div className="flex items-center gap-1">
                    {tokenImage && (
                      <img
                        src={tokenImage}
                        alt="Token"
                        className="w-4 h-4 rounded-sm"
                      />
                    )}
                    <span>{formattedBalance}</span>
                  </div>

                  <div>{timeAgo(order.timestamp)}</div>

                  <div className="truncate flex items-center gap-1.5 relative">
                    {newHolder && order.side === "Buy" && (
                      <span className="bg-green-700 opacity-70 absolute right-1 text-white rounded-sm py-0.25 px-0.75 text-[8px]">
                        New
                      </span>
                    )}
                    <span
                      className={`${
                        rawBalance === 0 ? "text-gray-500" : "text-white"
                      }`}
                    >
                      {newBalance}
                    </span>
                  </div>
                </div>
              );
            })
        : null}

      {!trackedOrders.length && (
        <div className="flex flex-1">
          <span className="text-[12px]  h-full w-full flex justify-center items-center text-gray-700 select-none">
            No previous orders
          </span>
        </div>
      )}
    </div>
  );
};

export default Orderbook;
