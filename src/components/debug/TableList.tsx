import React, { useState, useEffect } from "react";
import { toastError } from "../utils/ToastifyAlerts";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/solid";
import { Tooltip } from "@mui/material";
import MermaidGraph from "./MermaidGraph";
import Link from "next/link";
import { TableDetailsModel } from "@/types/debug";

const TableList: React.FC = () => {
  const [tables, setTables] = useState<TableDetailsModel[]>([]);
  const [mermaidDefinition, setMermaidDefinition] = useState<string>("");

  useEffect(() => {
    const fetchTableData = async () => {
      try {
        const response = await fetch("/api/debug/db", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (response.ok) {
          const data = await response.json();
          console.log(data);
          setTables(data);
        }
      } catch (error) {
        toastError("Failed to load table data.");
      }
    };
    fetchTableData();
  }, []);

  useEffect(() => {
    const generateMermaidDiagram = (tables: TableDetailsModel[]): string => {
      let diagram = "erDiagram\n";
      tables.forEach((table) => {
        diagram += `    ${table.table_name} {\n`;
        table.columns.forEach((column) => {
          const dataType = column.data_type.replace(/\s+/g, "_");
          const primaryKeyIndicator = column.is_primary ? "PK" : "";
          diagram += `        ${column.column_name} ${dataType} ${primaryKeyIndicator}\n`;
        });
        diagram += `    }\n`;
      });
      tables.forEach((table) => {
        table.columns
          .filter((column) => column.foreign_table)
          .forEach((column) => {
            diagram += `    ${table.table_name} ||--o{ ${column.foreign_table} : "${column.column_name}"\n`;
          });
      });
      return diagram;
    };
    if (tables.length > 0) {
      const mermaidDiagram = generateMermaidDiagram(tables);
      setMermaidDefinition(mermaidDiagram);
    }
  }, [tables]);

  const renderIcon = (condition: boolean) => (
    <span>
      {condition ? (
        <CheckCircleIcon className="mx-auto h-5 w-5 text-green-500" />
      ) : (
        <XCircleIcon className="mx-auto h-5 w-5 text-red-500" />
      )}
    </span>
  );

  return (
    <div className="space-y-8">
      <MermaidGraph mermaidDefinition={mermaidDefinition} />
      {tables.map((table, index) => (
        <div
          key={index}
          id={table.table_name}
          className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg"
        >
          <h3 className="text-lg font-semibold bg-gray-50 px-4 py-2">
            <Link
              href={`/debug/db/details?name=${table.table_name}`}
              legacyBehavior
            >
              <a className="text-blue-500 hover:text-blue-700">
                {table.table_name}
              </a>
            </Link>
          </h3>
          <table
            className="min-w-full divide-y divide-gray-200 table-fixed"
            style={{ tableLayout: "fixed" }}
          >
            <thead className="bg-gray-50">
              <tr>
                <th className="w-1/4 px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Column Name
                </th>
                <th className="w-1/4 px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Data Type
                </th>
                <th className="w-1/12 px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                  PK
                </th>
                <th className="w-1/12 px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                  Unique
                </th>
                <th className="w-1/12 px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                  Nullable
                </th>
                <th className="w-1/12 px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                  Default
                </th>
                <th className="w-1/4 px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Foreign Table
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {table.columns.map((column, colIndex) => (
                <tr key={colIndex} className="bg-white">
                  <td className="px-2 py-2">{column.column_name}</td>
                  <td className="px-2 py-2">
                    {column.enum_labels
                      ? `enum (${column.enum_labels})`
                      : column.data_type}
                  </td>
                  <td className="px-2 py-2 text-center">
                    {renderIcon(column.is_primary)}
                  </td>
                  <td className="px-2 py-2 text-center">
                    {renderIcon(column.is_unique)}
                  </td>
                  <td className="px-2 py-2 text-center">
                    {renderIcon(column.is_nullable)}
                  </td>
                  <td className="px-2 py-2">
                    <Tooltip title={column.default_value}>
                      <span>
                        {column.default_value ? (
                          <CheckCircleIcon className="mx-auto h-5 w-5 text-green-500" />
                        ) : (
                          <XCircleIcon className="mx-auto h-5 w-5 text-red-500" />
                        )}
                      </span>
                    </Tooltip>
                  </td>
                  <td className="px-2 py-2">
                    {column.foreign_table ? (
                      <a
                        href={`#${column.foreign_table}`}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        {column.foreign_table}
                      </a>
                    ) : (
                      ""
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
};

export default TableList;
