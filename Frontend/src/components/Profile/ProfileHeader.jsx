import { Camera } from "lucide-react";

const ProfileHeader = () => {
  return (
    <div className="bg-gradient-to-r from-emerald-500 to-green-600 rounded-3xl p-8 text-white shadow-lg">

      <div className="flex items-center gap-6">

        <div className="relative">

          <img
            src="https://ui-avatars.com/api/?name=Farhann+Akhter&background=ffffff&color=10b981&size=200"
            alt="Profile"
            className="w-24 h-24 rounded-full border-4 border-white"
          />

          <button className="absolute bottom-0 right-0 bg-white text-emerald-600 rounded-full p-2 shadow-lg">
            <Camera size={18} />
          </button>

        </div>

        <div>

          <h1 className="text-3xl font-bold">
            Farhann Akhter
          </h1>

          <p className="mt-2 opacity-90">
            +91 9876543210
          </p>

          <p className="opacity-90">
            farhann@email.com
          </p>

        </div>

      </div>

    </div>
  );
};

export default ProfileHeader;