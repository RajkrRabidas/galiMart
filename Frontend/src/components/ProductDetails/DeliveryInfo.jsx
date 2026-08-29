import { Truck, MapPin, Clock } from "lucide-react";
import { useState } from "react";

const DeliveryInfo = () => {
  const [showLocationInput, setShowLocationInput] = useState(true);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
          <Truck size={20} className="text-emerald-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900">Delivery Information</h3>
      </div>

      <div className="space-y-6">
        {/* Location Check */}
        {showLocationInput ? (
          <div className="space-y-3">
            <p className="text-gray-600 text-sm">
              Enter your location to check delivery availability
            </p>
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Enter your postal code"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
              />
              <button className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition">
                Check
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Delivery Available */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
              <div className="flex items-center gap-2 text-emerald-700 font-semibold mb-2">
                <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
                Delivery Available
              </div>
              <p className="text-sm text-emerald-600">
                This product can be delivered to your location
              </p>
            </div>

            {/* Delivery Timeline */}
            <div className="space-y-3">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 font-semibold text-sm">
                  1
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Order Processing</p>
                  <p className="text-sm text-gray-600">Usually within 1-2 hours</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 font-semibold text-sm">
                  2
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Dispatched</p>
                  <p className="text-sm text-gray-600">Same day or next day</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-gray-300 text-white flex items-center justify-center flex-shrink-0 font-semibold text-sm">
                  3
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Delivered</p>
                  <p className="text-sm text-gray-600">
                    Estimated: 2-4 business days
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowLocationInput(true)}
              className="text-emerald-600 hover:text-emerald-700 text-sm font-semibold"
            >
              ← Change location
            </button>
          </>
        )}

        {/* Additional Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-2">
          <p className="text-xs font-bold text-blue-900 uppercase tracking-wide">
            Free Shipping
          </p>
          <p className="text-sm text-blue-800">
            Order above ₹500 qualifies for free delivery
          </p>
        </div>

        {/* Return Policy */}
        <div className="pt-4 border-t border-gray-200">
          <div className="flex items-start gap-3">
            <div className="text-emerald-600 mt-1">↩</div>
            <div>
              <p className="font-semibold text-gray-900 text-sm">Easy Returns</p>
              <p className="text-xs text-gray-600 mt-1">
                Return items within 7 days of delivery for a full refund
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryInfo;
