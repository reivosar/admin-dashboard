import { NextRouter } from "next/router";
import { showConfirmDialog } from "../utils/ConfirmDialog";
import { toastError } from "../utils/ToastifyAlerts";
import { del } from "@/utils/api";

export const handleDelceteSelectedUsers = async (
  router: NextRouter,
  selectedUsers: string[]
) => {
  showConfirmDialog({
    message: "Are you sure you want to delete the selected users?",
    onConfirm: async () => {
      const response = await del<null>("/api/users", {
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
