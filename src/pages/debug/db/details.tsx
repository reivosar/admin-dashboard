import { useRouter } from "next/router";
import TableDetails from "../../../components/debug/TableDetails";
import Breadcrumbs from "@/components/utils/Breadcrumbs";

const DBTableDetailsPage: React.FC = () => {
  const router = useRouter();
  const { name } = router.query;

  const tableName = Array.isArray(name) ? name[0] : name;

  const breadcrumbPaths = [
    { label: "Debug", href: "/debug" },
    { label: "Database Debugging", href: "/debug/db" },
    { label: tableName || "Details" },
  ];

  return (
    <div>
      <Breadcrumbs paths={breadcrumbPaths} />
      {typeof tableName === "string" && <TableDetails name={tableName} />}
    </div>
  );
};

export default DBTableDetailsPage;
