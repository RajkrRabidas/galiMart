import {
  Truck,
  Package,
  IndianRupee,
  CheckCircle,
} from "lucide-react";

import BottomNavbar from "../../components/DeliveryPartner/BottomNavbar";
import StatsCard from "../../components/DeliveryPartner/StatsCard";
import { useMarketplace } from "../../context/MarketplaceContext";

const Dashboard = () => {

  const { orders } = useMarketplace();

  const available = orders.filter(
    order => order.orderStatus === "Out For Delivery"
  );

  const completed = orders.filter(
    order => order.orderStatus === "Delivered"
  );

  const myId =
    localStorage.getItem("deliveryPartner") || "delivery1";

  const myOrders = orders.filter(
    order => order.deliveryPartner === myId
  );

  const earnings = completed
    .filter(order => order.deliveryPartner === myId)
    .reduce((sum, order) => sum + 50, 0);

  return (

    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-slate-100 pb-24">

      <div className="max-w-7xl mx-auto p-6">

        <h1 className="text-4xl font-bold mb-8">

          Delivery Dashboard

        </h1>

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">

          <StatsCard
            title="Available"
            value={available.length}
            icon={<Package className="text-white" />}
            color="bg-blue-600"
          />

          <StatsCard
            title="My Deliveries"
            value={myOrders.length}
            icon={<Truck className="text-white" />}
            color="bg-emerald-600"
          />

          <StatsCard
            title="Completed"
            value={completed.filter(
              o => o.deliveryPartner === myId
            ).length}
            icon={<CheckCircle className="text-white" />}
            color="bg-purple-600"
          />

          <StatsCard
            title="Earnings"
            value={`₹${earnings}`}
            icon={<IndianRupee className="text-white" />}
            color="bg-orange-500"
          />

        </div>

      </div>

      <BottomNavbar />

    </div>

  );

};

export default Dashboard;