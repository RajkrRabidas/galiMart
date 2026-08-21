import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const getDefaultRouteForRole = (role) => {
  switch (role) {
    case "seller":
      return "/seller/dashboard";
    case "service_provider":
      return "/service/dashboard";
    case "rider":
    case "delivery":
      return "/delivery/dashboard";
    case "user":
    default:
      return "/home";
  }
};

export const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, authLoading } = useAuth();
  const location = useLocation();

  if (authLoading) {
    return <div className="flex min-h-screen items-center justify-center text-gray-600">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to={getDefaultRouteForRole(user.role)} replace />;
  }

  return children;
};

export const PublicRoute = ({ children }) => {
  const { user, authLoading } = useAuth();

  if (authLoading) {
    return <div className="flex min-h-screen items-center justify-center text-gray-600">Loading...</div>;
  }

  if (user) {
    return <Navigate to={getDefaultRouteForRole(user.role)} replace />;
  }

  return children;
};
