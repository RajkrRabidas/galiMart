import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useShops } from "../../context/ShopContext";


import OTPInput from "../../components/OTPInput/OTPInput";
import {
  resendOtp,
  verifyOtp,
  verifyLoginOtp,
} from "../../api/authApi";
import { useAuth } from "../../context/AuthContext";

const VerifyOtp = () => {
  const location = useLocation();

  const phone = location.state?.phone || "";

  const [otp, setOtp] = useState([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);
  const navigate = useNavigate();
  const { getMyShop } = useShops();
  const { setUser } = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(30);

  useEffect(() => {
    if (timer === 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const handleSubmit = async (e) => {
  e.preventDefault();

  const otpValue = otp.join("");

  if (otpValue.length !== 6) {
    setError("Please enter all 6 digits.");
    return;
  }

  try {
    setLoading(true);
    setError("");

    const isLogin = location.state?.isLogin;

    let response;

    if (isLogin) {
      response = await verifyLoginOtp({
        phone,
        otp: otpValue,
      });
    } else {
      response = await verifyOtp({
        phone,
        otp: otpValue,
      });
    }

    if (response.user) {
      setUser(response.user);
    }

    const role = response.user?.role;

    if (role === "seller") {

    const shop = await getMyShop();

if (shop) {
    navigate("/seller/dashboard");
} else {
    navigate("/seller/create-shop");
}


    } else if (role === "service_provider") {
      navigate("/service/dashboard");
    } else if (role === "delivery") {
      navigate("/delivery/dashboard");
    } else {
      navigate("/home");
    }
  } catch (error) {

    console.log("FULL ERROR:", error);

    setError(
        error.response?.data?.message ||
        error.message ||
        "Invalid OTP"
    );

} finally {
    setLoading(false);
  }
};
  const handleResend = async () => {
    try {
      setError("");
      await resendOtp({
        phone,
        purpose: location.state?.isLogin ? "login" : "register",
      });
      setTimer(30);
    } catch (error) {
      setError(error.response?.data?.message || "Unable to resend OTP right now.");
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-emerald-50 via-white to-gray-100 flex items-center justify-center px-4">

      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md">

        <div className="text-center">

          <h1 className="text-4xl font-bold text-emerald-600">
            Verify OTP
          </h1>

          <p className="text-gray-500 mt-3">
            Enter the OTP sent to
          </p>

          <p className="font-semibold text-gray-700 mt-1">
            {phone}
          </p>

        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-8"
        >

          <OTPInput
            otp={otp}
            setOtp={setOtp}
          />

          {error && (
            <p className="text-red-500 text-center mt-4">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="mt-8 w-full bg-emerald-600 hover:bg-emerald-700 hover:scale-[1.02] active:scale-95 transition-all duration-300 text-white py-3 rounded-xl font-semibold shadow-lg"
          >
            {loading
              ? "Verifying..."
              : "Verify OTP"}
          </button>

          <p className="text-center text-gray-500 mt-6">
            Didn't receive the OTP?
          </p>

          <button
            type="button"
            onClick={handleResend}
            disabled={timer !== 0}
            className={`w-full mt-2 font-semibold transition ${
              timer === 0
                ? "text-emerald-600 hover:text-emerald-700"
                : "text-gray-400 cursor-not-allowed"
            }`}
          >
            {timer === 0
              ? "Resend OTP"
              : `Resend OTP in ${timer}s`}
          </button>

        </form>

      </div>

    </div>
  );
};

export default VerifyOtp;