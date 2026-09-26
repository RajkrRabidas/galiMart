import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const pageTitles = {
  "/": "Create Account",
  "/login": "Login",
  "/verify-otp": "Verify OTP",
  "/home": "Home",
  "/cart": "Cart",
  "/checkout": "Checkout",
  "/orders": "My Orders",
  "/profile": "My Profile",
  "/addresses": "My Addresses",
  "/settings": "Settings",
  "/privacy-policy": "Privacy Policy",
  "/help": "Help & Support",
  "/notifications": "Notifications",
  "/my-service-bookings": "My Service Bookings",
  "/seller/dashboard": "Shopkeeper Dashboard",
  "/seller/products": "My Products",
  "/seller/add-product": "Add Product",
  "/seller/create-shop": "Create Shop",
  "/seller/orders": "Shop Orders",
  "/seller/profile": "Shopkeeper Profile",
  "/service/create-business": "Create Business",
  "/service/add-service": "Add Service",
  "/service/dashboard": "Service Dashboard",
  "/service/services": "My Services",
  "/service/profile": "Service Provider Profile",
  "/service/bookings": "Service Bookings",
  "/delivery/dashboard": "Delivery Dashboard",
  "/delivery/orders": "Delivery Orders",
  "/delivery/profile": "Delivery Profile",
  "/delivery/create-profile": "Create Delivery Profile",
  "/admin/dashboard": "Admin Dashboard",
};

const getPageTitle = (pathname) => {
  if (pageTitles[pathname]) return pageTitles[pathname];
  if (pathname.startsWith("/category/")) return "Categories";
  if (pathname.startsWith("/product/")) return "Product Details";
  if (pathname.startsWith("/shop/")) return "Shop Details";
  if (pathname.startsWith("/orders/")) return "Order Details";
  if (pathname.startsWith("/track-order/")) return "Track Order";
  if (pathname.startsWith("/payment-success/")) return "Payment Successful";
  if (pathname.startsWith("/seller/edit-product/")) return "Edit Product";
  if (pathname.startsWith("/service/")) return "Service Details";
  return "Page Not Found";
};

const PageTitle = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    document.title = `${getPageTitle(pathname)} | GaliMart`;
  }, [pathname]);

  return null;
};

export default PageTitle;
