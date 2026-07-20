import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  Clock3,
  Star,
} from "lucide-react";

const ServiceCard = ({ service }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      whileHover={{
        y: -8,
        scale: 1.02,
      }}
      whileTap={{
        scale: 0.98,
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 22,
      }}
      className="
        min-w-[310px]
        bg-white
        rounded-[30px]
        overflow-hidden
        shadow-lg
        hover:shadow-2xl
        border
        border-slate-100
      "
    >
      {/* Image */}

      <div className="relative h-52 overflow-hidden bg-slate-100">

        <motion.img
          whileHover={{
            scale: 1.08,
          }}
          transition={{
            duration: 0.4,
          }}
          src={service.image}
          alt={service.name}
          className="w-full h-full object-cover"
        />

        {/* Gradient */}

        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />

        {/* Rating */}

        <div
          className="
            absolute
            top-4
            left-4
            bg-white
            rounded-full
            px-3
            py-1.5
            flex
            items-center
            gap-1
            shadow-md
          "
        >
          <Star
            size={15}
            className="fill-yellow-400 text-yellow-400"
          />

          <span className="text-sm font-semibold">
            4.9
          </span>
        </div>

        {/* Verified */}

        <div
          className="
            absolute
            top-4
            right-4
            bg-emerald-500
            text-white
            rounded-full
            px-3
            py-1.5
            text-xs
            font-semibold
            flex
            items-center
            gap-1
          "
        >
          <BadgeCheck size={14} />
          Verified
        </div>

        {/* Arrival */}

        <div
          className="
            absolute
            bottom-4
            left-4
            bg-white
            rounded-full
            px-3
            py-1.5
            flex
            items-center
            gap-2
            shadow-md
          "
        >
          <Clock3
            size={15}
            className="text-emerald-600"
          />

          <span className="text-sm font-semibold">
            30 mins
          </span>
        </div>

      </div>

      {/* Content */}

      <div className="p-5">

        <h3 className="text-xl font-bold text-slate-900 line-clamp-1">
          {service.name}
        </h3>

        <p className="text-slate-500 mt-2 line-clamp-1">
          {service.providerName}
        </p>

        <span
          className="
            inline-block
            mt-3
            px-3
            py-1
            rounded-full
            bg-emerald-50
            text-emerald-700
            text-xs
            font-semibold
          "
        >
          {service.providerCategory}
        </span>

        <div className="flex justify-between items-end mt-6">

          <div>

            <p className="text-xs text-slate-400">
              Starting from
            </p>

            <h2 className="text-2xl font-black text-emerald-600">
              ₹{service.price}
            </h2>

          </div>

          <button
            onClick={() =>
              navigate(`/service/${service.id}`)
            }
            className="
              bg-gradient-to-r
              from-emerald-600
              to-green-500
              text-white
              rounded-2xl
              px-5
              py-3
              font-semibold
              flex
              items-center
              gap-2
              hover:from-emerald-700
              hover:to-green-600
              transition-all
            "
          >
            Book

            <ArrowRight size={18} />
          </button>

        </div>

      </div>

    </motion.div>
  );
};

export default ServiceCard;