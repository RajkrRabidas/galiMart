import { SquarePen } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import api from "../../../api/axios";

const ShopSnapshot = ({ shop, onShopUpdate, loading }) => {
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState(shop?.name || "");
  const [description, setDescription] = useState(shop?.description || "");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error("Shop name cannot be empty");
      return;
    }

    try {
      setIsSaving(true);
      const { data } = await api.put(`/shops/edit/${shop._id}`, {
        name,
        description,
      });

      onShopUpdate(data.shop);
      setEditMode(false);
      toast.success("Shop updated successfully");
    } catch (error) {
      console.error("Error saving shop:", error);
      toast.error("Failed to save changes");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setName(shop?.name || "");
    setDescription(shop?.description || "");
    setEditMode(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-6">
      <div className="flex gap-4">
        {/* Shop Image */}
        {shop?.image && (
          <div className="shrink-0">
            <img
              src={shop.image}
              alt={shop.name}
              className="w-20 h-20 md:w-24 md:h-24 rounded-lg object-cover"
            />
          </div>
        )}

        {/* Shop Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              {editMode ? (
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-gray-300 rounded-md py-1.5 px-2 text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Shop name"
                />
              ) : (
                <h2 className="text-lg font-semibold text-gray-900 truncate">{shop?.name}</h2>
              )}

              {!editMode && shop?.description && (
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">{shop.description}</p>
              )}

              {editMode && (
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full border border-gray-300 rounded-md py-1.5 px-2 text-sm mt-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Shop description"
                  rows="2"
                />
              )}

              {shop?.autoLocation?.formattedAddress && (
                <p className="text-xs text-gray-500 mt-1 truncate">
                  📍 {shop.autoLocation.formattedAddress}
                </p>
              )}
            </div>

            {!editMode && (
              <button
                onClick={() => setEditMode(true)}
                className="p-2 hover:bg-gray-100 rounded-lg transition cursor-pointer"
                title="Edit shop"
              >
                <SquarePen size={18} className="text-gray-600" />
              </button>
            )}
          </div>

          {editMode && (
            <div className="flex gap-2 mt-3">
              <button
                onClick={handleSave}
                disabled={isSaving || loading}
                className="px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 disabled:opacity-50 transition cursor-pointer"
              >
                Save
              </button>
              <button
                onClick={handleCancel}
                className="px-3 py-1.5 bg-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-300 transition cursor-pointer"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShopSnapshot;
