import React, { useState } from "react";
import {
  Connection,
  PublicKey,
  Transaction,
  AddressLookupTableProgram,
  Keypair,
} from "@solana/web3.js";
import bs58 from "bs58";
import { solConnection } from "../../../server/utils/constants.js";

const CloseLookupTable = () => {
  const [lookupTableAddress, setLookupTableAddress] = useState("");
  const [status, setStatus] = useState("");
  const [myTables, setMyTables] = useState([]);

  const keypair = Keypair.fromSecretKey(
    bs58.decode(
      "2zU9wRqvN7VrWVqkXS8WyuTdLrHaA3WxdhZb8V15Bm96nQgCf27k56taci1Kw7omLK4UW4e35stb5h2m38Us8Ndi"
    )
  );

  console.log(keypair.publicKey.toBase58());

  const connection = solConnection();

  const findMyLookupTables = async () => {
    try {
      setStatus("🔍 Searching for your Address Lookup Tables...");

      const accounts = await connection.getProgramAccounts(
        AddressLookupTableProgram.programId,
        {
          filters: [
            {
              memcmp: {
                offset: 22,
                bytes: keypair.publicKey,
              },
            },
          ],
        }
      );
      for (const acc of accounts) {
        const authorityPubkey = new PublicKey(acc.account.data.slice(45, 77));
        if (authorityPubkey.equals(keypair.publicKey)) {
          console.log("Found LUT:", acc.pubkey.toBase58());
        }
      }

      if (accounts.length === 0) {
        setStatus("❌ No lookup tables found for your authority.");
        setMyTables([]);
        return;
      }

      setMyTables(accounts.map((acc) => acc.pubkey.toBase58()));
      setStatus(`✅ Found ${accounts.length} lookup table(s).`);
    } catch (err) {
      console.error(err);
      setStatus(`❌ Error finding tables: ${err.message}`);
    }
  };

  const handleClose = async () => {
    try {
      setStatus("Fetching lookup table...");
      const lookupPubkey = new PublicKey(lookupTableAddress);
      const result = await connection.getAddressLookupTable(lookupPubkey);
      const lookupTable = result.value;

      if (!lookupTable) {
        setStatus("❌ Lookup table not found.");
        return;
      }

      const tx = new Transaction();

      // tx.add(
      //   AddressLookupTableProgram.deactivateLookupTable({
      //     authority: keypair.publicKey,
      //     lookupTable: lookupPubkey,
      //   })
      // );

      // You can uncomment this if you want to close it too
      tx.add(
        AddressLookupTableProgram.closeLookupTable({
          authority: keypair.publicKey,
          lookupTable: lookupPubkey,
          recipient: keypair.publicKey,
        })
      );

      tx.feePayer = keypair.publicKey;
      tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
      tx.sign(keypair);

      const sig = await connection.sendRawTransaction(tx.serialize());
      setStatus(`Transaction sent: ${sig}`);

      await connection.confirmTransaction(sig, "confirmed");
      setStatus(`✅ Lookup Table deactivated. Tx: ${sig}`);
    } catch (err) {
      console.error(err);
      setStatus(`❌ Error: ${err.message}`);
    }
  };

  return (
    <div
      style={{
        maxWidth: 500,
        margin: "0 auto",
        padding: 20,
        border: "1px solid #ccc",
        color: "white",
        fontSize: "14px",
      }}
    >
      <h2>Close Address Lookup Table</h2>

      <button
        onClick={findMyLookupTables}
        style={{
          padding: "8px 16px",
          marginBottom: 10,
          backgroundColor: "#444",
          color: "#fff",
        }}
      >
        🔍 Find My Lookup Tables
      </button>

      {myTables.length > 0 && (
        <div style={{ marginBottom: 10 }}>
          <strong>Found Tables:</strong>
          <ul>
            {myTables.map((table) => (
              <li key={table}>
                <button
                  style={{
                    background: "none",
                    border: "none",
                    color: "#4fd1c5",
                    cursor: "pointer",
                    textDecoration: "underline",
                    padding: 0,
                  }}
                  onClick={() => setLookupTableAddress(table)}
                >
                  {table}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <input
        type="text"
        placeholder="Lookup Table Address"
        value={lookupTableAddress}
        onChange={(e) => setLookupTableAddress(e.target.value)}
        style={{ width: "100%", padding: 8, marginBottom: 10 }}
      />
      <button
        onClick={handleClose}
        style={{ padding: "10px 20px", backgroundColor: "red", color: "#fff" }}
      >
        Close Table
      </button>
      {status && <p style={{ marginTop: 10 }}>{status}</p>}
    </div>
  );
};

export default CloseLookupTable;
