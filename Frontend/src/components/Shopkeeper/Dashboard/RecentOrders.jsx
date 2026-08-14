import { useNavigate } from "react-router-dom";
import OrderStatusBadge from "./OrderStatusBadge";
import EmptyState from "./EmptyState";

const RecentOrders = ({ orders = [], loading = false }) => {
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-semibold mb-6">Recent Orders</h2>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-100 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-semibold mb-6">Recent Orders</h2>
        <EmptyState type="orders" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Recent Orders</h2>
        {orders.length > 0 && (
          <button
            onClick={() => navigate("/seller/orders")}
            className="text-green-600 hover:text-green-700 text-sm font-medium cursor-pointer"
          >
            View All →
          </button>
        )}
      </div>

      <div className="space-y-1">
        {orders.slice(0, 5).map((order, index) => (
          <div
            key={order._id || index}
            className={`p-4 rounded-lg hover:bg-gray-50 transition cursor-pointer ${
              index !== orders.length - 1 ? "border-b border-gray-100" : ""
            }`}
            onClick={() => navigate(`/seller/orders`)}
            role="button"
            tabIndex={0}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-gray-900 truncate">
                    #{order._id?.slice(-6).toUpperCase() || order.id}
                  </h3>
                  <span className="text-sm text-gray-500">
                    {order.items?.length || 0} {order.items?.length === 1 ? "item" : "items"}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  {order.deliveryAddress?.formattedAddress
                    ? order.deliveryAddress.formattedAddress.substring(0, 40) + "..."
                    : "Address not available"}
                </p>
                <p className="text-xs text-gray-500">
                  {order.createdAt ? new Date(order.createdAt).toLocaleString() : ""}
                </p>
              </div>

              <div className="flex flex-col items-end gap-2 shrink-0">
                <span className="font-semibold text-gray-900">₹{order.totalAmount || 0}</span>
                <OrderStatusBadge status={order.status || "placed"} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentOrders;