import { MapPin, Trash2, Pencil } from "lucide-react";

const AddressCard = ({ address, onDelete, onEdit }) => {
  return (
    <div className="bg-white rounded-3xl shadow-lg p-5 flex justify-between items-start">

      <div>

        <h2 className="font-bold text-lg">
          {address.title}
        </h2>

        <p className="text-gray-600 mt-2">
          {address.address}
        </p>

        <p className="text-gray-500 mt-2">
          {address.phone}
        </p>

      </div>

      <div className="flex gap-3">

        <button
  onClick={() => onEdit(address)}
  className="text-emerald-600 hover:scale-110 transition"
>
  <Pencil size={20} />
</button>

        <button
    onClick={() => onDelete(address.id)}
    className="text-red-500 hover:scale-110 transition"
>
    <Trash2 size={20}/>
</button>

      </div>

    </div>
  );
};

export default AddressCard;