const OrderStatusBadge = ({ status }) => {
  const colors = {
    processing: "bg-yellow-100 text-yellow-700",
    accepted: "bg-blue-100 text-blue-700",
    preparing: "bg-purple-100 text-purple-700",
    "ready for rider": "bg-indigo-100 text-indigo-700",
    "rider assigned": "bg-cyan-100 text-cyan-700",
    "out for delivery": "bg-orange-100 text-orange-700",
    "picked up": "bg-orange-100 text-orange-700",
    delivered: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
  };

  const colorClass = colors[status?.toLowerCase()] || "bg-gray-100 text-gray-700";

  return (

    <span
      className={`inline-flex rounded-full px-3.5 py-1.5 text-xs font-semibold ${colorClass}`}
    >
      {status}
    </span>

  );

};

export default OrderStatusBadge;