import BottomNavbar from "../../components/BottomNavbar/BottomNavbar";
import OrderCard from "../../components/Orders/OrderCard";
import { useEffect, useState } from "react";
import { fetchMyOrders } from "../../api/orderApi";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadOrders = async () => {
      try {
        const response = await fetchMyOrders();
        if (isMounted) setOrders(response.orders || []);
      } catch (requestError) {
        console.error("Unable to fetch customer orders:", requestError);
        if (isMounted) setError("Unable to load your orders. Please try again.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadOrders();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-linear-to-b from-emerald-50 via-white to-slate-100">

      <div className="max-w-6xl mx-auto p-6 pb-24">

        <h1 className="text-4xl font-bold mb-10">
          My Orders
        </h1>

        <div className="space-y-6">

          {loading ? (
            <div className="text-center mt-24 text-gray-500">Loading orders...</div>
          ) : error ? (
            <div className="text-center mt-24 text-red-500">{error}</div>
          ) : orders.length === 0 ? (

  <div className="text-center mt-24">

    <h2 className="text-3xl font-bold">

      No Orders Yet

    </h2>

    <p className="text-gray-500 mt-3">

      Place your first order.

    </p>

  </div>

) : (

            orders.map((order) => (

    <OrderCard
          key={order._id || order.id}
      order={order}
    />

  ))

)}

        </div>

      </div>

      <BottomNavbar />

    </div>
  );
};

export default Orders;