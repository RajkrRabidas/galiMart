import { X } from "lucide-react";
import { useState, useEffect } from "react";

const emptyForm = {
  title: "",
  fullName: "",
  phone: "",
  house: "",
  area: "",
  city: "",
  state: "",
  pinCode: "",
};

const AddAddressModal = ({
  open,
  onClose,
  onSave,
  editingAddress,
}) => {
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (editingAddress) {
      setForm(editingAddress);
    } else {
      setForm(emptyForm);
    }
  }, [editingAddress, open]);

  if (!open) return null;

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = () => {

  onSave({
    id: form.id || Date.now(),
    title: form.title || "Home",
    fullName: form.fullName,
    phone: form.phone,
    house: form.house,
    area: form.area,
    city: form.city,
    state: form.state,
    pinCode: form.pinCode,

    address: `${form.house}, ${form.area}, ${form.city}, ${form.state} - ${form.pinCode}`,
  });

  onClose();
};

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">

      <div className="bg-white rounded-3xl w-full max-w-xl p-8">

        <div className="flex justify-between items-center mb-6">

          <h2 className="text-2xl font-bold">
            {editingAddress ? "Edit Address" : "Add Address"}
          </h2>

          <button onClick={onClose}>
            <X />
          </button>

        </div>

        <div className="grid grid-cols-2 gap-4">

          <input
            name="title"
            placeholder="Home / Office"
            value={form.title}
            onChange={handleChange}
            className="border rounded-xl p-3"
          />

          <input
            name="fullName"
            placeholder="Full Name"
            value={form.fullName}
            onChange={handleChange}
            className="border rounded-xl p-3"
          />

          <input
            name="phone"
            placeholder="Phone"
            value={form.phone}
            onChange={handleChange}
            className="border rounded-xl p-3"
          />

          <input
            name="house"
            placeholder="House / Flat"
            value={form.house}
            onChange={handleChange}
            className="border rounded-xl p-3"
          />

          <input
            name="area"
            placeholder="Area"
            value={form.area}
            onChange={handleChange}
            className="border rounded-xl p-3 col-span-2"
          />

          <input
            name="city"
            placeholder="City"
            value={form.city}
            onChange={handleChange}
            className="border rounded-xl p-3"
          />

          <input
            name="state"
            placeholder="State"
            value={form.state}
            onChange={handleChange}
            className="border rounded-xl p-3"
          />

          <input
            name="pinCode"
            placeholder="PIN Code"
            value={form.pinCode}
            onChange={handleChange}
            className="border rounded-xl p-3 col-span-2"
          />

        </div>

        <button
          onClick={handleSave}
          className="w-full mt-6 bg-emerald-600 text-white py-3 rounded-xl"
        >
          {editingAddress ? "Update Address" : "Save Address"}
        </button>

      </div>

    </div>
  );
};

export default AddAddressModal;