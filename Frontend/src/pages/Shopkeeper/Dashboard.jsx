import SalesChart from "../../components/Shopkeeper/Dashboard/SalesChart";
import RecentOrders from "../../components/Shopkeeper/Dashboard/RecentOrders";
import QuickActions from "../../components/Shopkeeper/Dashboard/QuickActions";
import Analytics from "./Analytics";
import BottomNavbar from "../../components/Shopkeeper/BottomNavbar";
import CreateShop from "../Shopkeeper/CreateShop";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axios";
import { Save, SquarePen } from "lucide-react/dist/cjs/lucide-react";

let sellerTab = "menu" | "add-item";

const Dashboard = () => {
  const [shop, setShop] = useState(null);

  const [loading, setLoading] = useState(true);

  // UI / form state must be declared unconditionally to preserve hooks order
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [tab, setTab] = useState("menu");

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

  useEffect(() => {
    fetchMyShop();
  }, []);

  // auth + keep form state in sync when shop data arrives
  const { user } = useAuth();
  const isSeller = user?.role === "seller";

  // keep form state in sync when shop data arrives
  useEffect(() => {
    if (shop) {
      setName(shop.name || "");
      setDescription(shop.description || "");
      setIsOpen(!!shop.isOpen);
    }
  }, [shop]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">Loading your Shop...</p>
      </div>
    );
  }

  if (!shop) {
    return <CreateShop />;
  }

  const toggleOpenStatus = async () => {
    if (shop?.status !== "approved") {
      toast.error("Your shop must be approved before it can be opened.");
      return;
    }

    try {
      const nextStatus = !isOpen;
      const { data } = await api.put(`/shops/update-shop-status/${shop._id}`, {
        status: nextStatus,
      });

      const updatedStatus = data?.data?.isOpen ?? nextStatus;
      setIsOpen(updatedStatus);
      toast.success(`Shop is now ${updatedStatus ? "Open" : "Closed"}`);
    } catch (error) {
      const message =
        error?.response?.data?.message || "Failed to toggle shop status.";
      toast.error(message);
      console.error("Error toggling shop status:", error);
    }
  };

  const saveChanges = async () => {
    try {
      setLoading(true);
      const { data } = await api.put(`/shops/edit/${shop._id}`, {
        name,
        description,
      });
      setShop(data.shop);
      setEditMode(false);
      toast.success("Changes saved successfully.");
    } catch (error) {
      console.error("Error saving changes:", error);
      toast.error("Failed to save changes.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-xl bg-white shadow-sm overflow-hidden">
      {shop.image && (
        <img src={shop.image} alt="Shop" className="w-full h-64 object-cover" />
      )}

      <div className="p-5 space-y-4">
        {isSeller && (
          <div className="flex items-start justify-between">
            <div>
              {editMode ? (
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <h2 className="text-xl font-semibold">{shop.name}</h2>
              )}

              <div className="mt-1 flex items-center gap-2 text-sm text-gray-500">
                {shop.autoLocation?.formattedAddress || "Address not available"}
              </div>
            </div>

            <button
              onClick={() => setEditMode(!editMode)}
              className="cursor-pointer"
            >
              <SquarePen size={18} />
            </button>
          </div>
        )}

        {editMode ? (
          <div className="space-y-4">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="4"
            />
          </div>
        ) : (
          <p className="text-gray-700">
            {shop.description || "No description added"}
          </p>
        )}

        <div className="flex items-center justify-between pt-3 border-t">
          <span
            className={`text-sm font-medium ${isOpen ? "text-green-500" : "text-red-500"}`}
          >
            {isOpen ? "Shop is Open" : "Shop is Close"}
          </span>

          <div>
            {editMode && (
              <button
                onClick={saveChanges}
                disabled={loading}
                className="flex items-center gap-1 my-2 rounded-lg bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700"
              >
                <Save size={14} />
                Save Changes
              </button>
            )}

            {isSeller && (
              <button
                onClick={toggleOpenStatus}
                className={`rounded-lg px-4 py-1.5 text-sm text-white ${isOpen ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}`}
              >
                {isOpen ? "Close" : "Open"}
              </button>
            )}
          </div>
        </div>

        <p className="text-xs text-gray-400">created on {new Date(shop.createdAt).toLocaleDateString()}</p>
      </div>

    <div className="rounded-xl bg-white shadow-sm">
        <div className="flex border-b-">
            {[
                {key: "menu", label: "Menu"},
                {key: "add-item", label: "Add Item"}
            ].map(tabItem => (
                <button
                    key={tabItem.key}
                    onClick={() => setTab(tabItem.key)}
                    className={`flex-1 px-4 py-3 text-sm font-medium transition ${tab === tabItem.key?"border-b-2 border-red-500 text-red-500": "text-gray-500 hover:text-gray-700"}`}
                >
                    {tabItem.label}
                </button>
            ))}
        </div>
    </div>
        
        <div>
            {tab === "menu" && <p>Menu content goes here</p>}
            {tab === "add-item" && <p>Add Item content goes here</p>}
        </div>
      <BottomNavbar />
    </div>
  );
};

export default Dashboard;
