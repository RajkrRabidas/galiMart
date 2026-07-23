import { Bell, ChevronDown, MapPin, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const HomeHeader = () => (
  <motion.header initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="relative -mx-4 overflow-hidden rounded-b-[34px] bg-gradient-to-br from-emerald-800 via-emerald-700 to-green-600 px-5 pb-24 pt-6 text-white shadow-lg sm:-mx-6 sm:px-8">
    <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full bg-lime-300/10" />
    <div className="absolute -bottom-20 left-1/3 h-40 w-40 rounded-full bg-white/5" />
    <div className="relative flex items-center justify-between">
      <button className="flex items-center gap-1.5 text-left"><MapPin size={17} fill="currentColor" /><span><span className="block text-sm font-bold">Howrah, West Bengal <ChevronDown className="inline" size={14}/></span><span className="block text-[11px] text-emerald-100">Delivering near you</span></span></button>
      <div className="flex items-center gap-3"><button aria-label="Notifications" className="relative transition-transform hover:scale-110"><Bell size={22}/><span className="absolute right-0 top-0 h-2 w-2 rounded-full bg-lime-300" /></button><Link to="/cart" aria-label="Cart" className="relative transition-transform hover:scale-110"><ShoppingCart size={25}/><span className="absolute -right-2 -top-2 grid h-4 min-w-4 place-items-center rounded-full bg-red-500 px-1 text-[9px] font-bold">2</span></Link></div>
    </div>
    <div className="relative mt-7 flex items-end justify-between"><div><h1 className="text-[34px] font-black tracking-tight">GaliMart</h1><p className="text-sm font-medium text-emerald-50">Shop nearby, instantly</p></div><div className="grid h-14 w-14 place-items-center rounded-full border border-white/20 bg-white/10 text-2xl shadow-inner">🛵</div></div>
  </motion.header>
);

export default HomeHeader;
