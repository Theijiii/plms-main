import { useEffect, useState, useMemo, useCallback } from "react";
import Swal from "sweetalert2";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import {
  Search,
  Download,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  Eye,
  DownloadCloud,
  User,
  Phone,
  Mail,
  Award,
  CreditCard,
  File,
  X,
  ArrowUpDown,
  UserCheck,
  Shield,
  Calendar,
  Briefcase,
  Image as ImageIcon
} from "lucide-react";

export default function ProfessionalRegistrationAdmin() {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [selectedRegistration, setSelectedRegistration] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("id");
  const [sortDirection, setSortDirection] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilePreview, setShowFilePreview] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [exporting, setExporting] = useState(false);
  const [exportType, setExportType] = useState("");

  const ITEMS_PER_PAGE = 10;
  const API_BASE = "/backend/building_permit";

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

  const fetchRegistrations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const url = `${API_BASE}/professional_registration.php`;
      const response = await fetch(url, {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });
      
      if (!response.ok) throw new Error(`Server error: ${response.status}`);
      
      const data = await response.json();
      
      if (data.success) {
        const transformedData = data.data.map((r) => ({
          id: r.id,
          registration_id: r.registration_id,
          full_name: `${r.first_name || ''} ${r.middle_initial ? r.middle_initial + '.' : ''} ${r.last_name || ''} ${r.suffix || ''}`.trim(),
          first_name: r.first_name,
          middle_initial: r.middle_initial,
          last_name: r.last_name,
          suffix: r.suffix,
          birth_date: r.birth_date,
          contact_number: r.contact_number || 'N/A',
          email: r.email || 'N/A',
          prc_license: r.prc_license || 'N/A',
          prc_expiry: r.prc_expiry,
          ptr_number: r.ptr_number || 'N/A',
          tin: r.tin || 'N/A',
          profession: r.profession || 'N/A',
          role_in_project: r.role_in_project || 'N/A',
          prc_id_file: r.prc_id_file,
          ptr_file: r.ptr_file,
          signature_file: r.signature_file,
          status: r.status || 'pending',
          date_submitted: r.date_submitted,
          date_approved: r.date_approved,
          date_rejected: r.date_rejected,
          admin_remarks: r.admin_remarks || '',
        }));
        setRegistrations(transformedData);
      } else {
        throw new Error(data.message || "Failed to fetch data");
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(`Failed to load data: ${err.message}`);
      setRegistrations([]);
      Swal.fire({
        icon: 'error',
        title: 'Failed to Load Data',
        text: `Unable to fetch professional registrations: ${err.message}`,
        confirmButtonColor: '#4CAF50',
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRegistrations();
  }, [fetchRegistrations]);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "approved": return "text-[#4CAF50] bg-[#4CAF50]/10";
      case "rejected": return "text-[#E53935] bg-[#E53935]/10";
      case "pending": return "text-[#FDA811] bg-[#FDA811]/10";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const filteredRegistrations = useMemo(() => {
    let filtered = [...registrations];
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(r =>
        r.full_name?.toLowerCase().includes(term) ||
        r.registration_id?.toLowerCase().includes(term) ||
        r.profession?.toLowerCase().includes(term) ||
        r.prc_license?.toLowerCase().includes(term) ||
        r.email?.toLowerCase().includes(term)
      );
    }
    
    if (activeTab !== "all") {
      filtered = filtered.filter(r => r.status?.toLowerCase() === activeTab.toLowerCase());
    }
    
    if (sortField) {
      filtered.sort((a, b) => {
        let valA = a[sortField] || '';
        let valB = b[sortField] || '';
        if (typeof valA === 'string') valA = valA.toLowerCase();
        if (typeof valB === 'string') valB = valB.toLowerCase();
        if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
        if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }
    
    return filtered;
  }, [registrations, searchTerm, activeTab, sortField, sortDirection]);

  const totalPages = Math.ceil(filteredRegistrations.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedRegistrations = filteredRegistrations.slice(startIndex, endIndex);

  const stats = useMemo(() => ({
    total: registrations.length,
    pending: registrations.filter(r => r.status?.toLowerCase() === 'pending').length,
    approved: registrations.filter(r => r.status?.toLowerCase() === 'approved').length,
    rejected: registrations.filter(r => r.status?.toLowerCase() === 'rejected').length,
  }), [registrations]);

  const tabCategories = [
    { key: "all", label: "All Registrations" },
    { key: "pending", label: "Pending" },
    { key: "approved", label: "Approved" },
    { key: "rejected", label: "Rejected" },
  ];

  const countByStatus = useMemo(() => {
    const counts = { all: registrations.length };
    tabCategories.forEach(t => {
      if (t.key !== 'all') {
        counts[t.key] = registrations.filter(r => r.status?.toLowerCase() === t.key).length;
      }
    });
    return counts;
  }, [registrations]);

  const handleView = (registration) => {
    setSelectedRegistration(registration);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedRegistration(null);
    setShowFilePreview(false);
    setSelectedFile(null);
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleApprove = () => {
    Swal.fire({
      title: 'Approve this registration?',
      text: 'This will mark the professional registration as approved.',
      icon: 'question',
      input: 'textarea',
      inputLabel: 'Notes (optional)',
      inputPlaceholder: 'Add approval notes...',
      showCancelButton: true,
      confirmButtonText: 'Approve',
      confirmButtonColor: '#4CAF50',
    }).then((result) => {
      if (result.isConfirmed) {
        setRegistrations(prev => prev.map(r =>
          r.id === selectedRegistration.id
            ? { ...r, status: 'approved', admin_remarks: result.value || r.admin_remarks, date_approved: new Date().toISOString() }
            : r
        ));
        setSelectedRegistration(prev => ({ ...prev, status: 'approved' }));
        Swal.fire('Approved!', 'The registration has been approved.', 'success');
      }
    });
  };

  const handleReject = () => {
    Swal.fire({
      title: 'Reject this registration?',
      text: 'This will mark the professional registration as rejected.',
      icon: 'warning',
      input: 'textarea',
      inputLabel: 'Reason for rejection',
      inputPlaceholder: 'Enter rejection reason...',
      inputValidator: (value) => {
        if (!value) return 'Please provide a reason for rejection.';
      },
      showCancelButton: true,
      confirmButtonText: 'Reject',
      confirmButtonColor: '#E53935',
    }).then((result) => {
      if (result.isConfirmed) {
        setRegistrations(prev => prev.map(r =>
          r.id === selectedRegistration.id
            ? { ...r, status: 'rejected', admin_remarks: result.value || r.admin_remarks, date_rejected: new Date().toISOString() }
            : r
        ));
        setSelectedRegistration(prev => ({ ...prev, status: 'rejected' }));
        Swal.fire('Rejected', 'The registration has been rejected.', 'success');
      }
    });
  };

  const viewFile = (filePath, fileName) => {
    if (!filePath) {
      Swal.fire('Error', 'File not found', 'error');
      return;
    }
    setSelectedFile({ path: `${API_BASE}/${filePath}`, name: fileName });
    setShowFilePreview(true);
  };

  const exportToCSV = () => {
    setExporting(true);
    setExportType("csv");
    const headers = ["Registration ID", "Name", "Profession", "Role", "PRC License", "PRC Expiry", "PTR", "TIN", "Contact", "Email", "Status", "Date Submitted"];
    const csvContent = [
      headers.join(","),
      ...filteredRegistrations.map(r => [
        r.registration_id,
        r.full_name,
        r.profession,
        r.role_in_project,
        r.prc_license,
        formatDate(r.prc_expiry),
        r.ptr_number,
        r.tin,
        r.contact_number,
        r.email,
        r.status,
        formatDate(r.date_submitted)
      ].map(field => `"${field || ''}"`).join(","))
    ].join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `professional-registrations-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    setExporting(false);
    setExportType("");
  };

  const exportToPDF = async () => {
    setExporting(true);
    setExportType("pdf");
    try {
      Swal.fire({
        title: 'Generating PDF...',
        text: 'Please wait...',
        allowOutsideClick: false,
        showConfirmButton: false,
        didOpen: () => Swal.showLoading()
      });

      await new Promise(r => setTimeout(r, 300));
      
      const pdfContainer = document.createElement('div');
      pdfContainer.style.cssText = 'position:absolute;left:-9999px;width:1200px;background:#FBFBFB;padding:30px;font-family:Arial,sans-serif;';
      pdfContainer.innerHTML = `
        <div style="margin-bottom:20px;">
          <h1 style="color:#4D4A4A;font-size:24px;margin:0 0 5px 0;">Professional Registration Report</h1>
          <p style="color:#666;margin:0;">Generated on ${new Date().toLocaleDateString()} • ${filteredRegistrations.length} registrations</p>
        </div>
        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:20px;">
          ${[
            { title: 'Total', value: stats.total, color: '#4CAF50' },
            { title: 'Pending', value: stats.pending, color: '#FDA811' },
            { title: 'Approved', value: stats.approved, color: '#4A90E2' },
            { title: 'Rejected', value: stats.rejected, color: '#E53935' }
          ].map(s => `<div style="border:2px solid #E9E7E7;border-radius:8px;padding:15px;background:white;"><p style="color:#666;font-size:11px;margin:0 0 5px 0;">${s.title}</p><p style="color:${s.color};font-size:22px;font-weight:bold;margin:0;">${s.value}</p></div>`).join('')}
        </div>
        <table style="width:100%;border-collapse:collapse;font-size:10px;">
          <thead><tr style="background:#f5f5f5;">
            ${["ID", "Name", "Profession", "Role", "PRC License", "Status"].map(h => `<th style="padding:8px;border:1px solid #ddd;text-align:left;">${h}</th>`).join('')}
          </tr></thead>
          <tbody>
            ${filteredRegistrations.slice(0, 50).map(r => `<tr>${[
              r.registration_id,
              r.full_name,
              r.profession,
              r.role_in_project,
              r.prc_license,
              r.status
            ].map(v => `<td style="padding:6px;border:1px solid #ddd;">${v || ''}</td>`).join('')}</tr>`).join('')}
          </tbody>
        </table>
      `;
      
      document.body.appendChild(pdfContainer);
      await new Promise(r => setTimeout(r, 100));
      
      const canvas = await html2canvas(pdfContainer, {
        scale: 2,
        backgroundColor: "#FBFBFB",
        logging: false
      });
      
      document.body.removeChild(pdfContainer);
      
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pdfWidth - 20;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      let heightLeft = imgHeight;
      let position = 10;
      
      pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;
      
      while (heightLeft > 0) {
        position = heightLeft - imgHeight + 10;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;
      }
      
      pdf.save(`professional-registrations-${new Date().toISOString().split("T")[0]}.pdf`);
      Swal.fire({ icon: 'success', title: 'PDF Downloaded!', timer: 2000, showConfirmButton: false });
    } catch (error) {
      console.error("PDF error:", error);
      Swal.fire({ title: "Export Failed", text: error.message, icon: "error" });
    } finally {
      setExporting(false);
      setExportType("");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FBFBFB] p-6 flex items-center justify-center font-poppins">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4CAF50] mx-auto"></div>
          <p className="mt-4 text-[#4D4A4A]">Loading professional registrations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FBFBFB] p-4 md:p-6 font-poppins">
      {error && (
        <div className="mb-6 p-4 bg-[#E53935] bg-opacity-20 border border-[#E53935] border-opacity-30 rounded-lg">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-[#E53935] mr-3" />
            <div className="flex-1">
              <p className="text-[#4D4A4A]">{error}</p>
            </div>
            <button onClick={fetchRegistrations} className="text-sm text-[#4CAF50] hover:underline">Retry</button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#4D4A4A] font-montserrat">Professional Registration</h1>
            <p className="text-[#4D4A4A] text-opacity-70 mt-1">Manage and review professional registrations for building permits</p>
          </div>
          <div className="flex items-center space-x-3 mt-4 md:mt-0">
            <button
              onClick={fetchRegistrations}
              className="p-2 rounded-lg bg-white border border-[#E9E7E7] hover:bg-gray-50 transition-colors"
              title="Refresh"
            >
              <RefreshCw className="w-5 h-5 text-[#4D4A4A]" />
            </button>
            <button
              onClick={exportToCSV}
              disabled={exporting}
              className="px-4 py-2 bg-[#4CAF50] text-white rounded-lg hover:bg-opacity-90 transition-colors flex items-center space-x-2 disabled:opacity-50 font-montserrat"
            >
              <DownloadCloud className="w-5 h-5" />
              <span>{exporting && exportType === "csv" ? "Exporting..." : "CSV"}</span>
            </button>
            <button
              onClick={exportToPDF}
              disabled={exporting}
              className="px-4 py-2 bg-[#E53935] text-white rounded-lg hover:bg-opacity-90 transition-colors flex items-center space-x-2 disabled:opacity-50 font-montserrat"
            >
              <File className="w-5 h-5" />
              <span>{exporting && exportType === "pdf" ? "Generating..." : "PDF"}</span>
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { title: "Total", value: stats.total, icon: FileText, color: "#4CAF50" },
            { title: "Pending", value: stats.pending, icon: Clock, color: "#FDA811" },
            { title: "Approved", value: stats.approved, icon: CheckCircle, color: "#4A90E2" },
            { title: "Rejected", value: stats.rejected, icon: XCircle, color: "#E53935" },
          ].map((s, idx) => (
            <div key={idx} className="bg-white rounded-lg p-4 shadow-sm border border-[#E9E7E7]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-[#4D4A4A] text-opacity-70 font-poppins">{s.title}</p>
                  <p className="text-2xl font-bold text-[#4D4A4A] mt-1 font-montserrat">{s.value}</p>
                </div>
                <div className="p-2 rounded-lg" style={{ backgroundColor: s.color }}>
                  <s.icon className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Search & Filters */}
      <div className="mb-6 bg-white rounded-lg p-4 shadow-sm border border-[#E9E7E7]">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#4D4A4A] text-opacity-50 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name, registration ID, profession, PRC license..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-[#E9E7E7] bg-white text-[#4D4A4A] focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent font-poppins"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>
      </div>

      {/* Tab Navigation & Table */}
      <div className="bg-white rounded-lg shadow-sm border border-[#E9E7E7] overflow-hidden">
        <div className="p-6 border-b border-[#E9E7E7]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-[#4D4A4A] font-montserrat">Registrations</h3>
              <p className="text-sm text-[#4D4A4A] text-opacity-70">
                Showing {startIndex + 1}-{Math.min(endIndex, filteredRegistrations.length)} of {filteredRegistrations.length}
              </p>
            </div>
          </div>
          <nav className="flex space-x-4 overflow-x-auto">
            {tabCategories.map((tab) => (
              <button
                key={tab.key}
                onClick={() => {
                  setActiveTab(tab.key);
                  setCurrentPage(1);
                }}
                className={`py-2 px-3 border-b-2 font-medium text-sm flex items-center gap-2 transition-all whitespace-nowrap ${
                  activeTab === tab.key
                    ? "border-[#4CAF50] text-[#4CAF50]"
                    : "border-transparent text-[#4D4A4A] hover:text-[#4CAF50]"
                }`}
              >
                {tab.label}
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    activeTab === tab.key
                      ? "bg-[#4CAF50] text-white"
                      : "bg-[#FBFBFB] text-[#4D4A4A] border border-[#E9E7E7]"
                  }`}
                >
                  {countByStatus[tab.key] || 0}
                </span>
              </button>
            ))}
          </nav>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#FBFBFB]">
              <tr>
                {[
                  { key: "registration_id", label: "ID" },
                  { key: "full_name", label: "Professional" },
                  { key: "profession", label: "Profession" },
                  { key: "role_in_project", label: "Role" },
                  { key: "prc_license", label: "PRC License" },
                  { key: "prc_expiry", label: "Expiry" },
                  { key: "status", label: "Status" },
                  { key: null, label: "Actions" },
                ].map((col) => (
                  <th
                    key={col.label}
                    className="px-6 py-3 text-left text-xs font-medium text-[#4D4A4A] uppercase tracking-wider font-montserrat"
                  >
                    {col.key ? (
                      <button
                        onClick={() => handleSort(col.key)}
                        className="flex items-center gap-1 hover:text-[#4CAF50] transition-colors"
                      >
                        {col.label}
                        <ArrowUpDown className="w-3 h-3" />
                      </button>
                    ) : (
                      col.label
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E9E7E7]">
              {paginatedRegistrations.length > 0 ? (
                paginatedRegistrations.map((reg) => (
                  <tr key={reg.id} className="hover:bg-[#FBFBFB] transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-mono text-sm text-[#4D4A4A]">{reg.registration_id}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-[#4D4A4A] font-montserrat">{reg.full_name}</p>
                        <p className="text-sm text-[#4D4A4A] text-opacity-70">{reg.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                        {reg.profession}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[#4D4A4A] text-sm">{reg.role_in_project}</td>
                    <td className="px-6 py-4 text-[#4D4A4A] text-sm font-mono">{reg.prc_license}</td>
                    <td className="px-6 py-4 text-[#4D4A4A] text-sm">{formatDate(reg.prc_expiry)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 text-xs font-bold rounded-full ${getStatusColor(reg.status)}`}>
                        {reg.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleView(reg)}
                        title="View Details"
                        className="p-2 bg-[#4A90E2] text-white rounded-lg hover:bg-[#FDA811]/80 transition-colors"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center">
                    <UserCheck className="w-12 h-12 text-[#E9E7E7] mx-auto mb-4" />
                    <p className="text-[#4D4A4A] text-opacity-70">No registrations match your search</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {filteredRegistrations.length > ITEMS_PER_PAGE && (
          <div className="p-5 border-t border-[#E9E7E7]">
            <div className="flex items-center justify-between">
              <p className="text-sm text-[#4D4A4A] text-opacity-70">
                Page {currentPage} of {totalPages}
              </p>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 text-sm border border-[#E9E7E7] rounded-lg hover:bg-[#FBFBFB] transition-colors disabled:opacity-50"
                >
                  Previous
                </button>
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  const page = currentPage <= 3 ? i + 1 : currentPage + i - 2;
                  if (page < 1 || page > totalPages) return null;
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                        currentPage === page
                          ? 'bg-[#4CAF50] text-white'
                          : 'border border-[#E9E7E7] hover:bg-[#FBFBFB]'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 text-sm border border-[#E9E7E7] rounded-lg hover:bg-[#FBFBFB] transition-colors disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Detailed Modal */}
      {showModal && selectedRegistration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md p-4 overflow-auto animate-fadeIn">
          <div className="w-full max-w-5xl bg-white dark:bg-slate-800 rounded-2xl shadow-2xl transform transition-all max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 z-10 p-6 bg-gradient-to-r from-gray-50 via-white to-gray-50 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800 border-b-4 border-[#4CAF50]">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="bg-gradient-to-br from-[#4CAF50] to-[#45a049] p-3 rounded-2xl shadow-xl">
                    <UserCheck className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Professional Registration</h2>
                    <p className="text-sm text-gray-500">Review and process registration</p>
                  </div>
                </div>
                <button
                  onClick={closeModal}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-md border-l-4 border-blue-500">
                  <p className="text-xs font-medium text-gray-500 uppercase mb-1">Registration ID</p>
                  <p className="text-lg font-bold text-gray-800 dark:text-white font-mono">
                    {selectedRegistration.registration_id}
                  </p>
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-md border-l-4 border-purple-500">
                  <p className="text-xs font-medium text-gray-500 uppercase mb-1">Date Submitted</p>
                  <p className="text-lg font-bold text-gray-800 dark:text-white">
                    {formatDate(selectedRegistration.date_submitted)}
                  </p>
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-md border-l-4 border-green-500">
                  <p className="text-xs font-medium text-gray-500 uppercase mb-1">Status</p>
                  <span className={`inline-block px-3 py-1 text-sm font-bold rounded-full ${getStatusColor(selectedRegistration.status)}`}>
                    {selectedRegistration.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-8 space-y-8 bg-gradient-to-b from-gray-50 to-white dark:from-slate-900 dark:to-slate-800">
              {/* Personal Information */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 border-2 border-blue-100 dark:border-slate-700">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-xl shadow-lg">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Personal Information</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { label: "Full Name", value: selectedRegistration.full_name },
                    { label: "Birth Date", value: formatDate(selectedRegistration.birth_date) },
                    { label: "Contact Number", value: selectedRegistration.contact_number, icon: Phone },
                    { label: "Email Address", value: selectedRegistration.email, icon: Mail },
                  ].map((item, idx) => (
                    <div key={idx}>
                      <label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                        {item.icon && <item.icon className="w-4 h-4" />}
                        {item.label}
                      </label>
                      <p className="text-gray-900 dark:text-white mt-1 font-medium">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Professional Credentials */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 border-2 border-green-100 dark:border-slate-700">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-gradient-to-br from-green-500 to-green-600 p-3 rounded-xl shadow-lg">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Professional Credentials</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { label: "Profession", value: selectedRegistration.profession, icon: Briefcase },
                    { label: "Role in Project", value: selectedRegistration.role_in_project },
                    { label: "PRC License", value: selectedRegistration.prc_license, icon: Shield },
                    { label: "PRC Expiry", value: formatDate(selectedRegistration.prc_expiry), icon: Calendar },
                    { label: "PTR Number", value: selectedRegistration.ptr_number },
                    { label: "TIN", value: selectedRegistration.tin, icon: CreditCard },
                  ].map((item, idx) => (
                    <div key={idx}>
                      <label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                        {item.icon && <item.icon className="w-4 h-4" />}
                        {item.label}
                      </label>
                      <p className="text-gray-900 dark:text-white mt-1 font-medium">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Documents */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 border-2 border-orange-100 dark:border-slate-700">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-3 rounded-xl shadow-lg">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Uploaded Documents</h3>
                </div>
                <div className="space-y-4">
                  {[
                    { label: "PRC ID", file: selectedRegistration.prc_id_file },
                    { label: "PTR Document", file: selectedRegistration.ptr_file },
                    { label: "Signature", file: selectedRegistration.signature_file },
                  ].map((doc, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center gap-3">
                        <ImageIcon className="w-5 h-5 text-gray-500" />
                        <span className="font-medium text-gray-700">{doc.label}</span>
                      </div>
                      {doc.file ? (
                        <button
                          onClick={() => viewFile(doc.file, doc.label)}
                          className="px-4 py-2 bg-[#4A90E2] text-white rounded-lg hover:bg-[#4A90E2]/80 transition-colors flex items-center gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </button>
                      ) : (
                        <span className="text-sm text-gray-400">Not uploaded</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Admin Remarks */}
              {selectedRegistration.admin_remarks && (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-yellow-800">Admin Remarks</h4>
                      <p className="text-sm text-yellow-700 mt-1">{selectedRegistration.admin_remarks}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
                <button
                  onClick={closeModal}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
                >
                  Close
                </button>
                {selectedRegistration.status?.toLowerCase() === 'pending' && (
                  <>
                    <button
                      onClick={handleReject}
                      className="px-6 py-3 bg-[#E53935] text-white rounded-lg hover:bg-[#E53935]/80 transition-colors font-semibold flex items-center gap-2"
                    >
                      <XCircle className="w-5 h-5" />
                      Reject
                    </button>
                    <button
                      onClick={handleApprove}
                      className="px-6 py-3 bg-[#4CAF50] text-white rounded-lg hover:bg-[#4CAF50]/80 transition-colors font-semibold flex items-center gap-2"
                    >
                      <CheckCircle className="w-5 h-5" />
                      Approve
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* File Preview Modal */}
      {showFilePreview && selectedFile && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-bold text-gray-800">{selectedFile.name}</h3>
              <button
                onClick={() => {
                  setShowFilePreview(false);
                  setSelectedFile(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 overflow-auto max-h-[calc(90vh-80px)]">
              <img src={selectedFile.path} alt={selectedFile.name} className="w-full h-auto rounded-lg" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
