import HomeHeader from "../../components/HomeHeader/HomeHeader";
import SearchBar from "../../components/SearchBar/SearchBar";
import Banner from "../../components/Banner/Banner";
import CategorySection from "../../components/CategorySection/CategorySection";
import ShopSection from "../../components/ShopSection/ShopSection";
import BottomNavbar from "../../components/BottomNavbar/BottomNavbar";
import ServiceSection from "../../components/ServiceSection/ServiceSection";
import { motion } from "framer-motion";
import { useShops } from "../../context/ShopContext";
import { useEffect } from "react";

const Home = () => {
  const { shops, fetchNearbyShops } = useShops();

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
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="relative overflow-hidden pb-28">
        <HomeHeader />

        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="-mt-12">
            <SearchBar />
          </div>

          <motion.main
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.05 }}
            className="space-y-8 py-6"
          >
            <Banner />
            <CategorySection />
            <ShopSection />
            <ServiceSection />
          </motion.main>
        </div>
      </div>

      <BottomNavbar />
    </div>
  );
};

export default Home;
