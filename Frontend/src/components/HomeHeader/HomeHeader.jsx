import {
  Bell,
  MapPin,
} from "lucide-react";

const HomeHeader = () => {
  return (
    <div className="flex justify-between items-center">

      <div>

        <p className="text-gray-500">
          Welcome Back 👋
        </p>

        <h1 className="text-4xl extra-bold">
          Farhann
        </h1>

        <div className="flex items-center gap-2 mt-2">

          <MapPin
            size={18}
            className="text-emerald-600"
          />

          <p className="font-semibold">
            Salt Lake, Kolkata
          </p>

        </div>

      </div>

      <div className="relative">

        <button className="bg-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center">

          <Bell />

        </button>

        <span className="absolute -top-1 -right-1 bg-red-500 w-5 h-5 rounded-full text-white text-xs flex justify-center items-center">

          2

        </span>

      </div>

    </div>
  );
};

export default HomeHeader;