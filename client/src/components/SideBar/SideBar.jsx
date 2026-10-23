import { Link, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../utils/AuthProvider";
import { appNav, docsNav } from "../../utils/navigation";

const NavItem = ({ to, active, children }) => (
  <li>
    <Link
      to={to}
      aria-current={active ? "page" : undefined}
      className={`block rounded-md px-3 py-1.5 text-[13.5px] transition-colors ${
        active
          ? "bg-accent-soft text-accent font-medium"
          : "text-fg-muted hover:text-fg hover:bg-surface-2"
      }`}
    >
      {children}
    </Link>
  </li>
);

const SideBar = ({ navOpen, docked }) => {
  const { pathname, search } = useLocation();
  const { user } = useContext(AuthContext);

  if (!navOpen && !docked) return null;

  return (
    <aside
      className={`${
        navOpen
          ? "fixed inset-x-0 top-16 bottom-0 z-[7000] flex bg-canvas"
          : "hidden xl:flex sticky top-16 h-[calc(100vh-4rem)]"
      } w-full xl:w-[264px] xl:shrink-0 flex-col border-r border-line select-none`}
      aria-label="Documentation"
    >
      <nav className="flex-1 overflow-y-auto thin-scroll px-3 py-6">
        {navOpen && (
          <div className="xl:hidden mb-6">
            <p className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-fg-subtle">
              Apps
            </p>
            <ul className="flex flex-col gap-0.5">
              {appNav.map((app) => (
                <li key={app.path}>
                  <Link
                    to={`${app.path}${search}`}
                    className="flex items-center gap-2.5 rounded-md px-3 py-2 text-[14px] text-fg hover:bg-surface-2"
                  >
                    <app.icon className="w-4 h-4 text-accent" /> {app.label}
                  </Link>
                </li>
              ))}
              {user ? (
                <NavItem to={`/dashboard${search}`} active={pathname === "/dashboard"}>
                  Dashboard
                </NavItem>
              ) : (
                <NavItem to={`/signin${search}`} active={pathname === "/signin"}>
                  Sign in
                </NavItem>
              )}
            </ul>
          </div>
        )}

        {docsNav.map((group) => (
          <div key={group.title} className="mb-6 last:mb-0">
            <p className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-fg-subtle">
              {group.title}
            </p>
            <ul className="flex flex-col gap-0.5">
              {group.items.map((item) => (
                <NavItem
                  key={item.path}
                  to={`${item.path}${search}`}
                  active={pathname === item.path}
                >
                  {item.label}
                </NavItem>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
};

export default SideBar;
