import { IoClose } from "react-icons/io5";

const TerminalFilters = ({ setOverlay }) => {
  return (
    <div className="absolute top-0 w-full h-full bg-[#0000008c] backdrop-blur-md z-1000">
      <div className="flex p-1">
        <button
          className="text-gray-500 text-[20px] p-2 cursor-pointer hover:text-gray-300"
          onClick={() => setOverlay("")}
        >
          <IoClose />
        </button>
      </div>
    </div>
  );
};

export default TerminalFilters;
