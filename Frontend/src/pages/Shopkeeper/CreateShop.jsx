import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, Store, LoaderCircle } from "lucide-react";
import toast from "react-hot-toast";
import { APIProvider, Map, AdvancedMarker } from "@vis.gl/react-google-maps";
import api from "../../api/axios";
import { useShops } from "../../context/ShopContext";
import { SHOP_CATEGORIES } from "../../constants/shopCategories";

const DEFAULT_LOCATION = {
  lat: 22.5958,
  lng: 88.2636,
};

const CreateShop = () => {
  const navigate = useNavigate();
  const { createShop, getMyShop } = useShops();
  const mapRef = useRef(null);

  const [shop, setShop] = useState({
    name: "",
    description: "",
    phone: "",
    formattedAddress: "",
    aadharNumber: "",
    shopType: "",
  });

  const [image, setImage] = useState(null);
  const [aadharImage, setAadharImage] = useState(null);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationMessage, setLocationMessage] = useState("");

  const selectedLocation =
    latitude !== null && longitude !== null
      ? { lat: latitude, lng: longitude }
      : DEFAULT_LOCATION;

  const handleChange = (e) => {
    setShop({
      ...shop,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleAadharChange = (e) => {
    setAadharImage(e.target.files[0]);
  };

  const setLocation = async (lat, lng, useCurrentLocation = false) => {
    const validLat = Number(lat);
    const validLng = Number(lng);

    if (!Number.isFinite(validLat) || !Number.isFinite(validLng)) {
      return;
    }

    setLatitude(validLat);
    setLongitude(validLng);

    if (mapRef.current) {
      mapRef.current.panTo({ lat: validLat, lng: validLng });
      mapRef.current.setZoom(16);
    }

    try {
      const { data } = await api.get("/location/reverse-geocode", {
        params: { latitude: validLat, longitude: validLng },
      });

      if (!data?.success || !data?.location?.formattedAddress) {
        setShop((prev) => ({
          ...prev,
          formattedAddress: "",
        }));

        if (useCurrentLocation) {
          setLocationMessage("");
        }
        toast.error("Unable to fetch a readable address. Please select again.");
        return;
      }

      setShop((prev) => ({
        ...prev,
        formattedAddress: data.location.formattedAddress || formatFallbackAddress(validLat, validLng),
      }));

      if (useCurrentLocation) {
        setLocationMessage("Location fetched");
        toast.success("Location fetched");
      }
    } catch (error) {
      console.warn("Reverse geocoding failed:", error);
      setShop((prev) => ({
        ...prev,
        formattedAddress: "",
      }));

      if (useCurrentLocation) {
        setLocationMessage("");
      }
      toast.error("Unable to fetch a readable address. Please try again.");
    } finally {
      if (useCurrentLocation) {
        setLocationLoading(false);
      }
    }
  };

  const handleMapClick = async (event) => {
    const lat = event?.detail?.latLng?.lat;
    const lng = event?.detail?.latLng?.lng;

    if (typeof lat !== "number" || typeof lng !== "number") {
      return;
    }

    await setLocation(lat, lng, false);
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Browser does not support location services");
      return;
    }

    setLocationLoading(true);
    setLocationMessage("");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        await setLocation(lat, lng, true);
      },
      (error) => {
        setLocationLoading(false);
        setLocationMessage("");
        console.error("Geolocation failed:", error);
        toast.error("Unable to access your location. Please allow location access and try again.");
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !shop.name ||
      !shop.phone ||
      !shop.formattedAddress ||
      !shop.aadharNumber ||
      !shop.shopType
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    if (latitude === null || longitude === null) {
      toast.error("Please select your shop location");
      return;
    }

    if (!shop.formattedAddress) {
      toast.error("Please select your shop location");
      return;
    }

    if (!image) {
      toast.error("Please upload a shop image");
      return;
    }

    if (!aadharImage) {
      toast.error("Please upload your Aadhaar image");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("name", shop.name);
      formData.append("description", shop.description);
      formData.append("phone", shop.phone);
      formData.append("formattedAddress", shop.formattedAddress);
      formData.append("aadharNumber", shop.aadharNumber);
      formData.append("shopType", shop.shopType);
      formData.append("latitude", latitude);
      formData.append("longitude", longitude);
      formData.append("image", image);
      formData.append("aadharImage", aadharImage);

      await createShop(formData);

      setShop((prev) => ({
        ...prev,
        name: "",
        description: "",
        phone: "",
        formattedAddress: "",
        aadharNumber: "",
        shopType: "",
      }));
      setLatitude(null);
      setLongitude(null);
      setLocationMessage("");

      toast.success("Shop Created Successfully");
      getMyShop();
      navigate("/seller/dashboard");
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Failed to create shop");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-emerald-50 via-white to-slate-100 flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-xl">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
            <Store size={40} className="text-emerald-600" />
          </div>

          <h1 className="text-4xl font-bold mt-5">Create Your Shop</h1>
          <p className="text-gray-500 mt-2">
            Complete your shop profile to start selling.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="font-semibold">Shop Name</label>
            <input
              type="text"
              name="name"
              value={shop.name}
              onChange={handleChange}
              placeholder="Fresh Mart"
              className="w-full mt-2 border rounded-xl p-3 outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>

          <div>
            <label className="font-semibold">Shop Type</label>
            <select
              name="shopType"
              value={shop.shopType}
              onChange={handleChange}
              className="w-full mt-2 border rounded-xl p-3 outline-none focus:ring-2 focus:ring-emerald-500"
              required
            >
              <option value="">Select Shop Type</option>
              {Object.keys(SHOP_CATEGORIES).map((key) => (
                <option key={key} value={key}>
                  {SHOP_CATEGORIES[key].name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-semibold">Description</label>
            <textarea
              rows={3}
              name="description"
              value={shop.description}
              onChange={handleChange}
              placeholder="Describe your shop..."
              className="w-full mt-2 border rounded-xl p-3 outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="font-semibold">Phone Number</label>
            <input
              type="number"
              name="phone"
              value={shop.phone}
              onChange={handleChange}
              placeholder="9876543210"
              className="w-full mt-2 border rounded-xl p-3 outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <p className="font-semibold py-2">Upload Shop Image</p>
            <label className="flex cursor-pointer items-center gap-3 rounded-lg border p-4 text-sm text-gray-600 hover:bg-gray-50">
              <Upload className="w-5 h-5 text-green-700" />
              {image ? image.name : "Upload Shop image"}
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleImageChange}
                className="w-full mt-2"
              />
            </label>
          </div>

          <div>
            <p className="font-semibold py-2">Upload Aadhaar Image</p>
            <label className="flex cursor-pointer items-center gap-3 rounded-lg border p-4 text-sm text-gray-600 hover:bg-gray-50">
              <Upload className="w-5 h-5 text-green-400" />
              {aadharImage ? aadharImage.name : "Upload Aadhaar image"}
              <input
                type="file"
                accept="image/*"
                onChange={handleAadharChange}
                hidden
                className="w-full mt-2"
              />
            </label>
          </div>

          <div>
            <label className="font-semibold">Aadhaar Number</label>
            <input
              type="text"
              name="aadharNumber"
              value={shop.aadharNumber}
              onChange={handleChange}
              placeholder="123412341234"
              className="w-full mt-2 border rounded-xl p-3 outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="font-semibold">Shop Address</label>

            <div className="mt-2 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
                <Map
                  mapId="gali-mart-shop-map"
                  center={selectedLocation}
                  defaultZoom={13}
                  onClick={handleMapClick}
                  onLoad={(map) => {
                    mapRef.current = map;
                  }}
                  style={{ width: "100%", height: "260px" }}
                >
                  {latitude !== null && longitude !== null && (
                    <AdvancedMarker position={{ lat: latitude, lng: longitude }} />
                  )}
                </Map>
              </APIProvider>
            </div>

            <button
              type="button"
              onClick={getCurrentLocation}
              disabled={locationLoading}
              className="mt-4 w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {locationLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                  Fetching Location...
                </span>
              ) : locationMessage ? (
                "Location fetched"
              ) : (
                "Use Current Location"
              )}
            </button>

            <div className="mt-4">
              {shop.formattedAddress ? (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                  <div className="flex gap-3">
                    <div className="text-xl">📍</div>
                    <div>
                      <p className="font-semibold text-gray-900">Selected Shop Location</p>
                      <p className="mt-1 text-sm leading-6 text-gray-600">
                        {shop.formattedAddress}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-gray-500">
                  Click "Use Current Location" or select a location on the map.
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-2xl font-semibold disabled:opacity-60"
          >
            {loading ? "Creating..." : "Create Shop"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateShop;
