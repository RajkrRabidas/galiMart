import { useEffect, useMemo, useState } from "react";
import { MapPin, Search, Star } from "lucide-react";
import { useParams } from "react-router-dom";
import { getShopById } from "../../api/shopApi";
import { getMenuItems } from "../../api/menuApi";
import ProductCard from "../../components/ProductSection/ProductCard";
import BottomNavbar from "../../components/BottomNavbar/BottomNavbar";

const ShopDetails = () => {
  const { id } = useParams();

  const [shop, setShop] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    const fetchShopData = async () => {
      try {
        const shopResponse = await getShopById(id);

        let shopToSet = null;

        if (shopResponse?.shop) {
          shopToSet = shopResponse.shop;
        } else if (shopResponse?.data?.shop) {
          shopToSet = shopResponse.data.shop;
        } else if (shopResponse && typeof shopResponse === "object" && shopResponse._id) {
          shopToSet = shopResponse;
        }

        if (!shopToSet) {
          setShop(null);
        } else {
          setShop(shopToSet);
        }

        try {
          const menuResponse = await getMenuItems(id);

          let productsToSet = [];
          if (Array.isArray(menuResponse)) {
            productsToSet = menuResponse;
          } else if (menuResponse?.menuItems && Array.isArray(menuResponse.menuItems)) {
            productsToSet = menuResponse.menuItems;
          } else if (menuResponse?.items && Array.isArray(menuResponse.items)) {
            productsToSet = menuResponse.items;
          } else if (menuResponse?.data && Array.isArray(menuResponse.data)) {
            productsToSet = menuResponse.data;
          }

          setProducts(productsToSet);
        } catch (menuError) {
          console.error("Error fetching menu items:", menuError);
          setProducts([]);
        }
      } catch (error) {
        console.error("Error fetching shop data:", error?.response?.data || error?.message || error);
        setShop(null);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchShopData();
    }
  }, [id]);

  const categories = useMemo(() => {
    const values = products
      .map((product) => product.category || product.type || product.brand)
      .filter(Boolean);

    return ["All", ...new Set(values)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const category = product.category || product.type || product.brand || "";
      const query = searchTerm.trim().toLowerCase();
      const matchesSearch =
        !query ||
        product.name?.toLowerCase().includes(query) ||
        category.toLowerCase().includes(query);

      const matchesCategory =
        selectedCategory === "All" || category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, selectedCategory]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <h1 className="text-2xl font-semibold text-slate-700">Loading Shop...</h1>
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <h1 className="text-3xl font-bold text-slate-800">Shop Not Found</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="mx-auto max-w-6xl px-4 pb-28 pt-4">
        <div className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-[0_24px_50px_rgba(15,23,42,0.06)]">
          <div className="flex items-center gap-4">
            <img
              src={shop.image}
              alt={shop.name}
              className="h-20 w-20 rounded-2xl object-cover"
            />

            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-emerald-600">
                Shop
              </p>
              <h1 className="mt-1 text-2xl font-black text-slate-900">{shop.name}</h1>
              <div className="mt-1 flex items-center gap-2 text-sm text-slate-500">
                <MapPin size={14} className="text-emerald-600" />
                <span className="truncate">{shop.autoLocation?.formattedAddress || shop.address || "Address unavailable"}</span>
              </div>
            </div>

            <div className="hidden items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1.5 text-sm font-semibold text-emerald-700 sm:flex">
              <Star size={14} className="fill-yellow-400 text-yellow-400" />
              4.8
            </div>
          </div>
        </div>

        <div className="mt-5 rounded-[24px] border border-slate-200 bg-white p-3 shadow-sm">
          <label className="flex items-center gap-3 rounded-2xl bg-slate-50 px-3 py-3">
            <Search size={18} className="text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for products"
              className="w-full border-none bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none"
            />
          </label>
        </div>

        {categories.length > 1 && (
          <div className="mt-5 flex gap-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${
                  selectedCategory === category
                    ? "bg-slate-900 text-white shadow-lg shadow-slate-900/20"
                    : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        )}

        <div className="mt-6">
          {filteredProducts.length === 0 ? (
            <div className="rounded-[28px] bg-white p-12 text-center shadow-[0_18px_40px_rgba(15,23,42,0.06)]">
              <h2 className="text-2xl font-bold text-slate-900">No Products</h2>
              <p className="mt-3 text-slate-500">This shop hasn’t added products in this category yet.</p>
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product._id || product.id}
                  product={product}
                  shopId={id}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <BottomNavbar />
    </div>
  );
};

export default ShopDetails;