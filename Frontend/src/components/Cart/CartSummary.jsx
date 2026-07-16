import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";

const CartSummary = () => {
  const navigate = useNavigate();

  const {
    subtotal,
    delivery,
    totalPrice,
  } = useCart();

  return (
    <div className="bg-white rounded-3xl shadow-lg p-6">

      <h2 className="text-xl font-bold">
        Order Summary
      </h2>

      <div className="flex justify-between mt-6">
        <span>Subtotal</span>
        <span>₹{subtotal}</span>
      </div>

      <div className="flex justify-between mt-3">
        <span>Delivery</span>
        <span>₹{delivery}</span>
      </div>

      <div className="border-t mt-5 pt-5 flex justify-between">
        <span className="font-bold">
          Total
        </span>

        <span className="font-bold text-emerald-600">
          ₹{totalPrice}
        </span>
      </div>

      <button
        onClick={() => navigate("/checkout")}
        className="w-full mt-6 bg-emerald-600 text-white py-4 rounded-2xl hover:bg-emerald-700"
      >
        Proceed To Checkout
      </button>

    </div>
  );
};

export default CartSummary;