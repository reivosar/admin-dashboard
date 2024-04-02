import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  ChevronRightIcon,
  UserIcon,
  MailIcon,
  CalendarIcon,
  IdentificationIcon,
} from "@heroicons/react/solid";

import { get } from "@/utils/api";
import { UserModelWithDetails } from "@/types/users";
import { formatDateTime } from "@/utils/dateutils";

const Profile: React.FC = () => {
  const [userData, setUserData] = useState<UserModelWithDetails | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const result = await get<UserModelWithDetails>("/api/my/profile");
      setUserData(result.data ?? null);
    };
    fetchData();
  }, []);

  const handleEditClick = (section: string) => {
    router.push(`/my/profile/${section}`);
  };

  if (!userData) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto my-10">
      <Section title="Basic Information">
        <Detail
          label="Name"
          value={`${userData?.first_name} ${userData?.last_name}`}
          icon={<IdentificationIcon className="h-5 w-5 text-gray-400" />}
          onClick={() => handleEditClick("name")}
        />
        <Detail
          label="Birth Date"
          value={
            userData?.birth_date
              ? formatDateTime(new Date(userData.birth_date), "YYYY-MM-DD")
              : "N/A"
          }
          icon={<CalendarIcon className="h-5 w-5 text-gray-400" />}
          onClick={() => handleEditClick("birth-date")}
        />
        <Detail
          label="Gender"
          value={userData?.gender}
          icon={<UserIcon className="h-5 w-5 text-gray-400" />}
          onClick={() => handleEditClick("gender")}
        />
      </Section>

      <Section title="Contact Information">
        <Detail
          label="Email"
          value={userData?.email}
          icon={<MailIcon className="h-5 w-5 text-gray-400" />}
          onClick={() => handleEditClick("email")}
        />
      </Section>
      <Section title="User Status">
        <Detail
          label="Activated At"
          value={
            userData.activated_at
              ? formatDateTime(
                  new Date(userData.activated_at),
                  "YYYY-MM-DD HH:mm"
                )
              : "Not Activated"
          }
        />
      </Section>
    </div>
  );
};

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => {
  return (
    <div className="p-6 mb-10 rounded-lg shadow-lg bg-white">
      <h3 className="text-xl font-semibold mb-4">{title}</h3>
      {children}
    </div>
  );
};

const Detail: React.FC<{
  label: string;
  value: string | null;
  icon?: JSX.Element;
  onClick?: () => void;
}> = ({ label, value, icon, onClick }) => {
  if (onClick) {
    return (
      <div
        className="flex justify-between items-center py-2 border-b border-gray-200 cursor-pointer hover:bg-gray-100"
        onClick={onClick}
      >
        <dt className="text-lg font-medium text-gray-600 flex items-center">
          {icon && <span className="mr-2">{icon}</span>}
          {label}
        </dt>
        <dd className="flex items-center text-lg text-gray-900">
          {value || "N/A"}{" "}
          <ChevronRightIcon className="w-5 h-5 ml-2 text-gray-400" />
        </dd>
      </div>
    );
  } else {
    return (
      <div className="flex justify-between items-center py-2 border-b border-gray-200">
        <dt className="text-lg font-medium text-gray-600 flex items-center">
          {icon && <span className="mr-2">{icon}</span>}
          {label}
        </dt>
        <dd>{value || "N/A"}</dd>
      </div>
    );
  }
};

export default Profile;
