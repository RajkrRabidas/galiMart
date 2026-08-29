import { Star, Minus, Plus, Check } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useCart } from "../../context/CartContext";

const ProductInfo = ({ product, discountPercent }) => {
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [addedSuccess, setAddedSuccess] = useState(false);
  const { addToCart } = useCart();

  const handleAddToCart = async () => {
    setIsAdding(true);
    try {
      await addToCart(product, quantity);
      setAddedSuccess(true);

      // Reset button state after 2 seconds
      setTimeout(() => {
        setAddedSuccess(false);
        setQuantity(1);
      }, 2000);
    } catch (error) {
      console.error("Error adding to cart:", error);
    } finally {
      setIsAdding(false);
    }
  };

  const isOutOfStock = product.stock !== "In Stock";

  return (
    <div className="space-y-6">
      {/* Shop Name */}
      {product.brand && (
        <div className="inline-block">
          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-4 py-2 rounded-full uppercase tracking-wide">
            {product.brand}
          </span>
        </div>
      )}

      {/* Product Name */}
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
        {product.name}
      </h1>

      {/* Rating Section */}
      <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={18}
              className={
                i < Math.floor(product.rating)
                  ? "fill-amber-400 text-amber-400"
                  : "text-gray-300"
              }
            />
          ))}
        </div>
        <span className="font-semibold text-gray-900">{product.rating}</span>
        <span className="text-gray-600">({product.reviews} reviews)</span>
      </div>

      {/* Price Section */}
      <div className="space-y-3 bg-gradient-to-br from-emerald-50 to-teal-50 p-6 rounded-2xl">
        <div className="flex items-baseline gap-4">
          <span className="text-4xl font-bold text-emerald-600">
            ₹{product.price}
          </span>
          {product.oldPrice && (
            <>
              <span className="text-xl text-gray-400 line-through">
                ₹{product.oldPrice}
              </span>
              <span className="text-lg font-bold text-emerald-600 bg-white px-3 py-1 rounded-full">
                {discountPercent}% OFF
              </span>
            </>
          )}
        </div>
        {product.oldPrice && (
          <p className="text-sm text-gray-600">
            You save ₹{product.oldPrice - product.price}
          </p>
        )}
      </div>

      {/* Stock Status */}
      <div className="flex items-center gap-2">
        <div
          className={`w-3 h-3 rounded-full ${
            isOutOfStock ? "bg-red-500" : "bg-green-500"
          }`}
        ></div>
        <span
          className={`font-semibold ${
            isOutOfStock ? "text-red-600" : "text-green-600"
          }`}
        >
          {product.stock}
        </span>
      </div>

      {/* Quantity Selector */}
      {!isOutOfStock && (
        <div className="space-y-3">
          <p className="text-sm font-semibold text-gray-700">Quantity</p>
          <div className="flex items-center gap-3 bg-gray-100 w-fit rounded-2xl p-2">
            <button
              onClick={() => quantity > 1 && setQuantity(quantity - 1)}
              disabled={isAdding}
              className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:bg-gray-50 transition disabled:opacity-50"
            >
              <Minus size={18} className="text-gray-700" />
            </button>
            <span className="text-lg font-bold text-gray-900 w-8 text-center">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              disabled={isAdding}
              className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center hover:bg-emerald-600 transition disabled:opacity-50 text-white"
            >
              <Plus size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Offers Section (if available) */}
      {!isOutOfStock && (
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
          <p className="text-sm font-bold text-blue-900 mb-2">🏷 Special Offers</p>
          <ul className="space-y-1 text-sm text-blue-800">
            <li>• Extra ₹50 off on orders above ₹500</li>
            <li>• Free delivery on first order</li>
          </ul>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4">
        <button
          onClick={handleAddToCart}
          disabled={isAdding || isOutOfStock || addedSuccess}
          className={`flex-1 py-4 px-6 rounded-2xl font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-2 ${
            isOutOfStock
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : addedSuccess
              ? "bg-green-500 text-white"
              : "bg-emerald-600 hover:bg-emerald-700 text-white"
          }`}
        >
          {addedSuccess ? (
            <>
              <Check size={20} />
              <span>Added to Cart</span>
            </>
          ) : isAdding ? (
            <>
              <span className="inline-block animate-spin">⏳</span>
              <span>Adding...</span>
            </>
          ) : (
            "Add to Cart"
          )}
        </button>

        <button
          disabled={isOutOfStock}
          onClick={() => toast.success("Proceeding to checkout")}
          className={`flex-1 py-4 px-6 rounded-2xl font-semibold text-lg transition-all ${
            isOutOfStock
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-white border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50"
          }`}
        >
          Buy Now
        </button>
      </div>

      {/* Out of Stock Message */}
      {isOutOfStock && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-center">
          <p className="text-red-700 font-semibold">Out of Stock</p>
          <p className="text-sm text-red-600">This product is currently unavailable</p>
        </div>
      )}

      {/* Product Features */}
      <div className="space-y-3 pt-4 border-t border-gray-200">
        <div className="flex items-center gap-3 text-sm">
          <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center">
            <Check size={12} className="text-emerald-600" />
          </div>
          <span className="text-gray-700">
            <span className="font-semibold">Premium Quality</span> - Carefully selected
            products
          </span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center">
            <Check size={12} className="text-emerald-600" />
          </div>
          <span className="text-gray-700">
            <span className="font-semibold">Fast Delivery</span> - Get it within 2-4 days
          </span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center">
            <Check size={12} className="text-emerald-600" />
          </div>
          <span className="text-gray-700">
            <span className="font-semibold">Easy Returns</span> - 7 days money-back
            guarantee
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;