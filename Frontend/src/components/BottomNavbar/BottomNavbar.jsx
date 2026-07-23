import {
  House,
  Package,
  ShoppingCart,
  User,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";

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
    <div
      className="
        fixed
        bottom-5
        left-1/2
        -translate-x-1/2
        w-[94%]
        max-w-md
        z-50
      "
    >
      <div
        className="
          bg-white/90
          backdrop-blur-2xl
          rounded-2xl
          shadow-[0_12px_30px_rgba(15,23,42,0.14)]
          border
          border-white/60
          px-2
          py-1.5
          flex
          justify-between
          items-center
        "
      >
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.name}
              to={item.path}
              className="flex-1"
            >
              {({ isActive }) => (
  <motion.div
    className="relative flex flex-col items-center justify-center py-2"
  >
    {isActive && (
      <motion.div
        initial={{ opacity: 0, scale: 0.88 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.88 }}
        transition={{
          duration: 0.16,
          ease: "easeOut",
        }}
        className="
          absolute
          inset-0
          rounded-xl
          bg-emerald-600
        "
      />
    )}

    <motion.div
      className={`relative z-10 flex flex-col items-center ${
        isActive
          ? "text-white"
          : "text-gray-500"
      }`}
      animate={{
        scale: isActive ? 1.12 : 1,
      }}
    >
      <Icon size={22}/>
      <span className="text-xs mt-1">
        {item.name}
      </span>
    </motion.div>
  </motion.div>
)}
            </NavLink>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavbar;
