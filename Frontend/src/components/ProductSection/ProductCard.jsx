import {
  Heart,
  Plus,
  Star,
} from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import toast from "react-hot-toast";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const discount = Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100);

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 280, damping: 20 }}
      onClick={() => navigate(`/product/${product.id}`)}
      className="group cursor-pointer overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_18px_40px_rgba(15,23,42,0.06)] transition duration-300 hover:shadow-[0_24px_65px_rgba(15,23,42,0.14)]"
    >
      <div className="relative bg-slate-50">
        <img
          src={product.image}
          alt={product.name}
          className="w-full object-contain p-4 transition duration-500 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3 rounded-2xl bg-emerald-600 px-3 py-1 text-[11px] font-bold text-white shadow-sm">
          {discount}% OFF
        </div>
        <button
          onClick={(e) => e.stopPropagation()}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-md transition duration-200 hover:bg-red-50"
          aria-label="Add to wishlist"
        >
          <Heart size={18} className="text-slate-500" />
        </button>
      </div>

      <div className="p-4">
        <p className="text-xs uppercase tracking-[0.24em] text-slate-400">{product.brand}</p>
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
            <p className="text-xs text-slate-400 line-through">₹{product.oldPrice}</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 420, damping: 20 }}
            onClick={(e) => {
              e.stopPropagation();
              addToCart(product);
              toast.success("Added to Cart");
            }}
            className="flex h-11 w-11 items-center justify-center rounded-2xl bg-linear-to-r from-emerald-600 to-emerald-500 text-white shadow-lg shadow-emerald-600/30"
            aria-label="Add to cart"
          >
            <Plus size={18} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
