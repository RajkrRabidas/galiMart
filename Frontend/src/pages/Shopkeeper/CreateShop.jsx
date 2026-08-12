import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Store } from "lucide-react";
import toast from "react-hot-toast";
import { useShops } from "../../context/ShopContext";

const CreateShop = () => {
  const navigate = useNavigate();

  const { createShop, getMyShop } = useShops();

  const [shop, setShop] = useState({
    name: "",
    description: "",
    phone: "",
    formattedAddress: "",
    aadharNumber: "",
  });

  const [image, setImage] = useState(null);
  const [aadharImage, setAadharImage] = useState(null);

  const [latitude, setLatitude] = useState(null);

  const [longitude, setLongitude] = useState(null);

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setShop({
      ...shop,
      [e.target.name]: e.target.value,
    });
  };
  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleAadharChange = (e) => {
    setAadharImage(e.target.files[0]);
  };
  const getCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude);

        setLongitude(position.coords.longitude);

        toast.success("Location fetched");
      },

      () => {
        toast.error("Please allow location access");
      },
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !shop.name ||
      !shop.phone ||
      !shop.formattedAddress ||
      !shop.aadharNumber
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    if (!latitude || !longitude) {
      toast.error("Please fetch your current location");
      return;
    }

    if (!image) {
      toast.error("Please upload a shop image");

      return;
    }

    if (!aadharImage) {
      toast.error("Please upload your Aadhaar image");

      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("name", shop.name);

      formData.append("description", shop.description);

      formData.append("phone", shop.phone);

      formData.append("formattedAddress", shop.formattedAddress);

      formData.append("aadharNumber", shop.aadharNumber);

      formData.append("latitude", latitude);

      formData.append("longitude", longitude);

      formData.append("image", image);

      formData.append("aadharImage", aadharImage);

      await createShop(formData);

      toast.success("Shop Created Successfully");

      navigate("/seller/dashboard");
    } catch (error) {
      console.log(error);

      toast.error(error?.response?.data?.message || "Failed to create shop");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-slate-100 flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-xl">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
            <Store size={40} className="text-emerald-600" />
          </div>

          <h1 className="text-4xl font-bold mt-5">Create Your Shop</h1>

          <p className="text-gray-500 mt-2">
            Complete your shop profile to start selling.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="font-semibold">Shop Name</label>

            <input
              type="text"
              name="name"
              value={shop.name}
              onChange={handleChange}
              placeholder="Fresh Mart"
              className="w-full mt-2 border rounded-xl p-3 outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="font-semibold">Description</label>

            <textarea
              rows={3}
              name="description"
              value={shop.description}
              onChange={handleChange}
              placeholder="Describe your shop..."
              className="w-full mt-2 border rounded-xl p-3 outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div>
            <label className="font-semibold">Phone Number</label>

            <input
              type="number"
              name="phone"
              value={shop.phone}
              onChange={handleChange}
              placeholder="9876543210"
              className="w-full mt-2 border rounded-xl p-3 outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="font-semibold">Shop Image</label>

            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full mt-2"
            />
          </div>

          <div>
            <label className="font-semibold">Aadhaar Image</label>

            <input
              type="file"
              accept="image/*"
              onChange={handleAadharChange}
              className="w-full mt-2"
            />
          </div>

          <div>
            <label className="font-semibold">Aadhaar Number</label>

            <input
              type="text"
              name="aadharNumber"
              value={shop.aadharNumber}
              onChange={handleChange}
              placeholder="123412341234"
              className="w-full mt-2 border rounded-xl p-3 outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="font-semibold">Shop Address</label>

            <textarea
              rows={4}
              name="formattedAddress"
              value={shop.formattedAddress}
              onChange={handleChange}
              placeholder="Enter your shop address"
              className="w-full mt-2 border rounded-xl p-3 outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <button
            type="button"
            onClick={getCurrentLocation}
            className="w-full bg-blue-500 text-white py-3 rounded-xl"
          >
            Use Current Location
          </button>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-2xl font-semibold disabled:opacity-60"
          >
            {loading ? "Creating..." : "Create Shop"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateShop;
