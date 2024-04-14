import { useRouter } from "next/router";
import UserEditorForm from "@/components/users/UserEditorForm";
import NavigationBreadcrumbs from "@/components/utils/NavigationBreadcrumbs";

const UserEditorPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;

  const breadcrumbPaths = [
    { label: "Users", href: "/users" },
    { label: "Edit User" },
  ];

  return (
    <div>
      <NavigationBreadcrumbs paths={breadcrumbPaths} />
      {typeof id === "string" && <UserEditorForm id={id} />}
    </div>
  );
};

export default UserEditorPage;
