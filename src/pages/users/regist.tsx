import UserRegistrationForm from "../../components/users/UserRegistrationForm";
import NavigationBreadcrumbs from "@/components/utils/NavigationBreadcrumbs";

const UserRegistrationPage: React.FC = () => {
  const breadcrumbPaths = [
    { label: "Users", href: "/users" },
    { label: "Regist User" },
  ];

  return (
    <div>
      <NavigationBreadcrumbs paths={breadcrumbPaths} />
      <UserRegistrationForm />
    </div>
  );
};

export default UserRegistrationPage;
