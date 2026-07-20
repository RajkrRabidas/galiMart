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
        rounded-[28px]
        overflow-hidden
        shadow-lg
        hover:shadow-2xl
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
            h-48
            object-contain
            p-5
            transition
            duration-300
            hover:scale-110
          "
        />

        {/* Discount */}

        <div
          className="
            absolute
            top-4
            left-4
            bg-red-500
            text-white
            text-xs
            font-bold
            px-3
            py-1.5
            rounded-full
          "
        >
          {discount}% OFF
        </div>

        {/* Wishlist */}

        <button
          onClick={(e) => e.stopPropagation()}
          className="
            absolute
            top-4
            right-4
            w-10
            h-10
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

      <div className="p-5">

        {/* Brand */}

        <p className="text-xs uppercase tracking-wide text-slate-400 font-semibold">
          {product.brand}
        </p>

        {/* Name */}

        <h3 className="font-bold text-slate-900 mt-2 line-clamp-2">
          {product.name}
        </h3>

        {/* Rating */}

        <div className="flex items-center gap-2 mt-3">

          <div
            className="
              flex
              items-center
              gap-1
              bg-emerald-50
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

          <span className="text-xs text-slate-400">
            1.2k Reviews
          </span>

        </div>

        {/* Price */}

        <div className="flex items-end justify-between mt-5">

          <div>

            <h2 className="text-2xl font-black text-emerald-600">
              ₹{product.price}
            </h2>

            <p className="text-sm text-slate-400 line-through">
              ₹{product.oldPrice}
            </p>

          </div>

          <motion.button
            whileTap={{
              scale: 0.9,
            }}
            onClick={(e) => {
              e.stopPropagation();

              addToCart(product);

              toast.success("Added to Cart");
            }}
            className="
              w-12
              h-12
              rounded-2xl
              bg-gradient-to-r
              from-emerald-600
              to-green-500
              text-white
              flex
              items-center
              justify-center
              shadow-lg
            "
          >
            <Plus size={22} />
          </motion.button>

        </div>

      </div>

    </motion.div>
  );
};

export default ProductCard;