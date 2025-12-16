import { useLocation, useNavigate } from "react-router-dom";
import Forrest from "../../../assets/Forrest.png";

const CallToAction = () => {
  const navigate = useNavigate();
  const search = useLocation().search;

  const isMd = window.innerWidth > 780;

  return (
    <div className="w-full flex text-white justify-center flex-col relative min-h-screen items-center flex-1 pt-10  md:pt-20">
      <div className="flex flex-col absolute z-20">
        <h1 className="text-center font-pixel leading-5 px-4">
          LET'S SHIP{" "}
          <span className="text-[12px] relative text-gray-500">(together)</span>
        </h1>
        <div className="flex justify-center gap-4 z-20 pt-6">
          <button
            className="bg-green-900 transition duration-50 hover:bg-green-700 z-10 text-white text-[14px] w-initial p-2 cursor-pointer w-40 h-8"
            onClick={() => navigate(`/https/introduction${search}`)}
          >
            Read HTTPS Docs
          </button>
          <button
            className="bg-green-900 transition duration-50 hover:bg-green-700 z-10 text-white text-[14px] w-initial p-2 cursor-pointer w-40 h-8"
            onClick={() =>
              window.open(import.meta.env.VITE_DISCORD_URL, "_blank")
            }
          >
            Join Community
          </button>
        </div>
      </div>
      {isMd && (
        <div className="opacityfade flex-1">
          <img
            src={Forrest}
            alt="Forrest"
            className="w-full h-[calc(100vh-20rem)] md:h-full object-cover opacity-30 relative  dark:opacity-100 "
          />
        </div>
      )}
    </div>
  );
};

export default CallToAction;
