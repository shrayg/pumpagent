import { useState } from "react";

import TokenPreview from "./TokenPreview";
import Launch from "./Launch";
import WalletsPreview from "./WalletsPreview";

const PreviewTab = ({
  form,
  wallets,
  balances,
  developerBalance,
  userData,
  setForm,
  setBalances,
  setDeveloperBalance,
}) => {
  const [tab, setTab] = useState("Token");

  return (
    <div className="min-w-[350px] max-w-[350px] h-full border-l border-l-gray-900 flex flex-col">
      <div className="flex text-gray-600  text-[12px] border-b border-b-gray-900 select-none ">
        <button
          className={`flex w-1/2 gap-1 justify-center items-center p-2 cursor-pointer border-r border-r-gray-900 ${
            tab === "Token"
              ? "bg-[#3337] hover:bg-[#3337] text-gray-400"
              : "hover:bg-[#050505]"
          }`}
          onClick={() => setTab("Token")}
        >
          Token Preview
        </button>
        <button
          className={`flex w-1/2 justify-center items-center p-2 cursor-pointer gap-1 ${
            tab === "Wallets"
              ? "bg-[#3337] hover:bg-[#3337] text-gray-400"
              : "hover:bg-[#050505]"
          }`}
          onClick={() => setTab("Wallets")}
        >
          Wallets Preview
        </button>
      </div>
      {tab === "Token" && <TokenPreview form={form} />}
      {tab === "Wallets" && (
        <WalletsPreview
          wallets={wallets}
          balances={balances}
          developerBalance={developerBalance}
          setBalances={setBalances}
          setDeveloperBalance={setDeveloperBalance}
        />
      )}
      <Launch
        form={form}
        wallets={wallets}
        userData={userData}
        setForm={setForm}
      />
    </div>
  );
};

export default PreviewTab;
