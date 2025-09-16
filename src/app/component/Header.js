"use client";
import Image from "next/image";

export default function Navbar() {
  return (
    <nav className="flex w-full justify-center items-center bg-[#123962] shadow-md">
      <div className="max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-4">
        <a href="/" className="flex items-center">
          <Image
            src="/assets/whiteLogo.png"
            width={70}
            height={40}
            className="w-auto h-4 sm:h-6"
            alt="IXE Logistics Logo"
            priority
          />
        </a>
        <div className="text-lg sm:text-xl font-bold text-white">
          <p>Inventory</p>
        </div>
      </div>
    </nav>
  );
}