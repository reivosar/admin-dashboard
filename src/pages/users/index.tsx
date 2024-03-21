import { UserHooks } from "@/hooks/users/useUsers";
import SearchBar from "../../components/users/SearchBar";
import UserList from "../../components/users/UserList";
import ActionButtons from "@/components/users/ActionButtons";

const Users: React.FC = () => {
  const {
    users,
    currentPage,
    isOpen,
    searchTerm,
    selectedUsers,
    showAdvancedSearch,
    setCurrentPage,
    setIsOpen,
    setSearchTerm,
    setSelectedUsers,
    setShowAdvancedSearch,
    fetchUsers,
  } = UserHooks();

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
    isOpen,
    setCurrentPage,
    setIsOpen,
    setSelectedUsers,
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
