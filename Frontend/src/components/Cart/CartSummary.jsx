import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useShops } from "../../context/ShopContext";

const CartSummary = () => {
  const navigate = useNavigate();

  const { subtotal, delivery, totalPrice } = useCart();
  const { shop } = useShops();
  const isShopOpen = shop ? Boolean(shop.isOpen) : true;
  const canCheckout = subtotal > 0 && isShopOpen;
  const checkoutLabel = !isShopOpen
    ? "Shop is closed"
    : subtotal > 0
      ? "Proceed to Checkout"
      : "Cart is empty";

  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_24px_50px_rgba(15,23,42,0.06)]">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-black text-slate-900">Order Summary</h2>
        <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-700">
          {subtotal > 0 ? "Ready" : "Empty"}
        </span>
      </div>

      <div className="mt-6 space-y-3 text-sm text-slate-600">
        <div className="flex items-center justify-between">
          <span>Subtotal</span>
          <span className="font-semibold text-slate-900">₹{subtotal}</span>
        </div>

        <div className="flex items-center justify-between">
          <span>Delivery</span>
          <span className="font-semibold text-slate-900">₹{delivery}</span>
        </div>
      </div>

      <div className="mt-5 rounded-2xl bg-slate-50 p-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-500">Total</span>
          <span className="text-xl font-black text-slate-900">₹{totalPrice}</span>
        </div>
      </div>

      <button
        type="button"
        onClick={() => canCheckout && navigate("/checkout")}
        className={`mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-emerald-600 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-600/30 transition ${!canCheckout ? "cursor-not-allowed opacity-50" : "hover:bg-emerald-500"}`}
        disabled={!canCheckout}
      >
        {checkoutLabel}
        {canCheckout && <ArrowRight size={16} />}
      </button>
    </div>
  );
};

export default CartSummary;