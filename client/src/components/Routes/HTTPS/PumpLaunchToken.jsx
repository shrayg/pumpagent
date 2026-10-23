import { httpsServerPumpLaunchToken } from "../../../utils/servercode.js";
import { httpsClientPumpLaunchToken } from "../../../utils/clientcode.js";
import CodeBlock from "../../CodeBlock/CodeBlock";
import BlogNav from "../../BlogNav/BlogNav";
import Parameters from "../../Wrappers/Parameters";
import { httpsPumpLaunchTokenMetadata } from "../../../utils/codemetadata";
import { useState } from "react";
import Response from "../../Wrappers/Response.jsx";
import { useNavigate } from "react-router-dom";
import Pagination from "../../Pagination/Pagination.jsx";
import { Helmet } from "react-helmet";

const PumpLaunchToken = () => {
  const navigate = useNavigate();
  const [view, setView] = useState("client");
  const { parameters, response, response2 } = httpsPumpLaunchTokenMetadata;

  return (
    <article className="pt-0 text-[12px] text-white px-5 md:px-10 lg:px-10 flex-1 w-[97vw] xl:max-w-[950px] lg:mx-auto">
      <Helmet>
        <title>Pump Agent · Pump Launch Token</title>
        <meta property="og:title" content="Pump Agent · Pump Launch Token" />
      </Helmet>
      <Pagination />
      <h1 className="text-4xl lg:text-5xl text-fg dark:text-black pb-8">
        Pump Launch Token
      </h1>
      <div className="text-[17px] font-normal leading-7 text-fg-muted mt-0 md:mb-8 dark:text-black">
        Launch a token on pump.fun and pre buy from the developer's wallet.
        Optionally set up fees to be sent to your dashboard.
        <span
          className="text-greener cursor-pointer"
          onClick={() => navigate("/https/create-ipfs")}
        >
          {" "}
          Creating an IPFS storage object
        </span>{" "}
        is a prerequisite.
      </div>
      <div className="flex flex-col lg:flex-row w-full justify-center gap-2 mt-5 md:mt-10">
        <div className="w-full lg:w-1/2">
          <div className="sticky top-20">
            <Parameters parameters={parameters} />
            <Response parameters={response} />
            <Response parameters={response2} hideTitle={true} />
          </div>
        </div>

        <div className="w-full lg:w-1/2 flex flex-col gap-2 mt-4 lg:mt-0">
          <CodeBlock
            language="JavaScript"
            serverCode={httpsServerPumpLaunchToken}
            clientCode={httpsClientPumpLaunchToken}
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

export default PumpLaunchToken;
