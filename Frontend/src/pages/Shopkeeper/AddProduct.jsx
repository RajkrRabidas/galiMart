import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ImagePlus, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";
import { useShops } from "../../context/ShopContext";
import BottomNavbar from "../../components/Shopkeeper/BottomNavbar";
import { addMenuItem } from "../../api/menuApi";
import { SHOP_CATEGORIES } from "../../constants/shopCategories";

const AddProduct = () => {

  const navigate = useNavigate();
  const { getMyShop } = useShops();

  const [shopType, setShopType] = useState(null);
  const [product, setProduct] = useState({
    name: "",
    category: "",
    price: "",
    description: "",
  });

  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchShopType = async () => {
      try {
        const shop = await getMyShop();
        setShopType(shop?.shopType?.toLowerCase() || null);
      } catch (error) {
        console.error("Error fetching shop:", error);
        toast.error("Failed to load shop details");
      }
    };
    fetchShopType();
  }, [getMyShop]);

  const categories = shopType ? SHOP_CATEGORIES[shopType]?.categories || [] : [];

  const handleChange = (e) => {

    setProduct({
      ...product,
      [e.target.name]: e.target.value,
    });

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!product.name || !product.category || !product.price || !product.description) {
        toast.error("Please fill all fields");
        return;
    }

    if (!image) {
        toast.error("Please upload an image");
        return;
    }

    if (isNaN(product.price) || product.price <= 0) {
        toast.error("Please enter a valid price");
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
              required
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
              required
              disabled={!shopType || categories.length === 0}
            >
              <option value="">
                {!shopType ? "Loading categories..." : "Select Category"}
              </option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            {shopType === "medicine" && (
              <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg flex gap-2">
                <AlertCircle size={20} className="text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-amber-800">
                  <p className="font-semibold">Prescription Items Notice</p>
                  <p>Prescription medicines require customer verification. Ensure compliance with healthcare regulations.</p>
                </div>
              </div>
            )}

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
                required
              />

            </div>


          </div>

          <div>

            <label className="font-semibold flex items-center gap-2">
              <ImagePlus size={20} className="text-gray-400" />
              Product Image
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
              className="w-full border rounded-xl p-3 mt-2"
              required
            />
            
            {image && (
              <p className="text-sm text-gray-600 mt-2">
                Selected: {image.name}
              </p>
            )}

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
              required
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