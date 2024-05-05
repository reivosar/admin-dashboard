import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { toastError, toastSuccess } from "../utils/ToastNotifications";
import { showConfirmDialog } from "../utils/ConfirmationDialog";
import { put } from "@/utils/api";
import { get } from "@/utils/api";
import { UserModelWithDetails } from "@/types/users";
import {
  ExclamationIcon,
  UserIcon,
  MailIcon,
  CalendarIcon,
  IdentificationIcon,
} from "@heroicons/react/solid";
import error from "next/error";

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  confirmEmail: string;
  gender: string;
  birthdate: string;
};

const ProfileEditor: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    confirmEmail: "",
    gender: "",
    birthdate: "",
  });
  const router = useRouter();
  const section = Array.isArray(router.query.section)
    ? router.query.section[0]
    : router.query.section;

  const handleCancel = () => {
    router.push("/my/profile");
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const result = await get<UserModelWithDetails>("/api/my/profile");
      if (result.error) {
        toastError("Failed to load user data.");
        router.push("/login");
      }
      const userData = result.data;
      if (userData) {
        setFormData({
          firstName: userData.first_name ?? "",
          lastName: userData.last_name ?? "",
          email: userData.email ?? "",
          confirmEmail: "",
          gender: userData.gender ?? "",
          birthdate:
            (userData.birth_date
              ? userData.birth_date.toString().substring(0, 10)
              : "") ?? "",
        });
      }
    };

    fetchUserData();
  }, [section]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    showConfirmDialog({
      message: "Are you sure you want to update the your information?",
      onConfirm: async () => {
        const response = await put(`/api/my/profile/${section}`, {
          formData,
        });
        if (response.error) {
          toastError(response.error.message);
        } else {
          toastSuccess(`${section} updated successfully!`);
          router.push("/my/profile");
        }
      },
    });
  };

  const renderFormElement = () => {
    switch (section) {
      case "name":
        return (
          <>
            <div className="p-4 rounded-lg shadow mb-6 flex items-center space-x-4 border-l-4 border-gray-200 bg-white">
              <IdentificationIcon className="h-6 w-6 text-gray-800" />
              <p className="text-gray-800 font-medium flex-1">
                Please enter the user's full name. This will be used for account
                identification and communication purposes.
              </p>
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <label
                  htmlFor="firstName"
                  className="block text-sm font-bold text-gray-700"
                >
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div className="flex-1">
                <label
                  htmlFor="lastName"
                  className="block text-sm font-bold text-gray-700"
                >
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
          </>
        );
      case "email":
        return (
          <>
            <div className="p-4 rounded-lg shadow mb-6 flex items-center space-x-4 border-l-4 border-gray-200 bg-white">
              <MailIcon className="h-6 w-6 text-gray-800" />
              <div className="text-gray-800 font-medium flex-1">
                <p>
                  Enter a new email address for the user. This email will be
                  used for:
                </p>
                <ul className="list-disc list-inside">
                  <li>Account recovery</li>
                  <li>Notifications</li>
                  <li>Other communications</li>
                </ul>
              </div>
            </div>
            <div className="p-4 rounded-lg shadow mb-6 flex items-center space-x-4 border-l-4 border-yellow-500 bg-yellow-50">
              <ExclamationIcon className="h-5 w-5 text-yellow-600" />
              <p className="text-yellow-800 font-medium">
                Changing the email address will also change the your login ID.
              </p>
            </div>

            <div className="space-y-2">
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                pattern="^[a-zA-Z0-9.!#$&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div className="space-y-2">
              <input
                type="confirmEmail"
                id="confirmEmail"
                name="confirmEmail"
                value={formData.confirmEmail}
                onChange={handleChange}
                required
                pattern="^[a-zA-Z0-9.!#$&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Confirm Email"
              />
            </div>
          </>
        );
      case "gender":
        return (
          <>
            <div className="p-4 rounded-lg shadow mb-6 flex items-center space-x-4 border-l-4 border-gray-200 bg-white">
              <UserIcon className="h-6 w-6 text-gray-800" />
              <p className="text-gray-800 font-medium flex-1">
                Gender helps customize your experience. Select "Other" if you
                prefer not to say.
              </p>
            </div>

            <div className="mt-4">
              <div className="mt-2 space-x-4">
                <label
                  className={`px-4 py-2 border rounded ${
                    formData.gender === "male"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  <input
                    type="radio"
                    name="gender"
                    value="male"
                    checked={formData.gender === "male"}
                    onChange={handleChange}
                    required
                    className="sr-only"
                  />{" "}
                  Male
                </label>
                <label
                  className={`px-4 py-2 border rounded ${
                    formData.gender === "female"
                      ? "bg-pink-500 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  <input
                    type="radio"
                    name="gender"
                    value="female"
                    checked={formData.gender === "female"}
                    onChange={handleChange}
                    required
                    className="sr-only"
                  />{" "}
                  Female
                </label>
                <label
                  className={`px-4 py-2 border rounded ${
                    formData.gender === "other"
                      ? "bg-green-500 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  <input
                    type="radio"
                    name="gender"
                    value="other"
                    checked={formData.gender === "other"}
                    onChange={handleChange}
                    required
                    className="sr-only"
                  />{" "}
                  Other
                </label>
              </div>
            </div>
          </>
        );
      case "birthdate":
        return (
          <>
            <div className="p-4 rounded-lg shadow mb-6 flex items-center space-x-4 border-l-4 border-gray-200 bg-white">
              <CalendarIcon className="h-6 w-6 text-gray-800" />
              <p className="text-gray-800 font-medium flex-1">
                Please enter the user's birthdate accurately. The age
                information is used to provide content tailored to the user's
                age on the dashboard.
              </p>
            </div>
            <input
              type="date"
              id="birthdate"
              name="birthdate"
              value={formData.birthdate}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 mb-6"
            />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white p-8 border border-gray-300 rounded-lg shadow-lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        {section && <div>{renderFormElement()}</div>}

        <hr className="my-4 border-gray-300" />
        <div className="flex justify-between">
          <button
            type="button"
            onClick={handleCancel}
            className="flex-1 mr-2 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 ml-2 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Update
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileEditor;
