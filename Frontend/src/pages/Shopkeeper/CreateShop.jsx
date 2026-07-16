import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Store } from "lucide-react";
import toast from "react-hot-toast";
import { useShops } from "../../context/ShopContext";

const CreateShop = () => {

  const navigate = useNavigate();

  const { createShop, getMyShop } = useShops();

  const [shop, setShop] = useState({
    shopName: "",
    image: "",
    address: "",
  });

  useEffect(() => {

    const existingShop = getMyShop();

    if (existingShop) {

      navigate("/seller/dashboard");

    }

  }, []);

  const handleChange = (e) => {

    setShop({
      ...shop,
      [e.target.name]: e.target.value,
    });

  };

  const handleSubmit = (e) => {

    e.preventDefault();

    if (
      !shop.shopName ||
      !shop.image ||
      !shop.address
    ) {
      toast.error("Please fill all fields");
      return;
    }

    const owner = localStorage.getItem("shopOwner");

    const success = createShop({
      owner,
      shopName: shop.shopName,
      image: shop.image,
      address: shop.address,
    });

    if (!success) {

      toast.error("Shop already exists");

      navigate("/seller/dashboard");

      return;

    }

    toast.success("Shop Created Successfully");

    navigate("/seller/dashboard");

  };

  return (

    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-slate-100 flex items-center justify-center p-6">

      <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-xl">

        <div className="text-center mb-8">

          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">

            <Store
              size={40}
              className="text-emerald-600"
            />

          </div>

          <h1 className="text-4xl font-bold mt-5">

            Create Your Shop

          </h1>

          <p className="text-gray-500 mt-2">

            Complete your shop profile to start selling.

          </p>

        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >

          <div>

            <label className="font-semibold">

              Shop Name

            </label>

            <input
              type="text"
              name="shopName"
              value={shop.shopName}
              onChange={handleChange}
              placeholder="Fresh Mart"
              className="w-full mt-2 border rounded-xl p-3 outline-none focus:ring-2 focus:ring-emerald-500"
            />

          </div>

          <div>

            <label className="font-semibold">

              Shop Image URL

            </label>

            <input
              type="text"
              name="image"
              value={shop.image}
              onChange={handleChange}
              placeholder="https://..."
              className="w-full mt-2 border rounded-xl p-3 outline-none focus:ring-2 focus:ring-emerald-500"
            />

          </div>

          <div>

            <label className="font-semibold">

              Shop Address

            </label>

            <textarea
              rows={4}
              name="address"
              value={shop.address}
              onChange={handleChange}
              placeholder="Enter your shop address"
              className="w-full mt-2 border rounded-xl p-3 outline-none focus:ring-2 focus:ring-emerald-500"
            />

          </div>

          <button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-2xl font-semibold"
          >

            Create Shop

          </button>

        </form>

      </div>

    </div>

  );

};

export default CreateShop;