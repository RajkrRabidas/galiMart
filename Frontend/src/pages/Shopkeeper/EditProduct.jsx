import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ImagePlus } from "lucide-react";
import toast from "react-hot-toast";
import { useShops } from "../../context/ShopContext";
import BottomNavbar from "../../components/Shopkeeper/BottomNavbar";

const EditProduct = () => {

  const navigate = useNavigate();

  const { id } = useParams();

  const { getMyShop, updateProduct } = useShops();

  const myShop = getMyShop();

  const [product, setProduct] = useState({
    id: "",
    name: "",
    brand: "",
    category: "",
    price: "",
    stock: "",
    description: "",
    image: "",
  });

  useEffect(() => {

    if (!myShop) return;

    const existingProduct = myShop.products.find(
      (item) => item.id === Number(id)
    );

    if (!existingProduct) {

      toast.error("Product not found");

      navigate("/seller/products");

      return;

    }

    setProduct(existingProduct);

  }, [id, myShop]);

  const handleChange = (e) => {

    setProduct({
      ...product,
      [e.target.name]: e.target.value,
    });

  };

  const handleSubmit = (e) => {

    e.preventDefault();

    updateProduct(
      myShop.owner,
      {
        ...product,
        price: Number(product.price),
        stock: Number(product.stock),
      }
    );

    toast.success("Product Updated");

    navigate("/seller/products");

  };

  return (

    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-slate-100 pb-24">

      <div className="max-w-3xl mx-auto p-8">

        <h1 className="text-4xl font-bold mb-8">

          Edit Product

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

              Brand

            </label>

            <input
              name="brand"
              value={product.brand}
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

            <div>

              <label className="font-semibold">

                Stock

              </label>

              <input
                type="number"
                name="stock"
                value={product.stock}
                onChange={handleChange}
                className="w-full border rounded-xl p-3 mt-2"
              />

            </div>

          </div>

          <div>

            <label className="font-semibold">

              Image URL

            </label>

            <div className="relative">

              <ImagePlus
                className="absolute left-4 top-6 text-gray-400"
              />

              <input
                name="image"
                value={product.image}
                onChange={handleChange}
                className="w-full border rounded-xl pl-12 p-3 mt-2"
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
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-2xl font-semibold cursor-pointer"
          >

            Save Changes

          </button>

        </form>

      </div>
      <BottomNavbar />

    </div>

  );

};

export default EditProduct;