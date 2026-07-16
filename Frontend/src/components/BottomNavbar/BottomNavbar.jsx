import {
  House,
  ShoppingCart,
  Package,
  User,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const BottomNavbar = () => {
  const navItems = [
    {
      name: "Home",
      icon: House,
      path: "/home",
    },
    {
      name: "Cart",
      icon: ShoppingCart,
      path: "/cart",
    },
    {
      name: "Orders",
      icon: Package,
      path: "/orders",
    },
    {
      name: "Profile",
      icon: User,
      path: "/profile",
    },
  ];

  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-xl rounded-full shadow-2xl w-[95%] max-w-md h-16 flex justify-around items-center z-50">

      {navItems.map((item) => {
        const Icon = item.icon;

        return (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center transition ${
                isActive
                  ? "text-emerald-600"
                  : "text-gray-500 hover:text-emerald-600"
              }`
            }
          >
            <Icon size={22} />

            <span className="text-xs mt-1">
              {item.name}
            </span>
          </NavLink>
        );
      })}
    </div>
  );
};

export default BottomNavbar;