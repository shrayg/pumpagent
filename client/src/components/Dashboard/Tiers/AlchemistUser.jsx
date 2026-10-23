import { FaHandHoldingMedical } from "react-icons/fa";
import { GiPayMoney } from "react-icons/gi";
import { PiLightningFill } from "react-icons/pi";
import Logo from "../../../assets/Logo.webp";

const AlchemistUser = () => {
  return (
    <div className="flex gap-4">
      <div className="w-full border border-gray-800 dark:border-gray-200 bg-tile dark:bg-white dark:hover:bg-[#fff] rounded-md relative p-5 md:p-10 py-6 md:py-12 flex-col md:flex-row flex gap-2 mb-2 justify-start items-start md:h-[280px]">
        <div className="flex flex-col gap-2 w-full md:w-[232px]">
          <span className="text-[18px] text-purple-500">Alchemist</span>

          <div className="flex p-2 alchemistBG rounded-md mt-4">
            <img src={Logo} alt="Logo" className="w-30 h-full" />
          </div>
        </div>
        <div className="flex-1 md:border-l h-full border-l-gray-800 md:ml-4 lg:ml-8 md:pl-4 lg:pl-8 flex justify-start items-start flex-col w-full">
          <div className="flex w-full h-full gap-4 pt-4 md:pt-0 text-[10px] md:text-[14px] text-gray-600 select-none">
            <div className="w-1/3 border border-gray-800 h-full rounded-lg flex justify-center items-center text-center flex-col p-2 gap-2">
              <FaHandHoldingMedical className="text-[20px] text-greener" />
              <span>10% Discount on Fees</span>
            </div>
            <div className="w-1/3 border border-gray-800 h-full rounded-lg flex justify-center items-center text-center flex-col p-2 gap-2">
              <GiPayMoney className="text-[20px] text-greener scale-x-[-1]" />
              <span>10% Earnings Per Referral</span>
            </div>
            <div className="w-1/3 border border-gray-800 h-full rounded-lg flex justify-center items-center text-center flex-col p-2 gap-2">
              <PiLightningFill className="text-[20px] text-greener" />
              <span>Increased Rate Limits</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlchemistUser;
