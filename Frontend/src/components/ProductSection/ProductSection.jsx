import ProductCard from "./ProductCard";
import { products } from "./productData";

const ProductSection = () => {
  return (
    <div className="mt-10">

      <div className="flex justify-between items-center">

        <h2 className="text-xl font-bold">
          Popular Products
        </h2>

        <button className="text-emerald-600 font-semibold">
          View All
        </button>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">

        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
          />
        ))}

      </div>

    </div>
  );
};

export default ProductSection;