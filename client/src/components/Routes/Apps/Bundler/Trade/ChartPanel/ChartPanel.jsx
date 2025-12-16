import { useLayoutEffect, useRef, useState } from "react";
import Chart from "./Chart";
import Orderbook from "./Orderbook";

const ChartPanel = ({
  pumpswapCandles,
  form,
  trackedHolders,
  solPrice,
  ca,
  holders,
}) => {
  const parentRef = useRef(null);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  useLayoutEffect(() => {
    if (parentRef.current) {
      setWidth(parentRef.current.clientWidth);
      setHeight(parentRef.current.clientHeight);
    }
  }, [parentRef]);

  return (
    <div className="flex-1 h-full flex-col flex">
      <div ref={parentRef} className="flex-1">
        <Chart
          pumpswapCandles={pumpswapCandles}
          width={width}
          height={height}
          form={form}
          trackedHolders={trackedHolders}
          solPrice={solPrice}
          ca={ca}
        />
      </div>
      <Orderbook
        form={form}
        trackedHolders={trackedHolders}
        holders={holders}
        ca={ca}
      />
    </div>
  );
};

export default ChartPanel;
