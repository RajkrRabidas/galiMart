import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../../api/authApi";

const Login = () => {

  const navigate = useNavigate();

  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("user");
  const [error, setError] = useState("");

  
  const handleSubmit = async (e) => {
  e.preventDefault();

  if (phone.trim() === "") {
    setError("Phone number is required.");
    return;
  }

  if (phone.length < 10) {
    setError("Phone number must be at least 10 digits.");
    return;
  }

  try {
    setError("");

    await loginUser({
      phone,
      role,
    });

    navigate("/verify-otp", {
      state: {
        phone,
        isLogin: true,
      },
    });

  } catch (error) {
    setError(
      error.response?.data?.message ||
      "Failed to send OTP"
    );
  }
};

  return (

    <div className="min-h-screen bg-linear-to-br from-emerald-50 via-white to-gray-100 flex items-center justify-center px-4">

      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8">

        <div className="text-center">

          <h1 className="text-5xl font-extrabold text-emerald-600">

            GaliMart

          </h1>

          <p className="text-gray-500 mt-3">

            Welcome Back

          </p>

        </div>

        <div className="mt-8">

          <h2 className="text-3xl font-bold">

            Login

          </h2>

          <p className="text-gray-500 mt-2">

            Continue with your account

          </p>

        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 mt-8"
        >

          <div>

            <label className="block text-sm font-semibold mb-2">

              Phone Number

            </label>

            <input

              type="tel"

              value={phone}

              onChange={(e) =>
                setPhone(e.target.value)
              }

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

          <div>

            <label className="block text-sm font-semibold mb-2">

              Select Role

            </label>

            <select

              value={role}

              onChange={(e) =>
                setRole(e.target.value)
              }

              className="w-full rounded-xl border border-gray-300 px-4 py-3"

            >

              <option value="user">

                Customer

              </option>

              <option value="seller">

                Shopkeeper

              </option>

              <option value="delivery">

                Delivery Partner

              </option>

              <option value="service_provider">

                Service Provider

              </option>

            </select>

          </div>

          <button

            type="submit"

            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-semibold"

          >

            Login

          </button>

        </form>

        <div className="text-center mt-6">

          <p className="text-gray-600">

            Don't have an account?

            <Link

              to="/"

              className="ml-2 text-emerald-600 font-semibold hover:underline"

            >

              Register

            </Link>

          </p>

        </div>

      </div>

    </div>

  );

};

export default Login;