import { useParams } from "react-router-dom";
import { useOrders } from "../../context/OrderContext";
import BottomNavbar from "../../components/BottomNavbar/BottomNavbar";
import RiderOrderMap from "../Delivery/RiderOrderMap";
import { fetchOrderDetails } from "../../api/orderApi";
import { useEffect, useState } from "react";
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';

const TrackOrder = () => {
  const { id } = useParams();
  const { orders } = useOrders();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Try to get order from context first, then fetch from API
  useEffect(() => {
    const contextOrder = orders.find((o) => o._id === id || o.id === id);
    
    if (contextOrder) {
      setOrder(contextOrder);
      setLoading(false);
      return;
    }

    // If not in context, fetch from API
    const fetchOrder = async () => {
      try {
        const response = await fetchOrderDetails(id);
        setOrder(response.order);
      } catch (err) {
        console.error("Failed to fetch order:", err);
        setError("Unable to load order details");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id, orders]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-slate-100">
        <div className="max-w-3xl mx-auto p-6 pb-24">
          <p className="text-center text-gray-500">Loading order...</p>
        </div>
        <BottomNavbar />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-slate-100">
        <div className="max-w-3xl mx-auto p-6 pb-24 text-center">
          <p className="text-red-500">{error || "Order not found"}</p>
        </div>
        <BottomNavbar />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-slate-100">
      <div className="max-w-3xl mx-auto p-6 pb-24">
        <h1 className="text-3xl font-bold mb-6">
          Track Order #{String(order._id || order.id).slice(-6)}
        </h1>

        <div className="rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden">
          <RiderOrderMap currentOrder={order} />
        </div>

        {order.shopName && (
          <div className="mt-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <h2 className="font-semibold text-slate-900 mb-2">Order from</h2>
            <p className="text-slate-600">{order.shopName}</p>
          </div>
        )}

        {order.deliveryAddress && (
          <div className="mt-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <h2 className="font-semibold text-slate-900 mb-2">Delivery to</h2>
            <p className="text-slate-600">{order.deliveryAddress?.fullName}</p>
            <p className="text-sm text-slate-500">{order.deliveryAddress?.formattedAddress}</p>
          </div>
        )}

        <div className="mt-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <h2 className="font-semibold text-slate-900 mb-2">Order Status</h2>
          <p className="text-slate-600 capitalize">
            {order.status?.replaceAll("_", " ") || "Processing"}
          </p>
        </div>
      </div>

      <BottomNavbar />
    </div>
  );
};

export default TrackOrder;