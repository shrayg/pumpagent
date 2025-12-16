import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { reqLimit } from "./utils/ratelimiter.js";
import { loadApiKeys } from "./utils/loadapikeys.js";
import { loadTradeWallets } from "./utils/loadtradewallets.js";
import { checkApiKey } from "./utils/checkapikey.js";
import generateWalletsRouter from "./routes/generatewallets.js";
import fundWalletsRouter from "./routes/fundwallets.js";
import pumpBondingCurveRouter from "./routes/pumpbondingcurve.js";
import pumpSingleBuyRouter from "./routes/pumpsinglebuy.js";
import pumpSingleSellRouter from "./routes/pumpsinglesell.js";
import createIPFSFRouter from "./routes/createipfs.js";
import createLookupTableRouter from "./routes/createlookuptable.js";
import extendLookupTableRouter from "./routes/extendlookuptable.js";
import pumpMultiBuyRouter from "./routes/pumpmultibuy.js";
import pumpMultiSellRouter from "./routes/pumpmultisell.js";
import dexSingleBuyRouter from "./routes/dexsinglebuy.js";
import dexSingleSellRouter from "./routes/dexsinglesell.js";
import dexPaidRouter from "./routes/dexpaid.js";
import pumpDumpAllRouter from "./routes/pumpdumpall.js";
import pumpTokenBumpRouter from "./routes/pumptokenbump.js";
import pumpLaunchTokenRouter from "./routes/pumplaunchtoken.js";
import pumpLaunchBundleRouter from "./routes/pumplaunchbundle.js";
import generateApiKeyRouter from "./routes/generateapikey.js";
import signUpRouter from "./routes/signup.js";
import getWalletBalanceRouter from "./routes/getwalletbalance.js";
import claimProfitsRouter from "./routes/claimprofits.js";
import getTierPaymentWalletRouter from "./routes/gettierpaymentwallet.js";
import confirmTierPaymentRouter from "./routes/confirmtierpayment.js";
import getTierSolPriceRouter from "./routes/gettiersolprice.js";
import userWithdrawSolRouter from "./routes/userwithdrawsol.js";
import userWithdrawUSDCRouter from "./routes/userwithdrawusdc.js";
import updateDiscordProfileRouter from "./routes/updatediscordprofile.js";
import pumpTokenInfoRouter from "./routes/pumptokeninfo.js";
import landingInfoRouter from "./routes/landing.js";
import { loadTotalRequests } from "./utils/requests.js";
import candlesticksRouter from "./routes/candlesticks.js";
import createKolTradeWalletRouter from "./routes/createkoltradewallet.js";
import loadKolTraderRouter from "./routes/loadkoltrader.js";
import getSolBalanceRouter from "./routes/getsolbalance.js";
import updateKolTradeStrategies from "./routes/updatekoltradestrategies.js";
import kolTraderBuyRouter from "./routes/koltraderbuy.js";
import getTokenBalancesRouter from "./routes/gettokenbalances.js";
import loadOpenPositionsRouter from "./routes/loadopenpositions.js";
import kolTraderSellRouter from "./routes/koltradersell.js";
import commentThreadRouter from "./routes/commentthread.js";
import koltraderBumpRouter from "./routes/koltraderbump.js";
import pumpswapCandlesRouter from "./routes/pumpswapcandlesticks.js";
import koltraderDEXSellRouter from "./routes/koltraderdexsell.js";
import koltraderDEXBuyRouter from "./routes/koltraderdexbuy.js";
import userWithdrawKoltraderFundsRouter from "./routes/koltraderwithdrawsol.js";
import getSolBalancesRouter from "./routes/getsolbalances.js";
import uploadImageRouter from "./routes/uploadimage.js";
import getHoldersForMintRouter from "./routes/getholdersformint.js";
import getMintBalancesForHolders from "./routes/getmintbalancesforwallets.js";
import createPumpFunBuyTransactionRouter from "./routes/createPumpFunBuyTransactionRouter.js";
import confirmTransactionRounter from "./routes/confirmtransaction.js";
import createPumpFunSellTransactionRouter from "./routes/createPumpFunSellTransactionRouter.js";
import confirmBundleRouter from "./routes/confirmbundle.js";
import reclaimRentRouter from "./routes/reclaimrent.js";
import reclaimSolRouter from "./routes/reclaimsol.js";
import getAssetInfoRouter from "./routes/getassetinfo.js";
import tokenBumpRouter from "./routes/tokenbump.js";
import bonkLaunchBundleRouter from "./routes/bonklaunchbundle.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json({ limit: "20mb" }));
app.use(cors());

