import { SortIcon } from "../utils/SortIcon";
import { LoadingIndicator } from "../utils/LoadingIndicator";
import { FilterInput } from "../utils/FilterInput";
import Pagination from "../utils/Pagination";
import { SearchTableDetails } from "@/types/debug";

type TableDetailsFormProps = {
  states: {
    data: SearchTableDetails;
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
};

const TableDetails: React.FC<TableDetailsFormProps> = ({
  states,
  setFilter,
  goToPage,
  handleSort,
}) => {
  const handleFilterChange = (columnName: string, value: string) => {
    setFilter({ [columnName]: value });
  };

  if (states.isLoading) return <LoadingIndicator />;
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
                  <SortIcon direction={sortConfig?.direction} />
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr className="bg-gray-50">
            {headers?.map((header) => (
              <td key={header.column_name} className="px-6 py-3">
                <FilterInput
                  columnName={header.column_name}
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
                <td key={header.column_name}>{row[header.column_name]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination {...{ totalPage, currentPage, goToPage }} />
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

export default TableDetails;
