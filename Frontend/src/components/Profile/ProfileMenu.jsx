import {
  MapPin,
  ShoppingBag,
  Heart,
  Bell,
  Settings,
  LogOut,
  CircleHelp,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import MenuItem from "./MenuItem";

const ProfileMenu = () => {
    const navigate = useNavigate();
  return (
    <div className="bg-white rounded-3xl shadow-lg mt-8 p-3">

      <MenuItem
  icon={<MapPin className="text-emerald-600" />}
  title="Saved Addresses"
  subtitle="Manage delivery addresses"
  onClick={() => navigate("/addresses")}
/>

      <MenuItem
  icon={<ShoppingBag className="text-emerald-600" />}
  title="My Orders"
  subtitle="Track all your orders"
  onClick={() => navigate("/orders")}
/>

      <MenuItem
        icon={<Heart className="text-emerald-600" />}
        title="Wishlist"
        subtitle="Saved favourite products"
      />

      <MenuItem
  icon={<Bell className="text-emerald-600" />}
  title="Notifications"
  subtitle="Offers & order updates"
  onClick={() => navigate("/notifications")}
 />

      <MenuItem
  icon={<Settings className="text-emerald-600" />}
  title="Settings"
  subtitle="App preferences"
  onClick={() => navigate("/settings")}
/>

      <MenuItem
  icon={<CircleHelp className="text-emerald-600" />}
  title="Help & Support"
  subtitle="FAQs & contact us"
  onClick={() => navigate("/help")}
/>

      <MenuItem
  icon={<LogOut className="text-red-500" />}
  title="Logout"
  subtitle="Sign out from your account"
  onClick={() => {
    localStorage.clear();
    toast.success("Logged Out");
    navigate("/");
  }}
/>

    </div>
  );
};

export default ProfileMenu;