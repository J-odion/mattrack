import DashboardSideBar from "../component/DashboardSideBar";
import FooterSection from "../component/Footer";
import Navbar from "../component/Header";
import Hero from "../component/Herosection";
import Subcat from "../component/Subcat";


export default function Home() {
  return (
    <div className="w-full flex h-[100vh] overflow-x-hidden">
      <div className="w-1/6">
        <DashboardSideBar />
      </div>
      <div className=" w-full h-full">
        <div className="w-full">
          <Navbar />
        </div>
        <Subcat />
      </div>
    </div>
  );
}
