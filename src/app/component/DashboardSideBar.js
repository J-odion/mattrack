"use client"
import Image from "next/image"
import { FaCheck } from "react-icons/fa"
import { LuLogOut } from "react-icons/lu";

import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { logout } from "../libs/features/authSlice";


const DashboardSideBar = () => {

    const dispatch = useDispatch();
    const router = useRouter();

    const handleLogout = () => {
        dispatch(logout()); // Clear Redux state and localStorage
        router.push("/"); // Redirect to login page
    };



    return (
        <div className="w-full h-full text-white hidden lg:flex flex-col relative items-left gap-4 bg-[#123962]">
            <div className="flex relative flex-col gap-4 p-6 mb-5 top-0  ">
                <a href="/" className=" left-0 z-50 top-0">
                    <Image src="/assets/whiteLogo.png" width={0} height={0} className="w-auto h-auto" alt="Logo" />
                </a>
                <div className="bg-slate-400 rounded-md p-2 w-[50%] ">
                    <p className="text-[#123962] font-medium text-xs">IXE Logistics</p>
                </div>
            </div>
            {/* menus */}
            <div></div>

            <div className="flex w-full p-6 bottom-0 items-end align-bottom h-full">
                <button onClick={handleLogout} className="flex  items-center gap-2 justify-center ">
                    <LuLogOut color="white" size={20} />
                    <p>Logout</p>
                </button>
            </div>
        </div>
    )
}

export default DashboardSideBar;