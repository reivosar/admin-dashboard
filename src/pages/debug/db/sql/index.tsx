import SQLExecutorPanel from "@/components/debug/sql/SQLExecutorPanel";
import NavigationBreadcrumbs from "@/components/utils/NavigationBreadcrumbs";

const SQLExecutorPage: React.FC = () => {
  const breadcrumbPaths = [
    { label: "Debug", href: "/debug" },
    { label: "Execute SQL" },
  ];

  return (
    <div>
      <NavigationBreadcrumbs paths={breadcrumbPaths} />
      <SQLExecutorPanel />
    </div>
  );
};

export default SQLExecutorPage;
