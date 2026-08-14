const OrderStatusBadge = ({ status }) => {
  const statusConfig = {
    placed: { label: "New", color: "bg-blue-100 text-blue-700" },
    accepted: { label: "Accepted", color: "bg-purple-100 text-purple-700" },
    preparing: { label: "Preparing", color: "bg-orange-100 text-orange-700" },
    ready_for_rider: { label: "Ready", color: "bg-yellow-100 text-yellow-700" },
    rider_assigned: { label: "Assigned", color: "bg-indigo-100 text-indigo-700" },
    picked_up: { label: "Picked Up", color: "bg-cyan-100 text-cyan-700" },
    delivered: { label: "Delivered", color: "bg-green-100 text-green-700" },
    cancelled: { label: "Cancelled", color: "bg-red-100 text-red-700" },
  };

  const config = statusConfig[status] || { label: status, color: "bg-gray-100 text-gray-700" };

  return (
    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${config.color}`}>
      {config.label}
    </span>
  );
};

export default OrderStatusBadge;
