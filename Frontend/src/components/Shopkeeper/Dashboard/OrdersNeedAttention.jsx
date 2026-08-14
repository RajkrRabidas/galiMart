import { AlertCircle, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const OrdersNeedAttention = ({ pendingCount }) => {
  const navigate = useNavigate();

  if (pendingCount === 0) {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 p-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="text-green-600">✓</div>
          <div>
            <p className="font-medium text-green-900">You're all caught up!</p>
            <p className="text-sm text-green-700">No pending orders at the moment.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 mb-6">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3 flex-1">
          <AlertCircle size={20} className="text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-amber-900">
              {pendingCount} {pendingCount === 1 ? "order" : "orders"} need attention
            </p>
            <p className="text-sm text-amber-700">Review and process these orders to keep customers happy.</p>
          </div>
        </div>
        <button
          onClick={() => navigate("/seller/orders")}
          className="text-amber-600 hover:text-amber-700 ml-2 shrink-0 cursor-pointer"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default OrdersNeedAttention;
