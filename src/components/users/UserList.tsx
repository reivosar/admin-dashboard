import {
  DotsVerticalIcon,
  PencilIcon,
  InformationCircleIcon,
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/solid";
import Link from "next/link";
import Pagination from "./Pagination";
import { useRouter } from "next/router";
import { handleDelceteSelectedUsers } from "./UserActions";
import { useEffect, useState } from "react";
import UserDetailModal from "./UserDetailModal";

const UserList = ({
  users,
  currentPage,
  selectedUsers,
  setSelectedUsers,
  setCurrentPage,
  setIsOpen,
  isOpen,
}) => {
  const router = useRouter();
  const totalUsers = users.length;
  const itemsPerPage = 10;
  const totalPages = Math.ceil(totalUsers / itemsPerPage);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

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

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (isModalOpen) {
        return;
      }
      const menu = document.getElementById("dropdown-menu");
      if (
        menu &&
        !menu.contains(event.target) &&
        !event.target.matches(".dropdown-button")
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isModalOpen]);

  const handleOpenModal = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  return (
    <>
      <div>
        <table className="min-w-full table-auto border-collapse border border-gray-200">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2 w-12">
                <input
                  type="checkbox"
                  checked={
                    users.length > 0 && selectedUsers.length === users.length
                  }
                  onChange={handleSelectAllChange}
                  className="form-checkbox"
                />
              </th>
              <th className="px-4 py-2 w-1/4">User Name</th>
              <th className="px-4 py-2 w-1/4">Email Address</th>
              <th className="px-4 py-2 w-1/6">Activation</th>
              <th className="px-4 py-2 w-1/3">Last Active</th>
              <th className="px-4 py-2 w-12"></th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(users) &&
              users.map((user, index) => (
                <tr key={user.id} className="hover:bg-gray-100">
                  <td className="px-4 py-2 w-12 text-center relative">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => handleUserCheckChange(user.id)}
                      className="form-checkbox"
                    />
                  </td>
                  <td className="px-4 py-2 w-1/4">{user.name}</td>
                  <td className="px-4 py-2 w-1/4">{user.email}</td>
                  <td className="px-4 py-2 w-1/6 text-center relative">
                    {user.activated_at ? (
                      <div className="tooltip">
                        <CheckCircleIcon className="w-5 h-5 text-green-500" />
                        <span className="tooltiptext">
                          Activated: {user.activated_at}
                        </span>
                      </div>
                    ) : (
                      <div className="tooltip">
                        <XCircleIcon className="w-5 h-5 text-red-500" />
                        <span className="tooltiptext">Not Activated</span>
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-2 w-1/3">{user.lastActivity}</td>
                  <td className="px-4 py-2 w-12 text-center relative">
                    <button onClick={() => toggleDropdown(user.id)}>
                      <DotsVerticalIcon className="w-5 h-5 text-gray-800 cursor-pointer" />
                    </button>
                    {isOpen[user.id] && (
                      <div
                        id="dropdown-menu"
                        className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded border"
                      >
                        <div className=" hover:bg-gray-100">
                          <button
                            onClick={() => handleOpenModal(user)}
                            className="flex items-center space-x-2 p-2"
                          >
                            <InformationCircleIcon className="w-5 h-5 text-blue-500" />
                            <span>Detail</span>
                          </button>
                        </div>
                        <Link href={`/users/${user.id}/edit`} legacyBehavior>
                          <a className="flex items-center space-x-2 p-2 hover:bg-gray-100">
                            <PencilIcon className="w-5 h-5 text-green-500" />
                            <span>Edit</span>
                          </a>
                        </Link>
                        <button
                          onClick={() => {
                            handleDelceteSelectedUsers(router, [user.id]);
                          }}
                          className="flex items-center space-x-2 p-2 hover:bg-gray-100 w-full text-left"
                        >
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
      {isModalOpen && selectedUser && (
        <UserDetailModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          user={selectedUser}
        />
      )}
      <Pagination {...{ totalPages, currentPage, goToPage }} />
    </>
  );
};

export default UserList;
