import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, BadgeCheck, Clock3, Star } from "lucide-react";

const ServiceCard = ({ service }) => {
  const navigate = useNavigate();
  return (
    <motion.article
      whileHover={{ y: -8, scale: 1.02 }} whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 360, damping: 22 }}
      className="min-w-[292px] overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-md transition-shadow hover:shadow-xl"
    >
      <div className="relative h-44 overflow-hidden bg-slate-100">
        <motion.img whileHover={{ scale: 1.1 }} transition={{ duration: 0.45 }} src={service.image} alt={service.name} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <span className="absolute left-3 top-3 flex items-center gap-1 rounded-lg bg-white px-2 py-1 text-xs font-bold shadow-sm"><Star size={13} className="fill-amber-400 text-amber-400" />4.9</span>
        <span className="absolute right-3 top-3 flex items-center gap-1 rounded-lg bg-emerald-600 px-2 py-1 text-[11px] font-bold text-white"><BadgeCheck size={13} />Verified</span>
        <span className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-lg bg-white/95 px-2 py-1 text-xs font-bold text-slate-700"><Clock3 size={13} className="text-emerald-600" />30 mins</span>
      </div>
      <div className="p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">{service.providerCategory}</p>
        <h3 className="mt-1 text-lg font-extrabold text-slate-900 line-clamp-1">{service.name}</h3>
        <p className="mt-1 text-sm text-slate-500 line-clamp-1">by {service.providerName}</p>
        <div className="mt-4 flex items-end justify-between">
          <div><p className="text-[11px] text-slate-400">Starting from</p><p className="text-xl font-black text-slate-900">₹{service.price}</p></div>
          <motion.button whileHover={{ scale: 1.06, x: 2 }} whileTap={{ scale: 0.94 }} onClick={() => navigate(`/service/${service.id}`)} className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-700">Book <ArrowRight size={16} /></motion.button>
        </div>
      </div>
    </motion.article>
  );
};

export default ServiceCard;
