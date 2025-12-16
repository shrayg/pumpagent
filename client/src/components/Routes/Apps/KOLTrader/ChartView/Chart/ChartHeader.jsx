import { FaXTwitter } from "react-icons/fa6";
import { FaTelegramPlane } from "react-icons/fa";
import { FaGlobeAmericas } from "react-icons/fa";
import { useState } from "react";
import { FaTriangleExclamation } from "react-icons/fa6";
import Question from "../../../../../../assets/Question.webp";
import { getIPFSUrl } from "../../../../../../utils/functions";

const ChartHeader = ({ data, replies }) => {
  const [enlargedImages, setEnlargedImages] = useState({});

  const toggleEnlarge = (img) => {
    setEnlargedImages((prev) => ({
      ...prev,
      [img]: !prev[img],
    }));
  };

  const officialIPFS = data?.metadata_uri?.includes("ipfs.io/ipfs");
  const validPumpCA = data?.mint.slice(-4) === "pump";

  return (
    <div className="flex flex-col absolute top-0 left-0">
      <div className="flex flex-col gap-0 p-1">
        <div className="p-1 px-2  z-200 flex justify-start items-center gap-2 pr-2 relative">
          <button
            title="3rd Party Deployment"
            className="absolute  top-0.5 left-0.5"
          >
            {(officialIPFS === false || !validPumpCA) && (
              <FaTriangleExclamation className="text-yellow-500 text-[10px] z-100" />
            )}
          </button>
          {data?.image_uri && (
            <img
              src={getIPFSUrl(data?.image_uri)}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = Question;
              }}
              alt={data?.name}
              className={`rounded-full object-cover cursor-pointer ${
                enlargedImages["main"] ? "h-25 w-25" : "h-5 w-5"
              }`}
              onClick={() => toggleEnlarge("main")}
            />
          )}
          <div className="flex flex-col">
            <span className="text-greener text-[12px]">{data?.symbol}</span>
            <span className="text-greener text-[12px]">{data?.name}</span>
            <span className="text-greener text-[10px]">
              {data?.mint?.slice(0, 7)}
            </span>
          </div>
        </div>
        <div className=" w-full px-2 z-100 flex justify-start items-center gap-2">
          <div className="flex flex-col bg-black pb-1">
            <span className="text-gray-400 opacity-50 text-[12px]">
              Replies: {replies.length}
            </span>
            <span className="text-greener opacity-40 text-[12px]">
              {data?.is_currently_live ? "Livestreaming" : ""}
            </span>
          </div>
        </div>
        <div className="flex pl-2 gap-2 z-100">
          {data?.twitter && (
            <button
              className="text-[14px] cursor-pointer text-gray-400"
              onClick={() => window.open(data.twitter, "_blank")}
            >
              <FaXTwitter />
            </button>
          )}
          {data?.telegram && (
            <button
              className="text-gray-400 text-[14px] cursor-pointer"
              onClick={() => window.open(data.telegram, "_blank")}
            >
              <FaTelegramPlane />
            </button>
          )}
          {data?.website && (
            <button
              className="text-gray-400 text-[14px] cursor-pointer"
              onClick={() => window.open(data.website, "_blank")}
            >
              <FaGlobeAmericas />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChartHeader;
