import { FaRegCopy } from "react-icons/fa6";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  nightOwl,
  prism,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import { copy } from "../../utils/functions";
import { useDarkMode } from "../../utils/darkmodecontext";

const UniCodeBlock = ({
  language,
  codeExample,

  hasToggle,
  view,
  setView,
}) => {
  const { darkMode } = useDarkMode();

  const toggleButtonStyle = (mode) =>
    `px-3 py-1 rounded-md text-sm font-semibold cursor-pointer select-none ${
      view === mode
        ? darkMode
          ? "bg-gray-800 text-white"
          : "bg-white text-black"
        : darkMode
        ? "text-gray-400 hover:text-black"
        : "text-gray-600 hover:text-white"
    }`;

  return (
    <div className="bg-[#101010] dark:bg-gray-100 border border-[#1e2939] rounded-md flex flex-col overflow-hidden  max-w-[91vw]">
      <div className="border-b border-[#1e2939] p-1 pl-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="dark:text-black text-white font-medium select-none">
            <span>{language}</span>
          </div>
          {hasToggle && (
            <div className="flex gap-2">
              <button
                className={toggleButtonStyle("client")}
                onClick={() => setView("client")}
              >
                Client
              </button>
              <button
                className={toggleButtonStyle("server")}
                onClick={() => setView("server")}
              >
                Server
              </button>
            </div>
          )}
        </div>

        <button
          className="p-2 cursor-pointer hover:bg-[rgba(15,36,22,0.68)] rounded-md group transform active:scale-90"
          onClick={() => copy(codeExample)}
        >
          <FaRegCopy className="text-[16px] text-gray-600 group-hover:text-white group-active:text-green-500" />
        </button>
      </div>

      <SyntaxHighlighter
        language={"javascript"}
        style={darkMode ? prism : nightOwl}
        customStyle={{
          backgroundColor: darkMode ? "#f6f3f4" : "#101010",
          padding: "1rem",
          margin: 0,
          paddingTop: "0px",
        }}
      >
        {codeExample}
      </SyntaxHighlighter>
    </div>
  );
};

export default UniCodeBlock;
