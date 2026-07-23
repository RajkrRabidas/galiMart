import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Bike, Star } from "lucide-react";

const ShopCard = ({ shop }) => {
  const navigate = useNavigate();
  return <motion.article onClick={() => navigate(`/shop/${shop._id}`)} whileHover={{ y: -6, scale: 1.02 }} whileTap={{ scale: 0.97 }} transition={{ type: "spring", stiffness: 340, damping: 22 }} className="w-[184px] cursor-pointer overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm hover:shadow-lg">
    <div className="relative h-28 overflow-hidden"><motion.img whileHover={{ scale: 1.1 }} transition={{ duration: 0.4 }} src={shop.image} alt={shop.name} className="h-full w-full object-cover" /><span className="absolute left-2 top-2 rounded-md bg-white px-2 py-1 text-[11px] font-extrabold text-slate-800 shadow-sm">15 mins</span></div>
    <div className="p-3"><h3 className="truncate text-sm font-extrabold text-slate-900">{shop.name}</h3><p className="mt-1 truncate text-xs text-slate-500">{shop.autoLocation?.formattedAddress || "Grocery Store"}</p><div className="mt-2 flex items-center gap-2 text-xs font-semibold"><span className="flex items-center gap-1 text-slate-700"><Star size={13} className="fill-amber-400 text-amber-400" />{shop.rating || "4.8"}</span><span className="flex items-center gap-1 text-emerald-700"><Bike size={13} />Free delivery</span></div></div>
  </motion.article>;
};
export default ShopCard;
