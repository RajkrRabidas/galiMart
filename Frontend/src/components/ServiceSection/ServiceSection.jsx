import ServiceCard from "./ServiceCard";
import { useServices } from "../../context/ServiceContext";

const ServiceSection = () => {

  const { providers } = useServices();

  const services = providers.flatMap((provider) =>
    provider.services.map((service) => ({
      ...service,
      providerName: provider.businessName,
      providerCategory: provider.category,
    }))
  );

  return (

    <div className="mt-10 mb-28">

      <div className="flex justify-between items-center">

        <h2 className="text-xl font-bold">

          Nearby Services

        </h2>

        <button className="text-emerald-600 font-semibold">

          View All

        </button>

      </div>

      {

        services.length === 0 ? (

          <div className="bg-white rounded-3xl shadow-lg p-10 text-center mt-5">

            <h2 className="text-xl font-bold">

              No Services Available

            </h2>

            <p className="text-gray-500 mt-2">

              Service providers haven't added any services yet.

            </p>

          </div>

        ) : (

          <div className="flex gap-5 overflow-x-auto mt-5 pb-2">

            {

              services.map((service) => (

                <ServiceCard

                  key={service.id}

                  service={service}

                />

              ))

            }

          </div>

        )

      }

    </div>

  );

};

export default ServiceSection;