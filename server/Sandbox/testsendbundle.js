import bs58 from "bs58";
import {
  Keypair,
  SystemProgram,
  LAMPORTS_PER_SOL,
  TransactionMessage,
  VersionedTransaction,
  Connection,
  PublicKey,
} from "@solana/web3.js";
import { solConnection } from "../utils/constants.js";
import { getRandomTipAccount, sendJitoBundle } from "../utils/helpers.js";

// --- Setup
const connection = solConnection();

const receiver = new PublicKey("otBNE6HbfEyMBpBoLEsZ5V3CcTim3DMS5mpjD66z6cc");
const receivedPriv = "";
const receiverKeypair = Keypair.fromSecretKey(bs58.decode(receivedPriv));
// --- 3 senders (you'll need their private keys to sign later)

const priv1 =
  "2u6TKJJAGrXW1jNCVt8rVCC3mxFYacFayYEsY29dHNsnWZgKESpuw8bYPcoPrVLwBQ97xkciSCzXfCnhaB55AmSU";
const priv2 =
  "3eSDGDwc1vVWwX7eou1tVQ8Rzwn1LxyKvasdMUuFFy8jXvCxCMU2kX2Q2EchfHc7vcmuG96HAWuDaRqTcFmxwDL2";
const priv3 =
  "5xAjbPc3TEKHJpruiQeWUrT6wgXJWXCH52Ybfft5ZLC7AVUoMscRvTcS44xDpThv3LaPysjPVVVzhYVzYnQmKMAs";
const kp1 = Keypair.fromSecretKey(bs58.decode(priv1));
const kp2 = Keypair.fromSecretKey(bs58.decode(priv2));
const kp3 = Keypair.fromSecretKey(bs58.decode(priv3));
const senders = [kp1, kp2, kp3];

// --- Amount each wallet will send (0.01 SOL)
const lamportsToSend = 0.0001 * LAMPORTS_PER_SOL;

// --- Get recent blockhash
const { blockhash } = await connection.getLatestBlockhash("finalized");

// --- Construct transfers and build VersionedTransactions
const signedTxs = [];

for (const sender of senders) {
  const transferIx = SystemProgram.transfer({
    fromPubkey: sender.publicKey,
    toPubkey: receiver,
    lamports: lamportsToSend,
  });

  const message = new TransactionMessage({
    payerKey: sender.publicKey,
    recentBlockhash: blockhash,
    instructions: [transferIx],
  }).compileToV0Message();

  const vtx = new VersionedTransaction(message);
  vtx.sign([sender]);
  signedTxs.push(bs58.encode(vtx.serialize()));
}

const tipIx = SystemProgram.transfer({
  fromPubkey: receiverKeypair.publicKey,
  toPubkey: getRandomTipAccount(),
  lamports: 0.0001 * LAMPORTS_PER_SOL,
});

const tipMessage = new TransactionMessage({
  payerKey: receiverKeypair.publicKey,
  recentBlockhash: blockhash,
  instructions: [tipIx],
}).compileToV0Message();

const tipTx = new VersionedTransaction(tipMessage);
tipTx.sign([receiverKeypair]);

signedTxs.push(bs58.encode(tipTx.serialize()));

const bundleSend = await sendJitoBundle(signedTxs, 1000);
console.log("Bundle result: ", bundleSend);
