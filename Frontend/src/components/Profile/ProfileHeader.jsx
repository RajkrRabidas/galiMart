import { Camera } from "lucide-react";

const ProfileHeader = ({ user, profile }) => {
  const displayName = profile?.fullName || user?.fullName || user?.phone || "Your profile";
  const phone = user?.phone ? `+91 ${user.phone}` : "Phone not available";
  const email = profile?.email || "Add your email";

  return (
    <div className="bg-linear-to-r from-emerald-500 to-green-600 rounded-3xl p-8 text-white shadow-lg">
      <div className="flex items-center gap-6">
        <div className="relative">
          <img
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=ffffff&color=10b981&size=200`}
            alt="Profile"
            className="h-24 w-24 rounded-full border-4 border-white"
          />

          <button className="absolute bottom-0 right-0 rounded-full bg-white p-2 text-emerald-600 shadow-lg">
            <Camera size={18} />
          </button>
        </div>

        <div>
          <h1 className="text-3xl font-bold">{displayName}</h1>
          <p className="mt-2 opacity-90">{phone}</p>
          <p className="opacity-90">{email}</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;