import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Star,
  Clock3,
  MapPin,
  ChevronRight,
} from "lucide-react";

const ShopCard = ({ shop }) => {
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
      onClick={() => navigate(`/shop/${shop._id}`)}
      className="
        min-w-[310px]
        bg-white
        rounded-[30px]
        overflow-hidden
        shadow-lg
        hover:shadow-2xl
        cursor-pointer
        border
        border-slate-100
      "
    >
      {/* Image */}

      <div className="relative h-52 overflow-hidden">

        <motion.img
          whileHover={{
            scale: 1.08,
          }}
          transition={{
            duration: 0.4,
          }}
          src={shop.image}
          alt={shop.name}
          className="w-full h-full object-cover"
        />

        {/* Gradient */}

        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

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

          <span className="font-semibold text-sm">
            {shop.rating || "4.8"}
          </span>

        </div>

        {/* Status */}

        <div
          className={`
            absolute
            top-4
            right-4
            px-3
            py-1.5
            rounded-full
            text-xs
            font-semibold
            shadow-md
            ${
              shop.isOpen
                ? "bg-emerald-500 text-white"
                : "bg-red-500 text-white"
            }
          `}
        >
          {shop.isOpen ? "Open" : "Closed"}
        </div>

        {/* Offer */}

        <div
          className="
            absolute
            bottom-4
            left-4
            bg-orange-500
            text-white
            px-3
            py-1.5
            rounded-full
            text-xs
            font-bold
          "
        >
          20% OFF
        </div>

      </div>

      {/* Content */}

      <div className="p-5">

        <h2 className="text-xl font-bold text-slate-900 line-clamp-1">
          {shop.name}
        </h2>

        <p className="text-slate-500 text-sm mt-2 line-clamp-2">
          {shop.autoLocation?.formattedAddress}
        </p>

        {/* Info */}

        <div className="flex items-center justify-between mt-5">

          <div className="flex items-center gap-2 text-slate-600 text-sm">

            <Clock3 size={16} />

            <span>15-20 min</span>

          </div>

          <div className="flex items-center gap-2 text-slate-600 text-sm">

            <MapPin size={16} />

            <span>1.2 km</span>

          </div>

        </div>

        {/* CTA */}

        <button
          className="
            mt-6
            w-full
            bg-emerald-600
            hover:bg-emerald-700
            text-white
            rounded-2xl
            py-3
            font-semibold
            flex
            justify-center
            items-center
            gap-2
            transition
          "
        >
          Visit Store

          <ChevronRight size={18} />

        </button>

      </div>

    </motion.div>
  );
};

export default ShopCard;