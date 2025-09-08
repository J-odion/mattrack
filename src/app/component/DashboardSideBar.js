"use client";
import Image from "next/image";
import { FaCheck, FaBars, FaTimes } from "react-icons/fa";
import { LuLogOut } from "react-icons/lu";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { logout, loadUser } from "../libs/features/authSlice";
import { useState, useEffect } from "react";
import DisburseData from "./Disburse";
import RequestMatForm from "./requestMatFor";
import ContactManagement from "./ContactManagement";
import RecieveMat from "./Recieve";
import AddStaff from "./addStaff";
import TransferMat from "./transferMat";

const DashboardSideBar = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user } = useSelector((state) => state.auth);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isAddDisburseOpen, setIsAddDisburseOpen] = useState(false);
  const [isAddRecieveOpen, setIsAddRecieveOpen] = useState(false);
  const [isRequestMatOpen, setIsRequestMatOpen] = useState(false);
  const [isTransferMatOpen, setIsTransferMatOpen] = useState(false);
  const [isContact, setIsContact] = useState(false);
  const [isRegister, setIsRegister] = useState(false);

  const handleLogout = () => {
    dispatch(logout()); // Clear Redux state and localStorage
    router.push("/"); // Redirect to login page
  };

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  const toggleDisburse = () => {
    setIsAddDisburseOpen(!isAddDisburseOpen);
    setIsMobileSidebarOpen(false);
  };

  const toggleRecieve = () => {
    setIsAddRecieveOpen(!isAddRecieveOpen);
    setIsMobileSidebarOpen(false);
  };

  const toggleTransfer = () => {
    setIsTransferMatOpen(!isTransferMatOpen);
    setIsMobileSidebarOpen(false);
  };

  const toggleRequestMat = () => {
    setIsRequestMatOpen(!isRequestMatOpen);
    setIsMobileSidebarOpen(false);
  };

  const toggleContact = () => {
    setIsContact(!isContact);
    setIsMobileSidebarOpen(false);
  };

  const toggleRegister = () => {
    setIsRegister(!isRegister);
    setIsMobileSidebarOpen(false);
  };

  useEffect(() => {
    if (!user) {
      dispatch(loadUser());
    }
  }, [user, dispatch]);

  // Fallback role if user is null
  const userRole = user ? user.role : "guest";
  const userName = user ? user.name : "guest";

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
        className={`${isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
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
          <div className="flex flex-col items-start">
            <h4 className="text-sm capitalize">{userRole}</h4>
            <h4 className="text-sm font-semibold">{userName}</h4>
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="flex-1 w-full px-6">
          <ul className="space-y-2">
            <li>
              <a
                href="/appdata"
                className="flex items-center gap-2 text-sm sm:text-base hover:bg-[#0e2c4f] p-2 rounded-md transition-colors"
              >
                <FaCheck size={16} />
                Dashboard
              </a>
            </li>

            {(userRole === "storekeepers" || userRole === "admin") && (
              <>
                <li>
                  <button
                    onClick={toggleRecieve}
                    className="flex items-center gap-2 w-full text-sm sm:text-base hover:bg-[#0e2c4f] p-2 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-white"
                  >
                    <FaCheck size={16} />
                    Receive Material
                  </button>
                </li>
                <li>
                  <button
                    onClick={toggleTransfer}
                    className="flex items-center gap-2 w-full text-sm sm:text-base hover:bg-[#0e2c4f] p-2 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-white"
                  >
                    <FaCheck size={16} />
                    Transfer Material
                  </button>
                </li>
                <li>
                  <button
                    onClick={toggleDisburse}
                    className="flex items-center gap-2 w-full text-sm sm:text-base hover:bg-[#0e2c4f] p-2 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-white"
                  >
                    <FaCheck size={16} />
                    Disburse Material
                  </button>
                </li>
              </>
            )}
            {(userRole === "engineers" || userRole === "projectEngineer" || userRole === "projectManager" || userRole === "admin") && (
              <li>
                <button
                  onClick={toggleRequestMat}
                  className="flex items-center gap-2 w-full text-sm sm:text-base hover:bg-[#0e2c4f] p-2 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-white"
                >
                  <FaCheck size={16} />
                  Request Material
                </button>
              </li>
            )}
            {/* {(userRole === "storekeepers" || userRole === "engineers" || userRole === "viewer" || userRole === "projectManager" || userRole === "admin") && (
              <li>
                <button
                  onClick={toggleContact}
                  className="flex items-center gap-2 w-full text-sm sm:text-base hover:bg-[#0e2c4f] p-2 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-white"
                >
                  <FaCheck size={16} />
                  Send Message
                </button>
              </li>
            )} */}
            {userRole === "admin" && (
              <>
                {/* <li>
                  <button
                    onClick={toggleRecieve}
                    className="flex items-center gap-2 w-full text-sm sm:text-base hover:bg-[#0e2c4f] p-2 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-white"
                  >
                    <FaCheck size={16} />
                    View All Staffs
                  </button>
                </li>
                <li>
                  <a
                    href="/staffs"
                    className="flex items-center gap-2 text-sm sm:text-base hover:bg-[#0e2c4f] p-2 rounded-md transition-colors"
                  >
                    <FaCheck size={16} />
                    View All Staffs
                  </a>
                </li>
                <li>
                  <a
                    href="/schedules"
                    className="flex items-center gap-2 text-sm sm:text-base hover:bg-[#0e2c4f] p-2 rounded-md transition-colors"
                  >
                    <FaCheck size={16} />
                    View Schedules
                  </a>
                </li> */}
              </>
            )}
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

      {/* Modals */}
      {isAddRecieveOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-20">
          <div className="relative bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-md sm:max-w-lg md:max-w-2xl max-h-[90vh] overflow-y-auto">
            <RecieveMat toggleForm={toggleRecieve} />
          </div>
        </div>
      )}

      {isAddDisburseOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-20">
          <div className="relative bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-md sm:max-w-lg md:max-w-2xl max-h-[90vh] overflow-y-auto">
            <DisburseData toggleForm={toggleDisburse} />
          </div>
        </div>
      )}

      {isRequestMatOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-20">
          <div className="relative bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-md sm:max-w-lg md:max-w-2xl max-h-[90vh] overflow-y-auto">
            <RequestMatForm toggleForm={toggleRequestMat} />
          </div>
        </div>
      )}

      {isTransferMatOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-20">
          <div className="relative bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-md sm:max-w-lg md:max-w-2xl max-h-[90vh] overflow-y-auto">
            <TransferMat toggleForm={toggleTransfer} />
          </div>
        </div>
      )}

      {isContact && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-20">
          <div className="relative bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-md sm:max-w-lg md:max-w-2xl max-h-[90vh] overflow-y-auto">
            <ContactManagement toggleForm={toggleContact} />
          </div>
        </div>
      )}

      {isRegister && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-20">
          <div className="relative bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-md sm:max-w-lg md:max-w-2xl max-h-[90vh] overflow-y-auto">
            <AddStaff toggleForm={toggleRegister} />
          </div>
        </div>
      )}
    </>
  );
};

export default DashboardSideBar;