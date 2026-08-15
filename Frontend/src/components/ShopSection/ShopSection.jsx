import { motion } from "framer-motion";
import { ArrowRight, Store } from "lucide-react";
import ShopCard from "./ShopCard";
import { useShops } from "../../context/ShopContext";

const ShopSection = ({ shops: propShops, loading: propLoading }) => {
  const { shops: contextShops, loading: contextLoading } = useShops();
  
  // Use props if provided, otherwise fall back to context
  const shops = propShops !== undefined ? propShops : contextShops;
  const loading = propLoading !== undefined ? propLoading : contextLoading;

  return (
    <section className="mt-9 rounded-4xl bg-white/90 p-5 shadow-[0_24px_50px_rgba(15,23,42,0.06)] sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-900">Nearby Stores</h2>
          <p className="mt-1 text-sm text-slate-500">Free delivery from nearby shops.</p>
        </div>

        <button className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-700 transition hover:text-emerald-800">
          View all
          <ArrowRight size={18} />
        </button>
      </div>

      {shops.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-6 rounded-[28px] border border-slate-200 bg-slate-50 p-8 text-center shadow-sm"
        >
          <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-emerald-100 text-emerald-700">
            <Store size={34} />
          </div>
          <h3 className="mt-5 text-2xl font-bold text-slate-900">No nearby shops</h3>
          <p className="mt-2 text-sm leading-6 text-slate-500 max-w-md mx-auto">
            Once local shopkeepers publish their storefronts, you&rsquo;ll see them here with fast delivery options.
          </p>
        </motion.div>
      ) : (
        <div className="mt-6 flex gap-4 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory">
          {shops.map((shop, index) => (
            <motion.div
              key={shop._id}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: index * 0.07 }}
              className="snap-start"
            >
              <ShopCard shop={shop} />
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
};

export default ShopSection;
