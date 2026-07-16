import BottomNavbar from "../../components/BottomNavbar/BottomNavbar";
import ProfileHeader from "../../components/Profile/ProfileHeader";
import ProfileMenu from "../../components/Profile/ProfileMenu";

const Profile = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-slate-100">

      <div className="max-w-5xl mx-auto p-6 pb-24">

        <ProfileHeader />

        <ProfileMenu />

      </div>

      <BottomNavbar />

    </div>
  );
};

export default Profile;