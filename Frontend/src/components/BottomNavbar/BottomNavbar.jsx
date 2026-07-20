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
          rounded-[30px]
          shadow-[0_20px_50px_rgba(0,0,0,0.12)]
          border
          border-white/60
          px-3
          py-2
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
                  whileTap={{ scale: 0.92 }}
                  whileHover={{ y: -2 }}
                  className={`
                    relative
                    flex
                    flex-col
                    items-center
                    justify-center
                    py-2
                    rounded-2xl
                    transition-all
                    duration-300
                    ${
                      isActive
                        ? "bg-emerald-600 text-white shadow-lg"
                        : "text-slate-500 hover:text-emerald-600"
                    }
                  `}
                >
                  <motion.div
                    animate={{
                      scale: isActive ? 1.15 : 1,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 350,
                    }}
                  >
                    <Icon size={22} />
                  </motion.div>

                  <span className="text-[11px] font-medium mt-1">
                    {item.name}
                  </span>

                  {isActive && (
                    <motion.div
                      layoutId="activeDot"
                      className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-white"
                    />
                  )}
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