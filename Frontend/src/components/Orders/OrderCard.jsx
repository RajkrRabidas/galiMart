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
    <div className="bg-white rounded-3xl shadow-lg p-5 flex gap-5">

      <img
        src={firstItem?.image || placeholderImage}
        alt={firstItem?.name || "Ordered item"}
        onError={(event) => {
          if (event.currentTarget.src.endsWith(placeholderImage)) return;
          event.currentTarget.src = placeholderImage;
        }}
        className="w-28 h-28 rounded-2xl object-cover"
      />

      <div className="flex-1">

        <h2 className="text-xl font-bold">
          {firstItem?.name || "Order items"}
        </h2>

        <p className="text-gray-500 mt-1">
          Order ID : {orderId}
        </p>

        <p className="text-gray-500">
          Ordered : {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "-"}
        </p>

        <p className="font-semibold mt-2">
          Qty : {(order.items || []).reduce((total, item) => total + (item.quantity || 0), 0)}
        </p>

        <p className="text-emerald-600 font-bold text-lg mt-2">
          ₹{order.totalAmount ?? order.total ?? 0}
        </p>

        <div className="mt-4">

          <OrderStatusBadge status={statusLabel} />

        </div>

      </div>

      <div className="flex flex-col justify-between">

        <button
          onClick={() => navigate(`/track-order/${orderId}`)}
          className="bg-emerald-600 text-white px-5 py-2 rounded-xl"
        >
          Track
        </button>

      </div>

    </div>
  );
};

export default OrderCard;