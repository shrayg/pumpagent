import { Link, useLocation, useNavigate } from "react-router-dom";
import { useContext, useState, useRef, useEffect } from "react";
import { LayoutDashboard, LogOut, Menu, X } from "lucide-react";
import { AuthContext } from "../../utils/AuthProvider";
import supabase from "../../utils/supabase";
import Logo from "../Brand/Logo";
import { appNav } from "../../utils/navigation";

const primaryLinks = [
  { label: "Docs", path: "/https/introduction", match: ["/https", "/websocket"] },
  ...appNav.map(({ label, path }) => ({
    label: label === "Trading Terminal" ? "Terminal" : label,
    path,
    match: [path],
  })),
  { label: "Tools", path: "/tools/wallet-generator", match: ["/tools"] },
  { label: "Pricing", path: "/fees", match: ["/fees"] },
];

// The /dex terminal renders its new-token ticker inside the header bar.
const ROUTES_WITH_HEADER_TICKER = ["/dex"];

const TopNav = ({ navOpen, setNavOpen }) => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { pathname, search } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const hideLinks = ROUTES_WITH_HEADER_TICKER.includes(pathname);

  const handleSignOut = async () => {
    try {
      setMenuOpen(false);
      await supabase.auth.signOut();
      localStorage.removeItem("sb-ewvqgcnetcqmnlkyjuww-auth-token");
      navigate(`/${search}`);
      window.location.reload();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setNavOpen(false);
    setMenuOpen(false);
  }, [pathname, setNavOpen]);

  const isActive = (match) => match.some((prefix) => pathname.startsWith(prefix));

  return (
    <header className="fixed top-0 inset-x-0 z-[8000] h-16 border-b border-line bg-canvas/80 backdrop-blur-xl">
      <nav className="h-full flex items-center gap-6 px-4 md:px-6">
        <Link to={`/${search}`} className="shrink-0" aria-label="Pump Agent home">
          <Logo />
        </Link>

        {!hideLinks && (
          <ul className="hidden xl:flex items-center gap-1 text-[13.5px] font-medium">
            {primaryLinks.map((link) => (
              <li key={link.path}>
                <Link
                  to={`${link.path}${search}`}
                  className={`px-3 py-2 rounded-md transition-colors ${
                    isActive(link.match)
                      ? "text-fg bg-surface-2"
                      : "text-fg-muted hover:text-fg hover:bg-surface-2/60"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        )}

        <div className="ml-auto flex items-center gap-2">
          {!user && (
            <>
              <Link
                to={`/signin${search}`}
                className="hidden sm:inline-flex h-9 items-center px-3 rounded-md text-[13.5px] font-medium text-fg-muted hover:text-fg transition-colors"
              >
                Sign in
              </Link>
              <Link
                to={`/signin${search}`}
                className="inline-flex h-9 items-center px-3.5 rounded-md text-[13.5px] font-semibold bg-accent text-accent-ink hover:bg-accent-hover transition-colors"
              >
                Get API key
              </Link>
            </>
          )}

          {user && (
            <div className="relative" ref={menuRef}>
              <button
                className="flex items-center gap-2 h-9 pl-1 pr-3 rounded-full border border-line bg-surface hover:border-line-strong transition-colors cursor-pointer"
                onClick={() => setMenuOpen((open) => !open)}
                aria-haspopup="menu"
                aria-expanded={menuOpen}
                aria-label="Account menu"
              >
                <span className="grid place-items-center w-7 h-7 rounded-full bg-accent-soft text-accent text-[12px] font-semibold">
                  {user.slice(0, 1).toUpperCase()}
                </span>
                <span className="hidden sm:inline text-[13px] font-medium text-fg max-w-[120px] truncate">
                  {user}
                </span>
              </button>
              {menuOpen && (
                <ul
                  className="absolute right-0 top-11 w-48 p-1 rounded-lg border border-line bg-surface shadow-2xl shadow-black/50 text-[13.5px] font-medium"
                  role="menu"
                >
                  <li role="none">
                    <button
                      role="menuitem"
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-fg-muted hover:text-fg hover:bg-surface-2 cursor-pointer"
                      onClick={() => navigate(`/dashboard${search}`)}
                    >
                      <LayoutDashboard className="w-4 h-4" /> Dashboard
                    </button>
                  </li>
                  <li role="none">
                    <button
                      role="menuitem"
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-fg-muted hover:text-fg hover:bg-surface-2 cursor-pointer"
                      onClick={handleSignOut}
                    >
                      <LogOut className="w-4 h-4" /> Sign out
                    </button>
                  </li>
                </ul>
              )}
            </div>
          )}

          <button
            className="xl:hidden grid place-items-center w-9 h-9 rounded-md text-fg-muted hover:text-fg hover:bg-surface-2 cursor-pointer"
            onClick={() => setNavOpen((open) => !open)}
            aria-label={navOpen ? "Close menu" : "Open menu"}
            aria-expanded={navOpen}
          >
            {navOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>
    </header>
  );
};

export default TopNav;
