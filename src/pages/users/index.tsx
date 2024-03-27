import { useSearchAndPaginationHook } from "@/hooks/useSearchAndPagination";
import SearchBar from "@/components/users/SearchBar";
import UserList from "@/components/users/UserList";
import ActionButtons from "@/components/users/ActionButtons";
import { useState } from "react";
import { UserModel } from "@/types/users";

const Users: React.FC = () => {
  const { states, setFilter, goToPage } = useSearchAndPaginationHook<
    UserModel[]
  >("/api/users", 10);

  const [isOpen, setIsOpen] = useState({});
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  const searchProps = {
    setFilter,
  };

  const actionProps = {
    selectedUsers,
  };

  const userListProps = {
    states,
    selectedUsers,
    isOpen,
    setIsOpen,
    setSelectedUsers,
    goToPage,
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <h1 className="text-3xl font-bold">Users</h1>
          <span className="ml-2 bg-green-500 text-white font-semibold py-1 px-3 rounded">
            {states.data.length}
          </span>
        </div>
      </div>

      <div className="flex justify-center items-center space-x-2">
        <SearchBar {...searchProps} />
        <ActionButtons {...actionProps} />
      </div>

      <UserList {...userListProps} />
    </div>
  );
};

export default Users;
