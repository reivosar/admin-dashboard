import React from "react";

export const SortIcon: React.FC<{ direction: string }> = ({ direction }) => (
  <span
    className={`inline-block ml-2 ${
      direction === "asc" ? "text-blue-600" : "text-red-600"
    }`}
  >
    {direction === "asc" ? "▲" : "▼"}
  </span>
);
