import { useEffect, useState } from "react";
import { FaRegCopy } from "react-icons/fa6";
import { copy, getIPFSUrl } from "../../../../../utils/functions";
import { useMemo } from "react";
import OpenPositions from "./OpenPositions";
import { useContext } from "react";
import { AuthContext } from "../../../../../utils/AuthProvider";
import { useCallback } from "react";
import BuyMenu from "./BuyMenu";
import SellMenu from "./SellMenu";
import Wallet from "./Wallet/Wallet";
import Question from "../../../../../assets/Question.webp";
import { useNavigate } from "react-router-dom";
import SearchCoin from "./SearchCoin";

const TradePanel = ({
  view,
  setView,
  charts,
  tokenInfo,
  setOverlay,
  openPositions,
  setOpenPositions,
  setCharts,
  apiKey,
  traderWallet,
  setSolBalance,
  setKolTrades,
  solBalance,
  activeTab,
  setActiveTab,
  trackedHolders,
  setTraderWallet,
  trackedPoolsRef,
  trackedPoolTrades,
  solPrice,
  poolSocketRef,
}) => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showSwapsettings, setShowSwapsettings] = useState(false);
  const chartArray = useMemo(
    () => charts.map((chart) => tokenInfo[chart?.mint]),
    [charts, tokenInfo]
  );
  const [walletOpen, setWalletOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [tradeDirection, setTradeDirection] = useState("BUY");
  const [activeButton, setActiveButton] = useState("");
  const [customInput, setCustomInput] = useState("");
  const [cachedInput, setCachedInput] = useState(
    localStorage.getItem("cachedInput") || ""
  );
  const [cacheSelected, setCacheSelected] = useState(false);

  useEffect(() => {
    if (activeTab == null) {
      const lastItem = [...chartArray].reverse().find((item) => item != null);
      if (lastItem) {
        setActiveTab(lastItem);
      }
    }
  }, [chartArray, activeTab, setActiveTab]);

  const toggleTab = useCallback(
    (i) => {
      if (!chartArray[i]) return;
      setActiveTab(chartArray[i]);
    },
    [chartArray, setActiveTab]
  );

  const redirect = () => {
    if (!user) {
      localStorage.setItem("redirect", "/dex");
      navigate("/signin");
      return;
    }
  };

  return (
    <div
      className={` ${
        view === "Terminal" ? "border-l" : ""
      } border-gray-900 flex flex-col relative min-w-[371px]`}
    >
      {!user && (
        <div
          className="absolute w-full h-full inset-0 z-1000 bg-[#000000c4] min-h-[531px] max-h-[531px] backdrop-blur-md flex justify-center items-center cursor-pointer text-gray-600 hover:text-white transition"
          onClick={redirect}
        >
          <span className="text-[14px] ">Sign In To Trade</span>
        </div>
      )}
      <div className="flex flex-col min-h-[531px]">
        <div className="flex w-full flex-1">
          {!searchOpen && (
            <Wallet
              traderWallet={traderWallet}
              setTraderWallet={setTraderWallet}
              apiKey={apiKey}
              solBalance={solBalance}
              setSolBalance={setSolBalance}
              setWalletOpen={setWalletOpen}
              walletOpen={walletOpen}
            />
          )}
          {!walletOpen && (
            <SearchCoin
              searchOpen={searchOpen}
              setSearchOpen={setSearchOpen}
              trackedPoolsRef={trackedPoolsRef}
              poolSocketRef={poolSocketRef}
              setCharts={setCharts}
              setView={setView}
            />
          )}
        </div>
        {!walletOpen && !searchOpen && (
          <div className="border-b  border-gray-800">
            <div className="flex flex-col">
              {/* Nav */}
              <div className="flex border-gray-800 w-full">
                {chartArray.map((chart, index) => (
                  <button
                    key={index}
                    className={`w-1/4 h-11 border-r border-gray-900 overflow-hidden ${
                      chart ? "cursor-pointer" : ""
                    }  flex flex-col justify-center items-center gap-0.5 relative ${
                      chart?.mint === activeTab?.mint && activeTab
                        ? "bg-[#202020af]"
                        : "bg-transparent"
                    }`}
                    onClick={() => toggleTab(index)}
                  >
                    <span className="text-[10px] text-[#393939] absolute top-1 left-1">
                      {index + 1}
                    </span>
                    {chart?.image_uri && (
                      <img
                        src={getIPFSUrl(chart?.image_uri)}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = Question;
                        }}
                        alt={chart.name}
                        className="w-5 h-5 rounded-full object-cover"
                      />
                    )}
                    <span
                      className={`text-[10px] text-gray-500 ${
                        chart?.mint === activeTab?.mint && activeTab
                          ? "text-white"
                          : "text-gray-500"
                      }`}
                    >
                      {chart?.symbol}
                    </span>
                  </button>
                ))}
              </div>
              {/* Graphic */}
              <div className="flex bg-red-500 grad min-h-[112px]">
                {activeTab && (
                  <div
                    className={`flex justify-center items-center h-full w-full ${
                      activeTab?.banner_uri ? "gap-40 py-14" : "gap-2 py-8"
                    } relative`}
                  >
                    {!activeTab?.banner_uri && (
                      <div className="flex">
                        <img
                          src={getIPFSUrl(activeTab?.image_uri)}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = Question;
                          }}
                          alt={activeTab?.name}
                          className="w-12 h-12 rounded-full z-10 mr-2 object-cover"
                        />

                        <div className="flex flex-col justify-center items-center z-10">
                          <span className="text-[14px] text-white mb-1">
                            {activeTab?.symbol}
                          </span>
                          <span className="text-[12px] text-gray-500">
                            {activeTab?.name}
                          </span>
                          <span className="text-[10px] flex justify-center items-center gap-1 pt-1 cursor-pointer group text-greener active:underline select-none text-shadow-black">
                            {activeTab?.mint?.slice(0, 5) +
                              "..." +
                              activeTab?.mint?.slice(
                                activeTab?.mint.length - 5
                              )}
                            <FaRegCopy
                              className="text-gray-500 group:hover:text-greener"
                              onClick={() => copy(activeTab?.mint)}
                            />
                          </span>
                        </div>
                      </div>
                    )}
                    {activeTab.banner_uri && (
                      <>
                        <img
                          src={activeTab?.banner_uri}
                          alt="Banner"
                          className="w-full h-full absolute object-cover inset-0 z-0 text-[10px]"
                        />

                        <span className="text-[10px] z-1000 absolute bottom-0 text-greener gap-1 cursor-pointer active:underline select-none bg-[#000000aa] w-full py-1 flex justify-center items-center rounded-t-xl">
                          {activeTab.mint}{" "}
                          <FaRegCopy
                            className=" group:hover:text-greener"
                            onClick={() => copy(activeTab?.mint)}
                          />
                        </span>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Buy/Sell Tabs */}
              {!showSwapsettings && (
                <div className="flex">
                  <button
                    className={`flex w-1/2 text-white text-[14px] justify-center items-center py-3 buygrad rounded-tl-xl cursor-pointer ${
                      tradeDirection === "BUY" ? "opacity-100" : "opacity-60"
                    }`}
                    onClick={() => setTradeDirection("BUY")}
                  >
                    BUY
                  </button>
                  <button
                    className={`flex w-1/2 text-white text-[14px] justify-center items-center py-3 buygrad rounded-tr-xl cursor-pointer ${
                      tradeDirection === "SELL" ? "opacity-100" : "opacity-60"
                    }`}
                    onClick={() => setTradeDirection("SELL")}
                  >
                    SELL
                  </button>
                </div>
              )}
              {/* Buy Input Menus */}
              {tradeDirection === "BUY" && (
                <BuyMenu
                  setOverlay={setOverlay}
                  cachedInput={cachedInput}
                  setCachedInput={setCachedInput}
                  customInput={customInput}
                  setCustomInput={setCustomInput}
                  cacheSelected={cacheSelected}
                  setCacheSelected={setCacheSelected}
                  activeButton={activeButton}
                  setActiveButton={setActiveButton}
                  solBalance={solBalance}
                  tradeDirection={tradeDirection}
                  activeTab={activeTab}
                  traderWallet={traderWallet}
                  apiKey={apiKey}
                  setOpenPositions={setOpenPositions}
                  setKolTrades={setKolTrades}
                  trackedPoolTrades={trackedPoolTrades}
                  setSolBalance={setSolBalance}
                  solPrice={solPrice}
                  showSwapsettings={showSwapsettings}
                  setShowSwapsettings={setShowSwapsettings}
                />
              )}
              {tradeDirection === "SELL" && (
                <SellMenu
                  activeTab={activeTab}
                  trackedHolders={trackedHolders}
                  openPositions={openPositions}
                  setOpenPositions={setOpenPositions}
                  setKolTrades={setKolTrades}
                  traderWallet={traderWallet}
                  apiKey={apiKey}
                  setSolBalance={setSolBalance}
                  trackedPoolTrades={trackedPoolTrades}
                  showSwapsettings={showSwapsettings}
                  setShowSwapsettings={setShowSwapsettings}
                />
              )}
            </div>
          </div>
        )}
      </div>
      <OpenPositions
        openPositions={openPositions}
        setOpenPositions={setOpenPositions}
        setCharts={setCharts}
        setView={setView}
        traderWallet={traderWallet}
        apiKey={apiKey}
        setKolTrades={setKolTrades}
        setSolBalance={setSolBalance}
        solBalance={solBalance}
        trackedPoolsRef={trackedPoolsRef}
        trackedPoolTrades={trackedPoolTrades}
        solPrice={solPrice}
        poolSocketRef={poolSocketRef}
      />
    </div>
  );
};

export default TradePanel;
