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
  Building,
  Briefcase,
  Users,
  DollarSign,
  MapPin,
  Factory,
  Store,
  Coffee,
  ShoppingBag,
  Utensils,
  Home,
  Truck,
  BarChart,
  Layers,
  File,
  FileText as FileTextIcon,
  FileSpreadsheet,
  Image,
  X,
  AlertTriangle,
  User,
  FileCode,
  Folder,
  FileArchive,
  FileVideo,
  FileAudio
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

const API_BASE = "/backend/business_permit";

// Business types and categories
const BUSINESS_CATEGORIES = [
  { value: "retail", label: "Retail Store", icon: Store, color: "#4CAF50" },
  { value: "restaurant", label: "Restaurant/Café", icon: Utensils, color: "#FDA811" },
  { value: "manufacturing", label: "Manufacturing", icon: Factory, color: "#4A90E2" },
  { value: "services", label: "Services", icon: Briefcase, color: "#9C27B0" },
  { value: "wholesale", label: "Wholesale", icon: ShoppingBag, color: "#2196F3" },
  { value: "construction", label: "Construction", icon: Home, color: "#795548" },
  { value: "transport", label: "Transport", icon: Truck, color: "#607D8B" },
  { value: "professional", label: "Professional Services", icon: Briefcase, color: "#3F51B5" },
  { value: "others", label: "Others", icon: Building, color: "#F44336" }
];

const BUSINESS_SIZE = [
  { value: "micro", label: "Micro (<₱3M)", color: "#4CAF50" },
  { value: "small", label: "Small (₱3M-15M)", color: "#FDA811" },
  { value: "medium", label: "Medium (₱15M-100M)", color: "#4A90E2" },
  { value: "large", label: "Large (>₱100M)", color: "#9C27B0" }
];

// Format currency function
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount || 0);
};

// Helper function to match business category
const matchesCategory = (businessType, category) => {
  if (!businessType) return false;
  
  switch (category) {
    case "retail": return businessType.includes("retail") || businessType.includes("store");
    case "restaurant": return businessType.includes("restaurant") || businessType.includes("cafe") || businessType.includes("food");
    case "manufacturing": return businessType.includes("manufactur");
    case "services": return businessType.includes("service");
    case "wholesale": return businessType.includes("wholesale");
    case "construction": return businessType.includes("construct");
    case "transport": return businessType.includes("transport");
    case "professional": return businessType.includes("professional") || businessType.includes("consult");
    case "others": return true;
    default: return false;
  }
};

