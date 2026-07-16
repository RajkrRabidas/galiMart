import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useServices } from "../../context/ServiceContext";
import BottomNavbar from "../../components/Service/BottomNavbar";

const AddService = () => {

  const navigate = useNavigate();

  const { addService, getMyBusiness } = useServices();

  const business = getMyBusiness();

  const [service, setService] = useState({

    name: "",

    category: "",

    price: "",

    description: "",

    image: "",

  });

  const handleChange = (e) => {

    setService({

      ...service,

      [e.target.name]: e.target.value,

    });

  };

  const handleSubmit = (e) => {

    e.preventDefault();
    console.log("Business:", business);

console.log("Service:", service);

    addService(

      business.owner,

      {

        ...service,

        price: Number(service.price),

      }
      

    );
    console.log("Added");

    toast.success("Service Added");

    navigate("/service/services");
    

  };

  return (

    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-slate-100 pb-24">

      <div className="max-w-3xl mx-auto p-8">

        <h1 className="text-4xl font-bold mb-8">

          Add Service

        </h1>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl shadow-lg p-8 space-y-6"
        >

          <input
            name="name"
            placeholder="Service Name"
            value={service.name}
            onChange={handleChange}
            className="w-full border rounded-xl p-3"
          />

          <select
            name="category"
            value={service.category}
            onChange={handleChange}
            className="w-full border rounded-xl p-3"
          >

            <option value="">
              Select Category
            </option>

            <option>Repair</option>
            <option>Installation</option>
            <option>Maintenance</option>
            <option>Cleaning</option>
            <option>Consultation</option>

          </select>

          <input
            type="number"
            name="price"
            placeholder="Price"
            value={service.price}
            onChange={handleChange}
            className="w-full border rounded-xl p-3"
          />

          <textarea
            rows={5}
            name="description"
            placeholder="Description"
            value={service.description}
            onChange={handleChange}
            className="w-full border rounded-xl p-3"
          />

          <input
            name="image"
            placeholder="Image URL"
            value={service.image}
            onChange={handleChange}
            className="w-full border rounded-xl p-3"
          />

          <button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-2xl font-semibold"
          >

            Add Service

          </button>

        </form>

      </div>

      <BottomNavbar />

    </div>

  );

};

export default AddService;