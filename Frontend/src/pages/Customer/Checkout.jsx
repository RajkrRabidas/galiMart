import { useEffect, useState } from "react";
import axios from "../../api/axios";
import { useCart } from "../../context/CartContext";
import AddressCard from "../../components/Checkout/AddressCard";
import PaymentMethod from "../../components/Checkout/PaymentMethod";
import OrderSummary from "../../components/Checkout/OrderSummary";
import BottomNavbar from "../../components/BottomNavbar/BottomNavbar";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import { Currency } from "lucide-react/dist/cjs/lucide-react";

const Checkout = () => {
  const { cartItems } = useCart();

  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);

  const [loadingAddress, setLoadingAddress] = useState(true);

  const [loadingPayment, setLoadingPayment] = useState(false);
  const [creatingOrder, setCreatingOrder] = useState(false);

  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const response = await axios.get("/address/my-address");
        const fetchedAddresses = response.data.addresses || [];
        setAddresses(fetchedAddresses);
        setSelectedAddress((prev) => prev || fetchedAddresses[0] || null);
      } catch (error) {
        console.error("Error fetching address:", error);
      }
      setLoadingAddress(false);
    };

    fetchAddress();
  }, []);

  const navigate = useNavigate();

  const shop = cartItems?.length > 0 ? cartItems[0].shopId : null;

  const selectedAddressId = selectedAddress?._id || selectedAddress?.id;

  const subTotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  const deliveryFee = subTotal < 250 ? 4 : 0;

  const platFormFee = 7;

  const grandTotal = subTotal + deliveryFee + platFormFee;

  const totalQuantity = cartItems.reduce((t, c) => t + (c.quantity || 0), 0);

  const createOrder = async (paymentMethod) => {
    const selectedAddressId = selectedAddress?._id || selectedAddress?.id;
    if (!selectedAddressId) {
      toast.error("Please select a delivery address.");
      return null;
    }

    setCreatingOrder(true);
    try {
      const { data } = await axios.post("/orders/create", {
        paymentMethod,
        addressId: selectedAddressId,
      });

      return data;
    } catch (error) {
      toast.error("Failed to create order.");
    } finally {
      setCreatingOrder(false);
    }
  };

  const paywithRazorpay = async () => {
    try {
      setLoadingPayment(true);

      const order = await createOrder("razorpay");
      if (!order) return;
      const { orderId, amount } = order;

      const { data } = await axios.post("/payment/create-payment", {
        orderId,
      });

      const { orderId: razorpayOrderId, key } = data.data || data;

      const options = {
        key,
        amount: amount * 100,
        currency: "INR",
        name: "Gali Mart",
        description: "Food Order Payment",
        order_id: razorpayOrderId,

        handler: async function (response) {
          try {
            await axios.post("/payment/verify-payment", {
              rezorpay_order_id:
                response.razorpay_order_id || response.rezorpay_order_id,
              rezorpay_payment_id: response.razorpay_payment_id,
              rezorpay_signature: response.razorpay_signature,
              orderId,
            });

            toast.success("Payment successful 🎉");
            navigate(`/payment-success/${response.rezorpay_payment_id}`);
          } catch (error) {
            toast.error("Payment verification failed");
          }
        },

        theme: {
          color: "#3399cc",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Error during payment:", error);
      toast.error("Payment failed, please refresh the page and try again.");
    } finally {
      setLoadingPayment(false);
    }
  };

  return (
    <>
      <div className="mx-auto max-w-4xl px-4 py-6 space-y-6">
        <h1 className="text-2xl font-bold">Checkout</h1>

        <div className="rounded-xl bg-white p-4 shadow-sm">
          <h2 className="text-lg font-semibold">{shop?.name || "Gali Mart"}</h2>
          <p className="text-sm text-gray-500">
            {shop?.autoLocation.formattedAddress || "Shop Address"}
          </p>
        </div>

        <div className="rounded-xl bg-white p-4 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Delivery Address</h2>
          {loadingAddress ? (
            <p className="text-sm text-gray-500">Loading addresses...</p>
          ) : addresses.length === 0 ? (
            <p className="text-sm text-gray-500">
              No address found. Please add one.
            </p>
          ) : (
            addresses.map((add) => (
              <label
                key={add._id}
                className={`flex gap-3 rounded-lg border p-3 cursor-pointer transition ${selectedAddressId === add._id ? "border-[#e23744] bg-red-50" : "hover:bg-gray-50"}`}
              >
                <input
                  type="radio"
                  name="address"
                  checked={selectedAddressId === add._id}
                  onChange={() => setSelectedAddress(add)}
                />
               <div>
                 <p className="text-sm font-medium">{add.formattedAddress}</p>
                 <p className="text-sm text-gray-500">{add.mobile}</p>
               </div>
              </label>
            ))
          )}
        </div>

       <div className="rounded-xl bg-white p-4 shadow-sm space-y-4">
        <h3 className="font-semibold">Order Summary</h3>

          {
            cartItems.map((cartItem) => {
              const item = cartItem.itemId || cartItem.productId;
              return (
                <div className="flex justify-between text-sm" key={cartItem._id}>
                  <span>{cartItem.name} x {cartItem.quantity}</span>
                  <span>₹{cartItem.price * cartItem.quantity}</span>
                </div>
              );
            })
          }
          <hr/>

          <div className="flex justify-between text-sm">
            <span>Item ({totalQuantity})</span>
            <span>₹{subTotal}</span>
          </div>

          <div className="flex justify-between text-sm">
            <span>Delivery Fee</span>
            <span>{deliveryFee === 0 ? "Free" : `₹${deliveryFee}`}</span>
          </div>

          <div className="flex justify-between text-sm">
            <span>Platform Fee</span>
            <span>₹{platFormFee}</span>
          </div>

          {subTotal < 250 && (
            <p className="text-xs text-gray-500 mt-2">
              Note: Delivery fee is waived for orders above ₹250.
            </p>
          )}

          <div className="flex justify-between text-base font-semibold border-t pt-2">
            <span>Grand Total</span>
            <span>₹{grandTotal}</span>
          </div>
       </div>

        <div className="rounded-xl bg-white p-4 shadow-sm space-y-3">

          <h3 className="font-semibold">Payment Method</h3>

          <botton disabled={!selectedAddressId || loadingPayment || creatingOrder} onClick={paywithRazorpay} className="flex w-full item-center justify-center gap-2 rounded-lg bg-[#2d7ff9] px-4 py-2 text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50">
            Pay with Razorpay
          </botton>

        </div>
      </div>
    </>
  );
};

export default Checkout;
