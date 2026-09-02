import BottomNavbar from "../../components/BottomNavbar/BottomNavbar";
import OrderCard from "../../components/Orders/OrderCard";
import { useEffect, useState } from "react";
import { ArrowRight, ClipboardList, RefreshCw, TrendingUp, CheckCircle2, Clock, Package } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { fetchMyOrders } from "../../api/orderApi";

const Orders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");

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

  // Calculate statistics
  const totalOrders = orders.length;
  const deliveredOrders = orders.filter(o => o.status?.toLowerCase() === "delivered").length;
  const processingOrders = orders.filter(o => !["delivered", "cancelled"].includes(o.status?.toLowerCase())).length;
  
  // Filter orders based on selected filter
  const filteredOrders = selectedFilter === "all" 
    ? orders 
    : selectedFilter === "delivered"
    ? orders.filter(o => o.status?.toLowerCase() === "delivered")
    : selectedFilter === "active"
    ? orders.filter(o => !["delivered", "cancelled"].includes(o.status?.toLowerCase()))
    : orders;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50/50 via-white to-slate-100">
      <div className="mx-auto max-w-6xl px-4 pb-28 pt-6 sm:px-6 sm:pt-10">
        
        {/* Header Section */}
        <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:mb-12 sm:flex-row sm:items-center">
          <div>
            <p className="mb-1 text-sm font-semibold uppercase tracking-wide text-emerald-600">Your activity</p>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">My Orders</h1>
            {!loading && !error && orders.length > 0 && (
              <p className="mt-2 text-base text-slate-600">
                Track and manage your orders in one place
              </p>
            )}
          </div>
          <div className="hidden sm:block">
            <div className="rounded-2xl bg-gradient-to-br from-emerald-100 to-emerald-50 p-4">
              <ClipboardList className="text-emerald-600" size={40} strokeWidth={1.5} />
            </div>
          </div>
        </div>

        {/* Statistics Cards - Only show when not loading and have orders */}
        {!loading && !error && orders.length > 0 && (
          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-5">
            
            {/* Total Orders Card */}
            <div className="overflow-hidden rounded-2xl border border-slate-200/50 bg-white p-5 shadow-sm transition hover:border-emerald-200/70 hover:shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-600">Total Orders</p>
                  <p className="mt-2 text-3xl font-bold text-slate-900">{totalOrders}</p>
                </div>
                <div className="rounded-xl bg-blue-50 p-3">
                  <Package className="text-blue-600" size={24} />
                </div>
              </div>
            </div>

            {/* Processing Orders Card */}
            <div className="overflow-hidden rounded-2xl border border-slate-200/50 bg-white p-5 shadow-sm transition hover:border-amber-200/70 hover:shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-600">Processing</p>
                  <p className="mt-2 text-3xl font-bold text-slate-900">{processingOrders}</p>
                </div>
                <div className="rounded-xl bg-amber-50 p-3">
                  <Clock className="text-amber-600" size={24} />
                </div>
              </div>
            </div>

            {/* Delivered Orders Card */}
            <div className="overflow-hidden rounded-2xl border border-slate-200/50 bg-white p-5 shadow-sm transition hover:border-emerald-200/70 hover:shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-600">Delivered</p>
                  <p className="mt-2 text-3xl font-bold text-slate-900">{deliveredOrders}</p>
                </div>
                <div className="rounded-xl bg-emerald-50 p-3">
                  <CheckCircle2 className="text-emerald-600" size={24} />
                </div>
              </div>
            </div>

          </div>
        )}

        {/* Filter Buttons */}
        {!loading && !error && orders.length > 0 && (
          <div className="mb-8 flex gap-3 overflow-x-auto pb-2">
            <button
              onClick={() => setSelectedFilter("all")}
              className={`whitespace-nowrap rounded-full px-6 py-2.5 text-sm font-semibold transition cursor-pointer ${
                selectedFilter === "all"
                  ? "bg-emerald-600 text-white shadow-md"
                  : "border border-slate-300 text-slate-700 hover:border-emerald-400 hover:bg-emerald-50"
              }`}
            >
              All Orders
            </button>
            <button
              onClick={() => setSelectedFilter("active")}
              className={`whitespace-nowrap rounded-full px-6 py-2.5 text-sm font-semibold transition cursor-pointer ${
                selectedFilter === "active"
                  ? "bg-amber-500 text-white shadow-md"
                  : "border border-slate-300 text-slate-700 hover:border-amber-400 hover:bg-amber-50"
              }`}
            >
              Processing
            </button>
            <button
              onClick={() => setSelectedFilter("delivered")}
              className={`whitespace-nowrap rounded-full px-6 py-2.5 text-sm font-semibold transition cursor-pointer ${
                selectedFilter === "delivered"
                  ? "bg-emerald-600 text-white shadow-md"
                  : "border border-slate-300 text-slate-700 hover:border-emerald-400 hover:bg-emerald-50"
              }`}
            >
              Delivered
            </button>
          </div>
        )}

        {/* Orders List */}
        <div className="space-y-4 sm:space-y-5">

          {loading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="h-40 animate-pulse rounded-2xl bg-slate-200/40 shadow-sm sm:h-36" />
            ))
          ) : error ? (
            <div className="rounded-2xl border border-red-200/50 bg-gradient-to-br from-red-50 to-red-50 px-6 py-16 text-center shadow-sm">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="mt-4 text-lg font-semibold text-slate-900">Oops! Something went wrong</p>
              <p className="mt-2 text-slate-600">{error}</p>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="mt-6 inline-flex items-center gap-2 rounded-lg bg-red-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-red-700 hover:shadow-lg"
              >
                <RefreshCw size={16} /> Try again
              </button>
            </div>
          ) : orders.length === 0 ? (
            <div className="rounded-2xl border border-slate-200/50 bg-gradient-to-br from-slate-50 to-slate-50 px-6 py-20 text-center shadow-sm">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
                <ClipboardList className="text-emerald-600" size={40} />
              </div>
              <h2 className="mt-6 text-2xl font-bold text-slate-900">No orders yet</h2>
              <p className="mt-3 text-slate-600">Start shopping and your orders will appear here!</p>
              <button
                type="button"
                onClick={() => navigate("/home")}
                className="mt-8 inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 hover:shadow-lg"
              >
                Start shopping <ArrowRight size={16} />
              </button>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="rounded-2xl border border-slate-200/50 bg-gradient-to-br from-slate-50 to-slate-50 px-6 py-12 text-center shadow-sm">
              <p className="text-slate-600">No {selectedFilter === "delivered" ? "delivered" : selectedFilter === "active" ? "active" : ""} orders found.</p>
            </div>
          ) : (
            filteredOrders.map((order) => (
              <OrderCard key={order._id || order.id} order={order} />
            ))
          )}

        </div>

      </div>

      <BottomNavbar />

    </div>
  );
};

export default Orders;