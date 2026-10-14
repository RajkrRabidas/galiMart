import { useEffect } from "react";
import { App as CapacitorApp } from "@capacitor/app";
import { Capacitor } from "@capacitor/core";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const HOME_ROUTES = {
  admin: "/admin/dashboard",
  seller: "/seller/dashboard",
  service_provider: "/service/dashboard",
  rider: "/delivery/dashboard",
  delivery: "/delivery/dashboard",
  user: "/home",
};

const ROOT_ROUTES = new Set([
  "/",
  "/home",
  "/seller/dashboard",
  "/delivery/dashboard",
  "/service/dashboard",
  "/admin/dashboard",
]);

const CapacitorBackButton = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return undefined;

    let listener;
    let isUnmounted = false;

    CapacitorApp.addListener("backButton", ({ canGoBack }) => {
      if (canGoBack) {
        navigate(-1);
        return;
      }

      if (location.pathname === "/verify-otp") {
        navigate("/login", { replace: true });
        return;
      }

      if (location.pathname === "/login") {
        navigate("/", { replace: true });
        return;
      }

      const homeRoute = HOME_ROUTES[user?.role];
      if (!ROOT_ROUTES.has(location.pathname) && homeRoute) {
        navigate(homeRoute, { replace: true });
        return;
      }

      CapacitorApp.minimizeApp();
    }).then((handle) => {
      if (isUnmounted) {
        handle.remove();
      } else {
        listener = handle;
      }
    }).catch((error) => {
      console.error("Unable to register Android back-button handler:", error);
    });

    return () => {
      isUnmounted = true;
      listener?.remove();
    };
  }, [location.pathname, navigate, user?.role]);

  return null;
};

export default CapacitorBackButton;
