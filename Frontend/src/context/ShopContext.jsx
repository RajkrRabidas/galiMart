import { createContext, useContext, useState } from "react";
import {
  createShop as createShopApi,
  getNearbyShops,
  getShopById,
} from "../api/shopApi";

const ShopContext = createContext();

export const ShopProvider = ({ children }) => {

  const [shops, setShops] = useState([]);
const [loading, setLoading] = useState(false);


  // -----------------------------
  // CREATE SHOP
  // -----------------------------

  const createShop = async (formData) => {
  try {
    const data = await createShopApi(formData);
    return data;
  } catch (error) {
    console.log("Create Shop Error:", error);
    throw error;
  }
};
const fetchNearbyShops = async (params) => {
  try {
    setLoading(true);

    const data = await getNearbyShops(params);

    setShops(data.shop ?? []);

  } catch (error) {

    console.log(error);

  } finally {

    setLoading(false);

  }
};

  // -----------------------------
  // ADD PRODUCT
  // -----------------------------

  const addProduct = (ownerId, product) => {

    setShops(prev =>

      prev.map(shop =>

        shop.owner === ownerId

          ? {

              ...shop,

              products: [

                ...shop.products,

                {

                  ...product,

                  id: Date.now(),

                },

              ],

            }

          : shop

      )

    );

  };

  // -----------------------------
  // DELETE PRODUCT
  // -----------------------------

  const deleteProduct = (ownerId, productId) => {

    setShops(prev =>

      prev.map(shop =>

        shop.owner === ownerId

          ? {

              ...shop,

              products: shop.products.filter(

                product => product.id !== productId

              ),

            }

          : shop

      )

    );

  };

  // -----------------------------
  // UPDATE PRODUCT
  // -----------------------------

  const updateProduct = (

    ownerId,

    updatedProduct

  ) => {

    setShops(prev =>

      prev.map(shop =>

        shop.owner === ownerId

          ? {

              ...shop,

              products: shop.products.map(

                product =>

                  product.id === updatedProduct.id

                    ? updatedProduct

                    : product

              ),

            }

          : shop

      )

    );

  };

  // -----------------------------
  // GET SHOP OF LOGGED IN SELLER
  // -----------------------------

  const getMyShop = async (shopId) => {
  if (!shopId) return null;

  try {
    const data = await getShopById(shopId);
    return data.shop;
  } catch (error) {
    console.log(error);
    return null;
  }
};

  return (

    <ShopContext.Provider

      value={{
    shops,
    loading,
    fetchNearbyShops,
    createShop,
    addProduct,
    deleteProduct,
    updateProduct,
    getMyShop,
}}

    >

      {children}

    </ShopContext.Provider>

  );

};

export const useShops = () => useContext(ShopContext);