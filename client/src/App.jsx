import { Routes, Route, useLocation } from "react-router-dom";
import { Suspense, lazy, useState } from "react";
import ScrollToTop from "./utils/ScrollToTop";
import TopNav from "./components/TopNav/TopNav";
import SideBar from "./components/SideBar/SideBar";
import Footer from "./components/Footer/Footer";
import CookieBanner from "./components/CookieBanner/CookieBanner";
import { Helmet } from "react-helmet";
import { APP_ROUTES, isDocsRoute } from "./utils/navigation";

// Lazy-loaded components
const Home = lazy(() => import("./components/Routes/Home/Home"));
const VanityGrinder = lazy(() =>
  import("./components/Routes/Tools/VanityGrinder")
);
const SignIn = lazy(() => import("./components/SignIn/SignIn"));
const Dashboard = lazy(() => import("./components/Dashboard/Dashboard"));
const Introduction = lazy(() =>
  import("./components/Routes/HTTPS/Introduction")
);
const GenerateWallets = lazy(() =>
  import("./components/Routes/HTTPS/GenerateWallets")
);
const FundWallets = lazy(() => import("./components/Routes/HTTPS/FundWallets"));
const ClaimProfits = lazy(() =>
  import("./components/Routes/HTTPS/ClaimProfits")
);
const CreateIPFS = lazy(() => import("./components/Routes/HTTPS/CreateIPFS"));
const CreateLookupTable = lazy(() =>
  import("./components/Routes/HTTPS/CreateLookupTable")
);
const PumpChart = lazy(() => import("./components/Routes/HTTPS/PumpChart"));
const PumpTokenInfo = lazy(() =>
  import("./components/Routes/HTTPS/PumpTokenInfo")
);

const PumpTokenInfoApp = lazy(() =>
  import("./components/Routes/Tools/PumpTokenInfo")
);
const PumpBondingCurve = lazy(() =>
  import("./components/Routes/HTTPS/PumpBondingCurve")
);
const PumpTokenBump = lazy(() =>
  import("./components/Routes/HTTPS/PumpTokenBump")
);
const PumpSingleBuy = lazy(() =>
  import("./components/Routes/HTTPS/PumpSingleBuy")
);
const PumpSingleSell = lazy(() =>
  import("./components/Routes/HTTPS/PumpSingleSell")
);
const PumpMultiBuy = lazy(() =>
  import("./components/Routes/HTTPS/PumpMultiBuy")
);
const PumpMultiSell = lazy(() =>
  import("./components/Routes/HTTPS/PumpMultiSell")
);
const PumpDumpAll = lazy(() => import("./components/Routes/HTTPS/PumpDumpAll"));
const PumpLaunchToken = lazy(() =>
  import("./components/Routes/HTTPS/PumpLaunchToken")
);
const PumpLaunchBundle = lazy(() =>
  import("./components/Routes/HTTPS/PumpLaunchBundle")
);
const DexSingleBuy = lazy(() =>
  import("./components/Routes/HTTPS/DexSingleBuy")
);
const DexSingleSell = lazy(() =>
  import("./components/Routes/HTTPS/DexSingleSell")
);
const DexPaid = lazy(() => import("./components/Routes/HTTPS/DexPaid"));
const WebSocketIntroduction = lazy(() =>
  import("./components/Routes/WebSocket/WebSocketIntroduction")
);
const TokenMigration = lazy(() =>
  import("./components/Routes/WebSocket/TokenMigration")
);
const TokenCreation = lazy(() =>
  import("./components/Routes/WebSocket/TokenCreation")
);
const TokenTrades = lazy(() =>
  import("./components/Routes/WebSocket/TokenTrades")
);
const UserTrades = lazy(() =>
  import("./components/Routes/WebSocket/UserTrades")
);
const KOLTrades = lazy(() => import("./components/Routes/WebSocket/KOLTrades"));
const PoolCreation = lazy(() =>
  import("./components/Routes/WebSocket/PoolCreation")
);
const PoolTrades = lazy(() =>
  import("./components/Routes/WebSocket/PoolTrades")
);
const PoolKOLTrades = lazy(() =>
  import("./components/Routes/WebSocket/PoolKOLTrades")
);
const LamportConverter = lazy(() =>
  import("./components/Routes/Tools/LamportConverter")
);
const WalletGenerator = lazy(() =>
  import("./components/Routes/Tools/WalletGenerator")
);
const Fees = lazy(() => import("./components/Routes/Fees/Fees"));
const Privacy = lazy(() => import("./components/Routes/Privacy/Privacy"));

// Lazy-loaded apps
const KOLTrader = lazy(() =>
  import("./components/Routes/Apps/KOLTrader/KOLTrader")
);
const DexV2 = lazy(() => import("./components/Routes/Apps/DexV2/DexV2"));
const Bundler = lazy(() => import("./components/Routes/Apps/Bundler/Bundler"));
const Bump = lazy(() => import("./components/Routes/Apps/Bump/Bump"));

