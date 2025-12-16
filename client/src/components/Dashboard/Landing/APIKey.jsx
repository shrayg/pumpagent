import { FaKey } from "react-icons/fa";

const APIKey = ({ setMenu }) => {
  return (
    <div className="w-full xl:w-90 h-[250px] md:h-[300px]  border border-gray-800 dark:border-gray-200 bg-tile dark:bg-white dark:hover:bg-[#fff] rounded-md flex relative flex-col items-start gap-4 p-5 md:p-10 py-6 md:py-12">
      <h2 className="text-[18px] font-lighter text-gray-600">API Key</h2>
      <div className="apiKeyBG w-full  rounded-lg flex justify-start items-center pl-4 h-[96px] mt-4 md:mt-0">
        <FaKey className="text-[54px] text-greener" />
      </div>
      <button
        className="bg-green-900 transition hover:bg-green-700 z-10 text-white text-[14px] w-initial p-2 mt-auto mr-auto cursor-pointer px-15 py-4"
        onClick={() => setMenu("API Key")}
      >
        View API Key
      </button>
    </div>
  );
};

export default APIKey;
