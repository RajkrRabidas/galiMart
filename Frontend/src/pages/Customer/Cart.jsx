import { ArrowLeft, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import CartItem from "../../components/Cart/CartItem";
import CartSummary from "../../components/Cart/CartSummary";
import BottomNavbar from "../../components/BottomNavbar/BottomNavbar";
import EmptyCart from "../../components/Cart/EmptyCart";
import { useCart } from "../../context/CartContext";

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, clearCart, loading } = useCart();
  const totalItems = cartItems.reduce((sum, item) => sum + (item.quantity || 0), 0);

  const handleClearCart = () => {
    const confirmed = window.confirm("Are you sure you want to clear your cart");
    if (confirmed) {
      clearCart();
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="mx-auto max-w-5xl px-4 pb-28 pt-4">
        <div className="mb-5 flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-slate-700 shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-50 cursor-pointer"
            aria-label="Go back"
          >
            <ArrowLeft size={18} />
          </button>

          <div className="text-right">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-emerald-600">
              Basket
            </p>
            <h1 className="text-2xl font-black text-slate-900">Cart</h1>
          </div>

          {cartItems.length > 0 && (
            <button
              type="button"
              onClick={handleClearCart}
              disabled={loading}
              className="rounded-full border border-red-200 bg-white px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50 cursor-pointer"
            >
              Clear cart
            </button>
          )}
        </div>

        {cartItems.length === 0 ? (
          <EmptyCart />
        ) : (
          <div className="grid gap-6 xl:grid-cols-[1.5fr_0.9fr]">
            <div className="space-y-4">
              <div className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-[0_24px_50px_rgba(15,23,42,0.06)]">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                      <ShoppingBag size={20} />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Items</p>
                      <p className="text-lg font-bold text-slate-900">{totalItems} selected</p>
                    </div>
                  </div>
                </div>
              </div>

              {cartItems.map((item) => (
                <CartItem
                  key={item._id || item.id || item.itemId?._id || item.itemId?.id}
                  item={item}
                />
              ))}
            </div>

            <div className="xl:sticky xl:top-4 xl:self-start">
              <CartSummary />
            </div>
          </div>
        )}
      </div>

      <BottomNavbar />
    </div>
  );
};

export default Cart;