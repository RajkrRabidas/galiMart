import BottomNavbar from "../../components/BottomNavbar/BottomNavbar";
import { useServiceBookings } from "../../context/ServiceBookingContext";

const MyServiceBookings = () => {

  const { getCustomerBookings } =
    useServiceBookings();

  const bookings =
    getCustomerBookings();

  return (

    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-slate-100 pb-24">

      <div className="max-w-5xl mx-auto p-6">

        <h1 className="text-4xl font-bold mb-8">

          My Service Bookings

        </h1>

        {

          bookings.length === 0 ? (

            <div className="bg-white rounded-3xl shadow-lg p-10 text-center">

              No Bookings Yet

            </div>

          ) : (

            <div className="space-y-5">

              {

                bookings.map(booking => (

                  <div
                    key={booking.id}
                    className="bg-white rounded-3xl shadow-lg p-6"
                  >

                    <h2 className="text-2xl font-bold">

                      {booking.serviceName}

                    </h2>

                    <p className="text-gray-500 mt-2">

                      {booking.providerName}

                    </p>

                    <p className="text-emerald-600 font-bold mt-3">

                      ₹{booking.price}

                    </p>

                    <p className="mt-3">

                      Status :

                      <span className="font-bold text-orange-500">

                        {" "}

                        {booking.status}

                      </span>

                    </p>

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

export default MyServiceBookings;