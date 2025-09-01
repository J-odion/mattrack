
import AuthSideBar from "@/app/component/AuthSideBar";
import ChangePassword from "@/app/component/ChangePassword";
import Image from "next/image";


export default function Password() {
  return (
    <div className="w-full h-[100vh] flex overflow-x-hidden">
      
      <div className="h-full  w-2/3 hidden md:flex flex-col  justify-center items-center">
        <AuthSideBar/>
      </div>
      <div className="h-full w-full flex flex-col p-14  justify-center items-center">
        <ChangePassword />
      </div>

    </div>
  );
}
