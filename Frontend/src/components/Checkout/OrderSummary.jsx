import { useCart } from "../../context/CartContext";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useMarketplace } from "../../context/MarketplaceContext";
import { useShops } from "../../context/ShopContext";
import { useNotifications } from "../../context/NotificationContext";

const OrderSummary = ({ selectedAddress }) => {
    const { addNotification } = useNotifications();
    const navigate = useNavigate();

const { placeOrder } = useMarketplace();
const { shops } = useShops();


const {
  cartItems,
  totalPrice,
  subtotal,
  delivery,
  clearCart,
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
        onClick={() => {

  if (cartItems.length === 0) {

    toast.error("Your cart is empty");

    return;

  }

  if (!selectedAddress) {
    toast.error("Please select a delivery address");
    return;
  }

  // Assuming all items belong to one shop for now
  const firstProduct = cartItems[0];

  const shop = shops.find(shop =>
    shop.products.some(
      product => product.id === firstProduct.id
    )
  );

  if (!shop) {

    toast.error("Shop not found");

    return;

  }

  placeOrder({

    customerId: localStorage.getItem("customerId") || "customer1",

    shopId: shop.id,

    shopName: shop.shopName,

    items: cartItems,

    total: totalPrice,

    address: selectedAddress.formattedAddress || "",

  });

  addNotification(
    "Order Placed Successfully",
    "Your order has been placed successfully."
  );

  clearCart();

  toast.success("Order Placed Successfully");

  navigate("/orders");

}}
        className="w-full mt-8 bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-2xl font-semibold cursor-pointer"
      >
        Place Order
      </button>

    </div>
  );
};

export default OrderSummary;