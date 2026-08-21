import OrderStatusBadge from "./OrderStatusBadge";
import { useNavigate } from "react-router-dom";

const OrderCard = ({ order }) => {
  const navigate = useNavigate();
  const placeholderImage = "/placeholder-food.svg";
  const firstItem = order.items?.[0];
  const orderId = order._id || order.id;
  const status = order.status || order.orderStatus;
  const statusLabel = status
    ? status.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase())
    : "Unknown";

  return (
    <article className="flex flex-col gap-4 rounded-3xl border border-white/80 bg-white p-4 shadow-[0_10px_25px_rgba(15,23,42,0.08)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(15,23,42,0.12)] sm:flex-row sm:gap-5 sm:p-5">

      <img
        src={firstItem?.image || placeholderImage}
        alt={firstItem?.name || "Ordered item"}
        onError={(event) => {
          if (event.currentTarget.src.endsWith(placeholderImage)) return;
          event.currentTarget.src = placeholderImage;
        }}
        className="h-24 w-24 rounded-2xl object-cover ring-1 ring-slate-100 sm:h-28 sm:w-28"
      />

      <div className="min-w-0 flex-1">

        <h2 className="truncate text-lg font-bold text-slate-900 sm:text-xl">
          {firstItem?.name || "Order items"}
        </h2>

        <p className="mt-1 truncate text-xs text-slate-500 sm:text-sm">
          Order ID · {orderId}
        </p>

        <p className="text-xs text-slate-500 sm:text-sm">
          Ordered · {order.createdAt ? new Date(order.createdAt).toLocaleDateString("en-IN") : "-"}
        </p>

        <p className="mt-2 text-sm font-semibold text-slate-800">
          Qty · {(order.items || []).reduce((total, item) => total + (item.quantity || 0), 0)}
        </p>

        <p className="mt-2 text-lg font-bold text-emerald-600">
          ₹{order.totalAmount ?? order.total ?? 0}
        </p>

        <div className="mt-3">

          <OrderStatusBadge status={statusLabel} />

        </div>

      </div>

      <div className="flex w-full gap-2 sm:w-32 sm:flex-col sm:justify-between sm:gap-3">

        <button
          onClick={() => navigate(`/orders/${orderId}`)}
          className="flex-1 whitespace-nowrap rounded-xl border border-emerald-600 px-3 py-2 text-sm font-medium text-emerald-700 transition hover:bg-emerald-50 sm:flex-none"
        >
          View details
        </button>

        <button
          onClick={() => navigate(`/track-order/${orderId}`)}
          className="flex-1 rounded-xl bg-emerald-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 sm:flex-none"
        >
          Track
        </button>

      </div>

    </article>
  );
};

export default OrderCard;