"use client";
import { BarChart4, MonitorPlay } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Sidebar = () => {
  const pathName = usePathname();
  const sidebarRoutes = [
    { icon: <MonitorPlay />, label: "Courses", path: "/instructor/courses" },
    {
      icon: <BarChart4 />,
      label: "Performance",
      path: "/instructor/performance",
    },
  ];
  return (
    <div className="flex flex-col w-64 border-r shadow-md px-3 my-4 gap-4 text-sm font-medium max-sm:hidden">
      {sidebarRoutes.map((route) => (
        <Link
          key={route.path}
          href={route.path}
          className={`flex items-center gap-4 p-3 rounded-lg hover:bg-[#FDAB04]/80 ${
            pathName.startsWith(route.path) && "bg-[#FDAb04]"
          }`}
        >
          {route.icon} {route.label}
        </Link>
      ))}
    </div>
  );
};

export default Sidebar;
