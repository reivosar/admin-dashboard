import ExecuteSQL from "@/components/debug/sql/ExecuteSQL";
import Breadcrumbs from "@/components/utils/Breadcrumbs";

const DebugSQLPage: React.FC = () => {
  const breadcrumbPaths = [
    { label: "Debug", href: "/debug" },
    { label: "Execute SQL" },
  ];

  return (
    <div>
      <Breadcrumbs paths={breadcrumbPaths} />
      <ExecuteSQL />
    </div>
  );
};

export default DebugSQLPage;
