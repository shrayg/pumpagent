import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { copy } from "../../utils/functions";
import codeTheme from "../../utils/codeTheme";

const COPIED_RESET_MS = 1500;

const CodeBlock = ({ language, clientCode, serverCode, hasToggle, view, setView }) => {
  const [copied, setCopied] = useState(false);

  const highlightLanguage = language === "React.js" ? "javascript" : language.toLowerCase();
  const code = view === "client" || language === "React.js" ? clientCode : serverCode;

  const handleCopy = () => {
    copy(code);
    setCopied(true);
    setTimeout(() => setCopied(false), COPIED_RESET_MS);
  };

  const tabClass = (mode) =>
    `px-2.5 h-7 rounded-md text-[12.5px] font-medium cursor-pointer transition-colors ${
      view === mode ? "bg-surface-3 text-fg" : "text-fg-subtle hover:text-fg"
    }`;

  return (
    <div className="rounded-lg border border-line bg-surface overflow-hidden flex flex-col">
      <div className="flex items-center justify-between h-11 pl-4 pr-2 border-b border-line bg-surface-2">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[12px] text-fg-muted select-none">{language}</span>
          {hasToggle && (
            <div className="flex gap-1 p-0.5 rounded-lg border border-line bg-canvas" role="tablist">
              <button
                role="tab"
                aria-selected={view === "client"}
                className={tabClass("client")}
                onClick={() => setView("client")}
              >
                Client
              </button>
              <button
                role="tab"
                aria-selected={view === "server"}
                className={tabClass("server")}
                onClick={() => setView("server")}
              >
                Server
              </button>
            </div>
          )}
        </div>

        <button
          className="flex items-center gap-1.5 h-8 px-2.5 rounded-md text-[12px] text-fg-subtle hover:text-fg hover:bg-surface-3 cursor-pointer transition-colors"
          onClick={handleCopy}
          aria-label="Copy code"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-accent" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>

      <SyntaxHighlighter
        language={highlightLanguage}
        style={codeTheme}
        customStyle={{ margin: 0, padding: "16px 18px", background: "transparent" }}
      >
        {code.trim()}
      </SyntaxHighlighter>
    </div>
  );
};

export default CodeBlock;
