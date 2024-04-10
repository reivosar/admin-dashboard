import React, { useEffect, useState } from "react";
import Select, { MultiValue } from "react-select";
import makeAnimated from "react-select/animated";
import { Switch } from "@headlessui/react";
import { ExclamationIcon } from "@heroicons/react/solid";
import { UserNameModel } from "@/types/users";
import { get, post, put } from "@/utils/api";
import { toastError, toastSuccess } from "../utils/ToastifyAlerts";
import { showConfirmDialog } from "../utils/ConfirmDialog";

interface PermissionSettings {
  view: boolean;
  post: boolean;
  edit: boolean;
  delete: boolean;
}

interface ChannelCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface OptionType {
  value: string;
  label: string;
}

const animatedComponents = makeAnimated();

const MessageChannelSettingsModal: React.FC<ChannelCreateModalProps> = ({
  isOpen,
  onClose,
}) => {
  const initialChannelName = "";
  const initialDescription = "";
  const initialIsPublic = true;
  const initialSelectedUsers: OptionType[] = [];
  const initialUserOptions: OptionType[] = [];

  const [channelName, setChannelName] = useState(initialChannelName);
  const [description, setDescription] = useState(initialDescription);
  const [isPublic, setIsPublic] = useState(initialIsPublic);
  const [userOptions, setUserOptions] =
    useState<OptionType[]>(initialSelectedUsers);
  const [selectedUsers, setSelectedUsers] =
    useState<OptionType[]>(initialUserOptions);
  const [permissions, setPermissions] = useState<{
    [key: string]: PermissionSettings;
  }>();

  useEffect(() => {
    const fetchUserOptions = async () => {
      if (!isPublic) {
        const response = await get<UserNameModel[]>("/api/users/names");
        if (response.data) {
          const userOptions = response.data.map((user) => ({
            value: user.id.toString(),
            label: user.name,
          }));
          setUserOptions(userOptions);
        }
      } else {
        setUserOptions([]);
      }
    };
    fetchUserOptions();
  }, [isPublic]);

  const handleSelectChange = (newValue: MultiValue<OptionType>) => {
    if (!newValue || newValue.length === 0) {
      setSelectedUsers([]);
      return;
    }
    const selectedOptions = newValue.map((option) => ({
      value: option.value,
      label: option.label,
    }));
    setSelectedUsers(selectedOptions);
  };

  const handlePermissionChange = (userId: string, permissionType: string) => {
    const perm = permissionType as keyof PermissionSettings;
    setPermissions((prevPermissions) => {
      const newPermissions = { ...(prevPermissions || {}) };
      newPermissions[userId] = {
        ...(newPermissions[userId] || {}),
        [perm]: !(newPermissions[userId]?.[perm] ?? false),
      };
      return newPermissions;
    });
  };

  const togglePermission = (permissionType: string) => {
    const permType = permissionType as keyof PermissionSettings;
    const updatedPermissions: { [key: string]: PermissionSettings } = {
      ...permissions,
    };
    selectedUsers.forEach((user) => {
      if (!updatedPermissions[user.value]) {
        updatedPermissions[user.value] = {
          view: false,
          post: false,
          edit: false,
          delete: false,
        };
      }
      updatedPermissions[user.value][permType] =
        !updatedPermissions[user.value][permType];
    });
    setPermissions(updatedPermissions);
  };

  const isPermissionChecked = (permissionType: string) => {
    const permType = permissionType as keyof PermissionSettings;
    return (
      selectedUsers.length > 0 &&
      selectedUsers.every((user) =>
        permissions ? permissions[user.value]?.[permType] ?? false : false
      )
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    showConfirmDialog({
      message: "Are you sure you want to create a channel?",
      onConfirm: async () => {
        const { error } = await post(`/api/messages/channels`, {
          channelName,
          description,
          isPublic,
          selectedUsers,
          permissions,
        });

        if (error) {
          toastError(error.message);
        } else {
          toastSuccess("Channel successfully created.");
          handleClose();
        }
      },
    });
  };

  const handleClose = () => {
    setChannelName(initialChannelName);
    setDescription(initialDescription);
    setIsPublic(initialIsPublic);
    setSelectedUsers(initialSelectedUsers);
    setPermissions({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-12">
      <div className="bg-gray-900 bg-opacity-70 fixed inset-0"></div>
      <div className="bg-white p-6 rounded-lg w-full max-w-2xl space-y-4 text-gray-800 relative">
        <h2 className="text-lg font-semibold mb-4">Manage Channel Settings</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="Name"
              className="block text-sm font-bold text-gray-700"
            >
              Name
            </label>
            <input
              type="text"
              id="channelName"
              name="channelName"
              value={channelName}
              onChange={(e) => setChannelName(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label
              htmlFor="channeDescription"
              className="block text-sm font-bold text-gray-700"
            >
              Description
            </label>
            <textarea
              id="channeDescription"
              name="channeDescription"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div className="flex items-center">
            <Switch
              checked={isPublic}
              onChange={setIsPublic}
              className={`${
                isPublic ? "bg-blue-500" : "bg-gray-500"
              } relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none`}
            >
              <span className="sr-only">Toggle</span>
              <span
                className={`${
                  isPublic ? "translate-x-5" : "translate-x-0"
                } inline-block w-5 h-5 transform bg-white rounded-full transition-transform`}
              />
            </Switch>
            <span className="ml-2">
              {isPublic ? "Public" : "Private"}
              {isPublic ? (
                <span className="text-gray-600">
                  - All users can view, post, edit, and delete
                </span>
              ) : (
                <span className="text-gray-600">
                  - Only selected users can view, post, edit, and delete
                </span>
              )}
            </span>
          </div>

          {!isPublic && selectedUsers.length == 0 && (
            <div className="p-4 rounded-lg shadow mb-6 flex items-center space-x-4 border-l-4 border-yellow-500 bg-yellow-50">
              <ExclamationIcon className="h-5 w-5 text-yellow-600" />
              <p className="text-yellow-800 font-medium">
                Without assigning permissions to the selected users, they will
                not be able to view channel messages.
              </p>
            </div>
          )}

          {!isPublic && (
            <Select
              closeMenuOnSelect={false}
              components={animatedComponents}
              isMulti={true}
              options={userOptions}
              value={selectedUsers}
              onChange={handleSelectChange}
              className="w-full text-gray-800"
            />
          )}

          {!isPublic && selectedUsers.length > 0 && (
            <div className="mt-4 bg-white p-4 shadow rounded-lg text-gray-800">
              <table className="w-full text-center">
                <thead className="bg-gray-200">
                  <tr className="text-gray-800 border-b">
                    <th className="pb-2">User</th>
                    {["view", "post", "edit", "delete"].map((perm) => (
                      <th key={perm} className="py-1">
                        <span style={{ whiteSpace: "nowrap" }}>
                          {perm.charAt(0).toUpperCase() + perm.slice(1)}
                        </span>
                        <br />
                        <input
                          type="checkbox"
                          checked={isPermissionChecked(perm)}
                          onChange={() => togglePermission(perm)}
                          className="mx-auto"
                        />
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {selectedUsers.map((user) => (
                    <tr key={user.value} className="hover:bg-gray-100">
                      <td className="py-2 text-left">{user.label}</td>
                      {["view", "post", "edit", "delete"].map((perm) => (
                        <td
                          key={perm}
                          className="py-2"
                          style={{ width: "80px" }}
                        >
                          <input
                            type="checkbox"
                            checked={isPermissionChecked(perm)}
                            onChange={() =>
                              handlePermissionChange(user.value, perm)
                            }
                            className="checkbox checkbox-primary w-3.5 h-3.5 mx-auto"
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 rounded text-white bg-red-500 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded text-white bg-blue-500 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MessageChannelSettingsModal;
