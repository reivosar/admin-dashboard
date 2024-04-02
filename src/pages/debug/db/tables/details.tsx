import { useRouter } from "next/router";
import TableDetails from "@/components/debug/db/TableDetails";
import { SearchTableDetailsModel, TableDetailsModel } from "@/types/debug";
import Breadcrumbs from "@/components/utils/Breadcrumbs";
import { useSearchAndPaginationHook } from "@/hooks/useSearchAndPagination";

const DBTableDetailsPage: React.FC = () => {
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
      <Breadcrumbs paths={breadcrumbPaths} />
      {typeof tableName === "string" && (
        <TableDetails {...tableDetailsFormProps} />
      )}
    </div>
  );
};

export default DBTableDetailsPage;
