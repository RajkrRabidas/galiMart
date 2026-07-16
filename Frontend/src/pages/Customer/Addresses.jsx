import { Plus } from "lucide-react";
import { useState } from "react";
import BottomNavbar from "../../components/BottomNavbar/BottomNavbar";
import AddressCard from "../../components/Profile/AddressCard";
import AddAddressModal from "../../components/Profile/AddAddressModal";

const Addresses = () => {
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      title: "Home",
      address:
        "Salt Lake, Sector V, Kolkata, West Bengal - 700091",
      phone: "+91 9876543210",
    },
    {
      id: 2,
      title: "Office",
      address:
        "New Town, Action Area 1, Kolkata, West Bengal - 700156",
      phone: "+91 9876543210",
    },
  ]);
  const [openModal, setOpenModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

const saveAddress = (address) => {

  if (editingAddress) {

    setAddresses((prev) =>
      prev.map((item) =>
        item.id === address.id ? address : item
      )
    );

    setEditingAddress(null);

  } else {

    setAddresses((prev) => [...prev, address]);

  }

};
const editAddress = (address) => {

  setEditingAddress(address);

  setOpenModal(true);

};
const deleteAddress = (id) => {
  setAddresses((prev) =>
    prev.filter((address) => address.id !== id)
  );
};

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-slate-100">

      <div className="max-w-5xl mx-auto p-6 pb-24">

        <div className="flex justify-between items-center mb-8">

          <h1 className="text-4xl font-bold">
            Saved Addresses
          </h1>

          <button
  onClick={() => {
    setEditingAddress(null);
    setOpenModal(true);
}}
  className="bg-emerald-600 text-white px-5 py-3 rounded-2xl flex items-center gap-2 hover:bg-emerald-700"
>
  <Plus size={20} />
  Add Address
</button>

        </div>

        <div className="space-y-5">

          {addresses.map((address) => (
            <AddressCard
              key={address.id}
              address={address}
              onDelete={deleteAddress}
              onEdit={editAddress}
            />
          ))}

        </div>

      </div>
          <AddAddressModal
  open={openModal}
  onClose={() => setOpenModal(false)}
  onSave={saveAddress}
  editingAddress={editingAddress}
/>
      <BottomNavbar />

    </div>
  );
};

export default Addresses;