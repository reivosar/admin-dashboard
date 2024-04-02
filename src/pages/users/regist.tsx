import UserRegisterForm from "../../components/users/UserRegisterForm";
import Breadcrumbs from "@/components/utils/Breadcrumbs";

const RegistUserPage: React.FC = () => {
  const breadcrumbPaths = [
    { label: "Users", href: "/users" },
    { label: "Regist User" },
  ];

  return (
    <div>
      <Breadcrumbs paths={breadcrumbPaths} />
      <UserRegisterForm />
    </div>
  );
};

export default RegistUserPage;
