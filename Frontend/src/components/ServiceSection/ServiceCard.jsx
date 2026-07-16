import { useNavigate } from "react-router-dom";

const ServiceCard = ({ service }) => {
  const navigate = useNavigate();

  return (

    <div className="min-w-[220px] bg-white rounded-3xl shadow-md overflow-hidden hover:shadow-xl transition">

      <img
        src={service.image}
        alt={service.name}
        className="w-full h-36 object-cover"
      />

      <div className="p-4">

        <h3 className="font-bold text-lg">

          {service.name}

        </h3>

        <p className="text-sm text-gray-500 mt-1">

          {service.providerName}

        </p>

        <p className="text-xs text-gray-400">

          {service.providerCategory}

        </p>

        <p className="text-emerald-600 font-bold text-lg mt-3">

          ₹{service.price}

        </p>

        <button

  onClick={() =>
    navigate(`/service/${service.id}`)
  }

  className="mt-4 w-full bg-emerald-600 text-white rounded-xl py-2 hover:bg-emerald-700 transition"

>

  Book Now

</button>

      </div>

    </div>

  );

};

export default ServiceCard;