import { Package, Plus, ShoppingCart, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";

const QuickActions = () => {
  const navigate = useNavigate();

  const actions = [
    {
      title: "Add Product",
      icon: <Plus size={24} />,
      path: "/seller/add-product",
      color: "bg-green-50 text-green-600 hover:bg-green-100",
    },
    {
      title: "View Orders",
      icon: <ShoppingCart size={24} />,
      path: "/seller/orders",
      color: "bg-blue-50 text-blue-600 hover:bg-blue-100",
    },
    {
      title: "Manage Products",
      icon: <Package size={24} />,
      path: "/seller/products",
      color: "bg-purple-50 text-purple-600 hover:bg-purple-100",
    },
    {
      title: "Edit Shop",
      icon: <Settings size={24} />,
      path: "/seller/profile",
      color: "bg-orange-50 text-orange-600 hover:bg-orange-100",
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
      <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {actions.map((action) => (
          <button
            key={action.title}
            onClick={() => navigate(action.path)}
            className={`rounded-lg p-4 transition flex flex-col items-center gap-2 cursor-pointer ${action.color}`}
            title={action.title}
          >
            <div>{action.icon}</div>
            <span className="text-xs font-medium text-center">{action.title}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;