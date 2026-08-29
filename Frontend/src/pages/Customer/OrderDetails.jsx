import { useEffect, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  MapPin,
  Phone,
  Store,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import BottomNavbar from "../../components/BottomNavbar/BottomNavbar";
import OrderStatusBadge from "../../components/Orders/OrderStatusBadge";
import { fetchOrderDetails } from "../../api/orderApi";
import { useSocket } from "../../context/SocketContext";
import RiderOrderMap from "../Delivery/RiderOrderMap";

const statusLabels = {
  placed: "Processing",
  accepted: "Accepted",
  preparing: "Preparing",
  ready_for_rider: "Ready for rider",
  rider_assigned: "Rider assigned",
  picked_up: "Out for delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const formatStatus = (status) =>
  statusLabels[status] || status?.replaceAll("_", " ") || "Unknown";

const formatCurrency = (amount) =>
  `₹${Number(amount || 0).toLocaleString("en-IN")}`;

const formatDate = (date) =>
  date
    ? new Date(date).toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "-";

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const socket = useSocket();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [riderLocation, setRiderLocation] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadOrder = async () => {
      try {
        const response = await fetchOrderDetails(id);
        if (isMounted) setOrder(response.order);
      } catch (requestError) {
        console.error("Unable to fetch order details:", requestError);
        if (isMounted) setError("Unable to load this order. Please try again.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadOrder();
    return () => {
      isMounted = false;
    };
  }, [id]);

  useEffect(() => {
    if (!socket || !id) return;

    socket.emit("join-room", `user:${id}`);
    return () => {
      socket.emit("leave", `user:${id}`);
    };
  }, [socket, id]);

  useEffect(() => {
    if (!socket) return;

    const onRiderLocation = ({ latitude, longitude }) => {
      console.log("Received rider location:", latitude, longitude);
      setRiderLocation({ lat: latitude, lng: longitude });
    };

    socket.on("rider:location", onRiderLocation);

    return () => {
      socket.off("rider:location", onRiderLocation);
    };
  }, [socket]);

  if (loading) {
    return <PageMessage message="Loading order details..." />;
  }

  if (error || !order) {
    return <PageMessage message={error || "Order not found."} isError />;
  }

  const orderId = order._id || order.id;
  const status = formatStatus(order.status || order.orderStatus);
  const address = order.deliveryAddress || {};
  const items = order.items || [];

  return (
    <div className="min-h-screen bg-linear-to-b from-emerald-50 via-white to-slate-100">
      <main className="mx-auto max-w-3xl px-4 pb-28 pt-5 sm:px-6">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-emerald-700"
        >
          <ArrowLeft size={18} />
          Back to orders
        </button>

        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-slate-500">Order details</p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Order #{String(orderId).slice(-6)}
            </h1>
            <p className="mt-1 text-xs text-slate-500">
              Placed {formatDate(order.createdAt)}
            </p>
          </div>
          <OrderStatusBadge status={status} />
        </div>

        <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-4 flex items-center gap-2">
            <Store size={18} className="text-emerald-600" />
            <h2 className="font-semibold text-slate-900">
              {order.shopName || "Gali Mart"}
            </h2>
          </div>
          <div className="divide-y divide-slate-100">
            {items.map((item, index) => (
              <div
                className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0"
                key={`${item.itemId || item.name}-${index}`}
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-100">
                    {item.image ? (
                      <img
                        src={item.image || placeholderImage}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-xs text-slate-400">Item</span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-medium text-slate-800">
                      {item.name || "Item"}
                    </p>
                    <p className="text-sm text-slate-500">
                      Qty {item.quantity || 0} · {formatCurrency(item.price)}
                    </p>
                  </div>
                </div>
                <p className="shrink-0 font-semibold text-slate-800">
                  {formatCurrency(item.total ?? item.price * item.quantity)}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-4 flex items-center gap-2">
            <MapPin size={18} className="text-emerald-600" />
            <h2 className="font-semibold text-slate-900">Delivery address</h2>
          </div>
          <p className="font-medium text-slate-800">{address?.fullName}</p>
          <p className="text-sm leading-6 text-slate-600">
            {address?.formattedAddress || "Address unavailable"}
          </p>
          {address?.mobile && (
            <p className="mt-2 inline-flex items-center gap-2 text-sm text-slate-500">
              <Phone size={14} /> {address.mobile}
            </p>
          )}
        </section>

        <section className="mt-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="mb-4 font-semibold text-slate-900">Bill summary</h2>
          <div className="space-y-3 text-sm text-slate-600">
            <BillRow label="Subtotal" value={order.subTotal} />
            <BillRow label="Delivery fee" value={order.deliveryFee} />
            <BillRow label="Platform fee" value={order.platformFee} />
            <div className="flex justify-between border-t border-slate-100 pt-3 text-base font-bold text-slate-900">
              <span>Total</span>
              <span>{formatCurrency(order.totalAmount)}</span>
            </div>
          </div>
          <div className="mt-5 flex items-center gap-2 text-xs text-slate-500">
            <CheckCircle2 size={15} className="text-emerald-600" />
            Payment:{" "}
            {order.paymentMethod === "razorpay"
              ? "Razorpay"
              : "Cash on delivery"}{" "}
            · {order.paymentStatus || "pending"}
          </div>
        </section>

        {order.status !== "delivered" && order.status !== "cancelled" && (
          <button
            type="button"
            onClick={() => navigate(`/track-order/${orderId}`)}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 font-semibold text-white shadow-sm transition hover:bg-emerald-700"
          >
            <Clock3 size={18} />
            Track order
          </button>
        )}

        {(order.status === "rider_assigned" || order.status === "picked_up") && (
          <section className="mt-4 rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden">
            <div className="p-5 sm:p-6 border-b border-slate-100">
              <h2 className="font-semibold text-slate-900 flex items-center gap-2">
                <MapPin size={18} className="text-emerald-600" />
                Live Tracking
              </h2>
            </div>
            <RiderOrderMap currentOrder={order} />
          </section>
        )}
      </main>
      <BottomNavbar />
    </div>
  );
};

const BillRow = ({ label, value }) => (
  <div className="flex justify-between">
    <span>{label}</span>
    <span className="font-medium text-slate-800">{formatCurrency(value)}</span>
  </div>
);

const PageMessage = ({ message, isError = false }) => (
  <div className="min-h-screen bg-slate-50 px-4 pt-24 text-center">
    <p className={isError ? "text-red-500" : "text-slate-500"}>{message}</p>
  </div>
);

export default OrderDetails;
