import UserProfileViewer from "@/components/my/UserProfileViewer";

const UserProfilepage: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <h1 className="text-3xl font-bold">User Profile</h1>
        </div>
      </div>
      <UserProfileViewer />
    </div>
  );
};

export default UserProfilepage;
