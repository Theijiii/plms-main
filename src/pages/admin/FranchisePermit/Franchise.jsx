import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import Swal from "sweetalert2";
import { Bar, Doughnut, Line } from "react-chartjs-2";
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
  RefreshCw,
  Eye,
  Printer,
  DownloadCloud,
  TrendingDown,
  User,
  Car,
  Phone,
  Mail,
  CalendarDays,
  Route,
  ShieldCheck,
  Users,
  MoreVertical,
  Home,
  MapPin,
  Tag,
  Building,
  Hash,
  FileType,
  Image as ImageIcon,
  File,
  ChevronRight,
  X,
  MessageSquare
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

// Helper functions for file preview
const isImageFile = (fileType, fileName) => {
  if (fileType) {
    return fileType.startsWith('image/');
  }
  if (fileName) {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg'];
    return imageExtensions.some(ext => fileName.toLowerCase().endsWith(ext));
  }
  return false;
};

const getFileTypeName = (fileType, fileName) => {
  if (fileType) {
    if (fileType === 'application/pdf') return 'PDF Document';
    if (fileType.startsWith('image/')) {
      const format = fileType.split('/')[1].toUpperCase();
      return `${format} Image`;
    }
    if (fileType.startsWith('application/')) {
      if (fileType.includes('word')) return 'Word Document';
      if (fileType.includes('excel')) return 'Excel Spreadsheet';
      if (fileType.includes('zip')) return 'ZIP Archive';
      if (fileType.includes('rar')) return 'RAR Archive';
    }
    if (fileType.startsWith('text/')) {
      if (fileType.includes('csv')) return 'CSV File';
      return 'Text File';
    }
  }
  
  // Fallback based on file extension
  if (fileName) {
    const ext = fileName.split('.').pop().toLowerCase();
    switch (ext) {
      case 'pdf': return 'PDF Document';
      case 'jpg':
      case 'jpeg': return 'JPEG Image';
      case 'png': return 'PNG Image';
      case 'gif': return 'GIF Image';
      case 'bmp': return 'BMP Image';
      case 'webp': return 'WebP Image';
      case 'doc':
      case 'docx': return 'Word Document';
      case 'txt': return 'Text File';
      case 'csv': return 'CSV File';
      case 'xls':
      case 'xlsx': return 'Excel Spreadsheet';
      case 'zip': return 'ZIP Archive';
      case 'rar': return 'RAR Archive';
      default: return 'File';
    }
  }
  
  return 'File';
};

