import {
  Bell,
  ChevronDown,
  MapPin,
  ShoppingCart,
} from "lucide-react";
import { motion } from "framer-motion";

const HomeHeader = () => {
  return (
    <motion.div
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.45 }}
      className="mb-8"
    >
      <div className="bg-gradient-to-r from-emerald-700 via-emerald-600 to-green-500 rounded-[32px] p-6 shadow-2xl text-white overflow-hidden relative">

        {/* Decorative circles */}
        <div className="absolute -right-12 -top-12 w-40 h-40 rounded-full bg-white/10" />
        <div className="absolute -left-16 -bottom-16 w-52 h-52 rounded-full bg-white/5" />

        {/* Top Row */}
        <div className="flex justify-between items-start relative z-10">

          <div>

            <p className="text-sm text-emerald-100">
              Deliver to
            </p>

            <div className="flex items-center gap-2 mt-1">

              <MapPin size={18} />

              <h2 className="font-semibold text-lg">
                Salt Lake, Kolkata
              </h2>

              <ChevronDown size={18} />
            </div>

          </div>

          <div className="flex items-center gap-3">

            {/* Notification */}

            <button className="relative w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/20">

              <Bell size={20} />

              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full" />

            </button>

            {/* Cart */}

            <button className="relative w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/20">

              <ShoppingCart size={20} />

              <span className="absolute -top-1 -right-1 bg-red-500 text-[10px] px-1.5 rounded-full">
                2
              </span>

            </button>

          </div>

        </div>

        {/* Greeting */}

        <div className="mt-7 relative z-10">

          <p className="text-emerald-100 text-sm">
            Welcome Back 👋
          </p>

          <h1 className="text-4xl font-black mt-1 tracking-tight">
            Farhann
          </h1>

          <p className="text-emerald-100 mt-2 text-sm">
            Shop everything around you in minutes.
          </p>

        </div>

        {/* Delivery Card */}

        <div className="mt-7 bg-white/15 backdrop-blur-md rounded-2xl px-5 py-4 flex justify-between items-center border border-white/10 relative z-10">

          <div>

            <p className="text-xs text-emerald-100">
              Delivery Time
            </p>

            <h3 className="font-bold text-lg">
              10–20 mins ⚡
            </h3>

          </div>

          <div className="text-right">

            <p className="text-xs text-emerald-100">
              Free Delivery
            </p>

            <h3 className="font-bold">
              Above ₹299
            </h3>

          </div>

        </div>

      </div>
    </motion.div>
  );
};

export default HomeHeader;