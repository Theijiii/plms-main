import { useEffect, useState } from "react";
import { logTx } from '../../../lib/txLogger';

const API_BASE = "http://localhost/eplms-main/backend/barangay_permit";

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

  const getUIStatus = (dbStatus) => {
    if (!dbStatus) return 'For Compliance';
    switch (dbStatus.toLowerCase()) {
      case 'approved': return 'Approved';
      case 'rejected': return 'Rejected';
      case 'pending': return 'For Compliance';
      default: return 'For Compliance';
    }
  };

  const getDBStatus = (uiStatus) => {
    switch (uiStatus) {
      case 'Approved': return 'approved';
      case 'Rejected': return 'rejected';
      case 'For Compliance': return 'pending';
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
            url: `${API_BASE}/uploads/${value}`
          });
        } else if (value && typeof value === 'object') {
          const fileName = value.name || value.filename || key;
          if (fileName && fileName.trim() !== '') {
            fileList.push({
              id: key,
              name: fileName,
              type: getFileType(fileName),
              url: `${API_BASE}/uploads/${fileName}`
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
      case "For Compliance": return "text-[#FDA811] bg-[#FDA811]/10";
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

  // Fetch single permit with detailed information including comments
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

  // Update permit status in database
  const updatePermitStatus = async (permitId, status, comments = '') => {
    try {
      const dbStatus = getDBStatus(status);
      
      const response = await fetch(`${API_BASE}/update_status.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          permit_id: permitId,
          status: dbStatus,
          comments: comments  // FIXED: Changed from review_comments to comments
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

      // Refresh the permits list
      await fetchPermits();
      
      // Fetch the updated permit with comments
      const updatedPermit = await fetchSinglePermit(permitId);
      
      if (updatedPermit) {
        // Update the selected permit in state
        const uiStatus = getUIStatus(updatedPermit.status);
        setSelectedPermit({
          ...updatedPermit,
          uiStatus: uiStatus
        });
      }

      // Clear the comment input
      setActionComment('');

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
    }
  };

  // Save comment only (without changing status)
  const saveCommentOnly = async () => {
    if (!selectedPermit || !actionComment.trim()) return;
    
    try {
      const response = await fetch(`${API_BASE}/update_status.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          permit_id: selectedPermit.permit_id,
          comments: actionComment  // Only send comments, no status change
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

      // Fetch the updated permit with comments
      const updatedPermit = await fetchSinglePermit(selectedPermit.permit_id);
      
      if (updatedPermit) {
        // Update the selected permit in state with new comments
        setSelectedPermit({
          ...updatedPermit,
          uiStatus: getUIStatus(updatedPermit.status)
        });
      }

      // Clear the comment input
      setActionComment('');

      // Log transaction for comment only
      try { 
        logTx({ 
          service: 'barangay', 
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
    await updatePermitStatus(selectedPermit.permit_id, 'For Compliance', actionComment);
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
      // Clean the text and split by the separator pattern
      const cleanedText = commentsText.trim();
      
      // Split by the pattern "--- " (timestamp pattern)
      const commentBlocks = cleanedText.split(/---\s+/);
      
      const formattedComments = [];
      
      for (let i = 1; i < commentBlocks.length; i++) { // Start from 1 to skip empty first item
        const block = commentBlocks[i].trim();
        if (!block) continue;
        
        // Find where the timestamp ends and comment begins
        const timestampEnd = block.indexOf(' ---\n');
        
        if (timestampEnd !== -1) {
          const timestamp = block.substring(0, timestampEnd).trim();
          const comment = block.substring(timestampEnd + 5).trim(); // +5 for " ---\n"
          
          if (comment) {
            formattedComments.push({
              timestamp,
              comment
            });
          }
        } else {
          // If no proper format, treat the whole block as comment
          formattedComments.push({
            timestamp: 'No timestamp',
            comment: block
          });
        }
      }
      
      // Return in reverse order (newest first)
      return formattedComments.reverse();
    } catch (e) {
      console.error('Error formatting comments:', e, 'Comments text:', commentsText);
      return [{
        timestamp: 'Error parsing',
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
          <p className="text-[#FDA811] text-sm font-medium">For Compliance</p>
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
              { key: "pending", label: "For Compliance" },
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
        <div className="p-6 border-b border-gray-200 dark:border-slate-700 bg-gradient-to-r from-[#4CAF50]/5 to-[#4A90E2]/5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {activeTab === "all" && "All Barangay Permits"}
                {activeTab === "approved" && "Approved Permits"}
                {activeTab === "pending" && "For Compliance"}
                {activeTab === "rejected" && "Rejected Permits"}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                {activeTab === "all" && `${total} ${total === 1 ? 'record' : 'records'} found`}
                {activeTab === "approved" && `${approved} ${approved === 1 ? 'record' : 'records'} found`}
                {activeTab === "pending" && `${pending} ${pending === 1 ? 'record' : 'records'} found`}
                {activeTab === "rejected" && `${rejected} ${rejected === 1 ? 'record' : 'records'} found`}
              </p>
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
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {permits
                    .filter(permit => {
                      if (activeTab === "all") return true;
                      if (activeTab === "approved") return permit.status === "approved";
                      if (activeTab === "pending") return permit.status === "pending" || !permit.status;
                      if (activeTab === "rejected") return permit.status === "rejected";
                      return true;
                    })
                    .map(p => (
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
                          View Details
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
// In the modal section, replace the Review Comments section with this:

              {/* Review Comments Section - FIXED: Properly displaying comments */}
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
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    Comments will be saved with timestamp and can be added regardless of status.
                  </p>
                </div>
              </div>



              {/* Action Buttons */}
              <div className="flex gap-3 justify-end pt-6 border-t border-gray-200 dark:border-slate-700">
                {/* Save Comment Button - Show when there's a comment */}
                {actionComment.trim() && (
                  <button 
                    onClick={saveCommentOnly}
                    className="px-6 py-3 bg-[#4A90E2] text-white rounded-lg hover:bg-[#4A90E2]/80 transition-colors font-medium"
                  >
                    Save Comment Only
                  </button>
                )}
                
                {/* Status Update Buttons - Show for pending, hide for approved/rejected */}
                {(selectedPermit.status === "pending" || !selectedPermit.status) ? (
                  <>
                    <button 
                      onClick={handleForCompliance}
                      className="px-6 py-3 bg-[#FDA811] text-white rounded-lg hover:bg-[#4A90E2] transition-colors font-medium"
                    >
                      Mark for Compliance
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
    </div>
  );
}