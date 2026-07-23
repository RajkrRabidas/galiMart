import { motion } from "framer-motion";
import { ArrowRight, Flame } from "lucide-react";
import ProductCard from "./ProductCard";
import { products } from "./productData";

const ProductSection = () => {
  return (
    <section className="mt-9">

      {/* Header */}

      <div className="flex items-end justify-between">

        <div>

          <div className="flex items-center gap-2">

            <Flame
              size={24}
              className="text-orange-500"
            />

            <h2 className="text-2xl font-black text-slate-900">
              Best Offers for You
            </h2>

          </div>

          <p className="text-sm text-slate-500 mt-1">
            Daily favourites at better prices
          </p>

        </div>

        <button
          className="
            flex
            items-center
            gap-1
            text-emerald-600
            font-semibold
            hover:text-emerald-700
            transition
          "
        >
          View All

          <ArrowRight size={18} />

        </button>

      </div>

      {/* Products */}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-5 mt-5">

        {products.map((product, index) => (

          <motion.div
            key={product.id}
            initial={{
              opacity: 0,
              y: 20,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              duration: 0.35,
              delay: index * 0.06,
            }}
          >

            <ProductCard product={product} />

          </motion.div>

        ))}

      </div>

    </section>
  );
};

export default ProductSection;
