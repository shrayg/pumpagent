import { GiReceiveMoney } from "react-icons/gi";

const Referrals = ({ setMenu, referralCount }) => {
  return (
    <div className="w-full xl:w-90 h-[250px] md:h-[300px]  border border-gray-800 dark:border-gray-200 bg-tile dark:bg-white dark:hover:bg-[#fff] rounded-md flex relative flex-col items-start gap-4 p-5 md:p-10 py-6 md:py-12">
      <h2 className="text-[18px] font-lighter text-gray-600">Referrals</h2>
      <div className="flex gap-2 h-full w-full justify-center items-center text-[36px] text-greener">
        <GiReceiveMoney />
        <span>{referralCount}</span>
      </div>
      <button
        className="bg-green-900 transition hover:bg-green-700 z-10 text-white text-[14px] w-initial p-2 mt-auto mr-auto cursor-pointer px-15 py-4"
        onClick={() => setMenu("Referrals")}
      >
        Referrals Centre
      </button>
    </div>
  );
};

export default Referrals;
