import React, { useEffect, useState } from "react";
import { UserModelWithDetails } from "@/types/users";
import { get } from "@/utils/api";

const Profile: React.FC = () => {
  const [userData, setUserData] = useState<UserModelWithDetails>();

  useEffect(() => {
    const fetchData = async () => {
      const result = await get<UserModelWithDetails>(`/api/my/profile`);
      setUserData(result.data);
    };
    fetchData();
  }, []);

  if (!userData) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:p-0">
          <dl className="sm:divide-y sm:divide-gray-200">
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
              <dt className="text-sm font-medium text-gray-500">Name</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                {userData.name}
              </dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
              <dt className="text-sm font-medium text-gray-500">Email</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                {userData.email}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
};

export default Profile;
