import { FaRegCopy } from "react-icons/fa6";

const TokenPreview = ({ form }) => {
  const copy = (i) => navigator.clipboard.writeText(i);

  const metadata = form.metadata;

  return (
    <div className="flex flex-col h-2/3">
      {/* Menu */}

      {/* Header */}
      <div className="flex p-6  border-b border-gray-900 select-none relative">
        <div
          className={`border-1 border-gray-800 rounded-lg border-dotted w-25 h-25 flex justify-center items-center z-10 backdrop-blur-[2px] ${
            metadata?.image ? "" : "bg-black"
          }`}
        >
          {!metadata?.image && (
            <span className="text-[10px] text-gray-700">No Image</span>
          )}
          {metadata?.image && (
            <img
              src={metadata?.image}
              alt="Token Image"
              className="h-full w-full object-contain rounded-md"
            />
          )}
        </div>
        <div className="flex-1 justify-center items-center flex  absolute w-full h-full inset-0">
          {!form.banner && (
            <span className="text-[10px] text-gray-700 pl-20">No Banner</span>
          )}
          {form.banner && (
            <img
              src={form.banner}
              alt="Token Banner"
              className="h-full w-full object-cover rounded-md absolute"
            />
          )}
        </div>
      </div>
      {/* Col */}
      <div className="flex flex-col p-6 gap-2  border-b border-b-gray-900 pb-8">
        {/* Mint */}
        <div className="flex flex-col">
          <span className="text-gray-600 text-[10px] select-none pb-1">
            Mint
          </span>
          <div className="flex justify-between items-center">
            <span className="text-white text-[10px] pt-1 select-none">
              {form?.mintPub && form?.mintPub}
              {!form?.mintPub && <span className="opacity-0">No</span>}
            </span>
            {form?.mintPub && (
              <FaRegCopy
                className="text-gray-700 text-[12px] cursor-pointer hover:text-white active:text-greener"
                onClick={() => copy(form?.mintPub)}
              />
            )}
          </div>
        </div>

        {/* Name */}
        <div className="flex flex-col">
          <span className="text-gray-600 text-[10px] select-none pb-1">
            Name
          </span>
          <div className="flex justify-between items-center">
            <span className="text-white text-[12px] pt-1 select-none">
              {metadata?.name && metadata?.name}
              {!metadata?.name && <span className="opacity-0">No</span>}
            </span>
            {metadata?.name && (
              <FaRegCopy
                className="text-gray-700 text-[12px] cursor-pointer hover:text-white active:text-greener"
                onClick={() => copy(metadata?.name)}
              />
            )}
          </div>
        </div>

        {/* Symbol */}
        <div className="flex flex-col">
          <span className="text-gray-600 text-[10px] select-none pb-1">
            Symbol
          </span>
          <div className="flex justify-between items-center">
            <span className="text-white text-[12px] pt-1 select-none">
              {metadata?.symbol && metadata?.symbol}
              {!metadata?.symbol && <span className="opacity-0">No</span>}
            </span>
            {metadata?.symbol && (
              <FaRegCopy
                className="text-gray-700 text-[12px] cursor-pointer hover:text-white active:text-greener"
                onClick={() => copy(metadata?.symbol)}
              />
            )}
          </div>
        </div>

        {/* Description */}
        <div className="flex flex-col">
          <span className="text-gray-600 text-[10px] select-non relative">
            Description{" "}
            {metadata?.description && (
              <FaRegCopy
                className="text-gray-700 text-[12px] cursor-pointer hover:text-white active:text-greener absolute top-[0px] right-0"
                onClick={() => copy(metadata?.description)}
              />
            )}
          </span>
          <div className="flex justify-start items-start  max-h-25 overflow-auto py-1 pr-1 relative">
            <span className="text-white text-[12px] pt-1 select-none break-all">
              {metadata?.description && metadata?.description}
              {!metadata?.description && <span className="opacity-0">No</span>}
            </span>
          </div>
        </div>
      </div>

      {/* Socials */}
      <div className="flex flex-col p-6 gap-4  border-b border-b-gray-900 pb-8">
        {/* Name */}
        <div className="flex flex-col">
          <span className="text-gray-600 text-[10px] select-none">Website</span>
          <div className="flex justify-between items-center">
            {metadata?.website && (
              <>
                <span className="text-white text-[12px] pt-1 select-none break-all">
                  {metadata?.website}
                </span>
                <FaRegCopy
                  className="text-gray-700 text-[12px] cursor-pointer hover:text-white active:text-greener"
                  onClick={() => copy(metadata?.website)}
                />
              </>
            )}
            {!metadata?.website && (
              <>
                <span className="text-white text-[12px] pt-1 select-none opacity-0">
                  No
                </span>
              </>
            )}
          </div>
        </div>

        {/* Symbol */}
        <div className="flex flex-col">
          <span className="text-gray-600 text-[10px] select-none">
            Telegram
          </span>
          <div className="flex justify-between items-center">
            {metadata?.telegram && (
              <>
                <span className="text-white text-[12px] pt-1 select-none">
                  {metadata?.telegram}
                </span>
                <FaRegCopy
                  className="text-gray-700 text-[12px] cursor-pointer hover:text-white active:text-greener"
                  onClick={() => copy(metadata?.telegram)}
                />
              </>
            )}
            {!metadata?.telegram && (
              <>
                <span className="text-white text-[12px] pt-1 select-none opacity-0">
                  No
                </span>
              </>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="flex flex-col">
          <span className="text-gray-600 text-[10px] select-none">X</span>
          <div className="flex justify-between items-center">
            {metadata?.twitter && (
              <>
                <span className="text-white text-[12px] pt-1 select-none break-all">
                  {metadata?.twitter.slice(0, 120)}
                  {metadata?.twitter?.length >= 120 ? "..." : ""}
                </span>
                <FaRegCopy
                  className="text-gray-700 text-[12px] cursor-pointer hover:text-white active:text-greener"
                  onClick={() => copy(metadata?.twitter)}
                />
              </>
            )}
            {!metadata?.twitter && (
              <>
                <span className="text-white text-[12px] pt-1 select-none opacity-0">
                  No
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenPreview;
