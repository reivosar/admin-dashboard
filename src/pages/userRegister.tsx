import UserRegisterForm from "../components/users/UserRegisterForm";

export default function SignupPage() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <h1 className="text-3xl font-bold">User Register</h1>
        </div>
      </div>
      <UserRegisterForm />
    </div>
  );
}
