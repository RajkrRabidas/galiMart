import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "../../context/CartContext";

const CartItem = ({ item }) => {
    const {
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  loading,
} = useCart();

  // Handle both old local state structure and new backend structure
  const itemData = item.itemId || item;
  const itemId = item?.itemId?._id || item?.itemId?.id || item?.itemId || item?._id || item?.id;
  const quantity = item.quantity || 1;

  return (
    <div className="bg-white rounded-3xl shadow-lg p-5 flex gap-5">

      <img
        src={itemData?.image}
        alt={itemData?.name}
        className="w-28 h-28 rounded-2xl object-cover"
      />

      <div className="flex-1">

        <h2 className="font-bold text-lg">
          {itemData?.name}
        </h2>

        <p className="text-gray-500">
          {itemData?.category || itemData?.brand}
        </p>

        <p className="text-emerald-600 font-bold mt-2">
          ₹{itemData?.price}
        </p>

        <div className="flex items-center gap-3 mt-4">

          <button 
            onClick={() => decreaseQuantity(itemId)}
            disabled={loading}
            className="bg-gray-200 w-8 h-8 rounded-full flex justify-center items-center hover:bg-gray-300 disabled:opacity-50"
          >

            <Minus size={16}/>

          </button>

          <span className="font-semibold">{quantity}</span>

          <button 
            onClick={() => increaseQuantity(itemId)}
            disabled={loading}
            className="bg-emerald-500 text-white w-8 h-8 rounded-full flex justify-center items-center hover:bg-emerald-600 disabled:opacity-50"
          >

            <Plus size={16}/>

          </button>

        </div>

      </div>

      <Trash2
        onClick={() => removeFromCart(itemId)}
        className="text-red-500 cursor-pointer hover:text-red-700 transition"
      />

    </div>
  );
};

export default CartItem;