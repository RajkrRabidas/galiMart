import AddressCard from "../../components/Checkout/AddressCard";
import PaymentMethod from "../../components/Checkout/PaymentMethod";
import OrderSummary from "../../components/Checkout/OrderSummary";
import BottomNavbar from "../../components/BottomNavbar/BottomNavbar";

const Checkout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-slate-100">

      <div className="max-w-7xl mx-auto p-6 pb-24">

        <h1 className="text-4xl font-bold mb-10">
          Checkout
        </h1>

        <div className="grid lg:grid-cols-3 gap-10">

          <div className="lg:col-span-2">

            <AddressCard />

            <PaymentMethod />

          </div>

          <OrderSummary />

        </div>

      </div>

      <BottomNavbar />

    </div>
  );
};

export default Checkout;