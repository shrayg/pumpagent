import { webSocketClientPoolTrades } from "../../../utils/clientcode.js";
import { webSocketServerPoolTrades } from "../../../utils/servercode.js";
import CodeBlock from "../../CodeBlock/CodeBlock";
import BlogNav from "../../BlogNav/BlogNav";
import { webSocketPoolTradesMetadata } from "../../../utils/codemetadata";

import { useState } from "react";
import Response from "../../Wrappers/Response.jsx";
import Pagination from "../../Pagination/Pagination.jsx";
import { Helmet } from "react-helmet";
import Parameters from "../../Wrappers/Parameters.jsx";

const PoolTrades = () => {
  const { parameters, response } = webSocketPoolTradesMetadata;
  const [view, setView] = useState("client");

  return (
    <article className="pt-0 text-[12px] text-white px-5 md:px-10 lg:px-10 flex-1 w-[97vw] xl:max-w-[950px] lg:mx-auto">
      <Helmet>
        <title>Pump Agent · Pool Trades</title>
        <meta property="og:title" content="Pump Agent · Pool Trades" />
      </Helmet>
      <Pagination />
      <h1 className="text-4xl lg:text-5xl text-fg dark:text-black pb-8">Pool Trades</h1>
      <div className="text-[17px] font-normal leading-7 text-fg-muted dark:text-black">
        Receive realtime trade data for a list of PumpSwap pool addresses.
      </div>

      <div className="flex flex-col lg:flex-row w-full justify-center gap-2 mt-5 md:mt-10">
        <div className="w-full lg:w-1/2">
          <div className="sticky top-20">
            <Parameters parameters={parameters} />
            <Response parameters={response} />
          </div>
        </div>
        <div className="w-full lg:w-1/2 flex flex-col gap-2 mt-4 lg:mt-0">
          <CodeBlock
            language="JavaScript"
            clientCode={webSocketClientPoolTrades}
            serverCode={webSocketServerPoolTrades}
            hasToggle={true}
            view={view}
            setView={setView}
          />
        </div>
      </div>
      <BlogNav />
    </article>
  );
};

export default PoolTrades;
