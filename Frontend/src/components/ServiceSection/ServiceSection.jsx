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
    <section className="mt-12 mb-28">

      {/* Header */}

      <div className="flex items-end justify-between">

        <div>

          <div className="flex items-center gap-2">

            <Wrench
              size={24}
              className="text-emerald-600"
            />

            <h2 className="text-2xl font-black text-slate-900">
              Nearby Services
            </h2>

          </div>

          <p className="text-sm text-slate-500 mt-1">
            Book trusted professionals near you
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
          See All

          <ArrowRight size={18} />

        </button>

      </div>

      {services.length === 0 ? (

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="
            mt-3
            bg-white
            rounded-[30px]
            shadow-lg
            border
            border-slate-100
            p-10
            text-center
          "
        >
          <div
            className="
              w-20
              h-20
              mx-auto
              rounded-full
              bg-emerald-50
              flex
              items-center
              justify-center
            "
          >
            <Wrench
              size={36}
              className="text-emerald-600"
            />
          </div>

          <h3 className="text-2xl font-bold mt-5 text-slate-800">
            No Services Available
          </h3>

          <p className="text-slate-500 mt-2 max-w-sm mx-auto">
            Once service providers start offering services,
            they'll automatically appear here.
          </p>

        </motion.div>

      ) : (

        <div
          className="
            mt-6
            flex
            gap-6
            overflow-x-auto
            scrollbar-hide
            snap-x
            snap-mandatory
            py-4
          "
        >
          {services.map((service, index) => (

            <motion.div
              key={service.id}
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
                delay: index * 0.08,
                duration: 0.35,
              }}
              className="snap-start"
            >
              <ServiceCard
                service={service}
              />
            </motion.div>

          ))}
        </div>

      )}

    </section>
  );
};

export default ServiceSection;
