import { useLocation, useNavigate } from "react-router-dom";
import { useDarkMode } from "../../utils/darkmodecontext";
import Vial from "../../assets/Logo.webp";
import { WiDayCloudy } from "react-icons/wi";
import { MdOutlineWbSunny } from "react-icons/md";
import { useContext, useState, useRef, useEffect } from "react";
import { AuthContext } from "../../utils/AuthProvider";
import { TbDashboardFilled } from "react-icons/tb";
import { PiSignOutBold } from "react-icons/pi";
import supabase from "../../utils/supabase";
import { RxHamburgerMenu } from "react-icons/rx";
import { IoCloseOutline } from "react-icons/io5";
import { FaDiscord } from "react-icons/fa";

const TopNav = ({ navOpen, setNavOpen }) => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const search = useLocation().search;
  const { darkMode, toggleColorScheme } = useDarkMode();
  const [expanded, setExpanded] = useState(false);
  const headerRef = useRef(null);

  const handleSignOut = async () => {
    try {
      setExpanded(false);
      await supabase.auth.signOut();
      localStorage.removeItem("sb-ewvqgcnetcqmnlkyjuww-auth-token");
      navigate(`/${search}`);
      window.location.reload();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    // Only add dark class if on /dex and darkMode is true
    if (window.location.pathname === "/dex" && darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  // Detect outside clicks to close expanded menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (headerRef.current && !headerRef.current.contains(event.target)) {
        setExpanded(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDashboard = () => {
    setExpanded(false);
    navigate("/dashboard");
  };

  const handleDiscord = () => {
    window.open(import.meta.env.VITE_DISCORD_URL, "_blank");
  };

  // Responsive check for mobile menu logic
  // Better to track with state and resize listener if you want reactive, but this is fine for now
  const mobile = window.innerWidth < 1200 && navOpen;
  const app = window.location.pathname === "/dex";

  return (
    <header className="border-b border-gray-900 bg-black dark:bg-white dark:border-gray-200 h-[70px] w-full flex justify-between items-center fixed top-0 z-[8000]">
      <nav className="flex justify-between items-center gap-2 pr-2 sm:pr-6 px-6 w-full">
        <div
          className="flex justify-center items-center gap-1 select-none cursor-pointer"
          onClick={() => navigate(`/${search}`)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && navigate(`/${search}`)}
        >
          <img src={Vial} alt="Pumpkit" className="w-6.5 rounded-md" />
          <h2 className="text-white dark:text-black text-[20px] font-pixel">
            Pump<span className="text-greener">Vial</span>
          </h2>
        </div>

        <div className="flex items-center">
          {!app && (
            <div
              className={`hover:bg-gray-900 dark:hover:bg-gray-200 p-2 mt-1 rounded-full ${
                navOpen ? "flex" : "hidden"
              } justify-center items-center cursor-pointer md:mr-2 xl:flex ${
                darkMode
                  ? "dark:hover:text-black"
                  : "dark:hover:text-white relative"
              }`}
              onClick={toggleColorScheme}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && toggleColorScheme()}
              aria-label="Toggle color scheme"
            >
              {!darkMode ? (
                <MdOutlineWbSunny className="text-[22px] text-gray-600 hover:text-black" />
              ) : (
                <WiDayCloudy className="text-[24px] text-gray-500 hover:text-white" />
              )}
            </div>
          )}
          <button
            className="bg-purple-500 text-[12px] p-1.5 px-2 hidden xl:flex justify-center items-center gap-2 rounded-md cursor-pointer hover:rounded-2xl transition-all duration-200 ease-in-out hover:text-white mr-2 select-none"
            onClick={handleDiscord}
            aria-label="Open Discord"
          >
            <FaDiscord className="text-[16px]" />
            Discord
          </button>
          {!mobile && (
            <div className="relative flex" ref={headerRef}>
              {!user && (
                <button
                  className="bg-green-700 hover:bg-green-600 text-[12px] p-2 flex justify-center items-center gap-2 rounded-md cursor-pointer ease-in-out text-white mr-2"
                  onClick={() => navigate(`/signin${search}`)}
                >
                  Sign In
                </button>
              )}
              {user && (
                <div className="flex flex-col select-none">
                  <button
                    className={`border border-gray-700 dark:text-black rounded-full text-[12px] p-2 flex justify-center items-center gap-2 ${
                      expanded
                        ? ""
                        : "rounded-md cursor-pointer hover:bg-green-600"
                    }  ease-in-out text-white mr-2 w-full`}
                    onClick={() => setExpanded(!expanded)}
                    aria-haspopup="true"
                    aria-expanded={expanded}
                    aria-label="User menu"
                  >
                    <img src={Vial} alt="Vial" className="w-3.5 mr-[-3px]" />
                    {user.slice(0, 1).toUpperCase()}
                  </button>
                  {expanded && (
                    <ul
                      className="absolute top-[35px] bg-tile text-white right-0 w-[150px] flex flex-col justify-center items-center select-none border border-gray-800 rounded-md overflow-hidden text-[14px]"
                      role="menu"
                      aria-label="User options"
                    >
                      <li
                        className="py-3 w-full text-center cursor-pointer hover:bg-green-600 flex justify-start pl-2 items-center gap-2"
                        onClick={handleDashboard}
                        role="menuitem"
                        tabIndex={0}
                        onKeyDown={(e) =>
                          e.key === "Enter" && handleDashboard()
                        }
                      >
                        <TbDashboardFilled /> Dashboard
                      </li>
                      <li
                        className="py-3 w-full text-center cursor-pointer hover:bg-green-600 flex justify-start pl-2 items-center gap-2"
                        onClick={handleSignOut}
                        role="menuitem"
                        tabIndex={0}
                        onKeyDown={(e) => e.key === "Enter" && handleSignOut()}
                      >
                        <PiSignOutBold /> Sign Out
                      </li>
                    </ul>
                  )}
                </div>
              )}
            </div>
          )}
          <button
            className="text-white p-2 cursor-pointer text-4xl flex xl:hidden hover:text-white pr-0"
            onClick={() => setNavOpen((prev) => !prev)}
            aria-label={navOpen ? "Close menu" : "Open menu"}
          >
            {navOpen ? (
              <IoCloseOutline className="text-[42px] dark:text-black" />
            ) : (
              <RxHamburgerMenu className="dark:text-black" />
            )}
          </button>
        </div>
      </nav>
    </header>
  );
};

export default TopNav;
