import { Routes, Route } from "react-router-dom";

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

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Register />} />
      <Route path="/verify-otp" element={<VerifyOtp />} />
      <Route path="/login" element={<Login />} />
      <Route path="/home" element={<Home />} />
      <Route path="/product/:id" element={<ProductDetails />} />
      <Route path="/cart" element={<Cart/>}/>
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/orders" element={<CustomerOrders />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/addresses" element={<Addresses />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/help" element={<Help />} />
      <Route path="/notifications" element={<Notifications />} />
      <Route path="/track-order/:id" element={<TrackOrder />} />
      <Route path="/seller/dashboard"element={<Dashboard />} />
      <Route path="/seller/products" element={<Products />} />
      <Route path="/seller/add-product" element={<AddProduct />} />
      <Route path="/shop/:id" element={<ShopDetails />} />
      <Route path="/seller/create-shop" element={<CreateShop />} />
      <Route path="/seller/orders" element={<SellerOrders />} />
      <Route path="/seller/edit-product/:id" element={<EditProduct />} />
      <Route path="/service/create-business" element={<CreateBusiness />} />
      <Route path="/service/add-service" element={<AddService />} />
      <Route path="/service/dashboard" element={<ServiceDashboard />} />
      <Route path="/service/services" element={<Services />} />
      <Route path="/service/profile" element={<ServiceProfile />} />
      <Route path="/service/:id" element={<ServiceDetails />}/>
      <Route path="/service/bookings" element={<ServiceBookings />} />
      <Route path="/my-service-bookings" element={<MyServiceBookings />} />
      <Route path="/seller/profile" element={<SellerProfile />} />
      <Route path="/delivery/dashboard" element={<DeliveryDashboard />} />
      <Route path="/delivery/orders" element={<DeliveryOrders />} />
      <Route path="/delivery/profile" element={<DeliveryProfile />} />
      <Route path="/delivery/create-profile" element={<CreateDeliveryProfile />} />


    </Routes>
  );
};

export default AppRoutes;