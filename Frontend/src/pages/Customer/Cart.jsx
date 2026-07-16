import CartItem from "../../components/Cart/CartItem";
import CartSummary from "../../components/Cart/CartSummary";
import BottomNavbar from "../../components/BottomNavbar/BottomNavbar";
import EmptyCart from "../../components/Cart/EmptyCart";

import { useCart } from "../../context/CartContext";

const Cart = () => {

  const { cartItems } = useCart();

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-slate-100">

      <div className="max-w-7xl mx-auto p-6 pb-24">

        <h1 className="text-4xl font-bold mb-10">
          My Cart
        </h1>

        <div className="grid lg:grid-cols-3 gap-10">

          <div className="lg:col-span-2 space-y-6">

            {cartItems.length === 0 ? (
  <EmptyCart />
) : (
  cartItems.map((item) => (
    <CartItem
      key={item.id}
      item={item}
    />
  ))
)}

          </div>

          <CartSummary />

        </div>

      </div>

      <BottomNavbar />

    </div>
  );
};

export default Cart;