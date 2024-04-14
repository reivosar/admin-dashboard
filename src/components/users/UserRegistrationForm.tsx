import React, { useState } from "react";
import { useRouter } from "next/router";
import { toastError, toastSuccess } from "../utils/ToastNotifications";
import { post } from "@/utils/api";

function UserRegistrationForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    autoGeneratePassword: true,
    gender: "",
    birthdate: "2000-01-01",
  });

  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleCancel = () => {
    router.push("/users");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (formData.autoGeneratePassword) {
      formData.password = "GeneratedStrongPassword123!";
    }

    try {
      const { error } = await post("/api/users", formData);
      if (error) {
        toastError(error.message);
        return;
      }
      toastSuccess("Registration successful!");
      router.push("/users");
    } catch (error) {
      toastError("Failed to register. Please try again.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white p-8 border border-gray-300 rounded-lg shadow-lg">
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
              placeholder="John"
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
              placeholder="Doe"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-bold text-gray-700"
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
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="john.doe@example.com"
          />
        </div>

        <div>
          <div className="flex gap-4 items-center">
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-bold text-gray-700"
              >
                Password
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="autoGeneratePassword"
                name="autoGeneratePassword"
                checked={formData.autoGeneratePassword}
                onChange={handleChange}
                className="mr-2"
              />
              <label
                htmlFor="autoGeneratePassword"
                className="text-sm font-bold text-gray-700"
              >
                Auto-generate
              </label>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required={!formData.autoGeneratePassword}
                disabled={formData.autoGeneratePassword}
                className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
                  formData.autoGeneratePassword
                    ? "bg-gray-200 text-gray-500"
                    : ""
                }`}
                placeholder="Password"
              />
            </div>
            <div className="flex-1">
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required={!formData.autoGeneratePassword}
                disabled={formData.autoGeneratePassword}
                className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
                  formData.autoGeneratePassword
                    ? "bg-gray-200 text-gray-500"
                    : ""
                }`}
                placeholder="Confirm Password"
              />
            </div>
          </div>
        </div>

        <div>
          <label
            htmlFor="birthdate"
            className="block text-sm font-bold text-gray-700"
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
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
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
            Register
          </button>
        </div>
      </form>
    </div>
  );
}

export default UserRegistrationForm;
