import { LoadingSpinner } from "../../utils/LoadingSpinner";
import { SearchFilterInput } from "../../utils/SearchFilterInput";
import PaginationControls from "../../utils/PaginationControls";
import { SearchTableDetailsModel } from "@/types/debug";
import { SortingIcon } from "@/components/utils/SortingIcon";

interface TableDetailsViewerProps {
  states: {
    data: SearchTableDetailsModel;
    currentPage: number;
    totalPage: number;
    isLoading: boolean;
    error: string;
    filter: Record<string, string>;
    sortConfig: { key: string; direction: "asc" | "desc" } | null;
  };
  setFilter: (filter: Record<string, string>) => void;
  goToPage: (page: number) => void;
  handleSort: (key: string) => void;
}

const renderValue = (value: any) => {
  if (Array.isArray(value)) {
    return value.map((item, index) => (
      <div key={index}>{JSON.stringify(item)}</div>
    ));
  } else if (typeof value === "object") {
    return <pre>{JSON.stringify(value, null, 2)}</pre>;
  } else {
    return value?.toString();
  }
};

const TableDetailsViewer: React.FC<TableDetailsViewerProps> = ({
  states,
  setFilter,
  goToPage,
  handleSort,
}) => {
  const handleFilterChange = (columnName: string, value: string) => {
    setFilter({ [columnName]: value });
  };

  if (states.isLoading) return <LoadingSpinner />;
  if (states.error) return <div>Error: {states.error}</div>;

  const headers = states?.data?.headers;
  const data = states?.data?.data;

  const sortConfig = states.sortConfig;
  const filter = states.filter;
  const totalPage = states.totalPage;
  const currentPage = states.currentPage;

  return (
    <div>
      <table>
        <thead>
          <tr>
            {headers?.map((header, headerIndex) => (
              <th
                key={headerIndex}
                onClick={() => handleSort(header.column_name)}
              >
                {header.column_name}
                {sortConfig?.key === header.column_name && (
                  <SortingIcon direction={sortConfig?.direction} />
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr className="bg-gray-50">
            {headers?.map((header) => (
              <td key={header.column_name} className="px-6 py-3">
                <SearchFilterInput
                  columnName={header.column_name}
                  type={header.data_type}
                  value={filter[header.column_name] || ""}
                  selectOptions={header.enum_labels}
                  onChange={(value) =>
                    handleFilterChange(header.column_name, value)
                  }
                />
              </td>
            ))}
          </tr>
          {data?.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {headers?.map((header) => (
                <td key={header.column_name}>
                  {renderValue(row[header.column_name])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <PaginationControls {...{ totalPage, currentPage, goToPage }} />
      <style jsx>{`
        table {
          width: 100%;
          border-collapse: collapse;
        }
        th,
        td {
          padding: 8px;
          text-align: left;
          border-bottom: 1px solid #ddd;
        }
        th {
          background-color: #f2f2f2;
        }
        tr:hover {
          background-color: #f5f5f5;
        }
      `}</style>
    </div>
  );
};

export default TableDetailsViewer;
