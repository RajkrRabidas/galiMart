import OrderStatusBadge from "./OrderStatusBadge";
import { useNavigate } from "react-router-dom";
import { Eye, MapPin, Zap } from "lucide-react";

const OrderCard = ({ order }) => {
  const navigate = useNavigate();
  const placeholderImage = "/placeholder-food.svg";
  const firstItem = order.items?.[0];
  const orderId = order._id || order.id;
  const status = order.status || order.orderStatus;
  const statusLabel = status
    ? status.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase())
    : "Unknown";
  const totalItems = (order.items || []).reduce((total, item) => total + (item.quantity || 0), 0);
  const orderDate = order.createdAt ? new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "-";

  return (
    <article className="group relative overflow-hidden rounded-2xl border border-slate-200/50 bg-gradient-to-br from-white via-white to-slate-50 transition duration-300 hover:-translate-y-1 hover:border-emerald-200/70 hover:shadow-lg sm:p-5 p-4">
      
      {/* Status indicator bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r " />

      <div className="flex flex-col gap-4 sm:flex-row sm:gap-5">
        {/* Product Image */}
        <div className="relative flex-shrink-0">
          <img
            src={firstItem?.image || placeholderImage}
            alt={firstItem?.name || "Ordered item"}
            onError={(event) => {
              if (event.currentTarget.src.endsWith(placeholderImage)) return;
              event.currentTarget.src = placeholderImage;
            }}
            className="h-24 w-24 rounded-xl object-cover ring-2 ring-slate-100 transition group-hover:ring-emerald-200 sm:h-32 sm:w-32"
          />
          {status?.toLowerCase() === "delivered" && (
            <div className="absolute -right-1 -top-1 flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 text-white shadow-md">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          )}
        </div>

        {/* Order Details */}
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex flex-wrap items-start justify-between gap-2">
            <div>
              <h2 className="line-clamp-2 text-base font-bold text-slate-900 sm:text-lg">
                {firstItem?.name || "Order items"}
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Order #{orderId.substring(0, 8).toUpperCase()}...
              </p>
            </div>
            <OrderStatusBadge status={statusLabel} />
          </div>

          {/* Order Info Grid */}
          <div className="mt-3 grid grid-cols-2 gap-3 text-xs sm:gap-4 sm:text-sm">
            <div className="rounded-lg bg-slate-50 p-2 sm:p-2.5">
              <p className="text-slate-600">Ordered on</p>
              <p className="font-semibold text-slate-900">{orderDate}</p>
            </div>
            <div className="rounded-lg bg-slate-50 p-2 sm:p-2.5">
              <p className="text-slate-600">Items</p>
              <p className="font-semibold text-slate-900">{totalItems} {totalItems === 1 ? "item" : "items"}</p>
            </div>
          </div>

          {/* Price and More Items */}
          <div className="mt-3 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-600">Order total</p>
              <p className="text-lg font-bold text-emerald-600 sm:text-xl">
                ₹{order.totalAmount ?? order.total ?? 0}
              </p>
            </div>
            {order.items && order.items.length > 1 && (
              <p className="text-xs font-medium text-slate-600">
                +{order.items.length - 1} more item{order.items.length - 1 !== 1 ? "s" : ""}
              </p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2 sm:w-auto sm:flex-col sm:justify-between sm:gap-3 sm:pt-0">
          <button
            onClick={() => navigate(`/orders/${orderId}`)}
            className="group/btn inline-flex flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-lg border border-emerald-300 bg-gradient-to-b from-emerald-50 to-emerald-50 px-3 py-2.5 text-xs font-semibold text-emerald-700 transition duration-200 hover:border-emerald-400 hover:from-emerald-100 hover:to-emerald-50 hover:shadow-md sm:flex-none sm:text-sm cursor-pointer"
          >
            <Eye size={16} />
            Details
          </button>

          <button
            onClick={() => navigate(`/track-order/${orderId}`)}
            className="group/btn inline-flex flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-gradient-to-b from-emerald-500 to-emerald-600 px-3 py-2.5 text-xs font-semibold text-white transition duration-200 hover:from-emerald-600 hover:to-emerald-700 hover:shadow-lg sm:flex-none sm:text-sm cursor-pointer"
          >
            <Zap size={16} />
            Track
          </button>
        </div>
      </div>

    </article>
  );
};

export default OrderCard;