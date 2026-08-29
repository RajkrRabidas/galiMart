import { Package, CheckCircle2, Clock, Truck, MapPin, AlertCircle, XCircle, UtensilsCrossed } from "lucide-react";

const OrderStatusBadge = ({ status }) => {
  const statusConfig = {
    processing: {
      colors: "bg-yellow-50 text-yellow-700 border border-yellow-200",
      icon: Clock,
      label: "Processing"
    },
    accepted: {
      colors: "bg-blue-50 text-blue-700 border border-blue-200",
      icon: CheckCircle2,
      label: "Accepted"
    },
    preparing: {
      colors: "bg-purple-50 text-purple-700 border border-purple-200",
      icon: UtensilsCrossed,
      label: "Preparing"
    },
    "ready for rider": {
      colors: "bg-indigo-50 text-indigo-700 border border-indigo-200",
      icon: Package,
      label: "Ready for Rider"
    },
    "rider assigned": {
      colors: "bg-cyan-50 text-cyan-700 border border-cyan-200",
      icon: Truck,
      label: "Rider Assigned"
    },
    "out for delivery": {
      colors: "bg-orange-50 text-orange-700 border border-orange-200",
      icon: MapPin,
      label: "Out for Delivery"
    },
    "picked up": {
      colors: "bg-orange-50 text-orange-700 border border-orange-200",
      icon: Package,
      label: "Picked Up"
    },
    delivered: {
      colors: "bg-green-50 text-green-700 border border-green-200",
      icon: CheckCircle2,
      label: "Delivered"
    },
    cancelled: {
      colors: "bg-red-50 text-red-700 border border-red-200",
      icon: XCircle,
      label: "Cancelled"
    },
  };

  const config = statusConfig[status?.toLowerCase()] || {
    colors: "bg-gray-50 text-gray-700 border border-gray-200",
    icon: AlertCircle,
    label: "Unknown"
  };

  const IconComponent = config.icon;

  return (
    <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${config.colors}`}>
      <IconComponent size={14} />
      {config.label}
    </span>
  );
};

export default OrderStatusBadge;