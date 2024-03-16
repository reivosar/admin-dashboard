import { useState } from "react";
import Link from "next/link";
import {
  DotsVerticalIcon,
  InformationCircleIcon,
  PencilIcon,
  TrashIcon,
  PlusIcon,
  SearchIcon,
  FilterIcon,
  ArrowNarrowLeftIcon,
  ArrowNarrowRightIcon,
} from "@heroicons/react/solid";

const Users: React.FC = () => {
  const [isOpen, setIsOpen] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const users = [
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      lastActive: "2023-03-15",
    },
    {
      id: 2,
      name: "Jane Doe",
      email: "jane@example.com",
      lastActive: "2023-03-14",
    },
  ];

  const toggleDropdown = (id) => {
    setIsOpen((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  const handleSelectAllChange = (e) => {
    if (e.target.checked) {
      setSelectedUsers(users.map((user) => user.id));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleUserCheckChange = (userId) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter((id) => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  const isDeleteDisabled = selectedUsers.length === 0;
  const handleDeleteSelectedUsers = () => {
    console.log("Deleting users:", selectedUsers);
  };

  const totalUsers = users.length;
  const itemsPerPage = 10;
  const totalPages = Math.ceil(totalUsers / itemsPerPage);

  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
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
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 border rounded w-1/3"
        />
        <button className="p-2 bg-gray-200 rounded hover:bg-gray-300">
          <SearchIcon className="w-5 h-5 text-gray-600" />
        </button>
        <button
          className="p-2 bg-gray-200 rounded hover:bg-gray-300"
          onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
        >
          <FilterIcon className="w-5 h-5 text-gray-600" />
        </button>
        <Link href="/users/new" legacyBehavior>
          <a className="inline-flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            <PlusIcon className="w-6 h-6" />
          </a>
        </Link>
        <button
          onClick={() => {
            handleDeleteSelectedUsers;
          }}
          disabled={isDeleteDisabled}
          className={`p-2 ${
            isDeleteDisabled ? "bg-gray-300" : "bg-red-500 hover:bg-red-600"
          } rounded`}
        >
          <TrashIcon
            className={`w-6 h-6 ${
              isDeleteDisabled ? "text-gray-500" : "text-white"
            }`}
          />
        </button>
      </div>
      {showAdvancedSearch && (
        <div className="bg-gray-100 p-4 rounded">
          <h3 className="font-semibold">Advanced Search</h3>
        </div>
      )}
      <div>
        <table className="min-w-full table-auto border-collapse border border-gray-200">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2 text-left">
                <input
                  type="checkbox"
                  checked={selectedUsers.length === users.length}
                  onChange={handleSelectAllChange}
                  className="form-checkbox"
                />
              </th>
              <th className="px-4 py-2 text-left">User Name</th>
              <th className="px-4 py-2 text-left">Email Address</th>
              <th className="px-4 py-2 text-left">Last Active</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user.id} className="hover:bg-gray-100">
                <td className="px-4 py-2">
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(user.id)}
                    onChange={() => handleUserCheckChange(user.id)}
                    className="form-checkbox"
                  />
                </td>
                <td className="px-4 py-2">{user.name}</td>
                <td className="px-4 py-2">{user.email}</td>
                <td className="px-4 py-2">{user.lastActive}</td>
                <td className="px-4 py-2 text-center relative">
                  <button onClick={() => toggleDropdown(user.id)}>
                    <DotsVerticalIcon className="w-5 h-5 text-gray-800 cursor-pointer" />
                  </button>
                  {isOpen[user.id] && (
                    <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded border">
                      <Link href={`/users/${user.id}/detail`} legacyBehavior>
                        <a className="flex items-center space-x-2 p-2 hover:bg-gray-100">
                          <InformationCircleIcon className="w-5 h-5 text-blue-500" />
                          <span>Detail</span>
                        </a>
                      </Link>
                      <Link href={`/users/${user.id}/edit`} legacyBehavior>
                        <a className="flex items-center space-x-2 p-2 hover:bg-gray-100">
                          <PencilIcon className="w-5 h-5 text-green-500" />
                          <span>Edit</span>
                        </a>
                      </Link>
                      <button className="flex items-center space-x-2 p-2 hover:bg-gray-100 w-full text-left">
                        <TrashIcon className="w-5 h-5 text-red-500" />
                        <span>Delete</span>
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-center items-center space-x-1 mt-4">
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-1 mt-4">
            {currentPage > 1 && (
              <button onClick={() => goToPage(1)} className="p-1">
                <ArrowNarrowLeftIcon className="w-5 h-5 text-gray-600" />
              </button>
            )}

            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                onClick={() => goToPage(index + 1)}
                className={`px-3 py-1 rounded ${
                  currentPage === index + 1
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {index + 1}
              </button>
            ))}

            {currentPage < totalPages && (
              <button onClick={() => goToPage(totalPages)} className="p-1">
                <ArrowNarrowRightIcon className="w-5 h-5 text-gray-600" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Users;
