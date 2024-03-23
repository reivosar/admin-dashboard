import React, { useState, useEffect } from "react";
import { toastError, toastWarn } from "../utils/ToastifyAlerts";
import { SortIcon } from "../utils/SortIcon";
import { LoadingIndicator } from "../utils/LoadingIndicator";
import { FilterInput } from "../utils/FilterInput";

type TableDetailsFormProps = {
  name: string;
};

interface TableColumn {
  column_name: string;
  data_type: string;
}

interface TableDetails {
  headers: TableColumn[];
  data: { [key: string]: any }[];
}

const TableDetails: React.FC<TableDetailsFormProps> = ({ name }) => {
  const [tableDetails, setTableDetails] = useState<TableDetails | undefined>(
    undefined
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: string;
  } | null>(null);
  const [filter, setFilter] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchTableData();
  }, [name, sortConfig]);

  const fetchTableData = async () => {
    setIsLoading(true);
    setError(null);

    let url = `/api/debug/db/${name}`;
    if (sortConfig) {
      url += `?sort=${sortConfig.key}&direction=${sortConfig.direction}`;
    }

    try {
      const response = await fetch(url);
      if (!response.ok) {
        toastWarn("Failed to fetch table data");
        setError("Failed to fetch table data");
        return;
      }
      const data: TableDetails = await response.json();
      setTableDetails(data);
    } catch (err) {
      console.error(err);
      toastError("Failed to load table data.");
      setError("Failed to load table data.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSort = (key: string) => {
    let direction = "asc";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "asc"
    ) {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const handleFilterChange = (columnName: string, value: string) => {
    setFilter((prev) => ({ ...prev, [columnName]: value }));
  };

  const filteredData = tableDetails?.data.filter((row) =>
    Object.entries(filter).every(([key, value]) =>
      row[key].toString().toLowerCase().includes(value.toLowerCase())
    )
  );

  if (isLoading) return <LoadingIndicator />;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <table>
        <thead>
          <tr>
            {tableDetails?.headers.map((header, headerIndex) => (
              <th
                key={headerIndex}
                onClick={() => handleSort(header.column_name)}
              >
                {header.column_name}
                {sortConfig?.key === header.column_name && (
                  <SortIcon direction={sortConfig.direction} />
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr className="bg-gray-50">
            {tableDetails?.headers.map((header) => (
              <td key={header.column_name} className="px-6 py-3">
                <FilterInput
                  columnName={header.column_name}
                  onChange={(value) =>
                    handleFilterChange(header.column_name, value)
                  }
                />
              </td>
            ))}
          </tr>
          {filteredData?.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {tableDetails?.headers.map((header) => (
                <td key={header.column_name}>{row[header.column_name]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
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
