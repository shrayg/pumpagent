import { FaRegCopy } from "react-icons/fa6";

const Command = ({ text, hidden = false }) => {
  return (
    <div className="bg-tile dark:bg-[#3333330f] dark:text-black flex dark:border-1 dark:border-gray-800 p-2 md:p-4 justify-between items-center w-full md:max-w-md rounded-md text-center xl:text-start">
      {/* <span className="text-[6px] sm:text-[8px] md:text-[12px] inline">{text}</span> */}
      <span className="text-[2vw] md:text-[12px] inline w-full  dark:text-white">
        {text}
      </span>
      {!hidden && (
        <button
          className="text-[12px] text-gray-500 hover:text-white active:text-greener rounded-md ml-2 md:ml-auto cursor-pointer pr-0 md:pr-2 p-2"
          onClick={() => navigator.clipboard.writeText(text)}
          type="button"
        >
          <FaRegCopy />
        </button>
      )}
    </div>
  );
};

export default Command;
