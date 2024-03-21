import { NextRouter } from "next/router";
import { showConfirmDialog } from "../utils/ConfirmDialog";
import { toastError } from "../utils/ToastifyAlerts";

export const handleDelceteSelectedUsers = async (
  router: NextRouter,
  selectedUsers: string[]
) => {
  showConfirmDialog({
    message: "Are you sure you want to delete the selected users?",
    onConfirm: async () => {
      try {
        const response = await fetch("/api/users", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userIds: selectedUsers }),
        });

        if (response.ok) {
          router.reload();
        } else {
          toastError("Failed to delete users");
        }
      } catch (error) {
        console.error("Error:", error);
        toastError("An error occurred");
      }
    },
  });
};
