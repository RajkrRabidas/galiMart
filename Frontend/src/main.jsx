import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { OrderProvider } from "./context/OrderContext";
import { NotificationProvider } from "./context/NotificationContext";
import { ShopProvider } from "./context/ShopContext";
import { MarketplaceProvider } from "./context/MarketplaceContext";
import { ServiceProvider } from "./context/ServiceContext";
import { ServiceBookingProvider } from "./context/ServiceBookingContext";
import "leaflet/dist/leaflet.css";

import App from "./App";
import "./App.css";
import "./index.css";

import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthProvider>
      <CartProvider>
        <OrderProvider>
          <NotificationProvider>
            <ShopProvider>
              <MarketplaceProvider>
                <ServiceProvider>
                  <ServiceBookingProvider>
                    <App />
                    <Toaster position="top-right" />
                  </ServiceBookingProvider>
                </ServiceProvider>
              </MarketplaceProvider>
            </ShopProvider>
          </NotificationProvider>
        </OrderProvider>
      </CartProvider>
    </AuthProvider>
  </BrowserRouter>
);