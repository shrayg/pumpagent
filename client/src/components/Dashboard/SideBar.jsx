import { BadgeDollarSign, Gauge, KeyRound, LayoutDashboard, Users } from "lucide-react";

const menuItems = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "API Key", icon: KeyRound },
  { label: "Fee Earnings", icon: BadgeDollarSign },
  { label: "Referrals", icon: Users },
  { label: "Tiers", icon: Gauge },
];

const SideBar = ({ menu, setMenu }) => (
  <aside className="shrink-0 lg:w-[240px] border-r border-line" aria-label="Dashboard">
    <ul className="sticky top-16 flex flex-col gap-0.5 p-3 pt-8 text-[14px] font-medium select-none">
      {menuItems.map((item) => {
        const { label } = item;
        const active = menu === label;
        return (
          <li key={label}>
            <button
              className={`w-full flex items-center gap-3 rounded-md px-3 py-2 cursor-pointer transition-colors ${
                active
                  ? "bg-accent-soft text-accent"
                  : "text-fg-muted hover:text-fg hover:bg-surface-2"
              }`}
              onClick={() => setMenu(label)}
              aria-current={active ? "page" : undefined}
              title={label}
            >
              <item.icon className="w-4 h-4 shrink-0" />
              <span className="hidden lg:inline">{label}</span>
            </button>
          </li>
        );
      })}
    </ul>
  </aside>
);

export default SideBar;
