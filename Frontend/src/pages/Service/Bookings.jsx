import BottomNavbar from "../../components/Service/BottomNavbar";
import { useServiceBookings } from "../../context/ServiceBookingContext";

const Bookings = () => {

  const {
  getMyBookings,
  updateBookingStatus,
} = useServiceBookings();

  const bookings = getMyBookings();

  return (

    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-slate-100 pb-24">

      <div className="max-w-6xl mx-auto p-6">

        <h1 className="text-4xl font-bold mb-8">

          Service Bookings

        </h1>

        {

          bookings.length === 0 ? (

            <div className="bg-white rounded-3xl shadow-lg p-10 text-center">

              <h2 className="text-2xl font-bold">

                No Bookings Yet

              </h2>

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

                      Customer : {booking.customer}

                    </p>

                    <p className="text-emerald-600 mt-2 font-bold">

                      ₹{booking.price}

                    </p>

                    <p className="mt-2">

                      Status :

                      <span className="text-orange-500 font-semibold">

                        {" "}
                        {booking.status}

                      </span>

                    </p>
                    <div className="flex gap-2 mt-5">

  <button
  disabled={booking.status !== "Pending"}

  onClick={() =>
    updateBookingStatus(
      booking.id,
      "Accepted"
    )
  }

  className={`flex-1 py-2 rounded-xl text-white cursor-pointer ${
    booking.status !== "Pending"
      ? "bg-gray-400 cursor-not-allowed"
      : "bg-emerald-600 hover:bg-emerald-700"
  }`}
>
  Accept
</button>

  <button
  disabled={booking.status !== "Pending"}

  onClick={() =>
    updateBookingStatus(
      booking.id,
      "Rejected"
    )
  }

  className={`flex-1 py-2 rounded-xl text-white cursor-pointer ${
    booking.status !== "Pending"
      ? "bg-gray-400 cursor-not-allowed"
      : "bg-red-500 hover:bg-red-600"
  }`}
>
  Reject
</button>

  <button
  disabled={booking.status === "Completed"}

  onClick={() =>
    updateBookingStatus(
      booking.id,
      "Completed"
    )
  }

  className={`flex-1 py-2 rounded-xl text-white cursor-pointer ${
    booking.status === "Completed"
      ? "bg-gray-400 cursor-not-allowed"
      : "bg-blue-600 hover:bg-blue-700"
  }`}
>
  Complete
</button>

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

export default Bookings;