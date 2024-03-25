import TableList from "@/components/debug/TableList";
import Breadcrumbs from "@/components/utils/Breadcrumbs";

const DebugDBPage: React.FC = () => {
  const breadcrumbPaths = [
    { label: "Debug", href: "/debug" },
    { label: "Database Debugging" },
  ];

  return (
    <div>
      <Breadcrumbs paths={breadcrumbPaths} />
      <TableList />
    </div>
  );
};

export default DebugDBPage;
