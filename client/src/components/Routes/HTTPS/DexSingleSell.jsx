import { httpsServerDexSingleSell } from "../../../utils/servercode.js";
import { httpsClientDexSingleSell } from "../../../utils/clientcode.js";
import CodeBlock from "../../CodeBlock/CodeBlock";
import BlogNav from "../../BlogNav/BlogNav";
import Parameters from "../../Wrappers/Parameters";
import { httpsDexSingleSellMetadata } from "../../../utils/codemetadata";
import { useState } from "react";
import Response from "../../Wrappers/Response.jsx";
import Pagination from "../../Pagination/Pagination.jsx";
import { Helmet } from "react-helmet";

const DexSingleSell = () => {
  const [view, setView] = useState("client");
  const { parameters, response } = httpsDexSingleSellMetadata;

  return (
    <article className="pt-0 text-[12px] text-white px-5 md:px-10 lg:px-10 flex-1 w-[97vw] xl:max-w-[950px] lg:mx-auto">
      <Helmet>
        <title>Pump Agent · Dex Single Sell</title>
        <meta property="og:title" content="Pump Agent · Dex Single Sell" />
      </Helmet>
      <Pagination />
      <h1 className="text-4xl lg:text-5xl text-fg dark:text-black pb-8">
        Dex Single Sell
      </h1>
      <div className="text-[17px] font-normal leading-7 text-fg-muted mt-0 md:mb-8 dark:text-black">
        Sell any token that's listed on a decentralized exchange i.e. Raydium,
        Orca, Jupiter.
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
            serverCode={httpsServerDexSingleSell}
            clientCode={httpsClientDexSingleSell}
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

export default DexSingleSell;
