import TrendsOverviewDashboard from "@/components/dashborad/TrendsOverviewDashboard";

const DashboardPage: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <h1 className="text-3xl font-bold">Dashboard</h1>
        </div>
      </div>
      <TrendsOverviewDashboard />
    </div>
  );
};

export default DashboardPage;
