import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { categories } from "./categoryData";

const CategorySection = () => (
  <section className="mt-8">
    <div className="flex items-end justify-between"><div><h2 className="text-xl font-black text-slate-900">Shop by Category</h2><p className="mt-1 text-xs text-slate-500">Everything you need, close by</p></div><button className="flex items-center gap-1 text-sm font-bold text-emerald-700">View All <ArrowRight size={16}/></button></div>
    <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-6">
      {categories.map((category, index) => { const Icon = category.icon; return <motion.button key={category.id} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.045 }} whileHover={{ y: -5, scale: 1.03 }} whileTap={{ scale: 0.95 }} className="rounded-2xl border border-slate-100 bg-white p-2.5 text-center shadow-sm hover:shadow-md"><span className={`mx-auto grid h-14 w-14 place-items-center rounded-xl ${category.color}`}><Icon size={29} className="text-emerald-600" /></span><span className="mt-2 block text-xs font-bold text-slate-700">{category.title}</span></motion.button>; })}
    </div>
  </section>
);

export default CategorySection;
