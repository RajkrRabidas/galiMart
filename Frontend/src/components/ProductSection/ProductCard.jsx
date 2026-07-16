import { Plus } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import toast from "react-hot-toast";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  return (
    <motion.div
      onClick={() => navigate(`/product/${product.id}`)}
      whileHover={{
        y: -8,
        scale: 1.03,
      }}
      transition={{
        duration: 0.2,
      }}
      className="cursor-pointer bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl"
    >
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-40 object-cover"
      />

      <div className="p-4">
        <p className="text-sm text-gray-500">
          {product.brand}
        </p>

        <h3 className="font-bold mt-1">
          {product.name}
        </h3>

        <div className="flex items-center gap-2 mt-3">
          <span className="text-xl font-bold text-emerald-600">
            ₹{product.price}
          </span>

          <span className="text-gray-400 line-through text-sm">
            ₹{product.oldPrice}
          </span>
        </div>

        <button
  onClick={(e) => {
    e.stopPropagation();

    addToCart(product);

    toast.success("Added to Cart");
  }}
  className="
    mt-4
    w-full
    bg-gradient-to-r
    from-emerald-500
    to-green-600
    text-white
    rounded-xl
    py-3
    flex
    justify-center
    items-center
    gap-2
    font-semibold
    hover:scale-105
    active:scale-95
    transition-all
  "
>
  <Plus size={18} />
  Add To Cart
</button>
      </div>
    </motion.div>
  );
};

export default ProductCard;