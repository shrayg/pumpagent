import Logo from "../../../assets/Logo.webp";
import FeesEarned from "./FeesEarned";
import { timeAgo } from "../../../utils/functions";
import APIKey from "./APIKey";
import Referrals from "./Referrals";

const Landing = ({ setMenu, fundWalletBalance, userData }) => {
  const userSince = userData?.created_at;
  const referralCount = userData && JSON.parse(userData.referrals).length;

  return (
    <div className="flex-1 text-[12px] mb-4 md:mb-0 flex sm:flex-col md:flex-row xl:flex-col flex-col mt-8 md:mt-14 px-4 md:px-10 gap-4 md:gap-6">
      <div className="flex flex-col w-full lg:w-1/2 sm:w-full xl:w-min xl:h-[300px] xl:flex-row justify-start items-start gap-4 md:gap-6">
        <div className="w-full xl:w-90 h-[250px] md:h-[300px] border border-gray-800 dark:border-gray-200 bg-tile dark:bg-white dark:hover:bg-[#fff] rounded-md flex relative flex-col items-start p-5 md:p-10 py-6 md:py-12">
          <h2 className="text-[18px] font-lighter text-gray-600 mb-3">
            Current Tier
          </h2>
          <h1
            className={`text-[36px] mt-4 md:mt-0 ${
              userData?.tier === "Apprentice"
                ? "text-greener"
                : "text-purple-500"
            } text-greener`}
          >
            {userData?.tier}
          </h1>
          {userData?.tier === "Alchemist" && (
            <div className="flex p-2 alchemistBG rounded-md w-full mt-auto">
              <img src={Logo} alt="Logo" className="w-20 h-full" />
            </div>
          )}
          {userData?.tier === "Apprentice" && (
            <button
              className="bg-green-900 transition hover:bg-green-700 z-10 text-white text-[14px] w-initial p-2 mt-auto mr-auto cursor-pointer px-15 py-4"
              onClick={() => setMenu("Tiers")}
            >
              Upgrade Tier
            </button>
          )}
        </div>

        <FeesEarned setMenu={setMenu} fundWalletBalance={fundWalletBalance} />

        <div className="flex-col gap-6 flex-1 hidden xl:flex md:hidden">
          <div className="w-50 border border-gray-800 dark:border-gray-200 bg-tile dark:bg-white dark:text-black dark:hover:bg-[#fff] rounded-md p-4 flex relative flex-col items-center gap-3">
            <div className="p-1 flex gap-2 items-center">
              <div className="w-2.5 h-2.5 rounded-full bg-green-500 glow"></div>
              <span className="">Active</span>
            </div>
          </div>
          <div className="flex-1 border border-gray-800 dark:border-gray-200 bg-tile dark:bg-white dark:hover:bg-[#fff] rounded-md p-4 flex relative flex-col items-center gap-3">
            <div className="p-1 flex gap-2 items-center">
              <img src={Logo} alt="Vial" className="w-34 opacilate" />
            </div>
            <span className="text-gray-500">
              User Since {timeAgo(userSince)}
            </span>
          </div>
        </div>
      </div>
      <div className="flex flex-col w-full lg:w-1/2 sm:w-full  xl:flex-row justify-start items-start gap-4 md:gap-6 h-full xl:w-min xl:max-h-[300px]">
        <Referrals setMenu={setMenu} referralCount={referralCount} />
        <APIKey setMenu={setMenu} />
      </div>
    </div>
  );
};

export default Landing;
