import { motion } from "framer-motion";
import { ArrowRight, Flame } from "lucide-react";
import ProductCard from "./ProductCard";
import { products } from "./productData";

const ProductSection = () => {
  return (
    <section className="mt-9 rounded-4xl bg-white/90 p-5 shadow-[0_24px_50px_rgba(15,23,42,0.06)] sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <Flame size={24} className="text-orange-500" />
            <div>
              <h2 className="text-2xl font-black text-slate-900">Best offers for you</h2>
              <p className="text-sm text-slate-500 mt-1">Daily favourites at better prices.</p>
            </div>
          </div>
        </div>

        <button className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-700 transition hover:text-emerald-800">
          View all
          <ArrowRight size={18} />
        </button>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-4">
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: index * 0.06 }}
          >
            <ProductCard product={product} />
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default ProductSection;
