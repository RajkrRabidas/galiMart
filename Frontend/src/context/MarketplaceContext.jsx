import { createContext, useContext, useEffect, useState } from "react";

const MarketplaceContext = createContext();

export const MarketplaceProvider = ({ children }) => {

  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem("marketplaceOrders");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem(
      "marketplaceOrders",
      JSON.stringify(orders)
    );
  }, [orders]);

  // -------------------------
  // CUSTOMER PLACE ORDER
  // -------------------------

  const placeOrder = ({
    customerId,
    shopId,
    shopName,
    items,
    total,
    address,
  }) => {

    const order = {

      id: "GM" + Date.now(),

      customerId,

      shopId,

      shopName,

      items,

      total,

      address,

      date: new Date().toLocaleString(),

      paymentStatus: "Paid",

      orderStatus: "Processing",

    };

    setOrders(prev => [

      order,

      ...prev,

    ]);

    return order;

  };

  // -------------------------
  // SELLER ORDERS
  // -------------------------

  const getSellerOrders = (ownerId, shops) => {

    const myShop = shops.find(
      shop => shop.owner === ownerId
    );

    if (!myShop) return [];

    return orders.filter(
      order => order.shopId === myShop.id
    );

  };

  // -------------------------
  // CUSTOMER ORDERS
  // -------------------------

  const getCustomerOrders = (customerId) => {

    return orders.filter(
      order => order.customerId === customerId
    );

  };

  // -------------------------
  // UPDATE STATUS
  // -------------------------

  const updateOrderStatus = (

    orderId,

    status

  ) => {

    setOrders(prev =>

      prev.map(order =>

        order.id === orderId

          ? {

              ...order,

              orderStatus: status,

            }

          : order

      )

    );

  };
  const assignDeliveryPartner = (
  orderId,
  partnerId
) => {

  setOrders(prev =>

    prev.map(order =>

      order.id === orderId

        ? {

            ...order,

            deliveryPartner: partnerId,

            orderStatus: "Out For Delivery",

          }

        : order

    )

  );

};

  // -------------------------
  // CANCEL
  // -------------------------

  const cancelOrder = (orderId) => {

    setOrders(prev =>

      prev.map(order =>

        order.id === orderId

          ? {

              ...order,

              orderStatus: "Cancelled",

            }

          : order

      )

    );

  };

  return (

    <MarketplaceContext.Provider

      value={{

        orders,

        placeOrder,

        getSellerOrders,

        getCustomerOrders,

        updateOrderStatus,
        
        assignDeliveryPartner,

        cancelOrder,

      }}

    >

      {children}

    </MarketplaceContext.Provider>

  );

};

export const useMarketplace = () =>
  useContext(MarketplaceContext);