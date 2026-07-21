import { motion } from "framer-motion";
import { ArrowRight, Store } from "lucide-react";
import ShopCard from "./ShopCard";
import { useShops } from "../../context/ShopContext";

const ShopSection = () => {
  const { shops } = useShops();

  return (
    <section className="mt-9">

      {/* Header */}

      <div className="flex items-end justify-between">

        <div>

          <h2 className="text-2xl font-black text-slate-900">
            Top Grocery Stores Near You
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            Quick delivery from your neighbourhood
          </p>

        </div>

        <button
          className="
            flex
            items-center
            gap-1
            text-[#e94b3c]
            font-semibold
            hover:text-[#c93d31]
            transition
          "
        >
          View All

          <ArrowRight size={18} />

        </button>

      </div>

      {shops.length === 0 ? (

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="
            mt-6
            bg-white
            rounded-[30px]
            p-10
            shadow-lg
            border
            border-slate-100
            text-center
          "
        >

          <div
            className="
              w-20
              h-20
              rounded-full
              bg-emerald-50
              flex
              items-center
              justify-center
              mx-auto
            "
          >
            <Store
              size={36}
              className="text-emerald-600"
            />
          </div>

          <h3 className="mt-5 text-2xl font-bold text-slate-800">
            No Nearby Shops
          </h3>

          <p className="mt-2 text-slate-500 max-w-sm mx-auto">
            Once shopkeepers in your area create stores,
            they'll automatically appear here.
          </p>

        </motion.div>

      ) : (

        <div
          className="
            mt-6
            flex
            gap-3
            overflow-x-auto
            scrollbar-hide
            snap-x
            snap-mandatory
            py-3
          "
        >

          {shops.map((shop, index) => (

            <motion.div
              key={shop._id}
              initial={{
                opacity: 0,
                x: 30,
              }}
              whileInView={{
                opacity: 1,
                x: 0,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                duration: 0.35,
                delay: index * 0.08,
              }}
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
