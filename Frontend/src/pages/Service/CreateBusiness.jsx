import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useServices } from "../../context/ServiceContext";
import toast from "react-hot-toast";

const CreateBusiness = () => {

  const navigate = useNavigate();

  const { createBusiness } = useServices();

  const [business, setBusiness] = useState({

    businessName: "",

    category: "",

    address: "",

    image: "",

  });

  const handleChange = (e) => {

    setBusiness({

      ...business,

      [e.target.name]: e.target.value,

    });

  };

  const handleSubmit = (e) => {

    e.preventDefault();

    const owner =
      localStorage.getItem("serviceOwner");

    createBusiness({

      ...business,

      owner,

    });
    localStorage.setItem(
  "serviceBusinessCreated",
  "true"
);

    toast.success("Business Created");

    navigate("/service/dashboard");

  };

  return (

    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-slate-100">

      <div className="max-w-3xl mx-auto p-8">

        <h1 className="text-4xl font-bold mb-8">

          Create Your Business

        </h1>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl shadow-lg p-8 space-y-6"
        >

          <input
            name="businessName"
            placeholder="Business Name"
            value={business.businessName}
            onChange={handleChange}
            className="w-full border rounded-xl p-3"
          />

          <select
            name="category"
            value={business.category}
            onChange={handleChange}
            className="w-full border rounded-xl p-3"
          >

            <option value="">Choose Category</option>

            <option>Electrician</option>

            <option>Plumber</option>

            <option>Salon</option>

            <option>Cleaning</option>

            <option>Painter</option>

            <option>Carpenter</option>

          </select>

          <input
            name="address"
            placeholder="Business Address"
            value={business.address}
            onChange={handleChange}
            className="w-full border rounded-xl p-3"
          />

          <input
            name="image"
            placeholder="Business Image URL"
            value={business.image}
            onChange={handleChange}
            className="w-full border rounded-xl p-3"
          />

          <button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-2xl cursor-pointer"
          >

            Create Business

          </button>

        </form>

      </div>

    </div>

  );

};

export default CreateBusiness;