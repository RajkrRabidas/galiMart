const ProductImage = ({ image }) => {
  return (
    <div className="bg-white rounded-3xl shadow-lg p-6">

      <img
        src={image}
        alt="product"
        className="w-full h-[420px] object-contain"
      />

    </div>
  );
};

export default ProductImage;