export default function BusPermitAnalytics() {
  const [permits, setPermits] = useState([]);
  const [filteredPermits, setFilteredPermits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sizeFilter, setSizeFilter] = useState("all");
  const [exporting, setExporting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedPermit, setSelectedPermit] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [actionComment, setActionComment] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [showFilePreview, setShowFilePreview] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
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

  // Fetch single permit with documents
  const fetchSinglePermit = async (permitId) => {
    try {
      const response = await fetch(`${API_BASE}/fetch_single.php?permit_id=${permitId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success && result.data) {
        // If documents are not included, fetch them separately
        if (!result.data.documents || result.data.documents.length === 0) {
          const documents = await fetchPermitDocuments(permitId);
          result.data.documents = documents;
        }
        
        return result.data;
      } else {
        throw new Error(result.message || 'Failed to fetch permit details');
      }
    } catch (err) {
      console.error('Error fetching single permit:', err);
      return null;
    }
  };

  // Fetch documents separately if needed
  const fetchPermitDocuments = async (permitId) => {
    try {
      const response = await fetch(`${API_BASE}/fetch_documents.php?permit_id=${permitId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success && result.data) {
        return result.data;
      } else {
        return [];
      }
    } catch (err) {
      console.error('Error fetching documents:', err);
      return [];
    }
  };

  // Enhanced stats with business-specific metrics
  const stats = useMemo(() => {
    const total = permits.length;
    const approved = permits.filter(p => p.status?.toUpperCase() === "APPROVED").length;
    const rejected = permits.filter(p => p.status?.toUpperCase() === "REJECTED").length;
    const pending = permits.filter(p => p.status?.toUpperCase() === "PENDING" || !p.status).length;
    const compliance = permits.filter(p => p.status?.toUpperCase() === "COMPLIANCE").length;

    // Calculate business category statistics
    const categoryStats = BUSINESS_CATEGORIES.map(category => {
      const count = permits.filter(p => {
        const businessType = p.business_nature?.toLowerCase();
        if (!businessType) return false;
        
        return matchesCategory(businessType, category.value);
      }).length;
      
      const approvedCount = permits.filter(p => {
        const businessType = p.business_nature?.toLowerCase();
        if (!businessType) return false;
        
        return matchesCategory(businessType, category.value) && p.status?.toUpperCase() === "APPROVED";
      }).length;
      
      const approvalRate = count > 0 ? ((approvedCount / count) * 100).toFixed(1) : 0;
      
      // Calculate total capital for this category
      const totalCapital = permits.filter(p => {
        const businessType = p.business_nature?.toLowerCase();
        if (!businessType) return false;
        
        return matchesCategory(businessType, category.value);
      }).reduce((sum, p) => sum + (parseFloat(p.capital_investment) || 0), 0);
      
      return {
        ...category,
        count,
        approvedCount,
        approvalRate,
        totalCapital: formatCurrency(totalCapital),
        rawCapital: totalCapital
      };
    }).filter(p => p.count > 0)
      .sort((a, b) => b.count - a.count);

    // Calculate size distribution
    const sizeStats = BUSINESS_SIZE.map(size => {
      const count = permits.filter(p => {
        const capital = parseFloat(p.capital_investment) || 0;
        if (size.value === "micro" && capital < 3000000) return true;
        if (size.value === "small" && capital >= 3000000 && capital < 15000000) return true;
        if (size.value === "medium" && capital >= 15000000 && capital < 100000000) return true;
        if (size.value === "large" && capital >= 100000000) return true;
        return false;
      }).length;
      
      return {
        ...size,
        count,
        percentage: total > 0 ? ((count / total) * 100).toFixed(1) : 0
      };
    }).filter(s => s.count > 0);

    const topCategory = categoryStats[0] || { label: "N/A", count: 0 };
    
    // Calculate totals
    const totalCapital = permits.reduce((sum, p) => sum + (parseFloat(p.capital_investment) || 0), 0);
    const totalEmployees = permits.reduce((sum, p) => sum + (parseInt(p.total_employees) || 0), 0);
    const avgProcessingTime = 7;
    
    // Calculate trend
    const lastMonthCount = Math.floor(total * 0.85);
    const trend = total > 0 ? ((total - lastMonthCount) / lastMonthCount * 100).toFixed(1) : 0;
    
    return {
      total,
      approved,
      rejected,
      pending,
      compliance,
      categoryStats,
      sizeStats,
      topCategory,
      totalCapital: formatCurrency(totalCapital),
      totalEmployees,
      avgProcessingTime,
      trend,
      approvalRate: total > 0 ? ((approved / total) * 100).toFixed(1) : 0,
      completionRate: total > 0 ? (((approved + rejected + compliance) / total) * 100).toFixed(1) : 0
    };
  }, [permits]);

  // Process business categories for charts
  const topCategories = useMemo(() => {
    return stats.categoryStats.slice(0, 5);
  }, [stats.categoryStats]);

  const categoryData = useMemo(() => {
    return {
      labels: topCategories.map(p => p.label),
      counts: topCategories.map(p => p.count),
      colors: topCategories.map(p => p.color),
      capital: topCategories.map(p => p.rawCapital || 0)
    };
  }, [topCategories]);

  // Monthly trends by category
  const monthlyData = useMemo(() => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    // Get data for last 6 months
    const last6Months = months.slice(Math.max(0, currentMonth - 5), currentMonth + 1);
    
    // Get top 3 categories
    const top3Categories = topCategories.slice(0, 3);
    
    // Initialize monthly counts
    const monthlyCounts = {};
    top3Categories.forEach(category => {
      monthlyCounts[category.value] = Array(last6Months.length).fill(0);
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
          const businessType = permit.business_nature?.toLowerCase() || "";
          
          // Find if this business type matches our top categories
          top3Categories.forEach(category => {
            if (matchesCategory(businessType, category.value)) {
              monthlyCounts[category.value][monthInRange]++;
            }
          });
        }
      }
    });
    
    const colors = ["#4CAF50", "#FDA811", "#4A90E2"];
    return {
      labels: last6Months,
      datasets: top3Categories.map((category, idx) => ({
        label: category.label,
        data: monthlyCounts[category.value] || Array(last6Months.length).fill(0),
        borderColor: colors[idx],
        backgroundColor: colors[idx] + "20",
        fill: true,
        tension: 0.4
      }))
    };
  }, [permits, topCategories]);

  // Get status text and color
  const getStatusText = (status) => {
    const statusUpper = (status || "").toUpperCase();
    switch (statusUpper) {
      case "APPROVED":
        return {
          text: "Approved",
          color: "text-[#4CAF50]",
          bgColor: "bg-[#4CAF50]/10",
          icon: CheckCircle
        };
      case "REJECTED":
        return {
          text: "Rejected",
          color: "text-[#E53935]",
          bgColor: "bg-[#E53935]/10",
          icon: XCircle
        };
      case "PENDING":
        return {
          text: "Pending",
          color: "text-[#4A90E2]",
          bgColor: "bg-[#4A90E2]/10",
          icon: Clock
        };
      case "COMPLIANCE":
        return {
          text: "For Compliance",
          color: "text-[#FDA811]",
          bgColor: "bg-[#FDA811]/10",
          icon: AlertCircle
        };
      default:
        return {
          text: "Pending",
          color: "text-[#4D4A4A]",
          bgColor: "bg-gray-100",
          icon: AlertCircle
        };
    }
  };

  // Get category icon
  const getCategoryIcon = useCallback((businessType) => {
    if (!businessType) return Building;
    
    const businessTypeLower = businessType.toLowerCase();
    if (businessTypeLower.includes("retail") || businessTypeLower.includes("store")) return Store;
    if (businessTypeLower.includes("restaurant") || businessTypeLower.includes("cafe") || businessTypeLower.includes("food")) return Utensils;
    if (businessTypeLower.includes("manufactur")) return Factory;
    if (businessTypeLower.includes("service")) return Briefcase;
    if (businessTypeLower.includes("wholesale")) return ShoppingBag;
    if (businessTypeLower.includes("construct")) return Home;
    if (businessTypeLower.includes("transport")) return Truck;
    if (businessTypeLower.includes("professional") || businessTypeLower.includes("consult")) return Briefcase;
    return Building;
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
        p.owner_first_name?.toLowerCase().includes(searchLower) ||
        p.owner_last_name?.toLowerCase().includes(searchLower) ||
        p.business_name?.toLowerCase().includes(searchLower) ||
        p.trade_name?.toLowerCase().includes(searchLower) ||
        p.barangay?.toLowerCase().includes(searchLower) ||
        p.applicant_id?.toLowerCase().includes(searchLower)
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(p => {
        const status = (p.status || "").toUpperCase();
        return status === statusFilter.toUpperCase();
      });
    }

    // Category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter(p => 
        matchesCategory(p.business_nature?.toLowerCase(), categoryFilter)
      );
    }

    // Size filter
    if (sizeFilter !== "all") {
      filtered = filtered.filter(p => {
        const capital = parseFloat(p.capital_investment) || 0;
        switch (sizeFilter) {
          case "micro": return capital < 3000000;
          case "small": return capital >= 3000000 && capital < 15000000;
          case "medium": return capital >= 15000000 && capital < 100000000;
          case "large": return capital >= 100000000;
          default: return true;
        }
      });
    }

    setFilteredPermits(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [permits, startDate, endDate, searchTerm, statusFilter, categoryFilter, sizeFilter]);

  // Fetch data on component mount
  useEffect(() => {
    fetchPermits();
  }, []);

  // Export to CSV
  const exportToCSV = useCallback(() => {
    setExporting(true);
    const headers = ["Application ID", "Business Name", "Owner", "Business Type", "Capital", "Status", "Application Date", "Barangay", "Employees"];
    const csvContent = [
      headers.join(","),
      ...filteredPermits.map(p => [
        p.applicant_id || "N/A",
        p.business_name || "N/A",
        `${p.owner_last_name}, ${p.owner_first_name}`,
        p.business_nature || "N/A",
        formatCurrency(p.capital_investment),
        getStatusText(p.status).text,
        p.application_date ? new Date(p.application_date).toLocaleDateString() : "N/A",
        p.barangay || "N/A",
        p.total_employees || "0"
      ].map(field => `"${field || ''}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `business-permits-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    setExporting(false);
  }, [filteredPermits]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredPermits.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPermits = filteredPermits.slice(startIndex, endIndex);

  // Helper functions for modal
  const getUIStatus = (dbStatus) => {
    if (!dbStatus) return 'Pending';
    switch (dbStatus.toUpperCase()) {
      case 'APPROVED': return 'Approved';
      case 'REJECTED': return 'Rejected';
      case 'COMPLIANCE': return 'Compliance';
      case 'PENDING': return 'Pending';
      default: return 'Pending';
    }
  };

  const getDBStatus = (uiStatus) => {
    switch (uiStatus) {
      case 'Approved': return 'APPROVED';
      case 'Rejected': return 'REJECTED';
      case 'Compliance': return 'COMPLIANCE';
      case 'Pending': return 'PENDING';
      default: return 'PENDING';
    }
  };

  const getStatusColor = (status) => {
    const uiStatus = getUIStatus(status);
    switch (uiStatus) {
      case "Approved": return "text-[#4CAF50] bg-[#4CAF50]/10";
      case "Rejected": return "text-[#E53935] bg-[#E53935]/10";
      case "Compliance": return "text-[#FDA811] bg-[#FDA811]/10";
      case "Pending": return "text-[#4A90E2] bg-[#4A90E2]/10";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  // Check if file is an image
  const isImageFile = (fileType, fileName = '') => {
    const fileTypeLower = (fileType || '').toLowerCase();
    const fileNameLower = (fileName || '').toLowerCase();
    
    if (fileNameLower.endsWith('.jpg') || 
        fileNameLower.endsWith('.jpeg') || 
        fileNameLower.endsWith('.png') || 
        fileNameLower.endsWith('.gif') || 
        fileNameLower.endsWith('.bmp') || 
        fileNameLower.endsWith('.webp') ||
        fileNameLower.endsWith('.svg')) {
      return true;
    }
    
    if (fileTypeLower.includes('image/jpeg') || 
        fileTypeLower.includes('image/png') || 
        fileTypeLower.includes('image/gif') || 
        fileTypeLower.includes('image/bmp') || 
        fileTypeLower.includes('image/webp') ||
        fileTypeLower.includes('image/svg')) {
      return true;
    }
    
    return false;
  };

  // Get file icon - Updated to use Lucide icons
  const getFileIcon = (fileType, fileName = '') => {
    const fileTypeLower = (fileType || '').toLowerCase();
    const fileNameLower = (fileName || '').toLowerCase();
    
    if (fileNameLower.endsWith('.pdf') || fileTypeLower.includes('pdf')) {
      return {
        icon: FileTextIcon,
        bgColor: 'bg-red-100',
        textColor: 'text-red-600',
        iconColor: '#dc2626'
      };
    }
    
    if (fileNameLower.endsWith('.doc') || fileNameLower.endsWith('.docx') ||
        fileTypeLower.includes('word') || fileTypeLower.includes('officedocument.wordprocessingml')) {
      return {
        icon: FileText,
        bgColor: 'bg-blue-100',
        textColor: 'text-blue-600',
        iconColor: '#2563eb'
      };
    }
    
    if (fileNameLower.endsWith('.xls') || fileNameLower.endsWith('.xlsx') ||
        fileTypeLower.includes('excel') || fileTypeLower.includes('spreadsheetml')) {
      return {
        icon: FileSpreadsheet,
        bgColor: 'bg-green-100',
        textColor: 'text-green-600',
        iconColor: '#059669'
      };
    }
    
    if (fileTypeLower.includes('image/')) {
      return {
        icon: Image,
        bgColor: 'bg-purple-100',
        textColor: 'text-purple-600',
        iconColor: '#7c3aed'
      };
    }
    
    if (fileNameLower.endsWith('.zip') || fileNameLower.endsWith('.rar') || 
        fileNameLower.endsWith('.7z') || fileTypeLower.includes('zip') ||
        fileTypeLower.includes('compressed')) {
      return {
        icon: FileArchive,
        bgColor: 'bg-orange-100',
        textColor: 'text-orange-600',
        iconColor: '#ea580c'
      };
    }
    
    if (fileNameLower.endsWith('.mp4') || fileNameLower.endsWith('.avi') || 
        fileNameLower.endsWith('.mov') || fileTypeLower.includes('video')) {
      return {
        icon: FileVideo,
        bgColor: 'bg-pink-100',
        textColor: 'text-pink-600',
        iconColor: '#db2777'
      };
    }
    
    if (fileNameLower.endsWith('.mp3') || fileNameLower.endsWith('.wav') || 
        fileNameLower.endsWith('.flac') || fileTypeLower.includes('audio')) {
      return {
        icon: FileAudio,
        bgColor: 'bg-indigo-100',
        textColor: 'text-indigo-600',
        iconColor: '#4f46e5'
      };
    }
    
    if (fileNameLower.endsWith('.js') || fileNameLower.endsWith('.ts') || 
        fileNameLower.endsWith('.html') || fileNameLower.endsWith('.css') ||
        fileNameLower.endsWith('.json') || fileNameLower.endsWith('.xml')) {
      return {
        icon: FileCode,
        bgColor: 'bg-gray-100',
        textColor: 'text-gray-600',
        iconColor: '#4b5563'
      };
    }
    
    return {
      icon: File,
      bgColor: 'bg-gray-100',
      textColor: 'text-gray-600',
      iconColor: '#4b5563'
    };
  };

  // Get file type name
  const getFileTypeName = (fileType, fileName = '') => {
    const fileTypeLower = (fileType || '').toLowerCase();
    const fileNameLower = (fileName || '').toLowerCase();
    
    if (fileNameLower.endsWith('.pdf')) return 'PDF Document';
    if (fileNameLower.endsWith('.doc') || fileNameLower.endsWith('.docx')) return 'Word Document';
    if (fileNameLower.endsWith('.xls') || fileNameLower.endsWith('.xlsx')) return 'Excel Spreadsheet';
    if (fileNameLower.endsWith('.jpg') || fileNameLower.endsWith('.jpeg')) return 'JPEG Image';
    if (fileNameLower.endsWith('.png')) return 'PNG Image';
    if (fileNameLower.endsWith('.gif')) return 'GIF Image';
    if (fileNameLower.endsWith('.zip') || fileNameLower.endsWith('.rar')) return 'Compressed Archive';
    if (fileNameLower.endsWith('.mp4') || fileNameLower.endsWith('.mov')) return 'Video File';
    if (fileNameLower.endsWith('.mp3') || fileNameLower.endsWith('.wav')) return 'Audio File';
    if (fileTypeLower.includes('pdf')) return 'PDF Document';
    if (fileTypeLower.includes('image/')) return 'Image';
    if (fileTypeLower.includes('video/')) return 'Video';
    if (fileTypeLower.includes('audio/')) return 'Audio';
    if (fileTypeLower.includes('zip')) return 'Compressed File';
    
    return 'Document';
  };

  // Get file extension
  const getFileExtension = (fileName = '') => {
    const parts = fileName.split('.');
    return parts.length > 1 ? parts[parts.length - 1].toUpperCase() : 'FILE';
  };

  // Format time
  const formatTime = (time) => {
    if (!time) return 'N/A';
    try {
      const [hours, minutes] = time.split(':');
      const date = new Date();
      date.setHours(hours, minutes);
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    } catch {
      return time;
    }
  };

  // Format comments
  const formatComments = (commentsText) => {
    if (!commentsText || typeof commentsText !== 'string') return [];
    
    try {
      const commentBlocks = commentsText.split(/(?=---\s+.+?\s+---)/g);
      const formattedComments = [];
      
      for (let block of commentBlocks) {
        block = block.trim();
        if (!block) continue;
        
        const match = block.match(/^---\s+(.+?)\s+---\n([\s\S]*)$/);
        
        if (match) {
          const timestamp = match[1].trim();
          const comment = match[2].trim();
          
          if (comment) {
            formattedComments.push({
              timestamp,
              comment
            });
          }
        } else {
          formattedComments.push({
            timestamp: 'Just now',
            comment: block
          });
        }
      }
      
      return formattedComments;
    } catch (e) {
      console.error('Error formatting comments:', e);
      return [{
        timestamp: 'Recent',
        comment: commentsText
      }];
    }
  };

  const openModal = async (permit) => {
    try {
      const detailedPermit = await fetchSinglePermit(permit.permit_id);
      
      if (detailedPermit) {
        const uiStatus = getUIStatus(detailedPermit.status);
        setSelectedPermit({
          ...detailedPermit,
          uiStatus: uiStatus
        });
      } else {
        const uiStatus = getUIStatus(permit.status);
        setSelectedPermit({
          ...permit,
          uiStatus: uiStatus
        });
      }
      
      setActionComment('');
      setShowModal(true);
    } catch (err) {
      console.error('Error opening modal:', err);
      const uiStatus = getUIStatus(permit.status);
      setSelectedPermit({
        ...permit,
        uiStatus: uiStatus
      });
      setActionComment('');
      setShowModal(true);
    }
  };

  const closeModal = () => {
    setSelectedPermit(null);
    setActionComment('');
    setSelectedFile(null);
    setShowFilePreview(false);
    setShowModal(false);
  };

  // Update permit status
  const updatePermitStatus = async (status) => {
    if (!selectedPermit) return;
    
    try {
      const dbStatus = getDBStatus(status);
      
      const response = await fetch(`${API_BASE}/update_status.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          permit_id: selectedPermit.permit_id,
          status: dbStatus,
          comments: actionComment
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update permit status');
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Failed to update permit status');
      }

      // Update the selected permit in state
      setSelectedPermit(prev => ({
        ...prev,
        status: dbStatus,
        uiStatus: status,
        comments: result.data?.comments || prev.comments
      }));

      // Refresh the permits list
      await fetchPermits();

      // Clear the comment input
      setActionComment('');

      // Show success message
      setSuccessMessage(`Permit ${status.toLowerCase()} successfully!`);
      setShowSuccessModal(true);

    } catch (err) {
      console.error('Error updating permit status:', err);
      setError(err.message || 'Failed to update permit status');
    }
  };

  const viewFile = async (file) => {
    try {
      if (!file || !file.file_path) {
        alert('File path not available');
        return;
      }
      
      // Extract filename
      const filename = file.file_path.split('/').pop();
      
      // Call API endpoint instead of direct file access
      const fullUrl = `${API_BASE}/uploads/${encodeURIComponent(filename)}`;
      
      setSelectedFile({
        ...file,
        url: fullUrl,
        name: file.document_name || file.document_type || 'Document'
      });
      setShowFilePreview(true);
      
    } catch (err) {
      console.error('Error accessing file:', err);
      alert('Unable to access the file');
    }
  };

  const closeFilePreview = () => {
    setSelectedFile(null);
    setShowFilePreview(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FBFBFB] p-6 flex items-center justify-center font-poppins">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4CAF50] mx-auto"></div>
          <p className="mt-4 text-[#4D4A4A]">Loading business analytics...</p>
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
              Business Permit Analytics
            </h1>
            <p className="text-[#4D4A4A] text-opacity-70 mt-2">
              Track and analyze business permit applications by category, size, and status
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
              description: "All business types"
            },
            {
              title: "Total Capital",
              value: stats.totalCapital,
              icon: DollarSign,
              color: "#FDA811",
              trend: "+12.5%",
              trendUp: true,
              description: "Total investment"
            },
            {
              title: "Top Category",
              value: stats.topCategory.label,
              icon: stats.topCategory.icon || Building,
              color: stats.topCategory.color || '#4CAF50',
              trend: `${stats.topCategory.count} applications`,
              trendUp: true,
              description: "Most registered"
            },
            {
              title: "Pending Review",
              value: stats.pending + stats.compliance,
              icon: Clock,
              color: "#4A90E2",
              trend: `${stats.pending} pending, ${stats.compliance} compliance`,
              trendUp: stats.pending > 0,
              description: "Awaiting action"
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

        {/* Secondary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg p-4 shadow-sm border border-[#E9E7E7]">
            <p className="text-sm text-[#4D4A4A] text-opacity-70">Approval Rate</p>
            <p className="text-xl font-bold text-[#4CAF50]">{stats.approvalRate}%</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border border-[#E9E7E7]">
            <p className="text-sm text-[#4D4A4A] text-opacity-70">Total Employees</p>
            <p className="text-xl font-bold text-[#4A90E2]">{stats.totalEmployees}</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border border-[#E9E7E7]">
            <p className="text-sm text-[#4D4A4A] text-opacity-70">Avg Processing</p>
            <p className="text-xl font-bold text-[#FDA811]">{stats.avgProcessingTime} days</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border border-[#E9E7E7]">
            <p className="text-sm text-[#4D4A4A] text-opacity-70">Completion Rate</p>
            <p className="text-xl font-bold text-[#9C27B0]">{stats.completionRate}%</p>
          </div>
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
                  placeholder="Search businesses, owners, or barangays..."
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
                <option value="pending">Pending</option>
                <option value="compliance">For Compliance</option>
                <option value="rejected">Rejected</option>
              </select>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-4 py-2 rounded-lg border border-[#E9E7E7] bg-white text-[#4D4A4A] focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent font-poppins"
              >
                <option value="all">All Categories</option>
                {BUSINESS_CATEGORIES.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>

              <select
                value={sizeFilter}
                onChange={(e) => setSizeFilter(e.target.value)}
                className="px-4 py-2 rounded-lg border border-[#E9E7E7] bg-white text-[#4D4A4A] focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent font-poppins"
              >
                <option value="all">All Sizes</option>
                {BUSINESS_SIZE.map(size => (
                  <option key={size.value} value={size.value}>
                    {size.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Line Chart - Trends by Category */}
        <div className="lg:col-span-2 bg-white rounded-lg p-5 shadow-sm border border-[#E9E7E7]">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-[#4D4A4A] font-montserrat">Monthly Trends by Business Category</h3>
              <p className="text-sm text-[#4D4A4A] text-opacity-70">Applications for top business categories</p>
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

        {/* Donut Chart - Business Size Distribution */}
        <div className="bg-white rounded-lg p-5 shadow-sm border border-[#E9E7E7]">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-[#4D4A4A] font-montserrat">Business Size Distribution</h3>
            <p className="text-sm text-[#4D4A4A] text-opacity-70">By capital investment</p>
          </div>
          <div className="h-[250px] flex items-center justify-center">
            <Doughnut
              data={{
                labels: stats.sizeStats.map(s => s.label),
                datasets: [{
                  data: stats.sizeStats.map(s => s.count),
                  backgroundColor: stats.sizeStats.map(s => s.color),
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
            {stats.sizeStats.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-[#FBFBFB] rounded-lg border border-[#E9E7E7]">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full mr-3" style={{ backgroundColor: item.color }}></div>
                  <span className="text-sm text-[#4D4A4A] font-poppins">{item.label}</span>
                </div>
                <span className="font-semibold text-[#4D4A4A] font-montserrat">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bar Chart - Business Categories */}
      <div className="mb-6 bg-white rounded-lg p-5 shadow-sm border border-[#E9E7E7]">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-[#4D4A4A] font-montserrat">Applications by Business Category</h3>
            <p className="text-sm text-[#4D4A4A] text-opacity-70">Distribution across different business types</p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-[#4D4A4A] text-opacity-70">
              Showing top {topCategories.length} categories
            </span>
          </div>
        </div>
        <div className="h-[300px]">
          <Bar
            data={{
              labels: categoryData.labels,
              datasets: [
                {
                  label: "Applications",
                  data: categoryData.counts,
                  backgroundColor: categoryData.colors,
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
        
        {/* Category Summary Cards */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {topCategories.map((category, idx) => {
            const CategoryIcon = category.icon;
            return (
              <div 
                key={idx}
                className="p-3 rounded-lg border border-[#E9E7E7] hover:shadow transition-all"
                style={{ borderLeftColor: category.color, borderLeftWidth: '4px' }}
              >
                <div className="flex items-center mb-2">
                  <CategoryIcon className="w-5 h-5 mr-2" style={{ color: category.color }} />
                  <span className="text-sm font-medium text-[#4D4A4A] font-poppins truncate">
                    {category.label}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-[#4D4A4A] font-montserrat">
                    {category.count}
                  </span>
                  <span className="text-xs px-2 py-1 rounded-full bg-[#FBFBFB] text-[#4D4A4A]">
                    {category.approvalRate}% approved
                  </span>
                </div>
                <div className="mt-2 text-xs text-[#4D4A4A] text-opacity-70">
                  Capital: {category.totalCapital}
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
              <h3 className="text-lg font-semibold text-[#4D4A4A] font-montserrat">Business Permit Applications</h3>
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
                  App ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#4D4A4A] uppercase tracking-wider font-montserrat">
                  Business
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#4D4A4A] uppercase tracking-wider font-montserrat">
                  Owner
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#4D4A4A] uppercase tracking-wider font-montserrat">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#4D4A4A] uppercase tracking-wider font-montserrat">
                  Capital
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
                const statusInfo = getStatusText(permit.status);
                const StatusIcon = statusInfo.icon;
                const CategoryIcon = getCategoryIcon(permit.business_nature);
                const categoryInfo = BUSINESS_CATEGORIES.find(c => 
                  matchesCategory(permit.business_nature?.toLowerCase(), c.value)
                ) || BUSINESS_CATEGORIES[BUSINESS_CATEGORIES.length - 1];
                
                return (
                  <tr key={index} className="hover:bg-[#FBFBFB] transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-mono text-sm text-[#4D4A4A] font-medium">
                        {permit.applicant_id || `BP-${String(permit.permit_id).padStart(4, '0')}`}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-[#4D4A4A] font-montserrat">
                          {permit.business_name || "N/A"}
                        </p>
                        {permit.trade_name && (
                          <p className="text-sm text-[#4D4A4A] text-opacity-70 font-poppins">
                            Trade: {permit.trade_name}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-[#4D4A4A] font-poppins">
                          {permit.owner_last_name}, {permit.owner_first_name}
                        </p>
                        <p className="text-sm text-[#4D4A4A] text-opacity-70">
                          {permit.owner_type || "N/A"}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <CategoryIcon className="w-5 h-5 mr-3" style={{ color: categoryInfo.color }} />
                        <span className="text-[#4D4A4A] font-poppins truncate max-w-[150px]">
                          {permit.business_nature || "N/A"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-lg font-semibold text-[#4D4A4A] font-montserrat">
                        {formatCurrency(permit.capital_investment)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-[#4D4A4A] text-opacity-70 font-poppins">
                        {permit.application_date ? new Date(permit.application_date).toLocaleDateString() : "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`inline-flex items-center px-3 py-1.5 rounded-full ${statusInfo.bgColor} ${statusInfo.color}`}>
                        <StatusIcon className={`w-4 h-4 mr-2 ${statusInfo.color}`} />
                        <span className={`text-sm font-medium ${statusInfo.color} font-poppins`}>
                          {statusInfo.text}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => openModal(permit)}
                          title="View Details"
                          className="p-2 bg-[#4A90E2] text-white rounded-lg hover:bg-[#4A90E2]/80 transition-colors"
                        >
                          <Eye className="w-5 h-5" />
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
            <Building className="w-12 h-12 text-[#E9E7E7] mx-auto mb-4" />
            <p className="text-[#4D4A4A] text-opacity-70">No business permits match your filters</p>
            <button
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("all");
                setCategoryFilter("all");
                setSizeFilter("all");
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

      {/* Detailed View Modal */}
      {showModal && selectedPermit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/30 backdrop-blur-sm p-4 overflow-auto">
          <div className="w-full max-w-6xl bg-white rounded-xl shadow-2xl">
            {/* Modal Header */}
            <div className="p-6 border-b border-[#E9E7E7] bg-gradient-to-r from-[#4CAF50]/5 to-[#4A90E2]/5 rounded-t-xl">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-[#4D4A4A]">Business Permit Application</h2>
                  <p className="text-sm text-[#4D4A4A] text-opacity-70 mt-1">
                    Application ID: {selectedPermit.applicant_id} • Permit ID: BP-{String(selectedPermit.permit_id).padStart(4, '0')}
                  </p>
                  <span className={`mt-2 px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(selectedPermit.status)}`}>
                    {selectedPermit.uiStatus || getUIStatus(selectedPermit.status)}
                  </span>
                </div>
                <button 
                  onClick={closeModal}
                  className="p-2 bg-[#4CAF50] text-white rounded-lg hover:bg-[#FDA811] transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-semibold text-[#4D4A4A] mb-4">Applicant Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <label className="text-sm font-medium text-[#4D4A4A] text-opacity-70">Full Name</label>
                    <p className="text-lg font-semibold text-[#4D4A4A] mt-1">
                      {selectedPermit.owner_last_name}, {selectedPermit.owner_first_name} {selectedPermit.owner_middle_name}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-[#4D4A4A] text-opacity-70">Owner Type</label>
                    <p className="text-[#4D4A4A] mt-1">
                      {selectedPermit.owner_type || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-[#4D4A4A] text-opacity-70">Citizenship</label>
                    <p className="text-[#4D4A4A] mt-1">
                      {selectedPermit.citizenship || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-[#4D4A4A] text-opacity-70">Date of Birth</label>
                    <p className="text-[#4D4A4A] mt-1">
                      {selectedPermit.date_of_birth ? new Date(selectedPermit.date_of_birth).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-[#4D4A4A] text-opacity-70">Contact Number</label>
                    <p className="text-[#4D4A4A] mt-1">
                      {selectedPermit.contact_number || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-[#4D4A4A] text-opacity-70">Email Address</label>
                    <p className="text-[#4D4A4A] mt-1">
                      {selectedPermit.email_address || 'N/A'}
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-[#4D4A4A] text-opacity-70">Home Address</label>
                    <p className="text-[#4D4A4A] mt-1">
                      {selectedPermit.home_address || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-[#4D4A4A] text-opacity-70">Valid ID</label>
                    <p className="text-[#4D4A4A] mt-1">
                      {selectedPermit.valid_id_type || 'N/A'}: {selectedPermit.valid_id_number || 'N/A'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Business Information */}
              <div className="border-t border-[#E9E7E7] pt-6">
                <h3 className="text-lg font-semibold text-[#4D4A4A] mb-4">Business Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-[#4D4A4A] text-opacity-70">Business Name</label>
                    <p className="text-xl font-bold text-[#4CAF50] mt-1">
                      {selectedPermit.business_name || 'N/A'}
                    </p>
                    {selectedPermit.trade_name && (
                      <p className="text-sm text-[#4D4A4A] text-opacity-70 mt-1">
                        Trading as: {selectedPermit.trade_name}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-[#4D4A4A] text-opacity-70">Nature of Business</label>
                    <p className="text-[#4D4A4A] mt-1">
                      {selectedPermit.business_nature || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-[#4D4A4A] text-opacity-70">Building Type</label>
                    <p className="text-[#4D4A4A] mt-1">
                      {selectedPermit.building_type || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-[#4D4A4A] text-opacity-70">Capital Investment</label>
                    <p className="text-lg font-bold text-[#4D4A4A] mt-1">
                      {formatCurrency(selectedPermit.capital_investment)}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-[#4D4A4A] text-opacity-70">Business Area</label>
                    <p className="text-[#4D4A4A] mt-1">
                      {selectedPermit.business_area || '0'} sqm
                    </p>
                  </div>
                </div>
              </div>

              {/* Business Address */}
              <div className="border-t border-[#E9E7E7] pt-6">
                <h3 className="text-lg font-semibold text-[#4D4A4A] mb-4">Business Address</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <label className="text-sm font-medium text-[#4D4A4A] text-opacity-70">House/Building No.</label>
                    <p className="text-[#4D4A4A] mt-1">
                      {selectedPermit.house_bldg_no || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-[#4D4A4A] text-opacity-70">Street</label>
                    <p className="text-[#4D4A4A] mt-1">
                      {selectedPermit.street || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-[#4D4A4A] text-opacity-70">Barangay</label>
                    <p className="text-[#4D4A4A] mt-1">
                      {selectedPermit.barangay || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-[#4D4A4A] text-opacity-70">City/Municipality</label>
                    <p className="text-[#4D4A4A] mt-1">
                      {selectedPermit.city_municipality || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-[#4D4A4A] text-opacity-70">Province</label>
                    <p className="text-[#4D4A4A] mt-1">
                      {selectedPermit.province || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-[#4D4A4A] text-opacity-70">Zip Code</label>
                    <p className="text-[#4D4A4A] mt-1">
                      {selectedPermit.zip_code || 'N/A'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Operations Information */}
              <div className="border-t border-[#E9E7E7] pt-6">
                <h3 className="text-lg font-semibold text-[#4D4A4A] mb-4">Operations Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <label className="text-sm font-medium text-[#4D4A4A] text-opacity-70">Operation Hours</label>
                    <p className="text-[#4D4A4A] mt-1">
                      {formatTime(selectedPermit.operation_time_from)} - {formatTime(selectedPermit.operation_time_to)}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-[#4D4A4A] text-opacity-70">Operation Type</label>
                    <p className="text-[#4D4A4A] mt-1">
                      {selectedPermit.operation_type || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-[#4D4A4A] text-opacity-70">Total Employees</label>
                    <p className="text-[#4D4A4A] mt-1">
                      {selectedPermit.total_employees || '0'} ({selectedPermit.male_employees || '0'} male, {selectedPermit.female_employees || '0'} female)
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-[#4D4A4A] text-opacity-70">Employees in QC</label>
                    <p className="text-[#4D4A4A] mt-1">
                      {selectedPermit.employees_in_qc || '0'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-[#4D4A4A] text-opacity-70">Delivery Vehicles</label>
                    <p className="text-[#4D4A4A] mt-1">
                      Vans/Trucks: {selectedPermit.delivery_van_truck || '0'}, Motorcycles: {selectedPermit.delivery_motorcycle || '0'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-[#4D4A4A] text-opacity-70">Total Floor Area</label>
                    <p className="text-[#4D4A4A] mt-1">
                      {selectedPermit.total_floor_area || '0'} sqm
                    </p>
                  </div>
                </div>
              </div>

              {/* Documents Section */}
              <div className="border-t border-[#E9E7E7] pt-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-[#4D4A4A]">Submitted Documents</h3>
                  {selectedPermit.documents && (
                    <span className="text-sm text-[#4D4A4A] text-opacity-70">
                      {selectedPermit.documents.length} document{selectedPermit.documents.length !== 1 ? 's' : ''}
                    </span>
                  )}
                </div>
                
                {selectedPermit.documents && selectedPermit.documents.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedPermit.documents.map((doc, index) => {
                      const fileIcon = getFileIcon(doc.file_type, doc.document_name);
                      const FileIconComponent = fileIcon.icon;
                      const fileTypeName = getFileTypeName(doc.file_type, doc.document_name);
                      const fileExtension = getFileExtension(doc.document_name);
                      const isImage = isImageFile(doc.file_type, doc.document_name);
                      const displayName = doc.document_type ? doc.document_type.replace(/_/g, ' ') : 'Document';
                      
                      return (
                        <div 
                          key={index} 
                          className="flex items-center justify-between p-4 border border-[#E9E7E7] rounded-lg hover:bg-[#FBFBFB] transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            {/* File Type Icon */}
                            <div className={`p-3 rounded-lg ${fileIcon.bgColor} ${fileIcon.textColor}`}>
                              <FileIconComponent className="w-6 h-6" style={{ color: fileIcon.iconColor }} />
                            </div>
                            
                            {/* Document Info */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-sm font-medium text-[#4D4A4A] truncate">
                                  {displayName}
                                </span>
                                <span className={`text-xs px-2 py-0.5 rounded-full ${fileIcon.bgColor} ${fileIcon.textColor}`}>
                                  {fileExtension}
                                </span>
                              </div>
                              <div className="text-xs text-[#4D4A4A] text-opacity-70 truncate">
                                {doc.document_name || 'No filename'}
                              </div>
                              <div className="text-xs text-[#4D4A4A] text-opacity-50 mt-1">
                                {fileTypeName} • {(doc.file_size / 1024).toFixed(2)} KB
                              </div>
                              <div className="text-xs text-[#4D4A4A] text-opacity-50">
                                Uploaded: {doc.upload_date ? new Date(doc.upload_date).toLocaleDateString() : 'N/A'}
                              </div>
                            </div>
                          </div>
                          
                          {/* Action Buttons */}
                          <div className="flex flex-col gap-2">
                            {isImage ? (
                              <>
                                <button 
                                  onClick={() => viewFile(doc)}
                                  className="px-3 py-1.5 text-xs bg-[#4CAF50] text-white rounded-lg hover:bg-[#4CAF50]/80 transition-colors flex items-center justify-center gap-1 w-full min-w-[80px]"
                                  title="Preview image"
                                >
                                  <Eye className="w-4 h-4" />
                                  View
                                </button>
                                
                                <a 
                                  href={doc.file_path ? `${API_BASE}/${doc.file_path}` : '#'}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="px-3 py-1.5 text-xs bg-[#4A90E2] text-white rounded-lg hover:bg-[#4A90E2]/80 transition-colors flex items-center justify-center gap-1 w-full min-w-[80px] text-center"
                                  title="Download image"
                                  onClick={(e) => {
                                    if (!doc.file_path) {
                                      e.preventDefault();
                                      alert('Download link not available');
                                    }
                                  }}
                                >
                                  <Download className="w-4 h-4" />
                                  Download
                                </a>
                              </>
                            ) : (
                              <a 
                                href={doc.file_path ? `${API_BASE}/${doc.file_path}` : '#'}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-2 text-xs bg-[#4A90E2] text-white rounded-lg hover:bg-[#4A90E2]/80 transition-colors flex items-center justify-center gap-1 w-full min-w-[80px] text-center"
                                title="Download document"
                                onClick={(e) => {
                                  if (!doc.file_path) {
                                    e.preventDefault();
                                    alert('Download link not available');
                                  }
                                }}
                              >
                                <Download className="w-4 h-4 mr-1" />
                                Download
                              </a>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-[#FBFBFB] rounded-lg border border-[#E9E7E7]">
                    <FileTextIcon className="w-16 h-16 text-[#E9E7E7] mx-auto mb-4" />
                    <p className="text-[#4D4A4A] text-opacity-70">
                      No documents submitted for this application.
                    </p>
                  </div>
                )}
              </div>

              {/* Review Comments Section */}
              <div className="border-t border-[#E9E7E7] pt-6">
                <h3 className="text-lg font-semibold text-[#4D4A4A] mb-4">
                  Review Comments
                  {selectedPermit.comments && (
                    <span className="text-sm font-normal text-[#4D4A4A] text-opacity-70 ml-2">
                      ({formatComments(selectedPermit.comments).length} comment{formatComments(selectedPermit.comments).length !== 1 ? 's' : ''})
                    </span>
                  )}
                </h3>
                
                {/* Display all comments */}
                <div className="space-y-4 mb-6">
                  {selectedPermit.comments && selectedPermit.comments.trim() ? (
                    <div className="bg-[#FBFBFB] rounded-lg border border-[#E9E7E7] overflow-hidden">
                      <div className="max-h-64 overflow-y-auto p-4">
                        {formatComments(selectedPermit.comments).map((comment, index) => (
                          <div key={index} className={`mb-4 ${index !== 0 ? 'pt-4 border-t border-[#E9E7E7]' : ''}`}>
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center text-sm text-[#4D4A4A] text-opacity-70">
                                <User className="w-4 h-4 mr-2" />
                                Admin Comment
                              </div>
                              <div className="flex items-center text-xs text-[#4D4A4A] text-opacity-50">
                                <Clock className="w-3 h-3 mr-1" />
                                {comment.timestamp}
                              </div>
                            </div>
                            <div className="pl-6">
                              <p className="text-[#4D4A4A] bg-white p-3 rounded border border-[#E9E7E7]">
                                {comment.comment}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="px-4 py-3 bg-[#FBFBFB] border-t border-[#E9E7E7]">
                        <div className="text-xs text-[#4D4A4A] text-opacity-70">
                          Total: {formatComments(selectedPermit.comments).length} comment{formatComments(selectedPermit.comments).length !== 1 ? 's' : ''}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 bg-[#FBFBFB] rounded-lg border border-[#E9E7E7]">
                      <AlertCircle className="w-12 h-12 text-[#E9E7E7] mx-auto mb-3" />
                      <p className="text-[#4D4A4A] text-opacity-70">
                        No comments yet. Add your first comment below.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 justify-end pt-6 border-t border-[#E9E7E7]">
                <button 
                  onClick={closeModal}
                  className="px-6 py-3 bg-[#4D4A4A] text-white rounded-lg hover:bg-opacity-80 transition-colors font-medium"
                >
                  Close
                </button>
                
              </div>
            </div>
          </div>
        </div>
      )}

      {/* File Preview Modal */}
{showFilePreview && selectedFile && (
  <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-0">
    <div className="relative w-full h-full flex flex-col">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-20 p-4 flex justify-between items-center bg-gradient-to-b from-black/70 to-transparent">
        <div className="flex items-center gap-3 text-white">
          <div className="flex items-center gap-2">
            <Eye className="w-5 h-5" />
            <span className="text-sm font-medium truncate max-w-xs">
              {selectedFile.name}
            </span>
            <span className="text-xs text-gray-300">
              {getFileTypeName(selectedFile.file_type, selectedFile.name)}
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <a 
            href={selectedFile.url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm flex items-center gap-1.5 transition-colors"
            download
          >
            <Download className="w-4 h-4" />
            Download
          </a>
          <button 
            onClick={closeFilePreview}
            className="ml-2 p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
            title="Close preview"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Image Content */}
      {isImageFile(selectedFile.file_type, selectedFile.name) ? (
        <div className="flex-1 flex items-center justify-center p-4">
          <img 
            src={selectedFile.url} 
            alt={selectedFile.name}
            className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="400" height="300" fill="%23222222"/><text x="200" y="150" text-anchor="middle" font-family="Arial" font-size="16" fill="%23ffffff">Image preview not available</text></svg>';
            }}
          />
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center max-w-md bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            {(() => {
              const fileIcon = getFileIcon(selectedFile.file_type, selectedFile.name);
              const FileIconComponent = fileIcon.icon;
              return (
                <div className="text-gray-300 mb-6">
                  <FileIconComponent className="w-24 h-24 mx-auto" style={{ color: fileIcon.iconColor }} />
                </div>
              );
            })()}
            <h3 className="text-xl font-medium text-white mb-3">
              {getFileTypeName(selectedFile.file_type, selectedFile.name)}
            </h3>
            <p className="text-gray-300 mb-6">
              This file cannot be previewed in browser.
            </p>
            <div className="flex gap-3 justify-center">
              <a 
                href={selectedFile.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                download
              >
                <Download className="w-5 h-5 mr-2" />
                Download
              </a>
              <button 
                onClick={closeFilePreview}
                className="inline-flex items-center justify-center px-5 py-2.5 border border-white/30 text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer Info */}
      <div className="absolute bottom-0 left-0 right-0 z-20 p-4 flex justify-between items-center text-white/60 text-sm">
        <div>
          <span className="hidden sm:inline">Press </span>
          <kbd className="px-2 py-1 bg-black/40 rounded text-xs mx-1">ESC</kbd>
          <span className="hidden sm:inline"> to close</span>
        </div>
      </div>

      {/* Close on background click */}
      <div 
        className="absolute inset-0 -z-10 cursor-pointer"
        onClick={closeFilePreview}
      />
    </div>
  </div>
)}
      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white rounded-xl shadow-2xl p-6 transform transition-all">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              
              <h3 className="text-lg font-semibold text-[#4D4A4A] mb-2">
                Success!
              </h3>
              <p className="text-[#4D4A4A] text-opacity-70 mb-6">
                {successMessage}
              </p>
              
              <div className="flex justify-center space-x-3">
                <button
                  onClick={() => {
                    setShowSuccessModal(false);
                    setSuccessMessage('');
                  }}
                  className="px-6 py-2 bg-[#4CAF50] text-white rounded-lg hover:bg-[#4CAF50]/80 transition-colors font-medium flex items-center"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Continue
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}