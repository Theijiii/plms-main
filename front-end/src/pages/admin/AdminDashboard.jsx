import React, { useEffect, useState, useRef } from "react";
import { Bar, Pie, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, LineElement, PointElement, Title, Tooltip, Legend);

export default function AdminDashboard() {
  const [isDark, setIsDark] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [dateRange, setDateRange] = useState("last30days");
  const chartRef = useRef();

  // Detect dark mode globally
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, { attributes: true });
    setIsDark(document.documentElement.classList.contains("dark"));
    return () => observer.disconnect();
  }, []);

  // Table data
  const permitApplications = [
    { id: "B-1001", applicant: "Juan Dela Cruz", type: "Building", date: "2025-10-10", applicationType: "New", status: "Approved" },
    { id: "B-1002", applicant: "Maria Santos", type: "Business", date: "2025-10-12", applicationType: "Renewal", status: "Pending" },
    { id: "B-1003", applicant: "Pedro Reyes", type: "Franchise", date: "2025-10-13", applicationType: "New", status: "Rejected" },
    { id: "B-1004", applicant: "Ana Lopez", type: "Barangay", date: "2025-10-14", applicationType: "Renewal", status: "Approved" },
    { id: "B-1005", applicant: "Liza Cruz", type: "Business", date: "2025-10-15", applicationType: "Liquor Permit", status: "Approved" },
    { id: "B-1006", applicant: "Mark Lim", type: "Business", date: "2025-10-16", applicationType: "Amendment", status: "Pending" },
    { id: "B-1007", applicant: "Rico Tan", type: "Barangay", date: "2025-10-17", applicationType: "New", status: "Approved" },
    { id: "B-1008", applicant: "Ella Fajardo", type: "Franchise", date: "2025-10-18", applicationType: "Renewal", status: "Pending" },
    { id: "B-1009", applicant: "Sam Lee", type: "Building", date: "2025-10-19", applicationType: "Electrical", status: "Approved" },
    { id: "B-1010", applicant: "Mia Gomez", type: "Building", date: "2025-10-20", applicationType: "Mechanical", status: "Pending" },
  ];

  // Stats
  const total = permitApplications.length;
  const approved = permitApplications.filter(t => t.status === "Approved").length;
  const rejected = permitApplications.filter(t => t.status === "Rejected").length;
  const pending = permitApplications.filter(t => t.status === "Pending").length;

  // Analytics data
  const monthlyData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    applications: [45, 52, 48, 60, 55, 70, 65, 75, 80, 78, 82, 85],
    approvals: [40, 45, 42, 52, 48, 60, 58, 65, 70, 68, 72, 75],
    rejections: [5, 7, 6, 8, 7, 10, 7, 10, 10, 10, 10, 10],
  };

  const permitTypeDistribution = {
    Business: 45,
    Building: 30,
    Franchise: 15,
    Barangay: 10,
  };

  // Function to download reports
  const downloadReport = (format) => {
    // In a real application, this would generate an actual file
    // For this example, we'll simulate a download
    const blob = new Blob([`Permit Applications Report - ${new Date().toLocaleDateString()}`], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `permit-report-${new Date().getTime()}.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    alert(`${format.toUpperCase()} report download started!`);
  };

  const exportChart = () => {
    if (chartRef.current) {
      const chartCanvas = chartRef.current.canvas;
      const url = chartCanvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = url;
      a.download = "analytics-chart.png";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  return (
    <div className="min-h-screen p-8 bg-white dark:bg-slate-900 text-black dark:text-white transition-colors duration-300 font-sans">
      {/* Header Card */}
      <div className="relative shadow-lg rounded-2xl border border-gray-200 dark:border-gray-700 flex flex-col md:flex-row items-center justify-between mb-8 overflow-hidden min-h-[250px] p-12 bg-white dark:bg-slate-800 transition-colors duration-300">
        <div className="absolute inset-0 bg-[url('/bgaddash.jpg')] bg-cover bg-center opacity-30"></div>
        <div className="relative">
          <h2 className="text-3xl font-extrabold text-[#4CAF50] tracking-wide font-[Montserrat]">
            Permit & Licensing Management System
          </h2>
          <p className="mt-2 text-sm md:text-base max-w-2xl text-gray-600 dark:text-gray-300">
            Welcome Back <span className="font-semibold">Admin!,</span> Here's a quick look at today's stats and recent activities.
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
        <button
          className={`py-2 px-4 font-medium ${activeTab === "dashboard" ? "border-b-2 border-[#4CAF50] text-[#4CAF50]" : "text-gray-500 dark:text-gray-400"}`}
          onClick={() => setActiveTab("dashboard")}
        >
          Dashboard
        </button>
        <button
          className={`py-2 px-4 font-medium ${activeTab === "analytics" ? "border-b-2 border-[#4CAF50] text-[#4CAF50]" : "text-gray-500 dark:text-gray-400"}`}
          onClick={() => setActiveTab("analytics")}
        >
          Analytics
        </button>
        <button
          className={`py-2 px-4 font-medium ${activeTab === "reports" ? "border-b-2 border-[#4CAF50] text-[#4CAF50]" : "text-gray-500 dark:text-gray-400"}`}
          onClick={() => setActiveTab("reports")}
        >
          Reports
        </button>
      </div>

      {activeTab === "dashboard" && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-blue-100 dark:bg-blue-900 p-5 rounded-lg shadow transition-colors duration-300">
              <p className="text-blue-800 dark:text-blue-300 text-sm font-medium">Total Permits</p>
              <p className="text-blue-900 dark:text-blue-100 text-2xl font-bold">{total}</p>
            </div>
            <div className="bg-green-100 dark:bg-green-900 p-5 rounded-lg shadow transition-colors duration-300">
              <p className="text-green-800 dark:text-green-300 text-sm font-medium">Approved</p>
              <p className="text-green-900 dark:text-green-100 text-2xl font-bold">{approved}</p>
            </div>
            <div className="bg-red-100 dark:bg-red-900 p-5 rounded-lg shadow transition-colors duration-300">
              <p className="text-red-800 dark:text-red-300 text-sm font-medium">Rejected</p>
              <p className="text-red-900 dark:text-red-100 text-2xl font-bold">{rejected}</p>
            </div>
            <div className="bg-yellow-100 dark:bg-yellow-900 p-5 rounded-lg shadow transition-colors duration-300">
              <p className="text-yellow-800 dark:text-yellow-300 text-sm font-medium">Pending</p>
              <p className="text-yellow-900 dark:text-yellow-100 text-2xl font-bold">{pending}</p>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* Bar Chart */}
            <div className="rounded-xl shadow p-6 flex-1 col-span-2 bg-white dark:bg-slate-800 transition-colors duration-300 min-h-[420px]">
              <div className="flex justify-between items-center mb-4">
                <span className="font-semibold text-black dark:text-white text-lg">Active Applications</span>
                <button className="text-gray-400 dark:text-gray-300 hover:text-orange-500 text-xl">⋮</button>
              </div>
              <div className="h-[300px]">
                <Bar
                  data={{
                    labels: ["Business", "Franchise", "Building", "Barangay"],
                    datasets: [
                      {
                        label: "Applications",
                        data: [120, 90, 70, 110],
                        backgroundColor: ["#FFF7A3", "#B5F5B5", "#FFB5B5", "#B5D8FF"],
                        borderRadius: 8,
                        borderWidth: 1,
                        borderColor: "#ccc",
                      },
                    ],
                  }}
                  options={{
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { labels: { color: isDark ? "#fff" : "#000", font: { weight: "bold" } } },
                    },
                    scales: {
                      x: { ticks: { color: isDark ? "#fff" : "#000" }, grid: { color: "rgba(0,0,0,0.05)" } },
                      y: { ticks: { color: isDark ? "#fff" : "#000" }, grid: { color: "rgba(0,0,0,0.05)" }, beginAtZero: true },
                    },
                  }}
                />
              </div>
            </div>

            {/* Pie Chart */}
            <div className="rounded-xl shadow p-6 flex flex-col items-center justify-center bg-white dark:bg-slate-800 transition-colors duration-300 min-h-[420px]">
              <span className="font-semibold mb-6 text-black dark:text-white text-lg">Applications Status</span>
              <div className="h-[260px] w-[260px]">
                <Pie
                  data={{
                    labels: ["Approved", "Pending", "Rejected"],
                    datasets: [
                      {
                        data: [approved, pending, rejected],
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
                        labels: { color: isDark ? "#fff" : "#000", font: { weight: "500" } },
                      },
                    },
                    maintainAspectRatio: false,
                  }}
                />
              </div>
              <span className="text-sm mt-6 text-gray-700 dark:text-gray-300">
                {approved} approved / {total} total applications
              </span>
            </div>
          </div>

          {/* Table */}
          <div className="rounded-xl shadow p-6 bg-white dark:bg-slate-800 transition-colors duration-300">
            <div className="flex justify-between items-center mb-4">
              <span className="font-semibold text-lg text-black dark:text-white">All Permit Applications</span>
              <button className="text-gray-400 dark:text-gray-300 hover:text-orange-500 text-xl">⋮</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full shadow rounded-lg transition-colors duration-300">
                <thead className="bg-gray-50 dark:bg-slate-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ID No.</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Applicant Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Permit Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Application Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {permitApplications.map((t) => (
                    <tr key={t.id} className="hover:bg-gray-50 dark:hover:bg-slate-700">
                      <td className="px-6 py-4 text-sm">{t.id}</td>
                      <td className="px-6 py-4 text-sm">{t.applicant}</td>
                      <td className="px-6 py-4 text-sm">{t.type}</td>
                      <td className="px-6 py-4 text-sm">{t.date}</td>
                      <td className="px-6 py-4 text-sm">{t.applicationType}</td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            t.status === "Approved"
                              ? "bg-green-100 dark:bg-green-700 text-green-700 dark:text-green-100"
                              : t.status === "Pending"
                              ? "bg-yellow-100 dark:bg-yellow-700 text-yellow-700 dark:text-yellow-100"
                              : "bg-red-100 dark:bg-red-700 text-red-700 dark:text-red-100"
                          }`}
                        >
                          {t.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {activeTab === "analytics" && (
        <div className="space-y-6">
          {/* Analytics Header with Date Filter */}
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Analytics Overview</h2>
            <select 
              className="bg-white dark:bg-slate-800 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
            >
              <option value="last7days">Last 7 Days</option>
              <option value="last30days">Last 30 Days</option>
              <option value="last90days">Last 90 Days</option>
              <option value="thisYear">This Year</option>
            </select>
          </div>

          {/* Analytics Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Monthly Trends Chart */}
            <div className="rounded-xl shadow p-6 bg-white dark:bg-slate-800 transition-colors duration-300">
              <div className="flex justify-between items-center mb-4">
                <span className="font-semibold text-lg">Monthly Application Trends</span>
                <button 
                  onClick={exportChart}
                  className="bg-[#4CAF50] text-white px-3 py-1 rounded-lg text-sm hover:bg-[#45a049] transition-colors"
                >
                  Export
                </button>
              </div>
              <div className="h-80">
                <Line
                  ref={chartRef}
                  data={{
                    labels: monthlyData.labels,
                    datasets: [
                      {
                        label: "Applications",
                        data: monthlyData.applications,
                        borderColor: "#4CAF50",
                        backgroundColor: "rgba(76, 175, 80, 0.1)",
                        tension: 0.4,
                        fill: true,
                      },
                      {
                        label: "Approvals",
                        data: monthlyData.approvals,
                        borderColor: "#2196F3",
                        backgroundColor: "rgba(33, 150, 243, 0.1)",
                        tension: 0.4,
                        fill: true,
                      },
                    ],
                  }}
                  options={{
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { labels: { color: isDark ? "#fff" : "#000" } },
                    },
                    scales: {
                      x: { ticks: { color: isDark ? "#fff" : "#000" } },
                      y: { ticks: { color: isDark ? "#fff" : "#000" }, beginAtZero: true },
                    },
                  }}
                />
              </div>
            </div>

            {/* Permit Type Distribution */}
            <div className="rounded-xl shadow p-6 bg-white dark:bg-slate-800 transition-colors duration-300">
              <div className="flex justify-between items-center mb-4">
                <span className="font-semibold text-lg">Permit Type Distribution</span>
              </div>
              <div className="h-80">
                <Pie
                  data={{
                    labels: Object.keys(permitTypeDistribution),
                    datasets: [
                      {
                        data: Object.values(permitTypeDistribution),
                        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
                        borderWidth: 2,
                        borderColor: isDark ? "#1e293b" : "#fff",
                      },
                    ],
                  }}
                  options={{
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { 
                        position: "bottom",
                        labels: { color: isDark ? "#fff" : "#000", font: { size: 12 } }
                      },
                    },
                  }}
                />
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="rounded-xl shadow p-6 bg-white dark:bg-slate-800 transition-colors duration-300 lg:col-span-2">
              <h3 className="font-semibold text-lg mb-4">Performance Metrics</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <p className="text-blue-800 dark:text-blue-300 text-sm">Approval Rate</p>
                  <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{((approved / total) * 100).toFixed(1)}%</p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                  <p className="text-green-800 dark:text-green-300 text-sm">Avg. Processing Time</p>
                  <p className="text-2xl font-bold text-green-900 dark:text-green-100">3.2 days</p>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                  <p className="text-purple-800 dark:text-purple-300 text-sm">Satisfaction Score</p>
                  <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">4.5/5.0</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "reports" && (
        <div className="space-y-6">
          {/* Reports Header */}
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Reports & Exports</h2>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Last generated: {new Date().toLocaleDateString()}
            </div>
          </div>

          {/* Report Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Summary Report */}
            <div className="rounded-xl shadow p-6 bg-white dark:bg-slate-800 transition-colors duration-300">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-blue-600 dark:text-blue-300 text-xl">📊</span>
                </div>
                <div>
                  <h3 className="font-semibold">Summary Report</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Overview of all permit applications</p>
                </div>
              </div>
              <div className="flex space-x-2 mt-4">
                <button 
                  onClick={() => downloadReport("pdf")}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-3 rounded-lg text-sm transition-colors"
                >
                  PDF
                </button>
                <button 
                  onClick={() => downloadReport("csv")}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-3 rounded-lg text-sm transition-colors"
                >
                  CSV
                </button>
              </div>
            </div>

            {/* Analytics Report */}
            <div className="rounded-xl shadow p-6 bg-white dark:bg-slate-800 transition-colors duration-300">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-green-600 dark:text-green-300 text-xl">📈</span>
                </div>
                <div>
                  <h3 className="font-semibold">Analytics Report</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Detailed analytics and trends</p>
                </div>
              </div>
              <div className="flex space-x-2 mt-4">
                <button 
                  onClick={() => downloadReport("pdf")}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-3 rounded-lg text-sm transition-colors"
                >
                  PDF
                </button>
                <button 
                  onClick={() => downloadReport("xlsx")}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-3 rounded-lg text-sm transition-colors"
                >
                  Excel
                </button>
              </div>
            </div>

            {/* Custom Report */}
            <div className="rounded-xl shadow p-6 bg-white dark:bg-slate-800 transition-colors duration-300">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-purple-600 dark:text-purple-300 text-xl">🎛️</span>
                </div>
                <div>
                  <h3 className="font-semibold">Custom Report</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Generate custom reports</p>
                </div>
              </div>
              <div className="space-y-3 mt-4">
                <select className="w-full bg-gray-50 dark:bg-slate-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm">
                  <option>Select report type</option>
                  <option>Monthly Performance</option>
                  <option>Permit Type Analysis</option>
                  <option>Processing Times</option>
                </select>
                <button 
                  onClick={() => downloadReport("pdf")}
                  className="w-full bg-[#4CAF50] hover:bg-[#45a049] text-white py-2 rounded-lg text-sm transition-colors"
                >
                  Generate Report
                </button>
              </div>
            </div>
          </div>

          {/* Recent Reports Table */}
          <div className="rounded-xl shadow p-6 bg-white dark:bg-slate-800 transition-colors duration-300">
            <h3 className="font-semibold text-lg mb-4">Recently Generated Reports</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-slate-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Report Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Generated On</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Format</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Size</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  <tr>
                    <td className="px-6 py-4 text-sm">Monthly Summary - October 2025</td>
                    <td className="px-6 py-4 text-sm">Oct 28, 2025</td>
                    <td className="px-6 py-4 text-sm">PDF</td>
                    <td className="px-6 py-4 text-sm">2.4 MB</td>
                    <td className="px-6 py-4 text-sm">
                      <button className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm mr-3">
                        Download
                      </button>
                      <button className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 text-sm">
                        Delete
                      </button>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm">Q3 Analytics Report</td>
                    <td className="px-6 py-4 text-sm">Oct 15, 2025</td>
                    <td className="px-6 py-4 text-sm">Excel</td>
                    <td className="px-6 py-4 text-sm">1.8 MB</td>
                    <td className="px-6 py-4 text-sm">
                      <button className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm mr-3">
                        Download
                      </button>
                      <button className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 text-sm">
                        Delete
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}