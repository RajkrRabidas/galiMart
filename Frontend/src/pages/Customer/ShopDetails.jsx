import { useParams } from "react-router-dom";
import { useShops } from "../../context/ShopContext";
import ProductCard from "../../components/ProductSection/ProductCard";
import BottomNavbar from "../../components/BottomNavbar/BottomNavbar";

const ShopDetails = () => {

  const { id } = useParams();

  const { shops } = useShops();

  const shop = shops.find((shop) => shop.id === id);

  if (!shop) {

    return (

      <div className="min-h-screen flex justify-center items-center">

        <h1 className="text-3xl font-bold">

          Shop Not Found

        </h1>

      </div>

    );

  }

  return (

    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-slate-100">

      <div className="max-w-7xl mx-auto p-6 pb-24">

        <img
          src={shop.image}
          className="w-full h-64 object-cover rounded-3xl"
        />

        <h1 className="text-4xl font-bold mt-6">

          {shop.shopName}

        </h1>

        <p className="text-gray-500 mt-2">

          {shop.address}

        </p>

        <div className="mt-10">

          <h2 className="text-2xl font-bold">

            Products

          </h2>

          {

            shop.products.length === 0 ? (

              <div className="bg-white rounded-3xl shadow-lg p-12 mt-6 text-center">

                <h2 className="text-2xl font-bold">

                  No Products

                </h2>

                <p className="text-gray-500 mt-3">

                  This shop hasn't added products yet.

                </p>

              </div>

            ) : (

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">

                {

                  shop.products.map(product => (

                    <ProductCard
                      key={product.id}
                      product={product}
                    />

                  ))

                }

              </div>

            )

          }

        </div>

      </div>

      <BottomNavbar />

    </div>

  );

};

export default ShopDetails;