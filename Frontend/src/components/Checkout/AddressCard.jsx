import { MapPin, User, Phone, Home } from "lucide-react";
import { useState } from "react";

const AddressCard = () => {
  const [address, setAddress] = useState({
    fullName: "",
    phone: "",
    house: "",
    area: "",
    city: "",
    state: "",
    pinCode: "",
  });

  const handleChange = (e) => {
    setAddress({
      ...address,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="bg-white rounded-3xl shadow-lg p-6">

      <h2 className="text-2xl font-bold mb-6">
        Delivery Address
      </h2>

      {/* Name + Phone */}
      <div className="grid md:grid-cols-2 gap-4">

        <div className="relative">
          <User className="absolute left-4 top-4 text-gray-400" size={18} />
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={address.fullName}
            onChange={handleChange}
            className="w-full rounded-xl border border-gray-300 pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="relative">
          <Phone className="absolute left-4 top-4 text-gray-400" size={18} />
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={address.phone}
            onChange={handleChange}
            className="w-full rounded-xl border border-gray-300 pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

      </div>

      {/* House */}
      <div className="relative mt-5">
        <Home className="absolute left-4 top-4 text-gray-400" size={18} />
        <input
          type="text"
          name="house"
          placeholder="Flat / House No. / Building"
          value={address.house}
          onChange={handleChange}
          className="w-full rounded-xl border border-gray-300 pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      {/* Area */}
      <div className="relative mt-5">
        <MapPin className="absolute left-4 top-4 text-gray-400" size={18} />
        <input
          type="text"
          name="area"
          placeholder="Area / Street / Landmark"
          value={address.area}
          onChange={handleChange}
          className="w-full rounded-xl border border-gray-300 pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      {/* City + State + PIN */}
      <div className="grid md:grid-cols-3 gap-4 mt-5">

        <input
          type="text"
          name="city"
          placeholder="City"
          value={address.city}
          onChange={handleChange}
          className="rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />

        <input
          type="text"
          name="state"
          placeholder="State"
          value={address.state}
          onChange={handleChange}
          className="rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />

        <input
          type="text"
          name="pinCode"
          placeholder="PIN Code"
          maxLength={6}
          value={address.pinCode}
          onChange={handleChange}
          className="rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />

      </div>

    </div>
  );
};

export default AddressCard;