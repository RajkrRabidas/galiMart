import { useNavigate } from "react-router-dom";
import BottomNavbar from "../../components/DeliveryPartner/BottomNavbar";
import { useMarketplace } from "../../context/MarketplaceContext";

const Profile = () => {

  const navigate = useNavigate();

  const profile = JSON.parse(
    localStorage.getItem("deliveryProfile")
  );

  const { orders } = useMarketplace();

  const completed = orders.filter(

    order =>

      order.deliveryPartner === profile?.phone &&

      order.orderStatus === "Delivered"

  );

  const earnings = completed.length * 50;

  const logout = () => {

    localStorage.removeItem("role");

    localStorage.removeItem("deliveryPartner");

    navigate("/login");

  };

  return (

    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-slate-100 pb-24">

      <div className="max-w-4xl mx-auto p-6">

        <div className="bg-white rounded-3xl shadow-lg p-8">

          <div className="flex justify-center">

            <img
              src="https://picsum.photos/250"
              className="w-32 h-32 rounded-full object-cover"
            />

          </div>

          <h1 className="text-3xl font-bold text-center mt-6">

            {profile?.name}

          </h1>

          <p className="text-center text-gray-500 mt-2">

            {profile?.phone}

          </p>

          <div className="mt-8 space-y-4">

            <div className="bg-gray-100 rounded-xl p-4">

              <h3 className="font-semibold">

                Vehicle

              </h3>

              <p>

                {profile?.vehicleType}

              </p>

            </div>

            <div className="bg-gray-100 rounded-xl p-4">

              <h3 className="font-semibold">

                Vehicle Number

              </h3>

              <p>

                {profile?.vehicleNumber}

              </p>

            </div>

            <div className="bg-gray-100 rounded-xl p-4">

              <h3 className="font-semibold">

                Area

              </h3>

              <p>

                {profile?.area}

              </p>

            </div>

            <div className="bg-gray-100 rounded-xl p-4">

              <h3 className="font-semibold">

                Completed Deliveries

              </h3>

              <p>

                {completed.length}

              </p>

            </div>

            <div className="bg-gray-100 rounded-xl p-4">

              <h3 className="font-semibold">

                Earnings

              </h3>

              <p>

                ₹{earnings}

              </p>

            </div>

          </div>

          <button
            onClick={logout}
            className="w-full mt-10 bg-red-500 text-white py-4 rounded-2xl cursor-pointer"
          >

            Logout

          </button>

        </div>

      </div>

      <BottomNavbar />

    </div>

  );

};

export default Profile;