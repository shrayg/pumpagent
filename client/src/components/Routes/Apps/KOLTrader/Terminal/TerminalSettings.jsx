import { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";

const TerminalSettings = ({ setOverlay }) => {
  const [settings, setSettings] = useState(() => {
    // Load from localStorage or use defaults
    const terminalSettings = localStorage.getItem("terminalSettings");
    return terminalSettings
      ? JSON.parse(terminalSettings)
      : { autoOpen: true, autoSwitch: true, autoClose: true };
  });

  useEffect(() => {
    localStorage.setItem("terminalSettings", JSON.stringify(settings));
  }, [settings]);

  const update = (k, v) => setSettings((prev) => ({ ...prev, [k]: v }));

  return (
    <div className="absolute top-0 w-full h-full bg-[#0000008c] backdrop-blur-md z-1000 flex flex-col justify-start items-center">
      <div className="flex p-1 w-full">
        <button
          className="text-gray-500 text-[20px] p-2 cursor-pointer hover:text-gray-300"
          onClick={() => setOverlay("")}
        >
          <IoClose />
        </button>
      </div>
      <span className="text-gray-500 text-[14px] select-none">
        Terminal Settings
      </span>
      <div className="h-full w-full mt-4 flex flex-col gap-1 p-4">
        <div className="flex gap-4">
          <div className="w-full bg-[#000000] border border-gray-800 rounded-lg h-30 text-gray-600 text-[12px] p-2">
            <span>Auto Open Chart On New Trade</span>
            <div className="flex text-[14px] w-full h-full justify-center items-center">
              <button
                className={`w-20 ${
                  !settings.autoOpen ? "bg-[#272727]" : ""
                } py-2 text-white rounded-l-md cursor-pointer border-1 border-[#272727]`}
                onClick={() => update("autoOpen", false)}
              >
                No
              </button>
              <button
                className={`w-20 ${
                  settings.autoOpen ? "bg-[#272727]" : ""
                } py-2 text-white rounded-r-md cursor-pointer border-1 border-[#272727]`}
                onClick={() => update("autoOpen", true)}
              >
                Yes
              </button>
            </div>
          </div>
          <div className="w-full bg-[#000000] border border-gray-800 rounded-lg h-30 text-gray-600 text-[12px] p-2">
            <span>Switch To Chart View On New Trade</span>
            <div
              className={`flex text-[14px] w-full h-full justify-center items-center ${
                !settings.autoOpen
                  ? "opacity-30 pointer-events-none"
                  : "opacity-100"
              }`}
            >
              <button
                className={`w-20 ${
                  !settings.autoSwitch ? "bg-[#272727]" : ""
                } py-2 text-white rounded-l-md cursor-pointer border-1 border-[#272727]`}
                onClick={() => update("autoSwitch", false)}
              >
                No
              </button>
              <button
                className={`w-20 ${
                  settings.autoSwitch ? "bg-[#272727]" : ""
                } py-2 text-white rounded-r-md cursor-pointer border-1 border-[#272727]`}
                onClick={() => update("autoSwitch", true)}
              >
                Yes
              </button>
            </div>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="w-full bg-[#000000] border border-gray-800 rounded-lg h-30 text-gray-600 text-[12px] p-2 mt-3">
            <span>Auto Close Chart If KOL Sold And No Open Position</span>
            <div className="flex text-[14px] w-full h-full justify-center items-center">
              <button
                className={`w-20 ${
                  !settings.autoClose ? "bg-[#272727]" : ""
                } py-2 text-white rounded-l-md cursor-pointer border-1 border-[#272727]`}
                onClick={() => update("autoClose", false)}
              >
                No
              </button>
              <button
                className={`w-20 ${
                  settings.autoClose ? "bg-[#272727]" : ""
                } py-2 text-white rounded-r-md cursor-pointer border-1 border-[#272727]`}
                onClick={() => update("autoClose", true)}
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TerminalSettings;
