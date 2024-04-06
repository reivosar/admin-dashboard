import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { toastError, toastSuccess } from "../utils/ToastifyAlerts";
import { showConfirmDialog } from "../utils/ConfirmDialog";
import { UserModelWithDetails } from "@/types/users";
import { get, put } from "@/utils/api";

type UserEditFormProps = {
  id: string;
};

const UserEditForm: React.FC<UserEditFormProps> = ({ id }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    gender: "",
    birthdate: "",
  });
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      if (!id) return;
      const response = await get<UserModelWithDetails>(`/api/users/${id}`);
      if (response.error) {
        toastError(response.error.message);
        router.push("/users");
      }
      const userData = response.data;
      if (userData) {
        setFormData({
          firstName: userData.first_name ?? "",
          lastName: userData.last_name ?? "",
          email: userData.email ?? "",
          gender: userData.gender ?? "",
          birthdate:
            (userData.birth_date
              ? userData.birth_date.toString().substring(0, 10)
              : "") ?? "",
        });
      }
    };

    fetchUserData();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCancel = () => {
    router.push("/users");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    showConfirmDialog({
      message: "Are you sure you want to update the user information?",
      onConfirm: async () => {
        const { error } = await put(`/api/users/${id}`, {
          formData,
        });
        if (error) {
          toastError(error.message);
        } else {
          toastSuccess("User updated successfully!");
          router.push("/users");
        }
      },
    });
  };

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white p-8 border border-gray-300 rounded-lg shadow-lg">
      <form onSubmit={handleSubmit} className="space-y-6">
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

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
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

        <div>
          <label
            htmlFor="birthdate"
            className="block text-sm font-medium text-gray-700"
          >
            Birthdate
          </label>
          <input
            type="date"
            id="birthdate"
            name="birthdate"
            value={formData.birthdate}
            onChange={handleChange}
            required
            pattern="^\d{4}-\d{2}-\d{2}$"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div className="mt-4">
          <label
            htmlFor="gender"
            className="block text-sm font-bold text-gray-700"
          >
            Gender
          </label>
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

export default UserEditForm;
