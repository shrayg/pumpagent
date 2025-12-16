import { useEffect, useState } from "react";
import SOL from "../../../../../assets/SOL.png";

const SwapSettings = ({ setShowSwapsettings }) => {
  const levels = ["Medium", "High", "VeryHigh"];
  const [wantsManual, setWantsManual] = useState(false);
  const [swapSettings, setSwapSettings] = useState({
    prioFee: "High",
    slippage: 1, // Default slippage
    autoRetry: true, // Default auto retry
    jitoTip: "0.00002",
  });

  const handleSave = () => {
    localStorage.setItem("swapSettings", JSON.stringify(swapSettings));
    setShowSwapsettings(false);
  };

  useEffect(() => {
    const saved = localStorage.getItem("swapSettings");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSwapSettings(parsed);
      } catch (e) {
        console.error("Failed to parse saved swapSettings:", e);
      }
    }
  }, []);

  const update = (k, v) => setSwapSettings((p) => ({ ...p, [k]: v }));

  return (
    <div className=" text-[12px] flex flex-col justify-between border-gray-800 text-gray-700 pb-2 p-4">
      {/* Priority Fee Section */}
      <div className="border-b border-gray-800 mb-2 pb-2">
        <span>Priority Fee</span>
        <div className="flex gap-2 mt-2 h-[35px]">
          {wantsManual ? (
            <>
              <div className="relative flex-1">
                <img
                  src={SOL}
                  alt="SOL"
                  className="w-4.5 h-4.5 absolute top-2.25 left-2"
                />
                <input
                  type="number"
                  className="w-full border border-gray-900 bg-[#111] p-1.5 pl-8 py-2.5 text-white text-[10px] focus:outline-green-700 focus:outline-1 focus:bg-[#23ff4011]"
                  placeholder="Enter priority fee"
                  value={swapSettings.prioFee}
                  onChange={(e) => update("prioFee", e.target.value)}
                />
              </div>
              <button
                className="border border-gray-900 min-w-[66px] bg-[#111] p-1.5 py-2.5 text-[10px] text-gray-400 cursor-pointer"
                onClick={() => {
                  if (!swapSettings.prioFee) update("prioFee", "High");
                  setWantsManual(false);
                }}
              >
                Auto
              </button>
            </>
          ) : (
            <>
              {levels.map((level) => (
                <button
                  key={level}
                  className={`w-1/4 border border-gray-900 bg-[#111] p-1.5 py-2.5 text-[10px] cursor-pointer ${
                    swapSettings.prioFee === level
                      ? "text-white bg-[#222]"
                      : "text-gray-400"
                  }`}
                  onClick={() => update("prioFee", level)}
                >
                  {level}
                </button>
              ))}
              <button
                className={`w-1/5 border border-gray-900 ${
                  swapSettings.prioFee > 0 ? "bg-[#222]" : "bg-[#111]"
                } p-1.5 py-2.5 text-[10px] cursor-pointer ${
                  wantsManual ? "text-white bg-[#222]" : "text-gray-400"
                }`}
                onClick={() => setWantsManual(true)}
              >
                Manual
              </button>
            </>
          )}
        </div>
      </div>

      {/* Jito Tip Section */}
      <div className="border-b border-gray-800 mb-2 pb-2">
        <span>Jito Tip</span>
        <div className="flex gap-2 mt-2 h-[35px]">
          <div className="relative flex-1">
            <img
              src={SOL}
              alt="SOL"
              className="w-4.5 h-4.5 absolute top-2.25 left-2"
            />
            <input
              type="number"
              className="w-full border border-gray-900 bg-[#111] p-1.5 pl-8 py-2.5 text-white text-[10px] focus:outline-green-700 focus:outline-1 focus:bg-[#23ff4011]"
              placeholder="Enter Jito Tip"
              value={swapSettings.jitoTip}
              onChange={(e) => update("jitoTip", e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Slippage Section */}
      <div className="border-b border-gray-800 mb-2 pb-2 relative">
        <span className="absolute top-8 left-2 text-gray-500">%</span>
        <span>Slippage Percentage</span>
        <input
          type="number"
          step="0.1"
          min="0"
          className="mt-2 w-full border border-gray-900 bg-[#111] p-1.5 pl-5 py-2.5 text-white text-[10px] focus:outline-green-700 focus:outline-1 focus:bg-[#23ff4011]"
          placeholder="Enter slippage %"
          value={swapSettings.slippage}
          onChange={(e) => update("slippage", parseFloat(e.target.value))}
        />
      </div>

      {/* Auto Retry Section */}
      <div className="border-b border-gray-800 mb-2 pb-2">
        <span>Auto Retry Failed Transactions</span>
        <div className="flex gap-2 mt-2">
          <button
            className={`w-1/2 border border-gray-900 bg-[#111] p-1.5 py-2.5 text-[10px] cursor-pointer ${
              !swapSettings.autoRetry ? "text-white bg-[#222]" : "text-gray-400"
            }`}
            onClick={() => update("autoRetry", false)}
          >
            No
          </button>
          <button
            className={`w-1/2 border border-gray-900 bg-[#111] p-1.5 py-2.5 text-[10px] cursor-pointer ${
              swapSettings.autoRetry ? "text-white bg-[#222]" : "text-gray-400"
            }`}
            onClick={() => update("autoRetry", true)}
          >
            Yes
          </button>
        </div>
      </div>

      {/* Save Button */}
      <button
        className="border border-gray-900 p-3.5 bg-[#111] text-white cursor-pointer rounded-md hover:bg-[#202020] mt-1.5 mb-1.5"
        onClick={handleSave}
      >
        Save Settings
      </button>
    </div>
  );
};

export default SwapSettings;
