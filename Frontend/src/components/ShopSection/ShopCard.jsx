import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Bike, Star } from "lucide-react";
import { formatShopDistance } from "../../utils/formatDistance";

const ShopCard = ({ shop }) => {
  const navigate = useNavigate();

  return (
    <motion.article
      onClick={() => navigate(`/shop/${shop._id}`)}
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 340, damping: 22 }}
      className="min-w-55 max-w-65 cursor-pointer overflow-hidden rounded-xl border border-slate-200 bg-white transition duration-200 hover:border-blue-200 hover:shadow-md"
    >
      <div className="relative h-40 overflow-hidden bg-slate-100">
        <motion.img
          whileHover={{ scale: 1.08 }}
          transition={{ duration: 0.45 }}
          src={shop.image}
          alt={shop.name}
          className={`h-full w-full object-cover ${shop?.isOpen ? "" : "grayscale-100"}`}
        />

          {
            !shop.isOpen && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                <span className="rounded-2xl bg-black/80 px-3 py-1 text-sm font-semibold text-white">
                  Closed
                </span>
              </div>
            )
          }

        <span className="absolute left-3 top-3 rounded-lg bg-white/95 px-2.5 py-1 text-[11px] font-semibold text-slate-800 shadow-sm">
          {formatShopDistance(shop)} km away
        </span>
      </div>

      <div className="p-4">
        <h3 className="truncate text-lg font-bold text-slate-900">{shop.name}</h3>
        <p className="mt-2 line-clamp-2 text-sm text-slate-500">{shop.autoLocation?.formattedAddress || "Grocery store"}</p>
        <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
          <span className="inline-flex items-center gap-1 rounded-lg bg-amber-50 px-2.5 py-1 text-amber-800">
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
