import { useNavigate } from "react-router-dom";

const EmptyState = ({ type = "orders", onAction }) => {
  const navigate = useNavigate();

  const configs = {
    orders: {
      icon: "📦",
      title: "No orders yet",
      description: "Your recent orders will appear here once customers place an order.",
      action: "View Products",
      path: "/seller/products",
    },
    products: {
      icon: "📋",
      title: "No products yet",
      description: "Add your first product to start selling on galiMart.",
      action: "Add Product",
      path: "/seller/add-product",
    },
  };

  const config = configs[type] || configs.orders;

  return (
    <div className="bg-white rounded-lg p-8 md:p-12 text-center">
      <div className="text-5xl mb-4">{config.icon}</div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{config.title}</h3>
      <p className="text-gray-600 mb-6">{config.description}</p>
      <button
        onClick={() => {
          if (onAction) {
            onAction();
          } else {
            navigate(config.path);
          }
        }}
        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium cursor-pointer"
      >
        {config.action}
      </button>
    </div>
  );
};

export default EmptyState;
