import {
  Heart,
  Minus,
  Plus,
  Star,
} from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";

const ProductCard = ({ product, shopId }) => {
  const navigate = useNavigate();
  const { addToCart, increaseQuantity, decreaseQuantity, cartItems, loading } = useCart();

  const productId = product._id || product.id;
  const cartItem = cartItems.find((item) => {
    const itemId = item?.itemId?._id || item?.itemId?.id || item?.itemId || item?._id || item?.id;
    return itemId === productId;
  });
  const quantity = cartItem?.quantity || 0;

  const discount =
    product.oldPrice && product.oldPrice > product.price
      ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
      : 0;

  const handleAddToCart = async (e) => {
    e.stopPropagation();

    const productData = {
      ...product,
      shopId: shopId || product.shopId,
      _id: productId,
    };

    await addToCart(productData);
  };

  const handleQuantityChange = (e, action) => {
    e.stopPropagation();

    if (!cartItem) return;

    const itemId = cartItem?.itemId?._id || cartItem?.itemId?.id || cartItem?.itemId || productId;

    if (action === "decrease") {
      decreaseQuantity(itemId);
      return;
    }

    increaseQuantity(itemId);
  };

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 280, damping: 20 }}
      onClick={() => navigate(`/product/${productId}`)}
      className="group cursor-pointer overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_18px_40px_rgba(15,23,42,0.06)] transition duration-300 hover:shadow-[0_24px_65px_rgba(15,23,42,0.14)]"
    >
      <div className="relative bg-slate-50">
        <img
          src={product.image}
          alt={product.name}
          className="h-52 w-full object-cover p-3 transition duration-500 group-hover:scale-105"
        />

        {product.isAvailable === false && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="rounded-2xl bg-black/80 px-3 py-1 text-sm font-semibold text-white">
              Out of Stock
            </span>
          </div>
        )}

        {discount > 0 && (
          <div className="absolute left-3 top-3 rounded-2xl bg-emerald-600 px-3 py-1 text-[11px] font-bold text-white shadow-sm">
            {discount}% OFF
          </div>
        )}

        <button
          onClick={(e) => e.stopPropagation()}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-md transition duration-200 hover:bg-red-50"
          aria-label="Add to wishlist"
        >
          <Heart size={18} className="text-slate-500" />
        </button>
      </div>

      <div className="p-4">
        <p className="text-xs uppercase tracking-[0.24em] text-slate-400">{product.brand || product.category}</p>
        <h3 className="mt-2 text-base font-bold text-slate-900 line-clamp-2">{product.name}</h3>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">
            <Star size={14} className="fill-yellow-400 text-yellow-400" />
            4.8
          </span>
          <span className="text-xs text-slate-400">1.2k reviews</span>
        </div>

        <div className="mt-4 flex items-end justify-between gap-3">
          <div>
            <p className="text-2xl font-black text-slate-900">₹{product.price}</p>
            {product.oldPrice && product.oldPrice > product.price && (
              <p className="text-xs text-slate-400 line-through">₹{product.oldPrice}</p>
            )}
          </div>

          {quantity > 0 ? (
            <div className="flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-2 py-1.5 shadow-sm">
              <button
                type="button"
                onClick={(e) => handleQuantityChange(e, "decrease")}
                disabled={loading}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-emerald-700 shadow-sm transition hover:bg-emerald-100 disabled:opacity-50"
                aria-label="Decrease quantity"
              >
                <Minus size={15} />
              </button>

              <span className="min-w-6 text-center text-base font-bold text-slate-900">{quantity}</span>

              <button
                type="button"
                onClick={(e) => handleQuantityChange(e, "increase")}
                disabled={loading}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-white shadow-sm transition hover:bg-emerald-500 disabled:opacity-50"
                aria-label="Increase quantity"
              >
                <Plus size={15} />
              </button>
            </div>
          ) : (
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 420, damping: 20 }}
              onClick={handleAddToCart}
              disabled={loading}
              className="flex h-11 w-11 items-center justify-center rounded-2xl bg-linear-to-r from-emerald-600 to-emerald-500 text-white shadow-lg shadow-emerald-600/30 disabled:opacity-50"
              aria-label="Add to cart"
            >
              <Plus size={18} />
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
