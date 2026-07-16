import { useMarketplace } from "../../../context/MarketplaceContext";
import { useShops } from "../../../context/ShopContext";

const RecentOrders = () => {

  const { shops } = useShops();

  const { getSellerOrders } = useMarketplace();

  const owner = localStorage.getItem("shopOwner");

  const orders = getSellerOrders(owner, shops)
    .slice(0, 5);

  return (

    <div className="bg-white rounded-3xl shadow-lg p-6">

      <h2 className="text-2xl font-bold mb-6">

        Recent Orders

      </h2>

      {

        orders.length === 0 ? (

          <div className="text-center py-10 text-gray-500">

            No Orders Yet

          </div>

        ) : (

          <div className="space-y-5">

            {

              orders.map((order) => (

                <div
                  key={order.id}
                  className="flex justify-between items-center border-b pb-4"
                >

                  <div>

                    <h3 className="font-semibold">

                      {order.customerId}

                    </h3>

                    <p className="text-gray-500 text-sm">

                      {order.id}

                    </p>

                  </div>

                  <div className="text-right">

                    <h3 className="font-bold">

                      ₹{order.total}

                    </h3>

                    <p className="text-sm text-emerald-600">

                      {order.orderStatus}

                    </p>

                  </div>

                </div>

              ))

            }

          </div>

        )

      }

    </div>

  );

};

export default RecentOrders;