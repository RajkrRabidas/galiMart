import { useAuth } from "../../../context/AuthContext";
import { useEffect, useState } from "react";

const DashboardHeader = ({ isOpen, onToggleOpen, loading, shop }) => {
  const { user } = useAuth();
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  const shopName = shop?.name || "Your Shop";

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            {greeting}, {shopName.split(" ")[0]} 👋
          </h1>
          <p className="text-gray-500 mt-1">Here's what's happening with your shop today.</p>
        </div>
      </div>

      {/* Shop Open/Close Status - Mobile friendly */}
      <div className="mt-6 flex items-center justify-between bg-white rounded-lg p-4 border border-gray-100">
        <div className="flex items-center gap-3">
          <div
            className={`w-3 h-3 rounded-full ${isOpen ? "bg-green-500" : "bg-red-500"}`}
          ></div>
          <span className={`font-medium ${isOpen ? "text-green-600" : "text-red-600"}`}>
            {isOpen ? "Shop is Open" : "Shop is Closed"}
          </span>
        </div>

        <button
          onClick={onToggleOpen}
          disabled={loading}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition ${
            isOpen
              ? "bg-red-50 text-red-600 hover:bg-red-100"
              : "bg-green-50 text-green-600 hover:bg-green-100"
          } disabled:opacity-50`}
        >
          {isOpen ? "Close" : "Open"}
        </button>
      </div>
    </div>
  );
};

export default DashboardHeader;
