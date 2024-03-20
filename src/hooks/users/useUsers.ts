import { useState, useEffect } from "react";

export const userHooks = () => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isOpen, setIsOpen] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);

  const fetchUsers = async (query = "") => {
    try {
      const response = await fetch(
        `/api/users?search=${encodeURIComponent(query)}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );
      const data = (await response.ok) ? await response.json() : [];
      setUsers(data);
    } catch (error) {
      console.error("Fetch error:", error);
      setUsers([]);
    }
  };

  useEffect(() => {
    fetchUsers(searchTerm);
  }, [searchTerm]);

  return {
    users,
    currentPage,
    isOpen,
    searchTerm,
    selectedUsers,
    showAdvancedSearch,
    setUsers,
    setCurrentPage,
    setIsOpen,
    setSearchTerm,
    setSelectedUsers,
    setShowAdvancedSearch,
    fetchUsers,
  };
};
