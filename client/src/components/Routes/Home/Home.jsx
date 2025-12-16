import Grid from "../../../assets/Grid.svg";
import { useDarkMode } from "../../../utils/darkmodecontext.jsx";
import { useState } from "react";
import { lazy, Suspense } from "react";
import CanvasContainer from "./Canvas.jsx";
import { useLocation, useNavigate } from "react-router-dom";
const Speed = lazy(() => import("./Speed.jsx"));

import CallToAction from "./CallToAction.jsx";
import Vial from "../../../assets/Logo.webp";
import StructuredData from "../../SEO/StructuredData";

const devTiles = [
  {
    title: "HTTPS",
    copy: "Beginner friendly endpoints to build various applications.",
    path: "/https/introduction",
    cta: "Get Started",
  },
  // {
  //   title: "WebSocket",
  //   copy: "Lightning fast pump.fun data feeds.",
  //   path: "/websocket/introduction",
  //   cta: "Get Started",
  // },
  {
    title: "Community",
    copy: "Don't build alone! Join our community.",
    path: import.meta.env.VITE_DISCORD_URL,
    cta: "Join Discord",
    blank: true,
  },
];

const userTiles = [
  {
    title: "DEX",
    copy: "Realtime Charts, Relevant Pairs, Low Fees.",
    path: "dex",
    cta: "Launch DEX",
  },
  {
    title: "Launch Bundler",
    copy: "Launch a token on pump.fun with 20 wallets for only 0.1 SOL.",
    path: "bundler",
    cta: "Launch Bundler",
  },
];

export default function Home({ activeMenu }) {
  const navigate = useNavigate();
  const search = useLocation().search;
  const { darkMode } = useDarkMode();
  const [config, setConfig] = useState({
    crossCount: window.innerWidth > 600 ? 30 : 15,
    speedFactor: 0.4,
    sizeVariation: true,
    allowInteraction: true,
  });

  const isDev = activeMenu === "Developer";
  const arrayToMap = isDev ? devTiles : userTiles;

  return (
    <>
      <StructuredData />
      <div className="w-full flex justify-start lg:justify-start flex-col relative items-center flex-1 p-4 text-greener pt-40 pb-40 overflow-hidden">
        <h2 className="pb-3 flex justify-center items-center font-pixel pt-14 lg:pt-0 z-3000">
          <img src={Vial} alt="Vial" className="w-12 h-12" />{" "}
          <span className="text-white dark:text-black z-200">Pump</span>Vial
        </h2>

        <span className="text-white dark:text-black px-4 text-lg md:text-[24px] z-200 text-center">
          {!isDev && (
            <>Enhance Your Solana Trading Experience with Advanced Tools</>
          )}
          {isDev && (
            <>Build Powerful Solana Applications With a Single Free Toolkit</>
          )}
        </span>

        <div className="flex flex-col lg:flex-row py-10 z-200 gap-4">
          {arrayToMap.map((tile) => (
            <div
              className="xl:w-60 w-full h-50 border border-gray-800 dark:border-gray-200 bg-tile dark:bg-white hover:bg-[#202020] dark:hover:bg-[#fff] rounded-md p-4 flex relative flex-col items-center gap-8 "
              key={tile.title}
            >
              <span className="text-[16px] z-10 block text-start w-full">
                {tile.title}
              </span>
              <p className="text-white dark:text-black text-[14px] z-10 flex-1 h-full flex justify-center items-center text-center">
                {tile.copy}
              </p>
              <button
                className="bg-green-900 transition hover:bg-green-700 z-10 text-white text-[14px] w-initial p-2 mt-auto ml-auto cursor-pointer"
                onClick={() =>
                  tile.blank
                    ? window.open(tile.path, "_blank", "noopener,noreferrer")
                    : navigate(`${tile.path}${search}`)
                }
              >
                {tile.cta}
              </button>
            </div>
          ))}
        </div>

        <div
          className="w-full absolute pointer-events-none inset-0 overflow-hidden"
          style={{
            backgroundImage: darkMode ? "none" : `url(${Grid})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.75,
            height: "215%", // keep your height logic from img, or adjust as needed
            zIndex: 50,
          }}
        >
          <CanvasContainer config={config} />
          <div
            className={`dark:bg-white absolute w-full h-full z-100 ${
              darkMode ? " bg-white" : ""
            }`}
          ></div>
        </div>
      </div>
      {isDev && (
        <>
          <Suspense fallback={<div></div>}>
            <Speed />
          </Suspense>
          <CallToAction />
        </>
      )}
    </>
  );
}
