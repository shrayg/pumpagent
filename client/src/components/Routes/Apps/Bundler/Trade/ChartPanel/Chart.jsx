import { useRef, useEffect, useCallback, useState } from "react";
import { createChart } from "lightweight-charts";

const Chart = ({
  pumpswapCandles,
  width,
  height,
  form,
  trackedHolders,
  solPrice,
  ca,
}) => {
  const chartContainerRef = useRef(null);
  const chartRef = useRef(null);
  const seriesRef = useRef(null);
  const candleRef = useRef([]);
  const lastTrade = trackedHolders?.lastTrade;

  const [isImageEnlarged, setIsImageEnlarged] = useState(false);

  const toggleImageSize = () => {
    setIsImageEnlarged((prev) => !prev);
  };

  const calculateCandlePositions = (width) => {
    if (typeof width !== "number") return { single: 0, multiple: 0 };

    if (width < 500) return { single: 25, multiple: 15 };
    if (width < 600) return { single: 30, multiple: 25 };
    if (width < 700) return { single: 42, multiple: 40 };

    return { single: 52, multiple: 50 };
  };

  const getTokenTradeData = useCallback(() => {
    const totalSupply = 1_000_000_000;
    const solReserves = lastTrade?.virtual_sol_reserves;
    const tokenReserves = lastTrade?.virtual_token_reserves;
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
  }, [ca, lastTrade, solPrice]);

  useEffect(() => {
    const handleTokenTrades = () => {
      if (!seriesRef.current) return;

      const data = getTokenTradeData();
      if (!data) return;
      const { marketCap } = data;
      if (!marketCap) return;
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
  }, [trackedHolders, lastTrade, pumpswapCandles]);

  useEffect(() => {
    if (pumpswapCandles.length === 0) return;

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

    let candles = pumpswapCandles;
    if (!candles || candles.length === 0) return;

    candles.sort((a, b) => a.time - b.time);
    candles = candles.map((c) => ({
      ...c,
      time: c.time / 1000,
    }));

    seriesRef.current.setData(candles);
    candleRef.current = candles;

    const placements = calculateCandlePositions(width);
    if (candles.length < 5) {
      chartRef.current.timeScale().scrollToPosition(placements.single, false);
    } else {
      chartRef.current.timeScale().scrollToPosition(placements.multiple, false);
    }

    return () => chartRef.current.remove();
  }, [pumpswapCandles]);

  const tokenImage = form.metadata?.image;
  const tokenSymbol = form.metadata?.symbol;
  const tokenName = form.metadata?.name;

  return (
    <div className="flex-1 border-b border-gray-900 relative h-full">
      {/* Backdrop for enlarged image */}
      {isImageEnlarged && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 z-40"
          onClick={toggleImageSize}
        />
      )}

      {/* Fallback for no chart */}
      {!pumpswapCandles.length && (
        <div className="flex justify-center items-center h-full absolute inset-0">
          <span className="text-[12px] text-gray-700">No active chart</span>
        </div>
      )}

      {/* Token info */}
      <div className="absolute top-1 left-1 z-50 flex items-center p-2">
        {tokenImage && (
          <>
            <img
              src={tokenImage}
              alt="Image"
              onClick={toggleImageSize}
              className={`w-6 h-6 rounded-md cursor-pointer transition-transform duration-300 ease-in-out ${
                isImageEnlarged
                  ? "fixed top-20 left-1/2 transform -translate-x-1/2 z-50 w-64 h-64"
                  : ""
              }`}
            />
            <div className="flex flex-col gap-0.5 ml-2">
              <span className="text-gray-500 text-[12px]">{tokenName}</span>
              <span className="text-gray-600 text-[12px]">{tokenSymbol}</span>
            </div>
          </>
        )}
      </div>

      {/* Chart */}
      <div
        ref={chartContainerRef}
        style={{ width: `${width}px`, height: `${height - 40}px` }}
        className={`absolute top-0 litcanvas ${
          chartContainerRef.current ? "fadefast" : "hidden"
        } ${!pumpswapCandles.length ? "hidden" : "block"}`}
      />
    </div>
  );
};

export default Chart;
