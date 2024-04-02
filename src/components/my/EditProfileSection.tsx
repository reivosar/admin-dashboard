import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import {
  ChevronRightIcon,
  UserIcon,
  MailIcon,
  CalendarIcon,
  IdentificationIcon,
} from "@heroicons/react/solid";

type FormFields = {
  name?: string;
  email?: string;
  gender?: "male" | "female" | "other";
  birth_date?: string;
};

const fieldIcons = {
  name: <IdentificationIcon className="h-5 w-5 text-gray-400" />,
  email: <MailIcon className="h-5 w-5 text-gray-400" />,
  gender: <UserIcon className="h-5 w-5 text-gray-400" />,
  birth_date: <CalendarIcon className="h-5 w-5 text-gray-400" />,
};

async function fetchUserDataForSection(section: string): Promise<FormFields> {
  // ここで実際のユーザーデータ取得ロジックを実装します。
  return { [section]: "Current Data" };
}

interface EditProfileSectionProps {
  section: string;
}

const EditProfileSection: React.FC<EditProfileSectionProps> = ({ section }) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormFields>();
  const router = useRouter();

  useEffect(() => {
    const loadData = async () => {
      const userData = await fetchUserDataForSection(section);
      setValue(section, userData[section]);
    };
    loadData();
  }, [section, setValue]);

  const onSubmit = async (data: FormFields) => {
    console.log("Updating user with:", data);
    router.push("/my/profile");
  };

  return (
    <div className="max-w-4xl mx-auto my-10 p-6 shadow-lg rounded-lg bg-white">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label
            htmlFor={section}
            className="block text-sm font-medium text-gray-700"
          >
            New {section.charAt(0).toUpperCase() + section.slice(1)}
          </label>
          <div className="mt-1">
            <input
              type={section === "birth_date" ? "date" : "text"}
              {...register(section, { required: true })}
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
            />
            {errors[section] && (
              <p className="mt-2 text-sm text-red-600" id={`${section}-error`}>
                This field is required.
              </p>
            )}
          </div>
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfileSection;
