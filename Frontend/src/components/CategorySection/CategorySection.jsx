import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { categories } from "./categorydata";

const CategorySection = () => (
  <section className="mt-8 rounded-[32px] bg-white/90 px-0 py-5 sm:p-5 md:p-6 shadow-[0_30px_70px_rgba(15,23,42,0.08)] ring-1 ring-slate-200/70">
    <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-slate-900">Shop by Category</h2>
        <p className="mt-1 max-w-xl text-sm text-slate-500">
          Premium categories curated for fast local delivery.
        </p>
      </div>
      <button className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 transition hover:text-emerald-900">
        View All <ArrowRight size={16} />
      </button>
    </div>

    <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
      {categories.map((category, index) => (
        <motion.button
          key={category.id}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.05 }}
          whileHover={{ y: -4, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="group rounded-[33px] border border-slate-200/70 bg-white/90 p-5 text-left shadow-[0_20px_50px_rgba(15,23,42,0.08)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_25px_70px_rgba(15,23,42,0.12)]"
        >
          <span
            className={`inline-flex h-16 w-16 items-center justify-center overflow-hidden rounded-[26px] bg-gradient-to-br ${category.bg} shadow-[0_14px_30px_rgba(15,23,42,0.08)] ring-1 ring-slate-200/70`}
          >
            {category.image ? (
              <img src={category.image} alt={category.title} className="h-full w-full object-cover" />
            ) : (
              <div className="h-full w-full" />
            )}
          </span>
          <div className="mt-4">
            <p className="text-sm font-semibold text-slate-900">{category.title}</p>
            <p className="mt-1 text-xs leading-5 text-slate-500">{category.description}</p>
          </div>
        </motion.button>
      ))}
    </div>
  </section>
);

export default CategorySection;
