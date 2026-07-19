import { useNavigate } from "react-router-dom";

const ShopCard = ({ shop }) => {

  const navigate = useNavigate();

  return (

    <div
      onClick={() =>
        navigate(`/shop/${shop._id}`)
      }
      className="min-w-[260px] bg-white rounded-3xl shadow-lg overflow-hidden cursor-pointer hover:scale-105 transition"
    >

      <img
        src={shop.image}
        alt={shop.name}
        className="w-full h-40 object-cover"
      />

      <div className="p-4">

        <h2 className="text-xl font-bold">

          {shop.name}

        </h2>

        <p className="text-gray-500 mt-2">

          {shop.autoLocation?.formattedAddress}

        </p>

        <div className="flex justify-between mt-4">

          <span className="text-yellow-500">

            ⭐ {shop.rating}

          </span>

          <span className="text-emerald-600">

            {shop.isOpen ? "Open" : "Closed"}

          </span>

        </div>

      </div>

    </div>

  );

};

export default ShopCard;