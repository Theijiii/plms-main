import React, { useEffect, useState, useRef } from "react";
import { Bar, Pie, Line, Doughnut } from "react-chartjs-2";
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
  Filler
} from "chart.js";
import {
  FileText,
  TrendingUp,
  Clock,
  CheckCircle,
  Building,
  Briefcase,
  Users,
  Home,
  User
} from "lucide-react";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, LineElement, PointElement, Title, Tooltip, Legend, Filler);

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
    <div className="min-h-screen p-4 md:p-6 bg-[#FBFBFB] font-poppins">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#4D4A4A] font-montserrat">
              Admin Dashboard
            </h1>
            <p className="text-[#4D4A4A] text-opacity-70 mt-2">
              Overview of all permit types and system-wide analytics
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-[#E9E7E7] mb-6 bg-white rounded-lg p-1">
        <button
          className={`py-2 px-6 font-medium font-montserrat rounded-lg transition-all ${activeTab === "dashboard" ? "bg-[#4CAF50] text-white" : "text-[#4D4A4A] hover:bg-[#FBFBFB]"}`}
          onClick={() => setActiveTab("dashboard")}
        >
          Dashboard
        </button>
        <button
          className={`py-2 px-6 font-medium font-montserrat rounded-lg transition-all ${activeTab === "analytics" ? "bg-[#4CAF50] text-white" : "text-[#4D4A4A] hover:bg-[#FBFBFB]"}`}
          onClick={() => setActiveTab("analytics")}
        >
          Analytics
        </button>
        <button
          className={`py-2 px-6 font-medium font-montserrat rounded-lg transition-all ${activeTab === "reports" ? "bg-[#4CAF50] text-white" : "text-[#4D4A4A] hover:bg-[#FBFBFB]"}`}
          onClick={() => setActiveTab("reports")}
        >
          Reports
        </button>
      </div>

      {activeTab === "dashboard" && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[
              { title: "Total Permits", value: total, icon: FileText, color: "#4CAF50", trend: "+12%", trendUp: true },
              { title: "Approved", value: approved, icon: CheckCircle, color: "#4CAF50", trend: "+8%", trendUp: true },
              { title: "Pending", value: pending, icon: Clock, color: "#FDA811", trend: "+5%", trendUp: true },
              { title: "Rejected", value: rejected, icon: TrendingUp, color: "#E53935", trend: "-2%", trendUp: false }
            ].map((stat, idx) => (
              <div key={idx} className="bg-white rounded-lg p-5 shadow-sm border border-[#E9E7E7] transition-all hover:shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[#4D4A4A] text-opacity-70">{stat.title}</p>
                    <p className="text-2xl font-bold text-[#4D4A4A] mt-2 font-montserrat">{stat.value}</p>
                    <div className="mt-2">
                      <span className={`text-sm ${stat.trendUp ? 'text-[#4CAF50]' : 'text-[#E53935]'}`}>
                        {stat.trend}
                      </span>
                      <span className="text-xs text-[#4D4A4A] text-opacity-60 ml-1">vs last month</span>
                    </div>
                  </div>
                  <div className="p-3 rounded-lg" style={{ backgroundColor: stat.color }}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Bar Chart */}
            <div className="lg:col-span-2 bg-white rounded-lg p-5 shadow-sm border border-[#E9E7E7]">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-[#4D4A4A] font-montserrat">Applications by Permit Type</h3>
                <p className="text-sm text-[#4D4A4A] text-opacity-70">Distribution across all permit categories</p>
              </div>
              <div className="h-[300px]">
                <Bar
                  data={{
                    labels: ["Business", "Franchise", "Building", "Barangay"],
                    datasets: [
                      {
                        label: "Applications",
                        data: [120, 90, 70, 110],
                        backgroundColor: ["#4CAF50", "#4A90E2", "#FDA811", "#9C27B0"],
                        borderRadius: 8,
                        borderWidth: 0,
                      },
                    ],
                  }}
                  options={{
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { display: false },
                    },
                    scales: {
                      x: { 
                        ticks: { color: "#4D4A4A", font: { family: 'Poppins' } }, 
                        grid: { color: "rgba(233, 231, 231, 0.5)" } 
                      },
                      y: { 
                        ticks: { color: "#4D4A4A", font: { family: 'Poppins' } }, 
                        grid: { color: "rgba(233, 231, 231, 0.5)" }, 
                        beginAtZero: true 
                      },
                    },
                  }}
                />
              </div>
            </div>

            {/* Doughnut Chart */}
            <div className="bg-white rounded-lg p-5 shadow-sm border border-[#E9E7E7]">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-[#4D4A4A] font-montserrat">Status Distribution</h3>
                <p className="text-sm text-[#4D4A4A] text-opacity-70">Overall approval status</p>
              </div>
              <div className="h-[250px] flex items-center justify-center">
                <Doughnut
                  data={{
                    labels: ["Approved", "Pending", "Rejected"],
                    datasets: [
                      {
                        data: [approved, pending, rejected],
                        backgroundColor: ["#4CAF50", "#FDA811", "#E53935"],
                        hoverBackgroundColor: ["#45a049", "#fc9d0b", "#d32f2f"],
                        borderColor: "#ffffff",
                        borderWidth: 3,
                      },
                    ],
                  }}
                  options={{
                    maintainAspectRatio: false,
                    cutout: '65%',
                    plugins: {
                      legend: {
                        position: "bottom",
                        labels: { 
                          color: "#4D4A4A", 
                          font: { family: 'Poppins' },
                          padding: 15,
                          usePointStyle: true
                        },
                      },
                    },
                  }}
                />
              </div>
            </div>
          </div>

          {/* Recent Applications - Visual Cards */}
          <div className="bg-white rounded-lg shadow-sm border border-[#E9E7E7] p-5">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-[#4D4A4A] font-montserrat">Recent Permit Applications</h3>
              <p className="text-sm text-[#4D4A4A] text-opacity-70">Latest applications across all permit types</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {permitApplications.map((app) => {
                const getPermitIcon = (type) => {
                  switch(type) {
                    case "Business": return Briefcase;
                    case "Franchise": return Users;
                    case "Building": return Building;
                    case "Barangay": return Home;
                    default: return FileText;
                  }
                };
                
                const getPermitColor = (type) => {
                  switch(type) {
                    case "Business": return "#4CAF50";
                    case "Franchise": return "#4A90E2";
                    case "Building": return "#FDA811";
                    case "Barangay": return "#9C27B0";
                    default: return "#4D4A4A";
                  }
                };
                
                const PermitIcon = getPermitIcon(app.type);
                const permitColor = getPermitColor(app.type);
                
                return (
                  <div 
                    key={app.id} 
                    className="border border-[#E9E7E7] rounded-lg p-4 hover:shadow-md transition-all cursor-pointer"
                    style={{ borderLeftWidth: '4px', borderLeftColor: permitColor }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 rounded-lg" style={{ backgroundColor: `${permitColor}15` }}>
                          <PermitIcon className="w-5 h-5" style={{ color: permitColor }} />
                        </div>
                        <div>
                          <p className="text-sm font-mono font-semibold text-[#4D4A4A]">{app.id}</p>
                          <p className="text-xs text-[#4D4A4A] text-opacity-70">{app.type} Permit</p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        app.status === "Approved" ? "bg-[#4CAF50]/10 text-[#4CAF50]" :
                        app.status === "Pending" ? "bg-[#FDA811]/10 text-[#FDA811]" :
                        "bg-[#E53935]/10 text-[#E53935]"
                      }`}>
                        {app.status}
                      </span>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <User className="w-4 h-4 text-[#4D4A4A] text-opacity-50 mr-2" />
                        <p className="text-sm text-[#4D4A4A] font-poppins">{app.applicant}</p>
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 text-[#4D4A4A] text-opacity-50 mr-2" />
                        <p className="text-xs text-[#4D4A4A] text-opacity-70 font-poppins">{app.date}</p>
                      </div>
                      <div className="flex items-center">
                        <FileText className="w-4 h-4 text-[#4D4A4A] text-opacity-50 mr-2" />
                        <p className="text-xs text-[#4D4A4A] text-opacity-70 font-poppins">{app.applicationType}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      {activeTab === "analytics" && (
        <div className="space-y-6">
          {/* Analytics Header with Date Filter */}
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-[#4D4A4A] font-montserrat">Analytics Overview</h2>
            <select 
              className="bg-white border border-[#E9E7E7] rounded-lg px-4 py-2 text-[#4D4A4A] font-poppins focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
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
            <div className="bg-white rounded-lg p-5 shadow-sm border border-[#E9E7E7]">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-[#4D4A4A] font-montserrat">Monthly Application Trends</h3>
                  <p className="text-sm text-[#4D4A4A] text-opacity-70">Applications and approvals over time</p>
                </div>
                <button 
                  onClick={exportChart}
                  className="bg-[#4CAF50] text-white px-3 py-2 rounded-lg text-sm hover:bg-[#45a049] transition-colors font-montserrat"
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
                      legend: { 
                        labels: { 
                          color: "#4D4A4A",
                          font: { family: 'Poppins' }
                        } 
                      },
                    },
                    scales: {
                      x: { 
                        ticks: { 
                          color: "#4D4A4A",
                          font: { family: 'Poppins' }
                        },
                        grid: { color: "rgba(233, 231, 231, 0.5)" }
                      },
                      y: { 
                        ticks: { 
                          color: "#4D4A4A",
                          font: { family: 'Poppins' }
                        }, 
                        grid: { color: "rgba(233, 231, 231, 0.5)" },
                        beginAtZero: true 
                      },
                    },
                  }}
                />
              </div>
            </div>

            {/* Permit Type Distribution */}
            <div className="bg-white rounded-lg p-5 shadow-sm border border-[#E9E7E7]">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-[#4D4A4A] font-montserrat">Permit Type Distribution</h3>
                <p className="text-sm text-[#4D4A4A] text-opacity-70">Breakdown by permit category</p>
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
                        labels: { 
                          color: "#4D4A4A", 
                          font: { family: 'Poppins', size: 12 },
                          padding: 15,
                          usePointStyle: true
                        }
                      },
                    },
                  }}
                />
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="bg-white rounded-lg p-5 shadow-sm border border-[#E9E7E7] lg:col-span-2">
              <h3 className="text-lg font-semibold text-[#4D4A4A] font-montserrat mb-4">Performance Metrics</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-[#4CAF50]/10 p-4 rounded-lg border-l-4 border-[#4CAF50]">
                  <p className="text-[#4D4A4A] text-opacity-70 text-sm font-poppins">Approval Rate</p>
                  <p className="text-2xl font-bold text-[#4CAF50] font-montserrat mt-1">{((approved / total) * 100).toFixed(1)}%</p>
                </div>
                <div className="bg-[#4A90E2]/10 p-4 rounded-lg border-l-4 border-[#4A90E2]">
                  <p className="text-[#4D4A4A] text-opacity-70 text-sm font-poppins">Avg. Processing Time</p>
                  <p className="text-2xl font-bold text-[#4A90E2] font-montserrat mt-1">3.2 days</p>
                </div>
                <div className="bg-[#FDA811]/10 p-4 rounded-lg border-l-4 border-[#FDA811]">
                  <p className="text-[#4D4A4A] text-opacity-70 text-sm font-poppins">Satisfaction Score</p>
                  <p className="text-2xl font-bold text-[#FDA811] font-montserrat mt-1">4.5/5.0</p>
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
            <h2 className="text-xl font-bold text-[#4D4A4A] font-montserrat">Reports & Exports</h2>
            <div className="text-sm text-[#4D4A4A] text-opacity-70 font-poppins">
              Last generated: {new Date().toLocaleDateString()}
            </div>
          </div>

          {/* Report Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Summary Report */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-[#E9E7E7]">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-[#4CAF50]/10 rounded-lg flex items-center justify-center mr-4">
                  <FileText className="w-6 h-6 text-[#4CAF50]" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#4D4A4A] font-montserrat">Summary Report</h3>
                  <p className="text-sm text-[#4D4A4A] text-opacity-70 font-poppins">Overview of all permit applications</p>
                </div>
              </div>
              <div className="flex space-x-2 mt-4">
                <button 
                  onClick={() => downloadReport("pdf")}
                  className="flex-1 bg-[#E53935] hover:bg-[#d32f2f] text-white py-2 px-3 rounded-lg text-sm transition-colors font-montserrat"
                >
                  PDF
                </button>
                <button 
                  onClick={() => downloadReport("csv")}
                  className="flex-1 bg-[#4CAF50] hover:bg-[#45a049] text-white py-2 px-3 rounded-lg text-sm transition-colors font-montserrat"
                >
                  CSV
                </button>
              </div>
            </div>

            {/* Analytics Report */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-[#E9E7E7]">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-[#4A90E2]/10 rounded-lg flex items-center justify-center mr-4">
                  <TrendingUp className="w-6 h-6 text-[#4A90E2]" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#4D4A4A] font-montserrat">Analytics Report</h3>
                  <p className="text-sm text-[#4D4A4A] text-opacity-70 font-poppins">Detailed analytics and trends</p>
                </div>
              </div>
              <div className="flex space-x-2 mt-4">
                <button 
                  onClick={() => downloadReport("pdf")}
                  className="flex-1 bg-[#E53935] hover:bg-[#d32f2f] text-white py-2 px-3 rounded-lg text-sm transition-colors font-montserrat"
                >
                  PDF
                </button>
                <button 
                  onClick={() => downloadReport("xlsx")}
                  className="flex-1 bg-[#4CAF50] hover:bg-[#45a049] text-white py-2 px-3 rounded-lg text-sm transition-colors font-montserrat"
                >
                  Excel
                </button>
              </div>
            </div>

            {/* Custom Report */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-[#E9E7E7]">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-[#FDA811]/10 rounded-lg flex items-center justify-center mr-4">
                  <Building className="w-6 h-6 text-[#FDA811]" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#4D4A4A] font-montserrat">Custom Report</h3>
                  <p className="text-sm text-[#4D4A4A] text-opacity-70 font-poppins">Generate custom reports</p>
                </div>
              </div>
              <div className="space-y-3 mt-4">
                <select className="w-full bg-white border border-[#E9E7E7] rounded-lg px-3 py-2 text-sm text-[#4D4A4A] font-poppins focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent">
                  <option>Select report type</option>
                  <option>Monthly Performance</option>
                  <option>Permit Type Analysis</option>
                  <option>Processing Times</option>
                </select>
                <button 
                  onClick={() => downloadReport("pdf")}
                  className="w-full bg-[#4CAF50] hover:bg-[#45a049] text-white py-2 rounded-lg text-sm transition-colors font-montserrat"
                >
                  Generate Report
                </button>
              </div>
            </div>
          </div>

          {/* Recent Reports Table */}
          <div className="bg-white rounded-lg shadow-sm border border-[#E9E7E7] overflow-hidden">
            <div className="p-5 border-b border-[#E9E7E7]">
              <h3 className="text-lg font-semibold text-[#4D4A4A] font-montserrat">Recently Generated Reports</h3>
              <p className="text-sm text-[#4D4A4A] text-opacity-70 font-poppins">Download or manage your generated reports</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#FBFBFB]">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#4D4A4A] uppercase tracking-wider font-montserrat">Report Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#4D4A4A] uppercase tracking-wider font-montserrat">Generated On</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#4D4A4A] uppercase tracking-wider font-montserrat">Format</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#4D4A4A] uppercase tracking-wider font-montserrat">Size</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#4D4A4A] uppercase tracking-wider font-montserrat">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-[#E9E7E7]">
                  <tr className="hover:bg-[#FBFBFB] transition-colors">
                    <td className="px-6 py-4 text-sm text-[#4D4A4A] font-poppins">Monthly Summary - October 2025</td>
                    <td className="px-6 py-4 text-sm text-[#4D4A4A] font-poppins">Oct 28, 2025</td>
                    <td className="px-6 py-4 text-sm">
                      <span className="px-2 py-1 bg-[#E53935]/10 text-[#E53935] rounded-full text-xs font-medium">PDF</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-[#4D4A4A] font-poppins">2.4 MB</td>
                    <td className="px-6 py-4 text-sm">
                      <button className="text-[#4CAF50] hover:text-[#45a049] text-sm mr-3 font-montserrat">
                        Download
                      </button>
                      <button className="text-[#E53935] hover:text-[#d32f2f] text-sm font-montserrat">
                        Delete
                      </button>
                    </td>
                  </tr>
                  <tr className="hover:bg-[#FBFBFB] transition-colors">
                    <td className="px-6 py-4 text-sm text-[#4D4A4A] font-poppins">Q3 Analytics Report</td>
                    <td className="px-6 py-4 text-sm text-[#4D4A4A] font-poppins">Oct 15, 2025</td>
                    <td className="px-6 py-4 text-sm">
                      <span className="px-2 py-1 bg-[#4CAF50]/10 text-[#4CAF50] rounded-full text-xs font-medium">Excel</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-[#4D4A4A] font-poppins">1.8 MB</td>
                    <td className="px-6 py-4 text-sm">
                      <button className="text-[#4CAF50] hover:text-[#45a049] text-sm mr-3 font-montserrat">
                        Download
                      </button>
                      <button className="text-[#E53935] hover:text-[#d32f2f] text-sm font-montserrat">
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