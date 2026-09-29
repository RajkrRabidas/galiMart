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
    <section className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-900">Nearby Stores</h2>
          <p className="mt-1 text-sm text-slate-500">Free delivery from nearby shops.</p>
        </div>

        <button className="inline-flex items-center gap-1 text-sm font-semibold text-[#2874f0] transition hover:text-[#1557bf]">
          View all
          <ArrowRight size={18} />
        </button>
      </div>

      {loading ? (
        <div className="mt-6 flex gap-4 overflow-hidden" aria-label="Loading nearby stores">
          {Array.from({ length: 3 }, (_, index) => (
            <div key={index} className="min-w-55 animate-pulse overflow-hidden rounded-xl border border-slate-200 bg-white">
              <div className="h-40 bg-slate-200" />
              <div className="space-y-3 p-4">
                <div className="h-4 w-3/4 rounded bg-slate-200" />
                <div className="h-3 w-full rounded bg-slate-100" />
                <div className="h-6 w-2/3 rounded bg-slate-100" />
              </div>
            </div>
          ))}
        </div>
      ) : shops.length === 0 ? (
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
