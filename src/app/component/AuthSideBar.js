import Image from "next/image"
import { FaCheck } from "react-icons/fa"


const AuthSideBar = () => {
    return (
        <div className="w-full h-full text-white flex flex-col relative items-left gap-4 p-14 bg-[#123962]">
            <div className="flex relative flex-col gap-4 mb-5 top-0  ">
                <a href="/" className="absolute right-0 z-50 top-0">
                    <Image src="/assets/whiteLogo.PNG" width={0} height={0} className="w-auto h-auto" alt="Logo" />
                </a>
                <div className="bg-slate-400 rounded-md p-2 w-[20%] ">
                    <p className="text-[#123962] font-medium text-md">IXE Logistics</p>
                </div>
                <h2 className="text-5xl text-white">
                    Buy, <span className="text-green-500">build</span> and own a <br />property today!
                </h2>
                <p className="">We build and sell affordable lands, homes and luxury homes</p>

            </div>

            <div>
                <Image src="/assets/authGroup.png" width={0} height={0} className="w-full h-auto mb-[51px] mt-[37px]" alt="Logo" />
            </div>

            <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2">
                    <div className="bg-green-500 text-xs p-1 border-none overflow-hidden rounded-full shadow-sm  " >
                        <FaCheck color="white" />
                    </div>
                    <p>Track your inventory data</p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="bg-green-500 text-xs p-1 border-none overflow-hidden rounded-full shadow-sm  " >
                        <FaCheck color="white" />
                    </div>
                    <p>Monitor logs and view insights</p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="bg-green-500 text-xs p-1 border-none overflow-hidden rounded-full shadow-sm  " >
                        <FaCheck color="white" />
                    </div>
                    <p>Manage staffs and sites</p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="bg-green-500 text-xs p-1 border-none overflow-hidden rounded-full shadow-sm  " >
                        <FaCheck color="white" />
                    </div>
                    <p>Prompt material requests</p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="bg-green-500 text-xs p-1 border-none overflow-hidden rounded-full shadow-sm  " >
                        <FaCheck color="white" />
                    </div>
                    <p>Rapid Report generation</p>
                </div>
            </div>

        </div>
    )
}

export default AuthSideBar;