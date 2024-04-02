import React from "react";
import { useRouter } from "next/router";
import EditProfileSection from "@/components/my/EditProfileSection";
import Breadcrumbs from "@/components/utils/Breadcrumbs";

const EditProfilePage: React.FC = () => {
  const router = useRouter();
  const { section } = router.query;

  const pageTitle =
    typeof section === "string"
      ? `${section.charAt(0).toUpperCase()}${section.slice(1)}`
      : "User Profile";

  const breadcrumbPaths = [
    { label: "Profile", href: "/my/profile" },
    { label: pageTitle },
  ];

  return (
    <div>
      <Breadcrumbs paths={breadcrumbPaths} />
      <EditProfileSection section={section as string} />
    </div>
  );
};

export default EditProfilePage;
