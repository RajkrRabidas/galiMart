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

        <div className="mt-8 rounded-3xl bg-white p-6 shadow-lg">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Complete your profile</h2>
              <p className="text-sm text-gray-500">Save your name, email, and address for deliveries.</p>
            </div>
          </div>

          {message && <p className="mb-4 text-sm text-emerald-600">{message}</p>}

          {!authLoading ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <label className="block text-sm font-medium text-gray-700">
                  Full name
                  <input
                    value={form.fullName}
                    onChange={(e) => setForm((prev) => ({ ...prev, fullName: e.target.value }))}
                    className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2"
                    placeholder="Your full name"
                    required
                  />
                </label>

                <label className="block text-sm font-medium text-gray-700">
                  Email
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                    className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2"
                    placeholder="you@example.com"
                  />
                </label>
              </div>

              <label className="block text-sm font-medium text-gray-700">
                Address
                <input
                  value={form.formattedAddress}
                  onChange={(e) => setForm((prev) => ({ ...prev, formattedAddress: e.target.value }))}
                  className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2"
                  placeholder="House / apartment / area"
                  required
                />
              </label>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="block text-sm font-medium text-gray-700">
                  Latitude
                  <input
                    type="number"
                    step="any"
                    value={form.latitude}
                    onChange={(e) => setForm((prev) => ({ ...prev, latitude: e.target.value }))}
                    className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2"
                    required
                  />
                </label>

                <label className="block text-sm font-medium text-gray-700">
                  Longitude
                  <input
                    type="number"
                    step="any"
                    value={form.longitude}
                    onChange={(e) => setForm((prev) => ({ ...prev, longitude: e.target.value }))}
                    className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2"
                    required
                  />
                </label>
              </div>

              <button
                type="submit"
                className="rounded-xl bg-emerald-600 px-4 py-2 font-semibold text-white"
                disabled={isSaving}
              >
                {isSaving ? "Saving..." : "Save profile"}
              </button>
            </form>
          ) : (
            <p className="text-sm text-gray-500">Loading profile...</p>
          )}
        </div>

        <ProfileMenu />
      </div>

      <BottomNavbar />
    </div>
  );
};

export default Profile;