import { createContext, useContext, useState } from "react";

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {

  const [orders, setOrders] = useState([]);

  const placeOrder = (cartItems, totalPrice) => {

    const newOrder = {
      id: "GM" + Date.now(),
      items: cartItems,
      total: totalPrice,
      status: "Processing",
      date: new Date().toLocaleDateString(),
    };

    setOrders(prev => [newOrder, ...prev]);
  };
  const cancelOrder = (id) => {
  setOrders((prev) =>
    prev.map((order) =>
      order.id === id
        ? {
            ...order,
            status: "Cancelled",
          }
        : order
    )
  );
};

const updateOrderStatus = (id, status) => {
  setOrders((prev) =>
    prev.map((order) =>
      order.id === id
        ? {
            ...order,
            status,
          }
        : order
    )
  );
};
  

  return (
    <OrderContext.Provider
      value={{
        orders,
        placeOrder,
        cancelOrder,
updateOrderStatus,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => useContext(OrderContext);