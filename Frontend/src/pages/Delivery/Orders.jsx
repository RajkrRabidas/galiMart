import BottomNavbar from "../../components/DeliveryPartner/BottomNavbar";
import DeliveryCard from "../../components/DeliveryPartner/DeliveryCard";
import { useMarketplace } from "../../context/MarketplaceContext";

const Orders = () => {

  const {
    orders,
    assignDeliveryPartner,
    updateOrderStatus,
  } = useMarketplace();

  const partnerId =
    localStorage.getItem("deliveryPartner") || "delivery1";

  const availableOrders = orders.filter(

    order =>

      order.orderStatus === "Out For Delivery" &&

      !order.deliveryPartner

  );

  const myOrders = orders.filter(

    order =>

      order.deliveryPartner === partnerId

  );

  return (

    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-slate-100 pb-24">

      <div className="max-w-6xl mx-auto p-6">

        <h1 className="text-4xl font-bold mb-8">

          Deliveries

        </h1>

        {/* Available */}

        <h2 className="text-2xl font-bold mb-5">

          Available Deliveries

        </h2>

        {

          availableOrders.length === 0 ? (

            <div className="bg-white rounded-3xl shadow-lg p-8 text-center mb-10">

              No Available Deliveries

            </div>

          ) : (

            <div className="space-y-5 mb-10">

              {

                availableOrders.map(order => (

                  <DeliveryCard

                    key={order.id}

                    order={order}

                    buttonText="Accept Delivery"

                    onClick={() =>

                      assignDeliveryPartner(

                        order.id,

                        partnerId

                      )

                    }

                  />

                ))

              }

            </div>

          )

        }

        {/* My Deliveries */}

        <h2 className="text-2xl font-bold mb-5">

          My Deliveries

        </h2>

        {

          myOrders.length === 0 ? (

            <div className="bg-white rounded-3xl shadow-lg p-8 text-center">

              No Active Deliveries

            </div>

          ) : (

            <div className="space-y-5">

              {

                myOrders.map(order => (

                  <DeliveryCard

                    key={order.id}

                    order={order}

                    buttonText={

                      order.orderStatus === "Out For Delivery"

                        ? "Mark Delivered"

                        : "Delivered"

                    }

                    disabled={

                      order.orderStatus === "Delivered"

                    }

                    onClick={() =>

                      updateOrderStatus(

                        order.id,

                        "Delivered"

                      )

                    }

                  />

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

export default Orders;