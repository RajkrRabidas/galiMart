import { Routes, Route } from "react-router-dom";

import { ProtectedRoute, PublicRoute } from "./ProtectedRoute";
import Register from "../pages/Auth/Register";
import VerifyOtp from "../pages/Auth/VerifyOtp";
import Login from "../pages/Auth/Login";
import Home from "../pages/Customer/Home";
import ProductDetails from "../pages/Customer/ProductDetails";
import Cart from "../pages/Customer/Cart";
import Checkout from "../pages/Customer/Checkout";
import CustomerOrders from "../pages/Customer/Orders";
import Profile from "../pages/Customer/Profile";
import Addresses from "../pages/Customer/Addresses";
import Settings from "../pages/Customer/Settings";
import Help from "../pages/Customer/Help";
import Notifications from "../pages/Customer/Notifications";
import TrackOrder from "../pages/Customer/TrackOrder";
import Dashboard from "../pages/Shopkeeper/Dashboard";
import Products from "../pages/Shopkeeper/Products";
import AddProduct from "../pages/Shopkeeper/AddProduct";
import ShopDetails from "../pages/Customer/ShopDetails";
import CreateShop from "../pages/Shopkeeper/CreateShop";
import SellerOrders from "../pages/Shopkeeper/Orders";
import EditProduct from "../pages/Shopkeeper/EditProduct";
import CreateBusiness from "../pages/Service/CreateBusiness";
import AddService from "../pages/Service/AddService";
import ServiceDashboard from "../pages/Service/Dashboard";
import Services from "../pages/Service/Services";
import ServiceProfile from "../pages/Service/Profile";
import ServiceDetails from "../pages/Customer/ServiceDetails";
import ServiceBookings from "../pages/Service/Bookings";
import MyServiceBookings from "../pages/Customer/MyServiceBookings";
import SellerProfile from "../pages/Shopkeeper/Profile";
import DeliveryDashboard from "../pages/Delivery/Dashboard";
import DeliveryOrders from "../pages/Delivery/Orders";
import DeliveryProfile from "../pages/Delivery/Profile";
import CreateDeliveryProfile from "../pages/Delivery/CreateProfile";
import PaymentSuccess from "../pages/Customer/paymentSuccess";
import NotFound from "../pages/404";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<PublicRoute><Register /></PublicRoute>} />
      <Route path="/verify-otp" element={<PublicRoute><VerifyOtp /></PublicRoute>} />
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />

      <Route path="/home" element={<ProtectedRoute allowedRoles={["user"]}><Home /></ProtectedRoute>} />
      <Route path="/product/:id" element={<ProtectedRoute allowedRoles={["user"]}><ProductDetails /></ProtectedRoute>} />
      <Route path="/cart" element={<ProtectedRoute allowedRoles={["user"]}><Cart /></ProtectedRoute>} />
      <Route path="/checkout" element={<ProtectedRoute allowedRoles={["user"]}><Checkout /></ProtectedRoute>} />
      <Route path="/payment-success/:paymentId" element={<ProtectedRoute allowedRoles={["user"]}><PaymentSuccess /></ProtectedRoute>} />
      <Route path="/orders" element={<ProtectedRoute allowedRoles={["user"]}><CustomerOrders /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute allowedRoles={["user"]}><Profile /></ProtectedRoute>} />
      <Route path="/addresses" element={<ProtectedRoute allowedRoles={["user"]}><Addresses /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute allowedRoles={["user"]}><Settings /></ProtectedRoute>} />
      <Route path="/help" element={<ProtectedRoute allowedRoles={["user"]}><Help /></ProtectedRoute>} />
      <Route path="/notifications" element={<ProtectedRoute allowedRoles={["user"]}><Notifications /></ProtectedRoute>} />
      <Route path="/track-order/:id" element={<ProtectedRoute allowedRoles={["user"]}><TrackOrder /></ProtectedRoute>} />
      <Route path="/my-service-bookings" element={<ProtectedRoute allowedRoles={["user"]}><MyServiceBookings /></ProtectedRoute>} />

      <Route path="/seller/dashboard" element={<ProtectedRoute allowedRoles={["seller"]}><Dashboard /></ProtectedRoute>} />
      <Route path="/seller/products" element={<ProtectedRoute allowedRoles={["seller"]}><Products /></ProtectedRoute>} />
      <Route path="/seller/add-product" element={<ProtectedRoute allowedRoles={["seller"]}><AddProduct /></ProtectedRoute>} />
      <Route path="/shop/:id" element={<ProtectedRoute allowedRoles={["user", "seller"]}><ShopDetails /></ProtectedRoute>} />
      <Route path="/seller/create-shop" element={<ProtectedRoute allowedRoles={["seller"]}><CreateShop /></ProtectedRoute>} />
      <Route path="/seller/orders" element={<ProtectedRoute allowedRoles={["seller"]}><SellerOrders /></ProtectedRoute>} />
      <Route path="/seller/edit-product/:id" element={<ProtectedRoute allowedRoles={["seller"]}><EditProduct /></ProtectedRoute>} />
      <Route path="/seller/profile" element={<ProtectedRoute allowedRoles={["seller"]}><SellerProfile /></ProtectedRoute>} />

      <Route path="/service/create-business" element={<ProtectedRoute allowedRoles={["service_provider"]}><CreateBusiness /></ProtectedRoute>} />
      <Route path="/service/add-service" element={<ProtectedRoute allowedRoles={["service_provider"]}><AddService /></ProtectedRoute>} />
      <Route path="/service/dashboard" element={<ProtectedRoute allowedRoles={["service_provider"]}><ServiceDashboard /></ProtectedRoute>} />
      <Route path="/service/services" element={<ProtectedRoute allowedRoles={["service_provider"]}><Services /></ProtectedRoute>} />
      <Route path="/service/profile" element={<ProtectedRoute allowedRoles={["service_provider"]}><ServiceProfile /></ProtectedRoute>} />
      <Route path="/service/:id" element={<ProtectedRoute allowedRoles={["user", "service_provider"]}><ServiceDetails /></ProtectedRoute>} />
      <Route path="/service/bookings" element={<ProtectedRoute allowedRoles={["service_provider"]}><ServiceBookings /></ProtectedRoute>} />

      <Route path="/delivery/dashboard" element={<ProtectedRoute allowedRoles={["delivery"]}><DeliveryDashboard /></ProtectedRoute>} />
      <Route path="/delivery/orders" element={<ProtectedRoute allowedRoles={["delivery"]}><DeliveryOrders /></ProtectedRoute>} />
      <Route path="/delivery/profile" element={<ProtectedRoute allowedRoles={["delivery"]}><DeliveryProfile /></ProtectedRoute>} />
      <Route path="/delivery/create-profile" element={<ProtectedRoute allowedRoles={["delivery"]}><CreateDeliveryProfile /></ProtectedRoute>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;