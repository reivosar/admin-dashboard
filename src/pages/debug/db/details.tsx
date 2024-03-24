import { useRouter } from "next/router";
import TableDetails from "../../../components/debug/TableDetails";
import Breadcrumbs from "@/components/utils/Breadcrumbs";
import { useSearchAndPaginationHook } from "@/hooks/useSearchAndPagination";

const DBTableDetailsPage: React.FC = () => {
  const router = useRouter();
  const { name } = router.query;

  const tableName = Array.isArray(name) ? name[0] : name;

  const breadcrumbPaths = [
    { label: "Debug", href: "/debug" },
    { label: "Database Debugging", href: "/debug/db" },
    { label: tableName || "Details" },
  ];

  const { states, setFilter, goToPage, handleSort } =
    useSearchAndPaginationHook<TableDetails>(`/api/debug/db/${tableName}`, 10);

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
