const axios = require("axios");

const GOOGLE_GEOCODE_URL = "https://maps.googleapis.com/maps/api/geocode/json";
const OSM_REVERSE_GEOCODE_URL = "https://nominatim.openstreetmap.org/reverse";

const isValidCoordinates = (latitude, longitude) => {
  const lat = Number(latitude);
  const lon = Number(longitude);

  if (![lat, lon].every((value) => Number.isFinite(value))) {
    return false;
  }

  return lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180;
};

const extractCityFromGoogleResponse = (googleResult = {}) => {
  const addressComponents = googleResult.address_components || [];
  const preferredTypes = ["locality", "postal_town", "administrative_area_level_2"];

  for (const type of preferredTypes) {
    const match = addressComponents.find((component) => component.types?.includes(type));
    if (match?.long_name) {
      return match.long_name;
    }
  }

  return undefined;
};

const buildFallbackLocation = (latitude, longitude) => ({
  latitude,
  longitude,
  formattedAddress: `Selected location (${latitude.toFixed(5)}, ${longitude.toFixed(5)})`,
  city: undefined,
});

const reverseGeocodeWithOpenStreetMap = async (latitude, longitude) => {
  const response = await axios.get(OSM_REVERSE_GEOCODE_URL, {
    params: {
      format: "jsonv2",
      lat: latitude,
      lon: longitude,
      zoom: 18,
      addressdetails: 1,
    },
    headers: {
      // Nominatim requires an identifying user agent.
      "User-Agent": "GaliMart/1.0 (delivery-address-lookup)",
    },
    timeout: 8000,
  });

  const address = response?.data?.display_name;
  if (!address) {
    throw new Error("Readable address not found");
  }

  return {
    latitude,
    longitude,
    formattedAddress: address,
    city: response.data.address?.city || response.data.address?.town || response.data.address?.village,
  };
};

const resolveReadableLocation = async (latitude, longitude) => {
  if (process.env.GOOGLE_MAPS_API_KEY) {
    try {
      const googleResponse = await axios.get(GOOGLE_GEOCODE_URL, {
        params: {
          latlng: `${latitude},${longitude}`,
          key: process.env.GOOGLE_MAPS_API_KEY,
        },
        timeout: 8000,
      });

      const googleResult = googleResponse?.data?.results?.[0];
      if (googleResponse?.data?.status === "OK" && googleResult?.formatted_address) {
        return {
          latitude,
          longitude,
          formattedAddress: googleResult.formatted_address,
          city: extractCityFromGoogleResponse(googleResult),
          addressComponents: googleResult.address_components || [],
          placeId: googleResult.place_id,
        };
      }

      console.warn("Google reverse geocoding returned:", googleResponse?.data?.status);
    } catch (error) {
      console.warn("Google reverse geocoding failed:", error?.response?.status || error.message);
    }
  }

  try {
    return await reverseGeocodeWithOpenStreetMap(latitude, longitude);
  } catch (error) {
    console.warn("Readable reverse geocoding failed:", error.message);
    return null;
  }
};

const reverseGeocodeLocation = async (req, res) => {
  const rawLatitude = req.query.latitude;
  const rawLongitude = req.query.longitude;

  if (rawLatitude === undefined || rawLongitude === undefined) {
    return res.status(400).json({
      success: false,
      message: "Latitude and longitude are required",
    });
  }

  const latitude = Number(rawLatitude);
  const longitude = Number(rawLongitude);

  if (!isValidCoordinates(latitude, longitude)) {
    return res.status(400).json({
      success: false,
      message: "Invalid latitude or longitude",
    });
  }

  const location = await resolveReadableLocation(latitude, longitude);

  if (!location?.formattedAddress) {
    return res.status(404).json({
      success: false,
      message: "Readable address not found",
    });
  }

  return res.json({
    success: true,
    location,
    source: process.env.GOOGLE_MAPS_API_KEY ? "google-or-openstreetmap" : "openstreetmap",
  });
};

module.exports = {
  isValidCoordinates,
  extractCityFromGoogleResponse,
  reverseGeocodeWithOpenStreetMap,
  resolveReadableLocation,
  reverseGeocodeLocation,
};
