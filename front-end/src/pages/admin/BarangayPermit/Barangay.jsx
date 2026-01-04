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
  User,
  Building,
  Briefcase,
  Home,
  Scale,
  Wrench,
  Plane,
  Landmark,
  Shield
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

const API_BASE = "http://localhost/eplms-main/backend/barangay_permit";

// Comprehensive permit purposes based on your requirements
const PERMIT_PURPOSES = [
  // Personal Purposes
  { value: "For personal identification", label: "Personal Identification", icon: User, color: "#4CAF50" },
  { value: "For residency verification", label: "Residency Verification", icon: Home, color: "#4A90E2" },
  { value: "For school requirement", label: "School Requirement", icon: FileText, color: "#FDA811" },
  { value: "For scholarship application", label: "Scholarship Application", color: "#9C27B0", icon: FileText },
  { value: "For government assistance", label: "Government Assistance", color: "#2196F3", icon: Landmark },
  { value: "For medical assistance application", label: "Medical Assistance", color: "#F44336", icon: User },
  { value: "For financial assistance or aid", label: "Financial Assistance", color: "#FF9800", icon: FileText },
  { value: "For barangay ID application", label: "Barangay ID", color: "#795548", icon: User },
  { value: "For court requirement / affidavit / legal matter", label: "Court Requirement", color: "#607D8B", icon: Scale },
  { value: "For police clearance / NBI clearance requirement", label: "Police/NBI Clearance", color: "#3F51B5", icon: Shield },

  // Employment-Related
  { value: "For local employment", label: "Local Employment", color: "#4CAF50", icon: Briefcase },
  { value: "For job application (private company)", label: "Private Job Application", color: "#4A90E2", icon: Briefcase },
  { value: "For government employment", label: "Government Employment", color: "#FDA811", icon: Landmark },
  { value: "For on-the-job training (OJT)", label: "OJT", color: "#9C27B0", icon: Briefcase },
  { value: "For job order / contractual employment", label: "Job Order", color: "#2196F3", icon: Briefcase },
  { value: "For agency employment requirement", label: "Agency Employment", color: "#F44336", icon: Briefcase },
  { value: "For renewal of work contract", label: "Contract Renewal", color: "#FF9800", icon: Briefcase },
  { value: "For employment abroad (POEA / OFW)", label: "Overseas Employment", color: "#795548", icon: Plane },

  // Business-Related
  { value: "For new business permit application", label: "New Business Permit", color: "#4CAF50", icon: Building },
  { value: "For renewal of business permit", label: "Business Renewal", color: "#4A90E2", icon: Building },
  { value: "For DTI / SEC business registration", label: "DTI/SEC Registration", color: "#FDA811", icon: Landmark },
  { value: "For business tax application", label: "Business Tax", color: "#9C27B0", icon: FileText },
  { value: "For stall rental or space lease", label: "Stall Rental", color: "#2196F3", icon: Building },
  { value: "For business name registration", label: "Business Name", color: "#F44336", icon: FileText },
  { value: "For operation of new establishment", label: "New Establishment", color: "#FF9800", icon: Building },
  { value: "For business closure / cancellation", label: "Business Closure", color: "#795548", icon: Building },
  { value: "For relocation / change of business address", label: "Business Relocation", color: "#607D8B", icon: Building },

  // Residency/Property
  { value: "For proof of residency", label: "Proof of Residency", color: "#4CAF50", icon: Home },
  { value: "For transfer of residence", label: "Transfer Residence", color: "#4A90E2", icon: Home },
  { value: "For lot / land ownership verification", label: "Land Ownership", color: "#FDA811", icon: Home },
  { value: "For construction permit requirement", label: "Construction Permit", color: "#9C27B0", icon: Building },
  { value: "For fencing / excavation / building permit application", label: "Fencing/Building Permit", color: "#2196F3", icon: Wrench },
  { value: "For utility connection", label: "Utility Connection", color: "#F44336", icon: Home },
  { value: "For barangay boundary certification", label: "Boundary Certification", color: "#FF9800", icon: Shield },

  // Other Official/Legal
  { value: "For marriage license application", label: "Marriage License", color: "#4CAF50", icon: FileText },
  { value: "For travel / local mobility clearance", label: "Travel Clearance", color: "#4A90E2", icon: Plane },
  { value: "For firearm license application", label: "Firearm License", color: "#FDA811", icon: Shield },
  { value: "For barangay mediation / complaint settlement record", label: "Mediation Record", color: "#9C27B0", icon: Scale },
  { value: "For notarization requirement", label: "Notarization", color: "#2196F3", icon: FileText },
  { value: "For business closure or transfer", label: "Business Transfer", color: "#F44336", icon: Building },
  { value: "For franchise or transport operation permit", label: "Franchise Permit", color: "#FF9800", icon: Briefcase },
  { value: "For cooperative registration", label: "Cooperative Registration", color: "#795548", icon: Landmark },
  { value: "For loan application", label: "Loan Application", color: "#607D8B", icon: FileText },
  { value: "For SSS / Pag-IBIG / PhilHealth registration", label: "Gov't Benefits", color: "#3F51B5", icon: Landmark }
];

