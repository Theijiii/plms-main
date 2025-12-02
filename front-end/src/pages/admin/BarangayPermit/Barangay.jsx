import { useEffect, useState, useMemo, useCallback } from "react";
import {
  Bar,
  Pie,
  Line,
  Doughnut
} from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from "chart.js";
import {
  Search,
  Download,
  Calendar,
  TrendingUp,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  MoreVertical,
  RefreshCw,
  Eye,
  Printer,
  DownloadCloud,
  TrendingDown,
  Activity,
  Building,
  Car,
  Briefcase,
  Home,
  Users,
  Wrench,
  Utensils,
  ShoppingBag,
  Construction
} from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Permit purposes with icons and colors
const PERMIT_PURPOSES = [
  { value: "building", label: "Building Permit", icon: Building, color: "#4CAF50" },
  { value: "transport", label: "Transport & Franchise", icon: Car, color: "#4A90E2" },
  { value: "business", label: "Business Permit", icon: Briefcase, color: "#FDA811" },
  { value: "residential", label: "Residential", icon: Home, color: "#9C27B0" },
  { value: "community", label: "Community Activity", icon: Users, color: "#2196F3" },
  { value: "repair", label: "Repair & Renovation", icon: Wrench, color: "#FF9800" },
  { value: "food", label: "Food Establishment", icon: Utensils, color: "#F44336" },
  { value: "retail", label: "Retail Business", icon: ShoppingBag, color: "#795548" },
  { value: "construction", label: "Construction", icon: Construction, color: "#607D8B" }
];

