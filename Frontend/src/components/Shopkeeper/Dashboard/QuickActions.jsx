import { Package, Plus, ShoppingCart, BarChart3 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const QuickActions = () => {

  const navigate = useNavigate();

  const actions = [
    {
      title: "Add Product",
      icon: <Plus size={28} />,
      path: "/seller/add-product",
    },
    {
      title: "Products",
      icon: <Package size={28} />,
      path: "/seller/products",
    },
    {
      title: "Orders",
      icon: <ShoppingCart size={28} />,
      path: "/seller/orders",
    },
    {
      title: "Analytics",
      icon: <BarChart3 size={28} />,
      path: "/seller/analytics",
    },
  ];

  return (
    <div className="bg-white rounded-3xl shadow-lg p-6">

      <h2 className="text-2xl font-bold mb-6">
        Quick Actions
      </h2>

      <div className="grid grid-cols-2 gap-5">

        {actions.map((action) => (

          <button
            key={action.title}
            onClick={() => navigate(action.path)}
            className="bg-emerald-50 rounded-2xl p-6 hover:bg-emerald-100 transition"
          >

            <div className="text-emerald-600">

              {action.icon}

            </div>

            <h3 className="font-semibold mt-3">

              {action.title}

            </h3>

          </button>

        ))}

      </div>

    </div>
  );
};

export default QuickActions;