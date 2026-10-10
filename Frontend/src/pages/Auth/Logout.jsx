import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { useAuth } from "../../context/AuthContext";

const Logout = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    const signOut = async () => {
      try {
        await logout();
        toast.success("Logged out successfully");
      } catch {
        toast.error("Could not log out right now");
      } finally {
        navigate("/login", { replace: true });
      }
    };

    signOut();
  }, [logout, navigate]);

  return <div className="p-6 text-center text-gray-600">Signing you out...</div>;
};

export default Logout;