// Simplified purpose categories for filtering
const PURPOSE_CATEGORIES = [
  { value: "personal", label: "Personal Purposes", icon: User },
  { value: "employment", label: "Employment-Related", icon: Briefcase },
  { value: "business", label: "Business-Related", icon: Building },
  { value: "residency", label: "Residency/Property", icon: Home },
  { value: "official", label: "Official/Legal", icon: Scale }
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
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [exporting, setExporting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedPermit, setSelectedPermit] = useState(null);
  const [actionComment, setActionComment] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [actionLoading, setActionLoading] = useState(false);
  const itemsPerPage = 8;

  // Fetch permits from API
  const fetchPermits = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_BASE}/admin_fetch.php`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success && result.data) {
        setPermits(result.data);
      } else {
        throw new Error(result.message || 'Failed to fetch permits');
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching permits:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch single permit details
  const fetchSinglePermit = async (permitId) => {
    try {
      const response = await fetch(`${API_BASE}/fetch_single.php?permit_id=${permitId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success && result.data) {
        return result.data;
      } else {
        throw new Error(result.message || 'Failed to fetch permit details');
      }
    } catch (err) {
      console.error('Error fetching single permit:', err);
      return null;
    }
  };

  // Update permit status
  const updatePermitStatus = async (permitId, status, comments = '') => {
    try {
      setActionLoading(true);
      const response = await fetch(`${API_BASE}/update_status.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          permit_id: permitId,
          status: status.toLowerCase(),
          comments: comments
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update permit status');
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Failed to update permit status');
      }

      // Refresh data
      await fetchPermits();
      setActionComment('');
      
      // Close modal if open
      if (selectedPermit) {
        setShowModal(false);
        setSelectedPermit(null);
      }

    } catch (err) {
      console.error('Error updating permit status:', err);
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const getUIStatus = (dbStatus) => {
    if (!dbStatus) return 'For Compliance';
    switch (dbStatus.toLowerCase()) {
      case 'approved': return 'Approved';
      case 'rejected': return 'Rejected';
      case 'pending': return 'For Compliance';
      default: return 'For Compliance';
    }
  };

  // Enhanced stats with trends
  const stats = useMemo(() => {
    const total = permits.length;
    const approved = permits.filter(p => p.status?.toLowerCase() === "approved").length;
    const rejected = permits.filter(p => p.status?.toLowerCase() === "rejected").length;
    const pending = permits.filter(p => p.status?.toLowerCase() === "pending" || !p.status).length;

    // Calculate purpose statistics from actual data
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
    
    // Calculate approval rate
    const approvalRate = total > 0 ? ((approved / total) * 100).toFixed(1) : 0;
    
    // Calculate trend (mock for now)
    const lastWeekCount = Math.floor(total * 0.8);
    const trend = total > 0 ? ((total - lastWeekCount) / lastWeekCount * 100).toFixed(1) : 0;
    
    return {
      total,
      approved,
      rejected,
      pending,
      purposeStats,
      topPurpose,
      approvalRate,
      trend,
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

  // Monthly trends by purpose - Calculate from actual data
  const monthlyData = useMemo(() => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    // Get data for last 6 months
    const last6Months = months.slice(Math.max(0, currentMonth - 5), currentMonth + 1);
    
    // Get top 3 purposes
    const top3Purposes = topPurposes.slice(0, 3);
    
    // Initialize monthly counts
    const monthlyCounts = {};
    top3Purposes.forEach(purpose => {
      monthlyCounts[purpose.value] = Array(last6Months.length).fill(0);
    });
    
    // Count permits per month
    permits.forEach(permit => {
      if (!permit.application_date) return;
      
      const permitDate = new Date(permit.application_date);
      const monthIndex = permitDate.getMonth();
      const year = permitDate.getFullYear();
      
      if (year === currentYear && monthIndex <= currentMonth && monthIndex >= currentMonth - 5) {
        const monthInRange = monthIndex - (currentMonth - 5);
        if (monthInRange >= 0) {
          const purpose = permit.purpose || "";
          // Find if this purpose is in our top 3
          const foundPurpose = top3Purposes.find(p => p.value === purpose);
          if (foundPurpose && monthlyCounts[foundPurpose.value]) {
            monthlyCounts[foundPurpose.value][monthInRange]++;
          }
        }
      }
    });
    
    const colors = ["#4CAF50", "#FDA811", "#4A90E2"];
    return {
      labels: last6Months,
      datasets: top3Purposes.map((purpose, idx) => ({
        label: purpose.label,
        data: monthlyCounts[purpose.value] || Array(last6Months.length).fill(0),
        borderColor: colors[idx],
        backgroundColor: colors[idx] + "20",
        fill: true,
        tension: 0.4
      }))
    };
  }, [permits, topPurposes]);

  // Get status text color only - no background
  const getStatusText = (status) => {
    const statusLower = (status || "").toLowerCase();
    switch (statusLower) {
      case "approved":
        return {
          text: "Approved",
          color: "text-[#4CAF50]",
          icon: CheckCircle
        };
      case "rejected":
        return {
          text: "Rejected",
          color: "text-[#E53935]",
          icon: XCircle
        };
      case "pending":
        return {
          text: "For Compliance",
          color: "text-[#FDA811]",
          icon: Clock
        };
      case "for compliance":
        return {
          text: "For Compliance",
          color: "text-[#FDA811]",
          icon: AlertCircle
        };
      default:
        return {
          text: "For Compliance",
          color: "text-[#4D4A4A]",
          icon: AlertCircle
        };
    }
  };

  // Get purpose icon
  const getPurposeIcon = useCallback((purpose) => {
    const purposeObj = PERMIT_PURPOSES.find(p => 
      p.value.toLowerCase() === purpose?.toLowerCase()
    );
    return purposeObj?.icon || FileText;
  }, []);

  // Filter permits based on filters
  useEffect(() => {
    let filtered = [...permits];
    const searchLower = searchTerm.toLowerCase();

    // Date range filter
    if (startDate && endDate) {
      filtered = filtered.filter(p => {
        if (!p.application_date) return false;
        const permitDate = new Date(p.application_date);
        return permitDate >= startDate && permitDate <= endDate;
      });
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.first_name?.toLowerCase().includes(searchLower) ||
        p.last_name?.toLowerCase().includes(searchLower) ||
        p.middle_name?.toLowerCase().includes(searchLower) ||
        p.purpose?.toLowerCase().includes(searchLower) ||
        p.barangay?.toLowerCase().includes(searchLower) ||
        `BP-${String(p.permit_id).padStart(4, '0')}`.toLowerCase().includes(searchLower)
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(p => {
        const uiStatus = getUIStatus(p.status);
        return uiStatus.toLowerCase() === statusFilter.toLowerCase();
      });
    }

    // Purpose filter
    if (purposeFilter !== "all") {
      filtered = filtered.filter(p => 
        p.purpose?.toLowerCase() === purposeFilter.toLowerCase()
      );
    }

    // Category filter
    if (categoryFilter !== "all") {
      const categoryMap = {
        personal: ["personal identification", "residency verification", "school requirement", 
                  "scholarship", "government assistance", "medical assistance", "financial assistance",
                  "barangay id", "court", "police clearance", "nbi"],
        employment: ["employment", "job", "ojt", "contract", "agency", "overseas", "ofw", "poea"],
        business: ["business", "dti", "sec", "tax", "stall", "establishment", "closure"],
        residency: ["residency", "residence", "land", "lot", "construction", "fencing", 
                   "excavation", "utility", "boundary"],
        official: ["marriage", "travel", "firearm", "mediation", "notarization", 
                  "franchise", "cooperative", "loan", "sss", "pag-ibig", "philhealth"]
      };

      const categoryKeywords = categoryMap[categoryFilter] || [];
      filtered = filtered.filter(p => {
        const purposeLower = p.purpose?.toLowerCase() || "";
        return categoryKeywords.some(keyword => purposeLower.includes(keyword));
      });
    }

    setFilteredPermits(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [permits, startDate, endDate, searchTerm, statusFilter, purposeFilter, categoryFilter]);

  // Fetch data on component mount
  useEffect(() => {
    fetchPermits();
  }, []);

  // Export to CSV
  const exportToCSV = useCallback(() => {
    setExporting(true);
    const headers = ["Permit ID", "Applicant Name", "Purpose", "Barangay", "Status", "Application Date", "Clearance Fee", "Contact"];
    const csvContent = [
      headers.join(","),
      ...filteredPermits.map(p => [
        `BP-${String(p.permit_id).padStart(4, '0')}`,
        `${p.first_name} ${p.middle_name || ''} ${p.last_name} ${p.suffix || ''}`.trim(),
        p.purpose || "N/A",
        p.barangay || "N/A",
        getUIStatus(p.status),
        p.application_date ? new Date(p.application_date).toLocaleDateString() : "N/A",
        `₱${p.clearance_fee || '0.00'}`,
        p.mobile_number || p.email || "N/A"
      ].map(field => `"${field || ''}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `barangay-permits-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    setExporting(false);
  }, [filteredPermits]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredPermits.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPermits = filteredPermits.slice(startIndex, endIndex);

  const openModal = async (permit) => {
    try {
      const detailedPermit = await fetchSinglePermit(permit.permit_id);
      setSelectedPermit(detailedPermit || permit);
      setActionComment('');
      setShowModal(true);
    } catch (err) {
      console.error('Error opening modal:', err);
      setSelectedPermit(permit);
      setActionComment('');
      setShowModal(true);
    }
  };

  const closeModal = () => {
    setSelectedPermit(null);
    setActionComment('');
    setShowModal(false);
  };

  const handleApprove = async () => {
    if (!selectedPermit) return;
    await updatePermitStatus(selectedPermit.permit_id, 'approved', actionComment);
  };

  const handleReject = async () => {
    if (!selectedPermit) return;
    await updatePermitStatus(selectedPermit.permit_id, 'rejected', actionComment);
  };

  const handleForCompliance = async () => {
    if (!selectedPermit || !actionComment.trim()) {
      alert('Please add a comment before marking for compliance.');
      return;
    }
    await updatePermitStatus(selectedPermit.permit_id, 'pending', actionComment);
  };

  const formatComments = (commentsText) => {
    if (!commentsText || typeof commentsText !== 'string') return [];
    
    try {
      const cleanedText = commentsText.trim();
      const commentBlocks = cleanedText.split(/---\s+/);
      
      const formattedComments = [];
      
      for (let i = 1; i < commentBlocks.length; i++) {
        const block = commentBlocks[i].trim();
        if (!block) continue;
        
        const timestampEnd = block.indexOf(' ---\n');
        
        if (timestampEnd !== -1) {
          const timestamp = block.substring(0, timestampEnd).trim();
          const comment = block.substring(timestampEnd + 5).trim();
          
          if (comment) {
            formattedComments.push({
              timestamp,
              comment
            });
          }
        } else {
          formattedComments.push({
            timestamp: 'No timestamp',
            comment: block
          });
        }
      }
      
      return formattedComments.reverse();
    } catch (e) {
      console.error('Error formatting comments:', e);
      return [{
        timestamp: 'Error parsing',
        comment: commentsText
      }];
    }
  };

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
              onClick={fetchPermits}
              className="p-2 rounded-lg bg-white border border-[#E9E7E7] hover:bg-gray-50 transition-colors"
              title="Refresh Data"
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
              color: "#4CAF50",
              trend: `${stats.trend}%`,
              trendUp: stats.trend > 0,
              description: "All permit purposes"
            },
            {
              title: "Approval Rate",
              value: `${stats.approvalRate}%`,
              icon: TrendingUp,
              color: "#4A90E2",
              trend: stats.approvalRate > 0 ? "+5.2%" : "0%",
              trendUp: stats.approvalRate > 0,
              description: "Overall approval"
            },
            {
              title: "Top Purpose",
              value: stats.topPurpose.label,
              icon: stats.topPurpose.icon || FileText,
              color: stats.topPurpose.color || '#4CAF50',
              trend: `${stats.topPurpose.count} applications`,
              trendUp: true,
              description: "Most requested"
            },
            {
              title: "Pending Review",
              value: stats.pending,
              icon: Clock,
              color: "#FDA811",
              trend: `${stats.pending} pending`,
              trendUp: stats.pending > 0,
              description: "For compliance"
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
                <div className={`p-3 rounded-lg`} style={{ backgroundColor: stat.color }}>
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
                  className="px-4 py-2 rounded-lg border border-[#E9E7E7] bg-white text-[#4D4A4A] focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent font-poppins w-full md:w-auto"
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
                <option value="for compliance">For Compliance</option>
                <option value="rejected">Rejected</option>
              </select>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-4 py-2 rounded-lg border border-[#E9E7E7] bg-white text-[#4D4A4A] focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent font-poppins"
              >
                <option value="all">All Categories</option>
                {PURPOSE_CATEGORIES.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>

              <select
                value={purposeFilter}
                onChange={(e) => setPurposeFilter(e.target.value)}
                className="px-4 py-2 rounded-lg border border-[#E9E7E7] bg-white text-[#4D4A4A] focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent font-poppins"
              >
                <option value="all">All Purposes</option>
                {PERMIT_PURPOSES.map(purpose => (
                  <option key={purpose.value} value={purpose.value.toLowerCase()}>
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
                labels: ["Approved", "For Compliance", "Rejected"],
                datasets: [{
                  data: [stats.approved, stats.pending, stats.rejected],
                  backgroundColor: [
                    'rgba(76, 175, 80, 0.8)',
                    'rgba(253, 168, 17, 0.8)',
                    'rgba(229, 57, 53, 0.8)'
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
              { label: "Approved", value: stats.approved },
              { label: "For Compliance", value: stats.pending },
              { label: "Rejected", value: stats.rejected }
            ].map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-[#FBFBFB] rounded-lg border border-[#E9E7E7]">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full ${
                    item.label === "Approved" ? "bg-[#4CAF50]" :
                    item.label === "For Compliance" ? "bg-[#FDA811]" :
                    "bg-[#E53935]"
                  } mr-3`}></div>
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
              <h3 className="text-lg font-semibold text-[#4D4A4A] font-montserrat">Permit Applications</h3>
              <p className="text-sm text-[#4D4A4A] text-opacity-70">
                Showing {startIndex + 1}-{Math.min(endIndex, filteredPermits.length)} of {filteredPermits.length} applications
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => window.print()}
                className="px-3 py-2 text-sm border border-[#E9E7E7] rounded-lg hover:bg-[#FBFBFB] transition-colors flex items-center font-poppins"
                title="Print Report"
              >
                <Printer className="w-4 h-4 mr-2" />
                Print
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#FBFBFB]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#4D4A4A] uppercase tracking-wider font-montserrat">
                  Permit ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#4D4A4A] uppercase tracking-wider font-montserrat">
                  Applicant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#4D4A4A] uppercase tracking-wider font-montserrat">
                  Purpose
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
              {currentPermits.map((permit, index) => {
                const statusInfo = getStatusText(getUIStatus(permit.status));
                const StatusIcon = statusInfo.icon;
                const PurposeIcon = getPurposeIcon(permit.purpose);
                const purposeInfo = PERMIT_PURPOSES.find(p => p.value.toLowerCase() === permit.purpose?.toLowerCase());
                
                return (
                  <tr key={index} className="hover:bg-[#FBFBFB] transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-mono text-sm text-[#4D4A4A] font-medium">
                        BP-{String(permit.permit_id).padStart(4, '0')}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-[#4D4A4A] font-montserrat">
                          {permit.first_name} {permit.last_name}
                        </p>
                        <p className="text-sm text-[#4D4A4A] text-opacity-70 font-poppins">
                          {permit.email || permit.mobile_number || "No contact"}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <PurposeIcon className="w-5 h-5 mr-3" style={{ color: purposeInfo?.color || '#4D4A4A' }} />
                        <span className="text-[#4D4A4A] font-poppins truncate max-w-[200px]">
                          {permit.purpose || "N/A"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[#4D4A4A] font-poppins">
                      {permit.barangay || "N/A"}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-[#4D4A4A] text-opacity-70 font-poppins">
                        {permit.application_date ? new Date(permit.application_date).toLocaleDateString() : "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <StatusIcon className={`w-4 h-4 mr-2 ${statusInfo.color}`} />
                        <span className={`text-sm font-medium ${statusInfo.color} font-poppins`}>
                          {statusInfo.text}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <button 
                          onClick={() => openModal(permit)}
                          title="View Details"
                          className="p-2 bg-[#4A90E2] text-white rounded-lg hover:bg-[#FDA811]/80 transition-colors"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        {getUIStatus(permit.status) === "For Compliance" && (
                          <>
                            <button 
                              onClick={() => {
                                openModal(permit);
                              }}
                              title="Approve"
                              className="p-2 bg-[#4CAF50] text-white rounded-lg hover:bg-[#FDA811]/80 transition-colors"
                            >
                              <CheckCircle className="w-5 h-5" />
                            </button>

                          </>
                        )}
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
                setCategoryFilter("all");
                setDateRange([null, null]);
              }}
              className="mt-4 text-[#4CAF50] hover:underline font-poppins"
            >
              Clear all filters
            </button>
          </div>
        )}

        {/* Pagination */}
        {filteredPermits.length > itemsPerPage && (
          <div className="p-5 border-t border-[#E9E7E7]">
            <div className="flex items-center justify-between">
              <p className="text-sm text-[#4D4A4A] text-opacity-70 font-poppins">
                Page {currentPage} of {totalPages}
              </p>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 text-sm border border-[#E9E7E7] rounded-lg hover:bg-[#FBFBFB] transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-poppins"
                >
                  Previous
                </button>
                <button 
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 text-sm border border-[#E9E7E7] rounded-lg hover:bg-[#FBFBFB] transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-poppins"
                >
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
            <button 
              onClick={() => setError(null)}
              className="ml-auto text-sm text-[#4CAF50] hover:underline"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Permit Details Modal */}
      {showModal && selectedPermit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/30 backdrop-blur-sm p-4 overflow-auto">
          <div className="w-full max-w-6xl bg-white dark:bg-slate-800 rounded-xl shadow-2xl">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200 dark:border-slate-700 bg-gradient-to-r from-[#4CAF50]/5 to-[#4A90E2]/5 rounded-t-xl">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Barangay Permit Details</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Permit ID: BP-{String(selectedPermit.permit_id).padStart(4, '0')}
                  </p>
                  <div className="mt-2 flex items-center">
                    <span className={`text-sm font-medium ${getStatusText(getUIStatus(selectedPermit.status)).color} font-poppins`}>
                      {getUIStatus(selectedPermit.status)}
                    </span>
                  </div>
                </div>
                <button 
                  onClick={closeModal}
                  className="p-2 bg-[#4CAF50] text-white rounded-lg hover:bg-[#FDA811] transition-colors"
                >
                  <span className="text-xl">×</span>
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
              {/* Personal Information Section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Full Name</label>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white mt-1">
                      {selectedPermit.first_name} {selectedPermit.middle_name} {selectedPermit.last_name} {selectedPermit.suffix}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Mobile Number</label>
                    <p className="text-gray-900 dark:text-white mt-1">
                      {selectedPermit.mobile_number || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Email Address</label>
                    <p className="text-gray-900 dark:text-white mt-1">
                      {selectedPermit.email || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Birth Date</label>
                    <p className="text-gray-900 dark:text-white mt-1">
                      {selectedPermit.birthdate ? new Date(selectedPermit.birthdate).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div className="border-t border-gray-200 dark:border-slate-700 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Address Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-gray-500">House No.</label>
                    <p className="text-gray-900 dark:text-white mt-1">
                      {selectedPermit.house_no || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Street</label>
                    <p className="text-gray-900 dark:text-white mt-1">
                      {selectedPermit.street || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Barangay</label>
                    <p className="text-gray-900 dark:text-white mt-1">
                      {selectedPermit.barangay || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">City/Municipality</label>
                    <p className="text-gray-900 dark:text-white mt-1">
                      {selectedPermit.city_municipality || 'N/A'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Permit Details */}
              <div className="border-t border-gray-200 dark:border-slate-700 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Permit Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Purpose</label>
                    <p className="text-gray-900 dark:text-white mt-1">
                      {selectedPermit.purpose || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Application Date</label>
                    <p className="text-gray-900 dark:text-white mt-1">
                      {selectedPermit.application_date ? new Date(selectedPermit.application_date).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div className="border-t border-gray-200 dark:border-slate-700 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Payment Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Clearance Fee</label>
                    <p className="text-xl font-bold text-[#4CAF50] mt-1">
                      ₱{selectedPermit.clearance_fee || '0.00'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Receipt Number</label>
                    <p className="text-gray-900 dark:text-white mt-1">
                      {selectedPermit.receipt_number || 'N/A'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Review Comments Section */}
              <div className="border-t border-gray-200 dark:border-slate-700 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Review Comments
                  {selectedPermit.comments && (
                    <span className="text-sm font-normal text-gray-500 ml-2">
                      ({formatComments(selectedPermit.comments).length} comment{formatComments(selectedPermit.comments).length !== 1 ? 's' : ''})
                    </span>
                  )}
                </h3>
                
                {/* Display all comments */}
                {selectedPermit.comments && selectedPermit.comments.trim() ? (
                  <div className="space-y-4 mb-4">
                    {formatComments(selectedPermit.comments).map((comment, index) => (
                      <div key={index} className="p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
                        <div className="text-sm text-gray-500 dark:text-gray-400 mb-2 font-medium">
                          {comment.timestamp}
                        </div>
                        <p className="text-gray-900 dark:text-white whitespace-pre-wrap">
                          {comment.comment}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 bg-gray-50 dark:bg-slate-700 rounded-lg mb-4">
                    <p className="text-gray-500 dark:text-gray-400 italic">
                      No comments yet. Add your first comment below.
                    </p>
                  </div>
                )}

                {/* Textarea for adding new comments */}
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Add New Comment
                  </label>
                  <textarea 
                    value={actionComment} 
                    onChange={(e) => setActionComment(e.target.value)} 
                    className="w-full border border-gray-300 dark:border-slate-600 rounded-lg px-4 py-3 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
                    rows={4} 
                    placeholder="Enter your review notes here..." 
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 justify-end pt-6 border-t border-gray-200 dark:border-slate-700">
                <button 
                  onClick={closeModal}
                  className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-medium"
                >
                  Close
                </button>
                
                {getUIStatus(selectedPermit.status) === "For Compliance" ? (
                  <>
                    <button 
                      onClick={handleForCompliance}
                      disabled={!actionComment.trim() || actionLoading}
                      className="px-6 py-3 bg-[#FDA811] text-white rounded-lg hover:bg-[#FDA811]/80 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {actionLoading ? "Processing..." : "Mark for Compliance"}
                    </button>
                    
                    <button 
                      onClick={handleReject}
                      disabled={actionLoading}
                      className="px-6 py-3 bg-[#E53935] text-white rounded-lg hover:bg-[#E53935]/80 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {actionLoading ? "Processing..." : "Reject Application"}
                    </button>
                    
                    <button 
                      onClick={handleApprove}
                      disabled={actionLoading}
                      className="px-6 py-3 bg-[#4CAF50] text-white rounded-lg hover:bg-[#4CAF50]/80 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {actionLoading ? "Processing..." : "Approve Permit"}
                    </button>
                  </>
                ) : (
                  <button 
                    onClick={closeModal}
                    className="px-6 py-3 bg-[#4CAF50] text-white rounded-lg hover:bg-[#4CAF50]/80 transition-colors font-medium"
                  >
                    Close
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}