import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Clock3,
  Heart,
  Home,
  MapPin,
  Search,
  ShoppingBag,
  ShoppingCart,
  Star,
  Store,
  User,
  UtensilsCrossed,
} from "lucide-react";
import { categories } from "../../components/CategorySection/categorydata";
import { getMenuItems } from "../../api/menuApi";
import { useAuth } from "../../context/AuthContext";
import { useShops } from "../../context/ShopContext";
import { SHOP_CATEGORIES } from "../../constants/shopCategories";
import ProductCard from "../../components/ProductSection/ProductCard";
import BottomNavbar from "../../components/BottomNavbar/BottomNavbar";

const palette = {
  groceries: {
    hero: "from-[#0f9a51] via-[#0d8d4a] to-[#0d7e4a]",
    badge: "bg-[#eafef1] text-[#0b7a43]",
    chip: "bg-white/15 text-white",
  },
  restaurants: {
    hero: "from-[#f3c75b] via-[#f1b539] to-[#e8aa22]",
    badge: "bg-[#fff4ca] text-[#866000]",
    chip: "bg-white/20 text-[#4d2c00]",
  },
  fashion: {
    hero: "from-[#a135d4] via-[#8b2bc8] to-[#7d2db2]",
    badge: "bg-[#f6eafe] text-[#5f1e8d]",
    chip: "bg-white/15 text-white",
  },
  medicine: {
    hero: "from-[#28d2ce] via-[#1dc0c4] to-[#13a7b5]",
    badge: "bg-[#e8ffff] text-[#0c6973]",
    chip: "bg-white/15 text-white",
  },
  electronics: {
    hero: "from-[#2f6fe8] via-[#2c61d8] to-[#1d4ab4]",
    badge: "bg-[#edf4ff] text-[#214fba]",
    chip: "bg-white/15 text-white",
  },
  services: {
    hero: "from-[#2b90f8] via-[#1f7ee9] to-[#0e64cd]",
    badge: "bg-[#eef7ff] text-[#0d5ca8]",
    chip: "bg-white/15 text-white",
  },
};

const navIcons = [Home, Store, ShoppingCart, Heart, User];

