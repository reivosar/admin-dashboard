import Link from "next/link";

const DashboardHeader: React.FC = () => {
  return (
    <div className="text-lg font-semibold p-4">
      <Link href="/" legacyBehavior>
        <a className="text-white">Admin Dashboard</a>
      </Link>
    </div>
  );
};

export default DashboardHeader;
