import TrendDashboard from "@/components/dashborad/TrendDashboard";

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <h1 className="text-3xl font-bold">Dashboard</h1>
        </div>
      </div>
      <TrendDashboard />
    </div>
  );
};

export default Dashboard;
