import { Star, MapPin, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ShopInfo = ({ shop }) => {
  const navigate = useNavigate();

  // Mock shop data if not provided
  const shopData = shop || {
    name: "Gali Mart",
    rating: 4.6,
    reviews: 2543,
    location: "Fort Gloster, Uluberia",
    verified: true,
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-8">
      <h3 className="text-xl font-bold text-gray-900 mb-6">Sold by</h3>

      <div className="flex items-start justify-between">
        <div className="space-y-4">
          {/* Shop Name */}
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-bold text-xl">
              {shopData.name.charAt(0)}
            </div>
            <div>
              <h4 className="text-lg font-bold text-gray-900">
                {shopData.name}
              </h4>
              {shopData.verified && (
                <div className="flex items-center gap-1 text-xs text-emerald-600 font-semibold mt-1">
                  <Shield size={12} fill="currentColor" />
                  Verified Seller
                </div>
              )}
            </div>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  className={
                    i < Math.floor(shopData.rating)
                      ? "fill-amber-400 text-amber-400"
                      : "text-gray-300"
                  }
                />
              ))}
            </div>
            <span className="font-semibold text-gray-900">{shopData.rating}</span>
            <span className="text-gray-600 text-sm">({shopData.reviews})</span>
          </div>

          {/* Location */}
          <div className="flex items-center gap-2 text-gray-600">
            <MapPin size={16} className="text-emerald-600" />
            <span className="text-sm">{shopData.location}</span>
          </div>
        </div>

        {/* Visit Shop Button */}
        <button
          onClick={() => {
            // Navigate to shop detail page
            // For now, just show a toast
            console.log("Visit shop");
          }}
          className="px-6 py-2 border-2 border-emerald-600 text-emerald-600 rounded-full font-semibold hover:bg-emerald-50 transition whitespace-nowrap"
        >
          Visit Shop
        </button>
      </div>

      {/* Shop Features */}
      <div className="mt-6 pt-6 border-t border-gray-200 grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-xl font-bold text-emerald-600">✓</div>
          <p className="text-xs text-gray-600 mt-1">Quality Assured</p>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold text-emerald-600">✓</div>
          <p className="text-xs text-gray-600 mt-1">Fast Delivery</p>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold text-emerald-600">✓</div>
          <p className="text-xs text-gray-600 mt-1">Easy Returns</p>
        </div>
      </div>
    </div>
  );
};

export default ShopInfo;
