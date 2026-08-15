import { ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";

const EmptyCart = () => {
  const navigate = useNavigate();

  return (
    <div className="rounded-[30px] border border-slate-200 bg-white p-8 text-center shadow-[0_24px_50px_rgba(15,23,42,0.06)] sm:p-12">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
        <ShoppingBag size={32} />
      </div>

      <h2 className="mt-6 text-3xl font-black text-slate-900">Your cart is empty</h2>
      <p className="mt-3 text-slate-500">
        Add delicious essentials and keep your basket ready for checkout.
      </p>

      <button
        type="button"
        onClick={() => navigate("/home")}
        className="mt-6 inline-flex items-center justify-center rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-600/30 transition hover:bg-emerald-500"
      >
        Continue shopping
      </button>
    </div>
  );
};

export default EmptyCart;