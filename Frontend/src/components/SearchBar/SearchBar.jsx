import {
  Camera,
  Mic,
  Search,
} from "lucide-react";

const SearchBar = () => {
  return (
    <div className="relative mt-6">

      <Search
        className="absolute left-5 top-4 text-gray-400"
      />

      <input
  type="text"
  placeholder="Search Products, Shops & Services..."
  className="
    w-full
    h-14
    rounded-2xl
    bg-white/90
    backdrop-blur-lg
    shadow-xl
    border
    border-white
    pl-14
    pr-24
    outline-none
    focus:ring-2
    focus:ring-emerald-500
    transition
  "
/>

      <div className="absolute right-4 top-3 flex gap-3">

        <Mic className="text-gray-500 cursor-pointer" />

        <Camera className="text-gray-500 cursor-pointer" />

      </div>

    </div>
  );
};

export default SearchBar;