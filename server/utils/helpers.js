import axios from "axios";
import {
  heliusConnection,
  heliusRPCURL,
  proxies,
  solConnection,
  solRPCURL,
  TIP_ACCOUNTS,
  userAgents,
} from "./constants.js";
import { PublicKey } from "@solana/web3.js";
import { AccountLayout } from "@solana/spl-token";
import { BorshAccountsCoder } from "@coral-xyz/anchor";
import IDL from "../utils/pumpswapidl.json" with { type: "json" };


// Pump program
const PUMP_PROGRAM_ID = new PublicKey("6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P");
// PumpSwap program
const PUMP_AMM_PROGRAM_ID = new PublicKey("pAMMBay6oceH9fJKBRHGP5D4bD4sWpmSwMn52FMfXEA");



export const getRandomProxy = () => {
  const index = Math.floor(Math.random() * proxies.length);
  return proxies[index];
};

export const getCoinData = async (mintStr) => {
  try {
    const config = {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:125.0) Gecko/20100101 Firefox/125.0",
        Accept: "*/*",
        "Accept-Language": "en-US,en;q=0.5",
        "Accept-Encoding": "gzip, deflate, br",
        Referer: "https://www.pump.fun/",
        Origin: "https://www.pump.fun",
        Connection: "keep-alive",
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "cross-site",
        "If-None-Match": 'W/"43a-tWaCcS4XujSi30IFlxDCJYxkMKg"',
      },
    };

    const response = await axios.get(
      `https://frontend-api-v3.pump.fun/coins/${mintStr}`,
      config
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching coin data:", error);
    return null;
  }
};

export const calculateSellAmountInSol = (
  sellAmount,
  virtualSolReserves,
  virtualTokenReserves
) => Number(sellAmount) * (virtualSolReserves / virtualTokenReserves);

export const base64ToBlob = (base64, contentType = "", sliceSize = 512) => {
  const byteCharacters = atob(base64.split(",")[1]);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);
    const byteNumbers = new Array(slice.length);

    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  return new Blob(byteArrays, { type: contentType });
};

export const chunkArray = (array, size) => {
  return Array.from({ length: Math.ceil(array.length / size) }, (v, i) =>
    array.slice(i * size, i * size + size)
  );
};

export const getRandomTipAccount = () =>
  TIP_ACCOUNTS[Math.floor(Math.random() * TIP_ACCOUNTS.length)];

export const getRandomPriority = () => {
  const priorities = ["u=0, i", "u=1, i", "u=1, r", "u=0.5, i"];
  const index = Math.floor(Math.random() * priorities.length);
  return priorities[index];
};

export const getRandomUserAgent = () => {
  const index = Math.floor(Math.random() * userAgents.length);
  return userAgents[index];
};

export const getAccountTokenValues = async (ataArray) => {
  try {
    const request = await fetch(solRPCURL(), {
      method: "POST",
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: "1",
        method: "getMultipleAccounts",
        params: [ataArray],
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const response = await request.json();

    // console.log(response.result);
    const decimals = 6n;
    const divisor = 10n ** decimals;
    return response.result.value.map((account) => {
      const base64Data = account.data[0];
      const decoded = Buffer.from(base64Data, "base64");
      const accountInfo = AccountLayout.decode(decoded);
      const rawAmount = BigInt(accountInfo.amount.toString());
      const wholeAmount = Number(rawAmount) / Number(divisor);
      return {
        owner: new PublicKey(accountInfo.owner).toBase58(),
        amount: wholeAmount,
      };
    });
  } catch (err) {
    console.error(err);
  }
};

const parse = (k) => k.split("-").slice(1, -1);

export const updateAPIKey = (k) => {
  const parsed = parse(k);
  parsed.unshift(randomChars());
  parsed.push(randomChars());
  return parsed.join("-");
};

const chunkString = (str) => {
  const chunkSize = Math.ceil(str.length / 4);
  let chunks = [];

  for (let i = 0; i < 4; i++) {
    chunks.push(str.slice(i * chunkSize, (i + 1) * chunkSize));
  }

  return chunks;
};

const characters =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

const randomChars = (length = 32) => {
  let result = "";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

export const createNewAPIKey = (pub) => {
  const chunked = chunkString(pub);
  chunked.unshift(randomChars());
  chunked.push(randomChars());
  return chunked.join("-");
};

export const getPriorityFeeEstimate = async (
  serializedTransaction,
  priorityLevel
) => {
  const response = await fetch(heliusRPCURL(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: "1",
      method: "getPriorityFeeEstimate",
      params: [
        {
          transaction: serializedTransaction,
          options: {
            priorityLevel: priorityLevel,
            // recommended: true,
          },
        },
      ],
    }),
  });

  const result = await response.json();

  if (result.error) {
    throw new Error(`Fee estimation failed: ${JSON.stringify(result.error)}`);
  }

  return result.result.priorityFeeEstimate;
};

let cachedBlockhash = null;
let blockhashTimestamp = 0;
const BLOCKHASH_VALIDITY_MS = 30 * 1000; // ~30 seconds

export async function getCachedBlockhash() {
  const now = Date.now();
  if (cachedBlockhash && now - blockhashTimestamp < BLOCKHASH_VALIDITY_MS) {
    return cachedBlockhash;
  }
  const { blockhash } = await heliusConnection().getLatestBlockhash("finalized");
  cachedBlockhash = blockhash;
  blockhashTimestamp = now;
  return blockhash;
}

export const sendJitoTransaction = async (bundleTxs, delay = 200) => {
  try {
    const jitoResponse = await fetch(
      "https://mainnet.block-engine.jito.wtf/api/v1/transactions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 1,
          method: "sendTransaction",
          params: [bundleTxs, { encoding: "base58" }],
        }),
      }
    );

    const result = await jitoResponse.json();
    const signature = result.result; // tx id
    const bundleId = jitoResponse.headers.get("x-bundle-id");

    console.log("Tx Signature:", signature);
    console.log("Jito Bundle ID:", bundleId);

    if (!signature) return null;

    // Poll for confirmation
    const maxAttempts = 20;
    for (let i = 0; i < maxAttempts; i++) {
      const status = await heliusConnection().getSignatureStatus(signature);
      const confirmation = status?.value;
      if (
        confirmation?.confirmationStatus === "confirmed" ||
        confirmation?.confirmationStatus === "finalized"
      ) {
        if (confirmation.err === null) {
          console.log("✅ Transaction succeeded");
          return signature;
        } else {
          console.error("❌ Transaction failed with error:", confirmation.err);
          return null;
        }
      }
      console.log("Attempt: ", i);
      await new Promise((r) => setTimeout(r, delay)); // wait 1 sec
    }

    console.warn("⏱️ Transaction not confirmed after timeout");
    return null;
  } catch (err) {
    console.error("🔥 Failed to send Jito bundle:", err);
    return null;
  }
};

