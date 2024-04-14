import React from "react";
import { useRouter } from "next/router";
import NavigationBreadcrumbs from "@/components/utils/NavigationBreadcrumbs";
import ProfileEditor from "@/components/my/ProfileEditor";

const ProfileEditPage: React.FC = () => {
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
      <NavigationBreadcrumbs paths={breadcrumbPaths} />
      <ProfileEditor />
    </div>
  );
};

export default ProfileEditPage;
