import { Search, SlidersHorizontal, Mic } from "lucide-react";
import { motion } from "framer-motion";

const SearchBar = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15, duration: 0.4 }}
      className="relative z-10 -mt-12 px-1"
    >
      <div className="rounded-4xl border border-slate-200/80 bg-white/95 p-4 shadow-[0_20px_50px_rgba(15,23,42,0.08)] backdrop-blur-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <label htmlFor="home-search" className="sr-only">
              Search products, shops and services
            </label>
            <Search
              size={20}
              className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              id="home-search"
              type="text"
              placeholder="Search products, shops & services"
              className="w-full rounded-[28px] border border-slate-200 bg-white py-4 pl-14 pr-14 text-sm text-slate-700 outline-none transition duration-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100/70"
            />
            <button
              className="absolute right-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 transition hover:bg-emerald-100"
              aria-label="Voice search"
            >
              <Mic size={18} />
            </button>
          </div>

          {/* <button
            className="inline-flex h-14 w-14 items-center justify-center rounded-[28px] bg-emerald-700 text-white shadow-lg shadow-emerald-600/25 transition duration-300 hover:-translate-y-0.5 hover:bg-emerald-800"
            aria-label="Filter search"
          >
            <SlidersHorizontal size={22} />
          </button> */}
        </div>
      </div>
    </motion.div>
  );
};

export default SearchBar;
