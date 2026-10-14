import { useCallback, useEffect, useState } from "react";
import { ArrowLeft, Check, LoaderCircle, MapPin, Pencil, Plus, Star, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

const EMPTY_FORM = {
  fullName: "",
  phoneNumber: "",
  pinCode: "",
  city: "",
  state: "",
  locality: "",
  buildingName: "",
  landmark: "",
  addressType: "Home",
};

const FORM_FIELDS = [
  { name: "fullName", label: "Full name", required: true, autoComplete: "name" },
  { name: "phoneNumber", label: "Phone number", required: true, inputMode: "numeric", autoComplete: "tel-national" },
  { name: "pinCode", label: "PIN code", required: true, inputMode: "numeric", autoComplete: "postal-code", maxLength: 6 },
  { name: "city", label: "City", required: true, autoComplete: "address-level2" },
  { name: "state", label: "State", required: true, autoComplete: "address-level1" },
  { name: "locality", label: "Locality / Area / Street", required: true, autoComplete: "address-line2" },
  { name: "buildingName", label: "Flat No. / Building Name", required: true, autoComplete: "address-line1" },
  { name: "landmark", label: "Landmark (optional)", autoComplete: "off" },
];

const INPUT_CLASS = "w-full rounded-none border-0 border-b border-slate-300 bg-transparent px-1 py-3 text-base text-black outline-none placeholder:text-slate-500 focus:border-rose-500 focus:ring-0";

const getAddressText = (address) => address.formattedAddress || [
  address.buildingName,
  address.locality,
  address.landmark,
  address.city,
  address.state,
  address.pinCode,
].filter(Boolean).join(", ");

const getPhoneDigits = (address) => String(address.phoneNumber || address.mobile || "").replace(/^\+91/, "").replace(/\D/g, "").slice(-10);

const Addresses = () => {
  const { user, profile } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [fieldErrors, setFieldErrors] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pendingActionId, setPendingActionId] = useState(null);

  const fetchAddresses = useCallback(async () => {
    try {
      const { data } = await api.get("/addresses");
      setAddresses(data.addresses || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to load saved addresses. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const requestId = window.setTimeout(() => {
      fetchAddresses();
    }, 0);
    return () => window.clearTimeout(requestId);
  }, [fetchAddresses]);

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setFieldErrors({});
    setEditingId(null);
  };

  const updateField = (name, value) => {
    const nextValue = name === "pinCode" || name === "phoneNumber"
      ? value.replace(/\D/g, "").slice(0, name === "pinCode" ? 6 : 10)
      : value;
    setForm((current) => ({ ...current, [name]: nextValue }));
    setFieldErrors((current) => ({ ...current, [name]: "" }));
  };

  const validateForm = () => {
    const errors = {};
    FORM_FIELDS.forEach(({ name, label, required }) => {
      if (required && !form[name].trim()) errors[name] = `${label} is required.`;
    });
    if (form.phoneNumber && !/^[6-9]\d{9}$/.test(form.phoneNumber)) {
      errors.phoneNumber = "Enter a valid 10-digit Indian mobile number.";
    }
    if (form.pinCode && !/^\d{6}$/.test(form.pinCode)) {
      errors.pinCode = "PIN code must be exactly 6 digits.";
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (saving || !validateForm()) return;

    setSaving(true);
    try {
      const payload = { ...form, phoneNumber: `+91${form.phoneNumber}` };
      if (editingId) {
        await api.put(`/addresses/${editingId}`, payload);
        toast.success("Address updated");
      } else {
        await api.post("/addresses", payload);
        toast.success("Address saved");
      }
      resetForm();
      await fetchAddresses();
    } catch (error) {
      const responseErrors = error.response?.data?.errors;
      if (Array.isArray(responseErrors)) {
        const errors = Object.fromEntries(responseErrors.map(({ field, message }) => [field, message]));
        setFieldErrors(errors);
      }
      toast.error(error.response?.data?.message || "Unable to save address. Check your connection and try again.");
    } finally {
      setSaving(false);
    }
  };

  const editAddress = (address) => {
    setEditingId(address._id);
    setForm({
      fullName: address.fullName || "",
      phoneNumber: getPhoneDigits(address),
      pinCode: address.pinCode || "",
      city: address.city || "",
      state: address.state || "",
      locality: address.locality || "",
      buildingName: address.buildingName || address.formattedAddress || "",
      landmark: address.landmark || "",
      addressType: address.addressType || "Home",
    });
    setFieldErrors({});
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteAddress = async (address) => {
    if (!window.confirm("Delete this saved address?")) return;
    setPendingActionId(address._id);
    try {
      await api.delete(`/addresses/${address._id}`);
      toast.success("Address deleted");
      await fetchAddresses();
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to delete this address.");
    } finally {
      setPendingActionId(null);
    }
  };

  const setDefaultAddress = async (address) => {
    setPendingActionId(address._id);
    try {
      await api.patch(`/addresses/${address._id}/default`);
      toast.success("Default address updated");
      await fetchAddresses();
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to update the default address.");
    } finally {
      setPendingActionId(null);
    }
  };

  const defaultName = profile?.fullName || user?.fullName || "";
  const defaultPhone = String(user?.phone || user?.mobile || "").replace(/\D/g, "").slice(-10);

  return (
    <main className="min-h-screen bg-white px-4 pb-[calc(env(safe-area-inset-bottom)+2rem)] pt-4 text-black sm:px-6 sm:pt-8">
      <div className="mx-auto max-w-2xl">
        <header className="mb-8 flex items-center justify-between gap-4">
          <Link to="/profile" className="inline-flex min-h-11 items-center gap-2 rounded-lg text-sm text-slate-700 hover:text-black focus-visible:outline-2 focus-visible:outline-rose-500">
            <ArrowLeft size={19} aria-hidden="true" /> Back
          </Link>
          <h1 className="text-lg font-semibold sm:text-xl">Saved Addresses</h1>
          <button type="button" onClick={resetForm} className="min-h-11 rounded-lg px-2 text-sm font-medium text-sky-700 hover:text-sky-900 focus-visible:outline-2 focus-visible:outline-sky-600">
            Reset
          </button>
        </header>

        <form onSubmit={handleSubmit} noValidate className="space-y-8" aria-busy={saving}>
          <section aria-labelledby="contact-info-heading">
            <h2 id="contact-info-heading" className="mb-5 border-l-2 border-rose-500 pl-3 text-base font-semibold text-slate-900">Contact Info</h2>
            <div className="space-y-5">
              {FORM_FIELDS.slice(0, 2).map((field) => (
                <label key={field.name} className="block">
                  <span className="mb-1 block text-xs font-medium text-slate-600">{field.label}{field.required && <span className="text-rose-600" aria-hidden="true"> *</span>}</span>
                  {field.name === "phoneNumber" ? (
                    <div className="flex items-center border-b border-slate-300 focus-within:border-rose-500">
                      <span className="py-3 pr-3 text-sm text-slate-700" aria-label="India country code">+91</span>
                      <input
                        id={field.name}
                        name={field.name}
                        type="tel"
                        inputMode={field.inputMode}
                        autoComplete={field.autoComplete}
                        maxLength={10}
                        value={form[field.name]}
                        onChange={(event) => updateField(field.name, event.target.value)}
                        placeholder="10-digit mobile number"
                        aria-invalid={Boolean(fieldErrors[field.name])}
                        aria-describedby={fieldErrors[field.name] ? `${field.name}-error` : undefined}
                        className="min-w-0 flex-1 border-0 bg-transparent px-1 py-3 text-base text-black outline-none placeholder:text-slate-500 focus:ring-0"
                      />
                    </div>
                  ) : (
                    <input
                      id={field.name}
                      name={field.name}
                      type="text"
                      autoComplete={field.autoComplete}
                      value={form[field.name]}
                      onChange={(event) => updateField(field.name, event.target.value)}
                      placeholder={field.name === "fullName" ? defaultName || "Enter full name" : "Enter full name"}
                      aria-invalid={Boolean(fieldErrors[field.name])}
                      aria-describedby={fieldErrors[field.name] ? `${field.name}-error` : undefined}
                      className={INPUT_CLASS}
                    />
                  )}
                  {fieldErrors[field.name] && <span id={`${field.name}-error`} role="alert" className="mt-1 block text-xs text-rose-600">{fieldErrors[field.name]}</span>}
                </label>
              ))}
              {defaultPhone && !form.phoneNumber && <p className="-mt-3 text-xs text-slate-600">Account phone: +91 {defaultPhone}</p>}
            </div>
          </section>

          <section aria-labelledby="address-info-heading">
            <h2 id="address-info-heading" className="mb-5 border-l-2 border-rose-500 pl-3 text-base font-semibold text-slate-900">Address Info</h2>
            <div className="grid grid-cols-1 gap-x-5 gap-y-5 sm:grid-cols-2">
              {FORM_FIELDS.slice(2).map((field) => (
                <label key={field.name} className={`block ${["locality", "buildingName", "landmark"].includes(field.name) ? "sm:col-span-2" : ""}`}>
                  <span className="mb-1 block text-xs font-medium text-slate-600">{field.label}{field.required && <span className="text-rose-600" aria-hidden="true"> *</span>}</span>
                  <input
                    id={field.name}
                    name={field.name}
                    type="text"
                    inputMode={field.inputMode}
                    autoComplete={field.autoComplete}
                    maxLength={field.maxLength}
                    value={form[field.name]}
                    onChange={(event) => updateField(field.name, event.target.value)}
                    placeholder={field.label}
                    aria-invalid={Boolean(fieldErrors[field.name])}
                    aria-describedby={fieldErrors[field.name] ? `${field.name}-error` : undefined}
                    className={INPUT_CLASS}
                  />
                  {fieldErrors[field.name] && <span id={`${field.name}-error`} role="alert" className="mt-1 block text-xs text-rose-600">{fieldErrors[field.name]}</span>}
                </label>
              ))}
            </div>
            <fieldset className="mt-6">
              <legend className="mb-3 text-xs font-medium text-slate-600">Address type</legend>
              <div className="flex flex-wrap gap-2">
                {["Home", "Work", "Other"].map((type) => (
                  <button
                    key={type}
                    type="button"
                    aria-pressed={form.addressType === type}
                    onClick={() => setForm((current) => ({ ...current, addressType: type }))}
                    className={`min-h-10 rounded-full border px-4 text-sm transition focus-visible:outline-2 focus-visible:outline-rose-500 ${form.addressType === type ? "border-rose-500 bg-rose-50 text-rose-700" : "border-slate-300 text-slate-700 hover:border-slate-500"}`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </fieldset>
          </section>

          <button type="submit" disabled={saving} className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-rose-500 px-5 py-3 font-semibold text-white transition hover:bg-rose-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-300 disabled:cursor-not-allowed disabled:opacity-60">
            {saving ? <LoaderCircle size={18} className="animate-spin" aria-hidden="true" /> : editingId ? <Check size={18} aria-hidden="true" /> : <Plus size={18} aria-hidden="true" />}
            {saving ? "Saving address…" : editingId ? "Update Address" : "Save Address"}
          </button>
        </form>

        <section aria-labelledby="saved-addresses-heading" className="mt-12 border-t border-slate-200 pt-7">
          <h2 id="saved-addresses-heading" className="mb-4 text-base font-semibold">Your saved addresses</h2>
          {loading ? (
            <div className="flex items-center gap-2 py-6 text-sm text-slate-600" role="status"><LoaderCircle size={17} className="animate-spin" /> Loading addresses…</div>
          ) : addresses.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 px-4 py-8 text-center text-sm text-slate-600"><MapPin size={22} className="mx-auto mb-2 text-slate-500" />No saved addresses yet. Add one above.</div>
          ) : (
            <div className="space-y-3">
              {addresses.map((address) => (
                <article key={address._id} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold text-slate-900">{address.fullName || "Delivery address"}</h3>
                        <span className="rounded-full bg-slate-200 px-2.5 py-1 text-xs text-slate-700">{address.addressType || "Address"}</span>
                        {address.isDefault && <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-800"><Star size={12} fill="currentColor" /> Default</span>}
                      </div>
                      <p className="mt-2 wrap-break-word text-sm leading-6 text-slate-800">{getAddressText(address)}</p>
                      <p className="mt-1 text-xs text-slate-600">+91 {getPhoneDigits(address)}{address.pinCode ? ` · PIN ${address.pinCode}` : ""}</p>
                    </div>
                    <div className="flex shrink-0 items-center gap-1">
                      <button type="button" onClick={() => editAddress(address)} aria-label={`Edit address for ${address.fullName || "recipient"}`} className="rounded-lg p-2 text-slate-700 hover:bg-slate-200 hover:text-black focus-visible:outline-2 focus-visible:outline-rose-500"><Pencil size={17} /></button>
                      <button type="button" onClick={() => deleteAddress(address)} disabled={pendingActionId === address._id} aria-label={`Delete address for ${address.fullName || "recipient"}`} className="rounded-lg p-2 text-rose-700 hover:bg-rose-100 focus-visible:outline-2 focus-visible:outline-rose-500 disabled:opacity-50"><Trash2 size={17} /></button>
                    </div>
                  </div>
                  {!address.isDefault && (
                    <button type="button" onClick={() => setDefaultAddress(address)} disabled={pendingActionId === address._id} className="mt-3 inline-flex min-h-10 items-center gap-1.5 rounded-lg px-2 text-sm font-medium text-sky-800 hover:bg-sky-100 disabled:opacity-50">
                      {pendingActionId === address._id ? <LoaderCircle size={15} className="animate-spin" /> : <Star size={15} />} Set as default
                    </button>
                  )}
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default Addresses;
