import { createContext, useContext, useState, useEffect } from "react";
import { addToCart as addToCartApi, fetchCart as fetchCartApi, incrementCart as incrementCartApi, decrementCart as decrementCartApi, clearCart as clearCartApi } from "../api/cartApi";
import toast from "react-hot-toast";

const CartContext = createContext();

export const CartProvider = ({ children }) => {

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch cart on mount
  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      setLoading(true);
      const data = await fetchCartApi();
      if (data?.cart) {
        setCartItems(data.cart);
      }
    } catch (error) {
      console.error("Error loading cart:", error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (product, quantity = 1) => {
    try {
      setLoading(true);
      // Need shopId and itemId for backend
      const shopId = product.shopId || product.shop?._id;
      const itemId = product._id || product.id;

      if (!shopId || !itemId) {
        toast.error("Invalid product data");
        return;
      }

      const response = await addToCartApi(shopId, itemId);
      
      if (response.success) {
        // Reload cart to sync with backend
        await loadCart();
        toast.success(response.message || "Added to Cart");
      }
    } catch (error) {
      console.error("Error adding to cart:", error?.response?.data?.message || error.message);
      toast.error(error?.response?.data?.message || "Failed to add to cart");
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      setLoading(true);
      await decrementCartApi(itemId);
      await loadCart();
      toast.success("Removed from cart");
    } catch (error) {
      console.error("Error removing from cart:", error);
      toast.error("Failed to remove from cart");
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      setLoading(true);
      await clearCartApi();
      setCartItems([]);
      toast.success("Cart cleared");
    } catch (error) {
      console.error("Error clearing cart:", error);
      toast.error("Failed to clear cart");
    } finally {
      setLoading(false);
    }
  };

  const increaseQuantity = async (itemId) => {
    try {
      setLoading(true);
      await incrementCartApi(itemId);
      await loadCart();
      toast.success("Quantity increased");
    } catch (error) {
      console.error("Error increasing quantity:", error);
      toast.error("Failed to increase quantity");
    } finally {
      setLoading(false);
    }
  };

  const decreaseQuantity = async (itemId) => {
    try {
      setLoading(true);
      await decrementCartApi(itemId);
      await loadCart();
    } catch (error) {
      console.error("Error decreasing quantity:", error);
      toast.error("Failed to decrease quantity");
    } finally {
      setLoading(false);
    }
  };

  const subtotal = cartItems.reduce(
    (total, item) => total + (item.itemId?.price || 0) * item.quantity,
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
        loading,
      }}
    >

      {children}

    </CartContext.Provider>

  );

};

export const useCart = () => useContext(CartContext);