import React from "react";
import { useRouter } from "next/router";
import { formatDateTime } from "@/utils/dateutils";
import { UserModel } from "@/types/users";

interface UserDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserModel;
}

const UserDetailsModal: React.FC<UserDetailsModalProps> = ({
  isOpen,
  onClose,
  user,
}) => {
  const router = useRouter();
  if (!isOpen) return null;

  const handleEdit = () => {
    router.push(`/users/${user.id}/edit`);
  };

  const genderStyle = {
    male: "bg-blue-500 text-white",
    female: "bg-pink-500 text-white",
    other: "bg-green-500 text-white",
  };

  const birthDateFormatted = formatDateTime(
    new Date(user.birth_date),
    "YYYY-MM-DD"
  );

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-5 rounded-lg shadow-xl max-w-lg w-full relative">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          User Detail
        </h2>
        <table className="min-w-full divide-y divide-gray-200 mt-4">
          <tbody className="bg-white divide-y divide-gray-200">
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                Name
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {user.first_name} {user.last_name}{" "}
              </td>
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                Email
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {user.email}
              </td>
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                Gender
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <span
                  className={`px-4 py-2 rounded ${genderStyle[user.gender]}`}
                >
                  {user.gender.charAt(0).toUpperCase() + user.gender.slice(1)}
                </span>
              </td>
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                Birthdate
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {birthDateFormatted}
              </td>
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                Activated
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {user.activated_at || "Not Activated"}
              </td>
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                Last Activity
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {user.lastActivity}
              </td>
            </tr>
          </tbody>
        </table>
        <div className="flex justify-end space-x-3 mt-4">
          <button
            onClick={onClose}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
          >
            Close
          </button>
          <button
            onClick={handleEdit}
            className="inline-flex items-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Edit
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDetailsModal;
