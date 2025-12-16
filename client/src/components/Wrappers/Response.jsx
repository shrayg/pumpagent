import { useState } from "react";
import { IoIosArrowDown } from "react-icons/io";

const Response = ({ parameters, hideTitle = false }) => {
  const [expanded, setExpanded] = useState({});

  const toggleExpanded = (index) => {
    setExpanded((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <>
      {!hideTitle && (
        <div className="font-semibold mb-2 text-[18px] dark:text-black mt-4">
          result
        </div>
      )}

      <div className="bg-[#101010] dark:bg-transparent p-2 border-1 border-gray-800 rounded-md mt-4 text-[12px] flex flex-col lg:max-w-md">
        <div className="flex flex-col gap-2">
          {parameters.map((parameter, index) => (
            <div
              key={parameter.title}
              className="border-1 border-gray-800 dark:bg-gray-100 rounded-md p-2  hover:border-gray-600 cursor-pointer"
              onClick={() => toggleExpanded(index)}
            >
              <div className="flex justify-between items-center">
                <span className="text-[#cecbc5] dark:text-black text-[16px] italic font-lighter">
                  {parameter.title}
                </span>
                <div className="flex gap-2 items-center">
                  <span className="text-[#2bd93c] dark:text-black bg-[#81e98a28] dark:bg-[#81e98a5d] font-[400] p-1 rounded-md text-[14px] select-none">
                    {parameter.type}
                  </span>
                  <IoIosArrowDown />
                </div>
              </div>

              {expanded[index] && (
                <div className="font-light text-[#cecbc5] dark:text-black mt-2">
                  {parameter.copy.map((copy, index) => (
                    <span key={index} className="text-[16px] block">
                      {copy}
                    </span>
                  ))}
                  {parameter.list?.properties?.length > 0 && (
                    <>
                      {parameter.list.type === "object" && (
                        <span className="text-[#2bd93c] dark:text-black dark:bg-[#81e98a5f] bg-[#81e98a28] font-[400] p-1 rounded-md text-[14px] mt-2 inline-block select-none">
                          {parameter.list.value}
                        </span>
                      )}

                      {parameter.list.type === "array" && (
                        <span className="text-[#2bd93c] bg-[#81e98a28] font-[400] p-1 rounded-md text-[14px] mt-2 inline-block select-none">
                          {parameter.list.value}
                        </span>
                      )}

                      <ul className="mt-4 flex flex-col gap-3 ">
                        {parameter.list.properties.map((copy, index) => (
                          <li
                            key={index}
                            className="text-[16px] dark:bg-transparent  p-1 bg-[#33333332] leading-6"
                          >
                            <span className="mr-2 text-[#2bd93c] dark:text-black bg-[#81e98a23] dark:bg-[#81e98aba] font-[400] p-1 py-0.5 rounded-md text-[14px] select-none">
                              {copy.type}
                            </span>

                            <span className="">{copy.copy}</span>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Response;
