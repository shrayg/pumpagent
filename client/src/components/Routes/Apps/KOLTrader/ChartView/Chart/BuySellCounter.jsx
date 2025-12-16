import { useEffect, useState } from "react";
import { FaPeopleRoof } from "react-icons/fa6";
import { FaArrowsDownToPeople } from "react-icons/fa6";
import Pump from "../../../../../../assets/Pump.png";
import { getPumpPoolPdaString } from "../../../../../../utils/functions";

const BuySellCounter = ({
  trackedHolders,
  ca,
  tokenInfo,
  trackedPoolTrades,
}) => {
  const [holders, setHolders] = useState([]);
  const complete = tokenInfo[ca]?.complete || tokenInfo[ca]?.pump_swap_pool;

  const pool = getPumpPoolPdaString(ca);
  const migrated = trackedPoolTrades[ca];
  const hasBonded = complete || migrated ? true : false;

  useEffect(() => {
    if (!trackedHolders[ca] || Object.keys(trackedHolders[ca]).length === 0)
      return;
    const holderArray = Object.values(trackedHolders[ca].holders);
    setHolders(holderArray);
  }, [trackedHolders]);

  return (
    <div
      className={`absolute top-0 flex gap-2 right-14 bottom z-1000 rounded-tr-lg select-none p-0.5`}
    >
      {hasBonded && (
        <div className="flex justify-center items-center gap-1 p-1 pt-2 z-1000">
          <img src={Pump} alt="Pump" className="w-4.5 h-4.5" />
          <span className="text-greener text-[8px]">PumpSwap</span>
        </div>
      )}
      {!hasBonded && (
        <>
          <span className="text-gray-700 flex justify-center items-center text-[18px] flex-col">
            <FaPeopleRoof />
            <span className="text-gray-600 text-[12px]">
              {holders && holders.filter((num) => num > 10).length}
            </span>
          </span>
          <span className="text-gray-700 flex justify-center items-center text-[18px] flex-col">
            <FaArrowsDownToPeople />
            <span className="text-gray-600 text-[12px]">
              {holders && holders.filter((num) => num < 10).length}
            </span>
          </span>
        </>
      )}
    </div>
  );
};

export default BuySellCounter;
