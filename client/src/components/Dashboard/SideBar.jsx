import { TbDashboardFilled } from "react-icons/tb";
import { FaKey } from "react-icons/fa";
import { MdAttachMoney } from "react-icons/md";
import { TbChartBar } from "react-icons/tb";
import { GiReceiveMoney } from "react-icons/gi";

const SideBar = ({ menu, setMenu }) => {
  const menuItems = [
    { label: "Dashboard", icon: <TbDashboardFilled /> },
    { label: "API Key", icon: <FaKey /> },
    {
      label: "Fee Earnings",
      icon: <MdAttachMoney className="text-2xl mr-[-2px]" />,
    },
    {
      label: "Referrals",
      icon: <GiReceiveMoney className="text-lg mr-[-2px]" />,
    },
    {
      label: "Tiers",
      icon: <TbChartBar className="text-lg mr-[-2px]" />,
    },
  ];

  return (
    <aside className="min-w lg:min-w-[250px] border-r border-gray-900 flex flex-col pt-6 md:pt-12.5">
      <ul className="text-white dark:text-black text-[14px] p-2 transition sticky top-19 left-0 flex flex-col gap-2 select-none">
        {menuItems.map((item) => (
          <li
            key={item.label}
            className={`p-2 py-4 rounded-md pl-4 cursor-pointer flex justify-start items-center gap-2 ${
              menu === item.label
                ? "bg-[rgba(10,77,21,0.65)] dark:bg-[#22d300] "
                : "hover:bg-[rgb(3,21,6)] dark:hover:bg-[rgba(147,236,181,0.59)]"
            }`}
            onClick={() => setMenu(item.label)}
          >
            <span className="text-[20px] w-[28px]">{item.icon}</span>
            <span className="hidden lg:inline">{item.label}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default SideBar;
