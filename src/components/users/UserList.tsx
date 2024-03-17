import {
  DotsVerticalIcon,
  PencilIcon,
  InformationCircleIcon,
  TrashIcon,
} from "@heroicons/react/solid";
import Link from "next/link";
import Pagination from "./Pagination";

const UserList = ({
  users,
  currentPage,
  selectedUsers,
  setSelectedUsers,
  setCurrentPage,
  setIsOpen,
  isOpen,
}) => {
  const totalUsers = users.length;
  const itemsPerPage = 10;
  const totalPages = Math.ceil(totalUsers / itemsPerPage);

  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

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

  return (
    <>
      <div>
        <table className="min-w-full table-auto border-collapse border border-gray-200">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2 text-left">
                <input
                  type="checkbox"
                  checked={
                    users.length > 0 && selectedUsers.length === users.length
                  }
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
            {Array.isArray(users) &&
              users.map((user, index) => (
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
      <Pagination {...{ totalPages, currentPage, goToPage }} />
    </>
  );
};

export default UserList;
