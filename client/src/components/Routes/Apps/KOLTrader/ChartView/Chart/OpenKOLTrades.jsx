import { useEffect, useState } from "react";
import { formatTokens } from "../../../../../../utils/functions";

const OpenKOLTrades = ({ trackedPositions, ca, pool }) => {
  const [currentlyOpen, setCurrentlyOpen] = useState([]);
  // Update open KOL positions overlay on chart
  useEffect(() => {
    if (!Object.entries(trackedPositions).length) return;

    const uniqueKols = new Map();
    for (const [key, value] of Object.entries(trackedPositions)) {
      if (value[ca] && !uniqueKols.has(key)) {
        uniqueKols.set(key, value[ca][1]);
      }
      if (value[pool] && !uniqueKols.has(key)) {
        uniqueKols.set(key, value[pool][1]);
      }
    }

    const kolArray = Array.from(uniqueKols.entries()).map(([name, value]) => ({
      [name]: value,
    }));

    setCurrentlyOpen(kolArray);
  }, [trackedPositions, ca]);

  return (
    <div
      className={`absolute bottom-0 pl-2 pb-2 p-1 backdrop-blur-md left-0 bottom z-1000 rounded-tr-lg select-none pr-2`}
    >
      {currentlyOpen.length > 0 && (
        <ul className="flex flex-col">
          {currentlyOpen.map((kol, key) => {
            const [[name, value]] = Object.entries(kol);
            return (
              <li
                key={key}
                className={`${
                  value > 0 ? "text-greener" : "text-red-500"
                } text-[12px] flex items-center gap-2`}
              >
                <span>{name}</span>
                <span>{formatTokens(Math.floor(value))}</span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default OpenKOLTrades;
