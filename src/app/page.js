import Navbar from "./component/Header";
import Hero from "./component/Herosection";
import InfoTop from "./component/Subcat";
import FooterSection from "./component/Footer";
import DynamicTable from "./component/Table";
import Subcat from "./component/Subcat";


export default function Home() {
  return (
    <div className="w-full overflow-x-hidden">
      <Navbar />
      <Hero />
      <Subcat /> 
      <FooterSection />
    </div>
  );
}
