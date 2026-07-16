import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "../../context/CartContext";

const CartItem = ({ item }) => {
    const {
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
} = useCart();
  return (
    <div className="bg-white rounded-3xl shadow-lg p-5 flex gap-5">

      <img
        src={item.image}
        className="w-28 h-28 rounded-2xl object-cover"
      />

      <div className="flex-1">

        <h2 className="font-bold text-lg">
          {item.name}
        </h2>

        <p className="text-gray-500">
          {item.brand}
        </p>

        <p className="text-emerald-600 font-bold mt-2">
          ₹{item.price}
        </p>

        <div className="flex items-center gap-3 mt-4">

          <button onClick={() => decreaseQuantity(item.id)} className="bg-gray-200 w-8 h-8 rounded-full flex justify-center items-center">

            <Minus size={16}/>

          </button>

          {item.quantity}

          <button onClick={() => increaseQuantity(item.id)} className="bg-emerald-500 text-white w-8 h-8 rounded-full flex justify-center items-center">

            <Plus size={16}/>

          </button>

        </div>

      </div>

      <Trash2
  onClick={() => removeFromCart(item.id)}
  className="text-red-500 cursor-pointer hover:text-red-700 transition"
/>

    </div>
  );
};

export default CartItem;