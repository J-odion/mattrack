import FooterSection from "./component/Footer";
import Login from "./component/Login";
import LoginNavbar from "./component/loginHead";


export default function Home() {
  return (
    <div className="w-full h-[100vh] overflow-x-hidden">
      <LoginNavbar />
      <div className="h-full">
        <Login />
      </div>
      <FooterSection />
    </div>
  );
}
