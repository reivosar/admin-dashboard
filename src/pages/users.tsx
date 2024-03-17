import { useState, useEffect } from "react";

import SearchBar from "../components/users/SearchBar";
import UserList from "../components/users/UserList";
import ActionButtons from "@/components/users/ActionButtons";

const Users: React.FC = () => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isOpen, setIsOpen] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);

  const fetchUsers = async (query = "") => {
    const response = await fetch(
      `/api/users?search=${encodeURIComponent(query)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.ok) {
      const data = await response.json();
      setUsers(data);
    } else {
      setUsers([]);
    }
  };

  useEffect(() => {
    fetchUsers(searchTerm);
  }, [searchTerm]);

  const searchProps = {
    searchTerm,
    setSearchTerm,
    setShowAdvancedSearch,
    onSearch: () => fetchUsers(searchTerm),
  };

  const actionProps = {
    selectedUsers,
  };

  const userListProps = {
    users,
    currentPage,
    selectedUsers,
    setSelectedUsers,
    setCurrentPage,
    setIsOpen,
    isOpen,
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <h1 className="text-3xl font-bold">Users</h1>
          <span className="ml-2 bg-green-500 text-white font-semibold py-1 px-3 rounded">
            {users.length}
          </span>
        </div>
      </div>

      <div className="flex justify-center items-center space-x-2">
        <SearchBar {...searchProps} />
        <ActionButtons {...actionProps} />
      </div>
      {showAdvancedSearch && (
        <div className="bg-gray-100 p-4 rounded">
          <h3 className="font-semibold">Advanced Search</h3>
        </div>
      )}

      <UserList {...userListProps} />
    </div>
  );
};

export default Users;
