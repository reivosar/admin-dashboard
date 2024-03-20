import { useRouter } from "next/router";
import UserEditForm from "../../../components/users/UserEditForm";

const EditUserPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <h1 className="text-3xl font-bold">Edit User</h1>
        </div>
      </div>
      {id && <UserEditForm id={id} />}
    </div>
  );
};

export default EditUserPage;
