import Image from "next/image";
import { LuMail, LuMoveRight } from "react-icons/lu";

export default function FooterSection() {
  return (
    <section id="contact" className="relative pt-10 w-full bg-[#F9F9F9]">
      <div className="relative my-2  w-full lg:w-[1376px] pt-10  rounded-3xl flex flex-col justify-between items-center  mx-auto ">
        <div className="relative text-[#5C5C5C] flex flex-col justify-between w-full lg:w-[1280px]  py-6 items-center z-10 ">
          <div className="relative w-full mt-8 gap-6 px-14 backdrop-blur-sm ">
            {/* bottom */}
            <div className="mt-16 relative ">
              <div className="z-50 flex text-[#123962] flex-col lg:flex-row w-full justify-between mt-8">
                <div className="flex  gap-4">
                  <p className=" z-50 text-[16px] leading-[20px] font-normal ">
                    Privacy Policy
                  </p>
                  <p className=" z-50 text-[16px] leading-[20px] font-normal ">
                    Terms and conditions
                  </p>
                </div>
                <p className="z-50 text-[16px] mt-8 lg:mt-0 leading-[20px] font-normal ">
                  © 2024 property EP 4 Kairos Hof . All rights reserved.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
