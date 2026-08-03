import { motion } from "framer-motion";
import { ArrowRight, Wrench } from "lucide-react";
import ServiceCard from "./ServiceCard";
import { useServices } from "../../context/ServiceContext";

const ServiceSection = () => {
  const { providers } = useServices();

  const services = providers.flatMap((provider) =>
    provider.services.map((service) => ({
      ...service,
      providerName: provider.businessName,
      providerCategory: provider.category,
    }))
  );

  return (
    <section className="mt-12 mb-28 rounded-4xl bg-white/90 p-5 shadow-[0_24px_50px_rgba(15,23,42,0.06)] sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <Wrench size={24} className="text-emerald-600" />
            <div>
              <h2 className="text-2xl font-black text-slate-900">Nearby services</h2>
              <p className="text-sm text-slate-500 mt-1">Book trusted professionals near you.</p>
            </div>
          </div>
        </div>

        <button className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-700 transition hover:text-emerald-800">
          See all
          <ArrowRight size={18} />
        </button>
      </div>

      {services.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 rounded-[28px] border border-slate-200 bg-slate-50 p-8 text-center shadow-sm"
        >
          <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-emerald-100 text-emerald-700">
            <Wrench size={36} />
          </div>
          <h3 className="mt-5 text-2xl font-bold text-slate-900">No services available</h3>
          <p className="mt-2 text-sm leading-6 text-slate-500 max-w-md mx-auto">
            When providers add services near you, you&rsquo;ll be able to book them instantly from here.
          </p>
        </motion.div>
      ) : (
        <div className="mt-6 flex gap-6 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.07, duration: 0.35 }}
              className="snap-start"
            >
              <ServiceCard service={service} />
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
};

export default ServiceSection;
