import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, Share2, Heart } from "lucide-react";
import ProductImage from "../../components/ProductDetails/ProductImage";
import ProductInfo from "../../components/ProductDetails/ProductInfo";
import ShopInfo from "../../components/ProductDetails/ShopInfo";
import DeliveryInfo from "../../components/ProductDetails/DeliveryInfo";
import RelatedProducts from "../../components/ProductDetails/RelatedProducts";
import BottomNavbar from "../../components/BottomNavbar/BottomNavbar";
import { products } from "../../data/products";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    // Simulate data fetching
    const timer = setTimeout(() => {
      const foundProduct = products.find((p) => p.id === parseInt(id));
      setProduct(foundProduct);
      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [id]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product?.name,
        text: `Check out ${product?.name} on Gali Mart`,
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert("Product link copied to clipboard!");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          {/* Loading Skeleton */}
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-32 bg-gray-200 rounded"></div>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-gray-200 h-96 rounded-2xl"></div>
              <div className="space-y-4">
                <div className="h-6 w-48 bg-gray-200 rounded"></div>
                <div className="h-10 w-64 bg-gray-200 rounded"></div>
                <div className="h-6 w-32 bg-gray-200 rounded"></div>
                <div className="h-12 w-full bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
        <BottomNavbar />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Product Not Found
          </h1>
          <p className="text-gray-600 mb-8">
            The product you're looking for may have been removed or is no longer available.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="px-8 py-3 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 transition font-semibold cursor-pointer"
          >
            Go Back
          </button>
        </div>
        <BottomNavbar />
      </div>
    );
  }

  // Calculate discount percentage
  const discountPercent = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 pb-32 md:pb-0">
      {/* Top Navigation */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition font-semibold cursor-pointer"
          >
            <ChevronLeft size={24} />
            <span className="hidden sm:inline">Back to Shop</span>
            <span className="sm:hidden">Back</span>
          </button>

          <div className="flex items-center gap-4">
            <button
              onClick={handleShare}
              className="p-2 hover:bg-gray-100 rounded-full transition cursor-pointer"
              title="Share product"
            >
              <Share2 size={20} className="text-gray-700" />
            </button>
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className="p-2 hover:bg-gray-100 rounded-full transition cursor-pointer"
              title="Add to favorites"
            >
              <Heart
                size={20}
                className={isFavorite ? "fill-red-500 text-red-500" : "text-gray-700"}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Desktop: 2-Column Layout */}
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          {/* Left: Product Image Gallery */}
          <ProductImage image={product.image} productName={product.name} />

          {/* Right: Product Information */}
          <ProductInfo product={product} discountPercent={discountPercent} />
        </div>

        {/* Shop Information Section */}
        <div className="mb-16">
          <ShopInfo shop={product.shop} />
        </div>

        {/* Delivery Information Section */}
        <div className="mb-16">
          <DeliveryInfo />
        </div>

        {/* About This Product Section */}
        <div className="mb-16">
          <div className="bg-white rounded-2xl p-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              About This Product
            </h2>
            <p className="text-gray-600 leading-relaxed text-lg">
              {product.description}
            </p>
          </div>
        </div>

        {/* Related Products Section */}
        <RelatedProducts />
      </div>

      {/* Bottom Navigation */}
      <BottomNavbar />
    </div>
  );
};

export default ProductDetails;