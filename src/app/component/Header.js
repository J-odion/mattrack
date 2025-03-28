"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { FaRegUserCircle, FaBars, FaTimes, FaArrowDown } from "react-icons/fa";
import AddReportForm from "./Disburse";
import RequestMatForm from "./requestMatFor";
import ContactManagement from "./ContactManagement";
import RegisterUser from "./registerStaff";
import { useDispatch, useSelector } from "react-redux";
import { loadUser } from "../libs/features/authSlice";
import DisburseData from "./Disburse";
import RecieveMat from "./Recieve";
import AddStaff from "./addStaff";
import TransferMat from "./transferMat";

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
  };
  const toggleRecieve = () => {
    setIsAddRecieveOpen(!isAddRecieveOpen);
  };
  const toggleTransfer = () => {
    setIsTransferMatOpen(!isTransferMatOpen);
  };
  const toggleRequestMat = () => {
    setIsRequestMatOpen(!isRequestMatOpen);
  };
  const toggleContact = () => {
    setIsContact(!isContact);
  };
  const toggleRegister = () => {
    setIsRegister(!isRegister);
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
      <nav className="flex w-full justify-center items-center bg-white ">
        <div className=" w-full lg:w-[1280px] flex justify-between items-center gap-4 ">

          <div className="w-3/4 py-4 flex gap-2 flex-col ">
            <div className="text-xl font-bold">
              <p>Inventory</p>
            </div>

            {/* Desktop Menu */}
            <div className="hidden lg:flex  items-start gap-4">
              {/* Show Update Inventory, Request Material, Contact Management for Store Keeper */}
              {(userRole === "storekeepers") && (
                <button
                  onClick={toggleRecieve}
                  className="bg-[#123962] w-[132px] h-[40px] text-[#FFFFFF] px-4 py-1 text-[12px] rounded-md"
                >
                  Recieve Materia
                </button>
              )}

              {(userRole === "storekeepers") && (
                <button
                  onClick={toggleTransfer}
                  className="bg-[#123962] w-[132px] h-[40px] text-[#FFFFFF] px-4 py-1 text-[12px] rounded-md"
                >
                  Transfer Materia
                </button>
              )}

              {(userRole === "storekeepers") && (
                <button
                  onClick={toggleDisburse}
                  className="bg-[#123962] w-[132px] h-[40px] text-[#FFFFFF] px-4 py-1 text-[12px] rounded-md"
                >
                  Disburse Materia
                </button>
              )}

              {/* Show Request Material for Store Keeper, Engineer, and Admin */}
              {(userRole === "engineers") && (
                <button
                  onClick={toggleRequestMat}
                  className="bg-[#123962] w-[152px] h-[40px] text-[#FFFFFF] px-4 py-1 text-[12px] rounded-md"
                >
                  Request Material
                </button>
              )}

              {/* Show Request Logs for Engineer and Admin */}
              {/* {(userRole === "engineers" || userRole === "admin") && (
                <button className="text-[#123962] border-[#123962] border w-[135px] h-[40px] bg-[#fff] font-semibold px-4 py-1 text-[12px] rounded-md">
                  Request Logs
                </button>
              )} */}

              {/* Show Add staff for admin */}
              {/* {userRole === "admin" && (
                <button
                  onClick={toggleRegister}
                  className="text-[#123962] border-[#123962] border w-[132px] h-[40px] bg-[#fff] font-semibold px-4 py-1 text-[12px] rounded-md"
                >
                  Add Staff
                </button>
              )}

              {(userRole === "admin") && (
                <button className="text-[#132124] h-[40px] bg-[#F7F8FA] px-4 py-1 text-[12px] rounded-md">
                  View All Staffs
                </button>
              )} */}

              {/* {(userRole === "storekeepers" ||
                userRole === "engineers" ||
                userRole === "viewer" ||
                userRole === "projectManager") && (
                  <button className="text-[#132124] border-[1.3px] border-[#123962] w-[150px] h-[40px] px-4 py-1 text-[12px] rounded-md">
                    View Schedules
                  </button>
                )} */}




              {/* Show Contact Management for all roles except guest */}
              {/* {(userRole === "storekeepers" ||
                userRole === "engineers" ||
                userRole === "viewer" ||
                userRole === "projectManager") && (
                  <button
                    onClick={toggleContact}
                    className="text-[#123962] border-[#123962] border w-[170px] h-[40px] bg-[#fff] font-semibold px-4 py-1 text-[12px] rounded-md"
                  >
                    Send Message
                  </button>
                )} */}
              {/* User Icon and Role */}
            </div>
          </div>

          <div className="  lg:flex flex-col items-center hidden">
            <button onClick={toggleMobileMenu}>
              <FaRegUserCircle />
            </button>
            <h4 className="text-xs">{userRole}</h4>
            <h4 className="text-xs font-bold">{userName}</h4>
          </div>
          <div className="flex gap-2">
            {/* Mobile Menu Icon */}
            <div className="lg:hidden">
              <button onClick={toggleMobileMenu}>
                {isMobileMenuOpen ? <FaTimes size={14} /> : <FaBars size={14} />}
              </button>
            </div>
          </div>

          {/* User Icon */}
          <div className="lg:hidden flex flex-col items-center justify-center">
            <button onClick={toggleMobileMenu}>
              <FaRegUserCircle />
            </button>
            <h4 className="text-xs">{userRole}</h4>
            <h4 className="text-xs font-bold">{userName}</h4>
            <FaArrowDown />
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="absolute top-20 left-0 w-full bg-white px-[12px] shadow-md z-10 lg:hidden">
            {/* Mobile Buttons */}
            {userRole !== "guest" && (
              <div className="flex flex-col gap-4 mt-4">
                {(userRole === "storekeepers" || userRole === "engineers") && (
                  <button
                    onClick={toggleAddReport}
                    className="bg-[#132124] w-full h-[40px] text-[#FFFFFF] px-4 py-1 text-[12px] rounded-full"
                  >
                    Add Report
                  </button>
                )}
                {(userRole === "storekeepers" || userRole === "engineers") && (
                  <button
                    onClick={toggleRequestMat}
                    className="bg-[#132124] w-full h-[40px] text-[#FFFFFF] px-4 py-1 text-[12px] rounded-full"
                  >
                    Request Material
                  </button>
                )}
                {/* {(userRole === "engineers" || userRole === "admin") && (
                  <button className="text-[#132124] w-full h-[40px] bg-[#F7F8FA] px-4 py-1 text-[12px] rounded-full">
                    Request Logs
                  </button>
                )} */}
                {(userRole === "storekeepers" ||
                  userRole === "engineers" ||
                  userRole === "viewer") && (
                    <button className="text-[#132124] w-full h-[40px] bg-[#F7F8FA] px-4 py-1 text-[12px] rounded-full">
                      Contact Management
                    </button>
                  )}

                {(userRole === "admin") && (
                  <button className="text-[#132124] w-full h-[40px] bg-[#F7F8FA] px-4 py-1 text-[12px] rounded-full">
                    View All Staffs
                  </button>
                )}
                {(userRole === "admin") && (
                  <button className="text-[#132124] w-full h-[40px] bg-[#F7F8FA] px-4 py-1 text-[12px] rounded-full">
                    View Schedules
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </nav>

      {/* Add Report Pop-up Form */}
      {isAddRecieveOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-20">
          <div className="relative bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl">
            <RecieveMat toggleForm={toggleRecieve} />
          </div>
        </div>
      )}

      {/* Add Report Pop-up Form */}
      {isAddDisburseOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-20">
          <div className="relative bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl">
            <DisburseData toggleForm={toggleDisburse} />
          </div>
        </div>
      )}

      {/* Request Material Pop-up form */}
      {isRequestMatOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-20">
          <div className="relative bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl">
            <RequestMatForm toggleForm={toggleRequestMat} />
          </div>
        </div>
      )}

            {/* Transfer Material Pop-up form */}
            {isTransferMatOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-20">
          <div className="relative bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl">
            <TransferMat toggleForm={toggleTransfer} />
          </div>
        </div>
      )}

      {/* Contact Management Pop-up form */}
      {isContact && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-20">
          <div className="relative bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl">
            <ContactManagement toggleForm={toggleContact} />
          </div>
        </div>
      )}

      {/* Register User Pop-up form */}
      {isRegister && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-20">
          <div className="relative bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl">
            <AddStaff toggleForm={toggleRegister} />
          </div>
        </div>
      )}
    </>
  );
}