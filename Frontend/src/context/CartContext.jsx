import { createContext, useContext, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {

  const [cartItems, setCartItems] = useState([]);

  const addToCart = (product,quantity = 1) => {

    const existing = cartItems.find(
      item => item.id === product.id
    );

    if (existing) {

      setCartItems(
        cartItems.map(item =>
          item.id === product.id
            ? {
                ...item,
                quantity: item.quantity + quantity,
              }
            : item
        )
      );

    } else {

      setCartItems([
        ...cartItems,
        {
          ...product,
        quantity,
        },
      ]);

    }

  };

  const removeFromCart = (id) => {
    setCartItems(
      cartItems.filter(item => item.id !== id)
    );
  };
  const clearCart = () => {
  setCartItems([]);
};

  const increaseQuantity = (id) => {

    setCartItems(
      cartItems.map(item =>
        item.id === id
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item
      )
    );

  };

  const decreaseQuantity = (id) => {

    setCartItems(
      cartItems
        .map(item =>
          item.id === id
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item
        )
        .filter(item => item.quantity > 0)
    );

  };

  const subtotal = cartItems.reduce(
  (total, item) => total + item.price * item.quantity,
  0
);

const delivery = subtotal === 0 ? 0 : subtotal >= 500 ? 0 : 30;

const totalPrice = subtotal + delivery;

  return (

    <CartContext.Provider
      value={{
  cartItems,
  addToCart,
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  clearCart,
  subtotal,
  delivery,
  totalPrice,
}}
    >

      {children}

    </CartContext.Provider>

  );

};

export const useCart = () => useContext(CartContext);