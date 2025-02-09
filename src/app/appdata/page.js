import FooterSection from "../component/Footer";
import Navbar from "../component/Header";
import Hero from "../component/Herosection";
import Subcat from "../component/Subcat";


export default function Home() {
  return (
    <div className="w-full h-[100vh] overflow-x-hidden">
      <Navbar />
      <Hero />
      <div className="h-full">
        <Subcat />
      </div>
      <FooterSection />
    </div>
  );
}
