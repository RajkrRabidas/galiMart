const ProductCardSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden animate-pulse">
      {/* Image skeleton */}
      <div className="w-full h-48 bg-gray-200" />

      {/* Content skeleton */}
      <div className="p-5 space-y-4">
        {/* Name skeleton */}
        <div className="h-6 bg-gray-200 rounded-lg w-4/5" />

        {/* Category skeleton */}
        <div className="h-4 bg-gray-200 rounded-lg w-2/5" />

        {/* Price skeleton */}
        <div className="space-y-2">
          <div className="h-6 bg-gray-200 rounded-lg w-1/3" />
          <div className="h-4 bg-gray-200 rounded-lg w-1/4" />
        </div>

        {/* Stock skeleton */}
        <div className="h-4 bg-gray-200 rounded-lg w-2/5" />

        {/* Buttons skeleton */}
        <div className="flex gap-3 mt-6">
          <div className="flex-1 h-10 bg-gray-200 rounded-lg" />
          <div className="flex-1 h-10 bg-gray-200 rounded-lg" />
        </div>
      </div>
    </div>
  );
};

const LoadingSkeletons = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
};

export default LoadingSkeletons;
