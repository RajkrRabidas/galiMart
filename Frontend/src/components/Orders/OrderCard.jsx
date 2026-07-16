import OrderStatusBadge from "./OrderStatusBadge";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useMarketplace } from "../../context/MarketplaceContext";

const OrderCard = ({ order }) => {
    const navigate = useNavigate();

const { cancelOrder } = useMarketplace();
  return (
    <div className="bg-white rounded-3xl shadow-lg p-5 flex gap-5">

      <img
        src={order.items[0].image}
        className="w-28 h-28 rounded-2xl object-cover"
      />

      <div className="flex-1">

        <h2 className="text-xl font-bold">
          {order.items[0].name}
        </h2>

        <p className="text-gray-500 mt-1">
          Order ID : {order.id}
        </p>

        <p className="text-gray-500">
          Ordered : {order.date}
        </p>

        <p className="font-semibold mt-2">
          Qty : {order.items.reduce((t, i) => t + i.quantity, 0)}
        </p>

        <p className="text-emerald-600 font-bold text-lg mt-2">
          ₹{order.total}
        </p>

        <div className="mt-4">

          <OrderStatusBadge status={order.orderStatus} />

        </div>

      </div>

      <div className="flex flex-col justify-between">

        <button
          onClick={() => navigate(`/track-order/${order.id}`)}
          className="bg-emerald-600 text-white px-5 py-2 rounded-xl"
        >
          Track
        </button>

        {order.orderStatus !== "Delivered" &&
 order.orderStatus !== "Cancelled" && (
          <button
            onClick={() => {

  cancelOrder(order.id);

  toast.success("Order Cancelled");}}
            className="border border-red-500 text-red-500 px-5 py-2 rounded-xl"
          >
            Cancel
          </button>
        )}

      </div>

    </div>
  );
};

export default OrderCard;