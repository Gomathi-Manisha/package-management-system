import Link from "next/link";

const ReportsPage = () => {
  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-3xl font-bold mb-6">Reports</h1>
      <div className="flex flex-col space-y-4">
        <Link
          href="/dashboard/reports/all"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Generate Full Report
        </Link>
        <Link
          href="/dashboard/reports/summary"
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          View Summary Statistics
        </Link>
      </div>
    </div>
  );
};

export default ReportsPage;
