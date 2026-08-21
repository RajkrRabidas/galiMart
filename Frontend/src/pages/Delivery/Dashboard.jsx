import {
  Truck,
  Package,
  IndianRupee,
  CheckCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import BottomNavbar from "../../components/DeliveryPartner/BottomNavbar";
import StatsCard from "../../components/DeliveryPartner/StatsCard";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axios";

const Dashboard = () => {

  const { user } = useAuth();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);
  const [creatingProfile, setCreatingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    phoneNumber: "",
    aadharNumber: "",
    drivingLicenseNumber: "",
    image: null,
  });

  const fetchProfile = async () => {
    try {
      const response = await api.get("/rider/myprofile");
      setProfile(response.data.riderProfile || null);
    } catch (error) {
      if (error.response?.status !== 404) {
        toast.error(error.response?.data?.message || "Unable to load rider profile");
      }
      setProfile(null);
    }finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if(user?.role === "rider") fetchProfile();
    else setLoading(false);
  }, [user]);

  const handleProfileChange = (event) => {
    const { name, value, files } = event.target;
    setProfileForm((current) => ({
      ...current,
      [name]: files ? files[0] : value,
    }));
  };

  const createProfile = async (event) => {
    event.preventDefault();
    const { phoneNumber, aadharNumber, drivingLicenseNumber, image } = profileForm;

    if (!phoneNumber || !aadharNumber || !drivingLicenseNumber || !image) {
      toast.error("Please complete all fields and select a profile image");
      return;
    }

    if (!navigator.geolocation) {
      toast.error("Location access is required to create your profile");
      return;
    }

    setCreatingProfile(true);
    navigator.geolocation.getCurrentPosition(async ({ coords }) => {
      try {
        const formData = new FormData();
        formData.append("phoneNumber", phoneNumber);
        formData.append("aadharNumber", aadharNumber);
        formData.append("aadharImage", "profile-image");
        formData.append("drivingLicenseNumber", drivingLicenseNumber);
        formData.append("latitude", coords.latitude);
        formData.append("longitude", coords.longitude);
        formData.append("image", image);

        const response = await api.post("/rider/add/profile", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setProfile(response.data.riderProfile);
        toast.success(response.data.message || "Rider profile created successfully");
      } catch (error) {
        toast.error(error.response?.data?.message || "Unable to create rider profile");
      } finally {
        setCreatingProfile(false);
      }
    }, () => {
      setCreatingProfile(false);
      toast.error("Please allow location access to create your profile");
    });
  };

  const toggleAvailability = async () => {
    if (!navigator.geolocation) {
      toast.error("Location access is required");
      return;
    }

    setToggling(true);

    navigator.geolocation.getCurrentPosition(async (position) => {
      try{
        await api.patch("/rider/toggle-availability", {
          isAvailable: !profile.isAvailable,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
        await fetchProfile();

        toast.success(`You are now ${!profile.isAvailable ? "available" : "unavailable"} for deliveries.`);
      }catch(err){
        toast.error(err.response?.data?.message || "Unable to update availability");
      }finally{
        setToggling(false);
      }
    }, () => {
      setToggling(false);
      toast.error("Please allow location access to update availability");
    });
  };

  if(user?.role !== "rider"){
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>You are not registered as rider.</p>
      </div>
    );
  }

  if(loading){
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading rider details...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-emerald-50 px-6 py-10 pb-24">
        <form onSubmit={createProfile} className="mx-auto max-w-xl rounded-2xl bg-white p-6 shadow-lg">
          <h1 className="mb-2 text-3xl font-bold">Create rider profile</h1>
          <p className="mb-6 text-slate-600">Complete your details before accepting deliveries.</p>
          <div className="space-y-4">
            <input name="phoneNumber" value={profileForm.phoneNumber} onChange={handleProfileChange} placeholder="Phone number" type="tel" required className="w-full rounded-lg border p-3" />
            <input name="aadharNumber" value={profileForm.aadharNumber} onChange={handleProfileChange} placeholder="Aadhaar number" required className="w-full rounded-lg border p-3" />
            <input name="drivingLicenseNumber" value={profileForm.drivingLicenseNumber} onChange={handleProfileChange} placeholder="Driving license number" required className="w-full rounded-lg border p-3" />
            <label className="block text-sm font-medium text-slate-700">Profile image
              <input name="image" onChange={handleProfileChange} type="file" accept="image/*" required className="mt-2 w-full rounded-lg border p-3" />
            </label>
            <button disabled={creatingProfile} className="w-full rounded-lg bg-emerald-600 p-3 font-semibold text-white disabled:opacity-60">
              {creatingProfile ? "Creating profile..." : "Create rider profile"}
            </button>
          </div>
        </form>
        <BottomNavbar />
      </div>
    );
  }

  return (

    <div className="min-h-screen from-emerald-50 via-white to-slate-100 pb-24">

      <div className="max-w-7xl mx-auto p-6">

        <h1 className="text-4xl font-bold mb-8">

          Delivery Dashboard

        </h1>

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">

          <StatsCard
            title="Available"
            value={profile.isAvailable ? "Online" : "Offline"}
            icon={<Package className="text-white" />}
            color="bg-blue-600"
          />

          <StatsCard
            title="My Deliveries"
            value="0"
            icon={<Truck className="text-white" />}
            color="bg-emerald-600"
          />

          <StatsCard
            title="Completed"
            value="0"
            icon={<CheckCircle className="text-white" />}
            color="bg-purple-600"
          />

          <StatsCard
            title="Earnings"
            value="₹0"
            icon={<IndianRupee className="text-white" />}
            color="bg-orange-500"
          />

        </div>

        <button onClick={toggleAvailability} disabled={toggling} className="mt-8 rounded-lg bg-emerald-600 px-5 py-3 font-semibold text-white disabled:opacity-60">
          {toggling ? "Updating..." : profile.isAvailable ? "Go offline" : "Go online"}
        </button>

      </div>

      <BottomNavbar />

    </div>

  );

};

export default Dashboard;