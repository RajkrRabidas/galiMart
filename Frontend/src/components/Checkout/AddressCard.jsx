import { useMemo } from "react";

const AddressCard = ({ addresses, selectedAddress, onSelectAddress, loading }) => {
  const formattedAddress = useMemo(() => {
    if (!selectedAddress) return null;
    return selectedAddress.formattedAddress || "";
  }, [selectedAddress]);

  return (
    <div className="bg-white rounded-3xl shadow-lg p-6">

      <h2 className="text-2xl font-bold mb-6">
        Delivery Address
      </h2>

      {loading ? (
        <div className="rounded-3xl border border-dashed border-gray-300 p-8 text-center text-sm text-gray-500">
          Loading saved addresses...
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid gap-3">
            {addresses.length === 0 ? (
              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-500">
                No saved addresses found. Please add an address in your profile.
              </div>
            ) : (
              addresses.map((addr) => (
                <button
                  key={addr._id}
                  type="button"
                  onClick={() => onSelectAddress(addr)}
                  className={`w-full rounded-3xl border p-4 text-left transition cursor-pointer ${
                    selectedAddress?._id === addr._id
                      ? "border-emerald-600 bg-emerald-50"
                      : "border-gray-200 bg-white hover:border-emerald-300"
                  }`}
                >
                  <div className="font-semibold text-gray-900">{addr.fullName || "Delivery address"}</div>
                  <div className="text-sm text-gray-600">{addr.formattedAddress}</div>
                  <div className="text-xs text-gray-500 mt-1">{addr.mobile}</div>
                </button>
              ))
            )}
          </div>

          {formattedAddress && (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-gray-700">
              <div className="font-semibold text-emerald-900">Selected address</div>
              <div>{formattedAddress}</div>
            </div>
          )}
            </div>
          )}

        </div>
      );
    };

    export default AddressCard;