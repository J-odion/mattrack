import FooterSection from "../component/Footer";
import LoginNavbar from "../component/loginHead";
import VerifyOTP from "../component/Verify";


export default function Home() {
  return (
    <div className="w-full h-[100vh] overflow-x-hidden">
      <LoginNavbar />
      <div className="h-full">
        <VerifyOTP />
      </div>
      <FooterSection />
    </div>
  );
}
