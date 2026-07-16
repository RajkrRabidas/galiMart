import { Search, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ProductHeader = ({
  search,
  setSearch,
}) => {

  const navigate = useNavigate();

  return (
    <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-8">

      <div className="relative w-full">

        <Search
          className="absolute left-4 top-3.5 text-gray-400"
          size={18}
        />

        <input
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          placeholder="Search Products..."
          className="w-full border rounded-xl pl-11 pr-4 py-3"
        />

      </div>

      <button
        onClick={() =>
          navigate("/seller/add-product")
        }
        className="bg-emerald-600 text-white px-6 py-3 rounded-xl flex items-center gap-2"
      >
        <Plus size={18}/>
        Add Product
      </button>

    </div>
  );
};

export default ProductHeader;