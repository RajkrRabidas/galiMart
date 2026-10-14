import { useEffect, useState } from "react";
import axios from "../../api/axios";
import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const Checkout = () => {
  const { cartItems, clearCart } = useCart();

  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);

  const [loadingAddress, setLoadingAddress] = useState(true);

  const [loadingPayment, setLoadingPayment] = useState(false);
  const [creatingOrder, setCreatingOrder] = useState(false);

  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const response = await axios.get("/addresses");
        const fetchedAddresses = response.data.addresses || [];
        setAddresses(fetchedAddresses);
        setSelectedAddress((prev) => prev || fetchedAddresses.find((address) => address.isDefault) || fetchedAddresses[0] || null);
      } catch (error) {
        toast.error(error.response?.data?.message || "Unable to load saved addresses.");
      }
      setLoadingAddress(false);
    };

    fetchAddress();
  }, []);

  const navigate = useNavigate();

  const shop = cartItems?.length > 0 ? cartItems[0].shopId : null;

  const selectedAddressId = selectedAddress?._id || selectedAddress?.id;

  const subTotal = cartItems.reduce((total, item) => {
    const itemPrice = item.itemId?.price || item.price || 0;
    const quantity = item.quantity || 1;
    return total + (itemPrice * quantity);
  }, 0);

  const deliveryFee = subTotal === 0 ? 0 : subTotal > 300 ? 0 : 30;

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
    } catch {
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
            const paymentId = response.razorpay_payment_id;
            const verifiedOrderId = response.razorpay_order_id;

            if (!paymentId || !verifiedOrderId || !response.razorpay_signature) {
              throw new Error("Incomplete Razorpay payment response");
            }

            await axios.post("/payment/verify-payment", {
              razorpay_order_id: verifiedOrderId,
              razorpay_payment_id: paymentId,
              razorpay_signature: response.razorpay_signature,
              orderId,
            });

            await clearCart();
            toast.success("Payment successful 🎉");
            navigate(`/payment-success/${paymentId}?orderId=${orderId}`);
          } catch (error) {
            console.error("Payment verification failed:", error);
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
            {shop?.autoLocation?.formattedAddress || "Shop Address"}
          </p>
        </div>

        <div className="rounded-xl bg-white p-4 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Delivery Address</h2>
          {loadingAddress ? (
            <p className="text-sm text-gray-500">Loading addresses...</p>
          ) : addresses.length === 0 ? (
            <div className="rounded-lg border border-dashed p-4 text-sm text-gray-500">
              No address found. <Link to="/addresses" className="font-semibold text-[#e23744] underline">Add a delivery address</Link>.
            </div>
          ) : (
            <div className="space-y-3">
            {addresses.map((add) => (
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
                 <p className="text-sm font-semibold">{add.fullName} <span className="ml-1 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-normal">{add.addressType || "Address"}</span>{add.isDefault && <span className="ml-2 text-xs font-medium text-emerald-700">Default</span>}</p>
                 <p className="mt-1 text-sm text-gray-600">{add.formattedAddress}</p>
                 <p className="mt-1 text-xs text-gray-500">+91 {add.phoneNumber?.replace(/^\+91/, "") || add.mobile}{add.pinCode ? ` · PIN ${add.pinCode}` : ""}</p>
               </div>
              </label>
            ))}
            <Link to="/addresses" className="inline-flex min-h-10 items-center text-sm font-semibold text-[#e23744] hover:underline">Manage saved addresses</Link>
            </div>
          )}
        </div>

       <div className="rounded-xl bg-white p-4 shadow-sm space-y-4">
        <h3 className="font-semibold">Order Summary</h3>

          {
            cartItems.map((cartItem, index) => {
              const item = cartItem.itemId || cartItem;
              const itemName = item.name || "Item";
              const itemPrice = item.price || 0;
              const quantity = cartItem.quantity || 1;
              
              return (
                <div className="flex justify-between text-sm" key={cartItem._id || `${item.name || "item"}-${index}`}>
                  <span>{itemName} x {quantity}</span>
                  <span>₹{itemPrice * quantity}</span>
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

          {subTotal > 0 && subTotal <= 300 && (
            <p className="text-xs text-gray-500 mt-2">
              Note: Delivery fee is waived for orders above ₹300.
            </p>
          )}

          <div className="flex justify-between text-base font-semibold border-t pt-2">
            <span>Grand Total</span>
            <span>₹{grandTotal}</span>
          </div>
       </div>

        <div className="rounded-xl bg-white p-4 shadow-sm space-y-3">

          <h3 className="font-semibold">Payment Method</h3>

          <button 
            disabled={!selectedAddressId || loadingPayment || creatingOrder} 
            onClick={paywithRazorpay} 
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#2d7ff9] px-4 py-3 text-white font-semibold transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
          >
            {loadingPayment || creatingOrder ? "Processing..." : "Pay with Razorpay"}
          </button>

        </div>
      </div>

      {/* <BottomNavbar /> */}
    </>
  );
};

export default Checkout;
