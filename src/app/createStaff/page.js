import FooterSection from "../component/Footer";
import LoginNavbar from "../component/loginHead";
import RegisterStaff from "../component/registerStaff";


export default function Home() {
  return (
    <div className="w-full h-[100vh] overflow-x-hidden">
      <LoginNavbar />
      <div className="h-full">
        <RegisterStaff />
      </div>
      <FooterSection />
    </div>
  );
}
