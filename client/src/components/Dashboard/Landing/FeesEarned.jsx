import { formatBalance } from "../../../utils/functions.js";

const FeesEarned = ({ setMenu, fundWalletBalance }) => {
  return (
    <div className="w-full xl:w-90 h-[250px] md:h-[300px]  border border-gray-800 dark:border-gray-200 bg-tile dark:bg-white dark:hover:bg-[#fff] rounded-md flex relative flex-col items-start gap-4 p-5 md:p-10 py-6 md:py-12">
      <h2 className="text-[18px] font-lighter text-gray-600">Fees Earned</h2>
      <h1 className="text-[36px] text-greener mt-4 md:mt-0">
        {formatBalance(fundWalletBalance?.SOL)} SOL
      </h1>
      <span className="text-gray-500 mt-[-5px]">Available Fees</span>
      <button
        className="bg-green-900 transition hover:bg-green-700 z-10 text-white text-[14px] w-initial p-2 mt-auto mr-auto cursor-pointer px-15 py-4"
        onClick={() => setMenu("Fee Earnings")}
      >
        View Earnings
      </button>
    </div>
  );
};

export default FeesEarned;
