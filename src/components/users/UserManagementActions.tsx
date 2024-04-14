import { NextRouter } from "next/router";
import { showConfirmDialog } from "../utils/ConfirmationDialog";
import { toastError } from "../utils/ToastNotifications";
import { del } from "@/utils/api";

export const handleDelceteSelectedUsers = async (
  router: NextRouter,
  selectedUsers: string[]
) => {
  showConfirmDialog({
    message: "Are you sure you want to delete the selected users?",
    onConfirm: async () => {
      const response = await del("/api/users", {
        userIds: selectedUsers,
      });
      if (response.error) {
        toastError(response.error.message);
      } else {
        router.reload();
      }
    },
  });
};
