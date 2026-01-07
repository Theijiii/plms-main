import { useEffect, useState } from "react";
import { logTx } from "../../../lib/txLogger";

export default function BusinessPermit() {
  // Inline mock data (only inside this file) — used as initial state and fallback
  const mockBusinessData = [
    {
      id: "BP-BLD-1001",
      business_name: "Sunrise Construction",
      applicant: { full_name: "Juan Dela Cruz", contact_number: "09171234567", email_address: "juan@example.com" },
      business_address: { street: "123 M.L. Quezon St.", barangay: "San Isidro", city_municipality: "Metro City" },
      permit_number: "BLD-001",
      permit_type: "New",
      business_type: "construction",
      submitted_at: "2025-09-28",
      status: "approve",
      assigned_officer: "Eng. Ramos",
      total_amount: 50000,
      attachments: [{ name: "Plans.pdf", url: "https://example.com/sample-build-1.pdf" }],
      previous_permit_number: null,
      review_status: "Approved",
      review_comments: "All good",
      last_updated: "2025-09-29T10:00:00Z"
    },
    {
      id: "BP-BLD-1002",
      business_name: "Ace Electricals",
      applicant: { full_name: "Maria Santos", contact_number: "09181234567", email_address: "maria@example.com" },
      business_address: { street: "45 Rizal Ave.", barangay: "Bagong Bayan", city_municipality: "Metro City" },
      permit_number: "ELC-002",
      permit_type: "Electrical",
      business_type: "electrical",
      submitted_at: "2025-10-01",
      status: "for compliance only",
      assigned_officer: "Eng. Cruz",
      total_amount: 15000,
      attachments: [{ name: "Electrical Plan.pdf", url: "https://example.com/sample-build-2.pdf" }],
      previous_permit_number: null,
      review_status: "For Compliance",
      review_comments: "Provide updated load calculations",
      last_updated: "2025-10-02T08:30:00Z"
    },
    {
      id: "BP-BLD-1003",
      business_name: "Blue Harbor Demolition",
      applicant: { full_name: "Pedro Reyes", contact_number: "09201234567", email_address: "pedro@example.com" },
      business_address: { street: "7 Marina Blvd.", barangay: "Port Area", city_municipality: "Bay City" },
      permit_number: "DEM-003",
      permit_type: "Demolition",
      business_type: "demolition",
      submitted_at: "2025-10-02",
      status: "reject",
      assigned_officer: null,
      total_amount: 30000,
      attachments: [{ name: "Site Eval.pdf", url: "https://example.com/sample-build-3.pdf" }],
      previous_permit_number: null,
      review_status: "Rejected",
      review_comments: "Insufficient shoring plan",
      last_updated: "2025-10-04T09:00:00Z"
    },
    {
      id: "BP-BLD-1004",
      business_name: "Lotus Plumbing",
      applicant: { full_name: "Liza Cruz", contact_number: "09191234567", email_address: "liza@example.com" },
      business_address: { street: "12 Wellness St.", barangay: "Green Park", city_municipality: "Metro City" },
      permit_number: "PLB-004",
      permit_type: "Plumbing",
      business_type: "plumbing",
      submitted_at: "2025-10-04",
      status: "approve",
      assigned_officer: "Eng. Morales",
      total_amount: 8000,
      attachments: [{ name: "Plumbing Plan.pdf", url: "https://example.com/sample-build-4.pdf" }],
      previous_permit_number: null,
      review_status: "Approved",
      review_comments: "Cleared inspection",
      last_updated: "2025-10-05T11:20:00Z"
    },
    {
      id: "BP-BLD-1005",
      business_name: "Metro Excavation",
      applicant: { full_name: "Mark Lim", contact_number: "09211234567", email_address: "mark@example.com" },
      business_address: { street: "200 Health Ave.", barangay: "Central", city_municipality: "Metro City" },
      permit_number: "EXC-005",
      permit_type: "Excavation",
      business_type: "excavation",
      submitted_at: "2025-10-05",
      status: "for compliance only",
      assigned_officer: null,
      total_amount: 22000,
      attachments: [{ name: "Excavation Plan.pdf", url: "https://example.com/sample-build-5.pdf" }],
      previous_permit_number: null,
      review_status: "For Compliance",
      review_comments: "Provide erosion control plan",
      last_updated: "2025-10-06T14:45:00Z"
    }
  ];

  // start with inline mock data so the page always shows something (no other files changed)
  const [business, setBusiness] = useState(mockBusinessData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [selectedPermit, setSelectedPermit] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [assignedOfficerInput, setAssignedOfficerInput] = useState("");
  const [actionComment, setActionComment] = useState("");
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  // Check screen size on mount and resize
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  useEffect(() => {
    fetch("http://e-plms.goserveph.com/front-end/src/pages/admin/BusinessPermit/businessAdminMock.php")
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((data) => {
        // accept remote data shape if valid array, otherwise keep inline mock
        if (Array.isArray(data) && data.length) {
          setBusiness(data);
        } else {
          setBusiness(mockBusinessData);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.warn("Business Permit Service fetch failed — using inline mock:", err);
        // fallback to inline mock so no other pages or files required
        setBusiness(mockBusinessData);
        setError(null);
        setLoading(false);
      });
  }, []);

  // 🔍 Enhanced Filtering logic for all categories
  const filteredBusiness = business.filter((permit) => {
    const type = permit.permit_type?.toLowerCase() || permit.application_type?.toLowerCase() || "";
    const businessType = permit.business_type?.toLowerCase() || "";
    
    switch (activeTab) {
      case "new":
        return type.includes("new") || !permit.previous_permit_number;
      case "renewal":
        return type.includes("renewal") || permit.previous_permit_number;
      case "electrical":
        return type.includes("electrical") || businessType.includes("electrical");
      case "mechanical":
        return type.includes("mechanical") || businessType.includes("mechanical");
      case "plumbing":
        return type.includes("plumbing") || businessType.includes("plumbing");
      case "fencing":
        return type.includes("fencing") || businessType.includes("fencing");
      case "demolition":
        return type.includes("demolition") || businessType.includes("demolition");
      case "excavation":
        return type.includes("excavation") || type.includes("grading") || businessType.includes("excavation");
      case "occupancy":
        return type.includes("occupancy") || businessType.includes("occupancy");
      case "electronics":
        return type.includes("electronics") || businessType.includes("electronics");
      case "signage":
        return type.includes("signage") || businessType.includes("signage");
      case "professional":
        return type.includes("professional") || businessType.includes("professional");
      case "all":
      default:
        return true;
    }
  });

  // KPI Counters with updated status values
  const total = business.length;
  const approved = business.filter((p) => p.status === "approve").length;
  const rejected = business.filter((p) => p.status === "reject").length;
  const forCompliance = business.filter((p) => p.status === "for compliance only").length;

  // Tab-specific counts
  const countByType = {
    all: total,
    new: business.filter((p) => 
      p.permit_type?.toLowerCase().includes("new") || !p.previous_permit_number
    ).length,
    renewal: business.filter((p) => 
      p.permit_type?.toLowerCase().includes("renewal") || p.previous_permit_number
    ).length,
    electrical: business.filter((p) => 
      p.permit_type?.toLowerCase().includes("electrical") || 
      p.business_type?.toLowerCase().includes("electrical")
    ).length,
    mechanical: business.filter((p) => 
      p.permit_type?.toLowerCase().includes("mechanical") || 
      p.business_type?.toLowerCase().includes("mechanical")
    ).length,
    plumbing: business.filter((p) => 
      p.permit_type?.toLowerCase().includes("plumbing") || 
      p.business_type?.toLowerCase().includes("plumbing")
    ).length,
    fencing: business.filter((p) => 
      p.permit_type?.toLowerCase().includes("fencing") || 
      p.business_type?.toLowerCase().includes("fencing")
    ).length,
    demolition: business.filter((p) => 
      p.permit_type?.toLowerCase().includes("demolition") || 
      p.business_type?.toLowerCase().includes("demolition")
    ).length,
    excavation: business.filter((p) => 
      p.permit_type?.toLowerCase().includes("excavation") || 
      p.permit_type?.toLowerCase().includes("grading") || 
      p.business_type?.toLowerCase().includes("excavation")
    ).length,
    occupancy: business.filter((p) => 
      p.permit_type?.toLowerCase().includes("occupancy") || 
      p.business_type?.toLowerCase().includes("occupancy")
    ).length,
    electronics: business.filter((p) => 
      p.permit_type?.toLowerCase().includes("electronics") || 
      p.business_type?.toLowerCase().includes("electronics")
    ).length,
    signage: business.filter((p) => 
      p.permit_type?.toLowerCase().includes("signage") || 
      p.business_type?.toLowerCase().includes("signage")
    ).length,
    professional: business.filter((p) => 
      p.permit_type?.toLowerCase().includes("professional") || 
      p.business_type?.toLowerCase().includes("professional")
    ).length,
  };

  // Status color mapping with updated status values
  const getStatusColor = (status) => {
    switch (status) {
      case "approve":
        return "text-green-600 bg-green-100";
      case "reject":
        return "text-red-600 bg-red-100";
      case "for compliance only":
        return "text-yellow-600 bg-yellow-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  // Status display text mapping
  const getStatusDisplayText = (status) => {
    switch (status) {
      case "approve":
        return "Approved";
      case "reject":
        return "Rejected";
      case "for compliance only":
        return "For Compliance";
      default:
        return status;
    }
  };

  const getTypeBadgeColor = (type) => {
    const lowerType = type?.toLowerCase() || "";
    if (lowerType.includes("new")) return "bg-[#4CAF50]/20 text-[#4CAF50] border border-[#4CAF50]/30";
    if (lowerType.includes("renewal")) return "bg-[#4A90E2]/20 text-[#4A90E2] border border-[#4A90E2]/30";
    if (lowerType.includes("electrical")) return "bg-yellow-100 text-yellow-800 border border-yellow-200";
    if (lowerType.includes("mechanical")) return "bg-orange-100 text-orange-800 border border-orange-200";
    if (lowerType.includes("plumbing")) return "bg-blue-100 text-blue-800 border border-blue-200";
    if (lowerType.includes("fencing")) return "bg-emerald-100 text-emerald-800 border border-emerald-200";
    if (lowerType.includes("demolition")) return "bg-red-100 text-red-800 border border-red-200";
    if (lowerType.includes("excavation") || lowerType.includes("grading")) return "bg-amber-100 text-amber-800 border border-amber-200";
    if (lowerType.includes("occupancy")) return "bg-purple-100 text-purple-800 border border-purple-200";
    if (lowerType.includes("electronics")) return "bg-indigo-100 text-indigo-800 border border-indigo-200";
    if (lowerType.includes("signage")) return "bg-pink-100 text-pink-800 border border-pink-200";
    if (lowerType.includes("professional")) return "bg-cyan-100 text-cyan-800 border border-cyan-200";
    return "bg-gray-100 text-gray-800 border border-gray-200";
  };

  const getTabBadgeColor = (tab) =>
    tab === activeTab ? "bg-[#4CAF50] text-white" : "bg-gray-100 text-gray-600";

  const getTabBorderColor = (tab) => {
    return tab === activeTab ? "border-[#4CAF50]" : "border-transparent";
  };

  const getTabTextColor = (tab) => {
    return tab === activeTab ? "text-[#4CAF50] dark:text-[#4CAF50]" : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300";
  };

  const getTabDisplayName = (tab) => {
    const names = {
      all: "All Permits",
      new: "New",
      renewal: "Renewal",
      electrical: "Electrical",
      mechanical: "Mechanical",
      plumbing: "Plumbing",
      fencing: "Fencing",
      demolition: "Demolition",
      excavation: "Excavation/Grading",
      occupancy: "Occupancy",
      electronics: "Electronics",
      signage: "Signage",
      professional: "Professional"
    };
    return names[tab] || tab;
  };

  const getTabDescription = (tab) => {
    const descriptions = {
      all: "Complete list of all business permits and applications",
      new: "New business permit applications and submissions",
      renewal: "Business permit renewal requests and applications",
      electrical: "Electrical permits and electrical work applications",
      mechanical: "Mechanical permits and mechanical system applications",
      plumbing: "Plumbing permits and plumbing work applications",
      fencing: "Fencing permits and fence construction applications",
      demolition: "Demolition permits and structure removal applications",
      excavation: "Excavation and grading permits for construction sites",
      occupancy: "Occupancy permits and certificate of occupancy applications",
      electronics: "Electronics permits and electronic system installations",
      signage: "Signage permits and business sign applications",
      professional: "Professional permits and professional service applications"
    };
    return descriptions[tab] || "Business permit applications";
  };

  const openModal = (permit) => {
    setSelectedPermit(permit);
    setAssignedOfficerInput(permit.assigned_officer || "");
    setActionComment("");
    setPreviewUrl(null);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedPermit(null);
    setAssignedOfficerInput("");
    setActionComment("");
    setPreviewUrl(null);
    setShowModal(false);
  };

  const updatePermitStatus = (id, status, comment = "") => {
    const now = new Date().toISOString();
    setBusiness((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, status, review_status: status, review_comments: comment, last_updated: now }
          : p
      )
    );
  };

  const handleApprove = () => {
    if (!selectedPermit) return;
    updatePermitStatus(selectedPermit.id, "approve", actionComment);
    try {
      logTx({ service: "business", permitId: selectedPermit.id, action: "approve", comment: actionComment });
    } catch {}
    closeModal();
  };

  const handleReject = () => {
    if (!selectedPermit) return;
    updatePermitStatus(selectedPermit.id, "reject", actionComment);
    try {
      logTx({ service: "business", permitId: selectedPermit.id, action: "reject", comment: actionComment });
    } catch {}
    closeModal();
  };

  const handleForCompliance = () => {
    if (!selectedPermit) return;
    updatePermitStatus(selectedPermit.id, "for compliance only", actionComment);
    try {
      logTx({ service: "business", permitId: selectedPermit.id, action: "for_compliance", comment: actionComment });
    } catch {}
    closeModal();
  };

  const handleSaveAssignment = () => {
    if (!selectedPermit) return;
    const now = new Date().toISOString();
    setBusiness((prev) =>
      prev.map((p) =>
        p.id === selectedPermit.id
          ? { ...p, assigned_officer: assignedOfficerInput, last_updated: now }
          : p
      )
    );
  };

  const tabCategories = [
    { key: "all", label: "All Permits" },
    { key: "new", label: "NEW" },
    { key: "renewal", label: "RENEWAL" },
    { key: "electrical", label: "Electrical" },
    { key: "mechanical", label: "Mechanical" },
    { key: "plumbing", label: "Plumbing" },
    { key: "fencing", label: "Fencing" },
    { key: "demolition", label: "Demolition" },
    { key: "excavation", label: "Excavation/Grading" },
    { key: "occupancy", label: "Occupancy" },
    { key: "electronics", label: "Electronics" },
    { key: "signage", label: "Signage" },
    { key: "professional", label: "Professional" },
  ];

  // Mobile card view for business permits
  const MobilePermitCard = ({ permit }) => (
    <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-4 mb-4 shadow-sm">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 dark:text-white text-base mb-1">
            {permit.business_name}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            {permit.applicant?.full_name}
          </p>
        </div>
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(permit.status)}`}>
          {getStatusDisplayText(permit.status)}
        </span>
      </div>
      
      <div className="space-y-2 mb-4">
        <div className="flex justify-between">
          <span className="text-sm text-gray-500">Permit No:</span>
          <span className="text-sm font-mono text-gray-700 dark:text-gray-300">
            {permit.permit_number}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-500">Type:</span>
          <span className={`px-2 py-1 text-xs rounded-full ${getTypeBadgeColor(permit.permit_type)}`}>
            {permit.permit_type || "Unknown"}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-500">Submitted:</span>
          <span className="text-sm text-gray-700 dark:text-gray-300">
            {permit.submitted_at}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-500">Assigned:</span>
          <span className={`px-2 py-1 text-xs rounded-full ${
            permit.assigned_officer 
              ? "bg-[#4CAF50]/20 text-[#4CAF50] border border-[#4CAF50]/30" 
              : "bg-gray-100 text-gray-600 border border-gray-200"
          }`}>
            {permit.assigned_officer || "Unassigned"}
          </span>
        </div>
      </div>
      
      <button
        onClick={() => openModal(permit)}
        className="w-full inline-flex justify-center items-center px-4 py-2 text-sm font-medium rounded-lg text-white bg-gradient-to-r from-[#4CAF50] to-[#4A90E2] hover:from-[#4CAF50]/90 hover:to-[#4A90E2]/90 transition-all"
      >
        View Details
      </button>
    </div>
  );

  return (
    <div className="bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-lg min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Business Permits Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
          Manage and track all business permit types and categories
        </p>
      </div>

    
      {/* 🧭 Enhanced Tab Navigation - Responsive */}
      <div className="mb-6 bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 shadow-sm">
        {/* Mobile Tab Selector */}
        {isMobile && (
          <div className="p-4 border-b border-gray-200 dark:border-slate-700">
            <select 
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
            >
              {tabCategories.map((tab) => (
                <option key={tab.key} value={tab.key}>
                  {tab.label} ({countByType[tab.key]})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Desktop Tab Navigation */}
        {!isMobile && (
          <div className="border-b border-gray-200 dark:border-slate-700 overflow-x-auto">
            <nav className="flex space-x-4 lg:space-x-6 px-4 lg:px-6 min-w-max">
              {tabCategories.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`py-3 lg:py-4 px-2 border-b-2 font-medium text-sm flex items-center gap-2 transition-all whitespace-nowrap ${getTabBorderColor(tab.key)} ${getTabTextColor(tab.key)}`}
                >
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">
                    {tab.key === 'all' ? 'All' : 
                     tab.key === 'new' ? 'New' :
                     tab.key === 'renewal' ? 'Renew' :
                     tab.label.split(' ')[0]}
                  </span>
                  <span className={`px-2 py-1 text-xs rounded-full ${getTabBadgeColor(tab.key)}`}>
                    {countByType[tab.key]}
                  </span>
                </button>
              ))}
            </nav>
          </div>
        )}

        {/* Tab Content Header */}
        <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-slate-700 bg-gradient-to-r from-[#4CAF50]/5 to-[#4A90E2]/5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                {getTabDisplayName(activeTab)}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm mt-1">
                {getTabDescription(activeTab)} • {countByType[activeTab]} {countByType[activeTab] === 1 ? 'record' : 'records'} found
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#4CAF50] animate-pulse"></div>
              <span className="text-xs sm:text-sm text-gray-500">Live</span>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-4 sm:p-6">
          {loading && (
            <div className="text-center py-8 sm:py-12">
              <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-[#4CAF50]/10 rounded-full mb-3 sm:mb-4">
                <div className="w-5 h-5 sm:w-6 sm:h-6 border-2 border-[#4CAF50] border-t-transparent rounded-full animate-spin"></div>
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base">Loading permits...</p>
            </div>
          )}
          {error && (
            <div className="mb-4 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg text-center">
              <div className="text-red-600 font-semibold text-sm sm:text-base">{error}</div>
            </div>
          )}
          {!loading && filteredBusiness.length === 0 && (
            <div className="text-center py-8 sm:py-12">
              <div className="text-gray-400 text-4xl sm:text-6xl mb-3 sm:mb-4">📋</div>
              <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white mb-2">
                No {getTabDisplayName(activeTab).toLowerCase()} found
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base mb-4 max-w-md mx-auto">
                There are currently no {getTabDisplayName(activeTab).toLowerCase()} in the system.
              </p>
              <button className="px-4 py-2 bg-[#4CAF50] text-white rounded-lg hover:bg-[#4CAF50]/90 transition-colors text-sm sm:text-base">
                Refresh Data
              </button>
            </div>
          )}

          {/* Mobile Card View */}
          {!loading && filteredBusiness.length > 0 && isMobile && (
            <div className="space-y-3">
              {filteredBusiness.map((p) => (
                <MobilePermitCard key={p.id} permit={p} />
              ))}
            </div>
          )}

          {/* Desktop Table View */}
          {!loading && filteredBusiness.length > 0 && !isMobile && (
            <div className="overflow-x-auto">
              <table className="w-full bg-white dark:bg-slate-800 shadow rounded-lg">
                <thead className="bg-gradient-to-r from-[#4CAF50]/10 to-[#4A90E2]/10">
                  <tr>
                    <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Business Name
                    </th>
                    <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Owner
                    </th>
                    <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Permit No.
                    </th>
                    <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Submitted
                    </th>
                    <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Assigned
                    </th>
                    <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredBusiness.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                      <td className="px-4 lg:px-6 py-3 text-sm font-medium text-gray-900 dark:text-white max-w-[150px] truncate">
                        {p.business_name}
                      </td>
                      <td className="px-4 lg:px-6 py-3 text-sm text-gray-600 dark:text-gray-300 max-w-[120px] truncate">
                        {p.applicant?.full_name}
                      </td>
                      <td className="px-4 lg:px-6 py-3 text-sm text-gray-600 dark:text-gray-300 max-w-[150px] truncate">
                        {`${p.business_address?.street || ""} ${p.business_address?.barangay || ""}`}
                      </td>
                      <td className="px-4 lg:px-6 py-3 text-sm font-mono text-gray-600 dark:text-gray-300">
                        {p.permit_number}
                      </td>
                      <td className="px-4 lg:px-6 py-3 text-sm">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeBadgeColor(p.permit_type)}`}>
                          {p.permit_type || "Unknown"}
                        </span>
                      </td>
                      <td className="px-4 lg:px-6 py-3 text-sm text-gray-600 dark:text-gray-300">
                        {p.submitted_at}
                      </td>
                      <td className="px-4 lg:px-6 py-3 text-sm">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(
                            p.status
                          )} border-current border-opacity-30`}
                        >
                          {getStatusDisplayText(p.status)}
                        </span>
                      </td>
                      <td className="px-4 lg:px-6 py-3 text-sm">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          p.assigned_officer 
                            ? "bg-[#4CAF50]/20 text-[#4CAF50] border border-[#4CAF50]/30" 
                            : "bg-gray-100 text-gray-600 border border-gray-200"
                        }`}>
                          {p.assigned_officer || "Unassigned"}
                        </span>
                      </td>
                      <td className="px-4 lg:px-6 py-3 text-sm">
                        <button
                          onClick={() => openModal(p)}
                          className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-lg text-white bg-gradient-to-r from-[#4CAF50] to-[#4A90E2] hover:from-[#4CAF50]/90 hover:to-[#4A90E2]/90 transition-all shadow-sm hover:shadow-md"
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

      {/* Responsive Modal */}
      {showModal && selectedPermit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-2 sm:p-4">
          <div className="w-full max-w-2xl lg:max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-800 rounded-xl shadow-2xl">
            <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-slate-700 bg-gradient-to-r from-[#4CAF50]/5 to-[#4A90E2]/5 rounded-t-xl">
              <div className="flex justify-between items-start">
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white truncate">
                    Permit Details
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1 truncate">
                    {selectedPermit.permit_number} • {selectedPermit.business_name}
                  </p>
                </div>
                <button 
                  onClick={closeModal}
                  className="flex-shrink-0 p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors ml-2"
                >
                  <span className="text-2xl text-gray-500">×</span>
                </button>
              </div>
            </div>

            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Applicant</label>
                    <p className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mt-1">
                      {selectedPermit.applicant?.full_name}
                    </p>
                    <div className="mt-2 space-y-1">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        📞 {selectedPermit.applicant?.contact_number || "N/A"}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        ✉️ {selectedPermit.applicant?.email_address || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Business Location</label>
                    <p className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mt-1 break-words">
                      {`${selectedPermit.business_address?.street || ""} ${selectedPermit.business_address?.barangay || ""}, ${selectedPermit.business_address?.city_municipality || ""}`}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Total Amount</label>
                    <p className="text-xl font-bold text-[#4CAF50] mt-1">
                      ₱{selectedPermit.total_amount?.toLocaleString() || "0"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Comment Input */}
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-2">
                  Action Comments
                </label>
                <textarea
                  value={actionComment}
                  onChange={(e) => setActionComment(e.target.value)}
                  placeholder="Enter comments for this action..."
                  className="w-full p-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent resize-none"
                  rows="3"
                />
              </div>

              {/* Action Buttons - Stack on mobile */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200 dark:border-slate-700">
                <button
                  onClick={handleApprove}
                  className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  Approve Permit
                </button>
                <button
                  onClick={handleForCompliance}
                  className="flex-1 px-4 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors font-medium"
                >
                  For Compliance
                </button>
                <button
                  onClick={handleReject}
                  className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  Reject Permit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}