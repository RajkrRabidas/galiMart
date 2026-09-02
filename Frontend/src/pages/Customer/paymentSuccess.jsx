import { Check, Clipboard, PackageCheck, ShoppingBag } from "lucide-react";
import { useNavigate, useParams, useSearchParams } from "react-router";
import toast from "react-hot-toast";

const PaymentSuccess = () => {
  const { paymentId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const safePaymentId = paymentId && paymentId !== "undefined" ? paymentId : null;
  const orderId = searchParams.get("orderId");

  const copyPaymentId = async () => {
    if (!safePaymentId) return;

    try {
      await navigator.clipboard.writeText(safePaymentId);
      toast.success("Payment ID copied");
    } catch {
      toast.error("Unable to copy payment ID");
    }
  };

  return (
    <main className="min-h-screen bg-linear-to-br from-emerald-50 via-white to-slate-100 px-4 py-10 sm:py-2">
      <section className="mx-auto w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-xl shadow-emerald-900/10">
        <div className="bg-emerald-600 px-6 py-10 text-center text-white sm:px-10">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white text-emerald-600 shadow-lg">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border-4 border-emerald-200">
              <Check size={30} strokeWidth={3} />
            </div>
          </div>
          <p className="mt-5 text-sm font-semibold uppercase tracking-[0.2em] text-emerald-100">
            Payment confirmed
          </p>
          <h1 className="mt-2 text-3xl font-bold">Order placed successfully!</h1>
          <p className="mt-3 text-emerald-50">
            Thank you for shopping with Gali Mart. Your order is being prepared.
          </p>
        </div>

        <div className="space-y-5 p-6 sm:p-8">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl bg-emerald-50 p-4">
              <PackageCheck className="text-emerald-600" size={22} />
              <p className="mt-2 text-xs font-medium text-slate-500">Order status</p>
              <p className="font-semibold text-slate-900">Payment successful</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <ShoppingBag className="text-slate-700" size={22} />
              <p className="mt-2 text-xs font-medium text-slate-500">Order reference</p>
              <p className="truncate font-semibold text-slate-900">
                {orderId || "Available in My Orders"}
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium text-slate-500">Payment ID</p>
              {safePaymentId && (
                <button
                  type="button"
                  onClick={copyPaymentId}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-800 cursor-pointer"
                >
                  <Clipboard size={14} /> Copy
                </button>
              )}
            </div>
            <p className="mt-2 break-all font-mono text-sm font-semibold text-slate-900">
              {safePaymentId || "Payment ID unavailable"}
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              disabled={!orderId}
              onClick={() => navigate(`/track-order/${orderId}`)}
              className="flex-1 rounded-xl bg-emerald-600 px-4 py-3 font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
            >
              Track order
            </button>
            <button
              type="button"
              onClick={() => navigate("/home")}
              className="flex-1 rounded-xl border border-slate-200 px-4 py-3 font-semibold text-slate-700 transition hover:bg-slate-50 cursor-pointer"
            >
              Continue shopping
            </button>
          </div>

          {!orderId && (
            <button
              type="button"
              onClick={() => navigate("/orders")}
              className="w-full text-center text-sm font-semibold text-emerald-700 hover:text-emerald-800 cursor-pointer"
            >
              View My Orders
            </button>
          )}
        </div>
      </section>
    </main>
  );
};

export default PaymentSuccess;
