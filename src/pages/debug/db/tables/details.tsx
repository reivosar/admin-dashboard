import { useRouter } from "next/router";
import TableDetailsViewer from "@/components/debug/db/TableDetailsViewer";
import { SearchTableDetailsModel, TableDetailsModel } from "@/types/debug";
import NavigationBreadcrumbs from "@/components/utils/NavigationBreadcrumbs";
import { useSearchAndPaginationHook } from "@/hooks/useSearchAndPagination";

const TableDetailsPage: React.FC = () => {
  const router = useRouter();
  const { name } = router.query;

  const tableName = Array.isArray(name) ? name[0] : name;

  const breadcrumbPaths = [
    { label: "Debug", href: "/debug" },
    { label: "Database Debugging", href: "/debug/db/tables" },
    { label: tableName || "Details" },
  ];

  const { states, setFilter, goToPage, handleSort } =
    useSearchAndPaginationHook<SearchTableDetailsModel>(
      `/api/debug/db/tables/${name}`,
      10
    );

  const tableDetailsFormProps = {
    states,
    setFilter,
    goToPage,
    handleSort,
  };

  return (
    <div>
      <NavigationBreadcrumbs paths={breadcrumbPaths} />
      {typeof tableName === "string" && (
        <TableDetailsViewer {...tableDetailsFormProps} />
      )}
    </div>
  );
};

export default TableDetailsPage;
