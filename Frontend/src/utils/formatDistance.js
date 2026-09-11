const toNumber = (value) => {
  if (typeof value === "number") return value;
  if (typeof value !== "string") return null;

  const parsed = Number.parseFloat(value.replace(/,/g, ""));
  return Number.isFinite(parsed) ? parsed : null;
};

export const formatShopDistance = (shop) => {
  const distanceKm = toNumber(shop?.distanceKm);

  if (distanceKm !== null) {
    return Number(distanceKm.toFixed(1)).toString();
  }

  const distance = toNumber(shop?.distance);
  if (distance === null) return "0";

  // MongoDB's $geoNear distance is in meters; support strings already marked in km too.
  const distanceInKm = typeof shop.distance === "string" && /km/i.test(shop.distance)
    ? distance
    : distance / 1000;

  return Number(distanceInKm.toFixed(1)).toString();
};
