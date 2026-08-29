import { useState } from "react";
import { ChevronLeft, ChevronRight, ZoomIn, X } from "lucide-react";

const ProductImage = ({ image, productName }) => {
  const [selectedImage, setSelectedImage] = useState(image);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Sample multiple images (in real app, these would come from product data)
  // For now, we just use the single product image
  const images = [image];

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePosition({ x, y });
  };

  return (
    <div className="space-y-4">
      {/* Main Image Container */}
      <div className="relative bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
        <div
          className="relative w-full aspect-square flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 cursor-zoom-in overflow-hidden"
          onMouseMove={handleMouseMove}
          onClick={() => setIsZoomed(true)}
        >
          <img
            src={selectedImage}
            alt={productName}
            className={`transition-transform duration-300 ${
              isZoomed ? "scale-150" : "scale-100"
            } object-contain w-full h-full p-4`}
            style={
              isZoomed
                ? {
                    transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`,
                  }
                : {}
            }
          />

          {/* Zoom Hint */}
          <div className="absolute top-4 right-4 bg-gray-900/60 text-white rounded-full p-2 flex items-center gap-1 text-xs font-semibold">
            <ZoomIn size={14} />
            <span>Click to zoom</span>
          </div>
        </div>
      </div>

      {/* Thumbnail Gallery */}
      {images.length > 1 && (
        <div className="flex gap-3">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedImage(img)}
              className={`relative w-20 h-20 rounded-xl border-2 transition-all overflow-hidden flex-shrink-0 ${
                selectedImage === img
                  ? "border-emerald-500 shadow-md"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <img
                src={img}
                alt={`Thumbnail ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Image Info */}
      <p className="text-xs text-gray-500 text-center">
        Tap the image to zoom in
      </p>

      {/* Zoom Modal */}
      {isZoomed && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <button
            onClick={() => setIsZoomed(false)}
            className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white rounded-full p-2 transition"
          >
            <X size={24} />
          </button>

          <div className="flex items-center gap-4 w-full">
            {/* Previous Button */}
            <button
              onClick={() => {
                const currentIdx = images.indexOf(selectedImage);
                if (currentIdx > 0) {
                  setSelectedImage(images[currentIdx - 1]);
                }
              }}
              className="bg-white/20 hover:bg-white/30 text-white rounded-full p-2 transition disabled:opacity-50"
              disabled={images.indexOf(selectedImage) === 0}
            >
              <ChevronLeft size={24} />
            </button>

            {/* Image */}
            <div className="flex-1 flex items-center justify-center">
              <img
                src={selectedImage}
                alt={productName}
                className="max-h-96 max-w-full object-contain"
              />
            </div>

            {/* Next Button */}
            <button
              onClick={() => {
                const currentIdx = images.indexOf(selectedImage);
                if (currentIdx < images.length - 1) {
                  setSelectedImage(images[currentIdx + 1]);
                }
              }}
              className="bg-white/20 hover:bg-white/30 text-white rounded-full p-2 transition disabled:opacity-50"
              disabled={images.indexOf(selectedImage) === images.length - 1}
            >
              <ChevronRight size={24} />
            </button>
          </div>

          {/* Counter */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/20 text-white px-4 py-2 rounded-full text-sm">
            {images.indexOf(selectedImage) + 1} / {images.length}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductImage;