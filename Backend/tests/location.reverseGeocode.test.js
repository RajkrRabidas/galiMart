const assert = require("assert");

const { extractCityFromGoogleResponse, isValidCoordinates } = require("../controllers/location.controller");

(async () => {
  try {
    const city = extractCityFromGoogleResponse({
      formatted_address: "Mumbai, Maharashtra, India",
      address_components: [
        { long_name: "Mumbai", short_name: "BOM", types: ["locality", "political"] },
        { long_name: "Mumbai", short_name: "MH", types: ["administrative_area_level_2", "political"] },
        { long_name: "Maharashtra", short_name: "MH", types: ["administrative_area_level_1", "political"] },
        { long_name: "India", short_name: "IN", types: ["country", "political"] },
      ],
    });

    assert.strictEqual(city, "Mumbai", "Should prefer locality over administrative area");
    assert.strictEqual(isValidCoordinates(19.076, 72.8777), true, "Valid coordinates should pass");
    assert.strictEqual(isValidCoordinates(91, 72.8777), false, "Invalid latitude should fail");

    console.log("location reverse geocode tests passed");
  } catch (error) {
    console.error(error);
    process.exitCode = 1;
  }
})();
