import DashboardSideBar from "../component/DashboardSideBar";
import Navbar from "../component/Header";
import Subcat from "../component/Subcat";


export default function Home() {
  return (
    <div className="w-full flex h-[100vh] overflow-hidden">
      <div className="w-1/6">
        <DashboardSideBar />
      </div>
      <div className=" w-full h-full overflow-y-hidden p">
        <div className="w-full">
          <Navbar />
        </div>
        <div className="w-full h-full overflow-scroll mb-6 ">
        <Subcat />
        </div>
      </div>
    </div>
  );
}
