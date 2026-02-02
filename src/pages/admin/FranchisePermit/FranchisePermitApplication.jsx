import { useEffect, useState, useMemo, useRef, useCallback } from "react";
import Swal from "sweetalert2";
import {
  Search,
  Download,
  RefreshCw,
  Car,
  FileText,
  Image as ImageIcon,
  X,
  CheckCircle,
  User,
  Clock
} from "lucide-react";

// Helper functions for file preview modal
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

// Status mapping functions
const mapStatusToFrontend = (status) => {
  if (!status) return 'Compliance';
  const statusMap = {
    'pending': 'Compliance',
    'under_review': 'Compliance',
    'approved': 'Approved',
    'rejected': 'Rejected'
  };
  return statusMap[status.toLowerCase()] || 'Compliance';
};

const mapStatusToBackend = (status) => {
  const statusMap = {
    'Compliance': 'pending',
    'Approved': 'approved',
    'Rejected': 'rejected'
  };
  return statusMap[status] || 'pending';
};

export default function FranchiseDashboard() {
  const [franchises, setFranchises] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFranchise, setSelectedFranchise] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [permitSubtypeFilter, setPermitSubtypeFilter] = useState("all");
  const [permitTypeFilter, setPermitTypeFilter] = useState("all");
  const [exporting, setExporting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionComment, setActionComment] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [sortOption, setSortOption] = useState('latest');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [showFilePreview, setShowFilePreview] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(100);
  const imageRef = useRef(null);
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const imagePositionRef = useRef({ x: 0, y: 0 });
  
  const ITEMS_PER_PAGE = 10;
  const API_FRANCHISE = "/backend/franchise_permit";

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

  // Fetch franchises from API
  const fetchFranchises = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams({
        page: currentPage,
        limit: ITEMS_PER_PAGE
      });
      
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
        const transformedData = data.data.map((franchise) => {
          const fullName = `${franchise.first_name || ''} ${franchise.middle_initial ? franchise.middle_initial + '.' : ''} ${franchise.last_name || ''}`.trim();
          
          return {
            id: franchise.application_id,
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
            attachments: franchise.attachments || {}
          };
        });
        
        setFranchises(transformedData);
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

  useEffect(() => {
    fetchFranchises();
  }, [currentPage, statusFilter, permitSubtypeFilter, permitTypeFilter]);

  // File zoom and drag handlers
  const updateZoomLevel = useCallback(() => {
    if (imageRef.current) {
      const currentTransform = imageRef.current.style.transform || 'scale(1)';
      const currentScale = parseFloat(currentTransform.match(/scale\(([^)]+)\)/)?.[1] || 1);
      setZoomLevel(Math.round(currentScale * 100));
    }
  }, []);

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

  const handleMouseDown = useCallback((e) => {
    if (!imageRef.current || !isImageFile(selectedFile?.file_type, selectedFile?.name)) return;
    
    const currentTransform = imageRef.current.style.transform || 'scale(1)';
    const currentScale = parseFloat(currentTransform.match(/scale\(([^)]+)\)/)?.[1] || 1);
    
    if (currentScale > 1) {
      e.preventDefault();
      isDraggingRef.current = true;
      dragStartRef.current = { x: e.clientX, y: e.clientY };
      imageRef.current.style.cursor = 'grabbing';
      
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
        
        if (imageRef.current.style.left && imageRef.current.style.top) {
          imagePositionRef.current.x = parseFloat(imageRef.current.style.left);
          imagePositionRef.current.y = parseFloat(imageRef.current.style.top);
        }
        
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
      
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
  }, [selectedFile]);

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
          application_id: selectedFranchise.application_id || selectedFranchise.id,
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

  // Filter logic
  const getFilteredFranchises = () => {
    let filtered = [...franchises];

    if (searchQuery) {
      const term = searchQuery.toLowerCase();
      filtered = filtered.filter(f => 
        f.full_name?.toLowerCase().includes(term) ||
        f.plate_number?.toLowerCase().includes(term) ||
        f.toda_name?.toLowerCase().includes(term) ||
        f.barangay_of_operation?.toLowerCase().includes(term) ||
        f.application_id?.toString().includes(term) ||
        f.email?.toLowerCase().includes(term)
      );
    }

    if (activeTab !== "all") {
      filtered = filtered.filter(f => 
        f.permit_subtype?.toLowerCase() === activeTab.toLowerCase()
      );
    }

    return filtered;
  };

  // Sort function
  const sortFranchises = (franchisesToSort, sortBy) => {
    const sortedFranchises = [...franchisesToSort];
    
    switch (sortBy) {
      case 'latest':
        return sortedFranchises.sort((a, b) => 
          new Date(b.created_at || 0) - new Date(a.created_at || 0)
        );
      
      case 'oldest':
        return sortedFranchises.sort((a, b) => 
          new Date(a.created_at || 0) - new Date(b.created_at || 0)
        );
      
      case 'name_asc':
        return sortedFranchises.sort((a, b) => {
          const nameA = a.full_name.toLowerCase();
          const nameB = b.full_name.toLowerCase();
          return nameA.localeCompare(nameB);
        });
      
      case 'name_desc':
        return sortedFranchises.sort((a, b) => {
          const nameA = a.full_name.toLowerCase();
          const nameB = b.full_name.toLowerCase();
          return nameB.localeCompare(nameA);
        });
      
      case 'status_priority':
        const statusOrder = { 'Compliance': 1, 'Approved': 2, 'Rejected': 3 };
        return sortedFranchises.sort((a, b) => 
          (statusOrder[a.status] || 4) - (statusOrder[b.status] || 4)
        );
      
      default:
        return sortedFranchises;
    }
  };

  // Get filtered and sorted permits
  const getFilteredAndSortedFranchises = () => {
    let filtered = getFilteredFranchises();
    filtered = sortFranchises(filtered, sortOption);
    return filtered;
  };

  // Calculate dashboard stats
  const dashboardStats = useMemo(() => {
    const total = franchises.length;
    const approved = franchises.filter(f => f.status === "Approved").length;
    const rejected = franchises.filter(f => f.status === "Rejected").length;
    const compliance = franchises.filter(f => f.status === "Compliance").length;
    const mtop = franchises.filter(f => f.permit_subtype === "MTOP").length;
    const franchise = franchises.filter(f => f.permit_subtype === "FRANCHISE").length;
    
    const approvalRate = total > 0 ? ((approved / total) * 100).toFixed(1) : 0;
    
    const todaCounts = {};
    franchises.forEach(f => {
      const toda = f.toda_name || 'Unknown';
      if (toda !== 'N/A' && toda) {
        todaCounts[toda] = (todaCounts[toda] || 0) + 1;
      }
    });
    const topTODA = Object.entries(todaCounts)
      .sort(([,a], [,b]) => b - a)[0] || ['No TODA data', 0];

    return {
      total,
      approved,
      rejected,
      compliance,
      mtop,
      franchise,
      approvalRate,
      topTODA: { name: topTODA[0], count: topTODA[1] }
    };
  }, [franchises]);

  // Status colors
  const getStatusColor = (status) => {
    switch (status) {
      case "Approved":
        return "text-[#4CAF50] bg-[#4CAF50]/10";
      case "Rejected":
        return "text-[#E53935] bg-[#E53935]/10";
      case "Compliance":
        return "text-[#FDA811] bg-[#FDA811]/10";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  // Tab navigation styling
  const getTabBadgeColor = (tab) =>
    tab === activeTab ? "bg-[#4CAF50] text-white" : "bg-gray-100 text-gray-600";

  const getTabBorderColor = (tab) => {
    return tab === activeTab ? "border-[#4CAF50]" : "border-transparent";
  };

  const getTabTextColor = (tab) => {
    return tab === activeTab ? "text-[#4CAF50]" : "text-gray-500 hover:text-gray-700";
  };

  // View franchise details
  const openModal = async (franchise) => {
    try {
      const applicationId = franchise.application_id || franchise.id;
      const response = await fetch(`${API_FRANCHISE}/fetch_single.php?application_id=${applicationId}`);
      
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          const franchiseData = data.data;
          
          // Parse attachments from individual fields
          const attachments = parseAttachments(franchiseData);
          
          setSelectedFranchise({
            ...franchiseData,
            email_address: franchiseData.email,
            address: franchiseData.home_address || 'N/A',
            year_model: franchiseData.year_acquired,
            vehicle_color: franchiseData.color,
            or_number: franchiseData.lto_or_number,
            cr_number: franchiseData.lto_cr_number,
            driver_license: franchiseData.id_number || 'N/A',
            franchise_number: franchiseData.application_id,
            date_applied: franchiseData.formatted_date_submitted || formatDate(franchiseData.date_submitted),
            attachments: attachments, // Pass the parsed attachments
            status: mapStatusToFrontend(franchiseData.status)
          });
        } else {
          throw new Error(data.message || 'Failed to fetch details');
        }
      } else {
        throw new Error(`HTTP error: ${response.status}`);
      }
      setShowModal(true);
    } catch (err) {
      console.error('Error viewing franchise:', err);
      Swal.fire('Error', 'Failed to load application details: ' + err.message, 'error');
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedFranchise(null);
    setActionComment('');
    setSelectedFile(null);
    setShowFilePreview(false);
  };

  // Handle status update
  const updatePermitStatus = async (status, comments = '') => {
    if (!selectedFranchise) return;
    
    try {
      const backendStatus = mapStatusToBackend(status);
      
      const response = await fetch(`${API_FRANCHISE}/update_status.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          application_id: selectedFranchise.application_id || selectedFranchise.id,
          status: backendStatus,
          remarks: comments,
          updated_by: 'Admin'
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setSuccessMessage(`Permit ${status.toLowerCase()} successfully!`);
        setShowSuccessModal(true);
        
        await fetchFranchises();
        
        setSelectedFranchise(prev => ({
          ...prev,
          status: status,
          remarks: data.data?.remarks || prev.remarks
        }));
      } else {
        Swal.fire('Error', data.message || 'Failed to update status', 'error');
      }
    } catch (err) {
      console.error('Error updating status:', err);
      Swal.fire('Error', 'Failed to update status. Please try again.', 'error');
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

  // Parse attachments from franchise data
  const parseAttachments = (franchiseData) => {
    if (!franchiseData) return [];
    
    try {
      const fileList = [];
      const applicationId = franchiseData.application_id;
      
      // List of all possible file fields from your PHP code
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
          // Files are stored in: uploads/{application_id}/{filename}
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

  // File handling functions
  const viewFile = (file) => {
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
    
    console.log('Viewing file:', fileWithType); // Debug log
    
    setSelectedFile(fileWithType);
    setShowFilePreview(true);
  };

  const closeFilePreview = () => {
    setSelectedFile(null);
    setShowFilePreview(false);
    setZoomLevel(100);
    isDraggingRef.current = false;
    dragStartRef.current = { x: 0, y: 0 };
    imagePositionRef.current = { x: 0, y: 0 };
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

  // Action handlers
  const handleApprove = async () => {
    if (!selectedFranchise) return;
    await updatePermitStatus('Approved', actionComment);
  };

  const handleReject = async () => {
    if (!selectedFranchise) return;
    await updatePermitStatus('Rejected', actionComment);
  };

  const handleForCompliance = async () => {
    if (!selectedFranchise) return;
    await updatePermitStatus('Compliance', actionComment);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#4CAF50]"></div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-700 p-6 rounded-lg">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Franchise Permit Analytics
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage and track all franchise permit applications
        </p>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-center">
          <div className="text-red-600 font-semibold">{error}</div>
          <button
            onClick={fetchFranchises}
            className="mt-2 px-4 py-2 bg-[#4CAF50] text-white rounded-lg hover:bg-[#4CAF50]/80 transition-colors"
          >
            Retry Connection
          </button>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-[#4CAF50]/10 p-4 rounded-lg border border-[#4CAF50]/20">
          <p className="text-[#4CAF50] text-sm font-medium">Total Applications</p>
          <p className="text-[#4CAF50] text-2xl font-bold">{dashboardStats.total}</p>
          <p className="text-[#4CAF50] text-xs mt-1">
            MTOP: {dashboardStats.mtop} • Franchise: {dashboardStats.franchise}
          </p>
        </div>
        <div className="bg-[#4A90E2]/10 p-4 rounded-lg border border-[#4A90E2]/20">
          <p className="text-[#4A90E2] text-sm font-medium">Approved</p>
          <p className="text-[#4A90E2] text-2xl font-bold">{dashboardStats.approved}</p>
          <p className="text-[#4A90E2] text-xs mt-1">
            {dashboardStats.approvalRate}% approval rate
          </p>
        </div>
        <div className="bg-[#FDA811]/10 p-4 rounded-lg border border-[#FDA811]/20">
          <p className="text-[#FDA811] text-sm font-medium">Compliance</p>
          <p className="text-[#FDA811] text-2xl font-bold">{dashboardStats.compliance}</p>
          <p className="text-[#FDA811] text-xs mt-1">
            Requires review
          </p>
        </div>
        <div className="bg-[#E53935]/10 p-4 rounded-lg border border-[#E53935]/20">
          <p className="text-[#E53935] text-sm font-medium">Rejected</p>
          <p className="text-[#E53935] text-2xl font-bold">{dashboardStats.rejected}</p>
          <p className="text-[#E53935] text-xs mt-1">
            Not approved
          </p>
        </div>
      </div>

      {/* Main Content with Tabs */}
      <div className="mb-6 bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 shadow-sm">
        <div className="border-b border-gray-200 dark:border-slate-700 overflow-x-auto">
          <nav className="flex space-x-6 px-6 min-w-max">
            {[
              { key: "all", label: "All Applications" },
              { key: "mtop", label: "MTOP" },
              { key: "franchise", label: "Franchise" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => {
                  setActiveTab(tab.key);
                  setPermitSubtypeFilter(tab.key === "all" ? "all" : tab.key);
                  setCurrentPage(1);
                }}
                className={`py-4 px-2 border-b-2 font-medium text-sm flex items-center gap-2 transition-all ${getTabBorderColor(tab.key)} ${getTabTextColor(tab.key)}`}
              >
                {tab.label}
                <span className={`px-2 py-1 text-xs rounded-full ${getTabBadgeColor(tab.key)}`}>
                  {tab.key === "all" && franchises.length}
                  {tab.key === "mtop" && franchises.filter(f => f.permit_subtype === "MTOP").length}
                  {tab.key === "franchise" && franchises.filter(f => f.permit_subtype === "FRANCHISE").length}
                </span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content Header */}
        <div className="p-6 border-b border-gray-200 dark:border-slate-700 bg-gradient-to-r from-[#4CAF50]/5 to-[#4A90E2]/5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {activeTab === "all" && "All Franchise Applications"}
                {activeTab === "mtop" && "MTOP Applications"}
                {activeTab === "franchise" && "Franchise Applications"}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                Showing {getFilteredAndSortedFranchises().length} of {franchises.length} records
              </p>
            </div>
            
            <div className="flex gap-3">
              {/* Search Input */}
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search applications..."
                  className="pl-10 pr-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent w-64"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                )}
              </div>
              
              {/* Sort Dropdown */}
              <div className="relative">
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent appearance-none pr-10"
                >
                  <option value="latest">Latest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="name_asc">Name (A-Z)</option>
                  <option value="name_desc">Name (Z-A)</option>
                  <option value="status_priority">Status Priority</option>
                </select>
                <svg 
                  className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              
              {/* Refresh Button */}
              <button 
                onClick={fetchFranchises}
                className="px-4 py-2 bg-[#4CAF50] text-white rounded-lg hover:bg-[#4CAF50]/80 transition-colors flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>

              {/* Export Button */}
              <button
                onClick={exportToCSV}
                disabled={exporting || franchises.length === 0}
                className="px-4 py-2 bg-[#4A90E2] text-white rounded-lg hover:bg-[#4A90E2]/80 transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                {exporting ? "Exporting..." : "Export"}
              </button>
            </div>
          </div>
          
          {/* Search Summary */}
          {searchQuery && (
            <div className="mt-4 flex items-center justify-between">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Search results for: <span className="font-semibold">"{searchQuery}"</span>
              </div>
              <button
                onClick={() => setSearchQuery('')}
                className="text-sm text-[#4CAF50] hover:text-[#FDA811] flex items-center gap-1"
              >
                <X className="w-4 h-4" />
                Clear search
              </button>
            </div>
          )}
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {franchises.length === 0 ? (
            <div className="text-center py-12">
              <Car className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No franchise applications found
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                {error ? error : "There are currently no franchise applications in the system."}
              </p>
              <button 
                onClick={fetchFranchises}
                className="px-4 py-2 bg-[#4CAF50] text-white rounded-lg hover:bg-[#FDA811] transition-colors"
              >
                Refresh Data
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full bg-white dark:bg-slate-800 shadow rounded-lg">
                <thead className="bg-gradient-to-r from-[#4CAF50]/10 to-[#4A90E2]/10">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Application No.
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Applicant
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Vehicle Details
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      TODA
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Applied Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                  {getFilteredAndSortedFranchises().map(f => (
                    <tr key={f.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                      <td className="px-6 py-4 text-sm font-mono text-gray-600 dark:text-gray-300">
                        FP-{String(f.application_id).padStart(4, '0')}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-white font-medium">
                        {f.full_name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                        <div>{f.vehicle_type} • {f.plate_number}</div>
                        <div className="text-xs text-gray-500">{f.make_brand} {f.model}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                        {f.toda_name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                        {formatDate(f.created_at)}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`px-3 py-1.5 text-xs font-medium rounded-full border ${getStatusColor(
                            f.status
                          )} border-current border-opacity-30`}
                        >
                          {f.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <button
                          onClick={() => openModal(f)}
                          className="inline-flex items-center px-4 py-2 text-xs font-medium rounded-lg text-white bg-[#4CAF50] hover:bg-[#FDA811] transition-all shadow-sm hover:shadow-md"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal with White Background and Blur */}
      {showModal && selectedFranchise && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/30 backdrop-blur-sm p-4 overflow-auto">
          <div className="w-full max-w-6xl bg-white dark:bg-slate-800 rounded-xl shadow-2xl">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200 dark:border-slate-700 bg-gradient-to-r from-[#4CAF50]/5 to-[#4A90E2]/5 rounded-t-xl">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Franchise Permit Details</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Application ID: FP-{String(selectedFranchise.application_id).padStart(4, '0')}
                  </p>
                  <span className={`mt-2 px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(selectedFranchise.status)}`}>
                    {selectedFranchise.status}
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
              {/* Personal Information Section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Personal Information</h3>
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
                      {selectedFranchise.email}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Home Address</label>
                    <p className="text-gray-900 dark:text-white mt-1">
                      {selectedFranchise.home_address}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Citizenship</label>
                    <p className="text-gray-900 dark:text-white mt-1">
                      {selectedFranchise.citizenship}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Birth Date</label>
                    <p className="text-gray-900 dark:text-white mt-1">
                      {formatDate(selectedFranchise.birth_date)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Vehicle Information */}
              <div className="border-t border-gray-200 dark:border-slate-700 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Vehicle Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Vehicle Type</label>
                    <p className="text-gray-900 dark:text-white mt-1">
                      {selectedFranchise.vehicle_type}
                    </p>
                  </div>
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
                    <label className="text-sm font-medium text-gray-500">Year Acquired</label>
                    <p className="text-gray-900 dark:text-white mt-1">
                      {selectedFranchise.year_acquired}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Color</label>
                    <p className="text-gray-900 dark:text-white mt-1">
                      {selectedFranchise.color}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Engine Number</label>
                    <p className="text-gray-900 dark:text-white mt-1">
                      {selectedFranchise.engine_number}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Chassis Number</label>
                    <p className="text-gray-900 dark:text-white mt-1">
                      {selectedFranchise.chassis_number}
                    </p>
                  </div>
                </div>
              </div>

              {/* Franchise Details */}
              <div className="border-t border-gray-200 dark:border-slate-700 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Franchise Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Permit Type</label>
                    <p className="text-gray-900 dark:text-white mt-1">
                      {selectedFranchise.permit_type}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Permit Subtype</label>
                    <p className="text-gray-900 dark:text-white mt-1">
                      {selectedFranchise.permit_subtype}
                    </p>
                  </div>
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
                    <label className="text-sm font-medium text-gray-500">Route/Zone</label>
                    <p className="text-gray-900 dark:text-white mt-1">
                      {selectedFranchise.route_zone}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">District</label>
                    <p className="text-gray-900 dark:text-white mt-1">
                      {selectedFranchise.district}
                    </p>
                  </div>
                </div>
              </div>

              {/* LTO Documents */}
              <div className="border-t border-gray-200 dark:border-slate-700 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">LTO Documents</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-gray-500">LTO OR Number</label>
                    <p className="text-gray-900 dark:text-white mt-1">
                      {selectedFranchise.lto_or_number}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">LTO CR Number</label>
                    <p className="text-gray-900 dark:text-white mt-1">
                      {selectedFranchise.lto_cr_number}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">LTO Expiration Date</label>
                    <p className="text-gray-900 dark:text-white mt-1">
                      {formatDate(selectedFranchise.lto_expiration_date)}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">MV File Number</label>
                    <p className="text-gray-900 dark:text-white mt-1">
                      {selectedFranchise.mv_file_number}
                    </p>
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div className="border-t border-gray-200 dark:border-slate-700 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Payment Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Franchise Fee OR</label>
                    <p className="text-xl font-bold text-[#4CAF50] mt-1">
                      ₱{selectedFranchise.franchise_fee_or || '0.00'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Sticker ID Fee OR</label>
                    <p className="text-xl font-bold text-[#4CAF50] mt-1">
                      ₱{selectedFranchise.sticker_id_fee_or || '0.00'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Inspection Fee OR</label>
                    <p className="text-xl font-bold text-[#4CAF50] mt-1">
                      ₱{selectedFranchise.inspection_fee_or || '0.00'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Submitted Attachments - UPDATED TO SHOW ALL FILES */}
              {selectedFranchise.attachments && selectedFranchise.attachments.length > 0 ? (
                <div className="border-t border-gray-200 dark:border-slate-700 pt-6">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Submitted Files</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedFranchise.attachments.map((file) => (
                      <div key={file.id} className="flex items-center justify-between p-3 border border-gray-200 dark:border-slate-600 rounded-lg">
                        <div className="flex items-center gap-2">
                          {file.type.includes('image') ? (
                            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                              <ImageIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
                            </div>
                          ) : (
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                              <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-700 dark:text-gray-300 truncate">
                              {file.name}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              {file.field_name}
                            </p>
                          </div>
                        </div>
                        <button 
                          onClick={() => viewFile(file)}
                          className="px-3 py-1 text-xs bg-[#4CAF50] text-white rounded hover:bg-[#FDA811] transition-colors whitespace-nowrap"
                        >
                          View
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="border-t border-gray-200 dark:border-slate-700 pt-6">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Submitted Files</h4>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    No files uploaded for this application.
                  </p>
                </div>
              )}

              {/* Review Comments Section */}
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
                      <svg className="w-12 h-12 text-gray-300 dark:text-gray-500 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                      </svg>
                      <p className="text-gray-500 dark:text-gray-400">
                        No comments yet. Add your first comment below.
                      </p>
                    </div>
                  )}
                </div>

                {/* Textarea for adding new comments */}
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Add New Comment
                  </label>
                  <textarea 
                    value={actionComment} 
                    onChange={(e) => setActionComment(e.target.value)} 
                    className="w-full border border-gray-300 dark:border-slate-600 rounded-lg px-4 py-3 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
                    rows={3} 
                    placeholder="Enter your review notes here..." 
                  />
                  
                  {/* Save Comment Button */}
                  {actionComment.trim() && (
                    <div className="mt-4 flex justify-end">
                      <button 
                        onClick={saveCommentOnly}
                        className="px-6 py-2 bg-[#4A90E2] text-white rounded-lg hover:bg-[#4A90E2]/80 transition-colors font-medium flex items-center shadow-sm hover:shadow"
                      >
                        <CheckCircle className="w-5 h-5 mr-2" />
                        Save Comment
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 justify-end pt-6 border-t border-gray-200 dark:border-slate-700">
                {/* Status Update Buttons - Show for Compliance, hide for approved/rejected */}
                {(selectedFranchise.status === "Compliance" || !selectedFranchise.status) ? (
                  <>
                    <button 
                      onClick={handleForCompliance}
                      className="px-6 py-3 bg-[#FDA811] text-white rounded-lg hover:bg-[#4A90E2] transition-colors font-medium"
                    >
                      Mark Compliance
                    </button>
                    
                    <button 
                      onClick={handleReject}
                      className="px-6 py-3 bg-[#4CAF50] text-white rounded-lg hover:bg-[#E53935] transition-colors font-medium"
                    >
                      Reject Application
                    </button>
                    
                    <button 
                      onClick={handleApprove}
                      className="px-6 py-3 bg-[#4CAF50] text-white rounded-lg hover:bg-[#4CAF50]/80 transition-all font-medium shadow-sm"
                    >
                      Approve Permit
                    </button>
                  </>
                ) : (
                  <button 
                    onClick={closeModal}
                    className="px-6 py-3 bg-[#4CAF50] text-white rounded-lg hover:bg-[#FDA811] transition-colors font-medium"
                  >
                    Close
                  </button>
                )}
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