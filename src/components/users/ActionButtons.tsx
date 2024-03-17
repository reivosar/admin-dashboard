import Link from "next/link";
import { PlusIcon, TrashIcon } from "@heroicons/react/solid";
import { toast, ToastContainer } from "react-toastify";
import { useRouter } from "next/router";

const ActionButtons = ({ selectedUsers }) => {
  const router = useRouter();
  const isDeleteDisabled = selectedUsers.length === 0;

  const handleDeleteSelectedUsers = async () => {
    if (window.confirm("Are you sure you want to delete the selected users?")) {
      try {
        const response = await fetch("/api/users", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userIds: selectedUsers }),
        });

        if (response.ok) {
          toast.success("Users successfully deleted", {
            onClose: () => {
              router.reload();
            },
          });
        } else {
          toast.error("Failed to delete users");
        }
      } catch (error) {
        console.error("Error:", error);
        toast.error("An error occurred");
      }
    }
  };

  return (
    <>
      <Link href="/userRegister" legacyBehavior>
        <a className="inline-flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          <PlusIcon className="w-6 h-6" />
        </a>
      </Link>
      <button
        onClick={handleDeleteSelectedUsers}
        disabled={isDeleteDisabled}
        className={`ml-2 p-2 ${
          isDeleteDisabled ? "bg-gray-300" : "bg-red-500 hover:bg-red-600"
        } rounded`}
      >
        <TrashIcon
          className={`w-6 h-6 ${
            isDeleteDisabled ? "text-gray-500" : "text-white"
          }`}
        />
      </button>
    </>
  );
};

export default ActionButtons;
