import BottomNavbar from "../../components/BottomNavbar/BottomNavbar";
import OrderCard from "../../components/Orders/OrderCard";
import { useMarketplace } from "../../context/MarketplaceContext";

const Orders = () => {
    const { getCustomerOrders } = useMarketplace();

const customerId =
  localStorage.getItem("customerId") || "customer1";

const orders = getCustomerOrders(customerId);
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-slate-100">

      <div className="max-w-6xl mx-auto p-6 pb-24">

        <h1 className="text-4xl font-bold mb-10">
          My Orders
        </h1>

        <div className="space-y-6">

          {orders.length === 0 ? (

  <div className="text-center mt-24">

    <h2 className="text-3xl font-bold">

      No Orders Yet

    </h2>

    <p className="text-gray-500 mt-3">

      Place your first order.

    </p>

  </div>

) : (

  orders.map(order => (

    <OrderCard
      key={order.id}
      order={order}
    />

  ))

)}

        </div>

      </div>

      <BottomNavbar />

    </div>
  );
};

export default Orders;