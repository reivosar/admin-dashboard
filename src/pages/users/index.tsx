import { useSearchAndPaginationHook } from "@/hooks/useSearchAndPagination";
import UserSearchBar from "@/components/users/UserSearchBar";
import UserListView from "@/components/users/UserListView";
import ActionButtons from "@/components/users/UserActionButtons";
import { useState } from "react";
import { UserModel } from "@/types/users";

const UserListPage: React.FC = () => {
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
        <UserSearchBar {...searchProps} />
        <ActionButtons {...actionProps} />
      </div>

      <UserListView {...userListProps} />
    </div>
  );
};

export default UserListPage;
