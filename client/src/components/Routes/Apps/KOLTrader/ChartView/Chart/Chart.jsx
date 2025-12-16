import { useCallback, useEffect, useRef, useState } from "react";
import { createChart } from "lightweight-charts";
import {
  formatChartTokens,
  formatTokens,
} from "../../../../../../utils/functions.js";
import BuySellCounter from "./BuySellCounter.jsx";
import OpenKOLTrades from "./OpenKOLTrades.jsx";
import CommentThread from "./CommentThread.jsx";
import ChartHeader from "./ChartHeader.jsx";
import BumpToken from "./BumpToken.jsx";

const Chart = ({
  ca,
  pool,
  width,
  height,
  data,
  trackedTrades,
  trackedPositions,
  solPrice,
  trackedHolders,
  runBumps,
  apiKey,
  traderWallet,
  activeTab,
  tokenInfo,
  trackedPoolTrades,
  pumpswapCandles,
}) => {
  const [replies, setReplies] = useState([]);
  const chartContainerRef = useRef(null);
  const chartRef = useRef(null);
  const seriesRef = useRef(null);
  const candleRef = useRef([]);

  const tracked = trackedTrades[ca];
  const activateBumps = runBumps[ca];
  const highlightedTab = activeTab?.mint === ca;
  const lastTrade = trackedHolders[ca]?.lastTrade;

  const poolTrades = trackedPoolTrades[ca]?.lastTrade;
  const migratedCandles = pumpswapCandles[ca];

  const calculateCandlePositions = (width) => {
    if (typeof width !== "number") return { single: 0, multiple: 0 };

    if (width < 500) return { single: 25, multiple: 15 };
    if (width < 600) return { single: 30, multiple: 25 };
    if (width < 700) return { single: 42, multiple: 40 };

    return { single: 52, multiple: 50 };
  };

  const getTokenTradeData = useCallback(() => {
    const totalSupply = 1_000_000_000;

    const solReserves =
      poolTrades?.virtual_sol_reserves || lastTrade?.virtual_sol_reserves;

    const tokenReserves =
      poolTrades?.virtual_token_reserves || lastTrade?.virtual_token_reserves;

    const parsedSol = Number(solReserves / 1e9);
    const parsedTokens = Number(tokenReserves / 1e6);

    if (
      !parsedTokens ||
      parsedTokens <= 0 ||
      parsedSol < 0.001 ||
      parsedSol <= 10
    ) {
      return null;
    }

    const pricePerTokenInSOL = parsedSol / parsedTokens;
    const pricePerTokenInUSD = pricePerTokenInSOL * solPrice;
    const marketCap = (totalSupply * pricePerTokenInUSD) / 1000;

    return { marketCap };
  }, [ca, poolTrades, lastTrade, tokenInfo, solPrice]);

  useEffect(() => {
    const handleTokenTrades = () => {
      if (!seriesRef.current) return;

      const data = getTokenTradeData();

      if (!data) return;
      const { marketCap } = data;
      const now = Math.floor(Date.now() / 1000);
      const alignedTime = now - (now % 60);

      const prev = candleRef.current;
      const last = prev[prev.length - 1];

      if (!last || last.time !== alignedTime) {
        const newCandle = {
          time: alignedTime,
          open: last ? last.close : marketCap,
          high: marketCap,
          low: marketCap,
          close: marketCap,
        };
        seriesRef.current.update(newCandle);
        candleRef.current = [...prev, newCandle];
      } else {
        const updated = {
          ...last,
          high: Math.max(last.high, marketCap),
          low: Math.min(last.low, marketCap),
          close: marketCap,
        };
        seriesRef.current.update(updated);
        candleRef.current = [...prev.slice(0, -1), updated];
      }
    };

    handleTokenTrades();
  }, [trackedHolders, lastTrade, poolTrades, migratedCandles]);

  useEffect(() => {
    chartRef.current = createChart(chartContainerRef.current, {
      layout: {
        background: { type: "solid", color: "#000" },
        textColor: "#fff",
      },
      width,
      height,
      grid: {
        vertLines: { color: "#222" },
        horzLines: { color: "#222" },
      },
      rightPriceScale: {
        borderVisible: false,
        textColor: "#fff",
        scaleMargins: {
          top: 0.2,
          bottom: 0.15,
        },
      },
      timeScale: {
        borderVisible: false,
        timeVisible: true,
        secondsVisible: false,
      },
    });

    seriesRef.current = chartRef.current.addCandlestickSeries();
    chartRef.current.applyOptions({
      localization: {
        priceFormatter: function (price) {
          const value = Number(price).toFixed(1);
          if (value > 1000) return (value / 1000).toFixed(2) + "M";
          return value + "K";
        },
      },
    });

    let candles = migratedCandles;
    if (!candles || candles.length === 0) return;
    candles = candles
      .map((c) => ({
        ...c,
        time: Math.floor(Number(c.time) / 1000),
      }))
      .filter((c) => c.time && !isNaN(c.time)) // remove bad timestamps
      .sort((a, b) => a.time - b.time);

    // remove duplicates (keep latest by time)
    const seenTimes = new Set();
    candles = candles.filter((c) => {
      if (seenTimes.has(c.time)) return false;
      seenTimes.add(c.time);
      return true;
    });

    seriesRef.current.setData(candles);
    candleRef.current = candles;
    const placements = calculateCandlePositions(width);

    if (candles.length < 5) {
      chartRef.current.timeScale().scrollToPosition(placements.single, false);
    } else {
      chartRef.current.timeScale().scrollToPosition(placements.multiple, false);
    }

    return () => chartRef.current.remove();
  }, []);

  const markers = () => {
    const candles = candleRef.current;
    if (!candles.length || !tracked || !Array.isArray(tracked)) return [];

    const seen = new Set();
    const uniqueTrades = tracked.filter((trade) => {
      const key = `${trade.timestamp}_${trade.type}_${
        trade.tokens_received || trade.tokens_sold
      }`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    const tradeMap = new Map();
    for (const trade of uniqueTrades) {
      const matchedCandle = candles.find(
        (c) => Math.abs(c.time - trade.timestamp) <= 60
      );
      const time = matchedCandle?.time || trade.timestamp;
      const kol = trade.kol;
      const key = `${kol}_${time}`;

      const amount =
        trade.type === "Buy"
          ? Number((trade.tokens_received / 1e6).toFixed(5))
          : -Number((trade.tokens_sold / 1e6).toFixed(5));

      if (!tradeMap.has(key)) {
        tradeMap.set(key, { time, kol, netAmount: 0 });
      }

      tradeMap.get(key).netAmount += amount;
    }

    return Array.from(tradeMap.values()).map(({ time, kol, netAmount }) => {
      const absAmount = Math.abs(Math.floor(netAmount));
      const formatted = formatChartTokens(absAmount);

      return {
        time: Number(time),
        position: "aboveBar",
        color: netAmount > 10 ? "#00ff00" : "#ff0000",
        shape: "arrowDown",
        text: `${kol.slice(0, 1).toUpperCase()} ${netAmount > 10 ? "+" : "-"} ${
          absAmount < 10 ? 0 : formatted
        }`,
      };
    });
  };

  useEffect(() => {
    if (seriesRef.current && markers().length > 0) {
      seriesRef.current.setMarkers(markers());
    }
  }, [seriesRef.current, tracked]);

  return (
    <div className="relative h-full">
      <ChartHeader data={data} replies={replies} />
      <BumpToken
        activateBumps={activateBumps}
        ca={ca}
        traderWallet={traderWallet}
        apiKey={apiKey}
      />
      <OpenKOLTrades trackedPositions={trackedPositions} ca={ca} pool={pool} />
      <CommentThread
        ca={ca}
        apiKey={apiKey}
        trackedTrades={trackedTrades}
        replies={replies}
        setReplies={setReplies}
        data={data}
        height={height}
      />
      <BuySellCounter
        trackedHolders={trackedHolders}
        ca={ca}
        tokenInfo={tokenInfo}
        trackedPoolTrades={trackedPoolTrades}
      />
      <div className={`${highlightedTab ? "litcanvas" : "litmode"}`}>
        <div
          ref={chartContainerRef}
          style={{ width: `${width}px`, height: `${height - 40}px` }}
          className={`absolute top-0 ${
            chartContainerRef.current ? "fadefast" : "hidden"
          }`}
        />
      </div>
    </div>
  );
};
export default Chart;
