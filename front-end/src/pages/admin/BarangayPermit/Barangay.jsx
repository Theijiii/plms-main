import { useEffect, useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

export default function BarangayPermit() {
  const [permits, setPermits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Detect dark mode globally
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, { attributes: true });
    setIsDark(document.documentElement.classList.contains("dark"));

    const fetchData = async () => {
      try {
        const res = await fetch("http://e-plms.goserveph.com/front-end/src/pages/admin/BarangayPermit/barangayAdminMock.php");
        if (!res.ok) throw new Error("Network response was not ok");
        const data = await res.json();
        setPermits(data || []);
        setLoading(false);
      } catch (err) {
        console.error("Fetch error:", err);
        // Fallback to mock data if API fails
        try {
          const mockRes = await fetch('/src/lib/mock/barangayAdmin.mock.json');
          const mockData = await mockRes.json();
          setPermits(mockData || []);
        } catch (mockErr) {
          setError("Failed to load barangay permits.");
        }
        setLoading(false);
      }
    };

    fetchData();
    return () => observer.disconnect();
  }, []);

  // Stats calculations
  const stats = {
    total: permits.length,
    approved: permits.filter((p) => (p.status || "").toLowerCase() === "approved").length,
    rejected: permits.filter((p) => (p.status || "").toLowerCase() === "rejected").length,
    pending: permits.filter((p) => (p.status || "").toLowerCase() === "pending").length,
  };

  // Count by permit type for charts
  const permitTypes = Array.from(new Set(permits.map(p => p.permit_type || "Barangay Permit"))).slice(0, 6);
  const permitTypeCounts = permitTypes.map(type => 
    permits.filter(p => p.permit_type === type).length
  );

  // Get status color
  const getStatusColor = (status) => {
    const statusLower = (status || "").toLowerCase();
    switch (statusLower) {
      case "approved":
        return "bg-green-100 dark:bg-green-700 text-green-700 dark:text-green-100";
      case "rejected":
        return "bg-red-100 dark:bg-red-700 text-red-700 dark:text-red-100";
      case "pending":
        return "bg-yellow-100 dark:bg-yellow-700 text-yellow-700 dark:text-yellow-100";
      default:
        return "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-100";
    }
  };

  return (
    <div className="min-h-screen p-8 bg-white dark:bg-slate-900 text-black dark:text-white transition-colors duration-300 font-sans">
      {/* Header Card */}
      <div className="relative shadow-lg rounded-2xl border border-gray-200 dark:border-gray-700 flex flex-col md:flex-row items-center justify-between mb-8 overflow-hidden min-h-[250px] p-12 bg-white dark:bg-slate-800 transition-colors duration-300">
        <div className="absolute inset-0 bg-[url('/bgaddash.jpg')] bg-cover bg-center opacity-30"></div>
        <div className="relative w-full">
          <div>
            <h2 className="text-3xl font-extrabold text-[#4CAF50] tracking-wide font-[Montserrat]">
              Barangay Permit Management System
            </h2>
            <p className="mt-2 text-sm md:text-base max-w-2xl text-gray-600 dark:text-gray-300">
              Welcome Back <span className="font-semibold">Admin!,</span> Manage and monitor barangay permit applications and approvals.
            </p>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-blue-100 dark:bg-blue-900 p-5 rounded-lg shadow transition-colors duration-300 hover:scale-105 transform transition-transform">
          <p className="text-blue-800 dark:text-blue-300 text-sm font-medium">Total Permits</p>
          <p className="text-blue-900 dark:text-blue-100 text-2xl font-bold">
            {stats.total}
          </p>
        </div>
        <div className="bg-green-100 dark:bg-green-900 p-5 rounded-lg shadow transition-colors duration-300 hover:scale-105 transform transition-transform">
          <p className="text-green-800 dark:text-green-300 text-sm font-medium">Approved</p>
          <p className="text-green-900 dark:text-green-100 text-2xl font-bold">
            {stats.approved}
          </p>
        </div>
        <div className="bg-yellow-100 dark:bg-yellow-900 p-5 rounded-lg shadow transition-colors duration-300 hover:scale-105 transform transition-transform">
          <p className="text-yellow-800 dark:text-yellow-300 text-sm font-medium">Pending</p>
          <p className="text-yellow-900 dark:text-yellow-100 text-2xl font-bold">
            {stats.pending}
          </p>
        </div>
        <div className="bg-red-100 dark:bg-red-900 p-5 rounded-lg shadow transition-colors duration-300 hover:scale-105 transform transition-transform">
          <p className="text-red-800 dark:text-red-300 text-sm font-medium">Rejected</p>
          <p className="text-red-900 dark:text-red-100 text-2xl font-bold">
            {stats.rejected}
          </p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Bar Chart */}
        <div className="rounded-xl shadow p-6 flex-1 col-span-2 bg-white dark:bg-slate-800 transition-colors duration-300 min-h-[420px]">
          <div className="flex justify-between items-center mb-4">
            <span className="font-semibold text-black dark:text-white text-lg">Permits by Type</span>
            <button className="text-gray-400 dark:text-gray-300 hover:text-orange-500 text-xl">⋮</button>
          </div>
          <div className="h-[300px]">
            <Bar
              data={{
                labels: permitTypes,
                datasets: [
                  {
                    label: "Number of Permits",
                    data: permitTypeCounts,
                    backgroundColor: ["#FFF7A3", "#B5F5B5", "#FFB5B5", "#B5D8FF", "#D9B5FF", "#FFB5E8"],
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: "#ccc",
                  },
                ],
              }}
              options={{
                maintainAspectRatio: false,
                plugins: {
                  legend: { 
                    labels: { 
                      color: isDark ? "#fff" : "#000", 
                      font: { weight: "bold" } 
                    } 
                  },
                },
                scales: {
                  x: { 
                    ticks: { color: isDark ? "#fff" : "#000" }, 
                    grid: { color: "rgba(0,0,0,0.05)" } 
                  },
                  y: { 
                    ticks: { color: isDark ? "#fff" : "#000" }, 
                    grid: { color: "rgba(0,0,0,0.05)" }, 
                    beginAtZero: true 
                  },
                },
              }}
            />
          </div>
        </div>

        {/* Pie Chart */}
        <div className="rounded-xl shadow p-6 flex flex-col items-center justify-center bg-white dark:bg-slate-800 transition-colors duration-300 min-h-[420px]">
          <span className="font-semibold mb-6 text-black dark:text-white text-lg">Application Status</span>
          <div className="h-[260px] w-[260px]">
            <Pie
              data={{
                labels: ["Approved", "Pending", "Rejected"],
                datasets: [
                  {
                    data: [stats.approved, stats.pending, stats.rejected],
                    backgroundColor: ["#B5F5B5", "#FFF7A3", "#FFB5B5"],
                    borderColor: "#fff",
                    borderWidth: 2,
                  },
                ],
              }}
              options={{
                plugins: {
                  legend: {
                    position: "bottom",
                    labels: { 
                      color: isDark ? "#fff" : "#000", 
                      font: { weight: "500" } 
                    },
                  },
                },
                maintainAspectRatio: false,
              }}
            />
          </div>
          <span className="text-sm mt-6 text-gray-700 dark:text-gray-300">
            {stats.approved} approved / {stats.total} total applications
          </span>
        </div>
      </div>

      {/* Loading/Error States */}
      {loading && (
        <div className="rounded-xl shadow p-6 bg-white dark:bg-slate-800 transition-colors duration-300">
          <p className="text-gray-500 dark:text-gray-400 text-center">Loading permits...</p>
        </div>
      )}
      {error && (
        <div className="rounded-xl shadow p-6 bg-white dark:bg-slate-800 transition-colors duration-300">
          <div className="text-red-600 dark:text-red-400 font-semibold text-center">
            {error}
          </div>
        </div>
      )}

      {/* Table Section */}
      {!loading && permits.length > 0 && (
        <div className="rounded-xl shadow p-6 bg-white dark:bg-slate-800 transition-colors duration-300">
          <div className="flex justify-between items-center mb-4">
            <span className="font-semibold text-lg text-black dark:text-white">All Permit Applications</span>
            <button className="text-gray-400 dark:text-gray-300 hover:text-orange-500 text-xl">⋮</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full shadow rounded-lg transition-colors duration-300">
              <thead className="bg-gray-50 dark:bg-slate-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Applicant Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Permit Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Barangay
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Purpose
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {permits.map((p, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-50 dark:hover:bg-slate-700"
                  >
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                      {p.applicant?.first_name} {p.applicant?.last_name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                      {p.permit_type || "Barangay Permit"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                      {p.address?.barangay || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                      {p.purpose || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                          p.status
                        )}`}
                      >
                        {p.status || "Unknown"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && permits.length === 0 && !error && (
        <div className="rounded-xl shadow p-6 bg-white dark:bg-slate-800 transition-colors duration-300">
          <p className="text-gray-500 dark:text-gray-400 text-center">No permits available.</p>
        </div>
      )}
    </div>
  );
}