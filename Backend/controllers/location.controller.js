const axios = require("axios");

const GOOGLE_GEOCODE_URL = "https://maps.googleapis.com/maps/api/geocode/json";

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
  formattedAddress: `Lat ${latitude.toFixed(4)}, Lng ${longitude.toFixed(4)}`,
  city: undefined,
});

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

  if (!process.env.GOOGLE_MAPS_API_KEY) {
    console.warn("Google Maps API key is missing. Falling back to raw coordinates.");
    return res.json({
      success: true,
      location: buildFallbackLocation(latitude, longitude),
      fallback: true,
    });
  }

  try {
    const googleResponse = await axios.get(GOOGLE_GEOCODE_URL, {
      params: {
        latlng: `${latitude},${longitude}`,
        key: process.env.GOOGLE_MAPS_API_KEY,
      },
      timeout: 8000,
    });

    const googleStatus = googleResponse?.data?.status;
    const googleResults = googleResponse?.data?.results || [];

    if (googleStatus !== "OK" || googleResults.length === 0) {
      return res.json({
        success: true,
        location: buildFallbackLocation(latitude, longitude),
        fallback: true,
      });
    }

    const primaryResult = googleResults[0];
    const city = extractCityFromGoogleResponse(primaryResult);

    return res.json({
      success: true,
      location: {
        latitude,
        longitude,
        formattedAddress: primaryResult?.formatted_address || `Lat ${latitude.toFixed(4)}, Lng ${longitude.toFixed(4)}`,
        city,
      },
    });
  } catch (error) {
    console.warn("Google reverse geocoding failed, using raw coordinates instead:", error?.response?.status || error.message);
    return res.json({
      success: true,
      location: buildFallbackLocation(latitude, longitude),
      fallback: true,
    });
  }
};

module.exports = {
  isValidCoordinates,
  extractCityFromGoogleResponse,
  reverseGeocodeLocation,
};
