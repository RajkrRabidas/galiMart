import {
  Pencil,
  Trash2,
} from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const ProductCard = ({
  product,
  onDelete,
}) => {
const navigate = useNavigate();
  return (

    <div className="bg-white rounded-3xl shadow-lg overflow-hidden">

      <img
        src={product.image}
        className="w-full h-44 object-cover"
      />

      <div className="p-5">

        <p className="text-sm text-gray-500">

          {product.brand}

        </p>

        <h2 className="font-bold text-xl mt-1">

          {product.name}

        </h2>

        <p className="text-emerald-600 text-2xl font-bold mt-4">

          ₹{product.price}

        </p>

        <p className="mt-2">

          Stock :

          <span className="font-semibold">

            {" "}
            {product.stock}

          </span>

        </p>

        <div className="flex gap-3 mt-6">

          <button
  onClick={() =>
    navigate(`/seller/edit-product/${product.id}`)
  }
  className="flex-1 bg-blue-500 text-white py-3 rounded-xl flex justify-center gap-2"
>

  <Pencil size={18}/>

  Edit

</button>

          <button
            onClick={() =>
              onDelete(product.id)
            }
            className="flex-1 bg-red-500 text-white py-3 rounded-xl flex justify-center gap-2"
          >

            <Trash2 size={18}/>

            Delete

          </button>

        </div>

      </div>

    </div>

  );

};

export default ProductCard;