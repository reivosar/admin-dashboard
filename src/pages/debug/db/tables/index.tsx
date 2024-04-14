import TableListViewer from "@/components/debug/db/TableListViewer";
import NavigationBreadcrumbs from "@/components/utils/NavigationBreadcrumbs";

const TableListPage: React.FC = () => {
  const breadcrumbPaths = [
    { label: "Debug", href: "/debug" },
    { label: "Database Debugging" },
  ];

  return (
    <div>
      <NavigationBreadcrumbs paths={breadcrumbPaths} />
      <TableListViewer />
    </div>
  );
};

export default TableListPage;
