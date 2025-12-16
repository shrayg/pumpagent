import { useLocation, useNavigate } from "react-router-dom";
import { IoIosArrowDown } from "react-icons/io";
import { FaHouse } from "react-icons/fa6";
import { FaCloud } from "react-icons/fa";
import { TbZoomMoney } from "react-icons/tb";
import { AiFillTool } from "react-icons/ai";
import { useState } from "react";
import { FaNetworkWired } from "react-icons/fa";
import { GoArrowSwitch } from "react-icons/go";
import { FaCubesStacked } from "react-icons/fa6";
import { IoRocketSharp } from "react-icons/io5";

const SideBar = ({ navOpen, setNavOpen, activeMenu, setActiveMenu }) => {
  const nav = useNavigate();
  const search = useLocation().search;
  const location = useLocation().pathname;
  const category = location.split("/")[1];
  const route = location.split("/").slice(-1)[0];
  const [expanded, setExpanded] = useState({
    https: true,
    websocket: true,
    sdk: true,
    laboratory: true,
    tools: true,
    apps: true,
  });

  const toggle = (key, value) =>
    setExpanded((prev) => ({ ...prev, [key]: value }));

  const navigate = (path) => {
    setNavOpen(false);
    nav(path);
  };

  const toggleMainMenu = (newMenu) => {
    setActiveMenu(newMenu);
    localStorage.setItem("activeMenu", newMenu);
  };

  return (
    <aside
      className={`flex-col flex-start h-[calc(100vh-70px)] z-9000 xl:min-w-[280px] xl:max-w-[280px] xl:sticky top-[70px] ${
        navOpen ? "fixed w-screen h-screen bg-black dark:bg-white " : "hidden"
      } xl:flex  xl:top-[70px] select-none`}
      style={{
        maxHeight:
          window.innerWidth < 1200
            ? `calc(100vh - 70px)`
            : `calc(100vh - 140px)`,
      }}
    >
      <div className="flex text-white text-[14px] my-2 px-2 mx-5 xl:mx-0">
        <button
          className={`w-1/2 p-2 cursor-pointer  rounded-l-md ${
            activeMenu === "Developer"
              ? "bg-purple-500 border border-transparent"
              : "bg-[#d900ff1e] border border-[#d900ff2c]"
          }`}
          onClick={() => toggleMainMenu("Developer")}
        >
          Developer
        </button>
        <button
          className={`w-1/2 p-2 cursor-pointer rounded-r-md relative ${
            activeMenu === "User"
              ? "bg-purple-500 border border-transparent"
              : "bg-[#d900ff1e] border border-[#d900ff2c]"
          }`}
          onClick={() => toggleMainMenu("User")}
        >
          User
          <span className="absolute bg-green-500 text-[8px] text-white right-[-5px] top-[-3px] p-0.5 px-0.75 rounded-sm">
            NEW
          </span>
        </button>
      </div>
      {/* Navigation List */}
      <div className={` w-full z-3000 relative h-[calc(100%-0px)] top-[0px]`}>
        <ul className="text-white dark:text-black text-[14px] pt-0 p-2 transition overflow-auto h-full">
          <li
            className={`p-2 pl-4 cursor-pointer flex justify-start items-center gap-2 ${
              location === `/${search}`
                ? " text-green-500"
                : "dark:hover:bg-[#3333332e]"
            }`}
            onClick={() => navigate(`/${search}`)}
          >
            <FaHouse />
            Home
          </li>

          {activeMenu === "Developer" && (
            <>
              {/* HTTPS List */}
              <ul className={`mt-2`}>
                <span
                  className={`p-2 pl-4 cursor-pointer flex justify-start items-center gap-2 ${
                    category === "https" ? "text-green-500 " : ""
                  }`}
                  onClick={() => toggle("https", !expanded.https)}
                >
                  <FaCloud />
                  HTTPS Endpoints
                  <IoIosArrowDown
                    className={`text-[18px] transform transition ml-auto ${
                      expanded.https ? "rotate-90" : ""
                    }`}
                  />
                </span>

                <ul
                  className={`${
                    !expanded.https ? "" : "hidden"
                  } flex flex-col gap-1`}
                >
                  <li
                    className={`p-2 rounded-md pl-8 cursor-pointer flex justify-between items-center text-gray-400 ${
                      location === `/https/introduction${search}`
                        ? "bg-[rgba(10,77,21,0.38)] text-white"
                        : "hover:bg-[rgb(3,21,6)] dark:hover:bg-[#3333332e]"
                    }`}
                    onClick={() => navigate(`/https/introduction${search}`)}
                  >
                    Introduction
                  </li>
                  <li
                    className={`p-2 rounded-md pl-8 cursor-pointer flex justify-between items-center text-gray-400 ${
                      location === `/https/generate-wallets${search}`
                        ? "bg-[rgba(10,77,21,0.38)] text-white"
                        : "hover:bg-[rgb(3,21,6)] dark:hover:bg-[#3333332e]"
                    }`}
                    onClick={() => navigate(`/https/generate-wallets${search}`)}
                  >
                    Generate Wallets{" "}
                  </li>
                  <li
                    className={`p-2 rounded-md pl-8 cursor-pointer flex justify-between items-center text-gray-400 ${
                      location === `/https/fund-wallets${search}`
                        ? "bg-[rgba(10,77,21,0.38)] text-white"
                        : "hover:bg-[rgb(3,21,6)] dark:hover:bg-[#3333332e]"
                    }`}
                    onClick={() => navigate(`/https/fund-wallets${search}`)}
                  >
                    Fund Wallets
                  </li>
                  <li
                    className={`p-2 rounded-md pl-8 cursor-pointer flex justify-between items-center text-gray-400 ${
                      location === `/https/claim-profits${search}`
                        ? "bg-[rgba(10,77,21,0.38)] text-white"
                        : "hover:bg-[rgb(3,21,6)] dark:hover:bg-[#3333332e]"
                    }`}
                    onClick={() => navigate(`/https/claim-profits${search}`)}
                  >
                    Claim Profits
                  </li>
                  <li
                    className={`p-2 rounded-md pl-8 cursor-pointer flex justify-between items-center text-gray-400 ${
                      location === `/https/create-ipfs${search}`
                        ? "bg-[rgba(10,77,21,0.38)] text-white"
                        : "hover:bg-[rgb(3,21,6)] dark:hover:bg-[#3333332e]"
                    }`}
                    onClick={() => navigate(`/https/create-ipfs${search}`)}
                  >
                    Create IPFS{" "}
                  </li>
                  <li
                    className={`p-2 rounded-md pl-8 cursor-pointer flex justify-between items-center text-gray-400 ${
                      location === `/https/create-lookup-table${search}`
                        ? "bg-[rgba(10,77,21,0.38)] text-white"
                        : "hover:bg-[rgb(3,21,6)] dark:hover:bg-[#3333332e]"
                    }`}
                    onClick={() =>
                      navigate(`/https/create-lookup-table${search}`)
                    }
                  >
                    Create Lookup Table
                  </li>
                  <li
                    className={`p-2 rounded-md pl-8 cursor-pointer flex justify-between items-center text-gray-400 ${
                      route === `pump-chart${search}`
                        ? "bg-[rgba(10,77,21,0.38)] text-white"
                        : "hover:bg-[rgb(3,21,6)] dark:hover:bg-[#3333332e]"
                    }`}
                    onClick={() => navigate(`/https/pump-chart${search}`)}
                  >
                    Pump Chart{" "}
                  </li>
                  <li
                    className={`p-2 rounded-md pl-8 cursor-pointer flex justify-between items-center text-gray-400 ${
                      route === `pump-token-info${search}`
                        ? "bg-[rgba(10,77,21,0.38)] text-white"
                        : "hover:bg-[rgb(3,21,6)] dark:hover:bg-[#3333332e]"
                    }`}
                    onClick={() => navigate(`/https/pump-token-info${search}`)}
                  >
                    Pump Token Info{" "}
                  </li>
                  <li
                    className={`p-2 rounded-md pl-8 cursor-pointer flex justify-between items-center text-gray-400 ${
                      route === `pump-bonding-curve${search}`
                        ? "bg-[rgba(10,77,21,0.38)] text-white"
                        : "hover:bg-[rgb(3,21,6)] dark:hover:bg-[#3333332e]"
                    }`}
                    onClick={() =>
                      navigate(`/https/pump-bonding-curve${search}`)
                    }
                  >
                    Pump Bonding Curve{" "}
                  </li>
                  <li
                    className={`p-2 rounded-md pl-8 cursor-pointer flex justify-between items-center text-gray-400 ${
                      route === `pump-token-bump${search}`
                        ? "bg-[rgba(10,77,21,0.38)] text-white"
                        : "hover:bg-[rgb(3,21,6)] dark:hover:bg-[#3333332e]"
                    }`}
                    onClick={() => navigate(`/https/pump-token-bump${search}`)}
                  >
                    Pump Token Bump
                  </li>
                  <li
                    className={`p-2 rounded-md pl-8 cursor-pointer flex justify-between items-center text-gray-400 ${
                      route === `pump-single-buy${search}`
                        ? "bg-[rgba(10,77,21,0.38)] text-white"
                        : "hover:bg-[rgb(3,21,6)] dark:hover:bg-[#3333332e]"
                    }`}
                    onClick={() => navigate(`/https/pump-single-buy${search}`)}
                  >
                    Pump Single Buy
                  </li>
                  <li
                    className={`p-2 rounded-md pl-8 cursor-pointer flex justify-between items-center text-gray-400 ${
                      route === `pump-single-sell${search}`
                        ? "bg-[rgba(10,77,21,0.38)] text-white"
                        : "hover:bg-[rgb(3,21,6)] dark:hover:bg-[#3333332e]"
                    }`}
                    onClick={() => navigate(`/https/pump-single-sell${search}`)}
                  >
                    Pump Single Sell
                  </li>
                  <li
                    className={`p-2 rounded-md pl-8 cursor-pointer flex justify-between items-center text-gray-400 ${
                      route === `pump-multi-buy${search}`
                        ? "bg-[rgba(10,77,21,0.38)] text-white"
                        : "hover:bg-[rgb(3,21,6)] dark:hover:bg-[#3333332e]"
                    }`}
                    onClick={() => navigate(`/https/pump-multi-buy${search}`)}
                  >
                    Pump Multi Buy
                  </li>
                  <li
                    className={`p-2 rounded-md pl-8 cursor-pointer flex justify-between items-center text-gray-400 ${
                      route === `pump-multi-sell${search}`
                        ? "bg-[rgba(10,77,21,0.38)] text-white"
                        : "hover:bg-[rgb(3,21,6)] dark:hover:bg-[#3333332e]"
                    }`}
                    onClick={() => navigate(`/https/pump-multi-sell${search}`)}
                  >
                    Pump Multi Sell
                  </li>
                  <li
                    className={`p-2 rounded-md pl-8 cursor-pointer flex justify-between items-center text-gray-400 ${
                      route === `pump-dump-all${search}`
                        ? "bg-[rgba(10,77,21,0.38)] text-white"
                        : "hover:bg-[rgb(3,21,6)] dark:hover:bg-[#3333332e]"
                    }`}
                    onClick={() => navigate(`/https/pump-dump-all${search}`)}
                  >
                    Pump Dump All
                  </li>
                  <li
                    className={`p-2 rounded-md pl-8 cursor-pointer flex justify-between items-center text-gray-400 ${
                      route === `pump-launch-token${search}`
                        ? "bg-[rgba(10,77,21,0.38)] text-white"
                        : "hover:bg-[rgb(3,21,6)] dark:hover:bg-[#3333332e]"
                    }`}
                    onClick={() =>
                      navigate(`/https/pump-launch-token${search}`)
                    }
                  >
                    Pump Launch Token
                  </li>
                  <li
                    className={`p-2 rounded-md pl-8 cursor-pointer flex justify-between items-center text-gray-400 ${
                      route === `pump-launch-bundle${search}`
                        ? "bg-[rgba(10,77,21,0.38)] text-white"
                        : "hover:bg-[rgb(3,21,6)] dark:hover:bg-[#3333332e]"
                    }`}
                    onClick={() =>
                      navigate(`/https/pump-launch-bundle${search}`)
                    }
                  >
                    Pump Launch Bundle
                  </li>
                  <li
                    className={`p-2 rounded-md pl-8 cursor-pointer flex justify-between items-center text-gray-400 ${
                      route === `dex-single-buy${search}`
                        ? "bg-[rgba(10,77,21,0.38)] text-white"
                        : "hover:bg-[rgb(3,21,6)] dark:hover:bg-[#3333332e]"
                    }`}
                    onClick={() => navigate(`/https/dex-single-buy${search}`)}
                  >
                    DEX Single Buy
                  </li>
                  <li
                    className={`p-2 rounded-md pl-8 cursor-pointer flex justify-between items-center text-gray-400 ${
                      route === `dex-single-sell${search}`
                        ? "bg-[rgba(10,77,21,0.38)] text-white"
                        : "hover:bg-[rgb(3,21,6)] dark:hover:bg-[#3333332e]"
                    }`}
                    onClick={() => navigate(`/https/dex-single-sell${search}`)}
                  >
                    DEX Single Sell
                  </li>
                  <li
                    className={`p-2 rounded-md pl-8 cursor-pointer flex justify-between items-center text-gray-400 ${
                      route === `dex-paid${search}`
                        ? "bg-[rgba(10,77,21,0.38)] text-white"
                        : "hover:bg-[rgb(3,21,6)] dark:hover:bg-[#3333332e]"
                    }`}
                    onClick={() => navigate(`/https/dex-paid${search}`)}
                  >
                    DEX Paid
                  </li>
                </ul>
              </ul>

              {/* Websocket List */}
              {/* <ul className={`mt-2`}>
                <span
                  className={`p-2 pl-4 cursor-pointer flex justify-start items-center gap-2 ${
                    category === "websocket" ? "text-green-500 " : ""
                  }`}
                  onClick={() => toggle("websocket", !expanded.websocket)}
                >
                  <FaNetworkWired />
                  WebSocket
                  <IoIosArrowDown
                    className={`text-[18px] transform transition ml-auto ${
                      expanded.websocket ? "rotate-90" : ""
                    }`}
                  />
                </span>
                <ul className={`${!expanded.websocket ? "" : "hidden"}`}>
                  <li
                    className={`p-2 rounded-md pl-8 cursor-pointer flex justify-between items-center text-gray-400 ${
                      location === `/websocket/introduction${search}`
                        ? "bg-[rgba(10,77,21,0.38)] text-white"
                        : "hover:bg-[rgb(3,21,6)] dark:hover:bg-[#3333332e]"
                    }`}
                    onClick={() => navigate(`/websocket/introduction${search}`)}
                  >
                    Introduction
                  </li>
                  <li
                    className={`p-2 rounded-md pl-8 cursor-pointer flex justify-start items-center text-gray-400 ${
                      location === `/websocket/token-migration${search}`
                        ? "bg-[rgba(10,77,21,0.38)] text-white"
                        : "hover:bg-[rgb(3,21,6)] dark:hover:bg-[#3333332e]"
                    }`}
                    onClick={() =>
                      navigate(`/websocket/token-migration${search}`)
                    }
                  >
                    Token Migration{" "}
                    <span className="text-gray-700 pl-1">(pump)</span>
                  </li>
                  <li
                    className={`p-2 rounded-md pl-8 cursor-pointer flex justify-start items-center text-gray-400 ${
                      location === `/websocket/token-creation${search}`
                        ? "bg-[rgba(10,77,21,0.38)] text-white"
                        : "hover:bg-[rgb(3,21,6)] dark:hover:bg-[#3333332e]"
                    }`}
                    onClick={() =>
                      navigate(`/websocket/token-creation${search}`)
                    }
                  >
                    Token Creation{" "}
                    <span className="text-gray-700 pl-1">(pump)</span>
                  </li>
                  <li
                    className={`p-2 rounded-md pl-8 cursor-pointer flex justify-start items-center text-gray-400 ${
                      location === `/websocket/token-trades${search}`
                        ? "bg-[rgba(10,77,21,0.38)] text-white"
                        : "hover:bg-[rgb(3,21,6)] dark:hover:bg-[#3333332e]"
                    }`}
                    onClick={() => navigate(`/websocket/token-trades${search}`)}
                  >
                    Token Trades{" "}
                    <span className="text-gray-700 pl-1">(pump)</span>
                  </li>
                  <li
                    className={`p-2 rounded-md pl-8 cursor-pointer flex justify-start items-center text-gray-400 ${
                      location === `/websocket/user-trades${search}`
                        ? "bg-[rgba(10,77,21,0.38)] text-white"
                        : "hover:bg-[rgb(3,21,6)] dark:hover:bg-[#3333332e]"
                    }`}
                    onClick={() => navigate(`/websocket/user-trades${search}`)}
                  >
                    User Trades{" "}
                    <span className="text-gray-700 pl-1">(pump)</span>
                  </li>
                  <li
                    className={`p-2 rounded-md pl-8 cursor-pointer flex justify-start items-center text-gray-400 ${
                      location === `/websocket/kol-trades${search}`
                        ? "bg-[rgba(10,77,21,0.38)] text-white"
                        : "hover:bg-[rgb(3,21,6)] dark:hover:bg-[#3333332e]"
                    }`}
                    onClick={() => navigate(`/websocket/kol-trades${search}`)}
                  >
                    KOL Trades{" "}
                    <span className="text-gray-700 pl-1">(pump)</span>
                  </li>
                  <li
                    className={`p-2 rounded-md pl-8 cursor-pointer flex justify-start items-center text-gray-400 ${
                      location === `/websocket/pool-creation${search}`
                        ? "bg-[rgba(10,77,21,0.38)] text-white"
                        : "hover:bg-[rgb(3,21,6)] dark:hover:bg-[#3333332e]"
                    }`}
                    onClick={() =>
                      navigate(`/websocket/pool-creation${search}`)
                    }
                  >
                    Pool Creation{" "}
                    <span className="text-gray-700 pl-1">(AMM)</span>
                  </li>
                  <li
                    className={`p-2 rounded-md pl-8 cursor-pointer flex justify-start items-center text-gray-400 ${
                      location === `/websocket/pool-trades${search}`
                        ? "bg-[rgba(10,77,21,0.38)] text-white"
                        : "hover:bg-[rgb(3,21,6)] dark:hover:bg-[#3333332e]"
                    }`}
                    onClick={() => navigate(`/websocket/pool-trades${search}`)}
                  >
                    Pool Trades{" "}
                    <span className="text-gray-700 pl-1">(AMM)</span>
                  </li>
                  <li
                    className={`p-2 rounded-md pl-8 cursor-pointer flex justify-start items-center text-gray-400 ${
                      location === `/websocket/pool-kol-trades${search}`
                        ? "bg-[rgba(10,77,21,0.38)] text-white"
                        : "hover:bg-[rgb(3,21,6)] dark:hover:bg-[#3333332e]"
                    }`}
                    onClick={() =>
                      navigate(`/websocket/pool-kol-trades${search}`)
                    }
                  >
                    KOL Pool Trades{" "}
                    <span className="text-gray-700 pl-1">(AMM)</span>
                  </li>
                </ul>
              </ul> */}

              {/* Tools List */}
              <ul className={`mt-2`}>
                <span
                  className={`p-2 pl-4 cursor-pointer flex justify-start items-center gap-2 ${
                    category === "tools" ? "text-green-500" : ""
                  }`}
                  onClick={() => toggle("tools", !expanded.tools)}
                >
                  <AiFillTool />
                  Tools
                  <IoIosArrowDown
                    className={`text-[18px] transform transition ml-auto ${
                      expanded.tools ? "rotate-90" : ""
                    }`}
                  />
                </span>
                <ul className={`${!expanded.tools ? "" : "hidden"}`}>
                  <li
                    className={`p-2 rounded-md pl-8 cursor-pointer flex justify-between items-center text-gray-400 ${
                      location === `/tools/lamport-converter${search}`
                        ? "bg-[rgba(10,77,21,0.38)] text-white"
                        : "hover:bg-[rgb(3,21,6)] dark:hover:bg-[#3333332e]"
                    }`}
                    onClick={() =>
                      navigate(`/tools/lamport-converter${search}`)
                    }
                  >
                    Lamport Converter
                  </li>
                  <li
                    className={`p-2 rounded-md pl-8 cursor-pointer flex justify-between items-center text-gray-400 ${
                      location === `/tools/wallet-generator${search}`
                        ? "bg-[rgba(10,77,21,0.38)] text-white"
                        : "hover:bg-[rgb(3,21,6)] dark:hover:bg-[#3333332e]"
                    }`}
                    onClick={() => navigate(`/tools/wallet-generator${search}`)}
                  >
                    Wallet Generator
                  </li>
                  <li
                    className={`p-2 rounded-md pl-8 cursor-pointer flex justify-between items-center text-gray-400 ${
                      location === `/tools/vanity-grinder${search}`
                        ? "bg-[rgba(10,77,21,0.38)] text-white"
                        : "hover:bg-[rgb(3,21,6)] dark:hover:bg-[#3333332e]"
                    }`}
                    onClick={() => navigate(`/tools/vanity-grinder${search}`)}
                  >
                    Vanity Grinder
                  </li>
                  <li
                    className={`p-2 rounded-md pl-8 cursor-pointer flex justify-between items-center text-gray-400 ${
                      location === `/tools/pump-token-info${search}`
                        ? "bg-[rgba(10,77,21,0.38)] text-white"
                        : "hover:bg-[rgb(3,21,6)] dark:hover:bg-[#3333332e]"
                    }`}
                    onClick={() => navigate(`/tools/pump-token-info${search}`)}
                  >
                    Pump Token Info
                  </li>
                </ul>
              </ul>
              {/* Fees */}
              <li
                className={`p-2  pl-4 cursor-pointer mt-2 flex justify-start items-center gap-2 ${
                  location === "/fees" ? "text-green-500" : ""
                }`}
                onClick={() => navigate("/fees")}
              >
                <TbZoomMoney />
                Fees
              </li>
            </>
          )}
          {activeMenu === "User" && (
            <>
              <ul className={`mt-2`}>
                <span
                  className={`p-2 pl-4 cursor-pointer flex justify-start items-center gap-2 relative hover:bg-[rgb(3,21,6)] dark:hover:bg-[#3333332e]]`}
                  onClick={() => navigate("/dex")}
                >
                  <GoArrowSwitch />
                  DEX
                  <span className="absolute bg-purple-500 text-[8px] text-white left-[68px] top-[3px] p-0.5 px-0.75 rounded-sm">
                    Beta
                  </span>
                </span>
                {/* <span
                  className={`p-2 pl-4 cursor-pointer flex justify-start items-center gap-2 relative hover:bg-[rgb(3,21,6)] dark:hover:bg-[#3333332e]]`}
                  onClick={() => navigate("/dexv2")}
                >
                  <GoArrowSwitch />
                  DEX V2
                  <span className="absolute bg-purple-500 text-[8px] text-white left-[90px] top-[3px] p-0.5 px-0.75 rounded-sm">
                    Beta
                  </span>
                </span> */}
                <span
                  className={`p-2 pl-4 cursor-pointer flex justify-start items-center gap-2 relative hover:bg-[rgb(3,21,6)] dark:hover:bg-[#3333332e]] mt-1`}
                  onClick={() => navigate("/bundler")}
                >
                  <FaCubesStacked />
                  Launch Bundler
                </span>
                <span
                  className={`p-2 pl-4 cursor-pointer flex justify-start items-center gap-2 relative hover:bg-[rgb(3,21,6)] dark:hover:bg-[#3333332e]] mt-1`}
                  onClick={() => navigate("/bump")}
                >
                  <IoRocketSharp />
                  Bump Bot
                </span>
              </ul>
            </>
          )}
        </ul>
      </div>
    </aside>
  );
};

export default SideBar;
