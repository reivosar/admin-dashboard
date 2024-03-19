import UserRegisterForm from "../../components/users/UserRegisterForm";

const RegistUserPage: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <h1 className="text-3xl font-bold">Regist User</h1>
        </div>
      </div>
      <UserRegisterForm />
    </div>
  );
};

export default RegistUserPage;
