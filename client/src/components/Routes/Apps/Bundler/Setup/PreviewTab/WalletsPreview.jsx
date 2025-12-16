import { Keypair } from "@solana/web3.js";
import bs58 from "bs58";
import { FaRegCopy } from "react-icons/fa6";
import SOL from "../../../../../../assets/SOL.png";
import { getWalletSolBalances } from "../../../../../../utils/functions";
import { useEffect } from "react";
const WalletsPreview = ({
  wallets,
  balances,
  developerBalance,
  setBalances,
  setDeveloperBalance,
}) => {
  const copy = (i) => navigator.clipboard.writeText(i);

  let developerKeypair = null;
  let developerPublickey = "None";
  try {
    if (wallets?.developer) {
      developerKeypair = Keypair.fromSecretKey(bs58.decode(wallets.developer));
      developerPublickey = developerKeypair.publicKey.toBase58();
    }
  } catch (e) {
    console.warn("Invalid developer private key:", e);
  }

  const loadDeveloperBalance = async () => {
    try {
      const developerKeypair = Keypair.fromSecretKey(
        bs58.decode(wallets.developer)
      );
      const developerPublicKey = developerKeypair.publicKey.toBase58();

      const balance = (await getWalletSolBalances([developerPublicKey]))[0];

      setDeveloperBalance(balance);
    } catch (err) {
      console.error("Error fetching funder balance:", err);
    }
  };

  const fetchBalances = async () => {
    if (!wallets.bundle.length) return;
    try {
      const publicKeys = (wallets.bundle || [])
        .map((priv) => {
          try {
            const kp = Keypair.fromSecretKey(bs58.decode(priv));
            return kp.publicKey.toBase58();
          } catch {
            return null;
          }
        })
        .filter(Boolean); // Filter out invalid keys
      if (!publicKeys.length) return;

      const balances = await getWalletSolBalances(publicKeys);
      setBalances(balances);
    } catch (err) {
      console.error("Error fetching balances:", err);
    }
  };

  useEffect(() => {
    fetchBalances();
    loadDeveloperBalance();
  }, []);

  return (
    <div className="text-[12px] border-b border-gray-900 overflow-auto max-h-[500px] h-2/3">
      {/* Developer Buy */}
      <div className="flex text-gray-600 border-b border-gray-900 pb-4 relative p-4">
        <div className="flex flex-col">
          <span>Developer</span>
          <span className="text-white flex items-center gap-1 mt-1 z-10 w-25">
            <FaRegCopy
              className="cursor-pointer text-gray-500 hover:text-white active:text-greener active:scale-99"
              onClick={() => copy(developerPublickey)}
            />
            <span className="text-[10px] select-none">
              {developerPublickey.slice(0, 10) + "..."}
            </span>
          </span>
        </div>
        <div className="flex justify-evenly items-center flex-1">
          <div className="flex flex-col items-center z-10">
            <span>Balance</span>
            <span className="text-greener flex items-center gap-1">
              <img src={SOL} alt="SOL" className="w-4 h-4" />

              <span>
                {developerBalance
                  ? wallets.developer
                    ? developerBalance?.toFixed(3)
                    : "0.000"
                  : null}
              </span>
            </span>
          </div>
          <div className="flex flex-col items-center z-10">
            <span>Buy Amount</span>
            <span className="text-greener flex items-center gap-1">
              <img src={SOL} alt="SOL" className="w-4 h-4" />
              <span>{wallets.buyAmounts["developer"]}</span>
            </span>
          </div>
        </div>
        <div className="absolute w-full h-full inset-0 green-grad opacity-15"></div>
      </div>

      {/* Bundle Buys */}
      {wallets.bundle.map((privKey, index) => {
        let pubkey;
        try {
          const keypair = Keypair.fromSecretKey(bs58.decode(privKey));
          pubkey = keypair.publicKey.toBase58();
        } catch (e) {
          pubkey = "None";
        }

        return (
          <div
            key={index}
            className="flex text-gray-600 border-b border-gray-900 pb-4 relative p-4"
          >
            <div className="flex flex-col">
              <span>Wallet {index + 1}</span>
              <span className="text-white flex items-center gap-1 mt-1 z-10 w-25">
                <FaRegCopy
                  className="cursor-pointer text-gray-500 hover:text-white active:text-greener active:scale-99"
                  onClick={() => copy(pubkey)}
                />
                <span className="text-[10px] select-none">
                  {pubkey.slice(0, 10) + "..."}
                </span>
              </span>
            </div>
            <div className="flex justify-evenly items-start ml-auto flex-1">
              <div className="flex flex-col items-center z-10">
                <span>Balance</span>
                <span className="text-greener flex items-center gap-1">
                  <img src={SOL} alt="SOL" className="w-4 h-4" />
                  <span>
                    {balances[index] ? balances[index]?.toFixed(3) : null}
                  </span>
                </span>
              </div>
              <div className="flex flex-col items-center z-10">
                <span>Buy Amount</span>
                <span className="text-greener flex items-center gap-1">
                  <img src={SOL} alt="SOL" className="w-4 h-4" />
                  <span>{wallets.buyAmounts[index]}</span>
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default WalletsPreview;
