import React from "react";
import { LuMoveRight } from "react-icons/lu";

export default function TitlesFlow({ tag, title, btn }) {
  return (
    <div className="flex flex-col gap-8 lg:justify-between items-start lg:flex-row my-6 w-full justify-around ">
      <div className="w-full  flex justify-between flex-col gap-[32px] ">
        <div  className="flex w-full  h-[40px]">
          <div className="border border-[#F0F0F0] rounded-full px-[16px] flex justify-center items-center">
            <div className="w-[7.16px] h-[7.16px] bg-[#2FCC40] rounded-full"></div>
            <p className=" text-xl font-normal  text-[#2FCC40] px-[10px] p-1 text-center ">
              {tag}
            </p>
            <div className="w-[7.16px] h-[7.16px] bg-[#2FCC40] rounded-full"></div>
          </div>
        </div>

        <div className="w-full flex flex-col gap-y-6 lg:flex-row justify-between">
          <p className="text-[36px] w-full lg:w-[40%] lg:text-[48] leading-[54px] ">
            {title}
          </p>

          <button className="bg-[#34C759] w-[181px] h-[52px] text-[17px] font-[500] flex items-center gap-2 text-white px-6 py-2 rounded-full">
            Get Started <LuMoveRight color={"#FFFFFF"} size={24} />
          </button>

         
        </div>
      </div>
    </div>
  );
}
