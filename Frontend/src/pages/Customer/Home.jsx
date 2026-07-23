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
import { useEffect } from "react";

const Home = () => {
  const {
    shops,
    fetchNearbyShops,
} = useShops();
useEffect(() => {

    navigator.geolocation.getCurrentPosition(

        (position) => {

            fetchNearbyShops({

                latitude: position.coords.latitude,

                longitude: position.coords.longitude,

                radius: 5000,

            });

        },

        (error) => {

            console.log(error);

        }

    );

}, []);
  return (
    <div className="min-h-screen bg-[#f6f8f5] text-slate-900">

       <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-7xl mx-auto overflow-hidden px-4 pb-28 sm:px-6"
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
