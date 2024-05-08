import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import {
  HomeIcon,
  InformationCircleIcon,
  BellIcon,
  UserCircleIcon,
  CogIcon,
  LogoutIcon,
  UserIcon,
} from "@heroicons/react/solid";
import { showConfirmDialog } from "./utils/ConfirmationDialog";
import { post } from "@/utils/api";

const DashboardNavigation: React.FC = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const iconRef = useRef<HTMLDivElement>(null);

  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const handleLogout = () => {
    showConfirmDialog({
      message: "Are you sure you want to update the user information?",
      onConfirm: async () => {
        await post("/api/logout", {});
        router.push("/login");
      },
    });
  };

  return (
    <div className="flex items-center justify-end space-x-4 p-4 relative">
      {/* Other icons */}
      <Link href="/" legacyBehavior>
        <a className="hover:text-gray-300">
          <HomeIcon className="h-6 w-6 text-white" />
        </a>
      </Link>
      <Link href="/about" legacyBehavior>
        <a className="hover:text-gray-300">
          <InformationCircleIcon className="h-6 w-6 text-white" />
        </a>
      </Link>
      <a className="hover:text-gray-300 cursor-pointer">
        <BellIcon className="h-6 w-6 text-white" />
      </a>
      {/* Profile Icon */}
      <div
        ref={iconRef}
        className="w-10 h-10 rounded-full bg-gray-400 flex items-center justify-center cursor-pointer"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        <UserCircleIcon className="h-6 w-6 text-white" />
      </div>
      {/* Dropdown */}
      {showDropdown && (
        <div
          ref={dropdownRef}
          className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-20"
          style={{ top: "4rem" }}
        >
          <Link href="/my/profile" legacyBehavior>
            <a className="flex items-center space-x-3 px-4 py-3 text-base text-gray-700 hover:bg-gray-100">
              <UserIcon className="h-6 w-6 text-gray-600" />
              <span>Profile</span>
            </a>
          </Link>
          <Link href="/my/settings" legacyBehavior>
            <a className="flex items-center space-x-3 px-4 py-3 text-base text-gray-700 hover:bg-gray-100">
              <CogIcon className="h-6 w-6 text-gray-600" />
              <span>Settings</span>
            </a>
          </Link>
          <a
            href="#"
            className="flex items-center space-x-3 px-4 py-3 text-base text-gray-700 hover:bg-gray-100"
            onClick={handleLogout}
          >
            <LogoutIcon className="h-6 w-6 text-gray-600" /> <span>Logout</span>
          </a>
        </div>
      )}
    </div>
  );
};

export default DashboardNavigation;
