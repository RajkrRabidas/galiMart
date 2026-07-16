import BottomNavbar from "../../components/BottomNavbar/BottomNavbar";
import {
  Phone,
  Mail,
  MessageCircle,
  CircleHelp,
} from "lucide-react";
import toast from "react-hot-toast";

const Help = () => {

  return (

    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-slate-100">

      <div className="max-w-4xl mx-auto p-6 pb-24">

        <h1 className="text-4xl font-bold mb-8">
          Help & Support
        </h1>

        <div className="space-y-5">

          <button
            onClick={() =>
              window.open("tel:+919876543210")
            }
            className="bg-white rounded-2xl shadow-lg p-5 w-full flex items-center gap-5"
          >
            <Phone className="text-green-600"/>

            Call Support

          </button>

          <button
            onClick={() =>
              window.open("mailto:support@galimart.com")
            }
            className="bg-white rounded-2xl shadow-lg p-5 w-full flex items-center gap-5"
          >
            <Mail className="text-blue-600"/>

            Email Support

          </button>

          <button
            onClick={() =>
              toast("Live Chat Coming Soon")
            }
            className="bg-white rounded-2xl shadow-lg p-5 w-full flex items-center gap-5"
          >
            <MessageCircle className="text-purple-600"/>

            Live Chat

          </button>

          <button
            onClick={() =>
              toast("FAQ Coming Soon")
            }
            className="bg-white rounded-2xl shadow-lg p-5 w-full flex items-center gap-5"
          >
            <CircleHelp className="text-orange-600"/>

            Frequently Asked Questions

          </button>

        </div>

      </div>

      <BottomNavbar/>

    </div>
  );

};

export default Help;