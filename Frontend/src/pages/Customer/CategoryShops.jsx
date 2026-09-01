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
import { useAuth } from "../../context/AuthContext";
import { useShops } from "../../context/ShopContext";
import { SHOP_CATEGORIES } from "../../constants/shopCategories";

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

  const selectedKey = (type || "groceries").toLowerCase();
  const selectedCategory = categories.find((category) => category.key === selectedKey) || categories[0];
  const theme = palette[selectedKey] || palette.groceries;
  const categoryMeta = SHOP_CATEGORIES[selectedKey] || SHOP_CATEGORIES.groceries;

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

    const next = shops.filter((shop) => String(shop.shopType || "").toLowerCase() === selectedKey);
    setFilteredShops(next);
  }, [selectedKey, shops]);

  const shopsToRender = filteredShops.length > 0
    ? filteredShops.slice(0, 4)
    : [
        { _id: "1", name: "Fresh Basket", distance: "4.8", rating: "4.9" },
        { _id: "2", name: "Daily Mart", distance: "6.1", rating: "4.7" },
        { _id: "3", name: "Quick Cart", distance: "7.4", rating: "4.8" },
        { _id: "4", name: "City Pick", distance: "8.2", rating: "4.6" },
      ];

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

  return (
    <div className="min-h-screen bg-[#edf2f5] p-3 md:p-5">
      <div className="mx-auto flex max-w-[1460px] overflow-hidden rounded-[28px] border border-slate-200 bg-[#f5f7f8] shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
        <aside className="hidden w-[220px] flex-col border-r border-slate-200 bg-white/90 px-4 py-5 lg:flex">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-lg font-black text-emerald-700">Q</div>
            <div>
              <p className="text-xl font-black tracking-tight text-slate-900">QuickKart</p>
              <p className="text-[10px] text-slate-400">Delivery near you</p>
            </div>
          </div>

          <nav className="space-y-2 text-sm text-slate-600">
            {[
              { label: "Home", icon: Home, active: true },
              { label: "Categories", icon: Store },
              { label: "Orders", icon: ShoppingBag },
              { label: "Wishlist", icon: Heart },
              { label: "Offers", icon: ShoppingCart },
              { label: "Notifications", icon: User },
            ].map(({ label, icon: Icon, active }) => (
              <button
                key={label}
                type="button"
                className={`flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left font-medium transition ${active ? "bg-emerald-50 text-emerald-700" : "hover:bg-slate-100"}`}
              >
                <Icon size={16} />
                {label}
              </button>
            ))}
          </nav>

          <div className="mt-auto rounded-[22px] bg-slate-50 p-3">
            <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Support
            </div>
            <p className="text-sm font-semibold text-slate-700">Help & Support</p>
          </div>
        </aside>

        <main className="flex-1 bg-[#f4f6f8] p-3 sm:p-4 lg:p-5">
          <header className="mb-5 flex flex-col gap-3 rounded-[24px] bg-white p-3 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-700"
              >
                <ArrowLeft size={18} />
              </button>

              <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500">
                <MapPin size={14} className="text-emerald-600" />
                <span>{location ? "Howrah, West Bengal" : "Your location"}</span>
              </div>
            </div>

            <div className="flex flex-1 items-center gap-2 rounded-full bg-slate-100 px-3 py-2.5 sm:max-w-[430px]">
              <Search size={16} className="text-slate-400" />
              <input
                readOnly
                value={`Search for ${selectedKey === "groceries" ? "fresh groceries" : selectedKey === "restaurants" ? "restaurants, cuisines..." : selectedKey === "fashion" ? "clothing, footwear..." : selectedKey === "medicine" ? "medicine, healthcare..." : selectedKey === "electronics" ? "electronics" : "services"}`}
                className="w-full border-0 bg-transparent text-sm text-slate-600 placeholder:text-slate-400 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <button type="button" className="rounded-full bg-slate-100 p-2.5 text-slate-600">ShoppingCart</button>
              <button type="button" className="rounded-full bg-slate-100 p-2.5 text-slate-600">User</button>
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

              <div className="mt-4 flex flex-wrap gap-2">
                {categoryMeta.categories.slice(0, 6).map((item, idx) => (
                  <span key={`${item}-${idx}`} className={`rounded-full px-3 py-1.5 text-[10px] font-semibold ${theme.chip}`}>
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </section>

          <section className="mb-5">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-xl font-black text-slate-900">Popular {selectedCategory.title}</h2>
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-500">Top picks</span>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {shopsToRender.map((shop, index) => (
                <article key={shop._id || index} className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-[0_12px_28px_rgba(15,23,42,0.04)]">
                  <div className="h-28 bg-gradient-to-br from-slate-200 via-slate-100 to-slate-200" />
                  <div className="p-3">
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <h3 className="truncate text-sm font-bold text-slate-900">{shop.name}</h3>
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-1.5 py-1 text-[10px] font-semibold text-amber-600">
                        <Star size={10} className="fill-yellow-400 text-yellow-400" />
                        {shop.rating || "4.8"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span className="inline-flex items-center gap-1">
                        <MapPin size={11} />
                        {shop.distance || "4.5"} km
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Clock3 size={11} />
                        25-30 min
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="rounded-[28px] bg-white p-3 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-black text-slate-900">Browse by category</h2>
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-500">All</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {categoryMeta.categories.slice(0, 10).map((tag, idx) => (
                <button
                  key={`${tag}-${idx}`}
                  type="button"
                  className="rounded-full bg-slate-100 px-3 py-1.5 text-[11px] font-semibold text-slate-600 transition hover:bg-slate-200"
                >
                  {tag}
                </button>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default CategoryShops;
