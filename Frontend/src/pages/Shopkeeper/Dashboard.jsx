import SalesChart from "../../components/Shopkeeper/Dashboard/SalesChart";
import RecentOrders from "../../components/Shopkeeper/Dashboard/RecentOrders";
import QuickActions from "../../components/Shopkeeper/Dashboard/QuickActions";
import Analytics from "./Analytics";
import BottomNavbar from "../../components/Shopkeeper/BottomNavbar";

const Dashboard = () => {

  const hour = new Date().getHours();

  let greeting = "Good Evening";

  if (hour < 12) {

    greeting = "Good Morning";

  } else if (hour < 18) {

    greeting = "Good Afternoon";

  }

  return (

    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-slate-100 pb-24">

      <div className="max-w-7xl mx-auto p-6">

        {/* Header */}

        <div className="mb-10">

          <h1 className="text-4xl font-bold">

            {greeting} 👋

          </h1>

          <p className="text-gray-500 mt-2">

            Welcome back to your shop dashboard.

          </p>

        </div>

        {/* Live Analytics */}

        <div className="mb-10">

          <Analytics />

        </div>

        {/* Charts + Quick Actions */}

        <div className="grid xl:grid-cols-3 gap-8">

          <div className="xl:col-span-2">

            <SalesChart />

          </div>

          <QuickActions />

        </div>

        {/* Recent Orders */}

        <div className="mt-10">

          <RecentOrders />

        </div>

      </div>
      <BottomNavbar />

    </div>

  );

};

export default Dashboard;