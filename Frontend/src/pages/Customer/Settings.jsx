import { useNavigate } from "react-router-dom";
import BottomNavbar from "../../components/BottomNavbar/BottomNavbar";
import { Moon, Sun, Globe, Shield, FileText, Info, Lock } from "lucide-react";
import toast from "react-hot-toast";
import { useTheme } from "../../context/ThemeContext";

const Settings = () => {
  const navigate = useNavigate();

  const { darkMode, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-linear-to-b from-emerald-50 via-white to-slate-100">
      <div className="max-w-4xl mx-auto p-6 pb-24">
        <h1 className="text-4xl font-bold mb-8">Settings</h1>

        <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
          <button
            type="button"
            role="switch"
            aria-checked={darkMode}
            aria-label="Dark mode"
            onClick={() => {
              toggleTheme();
              toast.success(
                darkMode ? "Light Mode Enabled" : "Dark Mode Enabled",
              );
            }}
            className="w-full flex justify-between items-center p-5 hover:bg-gray-50 cursor-pointer"
          >
            <div className="flex items-center gap-4">
              {darkMode ? (
                <Moon className="text-emerald-600" />
              ) : (
                <Sun className="text-emerald-600" />
              )}
              <span>{darkMode ? "Dark Mode" : "Light Mode"}</span>
            </div>

            <span
              aria-hidden="true"
              className={`relative h-6 w-11 rounded-full transition-colors ${darkMode ? "bg-emerald-600" : "bg-slate-300"}`}
            >
              <span
                className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${darkMode ? "translate-x-2" : "translate-x-0.5"}`}
              />
            </span>
          </button>

          <button
            onClick={() => toast("Language feature coming soon")}
            className="w-full flex justify-between items-center p-5 hover:bg-gray-50 cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <Globe className="text-emerald-600" />
              <span>Language</span>
            </div>
            English
          </button>

          <button
            onClick={() => toast("Change Password coming soon")}
            className="w-full flex justify-between items-center p-5 hover:bg-gray-50 cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <Lock className="text-emerald-600" />
              <span>Change Password</span>
            </div>
          </button>

          <button
            onClick={() => navigate("/privacy-policy")}
            className="w-full flex justify-between items-center p-5 hover:bg-gray-50 cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <Shield className="text-emerald-600" />
              <span>Privacy Policy</span>
            </div>
          </button>

          <button
            onClick={() => toast("Terms & Conditions")}
            className="w-full flex justify-between items-center p-5 hover:bg-gray-50"
          >
            <div className="flex items-center gap-4">
              <FileText className="text-emerald-600" />
              <span>Terms & Conditions</span>
            </div>
          </button>

          <button
            onClick={() => toast("GaliMart v1.0.0")}
            className="w-full flex justify-between items-center p-5 hover:bg-gray-50"
          >
            <div className="flex items-center gap-4">
              <Info className="text-emerald-600" />
              <span>About App</span>
            </div>
          </button>
        </div>
      </div>

      <BottomNavbar />
    </div>
  );
};

export default Settings;
