import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ImagePlus, 
  AlertCircle, 
  ArrowLeft, 
  Upload, 
  Trash2,
  Check 
} from "lucide-react";
import toast from "react-hot-toast";
import { useShops } from "../../context/ShopContext";
import BottomNavbar from "../../components/Shopkeeper/BottomNavbar";
import { addMenuItem } from "../../api/menuApi";
import { SHOP_CATEGORIES } from "../../constants/shopCategories";

const AddProduct = () => {

  const navigate = useNavigate();
  const { getMyShop } = useShops();

  const [shopType, setShopType] = useState(null);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [product, setProduct] = useState({
    name: "",
    category: "",
    price: "",
    description: "",
  });

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchShopType = async () => {
      try {
        setCategoriesLoading(true);
        const shop = await getMyShop();
        
        if (shop && shop.shopType) {
          setShopType(shop.shopType.toLowerCase());
        } else {
          toast.error("Shop type not found");
          setShopType(null);
        }
      } catch (error) {
        console.error("Error fetching shop:", error);
        toast.error("Failed to load shop details");
        setShopType(null);
      } finally {
        setCategoriesLoading(false);
      }
    };
    fetchShopType();
  }, [getMyShop]);

  const categories = shopType && SHOP_CATEGORIES[shopType] 
    ? SHOP_CATEGORIES[shopType].categories 
    : [];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({
      ...product,
      [name]: value,
    });
    // Clear error for this field
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = ["image/png", "image/jpeg", "image/webp"];
      if (!validTypes.includes(file.type)) {
        toast.error("Please upload PNG, JPG or WEBP images");
        return;
      }
      
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be less than 5MB");
        return;
      }

      setImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      
      // Clear error
      if (errors.image) {
        setErrors({
          ...errors,
          image: "",
        });
      }
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = {};

    if (!product.name.trim()) {
      newErrors.name = "Product name is required";
    }

    if (!product.category) {
      newErrors.category = "Category is required";
    }

    if (!product.price) {
      newErrors.price = "Price is required";
    } else if (isNaN(product.price) || product.price <= 0) {
      newErrors.price = "Please enter a valid price";
    }

    if (!product.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!image) {
      newErrors.image = "Product image is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Please fix the errors below");
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
    <div className="min-h-screen from-emerald-50 via-white to-slate-100 pb-32">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3 mb-2">
            <button
              onClick={() => navigate("/seller/products")}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft size={20} className="text-gray-700" />
            </button>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Add New Product</h1>
          </div>
          <p className="text-sm text-gray-600 ml-11">Add a high-quality product to your shop and start selling</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit}>
          {/* Desktop: Two Column Layout */}
          <div className="grid lg:grid-cols-3 gap-6">
            
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Product Images Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">
                <h2 className="text-lg font-bold text-gray-900 mb-2">Product Images</h2>
                <p className="text-sm text-gray-600 mb-6">Add high-quality images to help customers discover your product</p>

                {/* Image Upload Area */}
                <label className="block">
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <div className={`relative border-2 border-dashed rounded-xl p-6 sm:p-8 text-center cursor-pointer transition-all ${
                    imagePreview 
                      ? "border-emerald-300 bg-emerald-50" 
                      : "border-gray-300 hover:border-emerald-400 hover:bg-emerald-50"
                  }`}>
                    {imagePreview ? (
                      <div className="space-y-4">
                        <img 
                          src={imagePreview} 
                          alt="Preview" 
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        <div className="flex items-center justify-center gap-2 text-sm font-medium text-emerald-700">
                          <Check size={18} />
                          Image selected: {image?.name}
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="flex justify-center">
                          <Upload size={32} className="text-gray-400" />
                        </div>
                        <div>
                          <p className="text-base font-semibold text-gray-900">Upload Product Image</p>
                          <p className="text-sm text-gray-600 mt-1">PNG, JPG or WEBP • Up to 5MB</p>
                        </div>
                      </div>
                    )}
                  </div>
                </label>

                {/* Image Error */}
                {errors.image && (
                  <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg flex gap-2">
                    <AlertCircle size={18} className="text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-700">{errors.image}</p>
                  </div>
                )}

                {/* Remove Image Button */}
                {imagePreview && (
                  <button
                    type="button"
                    onClick={removeImage}
                    className="mt-4 w-full px-4 py-2 text-red-600 hover:bg-red-50 border border-red-200 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <Trash2 size={18} />
                    Remove Image
                  </button>
                )}
              </div>

              {/* Pricing & Inventory Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">
                <h2 className="text-lg font-bold text-gray-900 mb-6">Pricing</h2>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Price <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 font-medium">₹</span>
                    <input
                      type="number"
                      name="price"
                      value={product.price}
                      onChange={handleChange}
                      placeholder="0"
                      className={`w-full pl-8 pr-4 py-2.5 border rounded-lg text-base bg-white transition-colors focus:outline-none focus:ring-2 ${
                        errors.price
                          ? "border-red-300 focus:ring-red-200"
                          : "border-gray-300 focus:ring-emerald-200"
                      }`}
                    />
                  </div>
                  {errors.price && (
                    <p className="mt-2 text-sm text-red-600">{errors.price}</p>
                  )}
                </div>
              </div>

            </div>

            {/* Right Column */}
            <div className="space-y-6">
              
              {/* Product Information Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">
                <h2 className="text-lg font-bold text-gray-900 mb-6">Product Information</h2>

                {/* Product Name */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Product Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={product.name}
                    onChange={handleChange}
                    placeholder="Enter product name"
                    className={`w-full px-4 py-2.5 border rounded-lg text-base bg-white transition-colors focus:outline-none focus:ring-2 ${
                      errors.name
                        ? "border-red-300 focus:ring-red-200"
                        : "border-gray-300 focus:ring-emerald-200"
                    }`}
                  />
                  {errors.name && (
                    <p className="mt-2 text-sm text-red-600">{errors.name}</p>
                  )}
                </div>

                {/* Category */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="category"
                    value={product.category}
                    onChange={handleChange}
                    disabled={categoriesLoading || !shopType || categories.length === 0}
                    className={`w-full px-4 py-2.5 border rounded-lg text-base bg-white transition-colors focus:outline-none focus:ring-2 cursor-pointer ${
                      errors.category
                        ? "border-red-300 focus:ring-red-200"
                        : "border-gray-300 focus:ring-emerald-200"
                    } ${categoriesLoading || !shopType || categories.length === 0 ? "opacity-60 cursor-not-allowed" : ""}`}
                  >
                    <option value="">
                      {categoriesLoading 
                        ? "Loading..." 
                        : !shopType 
                        ? "No shop type" 
                        : "Select category"}
                    </option>
                    {categories.length > 0 && categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  {errors.category && (
                    <p className="mt-2 text-sm text-red-600">{errors.category}</p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="description"
                    value={product.description}
                    onChange={handleChange}
                    placeholder="Tell customers about your product..."
                    rows={4}
                    className={`w-full px-4 py-2.5 border rounded-lg text-base bg-white transition-colors focus:outline-none focus:ring-2 resize-none ${
                      errors.description
                        ? "border-red-300 focus:ring-red-200"
                        : "border-gray-300 focus:ring-emerald-200"
                    }`}
                  />
                  {errors.description && (
                    <p className="mt-2 text-sm text-red-600">{errors.description}</p>
                  )}
                </div>
              </div>

              {/* Medicine Warning */}
              {shopType === "medicine" && (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
                  <div className="flex gap-3">
                    <AlertCircle size={20} className="text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-sm text-amber-900">Prescription Items</p>
                      <p className="text-xs text-amber-800 mt-1">Ensure compliance with healthcare regulations and customer verification requirements.</p>
                    </div>
                  </div>
                </div>
              )}

            </div>

          </div>

          {/* Form Actions */}
          <div className="grid sm:grid-cols-2 gap-4 mt-8 sticky bottom-0 sm:static bg-gradient-to-b from-transparent via-emerald-50 to-emerald-50 p-4 sm:p-0 -mx-4 sm:mx-0">
            <button
              type="button"
              onClick={() => navigate("/seller/products")}
              className="px-6 py-3 border cursor-pointer border-gray-300 rounded-lg font-semibold text-gray-900 hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || categoriesLoading}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 disabled:cursor-not-allowed cursor-pointer text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <Check size={18} />
                  Add Product
                </>
              )}
            </button>
          </div>

        </form>
      </div>

      <BottomNavbar />
    </div>
  );

};

export default AddProduct;