const App = () => {
  const { pathname } = useLocation();
  const [navOpen, setNavOpen] = useState(false);

  const isAppRoute = APP_ROUTES.includes(pathname);
  const docked = isDocsRoute(pathname);

  return (
    <div className="bg-canvas text-fg text-6xl font-medium font-sans min-h-screen flex flex-col">
      <Helmet>
        <title>Pump Agent · The pump.fun API for builders and traders</title>
        <meta
          name="description"
          content="Pump Agent is a Solana API and app suite for pump.fun: launch and bundle tokens, trade on pump.fun and DEX pools, manage wallets, and stream market data."
        />
        <meta property="og:title" content="Pump Agent · The pump.fun API" />
        <meta property="og:site_name" content="Pump Agent" />
        <meta
          property="og:description"
          content="Launch, bundle, and trade pump.fun tokens from one API, plus a trading terminal, launch bundler, and bump bot."
        />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Pump Agent · The pump.fun API" />
      </Helmet>

      <CookieBanner />
      <TopNav navOpen={navOpen} setNavOpen={setNavOpen} />
      <ScrollToTop />

      <div className="flex flex-col flex-1 w-full">
        <div className="flex flex-1 pt-16">
          <SideBar navOpen={navOpen} docked={docked} />

          <main className="flex-1 min-w-0 flex flex-col">
            <Suspense fallback={<div className="p-4" />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/signin" element={<SignIn />} />

                {/* Apps */}
                <Route path="/dex" element={<KOLTrader />} />
                <Route path="/dexv2" element={<DexV2 />} />
                <Route path="/bundler" element={<Bundler />} />
                <Route path="/bump" element={<Bump />} />

                {/* HTTPS Routes */}
                <Route path="/https/introduction" element={<Introduction />} />
                <Route
                  path="/https/generate-wallets"
                  element={<GenerateWallets />}
                />
                <Route path="/https/fund-wallets" element={<FundWallets />} />
                <Route path="/https/claim-profits" element={<ClaimProfits />} />
                <Route path="/https/create-ipfs" element={<CreateIPFS />} />
                <Route
                  path="/https/create-lookup-table"
                  element={<CreateLookupTable />}
                />
                <Route path="/https/pump-chart" element={<PumpChart />} />
                <Route
                  path="/https/pump-token-info"
                  element={<PumpTokenInfo />}
                />
                <Route
                  path="/https/pump-bonding-curve"
                  element={<PumpBondingCurve />}
                />
                <Route
                  path="/https/pump-token-bump"
                  element={<PumpTokenBump />}
                />
                <Route
                  path="/https/pump-single-buy"
                  element={<PumpSingleBuy />}
                />
                <Route
                  path="/https/pump-single-sell"
                  element={<PumpSingleSell />}
                />
                <Route
                  path="/https/pump-multi-buy"
                  element={<PumpMultiBuy />}
                />
                <Route
                  path="/https/pump-multi-sell"
                  element={<PumpMultiSell />}
                />
                <Route path="/https/pump-dump-all" element={<PumpDumpAll />} />
                <Route
                  path="/https/pump-launch-token"
                  element={<PumpLaunchToken />}
                />
                <Route
                  path="/https/pump-launch-bundle"
                  element={<PumpLaunchBundle />}
                />
                <Route
                  path="/https/dex-single-buy"
                  element={<DexSingleBuy />}
                />
                <Route
                  path="/https/dex-single-sell"
                  element={<DexSingleSell />}
                />
                <Route path="/https/dex-paid" element={<DexPaid />} />

                {/* WebSocket Routes */}
                <Route
                  path="/websocket/introduction"
                  element={<WebSocketIntroduction />}
                />
                <Route
                  path="/websocket/token-migration"
                  element={<TokenMigration />}
                />
                <Route
                  path="/websocket/token-creation"
                  element={<TokenCreation />}
                />
                <Route
                  path="/websocket/token-trades"
                  element={<TokenTrades />}
                />
                <Route path="/websocket/user-trades" element={<UserTrades />} />
                <Route path="/websocket/kol-trades" element={<KOLTrades />} />
                <Route
                  path="/websocket/pool-creation"
                  element={<PoolCreation />}
                />
                <Route path="/websocket/pool-trades" element={<PoolTrades />} />
                <Route
                  path="/websocket/pool-kol-trades"
                  element={<PoolKOLTrades />}
                />

                {/* Tools */}
                <Route
                  path="/tools/lamport-converter"
                  element={<LamportConverter />}
                />
                <Route
                  path="/tools/wallet-generator"
                  element={<WalletGenerator />}
                />
                <Route
                  path="/tools/pump-token-info"
                  element={<PumpTokenInfoApp />}
                />
                <Route
                  path="/tools/vanity-grinder"
                  element={<VanityGrinder />}
                />

                {/* Misc */}
                <Route path="/fees" element={<Fees />} />
                <Route path="/privacy" element={<Privacy />} />
              </Routes>
            </Suspense>
          </main>
        </div>
        {!isAppRoute && <Footer />}
      </div>
    </div>
  );
};

export default App;
