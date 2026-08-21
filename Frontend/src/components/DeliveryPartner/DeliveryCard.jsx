const DeliveryCard = ({
  order,
  buttonText,
  onClick,
  disabled = false,
}) => {
  const deliveryAddress =
    order.deliveryAddress?.formattedAddress ||
    order.formattedAddress ||
    order.address ||
    "Delivery address unavailable";
  const coordinates = order.deliveryAddress?.latitude && order.deliveryAddress?.longitude
    ? `${order.deliveryAddress.latitude},${order.deliveryAddress.longitude}`
    : null;

  return (

    <div className="bg-white rounded-3xl shadow-lg p-6">

      <div className="flex justify-between items-start">

        <div>

          <h2 className="text-2xl font-bold">

            {order.shopName}

          </h2>

          <p className="text-gray-500 mt-2">

            Order ID : {order.id}

          </p>

          <p className="mt-2 text-sm leading-5 text-gray-600">
            <span className="font-semibold text-gray-800">Delivery address:</span>{" "}
            {deliveryAddress}
          </p>

          {coordinates && (
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${coordinates}`}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-block text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              Open in Google Maps
            </a>
          )}

          <p className="mt-2 font-semibold">

            Items : {order.items.length}

          </p>

          <p className="text-emerald-600 text-xl font-bold mt-3">

            ₹{order.total}

          </p>

          <span className="inline-block mt-3 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-sm font-semibold">

            {order.orderStatus}

          </span>

        </div>

      </div>

      <button

        disabled={disabled}

        onClick={onClick}

        className={`w-full mt-6 py-3 rounded-2xl font-semibold transition-all ${
          disabled
            ? "bg-gray-400 text-white cursor-not-allowed"
            : "bg-emerald-600 hover:bg-emerald-700 text-white"
        }`}

      >

        {buttonText}

      </button>

    </div>

  );

};

export default DeliveryCard;