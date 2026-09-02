import { useNavigate } from "react-router-dom";
import { useServices } from "../../context/ServiceContext";
import BottomNavbar from "../../components/Service/BottomNavbar";
import toast from "react-hot-toast";

const Services = () => {

  const navigate = useNavigate();

  const { getMyBusiness, deleteService } = useServices();

  const business = getMyBusiness();

  if (!business) {

    return (

      <div className="min-h-screen flex justify-center items-center">

        <h2 className="text-2xl font-bold">

          No Business Found

        </h2>

      </div>

    );

  }

  return (

    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-slate-100 pb-24">

      <div className="max-w-7xl mx-auto p-6">

        <div className="flex justify-between items-center mb-8">

          <h1 className="text-4xl font-bold">

            My Services

          </h1>

          <button

            onClick={() =>
              navigate("/service/add-service")
            }

            className="bg-emerald-600 text-white px-6 py-3 rounded-xl cursor-pointer"

          >

            + Add Service

          </button>

        </div>

        {

          business.services.length === 0 ? (

            <div className="bg-white rounded-3xl shadow-lg p-12 text-center">

              <h2 className="text-2xl font-bold">

                No Services Yet

              </h2>

            </div>

          ) : (

            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

              {

                business.services.map(service => (

                  <div
                    key={service.id}
                    className="bg-white rounded-3xl shadow-lg overflow-hidden"
                  >

                    <img
                      src={service.image}
                      className="w-full h-48 object-cover"
                    />

                    <div className="p-5">

                      <h2 className="text-xl font-bold">

                        {service.name}

                      </h2>

                      <p className="text-gray-500 mt-2">

                        {service.category}

                      </p>

                      <p className="text-emerald-600 text-2xl font-bold mt-4">

                        ₹{service.price}

                      </p>

                      <div className="flex gap-3 mt-6">

                        <button

                          onClick={() =>
                            navigate(`/service/edit-service/${service.id}`)
                          }

                          className="flex-1 bg-blue-600 text-white py-3 rounded-xl cursor-pointer"

                        >

                          Edit

                        </button>

                        <button

                          onClick={() => {

                            deleteService(

                              business.owner,

                              service.id

                            );

                            toast.success("Service Deleted");

                          }}

                          className="flex-1 bg-red-600 text-white py-3 rounded-xl cursor-pointer"

                        >

                          Delete

                        </button>

                      </div>

                    </div>

                  </div>

                ))

              }

            </div>

          )

        }

      </div>

      <BottomNavbar />

    </div>

  );

};

export default Services;