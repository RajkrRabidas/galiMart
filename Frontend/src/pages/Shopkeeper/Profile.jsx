import { useNavigate } from "react-router-dom";
import BottomNavbar from "../../components/Shopkeeper/BottomNavbar";
import { useShops } from "../../context/ShopContext";

const Profile = () => {

  const navigate = useNavigate();

  const { getMyShop } = useShops();

  const shop = getMyShop();

  const owner = localStorage.getItem("shopOwner");

  const logout = () => {

    localStorage.removeItem("role");

    localStorage.removeItem("shopOwner");

    navigate("/login");

  };

  return (

    <div className="min-h-screen bg-linear-to-b from-emerald-50 via-white to-slate-100 pb-24">

      <div className="max-w-4xl mx-auto p-6">

        <div className="bg-white rounded-3xl shadow-lg p-8">

          <div className="flex justify-center">

            <img
              src={shop?.image || "https://picsum.photos/200"}
              alt="Shop"
              className="w-32 h-32 rounded-full object-cover"
            />

          </div>

          <h1 className="text-3xl font-bold text-center mt-6">

            {shop?.shopName || "My Shop"}

          </h1>

          <p className="text-center text-gray-500 mt-2">

            {owner}

          </p>

          <div className="mt-8 space-y-4">

            <div className="bg-gray-100 rounded-xl p-4">

              <h3 className="font-semibold">

                Address

              </h3>

              <p className="text-gray-600">

                {shop?.autoLocation?.formattedAddress || shop?.address || "Address unavailable"}

              </p>

            </div>

            <div className="bg-gray-100 rounded-xl p-4">

              <h3 className="font-semibold">

                Products

              </h3>

              <p className="text-gray-600">

                {shop?.products?.length || 0}

              </p>

            </div>

          </div>

          <button

            onClick={logout}

            className="w-full mt-10 bg-red-500 hover:bg-red-600 text-white py-4 rounded-2xl"

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