import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Bike, Star } from "lucide-react";

const ShopCard = ({ shop }) => {
  const navigate = useNavigate();

  return (
    <motion.article
      onClick={() => navigate(`/shop/${shop._id}`)}
      whileHover={{ y: -6, scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 340, damping: 22 }}
      className="min-w-[220px] max-w-[260px] cursor-pointer overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_18px_40px_rgba(15,23,42,0.08)] transition duration-300 hover:shadow-[0_24px_65px_rgba(15,23,42,0.14)]"
    >
      <div className="relative h-40 overflow-hidden bg-slate-100">
        <motion.img
          whileHover={{ scale: 1.08 }}
          transition={{ duration: 0.45 }}
          src={shop.image}
          alt={shop.name}
          className="h-full w-full object-cover"
        />
        <span className="absolute left-3 top-3 rounded-2xl bg-white/90 px-3 py-1 text-[11px] font-semibold text-slate-900 shadow-sm">
          15 mins
        </span>
      </div>

      <div className="p-4">
        <h3 className="truncate text-lg font-bold text-slate-900">{shop.name}</h3>
        <p className="mt-2 line-clamp-2 text-sm text-slate-500">{shop.autoLocation?.formattedAddress || "Grocery store"}</p>
        <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
          <span className="inline-flex items-center gap-1 rounded-2xl bg-emerald-50 px-3 py-1 text-emerald-700">
            <Star size={13} className="fill-amber-400 text-amber-400" />
            {shop.rating || "4.8"}
          </span>
          <span className="inline-flex items-center gap-1 rounded-2xl bg-slate-100 px-3 py-1 text-slate-600">
            <Bike size={13} />
            Free delivery
          </span>
        </div>
      </div>
    </motion.article>
  );
};
export default ShopCard;
