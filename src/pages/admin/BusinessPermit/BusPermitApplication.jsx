import { useEffect, useState, useMemo, useRef, useCallback } from "react";
import Swal from "sweetalert2";
import { logTx } from '../../../lib/txLogger';
import {
  Search,
  Download,
  RefreshCw,
  FileText,
  Image as ImageIcon,
  X,
  CheckCircle,
  User,
  Clock,
  File,
  Receipt,
  AlertCircle,
  Building2
} from "lucide-react";

const API_BUSINESS = "/backend/business_permit/";

export default function BusPermitApplication() {
  const [selectedPermit, setSelectedPermit] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [permits, setPermits] = useState([]);
  const [actionComment, setActionComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showFilePreview, setShowFilePreview] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [sortOption, setSortOption] = useState('latest');
  const [searchQuery, setSearchQuery] = useState('');
  const [counts, setCounts] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0
  });
  const [showActionsDropdown, setShowActionsDropdown] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(100);
  const imageRef = useRef(null);
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const imagePositionRef = useRef({ x: 0, y: 0 });

  // Sort function for business permits
  const sortPermits = (permitsToSort, sortBy) => {
    const sortedPermits = [...permitsToSort];
    
    switch (sortBy) {
      case 'latest':
        return sortedPermits.sort((a, b) => 
          new Date(b.application_date || 0) - new Date(a.application_date || 0)
        );
      
      case 'oldest':
        return sortedPermits.sort((a, b) => 
          new Date(a.application_date || 0) - new Date(b.application_date || 0)
        );
      
      case 'name_asc':
        return sortedPermits.sort((a, b) => {
          const nameA = `${a.owner_last_name} ${a.owner_first_name}`.toLowerCase();
          const nameB = `${b.owner_last_name} ${b.owner_first_name}`.toLowerCase();
          return nameA.localeCompare(nameB);
        });
      
      case 'name_desc':
        return sortedPermits.sort((a, b) => {
          const nameA = `${a.owner_last_name} ${a.owner_first_name}`.toLowerCase();
          const nameB = `${b.owner_last_name} ${b.owner_first_name}`.toLowerCase();
          return nameB.localeCompare(nameA);
        });
      
      case 'business_name_asc':
        return sortedPermits.sort((a, b) => {
          const nameA = (a.business_name || '').toLowerCase();
          const nameB = (b.business_name || '').toLowerCase();
          return nameA.localeCompare(nameB);
        });
      
      case 'capital_desc':
        return sortedPermits.sort((a, b) => 
          (parseFloat(b.capital_investment) || 0) - (parseFloat(a.capital_investment) || 0)
        );
      
      default:
        return sortedPermits;
    }
  };

  // Search function for business permits
  const searchPermits = (permitsToSearch, query) => {
    if (!query.trim()) return permitsToSearch;
    
    const searchTerm = query.toLowerCase();
    return permitsToSearch.filter(permit => {
      const fullName = `${permit.owner_first_name} ${permit.owner_middle_name} ${permit.owner_last_name}`.toLowerCase();
      const businessName = (permit.business_name || '').toLowerCase();
      const tradeName = (permit.trade_name || '').toLowerCase();
      const applicantId = (permit.applicant_id || '').toLowerCase();
      const email = (permit.email_address || '').toLowerCase();
      const phone = (permit.contact_number || '').toLowerCase();
      const barangay = (permit.barangay || '').toLowerCase();
      
      return (
        fullName.includes(searchTerm) ||
        businessName.includes(searchTerm) ||
        tradeName.includes(searchTerm) ||
        applicantId.includes(searchTerm) ||
        email.includes(searchTerm) ||
        phone.includes(searchTerm) ||
        barangay.includes(searchTerm)
      );
    });
  };

  // Combined filter function
  const getFilteredPermits = () => {
    let filtered = permits;
    
    // Apply tab filter
    if (activeTab !== "all") {
      filtered = filtered.filter(permit => {
        if (activeTab === "approved") return permit.status === "APPROVED";
        if (activeTab === "pending") return permit.status === "PENDING" || !permit.status;
        if (activeTab === "rejected") return permit.status === "REJECTED";
        if (activeTab === "compliance") return permit.status === "COMPLIANCE";
        return true;
      });
    }
    
    // Apply search filter
    filtered = searchPermits(filtered, searchQuery);
    
    // Apply sorting
    filtered = sortPermits(filtered, sortOption);
    
    return filtered;
  };

  // Zoom and pan handlers for image preview
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
      setZoomLevel(Math.round(newScale * 100));
    }
  }, [selectedFile]);

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
    setZoomLevel(Math.round(newScale * 100));
  }, []);

  const handleZoomOut = useCallback(() => {
    if (!imageRef.current) return;
    const currentTransform = imageRef.current.style.transform || 'scale(1)';
    const currentScale = parseFloat(currentTransform.match(/scale\(([^)]+)\)/)?.[1] || 1);
    const newScale = Math.max(currentScale - 0.25, 0.5);
    imageRef.current.style.transform = `scale(${newScale})`;
    imageRef.current.style.cursor = newScale > 1 ? 'grab' : 'default';
    setZoomLevel(Math.round(newScale * 100));
  }, []);

  const handleResetZoom = useCallback(() => {
    if (!imageRef.current) return;
    imageRef.current.style.transform = 'scale(1)';
    imageRef.current.style.left = '0px';
    imageRef.current.style.top = '0px';
    imageRef.current.style.cursor = 'default';
    setZoomLevel(100);
    imagePositionRef.current = { x: 0, y: 0 };
  }, []);

  // Helper function for sort labels
  const getSortLabel = (option) => {
    switch (option) {
      case 'latest': return 'Latest First';
      case 'oldest': return 'Oldest First';
      case 'name_asc': return 'Owner Name A-Z';
      case 'name_desc': return 'Owner Name Z-A';
      case 'business_name_asc': return 'Business Name A-Z';
      case 'capital_desc': return 'Highest Capital';
      default: return 'Default';
    }
  };

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

  // Helper function to get clean file type name
  const getFileTypeName = (fileType, fileName = '') => {
    const fileTypeLower = (fileType || '').toLowerCase();
    const fileNameLower = (fileName || '').toLowerCase();
    
    // Check file extension first
    if (fileNameLower.endsWith('.pdf')) return 'PDF Document';
    if (fileNameLower.endsWith('.doc') || fileNameLower.endsWith('.docx')) return 'Word Document';
    if (fileNameLower.endsWith('.xls') || fileNameLower.endsWith('.xlsx')) return 'Excel Spreadsheet';
    if (fileNameLower.endsWith('.ppt') || fileNameLower.endsWith('.pptx')) return 'PowerPoint Presentation';
    if (fileNameLower.endsWith('.jpg') || fileNameLower.endsWith('.jpeg')) return 'JPEG Image';
    if (fileNameLower.endsWith('.png')) return 'PNG Image';
    if (fileNameLower.endsWith('.txt')) return 'Text Document';
    
    // Check MIME types
    if (fileTypeLower.includes('pdf')) return 'PDF Document';
    if (fileTypeLower.includes('word') || 
        fileTypeLower.includes('msword') ||
        fileTypeLower.includes('officedocument.wordprocessingml')) return 'Word Document';
    if (fileTypeLower.includes('excel') || 
        fileTypeLower.includes('spreadsheetml')) return 'Excel Spreadsheet';
    if (fileTypeLower.includes('powerpoint') || 
        fileTypeLower.includes('presentationml')) return 'PowerPoint Presentation';
    if (fileTypeLower.includes('image/jpeg')) return 'JPEG Image';
    if (fileTypeLower.includes('image/png')) return 'PNG Image';
    if (fileTypeLower.includes('image/')) return 'Image';
    if (fileTypeLower.includes('text/plain')) return 'Text Document';
    
    return 'Document';
  };

  // Get file icon based on type
  const getFileIcon = (fileType, fileName = '') => {
    const fileTypeLower = (fileType || '').toLowerCase();
    const fileNameLower = (fileName || '').toLowerCase();
    
    if (fileNameLower.endsWith('.pdf') || fileTypeLower.includes('pdf')) {
      return {
        icon: '📄',
        bgColor: 'bg-red-100 dark:bg-red-900/30',
        textColor: 'text-red-600 dark:text-red-400'
      };
    }
    
    if (fileNameLower.endsWith('.doc') || fileNameLower.endsWith('.docx') ||
        fileTypeLower.includes('word') || fileTypeLower.includes('officedocument.wordprocessingml')) {
      return {
        icon: '📝',
        bgColor: 'bg-blue-100 dark:bg-blue-900/30',
        textColor: 'text-blue-600 dark:text-blue-400'
      };
    }
    
    if (fileNameLower.endsWith('.xls') || fileNameLower.endsWith('.xlsx') ||
        fileTypeLower.includes('excel') || fileTypeLower.includes('spreadsheetml')) {
      return {
        icon: '📊',
        bgColor: 'bg-green-100 dark:bg-green-900/30',
        textColor: 'text-green-600 dark:text-green-400'
      };
    }
    
    if (fileNameLower.endsWith('.ppt') || fileNameLower.endsWith('.pptx') ||
        fileTypeLower.includes('powerpoint') || fileTypeLower.includes('presentationml')) {
      return {
        icon: '📈',
        bgColor: 'bg-orange-100 dark:bg-orange-900/30',
        textColor: 'text-orange-600 dark:text-orange-400'
      };
    }
    
    if (fileTypeLower.includes('image/')) {
      return {
        icon: '🖼️',
        bgColor: 'bg-green-100 dark:bg-green-900/30',
        textColor: 'text-green-600 dark:text-green-400'
      };
    }
    
    return {
      icon: '📁',
      bgColor: 'bg-gray-100 dark:bg-gray-900/30',
      textColor: 'text-gray-600 dark:text-gray-400'
    };
  };

  // Get file extension
  const getFileExtension = (fileName = '') => {
    const parts = fileName.split('.');
    return parts.length > 1 ? parts[parts.length - 1].toUpperCase() : 'FILE';
  };

  // Check if file is an image
  const isImageFile = (fileType, fileName = '') => {
    const fileTypeLower = (fileType || '').toLowerCase();
    const fileNameLower = (fileName || '').toLowerCase();
    
    // Check by file extension
    if (fileNameLower.endsWith('.jpg') || 
        fileNameLower.endsWith('.jpeg') || 
        fileNameLower.endsWith('.png') || 
        fileNameLower.endsWith('.gif') || 
        fileNameLower.endsWith('.bmp') || 
        fileNameLower.endsWith('.webp') ||
        fileNameLower.endsWith('.svg')) {
      return true;
    }
    
    // Check by MIME type
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

  // Check if file is previewable (images only)
  const isFilePreviewable = (fileType, fileName = '') => {
    return isImageFile(fileType, fileName);
  };

  // Tab navigation styling functions
  const getTabBadgeColor = (tab) =>
    tab === activeTab ? "bg-[#4CAF50] text-white" : "bg-gray-100 text-gray-600";

  const getTabBorderColor = (tab) => {
    return tab === activeTab ? "border-[#4CAF50]" : "border-transparent";
  };

  const getTabTextColor = (tab) => {
    return tab === activeTab ? "text-[#4CAF50] dark:text-[#4CAF50]" : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300";
  };

  // Fetch permits from API
  const fetchPermits = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const statusParam = activeTab !== 'all' ? activeTab.toUpperCase() : null;
      const url = new URL(`${API_BUSINESS}/admin_fetch.php`);
      if (statusParam) url.searchParams.append('status', statusParam);
      if (searchQuery) url.searchParams.append('search', searchQuery);
      if (sortOption) url.searchParams.append('sort_by', sortOption);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success && result.data) {
        setPermits(result.data);
        if (result.counts) {
          setCounts(result.counts);
        }
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

const fetchSinglePermit = async (permitId) => {
  try {
    // Use permit_id instead of id in the query
    const response = await fetch(`${API_BUSINESS}/fetch_single.php?permit_id=${permitId}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    console.log('Fetch single result:', result);
    
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
      const response = await fetch(`${API_BUSINESS}/fetch_documents.php?permit_id=${permitId}`);
      
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

  // Update permit status
  const updatePermitStatus = async (permitId, status, comments = '') => {
    try {
      const dbStatus = getDBStatus(status);
      
      const response = await fetch(`${API_BUSINESS}/update_status.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          permit_id: permitId,
          status: dbStatus,
          comments: comments
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to update permit status');
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Failed to update permit status');
      }

      // Update the selected permit in state
      if (selectedPermit) {
        setSelectedPermit(prev => ({
          ...prev,
          status: dbStatus,
          uiStatus: status,
          comments: result.data?.comments || prev.comments
        }));
      }

      // Refresh the permits list
      await fetchPermits();

      // Clear the comment input
      setActionComment('');

      // Show success message
      setSuccessMessage(`Permit ${status.toLowerCase()} successfully!`);
      setShowSuccessModal(true);

      // Log transaction
      try { 
        logTx({ 
          service: 'business_permit', 
          permitId: permitId, 
          action: 'update_status', 
          status: status,
          comment: comments 
        }); 
      } catch(e) {
        console.error('Error logging transaction:', e);
      }

    } catch (err) {
      console.error('Error updating permit status:', err);
      setError(err.message || 'Failed to update permit status');
      alert('Error updating status: ' + err.message);
    }
  };

  // Save comment only
  const saveCommentOnly = async () => {
    if (!selectedPermit || !actionComment.trim()) return;
    
    try {
      const response = await fetch(`${API_BUSINESS}/update_status.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          permit_id: selectedPermit.permit_id,
          comments: actionComment
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to save comment');
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Failed to save comment');
      }

      // Update the selected permit in state
      setSelectedPermit(prev => ({
        ...prev,
        comments: result.data?.comments || prev.comments
      }));

      // Also update the main permits list
      setPermits(prevPermits => 
        prevPermits.map(p => 
          p.permit_id === selectedPermit.permit_id 
            ? { ...p, comments: result.data?.comments || p.comments }
            : p
        )
      );

      // Clear the comment input
      setActionComment('');

      // Show success modal
      setSuccessMessage('Comment saved successfully!');
      setShowSuccessModal(true);

      // Log transaction
      try { 
        logTx({ 
          service: 'business_permit', 
          permitId: selectedPermit.permit_id, 
          action: 'add_comment',
          comment: actionComment
        }); 
      } catch(e) {
        console.error('Error logging transaction:', e);
      }

    } catch (err) {
      console.error('Error saving comment:', err);
      setError(err.message || 'Failed to save comment');
      alert('Error saving comment: ' + err.message);
    }
  };

  useEffect(() => {
    fetchPermits();
  }, [activeTab, sortOption]);

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

  const handleApprove = async () => {
    if (!selectedPermit) return;

    const result = await Swal.fire({
      title: 'Approve Permit?',
      html: `
        <div class="text-left">
          <p class="mb-2">You are about to approve this business permit application:</p>
          <div class="bg-gray-50 p-3 rounded-lg mb-3">
            <p class="text-sm"><strong>Permit ID:</strong> ${selectedPermit.permit_id}</p>
            <p class="text-sm"><strong>Business:</strong> ${selectedPermit.business_name}</p>
            <p class="text-sm"><strong>Owner:</strong> ${selectedPermit.owner_first_name} ${selectedPermit.owner_last_name}</p>
          </div>
          <p class="text-sm text-gray-600">This action will approve the application.</p>
        </div>
      `,
      icon: 'question',
      input: 'textarea',
      inputLabel: 'Add approval notes (optional)',
      inputPlaceholder: 'Enter any additional notes...',
      inputValue: actionComment,
      showCancelButton: true,
      confirmButtonText: 'Yes, Approve',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#4CAF50',
      cancelButtonColor: '#6b7280',
      customClass: {
        popup: 'text-left',
        htmlContainer: 'text-left'
      }
    });

    if (result.isConfirmed) {
      const notes = result.value || actionComment;
      await updatePermitStatus(selectedPermit.permit_id, 'Approved', notes);
      setActionComment('');
    }
  };

  const handleReject = async () => {
    if (!selectedPermit) return;

    const result = await Swal.fire({
      title: 'Reject Application?',
      html: `
        <div class="text-left">
          <p class="mb-2">You are about to reject this business permit application:</p>
          <div class="bg-gray-50 p-3 rounded-lg mb-3">
            <p class="text-sm"><strong>Permit ID:</strong> ${selectedPermit.permit_id}</p>
            <p class="text-sm"><strong>Business:</strong> ${selectedPermit.business_name}</p>
            <p class="text-sm"><strong>Owner:</strong> ${selectedPermit.owner_first_name} ${selectedPermit.owner_last_name}</p>
          </div>
          <p class="text-sm text-red-600">Please provide a reason for rejection.</p>
        </div>
      `,
      icon: 'warning',
      input: 'textarea',
      inputLabel: 'Reason for rejection (required)',
      inputPlaceholder: 'Enter the reason for rejecting this application...',
      inputValue: actionComment,
      inputValidator: (value) => {
        if (!value) {
          return 'You must provide a reason for rejection!';
        }
      },
      showCancelButton: true,
      confirmButtonText: 'Yes, Reject',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#E53935',
      cancelButtonColor: '#6b7280',
      customClass: {
        popup: 'text-left',
        htmlContainer: 'text-left'
      }
    });

    if (result.isConfirmed) {
      await updatePermitStatus(selectedPermit.permit_id, 'Rejected', result.value);
      setActionComment('');
    }
  };

  const handleCompliance = async () => {
    if (!selectedPermit) return;
    await updatePermitStatus(selectedPermit.permit_id, 'Compliance', actionComment);
  };

  const handlePending = async () => {
    if (!selectedPermit) return;
    await updatePermitStatus(selectedPermit.permit_id, 'Pending', actionComment);
  };

  const handleStatusUpdate = async (status, title, message, color) => {
    if (!selectedPermit) return;

    const result = await Swal.fire({
      title: title,
      html: `
        <div class="text-left">
          <p class="mb-3">${message}</p>
          <div class="mt-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">Add a comment (optional):</label>
            <textarea 
              id="status-comment" 
              class="w-full border border-gray-300 rounded-lg px-3 py-2" 
              rows="3" 
              placeholder="Enter any additional notes..."
            >${actionComment}</textarea>
          </div>
        </div>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Update Status',
      cancelButtonText: 'Cancel',
      confirmButtonColor: color,
      cancelButtonColor: '#6B7280',
      preConfirm: () => {
        const comment = document.getElementById('status-comment').value;
        return comment;
      }
    });

    if (result.isConfirmed) {
      await updatePermitStatus(selectedPermit.permit_id, status, result.value || '');
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
    const fullUrl = `${API_BUSINESS}/uploads/${encodeURIComponent(filename)}`;
    
    // For API, we can skip the HEAD check and just try to open/download
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

  // Format comments with timestamps
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

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 2
    }).format(amount || 0);
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#4CAF50]"></div>
      </div>
    );
  }

  // Export to CSV
  const exportToCSV = () => {
    setExporting(true);
    setExportType("csv");
    
    const headers = [
      "Application ID",
      "Applicant Name",
      "Business Name",
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
      ...permits.map(p => [
        p.permit_id,
        p.owner_first_name + ' ' + p.owner_last_name,
        p.business_name,
        p.permit_type,
        p.permit_subtype,
        p.toda_name,
        p.barangay_of_operation,
        `${p.make_brand} ${p.model}`,
        p.plate_number,
        p.status,
        p.contact_number,
        p.email,
        formatDate(p.created_at)
      ].map(field => `"${field || ''}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `business-permits-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    setExporting(false);
    setExportType("");
  };

  // Export to PDF
  const exportToPDF = async () => {
    setExporting(true);
    setExportType("pdf");
    
    try {
      // Create a container for PDF content
      const pdfContainer = document.createElement("div");
      pdfContainer.style.position = "absolute";
      pdfContainer.style.left = "-9999px";
      pdfContainer.style.width = "800px";
      pdfContainer.style.backgroundColor = "#ffffff";
      pdfContainer.style.padding = "20px";
      pdfContainer.style.fontFamily = "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";
      pdfContainer.style.color = "#1f2937";
      document.body.appendChild(pdfContainer);

      // Header section
      const header = document.createElement("div");
      header.style.marginBottom = "20px";
      header.style.borderBottom = "2px solid #4CAF50";
      header.style.paddingBottom = "15px";
      header.innerHTML = `
        <h1 style="color: #1f2937; font-size: 24px; font-weight: bold; margin: 0;">
          Business Permit Report
        </h1>
        <p style="color: #6b7280; margin:5px 0;">
          Generated on ${new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </p>
        <div style="display: flex; gap: 10px; margin-top: 10px; flex-wrap: wrap;">
          <span style="background: #4CAF50; color: white; padding: 3px 10px; border-radius: 15px; font-size: 11px;">
            Total: ${dashboardStats.total}
          </span>
          <span style="background: #4CAF50; color: white; padding: 3px 10px; border-radius: 15px; font-size: 11px;">
            Approved: ${dashboardStats.approved}
          </span>
          <span style="background: #FDA811; color: white; padding: 3px 10px; border-radius: 15px; font-size: 11px;">
            Compliance: ${dashboardStats.compliance}
          </span>
          <span style="background: #E53935; color: white; padding: 3px 10px; border-radius: 15px; font-size: 11px;">
            Rejected: ${dashboardStats.rejected}
          </span>
        </div>
      `;
      pdfContainer.appendChild(header);

      // Summary section
      const summarySection = document.createElement("div");
      summarySection.style.marginBottom = "25px";
      summarySection.style.padding = "15px";
      summarySection.style.backgroundColor = "#f9fafb";
      summarySection.style.borderRadius = "8px";
      summarySection.style.border = "1px solid #e5e7eb";
      summarySection.innerHTML = `
        <h2 style="color: #1f2937; font-size: 16px; font-weight: bold; margin: 0 0 10px 0;">Summary</h2>
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; font-size: 12px;">
          <div>
            <strong>Approval Rate:</strong> ${dashboardStats.approvalRate}%
          </div>
          <div>
            <strong>Top TODA:</strong> ${dashboardStats.topTODA.name} (${dashboardStats.topTODA.count} applications)
          </div>
          <div>
            <strong>MTOP Applications:</strong> ${dashboardStats.mtop}
          </div>
          <div>
            <strong>Franchise Applications:</strong> ${dashboardStats.franchise}
          </div>
        </div>
      `;
      pdfContainer.appendChild(summarySection);

      // Applications table section
      const tableSection = document.createElement("div");
      tableSection.innerHTML = `
        <h2 style="color: #1f2937; font-size: 18px; font-weight: bold; margin-bottom: 15px;">Applications List</h2>
        <table style="width: 100%; border-collapse: collapse; font-size: 10px;">
          <thead>
            <tr style="background: #f3f4f6; border-bottom: 2px solid #e5e7eb;">
              <th style="padding: 8px; text-align: left; color: #374151; font-weight: 600; border: 1px solid #e5e7eb;">ID</th>
              <th style="padding: 8px; text-align: left; color: #374151; font-weight: 600; border: 1px solid #e5e7eb;">Applicant</th>
              <th style="padding: 8px; text-align: left; color: #374151; font-weight: 600; border: 1px solid #e5e7eb;">Business</th>
              <th style="padding: 8px; text-align: left; color: #374151; font-weight: 600; border: 1px solid #e5e7eb;">TODA</th>
              <th style="padding: 8px; text-align: left; color: #374151; font-weight: 600; border: 1px solid #e5e7eb;">Barangay</th>
              <th style="padding: 8px; text-align: left; color: #374151; font-weight: 600; border: 1px solid #e5e7eb;">Vehicle</th>
              <th style="padding: 8px; text-align: left; color: #374151; font-weight: 600; border: 1px solid #e5e7eb;">Plate Number</th>
              <th style="padding: 8px; text-align: left; color: #374151; font-weight: 600; border: 1px solid #e5e7eb;">Status</th>
              <th style="padding: 8px; text-align: left; color: #374151; font-weight: 600; border: 1px solid #e5e7eb;">Date</th>
            </tr>
          </thead>
          <tbody>
            ${getFilteredPermits().slice(0, 20).map(permit => {
              const statusColor = permit.status === "Approved" ? "#4CAF50" : 
                                permit.status === "Compliance" ? "#FDA811" : "#E53935";
              return `
                <tr style="border-bottom: 1px solid #e5e7eb;">
                  <td style="padding: 8px; border: 1px solid #e5e7eb;">BP-${String(permit.permit_id).padStart(4, '0')}</td>
                  <td style="padding: 8px; border: 1px solid #e5e7eb;">${permit.owner_first_name} ${permit.owner_last_name}</td>
                  <td style="padding: 8px; border: 1px solid #e5e7eb;">${permit.business_name}</td>
                  <td style="padding: 8px; border: 1px solid #e5e7eb;">${permit.toda_name}</td>
                  <td style="padding: 8px; border: 1px solid #e5e7eb;">${permit.barangay_of_operation}</td>
                  <td style="padding: 8px; border: 1px solid #e5e7eb;">${permit.make_brand} ${permit.model}</td>
                  <td style="padding: 8px; border: 1px solid #e5e7eb;">${permit.plate_number}</td>
                  <td style="padding: 8px; border: 1px solid #e5e7eb; color: ${statusColor}; font-weight: 500;">
                    ${permit.status}
                  </td>
                  <td style="padding: 8px; border: 1px solid #e5e7eb;">${formatDate(permit.created_at)}</td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
        ${getFilteredPermits().length > 20 ? 
          `<p style="text-align: center; color: #6b7280; font-size: 10px; margin-top: 10px;">
            ... and ${getFilteredPermits().length - 20} more applications
          </p>` : ''}
      `;
      pdfContainer.appendChild(tableSection);

      // Status distribution section
      const statusSection = document.createElement("div");
      statusSection.style.marginTop = "25px";
      statusSection.style.padding = "15px";
      statusSection.style.backgroundColor = "#f9fafb";
      statusSection.style.borderRadius = "8px";
      statusSection.style.border = "1px solid #e5e7eb";
      statusSection.innerHTML = `
        <h2 style="color: #1f2937; font-size: 16px; font-weight: bold; margin: 0 0 10px 0;">Status Distribution</h2>
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; font-size: 12px;">
          <div style="text-align: center;">
            <div style="font-size: 20px; font-weight: bold; color: #4CAF50;">${dashboardStats.approved}</div>
            <div style="color: #6b7280;">Approved</div>
          </div>
          <div style="text-align: center;">
            <div style="font-size: 20px; font-weight: bold; color: #FDA811;">${dashboardStats.compliance}</div>
            <div style="color: #6b7280;">Compliance</div>
          </div>
          <div style="text-align: center;">
            <div style="font-size: 20px; font-weight: bold; color: #E53935;">${dashboardStats.rejected}</div>
            <div style="color: #6b7280;">Rejected</div>
          </div>
        </div>
      `;
      pdfContainer.appendChild(statusSection);

      // Footer
      const footer = document.createElement("div");
      footer.style.marginTop = "30px";
      footer.style.paddingTop = "15px";
      footer.style.borderTop = "1px solid #e5e7eb";
      footer.style.color = "#6b7280";
      footer.style.fontSize = "10px";
      footer.innerHTML = `
        <p style="margin: 0;">Generated by Business Permit Management System</p>
        <p style="margin: 5px 0 0 0;">Total Records: ${permits.length} • Filtered: ${getFilteredPermits().length}</p>
      `;
      pdfContainer.appendChild(footer);

      // Wait for DOM to update
      await new Promise(resolve => setTimeout(resolve, 100));

      // Generate PDF
      const canvas = await html2canvas(pdfContainer, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
      });

      const imgWidth = 190;
      const pageHeight = 280;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      let heightLeft = imgHeight;
      let position = 10;

      pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`business-permit-report-${new Date().toISOString().split("T")[0]}.pdf`);

      // Clean up
      document.body.removeChild(pdfContainer);
    } catch (error) {
      console.error("Error generating PDF:", error);
      Swal.fire({
        title: "Export Failed",
        text: "Failed to generate PDF. Please try again.",
        icon: "error"
      });
    } finally {
      setExporting(false);
      setExportType("");
    }
  };

  return (
    <div className="bg-white dark:bg-slate-700 p-6 rounded-lg">

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-[#4CAF50]/10 p-4 rounded-lg border border-[#4CAF50]/20">
          <p className="text-[#4CAF50] text-sm font-medium">Total Applications</p>
          <p className="text-[#4CAF50] text-2xl font-bold">{counts.total}</p>
        </div>
        <div className="bg-[#4A90E2]/10 p-4 rounded-lg border border-[#4A90E2]/20">
          <p className="text-[#4A90E2] text-sm font-medium">Pending Review</p>
          <p className="text-[#4A90E2] text-2xl font-bold">{counts.pending}</p>
        </div>
        <div className="bg-[#FDA811]/10 p-4 rounded-lg border border-[#FDA811]/20">
          <p className="text-[#FDA811] text-sm font-medium">For Compliance</p>
          <p className="text-[#FDA811] text-2xl font-bold">{counts.approved}</p>
        </div>
        <div className="bg-[#E53935]/10 p-4 rounded-lg border border-[#E53935]/20">
          <p className="text-[#E53935] text-sm font-medium">Rejected</p>
          <p className="text-[#E53935] text-2xl font-bold">{counts.rejected}</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="mb-6 bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 shadow-sm">
        <div className="border-b border-gray-200 dark:border-slate-700 overflow-x-auto">
          <nav className="flex space-x-6 px-6 min-w-max">
            {[
              { key: "all", label: "All Applications" },
              { key: "pending", label: "Pending" },
              { key: "compliance", label: "For Compliance" },
              { key: "approved", label: "Approved" },
              { key: "rejected", label: "Rejected" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`py-4 px-2 border-b-2 font-medium text-sm flex items-center gap-2 transition-all ${getTabBorderColor(tab.key)} ${getTabTextColor(tab.key)}`}
              >
                {tab.label}
                <span className={`px-2 py-1 text-xs rounded-full ${getTabBadgeColor(tab.key)}`}>
                  {tab.key === "all" && counts.total}
                  {tab.key === "pending" && counts.pending}
                  {tab.key === "compliance" && 0} {/* You might want to track compliance separately */}
                  {tab.key === "approved" && counts.approved}
                  {tab.key === "rejected" && counts.rejected}
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
                {activeTab === "all" && "All Business Permits"}
                {activeTab === "pending" && "Pending Applications"}
                {activeTab === "compliance" && "For Compliance"}
                {activeTab === "approved" && "Approved Permits"}
                {activeTab === "rejected" && "Rejected Applications"}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                Showing {getFilteredPermits().length} of {permits.length} records
              </p>
            </div>
            
            <div className="flex gap-3">
              {/* Search Input */}
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && fetchPermits()}
                  placeholder="Search applications..."
                  className="pl-10 pr-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent w-64"
                />
                <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
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
                  <option value="name_asc">Owner Name (A-Z)</option>
                  <option value="name_desc">Owner Name (Z-A)</option>
                  <option value="business_name_asc">Business Name (A-Z)</option>
                  <option value="capital_desc">Highest Capital</option>
                </select>
                <svg className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              
              {/* Refresh Button */}
              <button 
                onClick={fetchPermits}
                className="px-4 py-2 bg-[#4CAF50] text-white rounded-lg hover:bg-[#4CAF50]/80 transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-center">
              <div className="text-red-600 font-semibold">{error}</div>
            </div>
          )}
          
          {permits.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">🏢</div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No business permit applications found
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                There are currently no business permit applications in the system.
              </p>
              <button 
                onClick={fetchPermits}
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
                      Application ID
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Business Name
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Owner
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Business Type
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Capital
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Applied Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Documents
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {getFilteredPermits().map(p => (
                    <tr key={p.permit_id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                      <td className="px-6 py-4 text-sm font-mono text-gray-600 dark:text-gray-300">
                        {p.applicant_id}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {p.business_name || 'N/A'}
                        </div>
                        {p.trade_name && (
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            Trade: {p.trade_name}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {p.owner_last_name}, {p.owner_first_name}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {p.owner_type} • {p.citizenship}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                        {p.business_nature || 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white">
                        {formatCurrency(p.capital_investment)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                        {p.application_date ? new Date(p.application_date).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`px-3 py-1.5 text-xs font-medium rounded-full border ${getStatusColor(
                            p.status
                          )} border-current border-opacity-30`}
                        >
                          {getUIStatus(p.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                        {p.document_count || 0} files
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <button
                          onClick={() => openModal(p)}
                          className="inline-flex items-center px-4 py-2 text-xs font-medium rounded-lg text-white bg-[#4CAF50] hover:bg-[#FDA811] transition-all shadow-sm hover:shadow-md"
                        >
                          Review
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

      {/* Enhanced Business Permit Modal */}
      {showModal && selectedPermit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md p-4 overflow-auto animate-fadeIn">
          <div className="w-full max-w-7xl bg-white dark:bg-slate-800 rounded-2xl shadow-2xl transform transition-all">
            {/* Enhanced Business Permit Header */}
            <div className="relative p-6 bg-gradient-to-r from-gray-50 via-white to-gray-50 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800 border-b-4 border-green-400">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="bg-gradient-to-br from-green-400 to-green-500 p-3 rounded-2xl shadow-xl">
                    <Building2 className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Business Permit</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Business Permit Application Details</p>
                  </div>
                </div>
                
                <button 
                  onClick={closeModal}
                  className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-all"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Info Cards Row */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Permit ID Card */}
                <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-md border-l-4 border-blue-500">
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-1">Permit ID</p>
                  <p className="text-lg font-bold text-gray-800 dark:text-white font-mono">
                    BP-{String(selectedPermit.permit_id).padStart(4, '0')}
                  </p>
                </div>

                {/* Application ID Card */}
                <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-md border-l-4 border-purple-500">
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-1">Applicant ID</p>
                  <p className="text-lg font-bold text-gray-800 dark:text-white">
                    {selectedPermit.applicant_id}
                  </p>
                </div>

                {/* Status Card */}
                <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-md border-l-4 border-green-500">
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-1">Status</p>
                  <span className={`inline-block px-3 py-1 text-sm font-bold rounded-full ${getStatusColor(selectedPermit.status)}`}>
                    {selectedPermit.uiStatus || getUIStatus(selectedPermit.status)}
                  </span>
                </div>

                {/* Date Card */}
                <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-md border-l-4 border-orange-500">
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-1">Date Applied</p>
                  <p className="text-lg font-bold text-gray-800 dark:text-white">
                    {selectedPermit.application_date ? new Date(selectedPermit.application_date).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-8 space-y-8 max-h-[80vh] overflow-y-auto bg-gradient-to-b from-gray-50 to-white dark:from-slate-900 dark:to-slate-800">
              {/* Personal Information Section */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 border-2 border-blue-100 dark:border-slate-700">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-xl shadow-lg">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Owner Information</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-slate-700 dark:to-slate-600 p-4 rounded-xl">
                    <label className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wide">Full Name</label>
                    <p className="text-lg font-bold text-gray-900 dark:text-white mt-2">
                      {selectedPermit.owner_last_name}, {selectedPermit.owner_first_name} {selectedPermit.owner_middle_name}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Owner Type</label>
                    <p className="text-gray-900 dark:text-white mt-1">
                      {selectedPermit.owner_type || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Citizenship</label>
                    <p className="text-gray-900 dark:text-white mt-1">
                      {selectedPermit.citizenship || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Date of Birth</label>
                    <p className="text-gray-900 dark:text-white mt-1">
                      {selectedPermit.date_of_birth ? new Date(selectedPermit.date_of_birth).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Contact Number</label>
                    <p className="text-gray-900 dark:text-white mt-1">
                      {selectedPermit.contact_number || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Email Address</label>
                    <p className="text-gray-900 dark:text-white mt-1">
                      {selectedPermit.email_address || 'N/A'}
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-gray-500">Home Address</label>
                    <p className="text-gray-900 dark:text-white mt-1">
                      {selectedPermit.home_address || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Valid ID</label>
                    <p className="text-gray-900 dark:text-white mt-1">
                      {selectedPermit.valid_id_type || 'N/A'}: {selectedPermit.valid_id_number || 'N/A'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Business Information */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 border-2 border-green-100 dark:border-slate-700">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-gradient-to-br from-green-500 to-green-600 p-3 rounded-xl shadow-lg">
                    <Building2 className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Business Information</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-gray-500">Business Name</label>
                    <p className="text-xl font-bold text-[#4CAF50] mt-1">
                      {selectedPermit.business_name || 'N/A'}
                    </p>
                    {selectedPermit.trade_name && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Trading as: {selectedPermit.trade_name}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Nature of Business</label>
                    <p className="text-gray-900 dark:text-white mt-1">
                      {selectedPermit.business_nature || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Building Type</label>
                    <p className="text-gray-900 dark:text-white mt-1">
                      {selectedPermit.building_type || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Capital Investment</label>
                    <p className="text-lg font-bold text-gray-900 dark:text-white mt-1">
                      {formatCurrency(selectedPermit.capital_investment)}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Business Area</label>
                    <p className="text-gray-900 dark:text-white mt-1">
                      {selectedPermit.business_area || '0'} sqm
                    </p>
                  </div>
                </div>
              </div>

              {/* Business Address */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 border-2 border-purple-100 dark:border-slate-700">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-3 rounded-xl shadow-lg">
                    <Building2 className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Business Address</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <label className="text-sm font-medium text-gray-500">House/Building No.</label>
                    <p className="text-gray-900 dark:text-white mt-1">
                      {selectedPermit.house_bldg_no || 'N/A'}
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
                  <div>
                    <label className="text-sm font-medium text-gray-500">Province</label>
                    <p className="text-gray-900 dark:text-white mt-1">
                      {selectedPermit.province || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Zip Code</label>
                    <p className="text-gray-900 dark:text-white mt-1">
                      {selectedPermit.zip_code || 'N/A'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Operations Information */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 border-2 border-orange-100 dark:border-slate-700">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-3 rounded-xl shadow-lg">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Operations Information</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Operation Hours</label>
                    <p className="text-gray-900 dark:text-white mt-1">
                      {formatTime(selectedPermit.operation_time_from)} - {formatTime(selectedPermit.operation_time_to)}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Operation Type</label>
                    <p className="text-gray-900 dark:text-white mt-1">
                      {selectedPermit.operation_type || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Total Employees</label>
                    <p className="text-gray-900 dark:text-white mt-1">
                      {selectedPermit.total_employees || '0'} ({selectedPermit.male_employees || '0'} male, {selectedPermit.female_employees || '0'} female)
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Employees in QC</label>
                    <p className="text-gray-900 dark:text-white mt-1">
                      {selectedPermit.employees_in_qc || '0'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Delivery Vehicles</label>
                    <p className="text-gray-900 dark:text-white mt-1">
                      Vans/Trucks: {selectedPermit.delivery_van_truck || '0'}, Motorcycles: {selectedPermit.delivery_motorcycle || '0'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Total Floor Area</label>
                    <p className="text-gray-900 dark:text-white mt-1">
                      {selectedPermit.total_floor_area || '0'} sqm
                    </p>
                  </div>
                </div>
              </div>

              {/* Documents Section */}
              {selectedPermit.documents && selectedPermit.documents.length > 0 ? (
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 border-2 border-indigo-100 dark:border-slate-700">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 p-3 rounded-xl shadow-lg">
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="text-xl font-bold text-gray-900 dark:text-white">Submitted Documents</h4>
                    <span className="ml-auto bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-bold">
                      {selectedPermit.documents.length} files
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedPermit.documents.map((doc, index) => {
                      const isImage = isImageFile(doc.file_type, doc.document_name);
                      const displayName = doc.document_type ? doc.document_type.replace(/_/g, ' ') : 'Document';
                      
                      return (
                        <div key={index} className="flex items-center justify-between p-3 border border-gray-200 dark:border-slate-600 rounded-lg">
                          <div className="flex items-center gap-2">
                            {isImage ? (
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
                                {displayName}
                              </p>
                              <p className="text-xs text-gray-500 truncate">
                                {doc.document_name}
                              </p>
                            </div>
                          </div>
                          <button 
                            onClick={() => viewFile(doc)}
                            className="px-3 py-1 text-xs bg-[#4CAF50] text-white rounded hover:bg-[#FDA811] transition-colors whitespace-nowrap"
                          >
                            View
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 border-2 border-gray-200 dark:border-slate-700">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-gradient-to-br from-gray-400 to-gray-500 p-3 rounded-xl shadow-lg">
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="text-xl font-bold text-gray-900 dark:text-white">Submitted Documents</h4>
                  </div>
                  <div className="text-center py-8 bg-gray-50 dark:bg-slate-700 rounded-xl">
                    <FileText className="w-16 h-16 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                      No files uploaded for this application.
                    </p>
                  </div>
                </div>
              )}

              {/* Review Comments Section */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 border-2 border-yellow-100 dark:border-slate-700">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 p-3 rounded-xl shadow-lg">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Review Comments</h3>
                    {selectedPermit.comments && (
                      <span className="text-sm font-normal text-gray-500">
                        ({formatComments(selectedPermit.comments).length} comment{formatComments(selectedPermit.comments).length !== 1 ? 's' : ''})
                      </span>
                    )}
                  </div>
                </div>
                
                {/* Display all comments */}
  <div className="space-y-4 mb-6">
    {selectedPermit.comments && selectedPermit.comments.trim() ? (
      <div className="bg-gray-50 dark:bg-slate-700 rounded-lg border border-gray-200 dark:border-slate-600 overflow-hidden">
        <div className="max-h-64 overflow-y-auto p-4">
          {formatComments(selectedPermit.comments).map((comment, index) => (
            <div key={index} className={`mb-4 ${index !== 0 ? 'pt-4 border-t border-gray-200 dark:border-slate-600' : ''}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Admin Comment
                </div>
                <div className="flex items-center text-xs text-gray-400">
                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
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
            Total: {formatComments(selectedPermit.comments).length} comment{formatComments(selectedPermit.comments).length !== 1 ? 's' : ''}
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
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Save Comment
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 justify-between pt-8 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-700 rounded-2xl p-6 border-t-4 border-gray-300 dark:border-slate-600">
                {/* Actions Dropdown - Show for pending/compliance status */}
                {(selectedPermit.status === "COMPLIANCE" || selectedPermit.status === "PENDING" || !selectedPermit.status) && (
                  <div className="relative">
                    <button
                      onClick={() => setShowActionsDropdown(!showActionsDropdown)}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium shadow-md hover:shadow-lg flex items-center gap-2"
                    >
                      Actions
                      <svg className={`w-4 h-4 transition-transform ${showActionsDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {/* Dropdown Menu */}
                    {showActionsDropdown && (
                      <div className="absolute left-0 bottom-full mb-2 w-72 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-gray-200 dark:border-slate-700 overflow-hidden z-50 max-h-96 overflow-y-auto">
                        {/* Processing Status Updates */}
                        <div className="px-3 py-2 bg-gray-100 dark:bg-slate-700 border-b border-gray-200 dark:border-slate-600">
                          <p className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase">Processing Steps</p>
                        </div>
                        
                        <button
                          onClick={() => {
                            setShowActionsDropdown(false);
                            handleStatusUpdate('Under Review', 'Mark as Under Review', 'Application is now being reviewed by the team.', '#3B82F6');
                          }}
                          className="w-full px-4 py-3 text-left hover:bg-blue-50 dark:hover:bg-slate-700 transition-colors flex items-center gap-3 border-b border-gray-100 dark:border-slate-600"
                        >
                          <FileText className="w-5 h-5 text-blue-600" />
                          <span className="font-medium text-gray-700 dark:text-gray-200">Under Review</span>
                        </button>

                        <button
                          onClick={() => {
                            setShowActionsDropdown(false);
                            handleStatusUpdate('Document Verification', 'Document Verification', 'Documents are being verified for completeness and authenticity.', '#8B5CF6');
                          }}
                          className="w-full px-4 py-3 text-left hover:bg-purple-50 dark:hover:bg-slate-700 transition-colors flex items-center gap-3 border-b border-gray-100 dark:border-slate-600"
                        >
                          <FileText className="w-5 h-5 text-purple-600" />
                          <span className="font-medium text-gray-700 dark:text-gray-200">Document Verification</span>
                        </button>

                        <button
                          onClick={() => {
                            setShowActionsDropdown(false);
                            handleStatusUpdate('Payment Verification', 'Verify Payment', 'Payment is being verified.', '#F59E0B');
                          }}
                          className="w-full px-4 py-3 text-left hover:bg-amber-50 dark:hover:bg-slate-700 transition-colors flex items-center gap-3 border-b border-gray-100 dark:border-slate-600"
                        >
                          <Receipt className="w-5 h-5 text-amber-600" />
                          <span className="font-medium text-gray-700 dark:text-gray-200">Payment Verification</span>
                        </button>

                        <button
                          onClick={() => {
                            setShowActionsDropdown(false);
                            handleStatusUpdate('For Manager Approval', 'Send for Manager Approval', 'Application is being sent to manager for approval.', '#6366F1');
                          }}
                          className="w-full px-4 py-3 text-left hover:bg-indigo-50 dark:hover:bg-slate-700 transition-colors flex items-center gap-3 border-b border-gray-100 dark:border-slate-600"
                        >
                          <User className="w-5 h-5 text-indigo-600" />
                          <span className="font-medium text-gray-700 dark:text-gray-200">For Manager Approval</span>
                        </button>

                        <button
                          onClick={() => {
                            setShowActionsDropdown(false);
                            handleStatusUpdate('Ready for Release', 'Mark Ready for Release', 'Permit is ready for release to applicant.', '#10B981');
                          }}
                          className="w-full px-4 py-3 text-left hover:bg-emerald-50 dark:hover:bg-slate-700 transition-colors flex items-center gap-3 border-b border-gray-100 dark:border-slate-600"
                        >
                          <CheckCircle className="w-5 h-5 text-emerald-600" />
                          <span className="font-medium text-gray-700 dark:text-gray-200">Ready for Release</span>
                        </button>

                        {/* Compliance & Actions */}
                        <div className="px-3 py-2 bg-gray-100 dark:bg-slate-700 border-b border-gray-200 dark:border-slate-600">
                          <p className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase">Actions</p>
                        </div>

                        <button
                          onClick={() => {
                            setShowActionsDropdown(false);
                            handleCompliance();
                          }}
                          className="w-full px-4 py-3 text-left hover:bg-yellow-50 dark:hover:bg-slate-700 transition-colors flex items-center gap-3 border-b border-gray-100 dark:border-slate-600"
                        >
                          <AlertCircle className="w-5 h-5 text-yellow-600" />
                          <span className="font-medium text-gray-700 dark:text-gray-200">Mark for Compliance</span>
                        </button>
                        
                        <button
                          onClick={() => {
                            setShowActionsDropdown(false);
                            handleReject();
                          }}
                          className="w-full px-4 py-3 text-left hover:bg-red-50 dark:hover:bg-slate-700 transition-colors flex items-center gap-3 border-b border-gray-100 dark:border-slate-600"
                        >
                          <X className="w-5 h-5 text-red-600" />
                          <span className="font-medium text-gray-700 dark:text-gray-200">Reject Application</span>
                        </button>
                        
                        <button
                          onClick={() => {
                            setShowActionsDropdown(false);
                            handleApprove();
                          }}
                          className="w-full px-4 py-3 text-left hover:bg-green-50 dark:hover:bg-slate-700 transition-colors flex items-center gap-3"
                        >
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <span className="font-medium text-gray-700 dark:text-gray-200">✓ Approve Permit</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Close Button - Always visible */}
                <button 
                  onClick={closeModal}
                  className="px-8 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-lg hover:from-gray-600 hover:to-gray-700 transition-all font-medium shadow-md hover:shadow-lg flex items-center gap-2 ml-auto"
                >
                  <X className="w-5 h-5" />
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download
          </a>
          <button 
            onClick={closeFilePreview}
            className="ml-2 p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
            title="Close preview"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
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
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/30 mb-4">
                <svg className="h-10 w-10 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
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
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
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