export const sendJitoBundle = async (bundleTxs, delay = 200) => {
  try {
    const jitoResponse = await fetch(
      "https://mainnet.block-engine.jito.wtf/api/v1/bundles",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 1,
          method: "sendBundle",
          params: [bundleTxs, { encoding: "base58" }],
        }),
      }
    );

    const result = await jitoResponse.json();
    console.log("Error: ", result?.error?.message);
    if (result?.error?.message) {
      return result?.error?.message;
    }
    const bundleId = result.result; // This is the SHA-256 hash of the bundle’s transaction signatures
    if (!bundleId) {
      console.error("❌ Failed to receive a bundle ID from Jito.");
      return null;
    }

    console.log("📦 Jito Bundle ID:", bundleId);

    // Poll for confirmation
    const maxAttempts = 10;
    for (let i = 0; i < maxAttempts; i++) {
      const statusResponse = await fetch(
        "https://mainnet.block-engine.jito.wtf/api/v1/getBundleStatuses",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            jsonrpc: "2.0",
            id: 1,
            method: "getBundleStatuses",
            params: [[bundleId]],
          }),
        }
      );

      const statusResult = await statusResponse.json();
      const bundleStatus = statusResult?.result?.value?.[0];
      console.log("Bundle status: ", bundleStatus);
      if (bundleStatus) {
        const { confirmation_status, err } = bundleStatus;

        console.log(`⏳ Attempt ${i + 1}: Status = ${confirmation_status}`);

        if (
          confirmation_status === "confirmed" ||
          confirmation_status === "finalized"
        ) {
          const success = err && "Ok" in err && err.Ok === null;

          if (success) {
            console.log("✅ Bundle confirmed!");
            return bundleId;
          } else {
            console.error("❌ Bundle failed:", err);
            return null;
          }
        }
      }

      await new Promise((r) => setTimeout(r, delay)); // Wait before retrying
    }

    console.warn("⏱️ Bundle not confirmed after timeout");
    return null;
  } catch (err) {
    console.error("🔥 Failed to send base58 bundle:", err);
    return null;
  }
};

export const getTokenCurve = async (ca, program) => {
  try {
    // Derive the bonding curve PDA
    const [bondingCurvePda] = PublicKey.findProgramAddressSync(
      [Buffer.from("bonding-curve"), new PublicKey(ca).toBuffer()],
      program.programId
    );

    // Fetch the bonding curve account
    const bondingCurveAccount = await program.account.bondingCurve.fetch(
      bondingCurvePda
    );

    return bondingCurveAccount;
  } catch (error) {
    console.error("Error fetching bonding curve:", error);
    throw error;
  }
};

export const getMintFromPool = async (pool) => {
  const coder = new BorshAccountsCoder(IDL);
  const poolAddress = new PublicKey(pool);
  try {
    // Fetch the pool account data
    const accountInfo = await solConnection().getAccountInfo(poolAddress);

    if (!accountInfo) {
      throw new Error("Pool account not found");
    }

    // Decode the account data
    const poolData = coder.decode("Pool", accountInfo.data);
    return poolData.base_mint.toBase58();
  } catch (error) {
    console.error("Error fetching pool data:", error);
    throw error;
  }
};

export const waitForFinalizedTransaction = async (
  txid,
  retries = 20,
  delayMs = 500
) => {
  for (let i = 0; i < retries; i++) {
    const tx = await heliusConnection().getTransaction(txid, {
      commitment: "finalized",
      maxSupportedTransactionVersion: 0,
    });
    if (tx) return tx;
    await new Promise((r) => setTimeout(r, delayMs));
  }
  throw new Error("❌ Transaction not found after retries.");
};



export function globalVolumeAccumulatorPda() {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("global_volume_accumulator")],
    PUMP_PROGRAM_ID
  );
}

export function userVolumeAccumulatorPda(user, programId = PUMP_PROGRAM_ID) {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("user_volume_accumulator"), user.toBuffer()],
    programId
  );
}


export function globalVolumeAccumulatorAmmPda() {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("global_volume_accumulator")],
    PUMP_AMM_PROGRAM_ID
  );
}

export function userVolumeAccumulatorAmmPda(user, programId = PUMP_AMM_PROGRAM_ID) {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("user_volume_accumulator"), user.toBuffer()],
    programId
  );
}
