import { Pencil, Trash2, AlertCircle, ToggleLeft, ToggleRight, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { toggleMenuStatus } from "../../../api/menuApi";

const ProductCard = ({ product, onDelete, onToggleStatus }) => {
  const navigate = useNavigate();
  const [isAvailable, setIsAvailable] = useState(product?.isAvailable ?? true);

  useEffect(() => {
    setIsAvailable(product?.isAvailable ?? true);
  }, [product?.isAvailable]);

  const isLowStock = product.stock && product.stock < 5 && product.stock > 0;
  const isOutOfStock = product.stock === 0 || !isAvailable;

  const handleToggleAvailability = async () => {
    try {
      await toggleMenuStatus(product._id);
      const nextValue = !isAvailable;
      setIsAvailable(nextValue);
      onToggleStatus?.(product._id);
      toast.success(`Product marked as ${nextValue ? "available" : "unavailable"}`);
    } catch (error) {
      console.error("Error toggling product status:", error);
      const message = error?.response?.data?.message || "Failed to update product status";
      toast.error(message);
    }
  };


  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-200 overflow-hidden group h-full flex flex-col">
      {/* Image Container */}
      <div className="relative overflow-hidden bg-gray-100 h-48">
        <img
          src={product.image}
          alt={product.name}
          className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${isOutOfStock.isOpen ? "grayscale-100" : ""}`}
          onError={(e) => {
            e.target.src =
              "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect fill='%23e5e7eb' width='400' height='300'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='system-ui' font-size='24' fill='%239ca3af'%3ENo Image%3C/text%3E%3C/svg%3E";
          }}
        />

        {/* Availability Badge */}
        <div className="absolute top-3 right-3">
          {isOutOfStock ? (
            <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-100 text-red-700 text-xs font-semibold rounded-full">
              <div className="w-2 h-2 bg-red-600 rounded-full" />
              Out of Stock
            </span>
          ) : isLowStock ? (
            <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-amber-100 text-amber-700 text-xs font-semibold rounded-full">
              <AlertCircle size={14} />
              Low Stock
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
              <div className="w-2 h-2 bg-green-600 rounded-full" />
              Available
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col">
        {/* Name */}
        <h3 className="font-bold text-lg text-gray-900 line-clamp-2 mb-1">
          {product.name}
        </h3>

        {/* Category */}
        <p className="text-sm text-gray-500 mb-3">
          {product.category || "Uncategorized"}
        </p>

        {/* Price Section */}
        <div className="mb-3 flex justify-between items-center gap-2">
          <p className="text-2xl font-bold text-emerald-600">₹{product.price}</p>
          {product.originalPrice && (
            <p className="text-sm text-gray-400 line-through">
              ₹{product.originalPrice}
            </p>
          )}

          {/* Availability Toggle */}

          <button
            onClick={handleToggleAvailability}
            className="px-3 py-2.5 bg-emerald-50 text-emerald-700 font-semibold rounded-lg hover:bg-emerald-100 transition-colors duration-200 flex items-center justify-center gap-2 text-sm cursor-pointer"
            aria-label={isAvailable ? "Mark product unavailable" : "Mark product available"}
          >
            {isAvailable ? <Eye size={16} /> : <EyeOff size={16} />}
            {/* <span className="hidden sm:inline">
              {isAvailable ? "Available" : "Unavailable"}
            </span> */}
          </button>
          
        </div>

        {/* Stock Info */}
        {product.stock !== undefined && (
          <p className="text-sm text-gray-600 mb-4">
            {isOutOfStock ? (
              <span className="text-red-600 font-medium">Out of stock</span>
            ) : isLowStock ? (
              <span className="text-amber-600 font-medium">
                Only {product.stock} left
              </span>
            ) : (
              <span>Stock: {product.stock} units</span>
            )}
          </p>
        )}

        {/* Divider */}
        <div className="border-t border-gray-100 my-3" />

        {/* Action Buttons */}
        <div className="flex gap-2 mt-auto">
          <button
            onClick={() =>
              navigate(`/seller/edit-product/${product._id}`)
            }
            className="flex-1 px-4 py-2.5 bg-blue-50 text-blue-600 font-semibold rounded-lg hover:bg-blue-100 transition-colors duration-200 flex items-center justify-center gap-2 text-sm"
            aria-label="Edit product"
          >
            <Pencil size={16} />
            <span className="hidden sm:inline">Edit</span>
          </button>
          <button
            onClick={() => onDelete(product._id, product.name)}
            className="flex-1 px-4 py-2.5 bg-red-50 text-red-600 font-semibold rounded-lg hover:bg-red-100 transition-colors duration-200 flex items-center justify-center gap-2 text-sm"
            aria-label="Delete product"
          >
            <Trash2 size={16} />
            <span className="hidden sm:inline">Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;