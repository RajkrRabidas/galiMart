import { registerUser } from "../../api/authApi";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useState } from "react";


const Register = () => {

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("user");
  const [error, setError] = useState("");
  

  const handleSubmit = async (e) => {
  e.preventDefault();

  setError("");

  if (phone.trim() === "") {
    setError("Phone number is required.");
    return;
  }

  if (phone.length < 10) {
    setError("Phone number must be at least 10 digits.");
    return;
  }

  try {
  setLoading(true);

  localStorage.setItem("role", role);
  if (role === "seller") {
  localStorage.setItem("shopOwner", "shop_" + phone);
}

  const response = await registerUser({
    phone,
    role,
  });

  console.log(response);

  alert(response.message);

  navigate("/verify-otp", {
    state: {
      phone,
    },
  });

} catch (err) {

  console.error(err);

  setError(
    err.response?.data?.message ||
    "Something went wrong."
  );

} finally {

  setLoading(false);

}
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-gray-100 flex items-center justify-center px-4">

      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8">

        {/* Logo */}

        <div className="text-center">

          <h1 className="text-5xl font-extrabold text-emerald-600">
            GaliMart
          </h1>

          <p className="text-gray-500 mt-3">
            Your Local Marketplace
          </p>

        </div>

        {/* Heading */}

        <div className="mt-8">

          <h2 className="text-3xl font-bold text-gray-800">
            Create Account
          </h2>

          <p className="text-gray-500 mt-2">
            Register to continue
          </p>

        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 mt-8"
        >

          {/* Phone */}

          <div>

            <label className="block text-sm font-semibold mb-2">

              Phone Number

            </label>

            <input

              type="tel"

              value={phone}

              onChange={(e) => setPhone(e.target.value)}

              placeholder="+91 9876543210"

              className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none"
              

            />
            {
  error && (
    <p className="text-red-500 text-sm mt-2">
      {error}
    </p>
  )
}

          </div>

          {/* Role */}

          <div>

            <label className="block text-sm font-semibold mb-2">

              Select Role

            </label>

            <select

              value={role}

              onChange={(e) => setRole(e.target.value)}

              className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none"

            >

              <option value="customer">
                Customer
              </option>

              <option value="seller">
                Shopkeeper
              </option>

              <option value="delivery_partner">
                Delivery Partner
              </option>

              <option value="service_provider">
                Service Provider
              </option>

            </select>

          </div>

          <button

            type="submit"

            className="w-full bg-emerald-600 hover:bg-emerald-700 hover:scale-[1.02] active:scale-95 transition-all text-white py-3 rounded-xl font-semibold"

          >

            {loading ? "Sending OTP..." : "Continue"}

          </button>

        </form>

        <div className="text-center mt-6">

          <p className="text-gray-600">

            Already have an account?

            <Link

              to="/login"

              className="text-emerald-600 ml-2 font-semibold hover:underline"

            >

              Login

            </Link>

          </p>

        </div>

      </div>

    </div>
  );
};

export default Register;