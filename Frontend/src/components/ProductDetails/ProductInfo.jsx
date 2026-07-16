import { Star } from "lucide-react";
import QuantitySelector from "./QuantitySelector";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";

const ProductInfo = ({ product }) => {

  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();
  const { addToCart } = useCart();

  return (
    <div>

      <p className="text-gray-500">
        {product.brand}
      </p>

      <h1 className="text-4xl font-bold mt-2">
        {product.name}
      </h1>

      <div className="flex items-center gap-2 mt-4">

        <Star
          fill="gold"
          color="gold"
          size={20}
        />

        <span className="font-semibold">
          {product.rating}
        </span>

        <span className="text-gray-500">
          ({product.reviews} Reviews)
        </span>

      </div>

      <div className="mt-6 flex items-center gap-3">

        <span className="text-4xl font-bold text-emerald-600">

          ₹{product.price}

        </span>

        <span className="line-through text-gray-400">

          ₹{product.oldPrice}

        </span>

      </div>

      <span className="inline-block mt-4 bg-green-100 text-green-700 px-4 py-2 rounded-full">

        {product.stock}

      </span>

      <p className="mt-6 text-gray-600 leading-7">

        {product.description}

      </p>

      <QuantitySelector
        quantity={quantity}
        setQuantity={setQuantity}
      />

      <div className="flex gap-5 mt-8">

        <button
  onClick={() => {

    addToCart(product,quantity);

    toast.success("Added to Cart");

    navigate("/cart");

  }}
  className="flex-1 bg-emerald-600 text-white py-4 rounded-2xl hover:bg-emerald-700 transition"
>
  Add To Cart
</button>

        <button
          onClick={() => {
  toast.success("Proceeding to Checkout");
  navigate("/checkout");
}}
        >

          Buy Now

        </button>

      </div>

    </div>
  );
};

export default ProductInfo;