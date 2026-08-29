import ProductSection from "../ProductSection/ProductSection";

const RelatedProducts = () => {
  return (
    <div className="mt-20">
      <div className="mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
          You May Also Like
        </h2>
        <p className="text-gray-600 mt-2">Explore other products from the same category</p>
      </div>

      <ProductSection />
    </div>
  );
};

export default RelatedProducts;