import { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axios";
import { fetchShopOrders } from "../../api/orderApi";
import { getMenuItems } from "../../api/menuApi";
import { useSocket } from "../../context/SocketContext";
import notificationSound from "../../assets/notification.wav";

// Components
import DashboardHeader from "../../components/Shopkeeper/Dashboard/DashboardHeader";
import ShopSnapshot from "../../components/Shopkeeper/Dashboard/ShopSnapshot";
import StatsCard from "../../components/Shopkeeper/Dashboard/StatsCard";
import QuickActions from "../../components/Shopkeeper/Dashboard/QuickActions";
import RecentOrders from "../../components/Shopkeeper/Dashboard/RecentOrders";
import OrdersNeedAttention from "../../components/Shopkeeper/Dashboard/OrdersNeedAttention";
import BottomNavbar from "../../components/Shopkeeper/BottomNavbar";

// Icons
import { TrendingUp, ShoppingBag, Clock, Package } from "lucide-react";

const Dashboard = () => {
  const [shop, setShop] = useState(null);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const { user } = useAuth();
  const socket = useSocket();
  const notificationAudioRef = useRef(null);

  const playNewOrderSound = () => {
    if (!notificationAudioRef.current) {
      notificationAudioRef.current = new Audio(notificationSound);
    }

    const audio = notificationAudioRef.current;
    audio.currentTime = 0;
    audio.volume = 0.8;
    audio.play().catch(() => {
      // Browsers can block sound until the seller interacts with the page.
    });
  };

  useEffect(() => {
    const unlockAudio = () => {
      if (!notificationAudioRef.current) {
        notificationAudioRef.current = new Audio(notificationSound);
      }

      const audio = notificationAudioRef.current;
      audio.muted = true;
      audio.play()
        .then(() => {
          audio.pause();
          audio.currentTime = 0;
          audio.muted = false;
        })
        .catch(() => {});
    };

    window.addEventListener("pointerdown", unlockAudio, { once: true });
    return () => window.removeEventListener("pointerdown", unlockAudio);
  }, []);

  // Fetch shop data
  const fetchMyShop = async () => {
    try {
      const response = await api.get("/shops/my-shop");
      const shopData = response.data?.shop ?? response.data ?? null;

      if (shopData?._id) {
        localStorage.setItem("shopId", shopData._id);
      } else {
        localStorage.removeItem("shopId");
      }

      setShop(shopData);
    } catch (error) {
      console.error("Error fetching shop data:", error);
      localStorage.removeItem("shopId");
      setShop(null);
    } finally {
      setLoading(false);
    }
  };

  // Fetch orders
  const fetchOrders = async (shopId) => {
    if (!shopId) {
      setOrdersLoading(false);
      return;
    }

    try {
      setOrdersLoading(true);
      const response = await fetchShopOrders(shopId);
      // Handle different possible response formats
      const ordersData = response.orders || response.data || response || [];
      setOrders(Array.isArray(ordersData) ? ordersData : []);
    } catch (error) {
      console.error("Error fetching orders:", error);
      // Don't show toast error on initial load - it's optional data
      setOrders([]);
    } finally {
      setOrdersLoading(false);
    }
  };

  // Fetch products
  const fetchProducts = async (shopId) => {
    if (!shopId) return;

    try {
      const response = await getMenuItems(shopId);
      const productsData = response.menuItems || response.items || [];
      setProducts(Array.isArray(productsData) ? productsData : []);
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    }
  };

  // Initial load
  useEffect(() => {
    fetchMyShop();
  }, []);

  // Load orders and products when shop data arrives
  useEffect(() => {
    if (shop?._id) {
      fetchOrders(shop._id);
      fetchProducts(shop._id);
    }
  }, [shop?._id]);

  // Keep dashboard orders current when payment processing creates a new order.
  useEffect(() => {
    if (!socket || !shop?._id) return undefined;

    const handleNewOrder = () => {
      fetchOrders(shop._id);
      playNewOrderSound();
    };
    const refreshOrders = () => fetchOrders(shop._id);

    socket.on("order:new", handleNewOrder);
    socket.on("order:updated", refreshOrders);
    socket.on("order:rider_assigned", refreshOrders);

    return () => {
      socket.off("order:new", handleNewOrder);
      socket.off("order:updated", refreshOrders);
      socket.off("order:rider_assigned", refreshOrders);
    };
  }, [socket, shop?._id]);

  // Handle shop open/close toggle
  const handleToggleOpenStatus = async () => {
    if (!shop) return;

    if (shop?.status !== "approved") {
      toast.error("Your shop must be approved before it can be opened.");
      return;
    }

    try {
      setLoading(true);
      const nextStatus = !shop.isOpen;
      const { data } = await api.put(`/shops/update-shop-status/${shop._id}`, {
        status: nextStatus,
      });

      const updatedShop = data?.data || data?.shop || { ...shop, isOpen: nextStatus };
      setShop(updatedShop);
      toast.success(`Shop is now ${updatedShop.isOpen ? "Open" : "Closed"}`);
    } catch (error) {
      const message = error?.response?.data?.message || "Failed to toggle shop status.";
      toast.error(message);
      console.error("Error toggling shop status:", error);
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-b from-emerald-50 via-white to-white pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-8">
          <div className="space-y-6">
            <div className="h-20 bg-gray-200 rounded-lg animate-pulse"></div>
            <div className="h-24 bg-gray-200 rounded-lg animate-pulse"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-lg animate-pulse"></div>
              ))}
            </div>
          </div>
        </div>
        <BottomNavbar />
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="min-h-screen bg-linear-to-b from-emerald-50 via-white to-white flex items-center justify-center pb-24">
        <div className="text-center">
          <p className="text-gray-600 mb-4">No shop found. Please create a shop first.</p>
          <a href="/seller/create-shop" className="text-green-600 hover:text-green-700 font-medium">
            Create Shop
          </a>
        </div>
        <BottomNavbar />
      </div>
    );
  }

  // Calculate statistics
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const todayOrders = orders.filter((order) => new Date(order.createdAt) >= todayStart);
  const todaySales = todayOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
  const pendingOrders = orders.filter((order) =>
    ["placed", "accepted", "preparing", "ready_for_rider", "rider_assigned", "picked_up"].includes(
      order.status
    )
  );

  // Icons for stat cards
  const statIcons = {
    sales: <TrendingUp size={20} className="text-white" />,
    orders: <ShoppingBag size={20} className="text-white" />,
    pending: <Clock size={20} className="text-white" />,
    products: <Package size={20} className="text-white" />,
  };

  return (
    <div className="min-h-screen bg-linear-to-l from-emerald-50 via-white to-white pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-8">
        {/* Header */}
        <DashboardHeader
          isOpen={shop?.isOpen || false}
          onToggleOpen={handleToggleOpenStatus}
          loading={loading}
          shop={shop}
        />

        {/* Shop Snapshot */}
        {shop && (
          <ShopSnapshot
            shop={shop}
            onShopUpdate={setShop}
            loading={loading}
          />
        )}

        {/* Business Statistics */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4 text-gray-900">Today's Business</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard
              title="Today's Sales"
              value={`₹${todaySales.toLocaleString("en-IN")}`}
              subtext={todayOrders.length === 0 ? "No sales yet" : `${todayOrders.length} orders`}
              icon={statIcons.sales}
              color="bg-green-100"
              loading={ordersLoading}
            />
            <StatsCard
              title="Today's Orders"
              value={todayOrders.length}
              subtext={todayOrders.length === 0 ? "Check back later" : "Orders today"}
              icon={statIcons.orders}
              color="bg-blue-100"
              loading={ordersLoading}
            />
            <StatsCard
              title="Pending Orders"
              value={pendingOrders.length}
              subtext={pendingOrders.length === 0 ? "All caught up" : "Need attention"}
              icon={statIcons.pending}
              color="bg-amber-100"
              loading={ordersLoading}
            />
            <StatsCard
              title="Active Products"
              value={products.filter((p) => p.isAvailable).length}
              subtext={`of ${products.length} total`}
              icon={statIcons.products}
              color="bg-purple-100"
              loading={false}
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <QuickActions />
        </div>

        {/* Orders Attention Section */}
        {pendingOrders.length > 0 && <OrdersNeedAttention pendingCount={pendingOrders.length} />}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Recent Orders - Takes 2 columns on desktop */}
          <div className="lg:col-span-2">
            <RecentOrders
              orders={orders}
              loading={ordersLoading}
            />
          </div>

          {/* Shop Status - Takes 1 column on desktop */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold mb-6">Shop Status</h2>

            <div className="space-y-6">
              {/* Open/Close Status */}
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className={`w-3 h-3 rounded-full ${shop?.isOpen ? "bg-green-500" : "bg-red-500"}`}
                  ></div>
                  <span className={`font-medium ${shop?.isOpen ? "text-green-600" : "text-red-600"}`}>
                    {shop?.isOpen ? "Currently Open" : "Currently Closed"}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  {shop?.isOpen
                    ? "Customers can place new orders."
                    : "Customers cannot place new orders."}
                </p>
              </div>

              {/* Approval Status */}
              <div className="border-t pt-4">
                <p className="text-sm font-medium text-gray-900 mb-2">Approval Status</p>
                <div className="inline-block">
                  <span
                    className={`text-xs px-3 py-1 rounded-full font-medium ${
                      shop?.status === "approved"
                        ? "bg-green-100 text-green-700"
                        : shop?.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                    }`}
                  >
                    {shop?.status?.charAt(0).toUpperCase() + shop?.status?.slice(1) || "Pending"}
                  </span>
                </div>
              </div>

              {/* Shop Created Date */}
              <div className="border-t pt-4">
                <p className="text-xs text-gray-500">
                  Created on {new Date(shop?.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <BottomNavbar />
    </div>
  );
};

export default Dashboard;
