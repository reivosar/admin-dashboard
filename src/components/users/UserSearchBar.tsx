import React, { useState } from "react";
import { SearchIcon } from "@heroicons/react/solid";

interface UserSearchBarProps {
  setFilter: (filter: Record<string, string>) => void;
}

const UserSearchBar: React.FC<UserSearchBarProps> = ({ setFilter }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = () => {
    setFilter({ searchTerm: searchTerm });
  };

  return (
    <>
      <input
        type="text"
        placeholder="Search users..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="px-4 py-2 border rounded w-full max-w-xs"
      />
      <button
        className="p-2 bg-gray-200 rounded hover:bg-gray-300"
        onClick={handleSearch}
      >
        <SearchIcon className="w-5 h-5 text-gray-600" />
      </button>
    </>
  );
};

export default UserSearchBar;
