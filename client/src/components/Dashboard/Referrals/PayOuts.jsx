import { FaExternalLinkAlt } from "react-icons/fa";
import { CiInboxOut } from "react-icons/ci";
import { formatBalance, timeAgo } from "../../../utils/functions.js";

const PayOuts = ({ userData }) => {
  const transactions = JSON.parse(userData.ref_payouts);

  return (
    <div className="overflow-x-auto  text-white p-4 rounded-lg text-[12px] mt-2 bg-tile dark:bg-transparent border-1 border-gray-800">
      {transactions.length === 0 && (
        <span className="flex justify-center items-center gap-2 text-gray-600 select-none">
          <CiInboxOut className=" text-gray-400" /> No Previous Payouts
        </span>
      )}
      {transactions.length > 0 && (
        <div className="max-h-[294px] overflow-y-auto">
          <table className="min-w-full table-fixed">
            <thead className=" sticky top-0 z-10 bg-tile dark:bg-transparent">
              <tr className="text-greener">
                <th className="px-4 py-2">Payout</th>
                <th className="px-4 py-2">USD Amount</th>
                <th className="px-4 py-2">Referral</th>
                <th className="px-4 py-2">Transaction ID</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction, i) => (
                <tr key={i} className="border-b border-gray-800 text-gray-500">
                  <td className="px-4 py-2 text-center">
                    {timeAgo(transaction.date)} Ago
                  </td>
                  <td className="px-4 py-2 text-center">
                    {formatBalance(transaction.amount)} SOL
                  </td>
                  <td
                    className="py-2 text-center"
                    onClick={() =>
                      window.open(
                        `https://solscan.io/account/${transaction.wallet}`
                      )
                    }
                  >
                    <span className="flex justify-center items-center gap-2 ">
                      <FaExternalLinkAlt
                        className="text-gray-400 text-[10px] bottom-[1px] relative cursor-pointer hover:text-white"
                        onClick={() =>
                          window.open(
                            `https://solscan.io/tx/${transaction.txId}`
                          )
                        }
                      />
                      {transaction.wallet.slice(0, 10) +
                        "..." +
                        transaction.wallet.slice(-10)}
                    </span>
                  </td>
                  <td className="py-2 gap-1 text-center">
                    <span className="flex justify-center items-center gap-2">
                      <FaExternalLinkAlt
                        className="text-gray-400 text-[10px] bottom-[1px] relative cursor-pointer hover:text-white"
                        onClick={() =>
                          window.open(
                            `https://solscan.io/tx/${transaction.txId}`
                          )
                        }
                      />
                      {transaction.txId.slice(0, 20) + "..."}
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

export default PayOuts;
