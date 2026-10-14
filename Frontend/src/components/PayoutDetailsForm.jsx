import { useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axios";

const PayoutDetailsForm = ({ eligible, details, endpoint, onSaved, title }) => {
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    method: details?.method || "bank",
    accountHolderName: "",
    accountNumber: "",
    ifsc: "",
    upiId: "",
  });

  if (!eligible) return null;

  const isEditing = editing ?? !details;

  const handleChange = ({ target: { name, value } }) => {
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      const { data } = await api.post(endpoint, form);
      onSaved(data.payoutDetails);
      setEditing(false);
      setForm((current) => ({
        ...current,
        accountNumber: "",
        ifsc: "",
        upiId: "",
      }));
      toast.success(data.message || "Payout details saved");
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to save payout details");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900">{title} payout details</h2>
          <p className="mt-1 text-sm leading-6 text-slate-500">
            Add these when your first earnings are ready. Transfers are made manually by GaliMart.
          </p>
        </div>
        {details && !isEditing && (
          <button
            type="button"
            onClick={() => {
              setForm((current) => ({ ...current, method: details.method }));
              setEditing(true);
            }}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Change details
          </button>
        )}
      </div>

      {details && !isEditing ? (
        <div className="mt-4 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-950">
          <p className="font-semibold">{details.method === "upi" ? "UPI" : "Bank account"} saved</p>
          <p className="mt-1">{details.accountHolderName}</p>
          <p className="mt-1 font-mono">
            {details.method === "upi" ? details.upiIdMasked : `Account ending ${details.accountLast4}`}
          </p>
          <p className="mt-3 text-xs text-emerald-800">Details are encrypted. Never share your UPI PIN or OTP.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {details && <p className="text-xs text-amber-700">For security, saved details are masked. Enter the complete replacement details below.</p>}
          <label className="block text-sm font-medium text-slate-700">
            Account holder name
            <input
              name="accountHolderName"
              value={form.accountHolderName}
              onChange={handleChange}
              maxLength={100}
              autoComplete="name"
              required
              className="mt-1.5 w-full rounded-xl border border-slate-300 px-3 py-2.5 outline-none focus:border-emerald-500"
            />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Payout method
            <select
              name="method"
              value={form.method}
              onChange={handleChange}
              className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 outline-none focus:border-emerald-500"
            >
              <option value="bank">Bank transfer</option>
              <option value="upi">UPI</option>
            </select>
          </label>

          {form.method === "bank" ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm font-medium text-slate-700">
                Bank account number
                <input
                  name="accountNumber"
                  value={form.accountNumber}
                  onChange={handleChange}
                  inputMode="numeric"
                  autoComplete="off"
                  minLength={8}
                  maxLength={20}
                  required
                  className="mt-1.5 w-full rounded-xl border border-slate-300 px-3 py-2.5 outline-none focus:border-emerald-500"
                />
              </label>
              <label className="block text-sm font-medium text-slate-700">
                IFSC code
                <input
                  name="ifsc"
                  value={form.ifsc}
                  onChange={handleChange}
                  autoCapitalize="characters"
                  autoComplete="off"
                  minLength={11}
                  maxLength={11}
                  required
                  className="mt-1.5 w-full rounded-xl border border-slate-300 px-3 py-2.5 uppercase outline-none focus:border-emerald-500"
                />
              </label>
            </div>
          ) : (
            <label className="block text-sm font-medium text-slate-700">
              UPI ID
              <input
                name="upiId"
                value={form.upiId}
                onChange={handleChange}
                placeholder="name@bank"
                autoComplete="off"
                required
                className="mt-1.5 w-full rounded-xl border border-slate-300 px-3 py-2.5 outline-none focus:border-emerald-500"
              />
            </label>
          )}

          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Saving securely…" : details ? "Save new details" : "Save payout details"}
            </button>
            {details && (
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
            )}
          </div>
          <p className="text-xs leading-5 text-slate-500">We never ask for an OTP, UPI PIN, ATM PIN, CVV, or banking password.</p>
        </form>
      )}
    </section>
  );
};

export default PayoutDetailsForm;
