import { FaCheck } from "react-icons/fa";
import { MdOutlineBlock } from "react-icons/md";

const iconMap = {
  success: <FaCheck className="text-greener text-[14px]" />,
  error: <MdOutlineBlock className="text-orange-500 text-[14px]" />,
  none: "",
};

const messageConfig = {
  "Wallets Successfully Funded. Auto Refreshing in 15 Sec.": "success",
  "Token Info Updated": "success",
  "Bundle sold!": "success",
  "Bundle Deployed!": "success",
  "Rent Claimed Successfully!": "success",
  "Successfully Reclaimed SOL.": "success",
  "Failed To Fund Wallets": "error",
  "Failed To Claim Rent.": "error",
  "Failed To Claim SOL.": "error",
  "Failed To Confirm Bundle.": "error",
  "Network congested. Auto-retrying deployment.": "error",
  "Retrying failed deployment.": "error",
  "Network congested. Endpoint is globally rate limited.": "error",
  "Failed To Update Info": "error",
  "Failed to update info. Contact the dev team.": "error",
  "No Changes To Save": "none",
};

const Toast = ({ message }) => {
  const type = messageConfig[message];

  if (!type) return null;

  return (
    <div className="absolute h-15 bottom-2 left-2 bg-[#222] rounded-md flex justify-center items-center p-2 border border-[#0bd50069] opacity-0 toastin z-5000">
      <div className="m-1 flex justify-center items-center gap-2 mx-4">
        {iconMap[type]}
        <span className="text-white text-[12px]">{message}</span>
      </div>
    </div>
  );
};

export default Toast;
