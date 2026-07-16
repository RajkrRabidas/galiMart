import { Minus, Plus } from "lucide-react";

const QuantitySelector = ({ quantity, setQuantity }) => {
  return (
    <div className="flex items-center gap-5 mt-6">

      <button
        onClick={() => quantity > 1 && setQuantity(quantity - 1)}
        className="w-10 h-10 rounded-full bg-gray-200 flex justify-center items-center"
      >
        <Minus />
      </button>

      <span className="text-xl font-bold">
        {quantity}
      </span>

      <button
        onClick={() => setQuantity(quantity + 1)}
        className="w-10 h-10 rounded-full bg-emerald-500 text-white flex justify-center items-center"
      >
        <Plus />
      </button>

    </div>
  );
};

export default QuantitySelector;