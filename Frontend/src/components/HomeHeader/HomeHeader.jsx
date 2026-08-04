import { Bell, ChevronDown, MapPin, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const HomeHeader = () => (
  <motion.header
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.35 }}
    className="relative overflow-hidden rounded-b-[42px] bg-linear-to-br from-emerald-700 via-emerald-600 to-teal-500 px-5 pb-24 pt-6 text-white shadow-[0_28px_70px_rgba(15,23,42,0.18)] sm:px-8"
  >
    <div className="absolute right-0 top-0 h-56 w-56 -translate-y-1/2 translate-x-1/3 rounded-full bg-white/10 blur-3xl" />
    <div className="absolute left-0 top-20 h-40 w-40 -translate-x-1/3 rounded-full bg-white/10 blur-3xl" />

    <div className="relative flex items-center justify-between">
      <button className="flex items-center gap-2 text-left text-sm font-semibold text-emerald-100 transition hover:text-white">
        <MapPin size={18} fill="currentColor" />
        <span>
          <span className="block font-bold">Howrah, West Bengal</span>
          <span className="block text-[11px] text-emerald-100/90">Delivering near you</span>
        </span>
        <ChevronDown size={14} className="text-emerald-100/90" />
      </button>

      <div className="flex items-center gap-3">
        <button aria-label="Notifications" className="relative rounded-2xl border border-white/20 bg-white/10 p-3 transition-transform duration-200 hover:scale-105">
          <Bell size={20} />
          <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-lime-300 shadow-[0_0_0_4px_rgba(255,255,255,0.12)]" />
        </button>
        <Link to="/cart" aria-label="Cart" className="relative rounded-2xl border border-white/20 bg-white/10 p-3 transition-transform duration-200 hover:scale-105">
          <ShoppingCart size={22} />
          <span className="absolute -right-2 -top-2 grid h-4 min-w-4 place-items-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">2</span>
        </Link>
      </div>
    </div>

    <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_minmax(260px,1fr)] lg:items-end">
      <div>
        <p className="text-xs uppercase tracking-[0.32em] text-emerald-100/80">Your neighbourhood marketplace</p>
        <h1 className="mt-4 text-4xl font-black tracking-tight text-white sm:text-5xl">
          Shop local, delivered fast.
        </h1>
        <p className="mt-4 max-w-xl text-base leading-7 text-emerald-100/90 sm:text-lg">
          Discover fresh groceries, nearby shops, and trusted home services with effortless ordering and fast delivery.
        </p>
      </div>

      <div className="rounded-4xl border border-white/20 bg-white/10 p-5 shadow-inner backdrop-blur-xl hidden sm:block">
        <div className="flex items-center gap-3 rounded-3xl border border-white/15 bg-white/10 p-4">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/15 text-2xl">🛒</div>
          <div>
            <p className="text-sm font-semibold text-white">Fast Delivery</p>
            <p className="text-sm text-emerald-100/90">Fresh groceries and essentials in 15 mins.</p>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-3 rounded-3xl border border-white/15 bg-white/10 p-4">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/15 text-2xl">💳</div>
          <div>
            <p className="text-sm font-semibold text-white">Secure Checkout</p>
            <p className="text-sm text-emerald-100/90">Trusted payments with every order.</p>
          </div>
        </div>
      </div>
    </div>

    <div className="mt-7 flex flex-wrap gap-3 text-sm text-white/90">
      <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2">Free delivery above ₹299</span>
      <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2">Top rated local stores</span>
      <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2">24/7 customer support</span>
    </div>
  </motion.header>
);

export default HomeHeader;
