import ShopCard from "./ShopCard";
import { useShops } from "../../context/ShopContext";

const ShopSection = () => {

  const { shops } = useShops();

  return (
    <div className="mt-10">

      <div className="flex justify-between items-center">

        <h2 className="text-xl font-bold">
          Popular Shops
        </h2>

        <button className="text-emerald-600 font-semibold">
          View All
        </button>

      </div>

      {
        shops.length === 0 ? (

          <div className="bg-white rounded-3xl shadow-lg mt-5 p-10 text-center">

            <h2 className="text-xl font-bold">

              No Shops Available

            </h2>

            <p className="text-gray-500 mt-2">

              Shops created by shopkeepers will appear here.

            </p>

          </div>

        ) : (

          <div className="flex gap-5 mt-5 overflow-x-auto pb-3">

            {shops.map((shop) => (

              <ShopCard
                key={shop._id}
                shop={shop}
              />

            ))}

          </div>

        )

      }

    </div>
  );
};

export default ShopSection;