import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ImagePlus } from "lucide-react";
import toast from "react-hot-toast";
import { useShops } from "../../context/ShopContext";
import BottomNavbar from "../../components/Shopkeeper/BottomNavbar";
import { addMenuItem } from "../../api/menuApi";

const AddProduct = () => {

  const navigate = useNavigate();

  

const { getMyShop } = useShops();

  const [product, setProduct] = useState({
  name: "",
  category: "",
  price: "",
  description: "",
});


const [image,setImage]=useState(null);

const [loading,setLoading]=useState(false);

  const handleChange = (e) => {

    setProduct({
      ...product,
      [e.target.name]: e.target.value,
    });

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!image) {
        toast.error("Please upload an image");
        return;
    }

    try {

        setLoading(true);

        const formData = new FormData();

        formData.append("name", product.name);
        formData.append("description", product.description);
        formData.append("price", product.price);
        formData.append("category", product.category);
        formData.append("image", image);

        const response = await addMenuItem(formData);

        toast.success(response.message);

        navigate("/seller/products");

    } catch (error) {

        toast.error(
            error.response?.data?.message ||
            "Failed to add product"
        );

    } finally {

        setLoading(false);

    }

};

  return (

    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-slate-100 pb-24">

      <div className="max-w-3xl mx-auto p-8">

        <h1 className="text-4xl font-bold mb-8">
          Add Product
        </h1>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl shadow-lg p-8 space-y-6"
        >

          <div>

            <label className="font-semibold">
              Product Name
            </label>

            <input
              name="name"
              value={product.name}
              onChange={handleChange}
              className="w-full border rounded-xl p-3 mt-2"
            />

          </div>


          <div>

            <label className="font-semibold">
              Category
            </label>

            <select
              name="category"
              value={product.category}
              onChange={handleChange}
              className="w-full border rounded-xl p-3 mt-2"
            >
              <option value="">Select Category</option>
              <option>Dairy</option>
              <option>Bakery</option>
              <option>Vegetables</option>
              <option>Fruits</option>
              <option>Beverages</option>
              <option>Snacks</option>
              <option>Grains</option>
            </select>

          </div>

          <div className="grid grid-cols-2 gap-5">

            <div>

              <label className="font-semibold">
                Price
              </label>

              <input
                type="number"
                name="price"
                value={product.price}
                onChange={handleChange}
                className="w-full border rounded-xl p-3 mt-2"
              />

            </div>


          </div>

          <div>

            <input
type="file"
accept="image/*"
onChange={(e)=>setImage(e.target.files[0])}
className="w-full border rounded-xl p-3 mt-2"
/>

            <div className="relative">

              <ImagePlus
                className="absolute left-4 top-6 text-gray-400"
              />

              <input
    type="file"
    accept="image/*"
    onChange={(e)=>setImage(e.target.files[0])}
    className="w-full border rounded-xl p-3 mt-2"
/>

            </div>

          </div>

          <div>

            <label className="font-semibold">
              Description
            </label>

            <textarea
              rows={5}
              name="description"
              value={product.description}
              onChange={handleChange}
              className="w-full border rounded-xl p-3 mt-2"
            />

          </div>

          <button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-2xl font-semibold"
          >
            Save Product
          </button>

        </form>

      </div>
      <BottomNavbar />

    </div>

  );

};

export default AddProduct;