app.use("/generate-wallets", checkApiKey, reqLimit(), generateWalletsRouter);
app.use("/fund-wallets", checkApiKey, reqLimit(), fundWalletsRouter);
app.use("/pump-bonding-curve", checkApiKey, reqLimit(), pumpBondingCurveRouter);
app.use("/pump-single-buy", checkApiKey, reqLimit(), pumpSingleBuyRouter);
app.use("/koltrader-buy", checkApiKey, reqLimit(), kolTraderBuyRouter);
app.use("/koltrader-sell", checkApiKey, reqLimit(), kolTraderSellRouter);
app.use("/pump-multi-buy", checkApiKey, reqLimit(), pumpMultiBuyRouter);
app.use("/pump-multi-sell", checkApiKey, reqLimit(), pumpMultiSellRouter);
app.use("/pump-dump-all", checkApiKey, reqLimit(), pumpDumpAllRouter);
app.use("/pump-single-sell", checkApiKey, reqLimit(), pumpSingleSellRouter);
app.use("/create-ipfs", checkApiKey, reqLimit(), createIPFSFRouter);
app.use(
  "/create-lookup-table",
  checkApiKey,
  reqLimit(),
  createLookupTableRouter
);
app.use(
  "/extend-lookup-table",
  checkApiKey,
  reqLimit(),
  extendLookupTableRouter
);
app.use("/dex-single-buy", checkApiKey, reqLimit(), dexSingleBuyRouter);
app.use("/dex-single-sell", checkApiKey, reqLimit(), dexSingleSellRouter);
app.use("/dex-paid", checkApiKey, reqLimit(), dexPaidRouter);
app.use("/pump-token-bump", checkApiKey, reqLimit(), pumpTokenBumpRouter);
app.use("/token-bump", reqLimit(), tokenBumpRouter);
app.use("/pump-launch-token", checkApiKey, reqLimit(), pumpLaunchTokenRouter);
app.use("/pump-launch-bundle", checkApiKey, reqLimit(), pumpLaunchBundleRouter);
app.use("/bonk-launch-bundle", checkApiKey, reqLimit(), bonkLaunchBundleRouter);
app.use("/generate-api-key", reqLimit(), generateApiKeyRouter);
app.use("/sign-up", reqLimit(), signUpRouter);
app.use("/get-balance", checkApiKey, reqLimit(), getWalletBalanceRouter);
app.use("/user-withdraw-sol", reqLimit(), userWithdrawSolRouter);
app.use("/user-withdraw-usdc", reqLimit(), userWithdrawUSDCRouter);
app.use("/pump-token-info", reqLimit(), pumpTokenInfoRouter);
app.use("/token-info", checkApiKey, reqLimit(), pumpTokenInfoRouter);
app.use("/landing-info", reqLimit(), landingInfoRouter);
app.use("/claim-profits", checkApiKey, reqLimit(), claimProfitsRouter);
app.use(
  "/get-tier-payment-wallet",
  checkApiKey,
  reqLimit(),
  getTierPaymentWalletRouter
);
app.use(
  "/confirm-tier-payment",
  checkApiKey,
  reqLimit(),
  confirmTierPaymentRouter
);
app.use("/tier-sol-price", checkApiKey, reqLimit(), getTierSolPriceRouter);
app.use(
  "/update-discord-profile",
  checkApiKey,
  reqLimit(),
  updateDiscordProfileRouter
);
app.use("/pump-chart", checkApiKey, reqLimit(), candlesticksRouter);
app.use("/pumpswap-chart", reqLimit(), pumpswapCandlesRouter);
app.use("/create-koltrade-wallet", reqLimit(), createKolTradeWalletRouter);
app.use("/load-koltrader", reqLimit(), loadKolTraderRouter);
app.use("/sol-balance", checkApiKey, reqLimit(), getSolBalanceRouter);
app.use(
  "/update-koltrade-strategies",
  checkApiKey,
  reqLimit(),
  updateKolTradeStrategies
);
app.use("/token-balances", checkApiKey, reqLimit(), getTokenBalancesRouter);
app.use(
  "/load-openpositions",
  checkApiKey,
  reqLimit(),
  loadOpenPositionsRouter
);
app.use("/comment-thread", checkApiKey, reqLimit(), commentThreadRouter);
app.use("/koltrader-bump", checkApiKey, reqLimit(), koltraderBumpRouter);
app.use("/koltrader-dex-sell", checkApiKey, reqLimit(), koltraderDEXSellRouter);
app.use("/koltrader-dex-buy", checkApiKey, reqLimit(), koltraderDEXBuyRouter);
app.use(
  "/koltrader-withdraw",
  checkApiKey,
  reqLimit(),
  userWithdrawKoltraderFundsRouter
);
app.use("/sol-balances", reqLimit(), getSolBalancesRouter);
app.use("/upload-image", checkApiKey, reqLimit(), uploadImageRouter);
app.use("/mint-holders", checkApiKey, reqLimit(), getHoldersForMintRouter);
app.use(
  "/get-mint-balances-for-holders",
  reqLimit(),
  getMintBalancesForHolders
);
app.use(
  "/create-pumpfun-buy-transaction",
  checkApiKey,
  reqLimit(),
  createPumpFunBuyTransactionRouter
);
app.use(
  "/create-pumpfun-sell-transaction",
  checkApiKey,
  reqLimit(),
  createPumpFunSellTransactionRouter
);
app.use(
  "/confirm-transaction",
  checkApiKey,
  reqLimit(),
  confirmTransactionRounter
);
app.use("/confirm-bundle", checkApiKey, reqLimit(), confirmBundleRouter);
app.use("/reclaim-rent", checkApiKey, reqLimit(), reclaimRentRouter);
app.use("/reclaim-sol", checkApiKey, reqLimit(), reclaimSolRouter);
app.use("/asset-info", checkApiKey, reqLimit(), getAssetInfoRouter);

await loadTotalRequests();
await loadApiKeys();
await loadTradeWallets();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
