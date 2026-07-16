import { useParams } from "react-router-dom";
import { useServices } from "../../context/ServiceContext";
import { useServiceBookings } from "../../context/ServiceBookingContext";
import BottomNavbar from "../../components/BottomNavbar/BottomNavbar";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const ServiceDetails = () => {

  const { id } = useParams();
  
  const navigate = useNavigate();
  const { providers } = useServices();
  const { bookService } = useServiceBookings();

  const service = providers
    .flatMap(provider =>
      provider.services.map(item => ({
        ...item,
        providerName: provider.businessName,
      }))
    )
    .find(item => item.id.toString() === id);

  if (!service) {

    return (

      <div className="min-h-screen flex justify-center items-center">

        <h2 className="text-3xl font-bold">

          Service Not Found

        </h2>

      </div>

    );

  }

  return (

    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-slate-100 pb-24">

      <div className="max-w-5xl mx-auto p-6">

        <img
          src={service.image}
          className="w-full h-96 object-cover rounded-3xl"
        />

        <div className="bg-white rounded-3xl shadow-lg p-8 mt-8">

          <h1 className="text-4xl font-bold">

            {service.name}

          </h1>

          <p className="text-gray-500 mt-2">

            {service.providerName}

          </p>

          <p className="text-emerald-600 text-3xl font-bold mt-5">

            ₹{service.price}

          </p>

          <p className="mt-6 text-gray-700">

            {service.description}

          </p>

          <button

  onClick={() => {

    bookService({

      owner: providers.find(provider =>
        provider.businessName === service.providerName
      )?.owner,

      customer: "Current Customer",

      serviceName: service.name,

      providerName: service.providerName,

      price: service.price,

    });

    toast.success("Service Booked Successfully");
    navigate("/my-service-bookings");

  }}

  className="mt-10 w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-2xl"

>

  Book Service

</button>

        </div>

      </div>

      <BottomNavbar />

    </div>

  );

};

export default ServiceDetails;