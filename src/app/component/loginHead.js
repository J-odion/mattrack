"use client";
import { useState } from "react";
import Image from "next/image";
import { FaCaretDown, FaBars, FaTimes } from "react-icons/fa";

// components/Navbar.js
export default function LoginNavbar() {
  

  return (
    <>
      <nav className="flex w-full justify-center border-b  items-center p-4 bg-white ">
        <div className=" w-full lg:w-[1280px] flex justify-between items-center ">
          <div className="text-xl font-bold">
            <a href="/">
              <Image src="/assets/logo.png" width={140} height={38} />
            </a>
          </div>
        </div>
      </nav>
    </>
  );
}
