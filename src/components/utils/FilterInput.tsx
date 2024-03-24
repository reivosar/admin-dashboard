import React from "react";
import { SearchIcon } from "@heroicons/react/solid";

export const FilterInput: React.FC<{
  onChange: (value: string) => void;
  columnName: string;
  value: string;
}> = ({ onChange, columnName, value }) => (
  <div className="relative text-gray-400 focus-within:text-gray-600">
    <input
      type="text"
      className="py-2 px-3 pl-8 w-full text-sm bg-white border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
      placeholder={`Filter ${columnName}...`}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
    <div className="absolute inset-y-0 left-0 flex items-center pl-2">
      <SearchIcon className="h-4 w-4" />
    </div>
  </div>
);
