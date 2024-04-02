import Profile from "@/components/my/Profile";

const ProfilePage: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <h1 className="text-3xl font-bold">User Profile</h1>
        </div>
      </div>
      <Profile />
    </div>
  );
};

export default ProfilePage;
