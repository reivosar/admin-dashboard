import Link from "next/link";
import {
  HomeIcon,
  InformationCircleIcon,
  BellIcon,
} from "@heroicons/react/solid";

const NavigationHeader: React.FC = () => {
  return (
    <div className="flex items-center justify-end space-x-4 p-4">
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
      <div className="w-10 h-10 rounded-full bg-gray-400 flex items-center justify-center">
        <span className="text-sm text-white">P</span>
      </div>
    </div>
  );
};

export default NavigationHeader;
