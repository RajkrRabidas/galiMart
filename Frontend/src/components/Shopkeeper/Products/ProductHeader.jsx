import { Search, Plus, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ProductHeader = ({
  search,
  setSearch,
  selectedAvailability,
  setSelectedAvailability,
}) => {
  const navigate = useNavigate();

  const availabilityOptions = [
    { id: "all", label: "All", icon: "📋" },
    { id: "available", label: "Available", icon: "✓" },
    { id: "out-of-stock", label: "Out of Stock", icon: "✕" },
    { id: "low-stock", label: "Low Stock", icon: "⚠" },
  ];

  return (
    <div className="mb-8">
      {/* Search Bar */}
      <div className="relative w-full mb-4">
        <Search
          className="absolute left-4 top-4 text-gray-400"
          size={20}
        />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products by name..."
          className="w-full border-2 border-gray-200 rounded-xl pl-12 pr-4 py-3 text-gray-900 transition-all"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 p-1"
            aria-label="Clear search"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Filters and Add Button */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
        {/* Filter Chips */}
        <div className="flex gap-2 overflow-x-auto pb-2 w-full sm:w-auto">
          {availabilityOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => setSelectedAvailability(option.id)}
              className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all flex items-center gap-1.5 ${
                selectedAvailability === option.id
                  ? "bg-emerald-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <span>{option.icon}</span>
              {option.label}
            </button>
          ))}
        </div>

        {/* Add Product Button */}
        <button
          onClick={() => navigate("/seller/add-product")}
          className="px-6 py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg whitespace-nowrap"
        >
          <Plus size={20} />
          Add Product
        </button>
      </div>
    </div>
  );
};

export default ProductHeader;