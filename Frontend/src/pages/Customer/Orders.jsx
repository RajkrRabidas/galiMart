import BottomNavbar from "../../components/BottomNavbar/BottomNavbar";
import OrderCard from "../../components/Orders/OrderCard";
import { useEffect, useState } from "react";
import { ArrowRight, ClipboardList, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { fetchMyOrders } from "../../api/orderApi";

const Orders = () => {
  const navigate = useNavigate();
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
      <div className="mx-auto max-w-5xl px-4 pb-28 pt-6 sm:px-6 sm:pt-10">
        <div className="mb-7 flex items-end justify-between gap-4 sm:mb-10">
          <div>
            <p className="mb-1 text-sm font-medium text-emerald-700">Your activity</p>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">My Orders</h1>
            {!loading && !error && orders.length > 0 && (
              <p className="mt-2 text-sm text-slate-500">
                {orders.length} {orders.length === 1 ? "order" : "orders"} placed
              </p>
            )}
          </div>
          <ClipboardList className="hidden text-emerald-200 sm:block" size={44} strokeWidth={1.5} />
        </div>

        <div className="space-y-4 sm:space-y-5">

          {loading ? (
            Array.from({ length: 2 }).map((_, index) => (
              <div className="h-56 animate-pulse rounded-3xl bg-white/80 shadow-sm sm:h-52" key={index} />
            ))
          ) : error ? (
            <div className="rounded-3xl bg-white px-6 py-14 text-center shadow-sm">
              <p className="text-red-500">{error}</p>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
              >
                <RefreshCw size={16} /> Try again
              </button>
            </div>
          ) : orders.length === 0 ? (
            <div className="rounded-3xl bg-white px-6 py-16 text-center shadow-sm">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                <ClipboardList size={30} />
              </div>
              <h2 className="mt-5 text-2xl font-bold text-slate-900">No orders yet</h2>
              <p className="mt-2 text-slate-500">Your delicious discoveries will appear here.</p>
              <button
                type="button"
                onClick={() => navigate("/home")}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
              >
                Start shopping <ArrowRight size={16} />
              </button>
            </div>
          ) : orders.map((order) => (
            <OrderCard key={order._id || order.id} order={order} />
          ))}

        </div>

      </div>

      <BottomNavbar />

    </div>
  );
};

export default Orders;