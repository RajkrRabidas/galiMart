import { useEffect, useState } from "react";
import BottomNavbar from "../../components/BottomNavbar/BottomNavbar";
import ProfileHeader from "../../components/Profile/ProfileHeader";
import ProfileMenu from "../../components/Profile/ProfileMenu";
import { useAuth } from "../../context/AuthContext";

const Profile = () => {
  const { user, profile, authLoading, fetchProfile, completeProfile } = useAuth();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    formattedAddress: "",
    latitude: "",
    longitude: "",
  });
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        await fetchProfile();
      } catch (error) {
        console.error("Failed to load profile", error);
      }
    };

    loadProfile();
  }, [fetchProfile]);

  useEffect(() => {
    if (user || profile) {
      setForm({
        fullName: profile?.fullName || "",
        email: profile?.email || "",
        formattedAddress: profile?.formattedAddress || "",
        latitude: profile?.location?.coordinates?.[1] ?? "",
        longitude: profile?.location?.coordinates?.[0] ?? "",
      });
    }
  }, [user, profile]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage("");

    try {
      const payload = {
        fullName: form.fullName,
        email: form.email,
        formattedAddress: form.formattedAddress,
        latitude: Number(form.latitude),
        longitude: Number(form.longitude),
      };

      const response = await completeProfile(payload);
      setMessage(response.message || "Profile updated successfully");
      await fetchProfile();
    } catch (error) {
      setMessage(error.response?.data?.message || "Unable to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-slate-100">
      <div className="max-w-5xl mx-auto p-6 pb-24">
        <ProfileHeader user={user} profile={profile} />
        <ProfileMenu />
      </div>

      <BottomNavbar />
    </div>
  );
};

export default Profile;


