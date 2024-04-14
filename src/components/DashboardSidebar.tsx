import Link from "next/link";
import {
  ViewGridIcon,
  UserGroupIcon,
  LightningBoltIcon,
  ClipboardListIcon,
  InboxIcon,
  TerminalIcon,
} from "@heroicons/react/solid";

const DashboardSidebar: React.FC = () => {
  return (
    <aside
      className="w-64 min-h-screen bg-white border-r border-gray-200 "
      style={{ paddingTop: "67px" }}
    >
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
          <li>
            <Link href="/actions" legacyBehavior>
              <a className="flex items-center p-2 text-base font-normal text-gray-800 rounded-lg hover:bg-gray-100">
                <LightningBoltIcon className="w-6 h-6 text-gray-600" />
                <span className="ml-3">Actions</span>
              </a>
            </Link>
          </li>
          <li>
            <Link href="/reports" legacyBehavior>
              <a className="flex items-center p-2 text-base font-normal text-gray-800 rounded-lg hover:bg-gray-100">
                <ClipboardListIcon className="w-6 h-6 text-gray-600" />
                <span className="ml-3">Reports</span>
              </a>
            </Link>
          </li>
          <li>
            <Link href="/messages" legacyBehavior>
              <a className="flex items-center p-2 text-base font-normal text-gray-800 rounded-lg hover:bg-gray-100">
                <InboxIcon className="w-6 h-6 text-gray-600" />
                <span className="ml-3">Messages</span>
              </a>
            </Link>
          </li>
          <li>
            <Link href="/debug" legacyBehavior>
              <a className="flex items-center p-2 text-base font-normal text-gray-800 rounded-lg hover:bg-gray-100">
                <TerminalIcon className="w-6 h-6 text-gray-600" />
                <span className="ml-3">Debug</span>
              </a>
            </Link>
          </li>
        </ul>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
