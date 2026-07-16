import { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreateProfile = () => {

  const navigate = useNavigate();

  const phone = localStorage.getItem("deliveryPartner") || "";

  const [form, setForm] = useState({
    name: "",
    vehicleType: "Bike",
    vehicleNumber: "",
    area: "",
  });

  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

  };

  const handleSubmit = (e) => {

    e.preventDefault();

    localStorage.setItem(
      "deliveryProfile",
      JSON.stringify({
        phone,
        ...form,
      })
    );

    navigate("/delivery/dashboard");

  };

  return (

    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-slate-100 flex items-center justify-center">

      <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-lg">

        <h1 className="text-3xl font-bold mb-8">

          Create Delivery Profile

        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          <input
            name="name"
            placeholder="Full Name"
            onChange={handleChange}
            className="w-full border rounded-xl p-3"
            required
          />

          <input
            value={phone}
            disabled
            className="w-full border rounded-xl p-3 bg-gray-100"
          />

          <select
            name="vehicleType"
            onChange={handleChange}
            className="w-full border rounded-xl p-3"
          >

            <option>Bike</option>

            <option>Scooter</option>

            <option>Cycle</option>

          </select>

          <input
            name="vehicleNumber"
            placeholder="Vehicle Number"
            onChange={handleChange}
            className="w-full border rounded-xl p-3"
            required
          />

          <input
            name="area"
            placeholder="Area / City"
            onChange={handleChange}
            className="w-full border rounded-xl p-3"
            required
          />

          <button
            className="w-full bg-emerald-600 text-white py-3 rounded-xl"
          >

            Save & Continue

          </button>

        </form>

      </div>

    </div>

  );

};

export default CreateProfile;