import { useRouter } from "next/router";
import UserEditForm from "@/components/users/UserEditForm";
import Breadcrumbs from "@/components/utils/Breadcrumbs";

const EditUserPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;

  const breadcrumbPaths = [
    { label: "Users", href: "/users" },
    { label: "Edit User" },
  ];

  return (
    <div>
      <Breadcrumbs paths={breadcrumbPaths} />
      {typeof id === "string" && <UserEditForm id={id} />}
    </div>
  );
};

export default EditUserPage;
