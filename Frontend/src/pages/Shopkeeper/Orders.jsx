import { useShops } from "../../context/ShopContext";
import { useMarketplace } from "../../context/MarketplaceContext";
import toast from "react-hot-toast";
import BottomNavbar from "../../components/Shopkeeper/BottomNavbar";

const Orders = () => {

  const { shops } = useShops();

  const {
    getSellerOrders,
    updateOrderStatus,
  } = useMarketplace();

  const owner =
    localStorage.getItem("shopOwner");

  const orders =
    getSellerOrders(owner, shops);

  const nextStatus = (status) => {

    switch (status) {

      case "Processing":
        return "Accepted";

      case "Accepted":
        return "Preparing";

      case "Preparing":
        return "Out For Delivery";

      case "Out For Delivery":
        return "Delivered";

      default:
        return "Delivered";

    }

  };

  return (

    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-slate-100 pb-24">

      <div className="max-w-6xl mx-auto p-6">

        <h1 className="text-4xl font-bold mb-8">

          Customer Orders

        </h1>

        {

          orders.length === 0 ? (

            <div className="bg-white rounded-3xl shadow-lg p-16 text-center">

              <h2 className="text-3xl font-bold">

                📦 No Orders Yet

Orders will appear here once customers place an order.

              </h2>

              <p className="text-gray-500 mt-3">

                Orders from customers will appear here.

              </p>

            </div>

          ) : (

            orders.map(order => (

              <div
                key={order.id}
                className="bg-white rounded-3xl shadow-lg p-6 mb-6"
              >

                <div className="flex justify-between">

                  <div>

                    <h2 className="text-xl font-bold">

                      {order.id}

                    </h2>

                    <p className="text-gray-500">

                      {order.shopName}

                    </p>

                  </div>

                  <div className="text-right">

                    <h2 className="text-emerald-600 text-2xl font-bold">

                      ₹{order.total}

                    </h2>

                    <p>

                      {order.orderStatus}

                    </p>

                  </div>

                </div>

                <div className="mt-6">

                  {

                    order.items.map(item => (

                      <div
                        key={item.id}
                        className="flex justify-between py-2"
                      >

                        <span>

                          {item.name}

                        </span>

                        <span>

                          x{item.quantity}

                        </span>

                      </div>

                    ))

                  }

                </div>

                {

                  order.orderStatus !== "Delivered" &&

                  order.orderStatus !== "Cancelled" && (

                    <button

                      onClick={() => {

                        updateOrderStatus(

                          order.id,

                          nextStatus(
                            order.orderStatus
                          )

                        );

                        toast.success(
                          "Order Updated"
                        );

                      }}

                      className="mt-6 bg-emerald-600 text-white px-6 py-3 rounded-xl"

                    >

                      Update to {nextStatus(order.orderStatus)}

                    </button>

                  )

                }

              </div>

            ))

          )

        }

      </div>
      <BottomNavbar />

    </div>

  );

};

export default Orders;