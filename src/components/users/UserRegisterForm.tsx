import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { toastError, toastSuccess } from "../utils/ToastifyAlerts";

function UserRegisterForm() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    gender: "",
    birthdate: "2000-01-01",
  });

  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Something went wrong with the submission");
      }

      toastSuccess("Registration successful!");
      setFormData({
        username: "",
        email: "",
        password: "",
        gender: "",
        birthdate: "2000-01-01",
      });

      router.push("/users");
    } catch (error) {
      console.error(error);
      toastError("Failed to register. Please try again.");
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white p-8 border border-gray-300 rounded-lg shadow-lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="username"
            className="block text-sm font-bold text-gray-700"
          >
            Username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
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
          />
        </div>
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-bold text-gray-700"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
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
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label
            htmlFor="gender"
            className="block text-sm font-bold text-gray-700"
          >
            Gender
          </label>
          <div className="mt-2 flex gap-4">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, gender: "male" })}
              className={`px-4 py-2 rounded ${
                formData.gender === "male"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              }`}
            >
              Male
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, gender: "female" })}
              className={`px-4 py-2 rounded ${
                formData.gender === "female"
                  ? "bg-pink-500 text-white"
                  : "bg-gray-200"
              }`}
            >
              Female
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, gender: "other" })}
              className={`px-4 py-2 rounded ${
                formData.gender === "other"
                  ? "bg-green-500 text-white"
                  : "bg-gray-200"
              }`}
            >
              Other
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Sign Up
        </button>
      </form>
      <div className="mt-6 text-center">
        <Link href="/users" legacyBehavior>
          <a className="text-indigo-600 hover:text-indigo-500 text-sm">
            ← Back to user list
          </a>
        </Link>
      </div>
    </div>
  );
}

export default UserRegisterForm;
