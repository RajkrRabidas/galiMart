import { useState } from "react";
import BottomNavbar from "../../components/BottomNavbar/BottomNavbar";
import {
  Moon,
  Globe,
  Shield,
  FileText,
  Info,
  Lock,
} from "lucide-react";
import toast from "react-hot-toast";

const Settings = () => {

  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-slate-100">

      <div className="max-w-4xl mx-auto p-6 pb-24">

        <h1 className="text-4xl font-bold mb-8">
          Settings
        </h1>

        <div className="bg-white rounded-3xl shadow-lg overflow-hidden">

          <button
            onClick={() => {
              setDarkMode(!darkMode);
              toast.success(
                !darkMode
                  ? "Dark Mode Enabled"
                  : "Light Mode Enabled"
              );
            }}
            className="w-full flex justify-between items-center p-5 hover:bg-gray-50 cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <Moon className="text-emerald-600"/>
              <span>Dark Mode</span>
            </div>

            <input
              type="checkbox"
              checked={darkMode}
              readOnly
            />
          </button>

          <button
            onClick={() => toast("Language feature coming soon")}
            className="w-full flex justify-between items-center p-5 hover:bg-gray-50 cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <Globe className="text-emerald-600"/>
              <span>Language</span>
            </div>

            English
          </button>

          <button
            onClick={() => toast("Change Password coming soon")}
            className="w-full flex justify-between items-center p-5 hover:bg-gray-50 cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <Lock className="text-emerald-600"/>
              <span>Change Password</span>
            </div>
          </button>

          <button
            onClick={() => toast("Privacy Policy")}
            className="w-full flex justify-between items-center p-5 hover:bg-gray-50 cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <Shield className="text-emerald-600"/>
              <span>Privacy Policy</span>
            </div>
          </button>

          <button
            onClick={() => toast("Terms & Conditions")}
            className="w-full flex justify-between items-center p-5 hover:bg-gray-50"
          >
            <div className="flex items-center gap-4">
              <FileText className="text-emerald-600"/>
              <span>Terms & Conditions</span>
            </div>
          </button>

          <button
            onClick={() =>
              toast("GaliMart v1.0.0")
            }
            className="w-full flex justify-between items-center p-5 hover:bg-gray-50"
          >
            <div className="flex items-center gap-4">
              <Info className="text-emerald-600"/>
              <span>About App</span>
            </div>
          </button>

        </div>

      </div>

      <BottomNavbar/>

    </div>
  );
};

export default Settings;