import { useEffect, useMemo, useState } from "react";
import ProductCard from "../../components/Shopkeeper/Products/ProductCard";
import ProductHeader from "../../components/Shopkeeper/Products/ProductHeader";
import { useShops } from "../../context/ShopContext";
import BottomNavbar from "../../components/Shopkeeper/BottomNavbar";
import { getMenuItems } from "../../api/menuApi";

const Products = () => {

  const { getMyShop } = useShops();

  const [search, setSearch] = useState("");

  const [products, setProducts] = useState([]);

const [loading, setLoading] = useState(true);
useEffect(() => {

    const loadProducts = async () => {

        try {

            const shopId = localStorage.getItem("shopId");

            const shop = await getMyShop(shopId);

if (!shop) {

    setLoading(false);

    return;

}

const data = await getMenuItems(shop._id);

            setProducts(data.menuItems);

        } catch (error) {

            console.log(error);

        } finally {

            setLoading(false);

        }

    };

    loadProducts();

}, []);
 const filteredProducts = useMemo(() => {

    return products.filter(product =>
      product.name
        .toLowerCase()
        .includes(search.toLowerCase())
    );

  }, [products, search]);

if (loading) {

    return (

        <div className="min-h-screen flex justify-center items-center">

            <h1 className="text-2xl">

                Loading...

            </h1>

        </div>

    );

}

  

  return (

    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-slate-100 pb-24">

      <div className="max-w-7xl mx-auto p-6">

        <h1 className="text-4xl font-bold mb-8">

          My Products

        </h1>

        <ProductHeader

          search={search}

          setSearch={setSearch}

        />

        {filteredProducts.length === 0 ? (

          <div className="bg-white rounded-3xl shadow-lg p-16 text-center">

            <h2 className="text-2xl font-bold">

              No Products Yet

            </h2>

            <p className="text-gray-500 mt-3">

              Click "Add Product" to start selling.

            </p>

          </div>

        ) : (

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">

            {filteredProducts.map(product => (

              <ProductCard

                key={product._id}

                product={product}

                onDelete={() => {}}

              />

            ))}

          </div>

        )}

      </div>
      
      <BottomNavbar />

    </div>

  );

};

export default Products;