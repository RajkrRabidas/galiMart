import { useEffect, useMemo, useState } from "react";
import { Package, AlertCircle, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";
import ProductCard from "../../components/Shopkeeper/Products/ProductCard";
import ProductHeader from "../../components/Shopkeeper/Products/ProductHeader";
import DeleteConfirmationModal from "../../components/Shopkeeper/Products/DeleteConfirmationModal";
import LoadingSkeletons from "../../components/Shopkeeper/Products/LoadingSkeletons";
import { useShops } from "../../context/ShopContext";
import { getMenuItems, deleteMenuItem } from "../../api/menuApi";
import BottomNavbar from "../../components/Shopkeeper/BottomNavbar";

const Products = () => {
  const { getMyShop } = useShops();

  const [search, setSearch] = useState("");
  const [selectedAvailability, setSelectedAvailability] = useState("all");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    productId: null,
    productName: "",
  });

  // Load products
  useEffect(() => {
    const loadProducts = async () => {
      try {
        let shop = await getMyShop();
        const shopId = shop?._id ?? localStorage.getItem("shopId");

        if (shopId) {
          localStorage.setItem("shopId", shopId);
        }

        if (!shop && shopId) {
          shop = { _id: shopId };
        }

        if (!shop) {
          setLoading(false);
          return;
        }

        const data = await getMenuItems(shop._id);
        setProducts(data.menuItems || []);
      } catch (error) {
        console.log("Error loading products:", error);
        toast.error("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [getMyShop]);

  // Filter products based on search and availability
  const filteredProducts = useMemo(() => {
    let filtered = products.filter((product) =>
      product.name.toLowerCase().includes(search.toLowerCase())
    );

    // Apply availability filter
    if (selectedAvailability !== "all") {
      filtered = filtered.filter((product) => {
        if (selectedAvailability === "available") {
          return product.isAvailable && product.stock > 0;
        }
        if (selectedAvailability === "out-of-stock") {
          return !product.isAvailable || product.stock === 0;
        }
        if (selectedAvailability === "low-stock") {
          return product.stock > 0 && product.stock < 5;
        }
        return true;
      });
    }

    return filtered;
  }, [products, search, selectedAvailability]);

  // Calculate summary stats
  const stats = useMemo(() => {
    const totalProducts = products.length;
    const availableProducts = products.filter(
      (p) => p.isAvailable && p.stock > 0
    ).length;
    const outOfStockProducts = products.filter(
      (p) => !p.isAvailable || p.stock === 0
    ).length;

    return {
      totalProducts,
      availableProducts,
      outOfStockProducts,
    };
  }, [products]);

  // Handle delete
  const handleDeleteClick = (productId, productName) => {
    setDeleteModal({
      isOpen: true,
      productId,
      productName,
    });
  };

  const handleConfirmDelete = async () => {
    if (!deleteModal.productId) return;

    setDeleting(true);
    try {
      await deleteMenuItem(deleteModal.productId);
      setProducts((prevProducts) =>
        prevProducts.filter((p) => p._id !== deleteModal.productId)
      );
      toast.success("Product deleted successfully");
      setDeleteModal({ isOpen: false, productId: null, productName: "" });
    } catch (error) {
      console.log("Error deleting product:", error);
      toast.error("Failed to delete product");
    } finally {
      setDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setDeleteModal({ isOpen: false, productId: null, productName: "" });
  };

  const handleToggleStatus = (productId) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product._id === productId
          ? { ...product, isAvailable: !product.isAvailable }
          : product
      )
    );
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen from-emerald-50 via-white to-slate-100 pb-24">
        <div className="max-w-7xl mx-auto p-6">
          <div className="mb-8">
            <div className="h-10 bg-gray-200 rounded-lg w-1/3 mb-2 animate-pulse" />
            <div className="h-5 bg-gray-100 rounded-lg w-1/2 animate-pulse" />
          </div>
          <LoadingSkeletons count={6} />
        </div>
      </div>
    );
  }

  // Empty state - no products at all
  if (products.length === 0) {
    return (
      <div className="min-h-screen from-emerald-50 via-white to-slate-100 pb-24">
        <div className="max-w-7xl mx-auto p-6">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
              My Products
            </h1>
            <p className="text-lg text-gray-600">
              Manage your products, inventory and availability
            </p>
          </div>

          {/* Empty State */}
          <div className="bg-white rounded-3xl shadow-md p-12 md:p-16 text-center max-w-md mx-auto">
            <div className="flex justify-center mb-6">
              <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center">
                <Package size={48} className="text-emerald-600" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              No products yet
            </h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Start adding products to your shop and show them to your
              customers. Build your inventory and grow your business.
            </p>
            <button
              onClick={() =>
                window.location.href = "/seller/add-product"
              }
              className="px-8 py-4 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-all duration-200 shadow-md hover:shadow-lg inline-flex items-center gap-2 cursor-pointer"
            >
              <Package size={20} />
              Add Your First Product
            </button>
          </div>
        </div>
        <BottomNavbar />
      </div>
    );
  }

  // Main page
  return (
    <div className="min-h-screen bg-gray-100 from-emerald-50 via-white to-slate-100 pb-24">
      <div className="max-w-7xl mx-auto p-6">
        {/* Page Header */}
        <div className="mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
            My Products
          </h1>
          <p className="text-lg text-gray-600">
            Manage your products, inventory and availability
          </p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* Total Products */}
          <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Total Products
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.totalProducts}
                </p>
              </div>
              <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center">
                <Package size={28} className="text-blue-600" />
              </div>
            </div>
          </div>

          {/* Available Products */}
          <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Available
                </p>
                <p className="text-3xl font-bold text-emerald-600">
                  {stats.availableProducts}
                </p>
              </div>
              <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center">
                <CheckCircle size={28} className="text-emerald-600" />
              </div>
            </div>
          </div>

          {/* Out of Stock */}
          <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Out of Stock
                </p>
                <p className="text-3xl font-bold text-red-600">
                  {stats.outOfStockProducts}
                </p>
              </div>
              <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle size={28} className="text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Toolbar */}
        <ProductHeader
          search={search}
          setSearch={setSearch}
          selectedAvailability={selectedAvailability}
          setSelectedAvailability={setSelectedAvailability}
        />

        {/* Search Results Empty State */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-md p-12 md:p-16 text-center max-w-md mx-auto">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                <Package size={40} className="text-gray-400" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              No products found
            </h2>
            <p className="text-gray-600 mb-6">
              Try changing your filters or search query to find products.
            </p>
            <button
              onClick={() => {
                setSearch("");
                setSelectedAvailability("all");
              }}
              className="px-6 py-2 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-all duration-200 inline-flex items-center gap-2 cursor-pointer"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <>
            {/* Product Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onDelete={handleDeleteClick}
                  onToggleStatus={handleToggleStatus}
                />
              ))}
            </div>

            {/* Results count */}
            <p className="text-center text-gray-600 text-sm mt-8">
              Showing {filteredProducts.length} of {products.length} products
            </p>
          </>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        productName={deleteModal.productName}
        isDeleting={deleting}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />

      {/* Bottom Navigation */}
      <BottomNavbar />
    </div>
  );
};

export default Products;