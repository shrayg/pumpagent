import { useContext, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import SOL from "../../../../assets/SOL.png";
import { AuthContext } from "../../../../utils/AuthProvider";

const ManageStrategy = ({
  setOverlay,
  strategies,
  setEnabledStrategies,
  enabledStrategies,
}) => {
  const { user } = useContext(AuthContext);
  const enableStrategy = (strat) => {
    setEnabledStrategies((prev) => {
      const exists = prev.find((s) => s.strategyName === strat.strategyName);
      if (exists) {
        // Remove it
        return prev.filter((s) => s.strategyName !== strat.strategyName);
      } else {
        // Add it
        return [...prev, strat];
      }
    });
  };

  const editStrategy = (strat) => {
    localStorage.setItem("allowUpdate", JSON.stringify(strat));
    setOverlay("Create Strategy");
  };

  useEffect(() => {
    localStorage.setItem(
      `${user}-strategies`,
      JSON.stringify(enabledStrategies)
    );
  }, [enabledStrategies]);

  return (
    <div className="fixed top-17 w-full h-full bg-[#0000008c] backdrop-blur-md z-5000 flex flex-col justify-start items-center">
      <div className="flex p-1 pr-8 mt-2 w-full justify-end">
        <button
          className="text-gray-500 text-[20px] p-2 cursor-pointer hover:text-gray-300"
          onClick={() => setOverlay("")}
        >
          <IoClose />
        </button>
      </div>
      <form
        className="flex flex-col justify-start items-center overflow-auto h-screen w-full max-h-[88.7vh] pb-10"
        onSubmit={(e) => e.preventDefault()}
      >
        <span className="text-gray-500 text-[14px] select-none">
          Manage Strategies
        </span>
        {/* Token Rules */}
        <div className=" w-full mt-4 flex flex-col gap-1 p-4 ">
          <div className="flex gap-4  mx-auto  min-w-lg ">
            <div className="w-full bg-[#000000] relative border border-gray-700 rounded-lg text-gray-600 text-[12px] p-4 flex flex-col gap-4">
              <span className="absolute top-[-6px] left-4 px-1 bg-black rounded-md">
                STRATEGIES
              </span>

              <div className="h-100  overflow-auto">
                <ul className="flex flex-col gap-2 w-full h-full">
                  {strategies.length > 0 &&
                    strategies.map((strat, index) => (
                      <li
                        key={index}
                        className={`flex justify-between bg-[#3333336c] p-3 rounded-md ${
                          enabledStrategies.some(
                            (s) => s.strategyName === strat.strategyName
                          )
                            ? "enabled"
                            : ""
                        }`}
                      >
                        <div>
                          <span className="text-[16px] text-white">
                            {strat.strategyName}
                          </span>
                          <div className="flex justify-start flex-col items-start gap-2">
                            <div className="flex flex-col items-start pt-2">
                              <span className="text-[16px] text-white flex justify-start items-center gap-2 pb-1">
                                <img src={SOL} alt="SOL" className="w-5 h-5" />{" "}
                                {strat.entry.solBuy}
                              </span>
                              <span className="text-[16px] text-white flex justify-center items-center gap-2">
                                <span className="text-gray-500 text-[12px]">
                                  Max Entry
                                </span>
                                <span className="text-[12px]">
                                  {strat.entry.maxMcEntry}K
                                </span>
                              </span>
                              <span className="text-[16px] text-white flex justify-center items-center gap-2">
                                <span className="text-gray-500 text-[12px]">
                                  Exit
                                </span>
                                <span className="text-[12px]">
                                  {strat.exit.exitMc}K
                                </span>
                              </span>
                              <span className="text-[16px] text-white flex justify-center items-center gap-2">
                                <span className="text-gray-500 text-[12px]">
                                  Stoploss
                                </span>
                                <span className="text-[12px]">
                                  {strat.stoploss}K
                                </span>
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2 w-[85px]">
                          <button
                            className="h-1/2 bg-[#222] px-4 cursor-pointer text-gray-400 hover:text-white hover:bg-[#333]"
                            onClick={() => enableStrategy(strat)}
                          >
                            {enabledStrategies.some(
                              (s) => s.strategyName === strat.strategyName
                            )
                              ? "Disable"
                              : "Enable"}
                          </button>
                          <button
                            className="h-1/2 bg-[#222] cursor-pointer text-gray-400 hover:text-white hover:bg-[#333]"
                            onClick={() => editStrategy(strat)}
                          >
                            Edit
                          </button>
                        </div>
                      </li>
                    ))}

                  {strategies.length === 0 && (
                    <div className="flex h-full justify-center items-center flex-col">
                      <span>No Strategies</span>
                      <button
                        className="bg-[#222] text-gray-400 p-2 mt-2 hover:text-white cursor-pointer"
                        onClick={() => setOverlay("Create Strategy")}
                      >
                        Create Strategy
                      </button>
                    </div>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ManageStrategy;
