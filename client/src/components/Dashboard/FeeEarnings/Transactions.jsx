import { useEffect, useState } from "react";
import { FaExternalLinkAlt } from "react-icons/fa";
import { CiInboxOut } from "react-icons/ci";
import { formatBalance, timeAgo } from "../../../utils/functions";

const Transactions = ({ userData }) => {
  const transactions = JSON.parse(userData.withdrawals).sort(
    (a, b) => b.date - a.date
  );
  const [, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTick((tick) => tick + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const isMobile = window.innerWidth < 630;

  return (
    <div className="overflow-x-auto  text-white p-4 rounded-lg text-[12px] mt-2 bg-tile dark:bg-transparent border-1 border-gray-800">
      {transactions.length === 0 && (
        <span className="flex justify-center items-center gap-2 text-gray-600 select-none">
          <CiInboxOut className=" text-gray-400" /> No Previous Withdrawals
        </span>
      )}
      {transactions.length > 0 && (
        <div className="max-h-[294px] overflow-y-auto">
          <table className="min-w-full table-fixed">
            <thead className=" sticky top-0 z-10 bg-tile dark:bg-transparent text-[10px] sm:text-[12px]">
              <tr className="text-greener">
                <th className="xl:px-4 py-2">Payout</th>
                <th className="px-4 py-2">Amount</th>
                <th className="px-4 py-2 ">To</th>
                <th className="px-4 py-2">Transaction</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction, i) => (
                <tr
                  key={i}
                  className="border-b border-gray-800 text-gray-500 text-[10px] sm:text-[12px]"
                >
                  <td className="px-0 xl:px-4 py-2 text-center ">
                    {timeAgo(transaction.date, isMobile)} Ago
                  </td>
                  <td className="px-0 xl:px-4 py-2 text-center">
                    {transaction.currency === "SOL"
                      ? formatBalance(transaction.amount)
                      : transaction.amount}{" "}
                    {transaction.currency}
                  </td>
                  <td
                    className="px-0 xl:px-4 py-2 text-center"
                    onClick={() =>
                      window.open(
                        `https://solscan.io/account/${transaction.wallet}`
                      )
                    }
                  >
                    <span className="flex justify-center items-center gap-2 ">
                      <FaExternalLinkAlt
                        className="text-gray-400 dark:text-black hover:dark:text-black text-[10px] bottom-[1px] relative cursor-pointer hover:text-white"
                        onClick={() =>
                          window.open(
                            `https://solscan.io/tx/${transaction.txId}`
                          )
                        }
                      />
                      {!isMobile && (
                        <>
                          {transaction.wallet.slice(0, isMobile ? 3 : 10) +
                            "..." +
                            transaction.wallet.slice(isMobile ? -3 : -10)}
                        </>
                      )}
                    </span>
                  </td>
                  <td className="px-0 xl:px-4 py-2 text-center">
                    <span className="flex justify-center items-center gap-2">
                      <FaExternalLinkAlt
                        className="text-gray-400 dark:text-black hover:dark:text-black text-[10px] bottom-[1px] relative cursor-pointer hover:text-white"
                        onClick={() =>
                          window.open(
                            `https://solscan.io/tx/${transaction.txId}`
                          )
                        }
                      />
                      {!isMobile && (
                        <>
                          {transaction.txId.slice(0, isMobile ? 6 : 20) + "..."}
                        </>
                      )}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Transactions;
