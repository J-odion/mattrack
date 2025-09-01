"use client";
import { useEffect, useState } from "react";
import { FaRegUserCircle, FaBars, FaTimes, FaArrowDown } from "react-icons/fa";
import DisburseData from "./Disburse";
import RequestMatForm from "./requestMatFor";
import ContactManagement from "./ContactManagement";
import RecieveMat from "./Recieve";
import AddStaff from "./addStaff";
import TransferMat from "./transferMat";
import { useDispatch, useSelector } from "react-redux";
import { loadUser } from "../libs/features/authSlice";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAddDisburseOpen, setIsAddDisburseOpen] = useState(false);
  const [isAddRecieveOpen, setIsAddRecieveOpen] = useState(false);
  const [isRequestMatOpen, setIsRequestMatOpen] = useState(false);
  const [isTransferMatOpen, setIsTransferMatOpen] = useState(false);
  const [isContact, setIsContact] = useState(false);
  const [isRegister, setIsRegister] = useState(false);

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  const toggleDisburse = () => {
    setIsAddDisburseOpen(!isAddDisburseOpen);
    setIsMobileMenuOpen(false);
  };
  const toggleRecieve = () => {
    setIsAddRecieveOpen(!isAddRecieveOpen);
    setIsMobileMenuOpen(false);
  };
  const toggleTransfer = () => {
    setIsTransferMatOpen(!isTransferMatOpen);
    setIsMobileMenuOpen(false);
  };
  const toggleRequestMat = () => {
    setIsRequestMatOpen(!isRequestMatOpen);
    setIsMobileMenuOpen(false);
  };
  const toggleContact = () => {
    setIsContact(!isContact);
    setIsMobileMenuOpen(false);
  };
  const toggleRegister = () => {
    setIsRegister(!isRegister);
    setIsMobileMenuOpen(false);
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
      <nav className="flex w-full justify-center items-center bg-white shadow-md">
        <div className="max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center gap-4">
          <div className="flex flex-col gap-2">
            <div className="text-lg sm:text-xl font-bold text-[#123962]">
              <p>Inventory</p>
            </div>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center gap-3">
              {userRole === "storekeepers" && (
                <>
                  <button
                    onClick={toggleRecieve}
                    className="bg-[#123962] text-white px-4 py-2 rounded-md text-sm hover:bg-[#0e2c4f] focus:outline-none focus:ring-2 focus:ring-[#123962]"
                  >
                    Receive Material
                  </button>
                  <button
                    onClick={toggleTransfer}
                    className="bg-[#123962] text-white px-4 py-2 rounded-md text-sm hover:bg-[#0e2c4f] focus:outline-none focus:ring-2 focus:ring-[#123962]"
                  >
                    Transfer Material
                  </button>
                  <button
                    onClick={toggleDisburse}
                    className="bg-[#123962] text-white px-4 py-2 rounded-md text-sm hover:bg-[#0e2c4f] focus:outline-none focus:ring-2 focus:ring-[#123962]"
                  >
                    Disburse Material
                  </button>
                </>
              )}
              {(userRole === "engineers" || userRole === "projectEngineer" || userRole === "projectManager") && (
                <button
                  onClick={toggleRequestMat}
                  className="bg-[#123962] text-white px-4 py-2 rounded-md text-sm hover:bg-[#0e2c4f] focus:outline-none focus:ring-2 focus:ring-[#123962]"
                >
                  Request Material
                </button>
              )}
              {userRole === "admin" && (
                <button
                  onClick={toggleRegister}
                  className="border border-[#123962] text-[#123962] px-4 py-2 rounded-md text-sm hover:bg-[#123962] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#123962]"
                >
                  Add Staff
                </button>
              )}
              {(userRole === "storekeepers" || userRole === "engineers" || userRole === "viewer" || userRole === "projectManager") && (
                <button
                  onClick={toggleContact}
                  className="border border-[#123962] text-[#123962] px-4 py-2 rounded-md text-sm hover:bg-[#123962] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#123962]"
                >
                  Send Message
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Desktop User Info */}
            <div className="hidden lg:flex flex-col items-center">
              <FaRegUserCircle className="text-xl text-[#123962]" />
              <h4 className="text-sm capitalize">{userRole}</h4>
              <h4 className="text-sm font-semibold">{userName}</h4>
            </div>

            {/* Mobile Menu Toggle */}
            <div className="lg:hidden">
              <button onClick={toggleMobileMenu} className="focus:outline-none focus:ring-2 focus:ring-[#123962]">
                {isMobileMenuOpen ? <FaTimes size={20} className="text-[#123962]" /> : <FaBars size={20} className="text-[#123962]" />}
              </button>
            </div>

            {/* Mobile User Info */}
            <div className="lg:hidden flex flex-col items-center">
              <FaRegUserCircle className="text-xl text-[#123962]" />
              <h4 className="text-xs capitalize">{userRole}</h4>
              <h4 className="text-xs font-semibold">{userName}</h4>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden w-full bg-white shadow-lg px-4 py-6 z-10">
          <div className="flex flex-col gap-3">
            {userRole === "storekeepers" && (
              <>
                <button
                  onClick={toggleRecieve}
                  className="bg-[#123962] text-white px-4 py-2 rounded-md text-sm hover:bg-[#0e2c4f] focus:outline-none focus:ring-2 focus:ring-[#123962]"
                >
                  Receive Material
                </button>
                <button
                  onClick={toggleTransfer}
                  className="bg-[#123962] text-white px-4 py-2 rounded-md text-sm hover:bg-[#0e2c4f] focus:outline-none focus:ring-2 focus:ring-[#123962]"
                >
                  Transfer Material
                </button>
                <button
                  onClick={toggleDisburse}
                  className="bg-[#123962] text-white px-4 py-2 rounded-md text-sm hover:bg-[#0e2c4f] focus:outline-none focus:ring-2 focus:ring-[#123962]"
                >
                  Disburse Material
                </button>
              </>
            )}
            {(userRole === "engineers" || userRole === "projectEngineer" || userRole === "projectManager") && (
              <button
                onClick={toggleRequestMat}
                className="bg-[#123962] text-white px-4 py-2 rounded-md text-sm hover:bg-[#0e2c4f] focus:outline-none focus:ring-2 focus:ring-[#123962]"
              >
                Request Material
              </button>
            )}
            {userRole === "admin" && (
              <>
                <button
                  onClick={toggleRegister}
                  className="border border-[#123962] text-[#123962] px-4 py-2 rounded-md text-sm hover:bg-[#123962] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#123962]"
                >
                  Add Staff
                </button>
                <button
                  className="border border-[#123962] text-[#123962] px-4 py-2 rounded-md text-sm hover:bg-[#123962] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#123962]"
                >
                  View All Staffs
                </button>
                <button
                  className="border border-[#123962] text-[#123962] px-4 py-2 rounded-md text-sm hover:bg-[#123962] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#123962]"
                >
                  View Schedules
                </button>
              </>
            )}
            {(userRole === "storekeepers" || userRole === "engineers" || userRole === "viewer" || userRole === "projectManager") && (
              <button
                onClick={toggleContact}
                className="border border-[#123962] text-[#123962] px-4 py-2 rounded-md text-sm hover:bg-[#123962] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#123962]"
              >
                Send Message
              </button>
            )}
          </div>
        </div>
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
}