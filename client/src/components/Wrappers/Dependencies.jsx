import { copy } from "../../utils/functions";
import { FaRegCopy } from "react-icons/fa6";

const Dependencies = ({ dependencies, view }) => {
  const type = view === "client" ? dependencies?.client : dependencies?.server;

  return (
    <>
      <div className="font-semibold mb-2 text-[20px] mt-4">Dependencies</div>
      <div className="bg-[#101010] p-4  dark:bg-transparent  border-1 border-gray-800 rounded-md mt-4 flex text-[12px] flex-col relative max-w-[700px]">
        <span className="bg-tile p-4 text-[14px] rounded-md dark:bg-gray-100 dark:text-black relative">
          {type}{" "}
          {type !== "none" && (
            <button
              className="absolute right-1 top-1 p-2 mt-1 mr-1 cursor-pointer hover:bg-[rgba(15,36,22,0.68)] rounded-md group transform active:scale-90"
              onClick={() => copy("npm i bs58 @solana/web3.js")}
            >
              <FaRegCopy className="text-[16px] text-gray-600 group-hover:text-white group-active:text-green-500" />
            </button>
          )}
        </span>
      </div>
    </>
  );
};

export default Dependencies;