export default function BarangayPermitAnalytics() {
  const [permits, setPermits] = useState([]);
  const [filteredPermits, setFilteredPermits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [purposeFilter, setPurposeFilter] = useState("all");
  const [exporting, setExporting] = useState(false);

  // Enhanced stats with trends
  const stats = useMemo(() => {
    const total = permits.length;
    const approved = permits.filter(p => p.status?.toLowerCase() === "approved").length;
    const rejected = permits.filter(p => p.status?.toLowerCase() === "rejected").length;
    const pending = permits.filter(p => p.status?.toLowerCase() === "pending").length;
    const review = permits.filter(p => p.status?.toLowerCase() === "under review").length;

    // Calculate permit purpose statistics
    const purposeStats = PERMIT_PURPOSES.map(purpose => {
      const count = permits.filter(p => p.purpose?.toLowerCase() === purpose.value.toLowerCase()).length;
      const approvedCount = permits.filter(p => 
        p.purpose?.toLowerCase() === purpose.value.toLowerCase() && 
        p.status?.toLowerCase() === "approved"
      ).length;
      const approvalRate = count > 0 ? ((approvedCount / count) * 100).toFixed(1) : 0;
      
      return {
        ...purpose,
        count,
        approvedCount,
        approvalRate
      };
    }).filter(p => p.count > 0)
      .sort((a, b) => b.count - a.count);

    const topPurpose = purposeStats[0] || { label: "N/A", count: 0 };
    
    return {
      total,
      approved,
      rejected,
      pending,
      review,
      purposeStats,
      topPurpose,
      approvalRate: total > 0 ? ((approved / total) * 100).toFixed(1) : 0,
      avgProcessingTime: 2.5, // days (mock data)
      completionRate: total > 0 ? (((approved + rejected) / total) * 100).toFixed(1) : 0
    };
  }, [permits]);

  // Process permit purposes for charts
  const topPurposes = useMemo(() => {
    return stats.purposeStats.slice(0, 6);
  }, [stats.purposeStats]);

  const purposeData = useMemo(() => {
    return {
      labels: topPurposes.map(p => p.label),
      counts: topPurposes.map(p => p.count),
      colors: topPurposes.map(p => p.color)
    };
  }, [topPurposes]);

  // Monthly trends by purpose (mock data)
  const monthlyData = useMemo(() => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
    return {
      labels: months,
      datasets: [
        {
          label: "Building Permits",
          data: [12, 15, 18, 22, 25, 28],
          borderColor: "#4CAF50",
          backgroundColor: "rgba(76, 175, 80, 0.1)",
          fill: true,
          tension: 0.4
        },
        {
          label: "Business Permits",
          data: [8, 10, 12, 15, 18, 22],
          borderColor: "#FDA811",
          backgroundColor: "rgba(253, 168, 17, 0.1)",
          fill: true,
          tension: 0.4
        },
        {
          label: "Transport Permits",
          data: [6, 8, 10, 12, 15, 18],
          borderColor: "#4A90E2",
          backgroundColor: "rgba(74, 144, 226, 0.1)",
          fill: true,
          tension: 0.4
        }
      ]
    };
  }, []);

  // Get status color following your color scheme
  const getStatusColor = useCallback((status) => {
    const statusLower = (status || "").toLowerCase();
    switch (statusLower) {
      case "approved":
        return {
          bg: "bg-[#4CAF50] bg-opacity-20",
          text: "text-[#4CAF50]",
          icon: CheckCircle,
          dot: "bg-[#4CAF50]"
        };
      case "rejected":
        return {
          bg: "bg-[#E53935] bg-opacity-20",
          text: "text-[#E53935]",
          icon: XCircle,
          dot: "bg-[#E53935]"
        };
      case "pending":
        return {
          bg: "bg-[#FDA811] bg-opacity-20",
          text: "text-[#FDA811]",
          icon: Clock,
          dot: "bg-[#FDA811]"
        };
      case "under review":
        return {
          bg: "bg-[#4A90E2] bg-opacity-20",
          text: "text-[#4A90E2]",
          icon: AlertCircle,
          dot: "bg-[#4A90E2]"
        };
      default:
        return {
          bg: "bg-[#E9E7E7]",
          text: "text-[#4D4A4A]",
          icon: AlertCircle,
          dot: "bg-[#4D4A4A]"
        };
    }
  }, []);

  // Get purpose icon
  const getPurposeIcon = useCallback((purpose) => {
    const purposeObj = PERMIT_PURPOSES.find(p => 
      p.value.toLowerCase() === purpose?.toLowerCase() ||
      p.label.toLowerCase() === purpose?.toLowerCase()
    );
    return purposeObj?.icon || FileText;
  }, []);

  // Filter permits based on filters
  useEffect(() => {
    let filtered = [...permits];

    // Date range filter
    if (startDate && endDate) {
      filtered = filtered.filter(p => {
        const permitDate = new Date(p.date || p.created_at);
        return permitDate >= startDate && permitDate <= endDate;
      });
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.applicant?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.applicant?.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.purpose?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.address?.barangay?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(p => p.status?.toLowerCase() === statusFilter);
    }

    // Purpose filter
    if (purposeFilter !== "all") {
      filtered = filtered.filter(p => 
        p.purpose?.toLowerCase() === purposeFilter.toLowerCase()
      );
    }

    setFilteredPermits(filtered);
  }, [permits, startDate, endDate, searchTerm, statusFilter, purposeFilter]);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch("http://e-plms.goserveph.com/front-end/src/pages/admin/BarangayPermit/barangayAdminMock.php");
        if (!res.ok) throw new Error("Network response was not ok");
        const data = await res.json();
        // Map purpose if needed
        const processedData = data.map(permit => ({
          ...permit,
          purpose: permit.purpose || permit.permit_type || "Building Permit"
        }));
        setPermits(processedData || []);
      } catch (err) {
        console.error("Fetch error:", err);
        // Fallback to mock data with purposes
        const mockData = [
          { id: 1, applicant: { first_name: "Juan", last_name: "Dela Cruz", email: "juan@example.com" }, purpose: "building", permit_type: "Construction", status: "approved", address: { barangay: "Barangay 1" }, date: "2024-01-15" },
          { id: 2, applicant: { first_name: "Maria", last_name: "Santos", email: "maria@example.com" }, purpose: "business", permit_type: "Business", status: "pending", address: { barangay: "Barangay 2" }, date: "2024-01-16" },
          { id: 3, applicant: { first_name: "Pedro", last_name: "Reyes", email: "pedro@example.com" }, purpose: "transport", permit_type: "Transport", status: "approved", address: { barangay: "Barangay 3" }, date: "2024-01-17" },
          { id: 4, applicant: { first_name: "Ana", last_name: "Lopez", email: "ana@example.com" }, purpose: "residential", permit_type: "Residential", status: "under review", address: { barangay: "Barangay 1" }, date: "2024-01-18" },
          { id: 5, applicant: { first_name: "Carlos", last_name: "Garcia", email: "carlos@example.com" }, purpose: "building", permit_type: "Construction", status: "rejected", address: { barangay: "Barangay 2" }, date: "2024-01-19" },
          { id: 6, applicant: { first_name: "Sofia", last_name: "Martinez", email: "sofia@example.com" }, purpose: "food", permit_type: "Food Business", status: "approved", address: { barangay: "Barangay 3" }, date: "2024-01-20" },
          { id: 7, applicant: { first_name: "Miguel", last_name: "Torres", email: "miguel@example.com" }, purpose: "retail", permit_type: "Retail", status: "pending", address: { barangay: "Barangay 1" }, date: "2024-01-21" },
          { id: 8, applicant: { first_name: "Isabel", last_name: "Gonzales", email: "isabel@example.com" }, purpose: "community", permit_type: "Community", status: "approved", address: { barangay: "Barangay 2" }, date: "2024-01-22" }
        ];
        setPermits(mockData);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Export to CSV
  const exportToCSV = useCallback(() => {
    setExporting(true);
    const headers = ["Applicant Name", "Purpose", "Permit Type", "Barangay", "Status", "Date"];
    const csvContent = [
      headers.join(","),
      ...filteredPermits.map(p => [
        `${p.applicant?.first_name} ${p.applicant?.last_name}`,
        PERMIT_PURPOSES.find(pur => pur.value === p.purpose)?.label || p.purpose,
        p.permit_type,
        p.address?.barangay,
        p.status,
        p.date || p.created_at
      ].map(field => `"${field || ''}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `permits-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    setExporting(false);
  }, [filteredPermits]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FBFBFB] p-6 flex items-center justify-center font-poppins">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4CAF50] mx-auto"></div>
          <p className="mt-4 text-[#4D4A4A]">Loading permit analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FBFBFB] p-4 md:p-6 font-poppins">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#4D4A4A] font-montserrat">
              Barangay Permit Analytics
            </h1>
            <p className="text-[#4D4A4A] text-opacity-70 mt-2">
              Track and analyze permit applications by purpose and status
            </p>
          </div>
          <div className="flex items-center space-x-3 mt-4 md:mt-0">
            <button
              onClick={() => window.location.reload()}
              className="p-2 rounded-lg bg-white border border-[#E9E7E7] hover:bg-gray-50 transition-colors"
            >
              <RefreshCw className="w-5 h-5 text-[#4D4A4A]" />
            </button>
            <button
              onClick={exportToCSV}
              disabled={exporting}
              className="px-4 py-2 bg-[#4CAF50] text-white rounded-lg hover:bg-opacity-90 transition-colors flex items-center space-x-2 disabled:opacity-50 font-montserrat"
            >
              <DownloadCloud className="w-5 h-5" />
              <span>{exporting ? "Exporting..." : "Export Report"}</span>
            </button>
          </div>
        </div>

        {/* Quick Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            {
              title: "Total Applications",
              value: stats.total,
              icon: FileText,
              color: "bg-[#4CAF50]",
              trend: "+12%",
              trendUp: true,
              description: "All permit purposes"
            },
            {
              title: "Approval Rate",
              value: `${stats.approvalRate}%`,
              icon: TrendingUp,
              color: "bg-[#4A90E2]",
              trend: "+5.2%",
              trendUp: true,
              description: "Overall approval"
            },
            {
              title: "Top Purpose",
              value: stats.topPurpose.label,
              icon: stats.topPurpose.icon || Building,
              color: `bg-[${stats.topPurpose.color || '#4CAF50'}]`,
              trend: `${stats.topPurpose.count} applications`,
              trendUp: true,
              description: "Most requested"
            },
            {
              title: "Avg. Processing",
              value: `${stats.avgProcessingTime}d`,
              icon: Clock,
              color: "bg-[#FDA811]",
              trend: "-0.5d",
              trendUp: false,
              description: "Average duration"
            }
          ].map((stat, idx) => (
            <div
              key={idx}
              className="bg-white rounded-lg p-5 shadow-sm border border-[#E9E7E7] transition-all hover:shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#4D4A4A] text-opacity-70">{stat.title}</p>
                  <p className="text-2xl font-bold text-[#4D4A4A] mt-2 font-montserrat">
                    {stat.value}
                  </p>
                  <div className="mt-2">
                    <div className="flex items-center">
                      {stat.trendUp ? (
                        <TrendingUp className="w-4 h-4 text-[#4CAF50] mr-1" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-[#E53935] mr-1" />
                      )}
                      <span className={`text-sm ${stat.trendUp ? 'text-[#4CAF50]' : 'text-[#E53935]'}`}>
                        {stat.trend}
                      </span>
                    </div>
                    <span className="text-xs text-[#4D4A4A] text-opacity-60">{stat.description}</span>
                  </div>
                </div>
                <div className={`p-3 rounded-lg`} style={{ backgroundColor: stat.color.replace('bg-', '').replace('[', '').replace(']', '') }}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="mb-6">
        <div className="bg-white rounded-lg p-4 shadow-sm border border-[#E9E7E7]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#4D4A4A] text-opacity-50 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search applicants, purposes, or barangays..."
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-[#E9E7E7] bg-white text-[#4D4A4A] focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent font-poppins"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <div className="relative">
                <DatePicker
                  selectsRange={true}
                  startDate={startDate}
                  endDate={endDate}
                  onChange={(update) => setDateRange(update)}
                  className="px-4 py-2 rounded-lg border border-[#E9E7E7] bg-white text-[#4D4A4A] focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent font-poppins"
                  placeholderText="Select date range"
                />
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#4D4A4A] text-opacity-50 w-5 h-5 pointer-events-none" />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 rounded-lg border border-[#E9E7E7] bg-white text-[#4D4A4A] focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent font-poppins"
              >
                <option value="all">All Status</option>
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
                <option value="under review">Under Review</option>
              </select>

              <select
                value={purposeFilter}
                onChange={(e) => setPurposeFilter(e.target.value)}
                className="px-4 py-2 rounded-lg border border-[#E9E7E7] bg-white text-[#4D4A4A] focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent font-poppins"
              >
                <option value="all">All Purposes</option>
                {PERMIT_PURPOSES.map(purpose => (
                  <option key={purpose.value} value={purpose.value}>
                    {purpose.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Line Chart - Trends by Purpose */}
        <div className="lg:col-span-2 bg-white rounded-lg p-5 shadow-sm border border-[#E9E7E7]">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-[#4D4A4A] font-montserrat">Monthly Trends by Purpose</h3>
              <p className="text-sm text-[#4D4A4A] text-opacity-70">Applications for top permit purposes</p>
            </div>
            <div className="flex items-center space-x-4">
              {monthlyData.datasets.map((dataset, idx) => (
                <span key={idx} className="flex items-center">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: dataset.borderColor }}></div>
                  <span className="text-sm text-[#4D4A4A] ml-2">{dataset.label}</span>
                </span>
              ))}
            </div>
          </div>
          <div className="h-[300px]">
            <Line
              data={monthlyData}
              options={{
                maintainAspectRatio: false,
                responsive: true,
                plugins: {
                  legend: { display: false },
                  tooltip: {
                    mode: 'index',
                    intersect: false,
                  }
                },
                scales: {
                  x: {
                    grid: {
                      color: 'rgba(233, 231, 231, 0.5)'
                    },
                    ticks: {
                      color: '#4D4A4A',
                      font: {
                        family: 'Poppins'
                      }
                    }
                  },
                  y: {
                    grid: {
                      color: 'rgba(233, 231, 231, 0.5)'
                    },
                    ticks: {
                      color: '#4D4A4A',
                      font: {
                        family: 'Poppins'
                      }
                    }
                  }
                }
              }}
            />
          </div>
        </div>

        {/* Donut Chart - Status Distribution */}
        <div className="bg-white rounded-lg p-5 shadow-sm border border-[#E9E7E7]">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-[#4D4A4A] font-montserrat">Status Distribution</h3>
            <p className="text-sm text-[#4D4A4A] text-opacity-70">Current application status</p>
          </div>
          <div className="h-[250px] flex items-center justify-center">
            <Doughnut
              data={{
                labels: ["Approved", "Pending", "Rejected", "Under Review"],
                datasets: [{
                  data: [stats.approved, stats.pending, stats.rejected, stats.review],
                  backgroundColor: [
                    'rgba(76, 175, 80, 0.8)',
                    'rgba(253, 168, 17, 0.8)',
                    'rgba(229, 57, 53, 0.8)',
                    'rgba(74, 144, 226, 0.8)'
                  ],
                  borderColor: '#FBFBFB',
                  borderWidth: 2,
                }]
              }}
              options={{
                maintainAspectRatio: false,
                cutout: '70%',
                plugins: {
                  legend: {
                    position: 'bottom',
                    labels: {
                      color: '#4D4A4A',
                      padding: 20,
                      usePointStyle: true,
                      font: {
                        family: 'Poppins'
                      }
                    }
                  }
                }
              }}
            />
          </div>
          <div className="mt-6 grid grid-cols-2 gap-3">
            {[
              { label: "Approved", value: stats.approved, color: "bg-[#4CAF50]" },
              { label: "Pending", value: stats.pending, color: "bg-[#FDA811]" },
              { label: "Rejected", value: stats.rejected, color: "bg-[#E53935]" },
              { label: "Under Review", value: stats.review, color: "bg-[#4A90E2]" }
            ].map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-[#FBFBFB] rounded-lg border border-[#E9E7E7]">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full ${item.color} mr-3`}></div>
                  <span className="text-sm text-[#4D4A4A] font-poppins">{item.label}</span>
                </div>
                <span className="font-semibold text-[#4D4A4A] font-montserrat">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bar Chart - Permit Purposes */}
      <div className="mb-6 bg-white rounded-lg p-5 shadow-sm border border-[#E9E7E7]">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-[#4D4A4A] font-montserrat">Applications by Purpose</h3>
            <p className="text-sm text-[#4D4A4A] text-opacity-70">Distribution across different permit purposes</p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-[#4D4A4A] text-opacity-70">
              Showing top {topPurposes.length} purposes
            </span>
          </div>
        </div>
        <div className="h-[300px]">
          <Bar
            data={{
              labels: purposeData.labels,
              datasets: [
                {
                  label: "Applications",
                  data: purposeData.counts,
                  backgroundColor: purposeData.colors,
                  borderRadius: 6,
                  borderWidth: 1,
                  borderColor: "#E9E7E7",
                },
              ],
            }}
            options={{
              maintainAspectRatio: false,
              responsive: true,
              plugins: {
                legend: { 
                  display: false
                },
              },
              scales: {
                x: { 
                  ticks: { 
                    color: '#4D4A4A',
                    font: {
                      family: 'Poppins'
                    }
                  }, 
                  grid: { 
                    color: 'rgba(233, 231, 231, 0.5)' 
                  } 
                },
                y: { 
                  ticks: { 
                    color: '#4D4A4A',
                    font: {
                      family: 'Poppins'
                    }
                  }, 
                  grid: { 
                    color: 'rgba(233, 231, 231, 0.5)' 
                  }, 
                  beginAtZero: true 
                },
              },
            }}
          />
        </div>
        
        {/* Purpose Summary Cards */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {topPurposes.map((purpose, idx) => {
            const PurposeIcon = purpose.icon;
            return (
              <div 
                key={idx}
                className="p-3 rounded-lg border border-[#E9E7E7] hover:shadow transition-all"
                style={{ borderLeftColor: purpose.color, borderLeftWidth: '4px' }}
              >
                <div className="flex items-center mb-2">
                  <PurposeIcon className="w-5 h-5 mr-2" style={{ color: purpose.color }} />
                  <span className="text-sm font-medium text-[#4D4A4A] font-poppins truncate">
                    {purpose.label}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-[#4D4A4A] font-montserrat">
                    {purpose.count}
                  </span>
                  <span className="text-xs px-2 py-1 rounded-full bg-[#FBFBFB] text-[#4D4A4A]">
                    {purpose.approvalRate}% approved
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-lg shadow-sm border border-[#E9E7E7] overflow-hidden">
        <div className="p-5 border-b border-[#E9E7E7]">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-[#4D4A4A] font-montserrat">Recent Permit Applications</h3>
              <p className="text-sm text-[#4D4A4A] text-opacity-70">
                Showing {filteredPermits.length} of {permits.length} applications
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => window.print()}
                className="px-3 py-2 text-sm border border-[#E9E7E7] rounded-lg hover:bg-[#FBFBFB] transition-colors flex items-center font-poppins"
              >
                <Printer className="w-4 h-4 mr-2" />
                Print Report
              </button>
              <button className="p-2 rounded-lg border border-[#E9E7E7] hover:bg-[#FBFBFB] transition-colors">
                <MoreVertical className="w-5 h-5 text-[#4D4A4A]" />
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#FBFBFB]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#4D4A4A] uppercase tracking-wider font-montserrat">
                  Applicant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#4D4A4A] uppercase tracking-wider font-montserrat">
                  Purpose
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#4D4A4A] uppercase tracking-wider font-montserrat">
                  Permit Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#4D4A4A] uppercase tracking-wider font-montserrat">
                  Barangay
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#4D4A4A] uppercase tracking-wider font-montserrat">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#4D4A4A] uppercase tracking-wider font-montserrat">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#4D4A4A] uppercase tracking-wider font-montserrat">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E9E7E7]">
              {filteredPermits.slice(0, 8).map((permit, index) => {
                const statusConfig = getStatusColor(permit.status);
                const StatusIcon = statusConfig.icon;
                const PurposeIcon = getPurposeIcon(permit.purpose);
                const purposeInfo = PERMIT_PURPOSES.find(p => p.value === permit.purpose);
                
                return (
                  <tr key={index} className="hover:bg-[#FBFBFB] transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-[#4D4A4A] font-montserrat">
                          {permit.applicant?.first_name} {permit.applicant?.last_name}
                        </p>
                        <p className="text-sm text-[#4D4A4A] text-opacity-70 font-poppins">
                          {permit.applicant?.email || "No email"}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <PurposeIcon className="w-5 h-5 mr-3" style={{ color: purposeInfo?.color || '#4D4A4A' }} />
                        <span className="text-[#4D4A4A] font-poppins">
                          {purposeInfo?.label || permit.purpose}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-[#4CAF50] mr-3"></div>
                        <span className="text-[#4D4A4A] font-poppins">{permit.permit_type || "Barangay Permit"}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[#4D4A4A] font-poppins">
                      {permit.address?.barangay || "N/A"}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-[#4D4A4A] text-opacity-70 font-poppins">
                        {new Date(permit.date || permit.created_at).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`inline-flex items-center px-3 py-1 rounded-full ${statusConfig.bg} ${statusConfig.text} font-poppins`}>
                        <div className={`w-2 h-2 rounded-full ${statusConfig.dot} mr-2`}></div>
                        <StatusIcon className="w-4 h-4 mr-2" />
                        <span className="text-sm font-medium">{permit.status}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <button 
                          title="View Details"
                          className="p-1 text-[#4D4A4A] text-opacity-70 hover:text-[#4CAF50] transition-colors"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <button 
                          title="Approve"
                          className="p-1 text-[#4D4A4A] text-opacity-70 hover:text-[#4CAF50] transition-colors"
                        >
                          <CheckCircle className="w-5 h-5" />
                        </button>
                        <button 
                          title="Reject"
                          className="p-1 text-[#4D4A4A] text-opacity-70 hover:text-[#E53935] transition-colors"
                        >
                          <XCircle className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredPermits.length === 0 && !loading && (
          <div className="p-12 text-center">
            <FileText className="w-12 h-12 text-[#E9E7E7] mx-auto mb-4" />
            <p className="text-[#4D4A4A] text-opacity-70">No permits match your filters</p>
            <button
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("all");
                setPurposeFilter("all");
                setDateRange([null, null]);
              }}
              className="mt-4 text-[#4CAF50] hover:underline font-poppins"
            >
              Clear all filters
            </button>
          </div>
        )}

        {filteredPermits.length > 8 && (
          <div className="p-5 border-t border-[#E9E7E7]">
            <div className="flex items-center justify-between">
              <p className="text-sm text-[#4D4A4A] text-opacity-70 font-poppins">
                Showing 1-8 of {filteredPermits.length} applications
              </p>
              <div className="flex items-center space-x-2">
                <button className="px-3 py-2 text-sm border border-[#E9E7E7] rounded-lg hover:bg-[#FBFBFB] transition-colors disabled:opacity-50 font-poppins">
                  Previous
                </button>
                <button className="px-3 py-2 text-sm border border-[#E9E7E7] rounded-lg hover:bg-[#FBFBFB] transition-colors font-poppins">
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Error State */}
      {error && (
        <div className="mt-6 p-4 bg-[#E53935] bg-opacity-20 border border-[#E53935] border-opacity-30 rounded-lg">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-[#E53935] mr-3" />
            <p className="text-[#4D4A4A] font-poppins">{error}</p>
          </div>
        </div>
      )}
    </div>
  );
}