const CategoryShops = () => {
  const { type } = useParams();
  const navigate = useNavigate();
  const { location } = useAuth();
  const { fetchNearbyShops, shops, loading } = useShops();
  const [filteredShops, setFilteredShops] = useState([]);
  const [shopProducts, setShopProducts] = useState({});
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const selectedKey = (type || "groceries").toLowerCase();
  const selectedCategory = categories.find((category) => category.key === selectedKey) || categories[0];
  const theme = palette[selectedKey] || palette.groceries;
  const categoryMeta = SHOP_CATEGORIES[selectedKey] || SHOP_CATEGORIES.groceries;

  useEffect(() => {
    setSelectedFilter("All");
    setSearchTerm("");
  }, [selectedKey]);

  useEffect(() => {
    if (!location?.latitude || !location?.longitude) return;

    fetchNearbyShops({
      latitude: location.latitude,
      longitude: location.longitude,
      radius: 20000,
      search: "",
      shopType: selectedKey,
    });
  }, [location?.latitude, location?.longitude, selectedKey, fetchNearbyShops]);

  useEffect(() => {
    if (!shops.length) {
      setFilteredShops([]);
      return;
    }

    const normalizedQuery = searchTerm.trim().toLowerCase();
    const baseShops = shops.filter((shop) => String(shop.shopType || "").toLowerCase() === selectedKey);

    const next = !normalizedQuery
      ? baseShops
      : baseShops.filter((shop) => {
          const searchableText = [
            shop.name,
            shop.shopType,
            shop.address,
            shop.category,
            shop.tags,
            shop.cuisines,
          ]
            .flatMap((value) => (Array.isArray(value) ? value : [value]))
            .filter(Boolean)
            .join(" ")
            .toLowerCase();

          return searchableText.includes(normalizedQuery);
        });

    setFilteredShops(next);
  }, [searchTerm, selectedKey, shops]);

  const shopsToRender = filteredShops.length > 0 ? filteredShops.slice(0, 4) : [];

  const formatDistance = (shop) => {
    const raw = Number(shop?.distanceKm ?? shop?.distance ?? 0);
    if (!Number.isFinite(raw)) return "0";
    return raw > 1000 ? (raw / 1000).toFixed(1) : raw.toFixed(1);
  };

  useEffect(() => {
    if (!shopsToRender.length) {
      setShopProducts({});
      return;
    }

    let active = true;

    const loadProducts = async () => {
      const nextProducts = {};

      await Promise.all(
        shopsToRender.map(async (shop) => {
          try {
            const response = await getMenuItems(shop._id);
            const items = Array.isArray(response)
              ? response
              : Array.isArray(response?.menuItems)
                ? response.menuItems
                : Array.isArray(response?.items)
                  ? response.items
                  : Array.isArray(response?.data)
                    ? response.data
                    : [];

            nextProducts[shop._id] = items.slice(0, 4);
          } catch (error) {
            console.error("Error fetching shop products:", error);
            nextProducts[shop._id] = [];
          }
        })
      );

      if (active) setShopProducts(nextProducts);
    };

    loadProducts();

    return () => {
      active = false;
    };
  }, [shopsToRender]);

  const heroLabel =
    selectedKey === "groceries"
      ? "Fresh Groceries"
      : selectedKey === "restaurants"
        ? "Delicious Food"
        : selectedKey === "fashion"
          ? "Style Up Your Everyday!"
          : selectedKey === "medicine"
            ? "Stay Healthy"
            : selectedKey === "electronics"
              ? "Smart Deals"
              : "Trusted Services";

  const handleShopClick = (shop) => {
    if (!shop?._id) return;
    navigate(`/shop/${shop._id}`);
  };

  const allCategoryProducts = Object.values(shopProducts)
    .flat()
    .filter((product) => product && (product.name || product._id));

  const visibleCategoryProducts = allCategoryProducts.filter((product) => {
    const searchableProductText = [
      product.name,
      product.category,
      product.type,
      product.subCategory,
      product.subcategory,
      product.description,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    const matchesSearch = !searchTerm.trim() || searchableProductText.includes(searchTerm.trim().toLowerCase());

    if (!matchesSearch) return false;

    if (!selectedFilter || selectedFilter === "All") return true;

    const productCategory = String(
      product.category || product.type || product.subCategory || product.subcategory || ""
    ).toLowerCase();

    const selectedCategoryValue = selectedFilter.toLowerCase();

    return (
      productCategory.includes(selectedCategoryValue) ||
      String(product.name || "").toLowerCase().includes(selectedCategoryValue)
    );
  });

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[#edf2f5] p-3 md:p-5">
      <div className="mx-auto flex w-full max-w-[1460px] overflow-hidden rounded-[28px] border border-slate-200 bg-[#f5f7f8] shadow-[0_24px_80px_rgba(15,23,42,0.08)]">

        <main className="min-w-0 flex-1 bg-[#f4f6f8] p-3 sm:p-4 lg:p-5">
          <header className="mb-4 flex flex-col gap-2.5 rounded-[20px] bg-white p-2.5 shadow-sm sm:mb-5 sm:flex-row sm:items-center sm:justify-between sm:rounded-[24px] sm:p-3">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-700 sm:h-10 sm:w-10"
              >
                <ArrowLeft size={16} className="sm:h-[18px] sm:w-[18px]" />
              </button>

              <div className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs text-slate-500 sm:gap-2 sm:px-3 sm:py-2 sm:text-sm">
                <MapPin size={13} className="text-emerald-600 sm:h-[14px] sm:w-[14px]" />
                <span>{location ? "Howrah, West Bengal" : "Your location"}</span>
              </div>
            </div>

            <div className="flex w-full items-center gap-2 rounded-full bg-slate-100 px-3 py-2.5 sm:max-w-[430px] sm:flex-1">
              <Search size={16} className="text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder={`Search for ${selectedKey === "groceries" ? "fresh groceries" : selectedKey === "restaurants" ? "restaurants, cuisines..." : selectedKey === "fashion" ? "clothing, footwear..." : selectedKey === "medicine" ? "medicine, healthcare..." : selectedKey === "electronics" ? "electronics" : "services"}`}
                className="w-full border-0 bg-transparent text-xs text-slate-600 placeholder:text-slate-400 focus:outline-none sm:text-sm"
              />
            </div>

          </header>

          <section className="mb-5 rounded-[28px] bg-white p-3 shadow-sm">
            <div className={`rounded-[22px] bg-gradient-to-r ${theme.hero} p-4 text-white sm:p-5`}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white/80">
                    {selectedCategory.title}
                  </div>
                  <h1 className="text-2xl font-black leading-tight sm:text-3xl">{heroLabel}</h1>
                  <p className="mt-2 text-sm text-white/80">Up to 30% off on selected items</p>
                </div>

                <div className="hidden h-20 w-20 items-center justify-center rounded-[20px] bg-white/10 backdrop-blur-sm sm:flex">
                  {selectedKey === "restaurants" ? <UtensilsCrossed size={32} /> : selectedKey === "fashion" ? <ShoppingBag size={32} /> : selectedKey === "medicine" ? <Heart size={32} /> : selectedKey === "electronics" ? <Store size={32} /> : selectedKey === "services" ? <ShoppingCart size={32} /> : <Store size={32} />}
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-[20px] bg-white p-2.5 shadow-sm sm:rounded-[28px] sm:p-3">
            <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <button
                type="button"
                onClick={() => setSelectedFilter("All")}
                className={`shrink-0 rounded-full px-3 py-1.5 text-[11px] font-semibold transition sm:text-[11px] ${
                  selectedFilter === "All"
                    ? "bg-slate-900 text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                All
              </button>

              {categoryMeta.categories.map((tag, idx) => (
                <button
                  key={`${tag}-${idx}`}
                  type="button"
                  onClick={() => setSelectedFilter(tag)}
                  className={`shrink-0 rounded-full px-3 py-1.5 text-[11px] font-semibold transition sm:text-[11px] ${
                    selectedFilter === tag
                      ? "bg-slate-900 text-white shadow-sm"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </section>

          <section className="mb-4 sm:mb-5">
            <div className="mb-2.5 flex items-center justify-between sm:mb-3">
              <h2 className="text-lg font-black text-slate-900 sm:text-xl">Popular {selectedCategory.title}</h2>
              <span className="rounded-full bg-slate-100 px-2 py-1 text-[9px] font-bold text-slate-500 sm:px-2.5 sm:text-[10px]">Top picks</span>
            </div>

            {shopsToRender.length === 0 ? (
              <div className="rounded-[20px] border border-dashed border-slate-300 bg-white p-5 text-center text-sm text-slate-500 sm:rounded-[24px] sm:p-6">
                No shops available in this category yet.
              </div>
            ) : (
              <div className="grid gap-3 sm:gap-4 md:grid-cols-2 xl:grid-cols-4">
                {shopsToRender.map((shop, index) => (
                  <article
                    key={shop._id || index}
                    role="button"
                    tabIndex={0}
                    onClick={() => handleShopClick(shop)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        handleShopClick(shop);
                      }
                    }}
                    className="cursor-pointer overflow-hidden rounded-[20px] border border-slate-200 bg-white shadow-[0_10px_24px_rgba(15,23,42,0.04)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_20px_35px_rgba(15,23,42,0.08)] focus:outline-none focus:ring-2 focus:ring-emerald-500/60 sm:rounded-[24px]"
                  >
                    <div className="h-24 overflow-hidden bg-gradient-to-br from-slate-200 via-slate-100 to-slate-200 sm:h-28">
                      {shop.image ? (
                        <img src={shop.image} alt={shop.name} className="h-full w-full object-cover" />
                      ) : null}
                    </div>
                    <div className="p-2.5 sm:p-3">
                      <div className="mb-2 flex items-center justify-between gap-2">
                        <h3 className="truncate text-xs font-bold text-slate-900 sm:text-sm">{shop.name}</h3>
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-1.5 py-1 text-[9px] font-semibold text-amber-600 sm:text-[10px]">
                          <Star size={9} className="fill-yellow-400 text-yellow-400 sm:h-[10px] sm:w-[10px]" />
                          {shop.rating || "4.8"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-slate-500 sm:text-[11px]">
                        <span className="inline-flex items-center gap-1">
                          <MapPin size={10} className="sm:h-[11px] sm:w-[11px]" />
                          {shop.distance || "4.5"} km
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Clock3 size={10} className="sm:h-[11px] sm:w-[11px]" />
                          25-30 min
                        </span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>

          <section className="mt-4 sm:mt-6">
            <div className="mb-2.5 flex items-center justify-between sm:mb-3">
              <h2 className="text-lg font-black text-slate-900 sm:text-xl">Popular products</h2>
              <span className="rounded-full bg-slate-100 px-2 py-1 text-[9px] font-bold text-slate-500 sm:px-2.5 sm:text-[10px]">Fresh picks</span>
            </div>

            {visibleCategoryProducts.length === 0 ? (
              <div className="rounded-[20px] border border-dashed border-slate-300 bg-white p-5 text-center text-sm text-slate-500 sm:rounded-[24px] sm:p-6">
                No products available in this category yet.
              </div>
            ) : (
              <div className="grid gap-3 sm:gap-5 md:grid-cols-2 xl:grid-cols-4">
                {visibleCategoryProducts.map((product, index) => (
                  <ProductCard
                    key={`${product._id || product.id || index}-${index}`}
                    product={product}
                    shopId={product.shopId || shopsToRender.find((shop) => shop._id === product.shopId)?._id}
                  />
                ))}
              </div>
            )}
          </section>
        </main>

        <BottomNavbar />
      </div>
    </div>
  );
};

export default CategoryShops;
