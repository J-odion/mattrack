"use client";
import { useState } from "react";
import Image from "next/image";
import { FaCaretDown, FaBars, FaTimes } from "react-icons/fa";
import Link from "next/link";
import AddReportForm from "./ReportForm";
import RequestMatForm from "./requestMatFor";
import ContactManagement from "./ContactManagement";

// components/Navbar.js
export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAddReportOpen, setIsAddReportOpen] = useState(false);
  const [isRequestMatOpen, setIsRequestMatOpen] = useState(false);
  const [isContact, setIsContact] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  const toggleAddReport = () => {
    setIsAddReportOpen(!isAddReportOpen);
  };
  const toggleRequestMat = () => {
    setIsRequestMatOpen(!isRequestMatOpen);
  };
  const toggleContact = () => {
    setIsContact(!isContact);
  };

  return (
    <>
      <nav className="flex w-full justify-center items-center p-6 bg-white ">
        <div className=" w-full lg:w-[1280px] flex justify-between items-center ">
          <div className="text-xl font-bold">
            <a href="/">
              <Image src="/assets/logo.png" width={140} height={38} />
            </a>
          </div>

          {/* Mobile Menu Icon */}
          <div className="lg:hidden">
            <button onClick={toggleMobileMenu}>
              {isMobileMenuOpen ? <FaTimes size={14} /> : <FaBars size={14} />}
            </button>
          </div>

          {/* Desktop Menu */}

          {/* Desktop Buttons */}
          <div className="hidden lg:flex gap-4">
            <button
              onClick={toggleAddReport}
              className="bg-[#123962] w-[132px] h-[40px] text-[#FFFFFF] px-4 py-1 text-[16px] rounded-full"
            >
              Add Report
            </button>

            <button className="text-[#123962] border-[#123962] border w-[182px] h-[40px] bg-[#fff] font-semibold px-4 py-1 text-[16px] rounded-full">
              Download Report
            </button>
            <button
              onClick={toggleRequestMat}
              className="bg-[#123962] w-[192px] h-[40px] text-[#FFFFFF] px-4 py-1 text-[16px] rounded-full"
            >
              Request Material
            </button>
            <button onClick={toggleContact} className="text-[#123962] border-[#123962] border w-[220px] h-[40px] bg-[#fff] font-semibold px-4 py-1 text-[16px] rounded-full">
              Contact Management
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="absolute top-20 left-0 w-full bg-white px-[16px] shadow-md z-10 lg:hidden">
            {/* Mobile Buttons */}
            <div className="flex flex-col gap-4 mt-4">
              <button
                onClick={toggleAddReport}
                className="bg-[#132124] w-full h-[40px] text-[#FFFFFF] px-4 py-1 text-[16px] rounded-full"
              >
                Add Report
              </button>
              <button className="text-[#132124] w-full h-[40px] bg-[#F7F8FA] px-4 py-1 text-[16px] rounded-full">
                Download Report
              </button>
              <button className="text-[#132124] w-full h-[40px] bg-[#F7F8FA] px-4 py-1 text-[16px] rounded-full">
                Contact Management
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Add Report Pop-up Form */}
      {isAddReportOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-20">
          <div className="relative bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl">
            <AddReportForm toggleForm={toggleAddReport} />
          </div>
        </div>
      )}

      {/* { Request a material pop-up form} */}

      {isRequestMatOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-20">
          <div className="relative bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl">
            <RequestMatForm toggleForm={toggleRequestMat} />
          </div>
        </div>
      )}

      {isContact && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-20">
          <div className="relative bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl">
            <ContactManagement toggleForm={toggleContact} />
          </div>
        </div>
      )}
    </>
  );
}
