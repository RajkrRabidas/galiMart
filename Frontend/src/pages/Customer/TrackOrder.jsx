import { useParams } from "react-router-dom";
import { useOrders } from "../../context/OrderContext";
import BottomNavbar from "../../components/BottomNavbar/BottomNavbar";

const steps = [
  "Processing",
  "Packed",
  "Out for Delivery",
  "Delivered",
];

const TrackOrder = () => {

  const { id } = useParams();

  const { orders } = useOrders();

  const order = orders.find((o) => o.id === id);

  if (!order)
    return (
      <div className="text-center mt-20">
        Order Not Found
      </div>
    );

  const current = steps.indexOf(order.status);

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-slate-100">

      <div className="max-w-3xl mx-auto p-6 pb-24">

        <h1 className="text-4xl font-bold mb-10">

          Track Order

        </h1>

        {steps.map((step, index) => (

          <div
            key={step}
            className="flex gap-4 mb-8"
          >

            <div
              className={`w-6 h-6 rounded-full ${
                index <= current
                  ? "bg-emerald-600"
                  : "bg-gray-300"
              }`}
            />

            <div>

              <h2 className="font-bold">

                {step}

              </h2>

              <p className="text-gray-500">

                {index <= current
                  ? "Completed"
                  : "Waiting..."}

              </p>

            </div>

          </div>

        ))}

      </div>

      <BottomNavbar />

    </div>
  );
};

export default TrackOrder;