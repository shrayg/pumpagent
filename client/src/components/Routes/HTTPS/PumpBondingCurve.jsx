import { httpsServerPumpBondingCurve } from "../../../utils/servercode.js";
import { httpsClientPumpBondingCurve } from "../../../utils/clientcode.js";
import CodeBlock from "../../CodeBlock/CodeBlock";
import BlogNav from "../../BlogNav/BlogNav";
import Parameters from "../../Wrappers/Parameters";
import { httpsPumpBondingCurveMetadata } from "../../../utils/codemetadata";

import { useState } from "react";
import Response from "../../Wrappers/Response.jsx";
import Pagination from "../../Pagination/Pagination.jsx";
import { Helmet } from "react-helmet";

const PumpBondingCurve = () => {
  const [view, setView] = useState("client");
  const { parameters, response } = httpsPumpBondingCurveMetadata;

  return (
    <article className="pt-0 text-[12px] text-white px-5 md:px-10 lg:px-10 flex-1 w-[97vw] xl:max-w-[950px] lg:mx-auto">
      <Helmet>
        <title>Pump Agent · Pump Bonding Curve</title>
        <meta property="og:title" content="Pump Agent · Pump Bonding Curve" />
      </Helmet>
      <Pagination />
      <h1 className="text-4xl lg:text-5xl text-fg dark:text-black pb-8">
        Pump Bonding Curve
      </h1>
      <div className="text-[17px] font-normal leading-7 text-fg-muted mb-4 md:mb-8 dark:text-black">
        Query any pump.fun token that has not yet migrated to a decentralized
        exchange, and retrieve its bonding curve progress.
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
            serverCode={httpsServerPumpBondingCurve}
            clientCode={httpsClientPumpBondingCurve}
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

export default PumpBondingCurve;
