import {
  Briefcase,
  CalendarDays,
  IndianRupee,
  Clock,
} from "lucide-react";

import BottomNavbar from "../../components/Service/BottomNavbar";
import { useServices } from "../../context/ServiceContext";
import { useServiceBookings } from "../../context/ServiceBookingContext";

const Dashboard = () => {

  const hour = new Date().getHours();

  let greeting = "Good Evening";

  if (hour < 12) {

    greeting = "Good Morning";

  } else if (hour < 18) {

    greeting = "Good Afternoon";

  }
  const { getMyBusiness } = useServices();

  const { getMyBookings } = useServiceBookings();

  const business = getMyBusiness();

  const bookings = getMyBookings();

  const services = business?.services || [];

  const revenue = bookings.reduce(
    (sum, booking) => sum + booking.price,
    0
  );

  const pending = bookings.filter(
    booking => booking.status === "Pending"
  ).length;

  const cards = [

  {
    title: "Services",
    value: services.length,
    icon: <Briefcase className="text-white" size={28} />,
    color: "bg-blue-600",
  },

  {
    title: "Bookings",
    value: bookings.length,
    icon: <CalendarDays className="text-white" size={28} />,
    color: "bg-emerald-600",
  },

  {
    title: "Revenue",
    value: `₹${revenue}`,
    icon: <IndianRupee className="text-white" size={28} />,
    color: "bg-purple-600",
  },

  {
    title: "Pending",
    value: pending,
    icon: <Clock className="text-white" size={28} />,
    color: "bg-orange-500",
  },

];

  return (

    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-slate-100 pb-24">

      <div className="max-w-7xl mx-auto p-6">

        <div className="mb-10">

          <h1 className="text-4xl font-bold">

            {greeting} 👋

          </h1>

          <p className="text-gray-500 mt-2">

            Welcome back to your service dashboard.

          </p>

        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">

          {

            cards.map((card) => (

              <div
                key={card.title}
                className="bg-white rounded-3xl shadow-lg p-6"
              >

                <div
                  className={`w-14 h-14 rounded-2xl ${card.color} flex justify-center items-center`}
                >

                  {card.icon}

                </div>

                <h2 className="text-gray-500 mt-5">

                  {card.title}

                </h2>

                <h1 className="text-3xl font-bold mt-2">

                  {card.value}

                </h1>

              </div>

            ))

          }

        </div>

        <div className="bg-white rounded-3xl shadow-lg p-8 mt-10">

          <h2 className="text-2xl font-bold">

            Recent Bookings

          </h2>

          {bookings.length === 0 ? (

  <div className="text-center text-gray-500 mt-8">

    No Bookings Yet

  </div>

) : (

  <div className="space-y-4 mt-6">

    {bookings.map((booking) => (

      <div
        key={booking.id}
        className="flex justify-between items-center border-b pb-4"
      >

        <div>

          <h3 className="font-semibold">

            {booking.serviceName}

          </h3>

          <p className="text-gray-500 text-sm">

            {booking.customer}

          </p>

        </div>

        <div className="text-right">

          <p className="font-bold text-emerald-600">

            ₹{booking.price}

          </p>

          <p className="text-sm text-orange-500">

            {booking.status}

          </p>

        </div>

      </div>

    ))}

  </div>

)}

        </div>

      </div>

      <BottomNavbar />

    </div>

  );

};

export default Dashboard;