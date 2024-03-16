import Link from "next/link";
import { ViewGridIcon, UserGroupIcon } from "@heroicons/react/solid";

const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 min-h-screen bg-white border-r border-gray-200">
      <div className="overflow-y-auto py-4 px-3">
        <ul className="space-y-2">
          <li>
            <Link href="/dashboard" legacyBehavior>
              <a className="flex items-center p-2 text-base font-normal text-gray-800 rounded-lg hover:bg-gray-100">
                <ViewGridIcon className="w-6 h-6 text-gray-600" />
                <span className="ml-3">Dashboard</span>
              </a>
            </Link>
          </li>
          <li>
            <Link href="/users" legacyBehavior>
              <a className="flex items-center p-2 text-base font-normal text-gray-800 rounded-lg hover:bg-gray-100">
                <UserGroupIcon className="w-6 h-6 text-gray-600" />
                <span className="ml-3">Users</span>
              </a>
            </Link>
          </li>
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
