import {
  Search,
  SlidersHorizontal,
  Mic,
} from "lucide-react";
import { motion } from "framer-motion";

const SearchBar = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15, duration: 0.35 }}
      className="mt-6"
    >
      <div className="flex items-center gap-3">

        {/* Search */}

        <div className="relative flex-1">

          <Search
            size={20}
            className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            placeholder="Search products, shops & services..."
            className="
              w-full
              h-16
              rounded-full
              bg-white
              border
              border-slate-200
              shadow-lg
              pl-14
              pr-14
              text-[15px]
              placeholder:text-slate-400
              outline-none
              transition-all
              duration-300
              focus:border-emerald-500
              focus:ring-4
              focus:ring-emerald-100
            "
          />

          <button
            className="
              absolute
              right-4
              top-1/2
              -translate-y-1/2
              w-10
              h-10
              rounded-full
              bg-emerald-50
              hover:bg-emerald-100
              transition
              flex
              items-center
              justify-center
            "
          >
            <Mic
              size={18}
              className="text-emerald-600"
            />
          </button>

        </div>

        {/* Filter Button */}

        <button
          className="
            w-16
            h-16
            rounded-3xl
            bg-gradient-to-br
            from-emerald-600
            to-green-500
            shadow-xl
            hover:scale-105
            active:scale-95
            transition-all
            flex
            items-center
            justify-center
          "
        >
          <SlidersHorizontal
            size={22}
            className="text-white"
          />
        </button>

      </div>
    </motion.div>
  );
};

export default SearchBar;