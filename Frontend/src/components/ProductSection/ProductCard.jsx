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

  const discount = Math.round(
    ((product.oldPrice - product.price) /
      product.oldPrice) *
      100
  );

  return (
    <motion.div
      whileHover={{
        y: -8,
        scale: 1.02,
      }}
      whileTap={{
        scale: 0.98,
      }}
      transition={{
        type: "spring",
        stiffness: 280,
        damping: 20,
      }}
      onClick={() =>
        navigate(`/product/${product.id}`)
      }
      className="
        bg-white
        rounded-xl
        overflow-hidden
        shadow-sm
        hover:shadow-xl
        border
        border-slate-100
        cursor-pointer
      "
    >
      {/* Image */}

      <div className="relative bg-slate-50">

        <img
          src={product.image}
          alt={product.name}
          className="
            w-full
            h-32 sm:h-44
            object-contain
            p-3
            transition
            duration-300
            hover:scale-110
          "
        />

        {/* Discount */}

        <div
          className="
            absolute
            top-2
            left-2
            bg-emerald-600
            text-white
            text-xs
            font-bold
            px-2
            py-1
            rounded-md
          "
        >
          {discount}% OFF
        </div>

        {/* Wishlist */}

        <button
          onClick={(e) => e.stopPropagation()}
          className="
            absolute
            top-2
            right-2
            w-8
            h-8
            rounded-full
            bg-white
            shadow-md
            flex
            items-center
            justify-center
            hover:bg-red-50
            transition
          "
        >
          <Heart
            size={18}
            className="text-slate-500"
          />
        </button>

      </div>

      {/* Content */}

      <div className="p-3">

        {/* Brand */}

        <p className="text-xs uppercase tracking-wide text-slate-400 font-semibold">
          {product.brand}
        </p>

        {/* Name */}

        <h3 className="text-sm font-bold text-slate-900 mt-1 line-clamp-2">
          {product.name}
        </h3>

        {/* Rating */}

        <div className="flex items-center gap-1 mt-2">

          <div
            className="
              flex
              items-center
              gap-1
            bg-[#ecf8e8]
              px-2
              py-1
              rounded-full
            "
          >
            <Star
              size={14}
              className="fill-yellow-400 text-yellow-400"
            />

            <span className="text-xs font-semibold">
              4.8
            </span>

          </div>

          <span className="hidden text-xs text-slate-400 sm:inline">
            1.2k Reviews
          </span>

        </div>

        {/* Price */}

        <div className="flex items-end justify-between mt-3">

          <div>

            <h2 className="text-lg font-black text-slate-900">
              ₹{product.price}
            </h2>

            <p className="text-xs text-slate-400 line-through">
              ₹{product.oldPrice}
            </p>

          </div>

          <motion.button
  whileHover={{
    scale: 1.15,
    y: -3,
    rotate: 5,
    boxShadow: "0px 12px 25px rgba(16,185,129,0.35)",
  }}
  whileTap={{
    scale: 0.9,
    rotate: -5,
  }}
  transition={{
    type: "spring",
    stiffness: 450,
    damping: 12,
  }}
  onClick={(e) => {
    e.stopPropagation();
    addToCart(product);
    toast.success("Added to Cart");
  }}
  className="
    w-9
    h-9
    rounded-lg
    bg-gradient-to-r from-emerald-600 to-green-500
    text-white
    flex
    items-center
    justify-center
    shadow-lg
  "
>
  <Plus size={18} />
</motion.button>

        </div>

      </div>

    </motion.div>
  );
};

export default ProductCard;
