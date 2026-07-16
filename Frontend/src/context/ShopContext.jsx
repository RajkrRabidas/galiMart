import { createContext, useContext, useEffect, useState } from "react";

const ShopContext = createContext();

export const ShopProvider = ({ children }) => {

  const [shops, setShops] = useState(() => {

    const saved = localStorage.getItem("shops");

    return saved ? JSON.parse(saved) : [];

  });

  useEffect(() => {

    localStorage.setItem(
      "shops",
      JSON.stringify(shops)
    );

  }, [shops]);

  // -----------------------------
  // CREATE SHOP
  // -----------------------------

  const createShop = (shopData) => {

    const exists = shops.find(
      shop => shop.owner === shopData.owner
    );

    if (exists) return false;

    const newShop = {

      id: Date.now().toString(),

      owner: shopData.owner,

      shopName: shopData.shopName,

      image: shopData.image,

      address: shopData.address,

      rating: 4.8,

      deliveryTime: "20 mins",

      products: [],

    };

    setShops(prev => [

      ...prev,

      newShop,

    ]);

    return true;

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

  const getMyShop = () => {

    const owner = localStorage.getItem("shopOwner");

    return shops.find(

      shop => shop.owner === owner

    );

  };

  return (

    <ShopContext.Provider

      value={{

        shops,

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