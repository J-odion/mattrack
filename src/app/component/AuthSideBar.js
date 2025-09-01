"use client";
import Image from "next/image";
import { FaCheck } from "react-icons/fa";

const AuthSideBar = () => {
  return (
    <div className="w-full h-full text-white flex flex-col items-start gap-6 p-4 sm:p-8 lg:p-14 bg-[#123962]">
      <div className="relative flex flex-col gap-4 w-full">
        {/* Logo */}
        <a href="/" className="absolute right-0 top-0 z-50">
          <Image
            src="/assets/whiteLogo.PNG"
            width={120}
            height={40}
            className="w-auto h-8 sm:h-10"
            alt="IXE Logistics Logo"
            priority
          />
        </a>

        {/* Company Name */}
        <div className="bg-slate-400 rounded-md p-2 w-fit max-w-[150px]">
          <p className="text-[#123962] font-semibold text-sm sm:text-base">IXE Logistics</p>
        </div>

        {/* Heading */}
        <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold">
          Buy, <span className="text-green-500">build</span> and own a <br />property today!
        </h2>

        {/* Description */}
        <p className="text-sm sm:text-base text-gray-200">
          We build and sell affordable lands, homes, and luxury homes
        </p>
      </div>

      {/* Image */}
      <div className="w-full mt-4 sm:mt-6">
        <Image
          src="/assets/authGroup.png"
          width={400}
          height={200}
          className="w-full h-auto object-cover"
          alt="Auth Group Illustration"
          priority
        />
      </div>

      {/* Features List */}
      <div className="flex flex-col gap-3 sm:gap-4">
        {[
          "Track your inventory data",
          "Monitor logs and view insights",
          "Manage staff and sites",
          "Prompt material requests",
          "Rapid report generation",
        ].map((text, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className="bg-green-500 p-1.5 rounded-full shadow-sm">
              <FaCheck size={12} color="white" />
            </div>
            <p className="text-sm sm:text-base">{text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AuthSideBar;