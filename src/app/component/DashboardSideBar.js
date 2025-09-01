"use client";
import Image from "next/image";
import { FaCheck, FaBars, FaTimes } from "react-icons/fa";
import { LuLogOut } from "react-icons/lu";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { logout } from "../libs/features/authSlice";
import { useState } from "react";

const DashboardSideBar = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout()); // Clear Redux state and localStorage
    router.push("/"); // Redirect to login page
  };

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={toggleMobileSidebar}
        className="lg:hidden fixed top-4 left-4 z-50 text-[#123962] focus:outline-none focus:ring-2 focus:ring-[#123962]"
      >
        {isMobileSidebarOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
      </button>

      {/* Sidebar */}
      <div
        className={`${
          isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 fixed lg:static top-0 left-0 w-64 h-full bg-[#123962] text-white flex flex-col items-start gap-4 transition-transform duration-300 ease-in-out z-40 lg:flex`}
      >
        <div className="flex flex-col gap-4 p-6 w-full">
          <a href="/" className="flex items-center">
            <Image
              src="/assets/whiteLogo.png"
              width={120}
              height={40}
              className="w-auto h-8 sm:h-10"
              alt="IXE Logistics Logo"
              priority
            />
          </a>
          <div className="bg-slate-400 rounded-md p-2 w-3/4 sm:w-1/2">
            <p className="text-[#123962] font-medium text-xs sm:text-sm">IXE Logistics</p>
          </div>
        </div>

        {/* Menu Placeholder */}
        <div className="flex-1 w-full px-6">
          <ul className="space-y-2">
            {/* Placeholder menu items; replace with actual navigation links */}
            <li>
              <a
                href="/dashboard"
                className="flex items-center gap-2 text-sm sm:text-base hover:bg-[#0e2c4f] p-2 rounded-md transition-colors"
              >
                <FaCheck size={16} />
                Dashboard
              </a>
            </li>
            <li>
              <a
                href="/inventory"
                className="flex items-center gap-2 text-sm sm:text-base hover:bg-[#0e2c4f] p-2 rounded-md transition-colors"
              >
                <FaCheck size={16} />
                Inventory
              </a>
            </li>
            <li>
              <a
                href="/reports"
                className="flex items-center gap-2 text-sm sm:text-base hover:bg-[#0e2c4f] p-2 rounded-md transition-colors"
              >
                <FaCheck size={16} />
                Reports
              </a>
            </li>
          </ul>
        </div>

        {/* Logout Button */}
        <div className="p-6 w-full">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full text-sm sm:text-base hover:bg-[#0e2c4f] p-2 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-white"
          >
            <LuLogOut size={20} />
            Logout
          </button>
        </div>
      </div>

      {/* Overlay for Mobile Sidebar */}
      {isMobileSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={toggleMobileSidebar}
        ></div>
      )}
    </>
  );
};

export default DashboardSideBar;