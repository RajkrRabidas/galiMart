import ProductImage from "../../components/ProductDetails/ProductImage";
import ProductInfo from "../../components/ProductDetails/ProductInfo";
import RelatedProducts from "../../components/ProductDetails/RelatedProducts";
import BottomNavbar from "../../components/BottomNavbar/BottomNavbar";

import { products } from "../../data/products";
import { useParams } from "react-router-dom";

const ProductDetails = () => {
  const { id } = useParams();
  const product = products.find((p) => p.id === parseInt(id));

  if (!product) {
    return <div className="text-center py-10">Product not found</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-slate-100">

      <div className="max-w-7xl mx-auto px-6 py-10">

        <div className="grid md:grid-cols-2 gap-14">

          <ProductImage image={product.image} />

          <ProductInfo product={product} />

        </div>

        <RelatedProducts />

      </div>
      <BottomNavbar />

    </div>
  );
};

export default ProductDetails;