export default function FranchiseDashboard() {
  const [franchises, setFranchises] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFranchise, setSelectedFranchise] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const [statusFilter, setStatusFilter] = useState("all");
  const [permitSubtypeFilter, setPermitSubtypeFilter] = useState("all");
  const [permitTypeFilter, setPermitTypeFilter] = useState("all");
  const [exporting, setExporting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    under_review: 0,
    mtop: 0,
    franchise: 0,
    new: 0,
    renewal: 0
  });
  
  // File preview state
  const [selectedFile, setSelectedFile] = useState(null);
  const [showFilePreview, setShowFilePreview] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [showSubmittedDocs, setShowSubmittedDocs] = useState(false);
  const [actionComment, setActionComment] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  const imageRef = useRef(null);
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const imagePositionRef = useRef({ x: 0, y: 0 });
  
  const ITEMS_PER_PAGE = 8;
  const API_FRANCHISE = "/backend/franchise_permit";

  // Status mapping functions
  const mapStatusToFrontend = (status) => {
    if (!status) return 'For Compliance';
    const statusMap = {
      'pending': 'For Compliance',
      'under_review': 'For Compliance',
      'approved': 'Approved',
      'rejected': 'Rejected'
    };
    return statusMap[status.toLowerCase()] || 'For Compliance';
  };

  const mapStatusToBackend = (status) => {
    const statusMap = {
      'For Compliance': 'pending',
      'Approved': 'approved',
      'Rejected': 'rejected'
    };
    return statusMap[status] || 'pending';
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (e) {
      return 'N/A';
    }
  };

  // Format date with time for comments
  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return 'N/A';
    }
  };

  // Fetch franchises from API
  const fetchFranchises = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Build query parameters
      const params = new URLSearchParams({
        page: currentPage,
        limit: ITEMS_PER_PAGE
      });
      
      // Add filters if not "all"
      if (statusFilter !== "all") {
        params.append('status', statusFilter);
      }
      
      if (permitSubtypeFilter !== "all") {
        params.append('permit_subtype', permitSubtypeFilter.toUpperCase());
      }
      
      if (permitTypeFilter !== "all") {
        params.append('permit_type', permitTypeFilter.toUpperCase());
      }
      
      if (searchTerm.trim()) {
        params.append('search', searchTerm.trim());
      }
      
      const url = `${API_FRANCHISE}/admin_fetch.php?${params}`;
      
      // Fetch data
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        // Transform API data to match frontend expectations
        const transformedData = data.data.map((franchise) => {
          const fullName = `${franchise.first_name || ''} ${franchise.middle_initial ? franchise.middle_initial + '.' : ''} ${franchise.last_name || ''}`.trim();
          
          return {
            id: `FP-${String(franchise.application_id).padStart(4, '0')}`,
            application_id: franchise.application_id,
            type: franchise.permit_type === "RENEWAL" ? "Renewal" : "New",
            permit_type: franchise.permit_type || 'NEW',
            permit_subtype: franchise.permit_subtype || 'FRANCHISE',
            application_date: franchise.created_at,
            created_at: franchise.created_at,
            full_name: fullName || 'N/A',
            contact_number: franchise.contact_number || 'N/A',
            email: franchise.email || 'N/A',
            home_address: franchise.home_address || 'N/A',
            make_brand: franchise.make_brand || 'N/A',
            model: franchise.model || 'N/A',
            route_zone: franchise.route_zone || 'N/A',
            toda_name: franchise.toda_name || 'N/A',
            barangay_of_operation: franchise.barangay_of_operation || 'N/A',
            status: mapStatusToFrontend(franchise.status),
            plate_number: franchise.plate_number || 'N/A',
            year_acquired: franchise.year_acquired || 'N/A',
            color: franchise.color || 'N/A',
            vehicle_type: franchise.vehicle_type || 'Tricycle',
            lto_or_number: franchise.lto_or_number || 'N/A',
            lto_cr_number: franchise.lto_cr_number || 'N/A',
            engine_number: franchise.engine_number || 'N/A',
            chassis_number: franchise.chassis_number || 'N/A',
            district: franchise.district || 'N/A',
            remarks: franchise.remarks || '',
            // Additional fields from backend
            operator_type: franchise.operator_type || 'N/A',
            citizenship: franchise.citizenship || 'N/A',
            birth_date: franchise.birth_date || 'N/A',
            id_type: franchise.id_type || 'N/A',
            id_number: franchise.id_number || 'N/A',
            lto_expiration_date: franchise.lto_expiration_date || 'N/A',
            mv_file_number: franchise.mv_file_number || 'N/A',
            franchise_fee_or: franchise.franchise_fee_or || 'N/A',
            sticker_id_fee_or: franchise.sticker_id_fee_or || 'N/A',
            inspection_fee_or: franchise.inspection_fee_or || 'N/A',
            date_submitted: franchise.date_submitted || franchise.created_at,
            attachments: franchise.attachments || ''
          };
        });
        
        setFranchises(transformedData);
        
        // Set stats from API response
        if (data.stats && data.stats.overall) {
          setStats({
            total: data.stats.overall.total || 0,
            pending: data.stats.overall.pending || 0,
            approved: data.stats.overall.approved || 0,
            rejected: data.stats.overall.rejected || 0,
            under_review: data.stats.overall.under_review || 0,
            mtop: data.stats.overall.mtop || 0,
            franchise: data.stats.overall.franchise || 0,
            new: data.stats.overall.new || 0,
            renewal: data.stats.overall.renewal || 0
          });
        }
        
        setError(null);
        
      } else {
        throw new Error(data.message || "Failed to fetch data from server");
      }
      
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(`Failed to load data: ${err.message}`);
      setFranchises([]);
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount and when filters change
  useEffect(() => {
    fetchFranchises();
  }, [currentPage, statusFilter, permitSubtypeFilter, permitTypeFilter]);

  // Filter logic
  const filteredFranchises = useMemo(() => {
    let filtered = [...franchises];

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(f => 
        f.full_name?.toLowerCase().includes(term) ||
        f.plate_number?.toLowerCase().includes(term) ||
        f.toda_name?.toLowerCase().includes(term) ||
        f.barangay_of_operation?.toLowerCase().includes(term) ||
        f.application_id?.toString().includes(term) ||
        f.email?.toLowerCase().includes(term)
      );
    }

    // Tab filter
    if (activeTab !== "all") {
      filtered = filtered.filter(f => 
        f.permit_subtype?.toLowerCase() === activeTab.toLowerCase()
      );
    }

    // Date range filter
    if (startDate && endDate) {
      filtered = filtered.filter(f => {
        if (!f.created_at) return false;
        const franchiseDate = new Date(f.created_at);
        return franchiseDate >= startDate && franchiseDate <= endDate;
      });
    }

    return filtered;
  }, [franchises, activeTab, searchTerm, startDate, endDate]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredFranchises.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedFranchises = filteredFranchises.slice(startIndex, endIndex);

  // Calculate dashboard stats with trends
  const dashboardStats = useMemo(() => {
    const total = stats.total;
    const approved = stats.approved;
    const pending = stats.pending + stats.under_review; // Combine pending and under_review
    const rejected = stats.rejected;
    
    const approvalRate = total > 0 ? ((approved / total) * 100).toFixed(1) : 0;
    const completionRate = total > 0 ? (((approved + rejected) / total) * 100).toFixed(1) : 0;
    
    // Get top TODA from actual data
    const todaCounts = {};
    franchises.forEach(f => {
      const toda = f.toda_name || 'Unknown';
      if (toda !== 'N/A' && toda) {
        todaCounts[toda] = (todaCounts[toda] || 0) + 1;
      }
    });
    const topTODA = Object.entries(todaCounts)
      .sort(([,a], [,b]) => b - a)[0] || ['No TODA data', 0];

    // Calculate trend (mock for now)
    const lastWeekCount = Math.floor(total * 0.8);
    const trend = total > 0 ? ((total - lastWeekCount) / lastWeekCount * 100).toFixed(1) : 0;
    
    return {
      total,
      approved,
      pending,
      rejected,
      approvalRate,
      completionRate,
      trend,
      topTODA: { name: topTODA[0], count: topTODA[1] }
    };
  }, [stats, franchises]);

  // Chart data - Applications by TODA
  const barChartData = useMemo(() => {
    const todas = [...new Set(franchises.map(f => f.toda_name).filter(t => t && t !== 'N/A'))];
    const topTODAs = todas.slice(0, 6);
    
    return {
      labels: topTODAs.length > 0 ? topTODAs : ['No TODA Data'],
      datasets: [{
        label: "Applications",
        data: topTODAs.length > 0 
          ? topTODAs.map(toda => franchises.filter(f => f.toda_name === toda).length)
          : [0],
        backgroundColor: ["#4CAF50", "#4A90E2", "#FDA811", "#9C27B0", "#E53935", "#795548"],
        borderRadius: 6,
        borderWidth: 1,
        borderColor: "#E9E7E7",
      }]
    };
  }, [franchises]);

  // Status Distribution Chart
  const pieChartData = useMemo(() => ({
    labels: ["Approved", "For Compliance", "Rejected"],
    datasets: [{
      data: [
        stats.approved || 0,
        (stats.pending + stats.under_review) || 0,
        stats.rejected || 0
      ],
      backgroundColor: [
        'rgba(76, 175, 80, 0.8)',
        'rgba(253, 168, 17, 0.8)',
        'rgba(229, 57, 53, 0.8)'
      ],
      borderColor: '#FBFBFB',
      borderWidth: 2,
    }]
  }), [stats]);

  // Monthly trends data
  const monthlyData = useMemo(() => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    // Get data for last 6 months
    const last6Months = months.slice(Math.max(0, currentMonth - 5), currentMonth + 1);
    
    // Get permit types
    const permitTypes = ["MTOP", "FRANCHISE"];
    
    // Initialize monthly counts
    const monthlyCounts = {};
    permitTypes.forEach(type => {
      monthlyCounts[type] = Array(last6Months.length).fill(0);
    });
    
    // Count permits per month
    franchises.forEach(franchise => {
      if (!franchise.created_at) return;
      
      const franchiseDate = new Date(franchise.created_at);
      const monthIndex = franchiseDate.getMonth();
      const year = franchiseDate.getFullYear();
      
      if (year === currentYear && monthIndex <= currentMonth && monthIndex >= currentMonth - 5) {
        const monthInRange = monthIndex - (currentMonth - 5);
        if (monthInRange >= 0) {
          const type = franchise.permit_subtype || "";
          if (monthlyCounts[type]) {
            monthlyCounts[type][monthInRange]++;
          }
        }
      }
    });
    
    const colors = ["#4CAF50", "#4A90E2"];
    return {
      labels: last6Months,
      datasets: permitTypes.map((type, idx) => ({
        label: type,
        data: monthlyCounts[type] || Array(last6Months.length).fill(0),
        borderColor: colors[idx],
        backgroundColor: colors[idx] + "20",
        fill: true,
        tension: 0.4
      }))
    };
  }, [franchises]);

  // Status colors - matching Barangay Permit design
  const getStatusColor = (status) => {
    switch (status) {
      case "Approved":
        return {
          text: "text-[#4CAF50]",
          icon: CheckCircle,
          badge: "text-[#4CAF50] bg-[#4CAF50]/10"
        };
      case "Rejected":
        return {
          text: "text-[#E53935]",
          icon: XCircle,
          badge: "text-[#E53935] bg-[#E53935]/10"
        };
      case "For Compliance":
        return {
          text: "text-[#FDA811]",
          icon: AlertCircle,
          badge: "text-[#FDA811] bg-[#FDA811]/10"
        };
      default:
        return {
          text: "text-[#4D4A4A]",
          icon: AlertCircle,
          badge: "text-gray-600 bg-gray-100"
        };
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "MTOP":
        return { bg: "bg-purple-100", text: "text-purple-800" };
      case "FRANCHISE":
        return { bg: "bg-orange-100", text: "text-orange-800" };
      default:
        return { bg: "bg-gray-100", text: "text-gray-800" };
    }
  };

  const getPermitTypeColor = (type) => {
    switch (type) {
      case "NEW":
        return { bg: "bg-blue-100", text: "text-blue-800" };
      case "RENEWAL":
        return { bg: "bg-green-100", text: "text-green-800" };
      default:
        return { bg: "bg-gray-100", text: "text-gray-800" };
    }
  };

  // Tab categories
  const tabCategories = [
    { key: "all", label: "All Applications" },
    { key: "mtop", label: "MTOP Applications" },
    { key: "franchise", label: "Franchise Applications" },
  ];

  // Count by type
  const countByType = {
    all: franchises.length,
    mtop: franchises.filter(f => f.permit_subtype === "MTOP").length,
    franchise: franchises.filter(f => f.permit_subtype === "FRANCHISE").length
  };

  // Parse attachments from franchise data
  const parseAttachments = (franchiseData) => {
    if (!franchiseData) return [];
    
    try {
      const fileList = [];
      const applicationId = franchiseData.application_id || franchiseData.id?.replace('FP-', '');
      
      // List of all possible file fields
      const fileFields = [
        'proof_of_residency',
        'barangay_clearance',
        'lto_or_cr',
        'insurance_certificate',
        'drivers_license',
        'emission_test',
        'id_picture',
        'official_receipt',
        'nbi_clearance',
        'police_clearance',
        'medical_certificate',
        'toda_endorsement',
        'toda_president_cert',
        'franchise_fee_receipt',
        'sticker_id_fee_receipt',
        'inspection_fee_receipt',
        'applicant_signature'
      ];
      
      fileFields.forEach(field => {
        const fileName = franchiseData[field];
        if (fileName && fileName.trim() !== '') {
          const fileUrl = `${API_FRANCHISE}/uploads/${applicationId}/${fileName}`;
          
          fileList.push({
            id: field,
            name: fileName,
            type: getFileType(fileName),
            url: fileUrl,
            field_name: field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
          });
        }
      });
      
      return fileList;
    } catch (e) {
      console.error('Error parsing attachments:', e);
      return [];
    }
  };

  const getFileType = (filename) => {
    if (!filename || typeof filename !== 'string') return 'application/octet-stream';
    
    const ext = filename.split('.').pop().toLowerCase();
    switch (ext) {
      case 'pdf': return 'application/pdf';
      case 'jpg':
      case 'jpeg': return 'image/jpeg';
      case 'png': return 'image/png';
      case 'gif': return 'image/gif';
      case 'bmp': return 'image/bmp';
      case 'webp': return 'image/webp';
      case 'doc':
      case 'docx': return 'application/msword';
      case 'txt': return 'text/plain';
      case 'csv': return 'text/csv';
      case 'xls':
      case 'xlsx': return 'application/vnd.ms-excel';
      case 'zip': return 'application/zip';
      case 'rar': return 'application/x-rar-compressed';
      default: return 'application/octet-stream';
    }
  };

  // Format comments for display
  const formatComments = (commentsText) => {
    if (!commentsText || typeof commentsText !== 'string') return [];
    
    try {
      const cleanedText = commentsText.trim();
      if (!cleanedText) return [];
      
      const commentBlocks = cleanedText.split(/(?=---\s+.+?\s+---)/g);
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

  // Save comment only
  const saveCommentOnly = async () => {
    if (!selectedFranchise || !actionComment.trim()) return;
    
    try {
      const response = await fetch(`${API_FRANCHISE}/update_status.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          application_id: selectedFranchise.application_id,
          remarks: actionComment,
          updated_by: 'Admin'
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        const now = new Date();
        const timestamp = now.toLocaleString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true
        });
        
        const newCommentBlock = `--- ${timestamp} (Admin) ---\n${actionComment}\n\n`;
        
        const updatedRemarks = result.data?.remarks || 
          (selectedFranchise.remarks ? 
            newCommentBlock + selectedFranchise.remarks : 
            newCommentBlock);

        setSelectedFranchise({
          ...selectedFranchise,
          remarks: updatedRemarks
        });

        setSuccessMessage('Comment saved successfully!');
        setShowSuccessModal(true);
        setActionComment('');
      } else {
        throw new Error(result.message || 'Failed to save comment');
      }
    } catch (err) {
      console.error('Error saving comment:', err);
      Swal.fire('Error', 'Failed to save comment: ' + err.message, 'error');
    }
  };

  // View franchise details
  const handleView = async (id) => {
    try {
      const franchise = franchises.find(f => f.id === id);
      if (franchise) {
        // Fetch detailed data from API
        const response = await fetch(`${API_FRANCHISE}/fetch_single.php?application_id=${franchise.application_id}`);
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data) {
            const attachments = parseAttachments(data.data);
            
            setSelectedFranchise({
              ...franchise,
              ...data.data,
              // Ensure all required fields are present
              email_address: data.data.email || franchise.email,
              address: data.data.home_address || franchise.home_address || 'N/A',
              year_model: data.data.year_acquired || franchise.year_acquired,
              vehicle_color: data.data.color || franchise.color,
              or_number: data.data.lto_or_number || franchise.lto_or_number,
              cr_number: data.data.lto_cr_number || franchise.lto_cr_number,
              driver_license: data.data.id_number || franchise.id_number || 'N/A',
              franchise_number: id,
              date_applied: formatDate(data.data.date_submitted || franchise.created_at),
              attachments: attachments,
              status: mapStatusToFrontend(data.data.status),
              remarks: data.data.remarks || franchise.remarks
            });
          } else {
            // Use basic data if detailed fetch fails
            const attachments = parseAttachments(franchise);
            setSelectedFranchise({
              ...franchise,
              email_address: franchise.email,
              address: franchise.home_address || 'N/A',
              year_model: franchise.year_acquired,
              vehicle_color: franchise.color,
              or_number: franchise.lto_or_number,
              cr_number: franchise.lto_cr_number,
              driver_license: franchise.id_number || 'N/A',
              franchise_number: id,
              date_applied: formatDate(franchise.created_at),
              attachments: attachments,
              remarks: franchise.remarks || ''
            });
          }
        } else {
          // Use basic data if API call fails
          const attachments = parseAttachments(franchise);
          setSelectedFranchise({
            ...franchise,
            email_address: franchise.email,
            address: franchise.home_address || 'N/A',
            year_model: franchise.year_acquired,
            vehicle_color: franchise.color,
            or_number: franchise.lto_or_number,
            cr_number: franchise.lto_cr_number,
            driver_license: franchise.id_number || 'N/A',
            franchise_number: id,
            date_applied: formatDate(franchise.created_at),
            attachments: attachments,
            remarks: franchise.remarks || ''
          });
        }
        setIsModalOpen(true);
      }
    } catch (err) {
      console.error('Error viewing franchise:', err);
      const franchise = franchises.find(f => f.id === id);
      if (franchise) {
        const attachments = parseAttachments(franchise);
        setSelectedFranchise({
          ...franchise,
          email_address: franchise.email,
          address: franchise.home_address || 'N/A',
          year_model: franchise.year_acquired,
          vehicle_color: franchise.color,
          or_number: franchise.lto_or_number,
          cr_number: franchise.lto_cr_number,
          driver_license: franchise.id_number || 'N/A',
          franchise_number: id,
          date_applied: formatDate(franchise.created_at),
          attachments: attachments,
          remarks: franchise.remarks || ''
        });
        setIsModalOpen(true);
      }
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedFranchise(null);
    setActionComment('');
    setSelectedFile(null);
    setShowFilePreview(false);
    setShowSubmittedDocs(false);
  };

  // Handle status update
  const handleStatusUpdate = async (status, remarks = '') => {
    if (!selectedFranchise) return;
    
    try {
      const backendStatus = mapStatusToBackend(status);
      const commentToSave = remarks || actionComment;
      
      const response = await fetch(`${API_FRANCHISE}/update_status.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          application_id: selectedFranchise.application_id,
          status: backendStatus,
          remarks: commentToSave,
          updated_by: 'Admin'
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSuccessMessage(`Permit ${status.toLowerCase()} successfully!`);
        setShowSuccessModal(true);
        
        // Refresh the data
        await fetchFranchises();
        
        // Update selected franchise
        setSelectedFranchise(prev => ({
          ...prev,
          status: status,
          remarks: data.data?.remarks || prev.remarks
        }));
        
        setActionComment('');
      } else {
        Swal.fire('Error', data.message || 'Failed to update status', 'error');
      }
    } catch (err) {
      console.error('Error updating status:', err);
      Swal.fire('Error', 'Failed to update status. Please try again.', 'error');
    }
  };

  // Export to CSV
  const exportToCSV = () => {
    setExporting(true);
    
    const headers = [
      "Application ID",
      "Applicant Name",
      "Permit Type",
      "Permit Subtype", 
      "TODA",
      "Barangay",
      "Vehicle",
      "Plate Number",
      "Status",
      "Contact",
      "Email",
      "Application Date"
    ];
    
    const csvContent = [
      headers.join(","),
      ...franchises.map(f => [
        f.id,
        f.full_name,
        f.permit_type,
        f.permit_subtype,
        f.toda_name,
        f.barangay_of_operation,
        `${f.make_brand} ${f.model}`,
        f.plate_number,
        f.status,
        f.contact_number,
        f.email,
        formatDate(f.created_at)
      ].map(field => `"${field || ''}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `franchise-permits-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    setExporting(false);
  };

  // Handle search with debounce
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setPermitSubtypeFilter("all");
    setPermitTypeFilter("all");
    setDateRange([null, null]);
    setCurrentPage(1);
  };

  // File preview functions
  const updateZoomLevel = useCallback(() => {
    if (imageRef.current) {
      const currentTransform = imageRef.current.style.transform || 'scale(1)';
      const currentScale = parseFloat(currentTransform.match(/scale\(([^)]+)\)/)?.[1] || 1);
      setZoomLevel(Math.round(currentScale * 100));
    }
  }, []);

  // Handle ESC key press to close file preview
  useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === 'Escape' && showFilePreview) {
        closeFilePreview();
      }
    };

    window.addEventListener('keydown', handleEscKey);
    return () => {
      window.removeEventListener('keydown', handleEscKey);
    };
  }, [showFilePreview]);

  // Reset image position when file changes
  useEffect(() => {
    if (selectedFile && imageRef.current) {
      imageRef.current.style.transform = 'scale(1)';
      imageRef.current.style.left = '0px';
      imageRef.current.style.top = '0px';
      imageRef.current.style.cursor = 'default';
      setZoomLevel(100);
      imagePositionRef.current = { x: 0, y: 0 };
    }
  }, [selectedFile]);

  // Handle wheel event for zooming
  const handleWheel = useCallback((e) => {
    if (!imageRef.current || !isImageFile(selectedFile?.file_type, selectedFile?.name)) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    if (e.deltaY !== 0) {
      const currentTransform = imageRef.current.style.transform || 'scale(1)';
      const currentScale = parseFloat(currentTransform.match(/scale\(([^)]+)\)/)?.[1] || 1);
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      const newScale = Math.max(0.5, Math.min(currentScale + delta, 5));
      imageRef.current.style.transform = `scale(${newScale})`;
      imageRef.current.style.cursor = newScale > 1 ? 'grab' : 'default';
      updateZoomLevel();
    }
  }, [selectedFile, updateZoomLevel]);

  // Handle mouse down for dragging
  const handleMouseDown = useCallback((e) => {
    if (!imageRef.current || !isImageFile(selectedFile?.file_type, selectedFile?.name)) return;
    
    const currentTransform = imageRef.current.style.transform || 'scale(1)';
    const currentScale = parseFloat(currentTransform.match(/scale\(([^)]+)\)/)?.[1] || 1);
    
    if (currentScale > 1) {
      e.preventDefault();
      isDraggingRef.current = true;
      dragStartRef.current = { x: e.clientX, y: e.clientY };
      imageRef.current.style.cursor = 'grabbing';
      
      // Add event listeners for dragging
      const handleMouseMove = (moveEvent) => {
        if (!isDraggingRef.current || !imageRef.current) return;
        
        const deltaX = moveEvent.clientX - dragStartRef.current.x;
        const deltaY = moveEvent.clientY - dragStartRef.current.y;
        
        const newX = imagePositionRef.current.x + deltaX;
        const newY = imagePositionRef.current.y + deltaY;
        
        imageRef.current.style.left = `${newX}px`;
        imageRef.current.style.top = `${newY}px`;
      };
      
      const handleMouseUp = () => {
        if (!imageRef.current) return;
        
        isDraggingRef.current = false;
        imageRef.current.style.cursor = 'grab';
        
        // Update the stored position
        if (imageRef.current.style.left && imageRef.current.style.top) {
          imagePositionRef.current.x = parseFloat(imageRef.current.style.left);
          imagePositionRef.current.y = parseFloat(imageRef.current.style.top);
        }
        
        // Remove event listeners
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
      
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
  }, [selectedFile]);

  // Handle zoom controls
  const handleZoomIn = useCallback(() => {
    if (!imageRef.current) return;
    
    const currentTransform = imageRef.current.style.transform || 'scale(1)';
    const currentScale = parseFloat(currentTransform.match(/scale\(([^)]+)\)/)?.[1] || 1);
    const newScale = Math.min(currentScale + 0.25, 5);
    imageRef.current.style.transform = `scale(${newScale})`;
    imageRef.current.style.cursor = newScale > 1 ? 'grab' : 'default';
    updateZoomLevel();
  }, [updateZoomLevel]);

  const handleZoomOut = useCallback(() => {
    if (!imageRef.current) return;
    
    const currentTransform = imageRef.current.style.transform || 'scale(1)';
    const currentScale = parseFloat(currentTransform.match(/scale\(([^)]+)\)/)?.[1] || 1);
    const newScale = Math.max(currentScale - 0.25, 0.5);
    imageRef.current.style.transform = `scale(${newScale})`;
    imageRef.current.style.cursor = newScale > 1 ? 'grab' : 'default';
    updateZoomLevel();
  }, [updateZoomLevel]);

  const handleResetZoom = useCallback(() => {
    if (!imageRef.current) return;
    
    imageRef.current.style.transform = 'scale(1)';
    imageRef.current.style.left = '0px';
    imageRef.current.style.top = '0px';
    imageRef.current.style.cursor = 'default';
    setZoomLevel(100);
    imagePositionRef.current = { x: 0, y: 0 };
  }, []);

  // View file function
  const viewFile = (file) => {
    console.log('Viewing file:', file);
    
    let fileUrl = file.url;
    
    // If URL doesn't start with http, prepend the base URL
    if (file.url && !file.url.startsWith('http')) {
      fileUrl = `${API_FRANCHISE}/${file.url}`;
    }
    
    const fileWithType = {
      ...file,
      file_type: file.type || getFileType(file.name),
      url: fileUrl
    };
    
    setSelectedFile(fileWithType);
    setShowFilePreview(true);
  };

  // Close file preview
  const closeFilePreview = () => {
    setSelectedFile(null);
    setShowFilePreview(false);
    setZoomLevel(100);
    isDraggingRef.current = false;
    dragStartRef.current = { x: 0, y: 0 };
    imagePositionRef.current = { x: 0, y: 0 };
  };

  // Toggle submitted documents view
  const toggleSubmittedDocs = () => {
    setShowSubmittedDocs(!showSubmittedDocs);
  };

  // Action handlers
  const handleApprove = async () => {
    if (!selectedFranchise) return;
    await handleStatusUpdate('Approved', actionComment);
  };

  const handleReject = async () => {
    if (!selectedFranchise) return;
    await handleStatusUpdate('Rejected', actionComment);
  };

  const handleForCompliance = async () => {
    if (!selectedFranchise) return;
    await handleStatusUpdate('For Compliance', actionComment);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FBFBFB] p-6 flex items-center justify-center font-poppins">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4CAF50] mx-auto"></div>
          <p className="mt-4 text-[#4D4A4A]">Loading franchise analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FBFBFB] p-4 md:p-6 font-poppins">
      {/* Error Banner */}
      {error && (
        <div className="mb-6 p-4 bg-[#E53935] bg-opacity-20 border border-[#E53935] border-opacity-30 rounded-lg">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-[#E53935] mr-3" />
            <div className="flex-1">
              <p className="text-[#4D4A4A] font-poppins">{error}</p>
            </div>
            <button
              onClick={fetchFranchises}
              className="text-sm text-[#4CAF50] hover:underline"
            >
              Retry Connection
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#4D4A4A] font-montserrat">
              Franchise Permit Analytics
            </h1>
            <p className="text-[#4D4A4A] text-opacity-70 mt-2">
              Track and analyze tricycle franchise applications and renewals
            </p>
            {franchises.length > 0 && (
              <p className="text-sm text-[#4CAF50] mt-1">
                {franchises.length} applications loaded
              </p>
            )}
          </div>
          <div className="flex items-center space-x-3 mt-4 md:mt-0">
            <button
              onClick={fetchFranchises}
              className="p-2 rounded-lg bg-white border border-[#E9E7E7] hover:bg-gray-50 transition-colors"
              title="Refresh Data"
            >
              <RefreshCw className="w-5 h-5 text-[#4D4A4A]" />
            </button>
            <button
              onClick={exportToCSV}
              disabled={exporting || franchises.length === 0}
              className="px-4 py-2 bg-[#4CAF50] text-white rounded-lg hover:bg-opacity-90 transition-colors flex items-center space-x-2 disabled:opacity-50 font-montserrat"
            >
              <DownloadCloud className="w-5 h-5" />
              <span>{exporting ? "Exporting..." : "Export Report"}</span>
            </button>
          </div>
        </div>

        {/* Quick Stats Cards - Matching Barangay Permit Design */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            {
              title: "Total Applications",
              value: dashboardStats.total,
              icon: FileText,
              color: "#4CAF50",
              trend: `${dashboardStats.trend}%`,
              trendUp: dashboardStats.trend > 0,
              description: `MTOP: ${stats.mtop} • Franchise: ${stats.franchise}`
            },
            {
              title: "Approval Rate",
              value: `${dashboardStats.approvalRate}%`,
              icon: TrendingUp,
              color: "#4A90E2",
              trend: dashboardStats.approvalRate > 0 ? "+5.2%" : "0%",
              trendUp: dashboardStats.approvalRate > 0,
              description: `${dashboardStats.approved} approved`
            },
            {
              title: "Top TODA",
              value: dashboardStats.topTODA.name,
              icon: Building,
              color: "#FDA811",
              trend: `${dashboardStats.topTODA.count} applications`,
              trendUp: dashboardStats.topTODA.count > 0,
              description: "Most applications"
            },
            {
              title: "For Compliance",
              value: dashboardStats.pending,
              icon: AlertCircle,
              color: "#9C27B0",
              trend: `${dashboardStats.pending} pending`,
              trendUp: dashboardStats.pending > 0,
              description: "Requires action"
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
                  placeholder="Search by name, plate number, TODA, barangay, email..."
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-[#E9E7E7] bg-white text-[#4D4A4A] focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent font-poppins"
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <div className="relative">
                <DatePicker
                  selectsRange={true}
                  startDate={startDate}
                  endDate={endDate}
                  onChange={(update) => {
                    setDateRange(update);
                    setCurrentPage(1);
                  }}
                  className="px-4 py-2 rounded-lg border border-[#E9E7E7] bg-white text-[#4D4A4A] focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent font-poppins w-full md:w-auto"
                  placeholderText="Select date range"
                />
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#4D4A4A] text-opacity-50 w-5 h-5 pointer-events-none" />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-4 py-2 rounded-lg border border-[#E9E7E7] bg-white text-[#4D4A4A] focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent font-poppins"
              >
                <option value="all">All Status</option>
                <option value="pending">For Compliance</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>

              <select
                value={permitTypeFilter}
                onChange={(e) => {
                  setPermitTypeFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-4 py-2 rounded-lg border border-[#E9E7E7] bg-white text-[#4D4A4A] focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent font-poppins"
              >
                <option value="all">All Permit Types</option>
                <option value="new">New</option>
                <option value="renewal">Renewal</option>
              </select>

              <select
                value={permitSubtypeFilter}
                onChange={(e) => {
                  setPermitSubtypeFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-4 py-2 rounded-lg border border-[#E9E7E7] bg-white text-[#4D4A4A] focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent font-poppins"
              >
                <option value="all">All Subtypes</option>
                <option value="mtop">MTOP</option>
                <option value="franchise">Franchise</option>
              </select>

              {(searchTerm || statusFilter !== "all" || permitTypeFilter !== "all" || permitSubtypeFilter !== "all" || startDate || endDate) && (
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 text-sm text-[#4D4A4A] hover:text-[#4CAF50] hover:bg-[#FBFBFB] rounded-lg transition-colors font-poppins"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      {franchises.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Line Chart - Trends by Permit Type */}
          <div className="lg:col-span-2 bg-white rounded-lg p-5 shadow-sm border border-[#E9E7E7]">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-[#4D4A4A] font-montserrat">Monthly Trends by Permit Type</h3>
                <p className="text-sm text-[#4D4A4A] text-opacity-70">Applications for MTOP vs Franchise</p>
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
                data={pieChartData}
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
                { label: "Approved", value: stats.approved || 0 },
                { label: "For Compliance", value: (stats.pending + stats.under_review) || 0 },
                { label: "Rejected", value: stats.rejected || 0 }
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
      )}

      {/* Bar Chart - Applications by TODA */}
      {franchises.length > 0 && (
        <div className="mb-6 bg-white rounded-lg p-5 shadow-sm border border-[#E9E7E7]">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-[#4D4A4A] font-montserrat">Applications by TODA</h3>
              <p className="text-sm text-[#4D4A4A] text-opacity-70">Distribution across different TODA organizations</p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-[#4D4A4A] text-opacity-70">
                Showing top {Math.min(6, barChartData.labels.length)} TODAs
              </span>
            </div>
          </div>
          <div className="h-[300px]">
            <Bar
              data={barChartData}
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
          
          {/* TODA Summary Cards */}
          {barChartData.labels.length > 0 && barChartData.labels[0] !== 'No TODA Data' && (
            <div className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {barChartData.labels.slice(0, 6).map((toda, idx) => {
                const count = barChartData.datasets[0].data[idx];
                const color = barChartData.datasets[0].backgroundColor[idx];
                return (
                  <div 
                    key={idx}
                    className="p-3 rounded-lg border border-[#E9E7E7] hover:shadow transition-all"
                    style={{ borderLeftColor: color, borderLeftWidth: '4px' }}
                  >
                    <div className="flex items-center mb-2">
                      <Building className="w-5 h-5 mr-2" style={{ color }} />
                      <span className="text-sm font-medium text-[#4D4A4A] font-poppins truncate">
                        {toda}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-[#4D4A4A] font-montserrat">
                        {count}
                      </span>
                      <span className="text-xs px-2 py-1 rounded-full bg-[#FBFBFB] text-[#4D4A4A]">
                        {((count / franchises.length) * 100).toFixed(1)}% of total
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Main Content with Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-[#E9E7E7] overflow-hidden">
        {/* Tab Navigation - Matching Design */}
        <div className="p-5 border-b border-[#E9E7E7] bg-gradient-to-r from-[#4CAF50]/5 to-[#4A90E2]/5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-[#4D4A4A] font-montserrat">Franchise Applications</h3>
              <p className="text-sm text-[#4D4A4A] text-opacity-70">
                Showing {startIndex + 1}-{Math.min(endIndex, filteredFranchises.length)} of {filteredFranchises.length} applications
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
          
          {/* Tabs */}
          <nav className="flex space-x-6 mt-4">
            {tabCategories.map((tab) => (
              <button
                key={tab.key}
                onClick={() => {
                  setActiveTab(tab.key);
                  setPermitSubtypeFilter(tab.key === "all" ? "all" : tab.key);
                  setCurrentPage(1);
                }}
                className={`py-2 px-3 border-b-2 font-medium text-sm flex items-center gap-2 transition-all whitespace-nowrap ${
                  activeTab === tab.key 
                    ? "border-[#4CAF50] text-[#4CAF50]" 
                    : "border-transparent text-[#4D4A4A] hover:text-[#4CAF50]"
                }`}
              >
                {tab.label}
                <span className={`px-2 py-1 text-xs rounded-full ${
                  activeTab === tab.key 
                    ? "bg-[#4CAF50] text-white" 
                    : "bg-[#FBFBFB] text-[#4D4A4A] border border-[#E9E7E7]"
                }`}>
                  {countByType[tab.key]}
                </span>
              </button>
            ))}
          </nav>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#FBFBFB]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#4D4A4A] uppercase tracking-wider font-montserrat">
                  Application ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#4D4A4A] uppercase tracking-wider font-montserrat">
                  Applicant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#4D4A4A] uppercase tracking-wider font-montserrat">
                  Permit Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#4D4A4A] uppercase tracking-wider font-montserrat">
                  Subtype
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#4D4A4A] uppercase tracking-wider font-montserrat">
                  TODA
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#4D4A4A] uppercase tracking-wider font-montserrat">
                  Vehicle
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#4D4A4A] uppercase tracking-wider font-montserrat">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#4D4A4A] uppercase tracking-wider font-montserrat">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#4D4A4A] uppercase tracking-wider font-montserrat">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E9E7E7]">
              {paginatedFranchises.length > 0 ? (
                paginatedFranchises.map((franchise, index) => {
                  const statusInfo = getStatusColor(franchise.status);
                  const StatusIcon = statusInfo.icon;
                  const typeColor = getPermitTypeColor(franchise.permit_type);
                  const subtypeColor = getTypeColor(franchise.permit_subtype);
                  
                  return (
                    <tr key={index} className="hover:bg-[#FBFBFB] transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-mono text-sm text-[#4D4A4A] font-medium">
                          {franchise.id}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-[#4D4A4A] font-montserrat">
                            {franchise.full_name}
                          </p>
                          <p className="text-sm text-[#4D4A4A] text-opacity-70 font-poppins">
                            {franchise.contact_number}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${typeColor.bg} ${typeColor.text}`}>
                          {franchise.permit_type}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${subtypeColor.bg} ${subtypeColor.text}`}>
                          {franchise.permit_subtype}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-[#4D4A4A] font-poppins">
                        {franchise.toda_name}
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-[#4D4A4A] font-poppins">{franchise.make_brand} {franchise.model}</p>
                          <p className="text-sm text-[#4D4A4A] text-opacity-70 font-poppins">{franchise.plate_number}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <StatusIcon className={`w-4 h-4 mr-2 ${statusInfo.text}`} />
                          <span className={`text-sm font-medium ${statusInfo.text} font-poppins`}>
                            {franchise.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-[#4D4A4A] text-opacity-70 font-poppins">
                          {formatDate(franchise.created_at)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <button 
                            onClick={() => handleView(franchise.id)}
                            title="View Details"
                            className="p-2 bg-[#4A90E2] text-white rounded-lg hover:bg-[#FDA811]/80 transition-colors"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="9" className="px-6 py-12 text-center">
                    <Car className="w-12 h-12 text-[#E9E7E7] mx-auto mb-4" />
                    <p className="text-[#4D4A4A] text-opacity-70">
                      {franchises.length === 0 
                        ? "No applications found in database. Please check your connection."
                        : "No applications match your filters"}
                    </p>
                    {franchises.length === 0 && (
                      <button
                        onClick={fetchFranchises}
                        className="mt-4 px-4 py-2 bg-[#4CAF50] text-white rounded-lg hover:bg-opacity-90 transition-colors font-poppins"
                      >
                        Retry Connection
                      </button>
                    )}
                    {franchises.length > 0 && (
                      <button
                        onClick={clearFilters}
                        className="mt-4 px-4 py-2 border border-[#E9E7E7] text-[#4D4A4A] rounded-lg hover:bg-[#FBFBFB] transition-colors font-poppins"
                      >
                        Clear Filters
                      </button>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredFranchises.length > ITEMS_PER_PAGE && (
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

      {/* Franchise Details Modal - UPDATED WITH SUBMITTED DOCUMENTS SECTION */}
      {isModalOpen && selectedFranchise && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/30 backdrop-blur-sm p-4 overflow-auto">
          <div className="w-full max-w-6xl bg-white dark:bg-slate-800 rounded-xl shadow-2xl">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200 dark:border-slate-700 bg-gradient-to-r from-[#4CAF50]/5 to-[#4A90E2]/5 rounded-t-xl">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Franchise Permit Details</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Application ID: {selectedFranchise.id}
                  </p>
                  <div className="mt-2 flex items-center">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(selectedFranchise.status).badge}`}>
                      {selectedFranchise.status}
                    </span>
                  </div>
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
              {/* Applicant Information Section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Applicant Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Full Name</label>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white mt-1">
                      {selectedFranchise.full_name}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Contact Number</label>
                    <p className="text-gray-900 dark:text-white mt-1">
                      {selectedFranchise.contact_number}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Email Address</label>
                    <p className="text-gray-900 dark:text-white mt-1">
                      {selectedFranchise.email_address || selectedFranchise.email || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Address</label>
                    <p className="text-gray-900 dark:text-white mt-1">
                      {selectedFranchise.address || 'N/A'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Vehicle Information */}
              <div className="border-t border-gray-200 dark:border-slate-700 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Vehicle Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Make/Brand</label>
                    <p className="text-gray-900 dark:text-white mt-1">
                      {selectedFranchise.make_brand}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Model</label>
                    <p className="text-gray-900 dark:text-white mt-1">
                      {selectedFranchise.model}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Plate Number</label>
                    <p className="text-gray-900 dark:text-white mt-1">
                      {selectedFranchise.plate_number}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Vehicle Color</label>
                    <p className="text-gray-900 dark:text-white mt-1">
                      {selectedFranchise.vehicle_color}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Year Model</label>
                    <p className="text-gray-900 dark:text-white mt-1">
                      {selectedFranchise.year_model}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Vehicle Type</label>
                    <p className="text-gray-900 dark:text-white mt-1">
                      {selectedFranchise.vehicle_type}
                    </p>
                  </div>
                </div>
              </div>

              {/* Operation Information */}
              <div className="border-t border-gray-200 dark:border-slate-700 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Operation Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-gray-500">TODA Name</label>
                    <p className="text-gray-900 dark:text-white mt-1">
                      {selectedFranchise.toda_name}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Barangay of Operation</label>
                    <p className="text-gray-900 dark:text-white mt-1">
                      {selectedFranchise.barangay_of_operation}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Permit Type</label>
                    <p className="text-gray-900 dark:text-white mt-1">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPermitTypeColor(selectedFranchise.permit_type).bg} ${getPermitTypeColor(selectedFranchise.permit_type).text}`}>
                        {selectedFranchise.permit_type}
                      </span>
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Permit Subtype</label>
                    <p className="text-gray-900 dark:text-white mt-1">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(selectedFranchise.permit_subtype).bg} ${getTypeColor(selectedFranchise.permit_subtype).text}`}>
                        {selectedFranchise.permit_subtype}
                      </span>
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Date Applied</label>
                    <p className="text-gray-900 dark:text-white mt-1">
                      {selectedFranchise.date_applied || formatDate(selectedFranchise.created_at)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              <div className="border-t border-gray-200 dark:border-slate-700 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Additional Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-gray-500">LTO OR Number</label>
                    <p className="text-gray-900 dark:text-white mt-1">
                      {selectedFranchise.or_number || selectedFranchise.lto_or_number || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">LTO CR Number</label>
                    <p className="text-gray-900 dark:text-white mt-1">
                      {selectedFranchise.cr_number || selectedFranchise.lto_cr_number || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Engine Number</label>
                    <p className="text-gray-900 dark:text-white mt-1">
                      {selectedFranchise.engine_number || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Chassis Number</label>
                    <p className="text-gray-900 dark:text-white mt-1">
                      {selectedFranchise.chassis_number || 'N/A'}
                    </p>
                  </div>
                </div>
              </div>

              {/* SUBMITTED DOCUMENTS SECTION - ADDED */}
              <div className="border-t border-gray-200 dark:border-slate-700 pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Submitted Documents</h3>
                  <button
                    onClick={toggleSubmittedDocs}
                    className="flex items-center gap-2 text-sm text-[#4CAF50] hover:text-[#FDA811] transition-colors"
                  >
                    <span>{showSubmittedDocs ? 'Hide' : 'View'} Documents</span>
                    <ChevronRight className={`w-4 h-4 transition-transform ${showSubmittedDocs ? 'rotate-90' : ''}`} />
                  </button>
                </div>

                {showSubmittedDocs && (
                  <div className="mt-4">
                    {selectedFranchise.attachments && selectedFranchise.attachments.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {selectedFranchise.attachments.map((file) => (
                          <div 
                            key={file.id} 
                            className="flex items-center justify-between p-4 border border-gray-200 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <div className={`p-3 rounded-lg ${
                                isImageFile(file.type, file.name)
                                  ? 'bg-green-100 dark:bg-green-900/30' 
                                  : 'bg-blue-100 dark:bg-blue-900/30'
                              }`}>
                                {isImageFile(file.type, file.name) ? (
                                  <ImageIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
                                ) : (
                                  <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                  {file.field_name}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                  {file.name}
                                </p>
                                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                  {getFileTypeName(file.type, file.name)}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <button 
                                onClick={() => viewFile(file)}
                                className="p-2 bg-[#4CAF50] text-white rounded-lg hover:bg-[#FDA811] transition-colors"
                                title="View document"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <a 
                                href={file.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 bg-[#4A90E2] text-white rounded-lg hover:bg-[#4A90E2]/80 transition-colors"
                                title="Download document"
                                download
                              >
                                <Download className="w-4 h-4" />
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 bg-gray-50 dark:bg-slate-700 rounded-lg border border-gray-200 dark:border-slate-600">
                        <FileText className="w-12 h-12 text-gray-300 dark:text-gray-500 mx-auto mb-3" />
                        <p className="text-gray-500 dark:text-gray-400">
                          No documents submitted for this application.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Review Comments Section - UPDATED WITH COMMENT SAVING */}
              <div className="border-t border-gray-200 dark:border-slate-700 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Review Comments
                  {selectedFranchise.remarks && (
                    <span className="text-sm font-normal text-gray-500 ml-2">
                      ({formatComments(selectedFranchise.remarks).length} comment{formatComments(selectedFranchise.remarks).length !== 1 ? 's' : ''})
                    </span>
                  )}
                </h3>
                
                {/* Display all comments in one box */}
                <div className="space-y-4 mb-6">
                  {selectedFranchise.remarks && selectedFranchise.remarks.trim() ? (
                    <div className="bg-gray-50 dark:bg-slate-700 rounded-lg border border-gray-200 dark:border-slate-600 overflow-hidden">
                      <div className="max-h-64 overflow-y-auto p-4">
                        {formatComments(selectedFranchise.remarks).map((comment, index) => (
                          <div key={index} className={`mb-4 ${index !== 0 ? 'pt-4 border-t border-gray-200 dark:border-slate-600' : ''}`}>
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                <User className="w-4 h-4 mr-2" />
                                Admin Comment
                              </div>
                              <div className="flex items-center text-xs text-gray-400">
                                <Clock className="w-3 h-3 mr-1" />
                                {comment.timestamp}
                              </div>
                            </div>
                            <div className="pl-6">
                              <p className="text-gray-900 dark:text-white bg-white dark:bg-slate-800 p-3 rounded border border-gray-100 dark:border-slate-500">
                                {comment.comment}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="px-4 py-3 bg-gray-100 dark:bg-slate-800 border-t border-gray-200 dark:border-slate-600">
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Total: {formatComments(selectedFranchise.remarks).length} comment{formatComments(selectedFranchise.remarks).length !== 1 ? 's' : ''}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 bg-gray-50 dark:bg-slate-700 rounded-lg border border-gray-200 dark:border-slate-600">
                      <MessageSquare className="w-12 h-12 text-gray-300 dark:text-gray-500 mx-auto mb-3" />
                      <p className="text-gray-500 dark:text-gray-400">
                        No comments yet. Add your first comment below.
                      </p>
                    </div>
                  )}
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
                  {isImageFile(selectedFile.file_type, selectedFile.name) ? (
                    <ImageIcon className="w-5 h-5" />
                  ) : (
                    <FileText className="w-5 h-5" />
                  )}
                  <span className="text-sm font-medium truncate max-w-xs">
                    {selectedFile.name}
                  </span>
                  <span className="text-xs text-gray-300">
                    {getFileTypeName(selectedFile.file_type, selectedFile.name)}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {/* Zoom Controls */}
                {isImageFile(selectedFile.file_type, selectedFile.name) && (
                  <div className="flex items-center gap-1 mr-4 bg-black/40 rounded-lg p-1">
                    <button 
                      onClick={handleZoomOut}
                      className="p-2 text-white hover:bg-white/10 rounded transition-colors"
                      title="Zoom Out"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
                      </svg>
                    </button>
                    
                    <button 
                      onClick={handleResetZoom}
                      className="px-3 py-2 text-xs text-white hover:bg-white/10 rounded transition-colors"
                      title="Reset Zoom"
                    >
                      {zoomLevel}%
                    </button>
                    
                    <button 
                      onClick={handleZoomIn}
                      className="p-2 text-white hover:bg-white/10 rounded transition-colors"
                      title="Zoom In"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                      </svg>
                    </button>
                  </div>
                )}
                
                <a 
                  href={selectedFile.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm flex items-center gap-1.5 transition-colors"
                  download
                >
                  <Download className="w-4 h-4 mr-2" />
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

            {/* Image Content with Zoom */}
            {isImageFile(selectedFile.file_type, selectedFile.name) ? (
              <div 
                className="flex-1 flex items-center justify-center p-4 overflow-hidden cursor-move"
                onWheel={handleWheel}
                onMouseDown={handleMouseDown}
              >
                <div className="relative w-full h-full flex items-center justify-center">
                  <img 
                    ref={imageRef}
                    id="preview-image"
                    src={selectedFile.url} 
                    alt={selectedFile.name}
                    className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl transition-transform duration-200 ease-out"
                    style={{ transform: 'scale(1)', position: 'relative', left: '0px', top: '0px', cursor: 'default' }}
                    onError={(e) => {
                      console.error('Failed to load image:', selectedFile.url);
                      e.target.onerror = null;
                      e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="400" height="300" fill="%23222222"/><text x="200" y="150" text-anchor="middle" font-family="Arial" font-size="16" fill="%23ffffff">Image not found</text><text x="200" y="170" text-anchor="middle" font-family="Arial" font-size="12" fill="%23999999">URL: ' + selectedFile.url + '</text></svg>';
                      e.target.className = 'max-w-md mx-auto bg-gray-800 rounded-lg p-8';
                    }}
                  />
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center p-4">
                <div className="text-center max-w-md bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                  <div className="text-gray-300 mb-6">
                    {selectedFile.file_type?.includes('pdf') || selectedFile.name?.endsWith('.pdf') ? (
                      <FileText className="w-24 h-24 mx-auto" />
                    ) : selectedFile.file_type?.includes('image/') ? (
                      <ImageIcon className="w-24 h-24 mx-auto" />
                    ) : (
                      <FileText className="w-24 h-24 mx-auto" />
                    )}
                  </div>
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

            {/* Footer Info with Zoom Level */}
            <div className="absolute bottom-0 left-0 right-0 z-20 p-4 flex justify-between items-center text-white/60 text-sm">
              <div className="flex items-center gap-2">
                {isImageFile(selectedFile.file_type, selectedFile.name) && (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                    </svg>
                    <span>{zoomLevel}%</span>
                    <span className="text-xs ml-4">Drag to pan when zoomed</span>
                  </>
                )}
              </div>
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
          <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-xl shadow-2xl p-6 transform transition-all">
            <div className="text-center">
              {/* Success Checkmark Animation */}
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/30 mb-4">
                <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Success!
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
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