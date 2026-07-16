import HomeHeader from "../../components/HomeHeader/HomeHeader";
import SearchBar from "../../components/SearchBar/SearchBar";
import Banner from "../../components/Banner/Banner";
import CategorySection from "../../components/CategorySection/CategorySection";
import ShopSection from "../../components/ShopSection/ShopSection";
import BottomNavbar from "../../components/BottomNavbar/BottomNavbar";
import ProductSection from "../../components/ProductSection/ProductSection";
import ServiceSection from "../../components/ServiceSection/ServiceSection";
import { motion } from "framer-motion";
import { useShops } from "../../context/ShopContext";

const Home = () => {
  const { shops } = useShops();
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-slate-100">

       <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-7xl mx-auto p-5 pb-24"
      >

        <HomeHeader />

        <SearchBar />

        <Banner />

        <CategorySection />

        <ShopSection />

        <ProductSection />

        <ServiceSection />

      </motion.div>
      <button
className="
fixed
bottom-24
right-6
bg-emerald-600
text-white
w-16
h-16
rounded-full
shadow-2xl
hover:scale-110
transition
flex
justify-center
items-center
text-2xl
z-50
">

🛒

</button>
      <BottomNavbar />

    </div>
  );
};

export default Home;