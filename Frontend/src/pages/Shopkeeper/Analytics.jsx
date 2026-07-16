import { useMemo } from "react";
import {
  Package,
  ShoppingCart,
  IndianRupee,
  AlertTriangle,
} from "lucide-react";
import { useMarketplace } from "../../context/MarketplaceContext";
import { useShops } from "../../context/ShopContext";

const Analytics = () => {

  const { shops } = useShops();

  const { getSellerOrders } = useMarketplace();

  const owner = localStorage.getItem("shopOwner");

  const myShop = shops.find(
    (shop) => shop.owner === owner
  );

  const orders = getSellerOrders(owner, shops);

  const analytics = useMemo(() => {

    const totalProducts =
      myShop?.products.length || 0;

    const totalOrders =
      orders.length;

    const revenue = orders
      .filter(
        (order) =>
          order.orderStatus === "Delivered"
      )
      .reduce(
        (sum, order) => sum + order.total,
        0
      );

    const pendingOrders = orders.filter(
      (order) =>
        order.orderStatus !== "Delivered" &&
        order.orderStatus !== "Cancelled"
    ).length;

    const lowStock = myShop?.products.filter(
      (product) => product.stock <= 5
    ).length || 0;

    return {
      totalProducts,
      totalOrders,
      revenue,
      pendingOrders,
      lowStock,
    };

  }, [orders, myShop]);

  const cards = [
    {
      title: "Products",
      value: analytics.totalProducts,
      icon: Package,
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "Orders",
      value: analytics.totalOrders,
      icon: ShoppingCart,
      color: "bg-green-100 text-green-600",
    },
    {
      title: "Revenue",
      value: `₹${analytics.revenue}`,
      icon: IndianRupee,
      color: "bg-yellow-100 text-yellow-600",
    },
    {
      title: "Pending",
      value: analytics.pendingOrders,
      icon: AlertTriangle,
      color: "bg-red-100 text-red-600",
    },
  ];

  return (

    <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">

      {cards.map((card) => {

        const Icon = card.icon;

        return (

          <div
            key={card.title}
            className="bg-white rounded-3xl shadow-lg p-6"
          >

            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center ${card.color}`}
            >

              <Icon size={28} />

            </div>

            <h2 className="text-gray-500 mt-5">

              {card.title}

            </h2>

            <h1 className="text-3xl font-bold mt-2">

              {card.value}

            </h1>

          </div>

        );

      })}

    </div>

  );

};

export default Analytics;