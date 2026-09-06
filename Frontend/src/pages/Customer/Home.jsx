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
import { useAuth } from "../../context/AuthContext";
import { useSearchParams } from "react-router";

const Home = () => {
  const nearbyRadius = 20000;
  const { shops, loading, fetchNearbyShops } = useShops();
  const { location, loadingLocation, requestLocation } = useAuth();
  const [searchParam] = useSearchParams();
  const search = searchParam.get("search") || "";

  // Fetch nearby shops when location or search changes
  useEffect(() => {
    if (!location?.latitude || !location?.longitude) {
      return;
    }

    fetchNearbyShops({
      latitude: location.latitude,
      longitude: location.longitude,
      radius: nearbyRadius,
      search,
    });
  }, [location?.latitude, location?.longitude, search, fetchNearbyShops]);

  // Request location access if denied
  const requestLocationAccess = async () => {
    try {
      await requestLocation();
    } catch {
      alert("Please enable location access in browser settings and try again.");
    }
  };

  if (loadingLocation && !location) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg font-semibold text-gray-700">Getting your location...</p>
      </div>
    );
  }

  if (!location) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-700 mb-4">Location access required</p>
          <button
            onClick={requestLocationAccess}
            className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
          >
            Enable Location
          </button>
        </div>
      </div>
    );
  }

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
            <ShopSection shops={shops} loading={loading} />
            <ServiceSection />
          </motion.main>
        </div>
      </div>

      <BottomNavbar />
    </div>
  );
};

export default Home;
