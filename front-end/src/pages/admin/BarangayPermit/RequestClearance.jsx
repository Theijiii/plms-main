import { useEffect, useState } from "react";
import { logTx } from '../../../lib/txLogger';

const API_BRGY = "http://localhost/eplms-main/backend/barangay_permit";

export default function BarangayPermit() {
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
const sortPermits = (permitsToSort, sortBy) => {
  const sortedPermits = [...permitsToSort];
  
  switch (sortBy) {
    case 'latest':
      return sortedPermits.sort((a, b) => 
        new Date(b.application_date || b.created_at || 0) - 
        new Date(a.application_date || a.created_at || 0)
      );
    
    case 'oldest':
      return sortedPermits.sort((a, b) => 
        new Date(a.application_date || a.created_at || 0) - 
        new Date(b.application_date || b.created_at || 0)
      );
    
    case 'name_asc':
      return sortedPermits.sort((a, b) => {
        const nameA = `${a.first_name} ${a.last_name}`.toLowerCase();
        const nameB = `${b.first_name} ${b.last_name}`.toLowerCase();
        return nameA.localeCompare(nameB);
      });
    
    case 'name_desc':
      return sortedPermits.sort((a, b) => {
        const nameA = `${a.first_name} ${a.last_name}`.toLowerCase();
        const nameB = `${b.first_name} ${b.last_name}`.toLowerCase();
        return nameB.localeCompare(nameA);
      });
    
    case 'status_priority':
      // Custom order: Compliance -> Approved -> Rejected
      const statusOrder = { 'pending': 1, 'approved': 2, 'rejected': 3 };
      return sortedPermits.sort((a, b) => 
        (statusOrder[a.status] || 4) - (statusOrder[b.status] || 4)
      );
    
    default:
      return sortedPermits;
  }
};

// Search function
const searchPermits = (permitsToSearch, query) => {
  if (!query.trim()) return permitsToSearch;
  
  const searchTerm = query.toLowerCase();
  return permitsToSearch.filter(permit => {
    const fullName = `${permit.first_name} ${permit.middle_name} ${permit.last_name} ${permit.suffix}`.toLowerCase();
    const permitId = `BP-${String(permit.permit_id).padStart(4, '0')}`.toLowerCase();
    const barangay = (permit.barangay || '').toLowerCase();
    const purpose = (permit.purpose || '').toLowerCase();
    const email = (permit.email || '').toLowerCase();
    const mobile = (permit.mobile_number || '').toLowerCase();
    
    return (
      fullName.includes(searchTerm) ||
      permitId.includes(searchTerm) ||
      barangay.includes(searchTerm) ||
      purpose.includes(searchTerm) ||
      email.includes(searchTerm) ||
      mobile.includes(searchTerm)
    );
  });
};

// Combined filter function
const getFilteredPermits = () => {
  let filtered = permits;
  
  // Apply tab filter
  if (activeTab !== "all") {
    filtered = filtered.filter(permit => {
      if (activeTab === "approved") return permit.status === "approved";
      if (activeTab === "pending") return permit.status === "pending" || !permit.status;
      if (activeTab === "rejected") return permit.status === "rejected";
      return true;
    });
  }
  
  // Apply search filter
  filtered = searchPermits(filtered, searchQuery);
  
  // Apply sorting
  filtered = sortPermits(filtered, sortOption);
  
  return filtered;
};

// Helper function for sort labels
const getSortLabel = (option) => {
  switch (option) {
    case 'latest': return 'Latest First';
    case 'oldest': return 'Oldest First';
    case 'name_asc': return 'Name A-Z';
    case 'name_desc': return 'Name Z-A';
    case 'status_priority': return 'Status Priority';
    default: return 'Default';
  }
};
  const getUIStatus = (dbStatus) => {
    if (!dbStatus) return 'Compliance';
    switch (dbStatus.toLowerCase()) {
      case 'approved': return 'Approved';
      case 'rejected': return 'Rejected';
      case 'pending': return 'Compliance';
      default: return 'Compliance';
    }
  };

  const getDBStatus = (uiStatus) => {
    switch (uiStatus) {
      case 'Approved': return 'approved';
      case 'Rejected': return 'rejected';
      case 'Compliance': return 'pending';
      default: return 'pending';
    }
  };

  const parseAttachments = (attachmentsData) => {
    if (!attachmentsData) return [];
    
    try {
      let attachments;
      
      if (typeof attachmentsData === 'object' && attachmentsData !== null) {
        attachments = attachmentsData;
      } else if (typeof attachmentsData === 'string' && attachmentsData.trim() !== '') {
        attachments = JSON.parse(attachmentsData);
      } else {
        console.warn('Invalid attachments format:', attachmentsData);
        return [];
      }
      
      const fileList = [];
      
      Object.entries(attachments).forEach(([key, value]) => {
        if (value && typeof value === 'string' && value.trim() !== '') {
          fileList.push({
            id: key,
            name: value,
            type: getFileType(value),
            url: `${API_BRGY}/uploads/${value}`
          });
        } else if (value && typeof value === 'object') {
          const fileName = value.name || value.filename || key;
          if (fileName && fileName.trim() !== '') {
            fileList.push({
              id: key,
              name: fileName,
              type: getFileType(fileName),
              url: `${API_BRGY}/uploads/${fileName}`
            });
          }
        }
      });
      
      return fileList;
    } catch (e) {
      console.error('Error parsing attachments:', e, 'Data:', attachmentsData);
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
      case 'doc': return 'application/msword';
      case 'docx': return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      case 'txt': return 'text/plain';
      case 'csv': return 'text/csv';
      case 'xls':
      case 'xlsx': return 'application/vnd.ms-excel';
      case 'zip': return 'application/zip';
      case 'rar': return 'application/x-rar-compressed';
      default: return 'application/octet-stream';
    }
  };

  const getStatusColor = (status) => {
    const uiStatus = getUIStatus(status);
    switch (uiStatus) {
      case "Approved": return "text-[#4CAF50] bg-[#4CAF50]/10";
      case "Rejected": return "text-[#E53935] bg-[#E53935]/10";
      case "Compliance": return "text-[#FDA811] bg-[#FDA811]/10";
      default: return "text-gray-600 bg-gray-100";
    }
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
      
      const response = await fetch(`${API_BRGY}/admin_fetch.php`);
      
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

  // Fetch single permit with detailed information including comments
  const fetchSinglePermit = async (permitId) => {
    try {
      const response = await fetch(`${API_BRGY}/fetch_single.php?permit_id=${permitId}`);
      
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

  // Update permit status in database
// Update permit status in database - MODIFIED to handle comments immediately with proper timestamp
const updatePermitStatus = async (permitId, status, comments = '') => {
  try {
    const dbStatus = getDBStatus(status);
    
    // If there's a comment, add timestamp
    let commentWithTimestamp = '';
    if (comments.trim()) {
      const timestamp = new Date().toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      });
      commentWithTimestamp = `--- ${timestamp} ---\n${comments}\n`;
    }
    
    const response = await fetch(`${API_BRGY}/update_status.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        permit_id: permitId,
        status: dbStatus,
        comments: commentWithTimestamp
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

    // If there's a comment, update it immediately in the modal
    if (comments.trim() && selectedPermit) {
      const updatedComments = selectedPermit.comments 
        ? selectedPermit.comments + commentWithTimestamp
        : commentWithTimestamp;

      // Update the selected permit in state immediately
      setSelectedPermit(prev => ({
        ...prev,
        comments: updatedComments,
        status: dbStatus,
        uiStatus: status
      }));
    } else if (selectedPermit) {
      // Just update the status if no comment
      setSelectedPermit(prev => ({
        ...prev,
        status: dbStatus,
        uiStatus: status
      }));
    }

    // Refresh the permits list
    await fetchPermits();

    // Clear the comment input
    setActionComment('');

    // Show success message
    alert(`Permit ${status.toLowerCase()} successfully!`);

    // Log transaction
    try { 
      logTx({ 
        service: 'barangay', 
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

  // Save comment only (without changing status)
const saveCommentOnly = async () => {
  if (!selectedPermit || !actionComment.trim()) return;
  
  try {
    // Create timestamp in a standard format
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
    
    const newCommentBlock = `--- ${timestamp} ---\n${actionComment}\n`;
    
    const response = await fetch(`${API_BRGY}/update_status.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        permit_id: selectedPermit.permit_id,
        comments: newCommentBlock
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

    // Update the selected permit in state immediately
    const updatedComments = selectedPermit.comments 
      ? newCommentBlock + selectedPermit.comments  // NEW comments at TOP
      : newCommentBlock;

    setSelectedPermit({
      ...selectedPermit,
      comments: updatedComments
    });

    // Also update the main permits list
    setPermits(prevPermits => 
      prevPermits.map(p => 
        p.permit_id === selectedPermit.permit_id 
          ? { ...p, comments: updatedComments }
          : p
      )
    );

    // Clear the comment input
    setActionComment('');

    // Show success modal instead of alert
    setSuccessMessage('Comment saved successfully!');
    setShowSuccessModal(true);

    // Log transaction
    try { 
      logTx({ 
        service: 'barangay', 
        permitId: selectedPermit.permit_id, 
        action: 'add_comment',
        comment: actionComment,
        timestamp: timestamp
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
  }, []);

  const openModal = async (permit) => {
    try {
      // First fetch detailed permit information including comments
      const detailedPermit = await fetchSinglePermit(permit.permit_id);
      
      if (detailedPermit) {
        const uiStatus = getUIStatus(detailedPermit.status);
        setSelectedPermit({
          ...detailedPermit,
          uiStatus: uiStatus
        });
      } else {
        // Fallback to the basic permit data if detailed fetch fails
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
      // Fallback to basic data
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
    await updatePermitStatus(selectedPermit.permit_id, 'Approved', actionComment);
  };

  const handleReject = async () => {
    if (!selectedPermit) return;
    await updatePermitStatus(selectedPermit.permit_id, 'Rejected', actionComment);
  };

  const handleForCompliance = async () => {
    if (!selectedPermit) return;
    await updatePermitStatus(selectedPermit.permit_id, 'Compliance', actionComment);
  };

  const viewFile = (file) => {
    setSelectedFile(file);
    setShowFilePreview(true);
  };

  const closeFilePreview = () => {
    setSelectedFile(null);
    setShowFilePreview(false);
  };

// Function to format and display comments with timestamps - IMPROVED VERSION
const formatComments = (commentsText) => {
  if (!commentsText || typeof commentsText !== 'string') return [];
  
  try {
    // Clean the text
    const cleanedText = commentsText.trim();
    if (!cleanedText) return [];
    
    // Split by the timestamp pattern "--- [timestamp] ---"
    const commentBlocks = cleanedText.split(/(?=---\s+.+?\s+---)/g);
    
    const formattedComments = [];
    
    for (let block of commentBlocks) {
      block = block.trim();
      if (!block) continue;
      
      // Extract timestamp and comment using regex
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
        // If no timestamp format, treat entire block as comment
        formattedComments.push({
          timestamp: 'Just now',
          comment: block
        });
      }
    }
    
    // Return in the order they appear (newest first since we prepend new comments)
    return formattedComments;
  } catch (e) {
    console.error('Error formatting comments:', e);
    return [{
      timestamp: 'Recent',
      comment: commentsText
    }];
  }
};
  // Calculate counts
  const total = permits.length;
  const approved = permits.filter(p => p.status === "approved").length;
  const rejected = permits.filter(p => p.status === "rejected").length;
  const pending = permits.filter(p => p.status === "pending" || !p.status).length;

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
          Barangay Permits Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage and track all barangay permit applications
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-[#4CAF50]/10 p-4 rounded-lg border border-[#4CAF50]/20">
          <p className="text-[#4CAF50] text-sm font-medium">Total Permits</p>
          <p className="text-[#4CAF50] text-2xl font-bold">{total}</p>
        </div>
        <div className="bg-[#4A90E2]/10 p-4 rounded-lg border border-[#4A90E2]/20">
          <p className="text-[#4A90E2] text-sm font-medium">Approved</p>
          <p className="text-[#4A90E2] text-2xl font-bold">{approved}</p>
        </div>
        <div className="bg-[#FDA811]/10 p-4 rounded-lg border border-[#FDA811]/20">
          <p className="text-[#FDA811] text-sm font-medium">Compliance</p>
          <p className="text-[#FDA811] text-2xl font-bold">{pending}</p>
        </div>
        <div className="bg-[#E53935]/10 p-4 rounded-lg border border-[#E53935]/20">
          <p className="text-[#E53935] text-sm font-medium">Rejected</p>
          <p className="text-[#E53935] text-2xl font-bold">{rejected}</p>
        </div>
      </div>

      {/* 🧭 Tab Navigation */}
      <div className="mb-6 bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 shadow-sm">
        <div className="border-b border-gray-200 dark:border-slate-700 overflow-x-auto">
          <nav className="flex space-x-6 px-6 min-w-max">
            {[
              { key: "all", label: "All Permits" },
              { key: "approved", label: "Approved" },
              { key: "pending", label: "Compliance" },
              { key: "rejected", label: "Rejected" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`py-4 px-2 border-b-2 font-medium text-sm flex items-center gap-2 transition-all ${getTabBorderColor(tab.key)} ${getTabTextColor(tab.key)}`}
              >
                {tab.label}
                <span className={`px-2 py-1 text-xs rounded-full ${getTabBadgeColor(tab.key)}`}>
                  {tab.key === "all" && total}
                  {tab.key === "approved" && approved}
                  {tab.key === "pending" && pending}
                  {tab.key === "rejected" && rejected}
                </span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content Header */}
{/* Tab Content Header - Updated with filters */}
<div className="p-6 border-b border-gray-200 dark:border-slate-700 bg-gradient-to-r from-[#4CAF50]/5 to-[#4A90E2]/5">
  <div className="flex items-center justify-between">
    <div>
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
        {activeTab === "all" && "All Barangay Permits"}
        {activeTab === "approved" && "Approved Permits"}
        {activeTab === "pending" && "Compliance"}
        {activeTab === "rejected" && "Rejected Permits"}
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
          placeholder="Search permits..."
          className="pl-10 pr-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent w-64"
        />
        <svg 
          className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
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
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
        Clear search
      </button>
    </div>
  )}
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
              <div className="text-gray-400 text-6xl mb-4">📋</div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No barangay permits found
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                There are currently no barangay permits in the system.
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
                      Permit No.
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Applicant
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Barangay
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Purpose
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
{/* Table Body - Updated to use filtered permits */}
<tbody className="divide-y divide-gray-200 dark:divide-gray-700">
  {getFilteredPermits().map(p => (
    <tr key={p.permit_id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
      <td className="px-6 py-4 text-sm font-mono text-gray-600 dark:text-gray-300">
        BP-{String(p.permit_id).padStart(4, '0')}
      </td>
      <td className="px-6 py-4 text-sm text-gray-900 dark:text-white font-medium">
        {p.first_name} {p.middle_name} {p.last_name} {p.suffix}
      </td>
      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
        {p.barangay || 'N/A'}
      </td>
      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
        {p.purpose || 'N/A'}
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
      <td className="px-6 py-4 text-sm">
        <button
          onClick={() => openModal(p)}
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
                  <span className={`mt-2 px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(selectedPermit.status)}`}>
                    {selectedPermit.uiStatus || getUIStatus(selectedPermit.status)}
                  </span>
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
                  <div>
                    <label className="text-sm font-medium text-gray-500">Gender</label>
                    <p className="text-gray-900 dark:text-white mt-1">
                      {selectedPermit.gender || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Civil Status</label>
                    <p className="text-gray-900 dark:text-white mt-1">
                      {selectedPermit.civil_status || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Nationality</label>
                    <p className="text-gray-900 dark:text-white mt-1">
                      {selectedPermit.nationality || 'N/A'}
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
                    <label className="text-sm font-medium text-gray-500">Duration</label>
                    <p className="text-gray-900 dark:text-white mt-1">
                      {selectedPermit.duration || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">ID Type</label>
                    <p className="text-gray-900 dark:text-white mt-1">
                      {selectedPermit.id_type || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">ID Number</label>
                    <p className="text-gray-900 dark:text-white mt-1">
                      {selectedPermit.id_number || 'N/A'}
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

              {/* Submitted Attachments */}
              {parseAttachments(selectedPermit.attachments).length > 0 && (
                <div className="border-t border-gray-200 dark:border-slate-700 pt-6">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Submitted Files</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {parseAttachments(selectedPermit.attachments).map((file) => (
                      <div key={file.id} className="flex items-center justify-between p-3 border border-gray-200 dark:border-slate-600 rounded-lg">
                        <div className="flex items-center gap-2">
                          {file.type.includes('image') ? (
                            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                              <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          ) : (
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                              <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </div>
                          )}
                          <span className="text-sm text-gray-700 dark:text-gray-300">{file.name}</span>
                        </div>
                        <button 
                          onClick={() => viewFile(file)}
                          className="px-3 py-1 text-xs bg-[#4CAF50] text-white rounded hover:bg-[#FDA811] transition-colors"
                        >
                          View
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Review Comments Section - FIXED: Properly displaying comments */}  
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
  
  {/* Display all comments in one box */}
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
              <div className="flex gap-3 justify-end pt-6 border-t border-gray-200 dark:border-slate-700">

                
                {/* Status Update Buttons - Show for pending, hide for approved/rejected */}
                {(selectedPermit.status === "pending" || !selectedPermit.status) ? (
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-4xl bg-white dark:bg-slate-800 rounded-xl shadow-2xl">
            <div className="p-4 border-b border-gray-200 dark:border-slate-700 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{selectedFile.name}</h3>
              <button 
                onClick={closeFilePreview}
                className="p-2 bg-[#4CAF50] text-white rounded-lg hover:bg-[#FDA811] transition-colors"
              >
                <span className="text-xl">×</span>
              </button>
            </div>
            <div className="p-4 max-h-[80vh] overflow-auto">
              {selectedFile.type.includes('image') ? (
                <div className="flex justify-center">
                  <img 
                    src={selectedFile.url} 
                    alt={selectedFile.name}
                    className="max-w-full h-auto rounded-lg shadow-lg"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="400" height="300" fill="%23f3f4f6"/><text x="200" y="150" text-anchor="middle" font-family="Arial" font-size="16" fill="%236b7280">Image not available</text></svg>';
                    }}
                  />
                </div>
              ) : selectedFile.type === 'application/pdf' ? (
                <div className="w-full h-[70vh]">
                  <iframe 
                    src={selectedFile.url} 
                    className="w-full h-full rounded-lg"
                    title={selectedFile.name}
                  />
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-6xl mb-4">📄</div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    File Preview Not Available
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    This file type cannot be previewed in the browser.
                  </p>
                  <a 
                    href={selectedFile.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-[#4CAF50] text-white rounded-lg hover:bg-[#FDA811] transition-colors"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download File
                  </a>
                </div>
              )}
            </div>
            <div className="p-4 border-t border-gray-200 dark:border-slate-700 flex justify-between">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                File type: {selectedFile.type}
              </div>
              <button 
                onClick={closeFilePreview}
                className="px-4 py-2 bg-[#4CAF50] text-white rounded-lg hover:bg-[#FDA811] transition-colors"
              >
                Close Preview
              </button>
            </div>
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