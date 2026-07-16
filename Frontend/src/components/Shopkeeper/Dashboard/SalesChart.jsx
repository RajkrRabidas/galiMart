import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { useMarketplace } from "../../../context/MarketplaceContext";
import { useShops } from "../../../context/ShopContext";

const SalesChart = () => {

  const { shops } = useShops();
  const { getSellerOrders } = useMarketplace();

  const owner = localStorage.getItem("shopOwner");

  const orders = getSellerOrders(owner, shops);

  const salesData = [];

  orders.forEach((order) => {

    if (order.orderStatus !== "Delivered") return;

    const day = new Date(order.date).toLocaleDateString();

    const existing = salesData.find(
      item => item.day === day
    );

    if (existing) {

      existing.sales += order.total;

    } else {

      salesData.push({
        day,
        sales: order.total,
      });

    }

  });

  return (

    <div className="bg-white rounded-3xl shadow-lg p-6">

      <h2 className="text-2xl font-bold mb-6">

        Sales Overview

      </h2>

      {

        salesData.length === 0 ? (

          <div className="h-72 flex justify-center items-center text-gray-500">

            No Sales Yet

          </div>

        ) : (

          <ResponsiveContainer
            width="100%"
            height={300}
          >

            <LineChart
              data={salesData}
            >

              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="day" />

              <YAxis />

              <Tooltip />

              <Line
                type="monotone"
                dataKey="sales"
                stroke="#10b981"
                strokeWidth={3}
              />

            </LineChart>

          </ResponsiveContainer>

        )

      }

    </div>

  );

};

export default SalesChart;