import { useEffect, useState } from "react";
import { logTx } from "../../../lib/txLogger";

export default function BusinessPermit() {
  // --- Mock data with enhanced business details ---
  const mockBusinessData = [
    {
      id: "BP-1001",
      business_name: "Sunrise Bakery",
      trade_name: "Sunrise Breads & Pastries",
      business_nature: "Food and Beverage - Retail",
      business_structure: "Sole Proprietorship",
      registration_no: "BN-2024-00123",
      tin: "123-456-789-000",
      ownership_status: "Owner-Operated",
      building_type: "Commercial",
      business_activity: "Bakery and Cafe",
      business_description: "Fresh bread, pastries, and coffee shop serving daily baked goods",
      capital_investment: 500000,
      number_of_employees: 8,
      applicant: { full_name: "Juan Dela Cruz", contact_number: "09171234567", email_address: "juan@example.com" },
      business_address: { street: "123 M.L. Quezon St.", barangay: "San Isidro", city_municipality: "Metro City" },
      permit_number: "PERMIT-001",
      permit_type: "New",
      submitted_at: "2025-09-28",
      status: "For Compliance",
      assigned_officer: null,
      total_amount: 2500,
      attachments: [{ name: "Business Registration.pdf", url: "https://example.com/sample1.pdf" }],
      previous_permit_number: null,
      review_status: null,
      review_comments: null,
      last_updated: "2025-09-28T10:00:00Z",
      compliance_remarks: "",
      compliance_files: []
    },
    {
      id: "BP-1002",
      business_name: "Green Grocers Corporation",
      trade_name: "Green Grocers Supermarket",
      business_nature: "Retail - Supermarket",
      business_structure: "Corporation",
      registration_no: "SEC-2023-04567",
      tin: "987-654-321-000",
      ownership_status: "Corporate Owned",
      building_type: "Commercial",
      business_activity: "Grocery and Supermarket",
      business_description: "Full-service supermarket offering fresh produce, groceries, and household items",
      capital_investment: 5000000,
      number_of_employees: 45,
      applicant: { full_name: "Maria Santos", contact_number: "09181234567", email_address: "maria@example.com" },
      business_address: { street: "45 Rizal Ave.", barangay: "Bagong Bayan", city_municipality: "Metro City" },
      permit_number: "PERMIT-002",
      permit_type: "Renewal",
      submitted_at: "2025-09-30",
      status: "Approved",
      assigned_officer: "Officer Reyes",
      total_amount: 1200,
      attachments: [{ name: "Renewal Form.pdf", url: "https://example.com/sample2.pdf" }],
      previous_permit_number: "PERMIT-002-2024",
      review_status: "Approved",
      review_comments: "All documents complete",
      last_updated: "2025-10-01T08:15:00Z",
      compliance_remarks: "",
      compliance_files: []
    },
    {
      id: "BP-1003",
      business_name: "Blue Harbor Restaurant",
      trade_name: "Blue Harbor Seafood Grill",
      business_nature: "Food and Beverage - Restaurant",
      business_structure: "Partnership",
      registration_no: "BN-2024-00345",
      tin: "456-789-123-000",
      ownership_status: "Partnership",
      building_type: "Commercial",
      business_activity: "Fine Dining Restaurant",
      business_description: "Upscale seafood restaurant with bar and function room",
      capital_investment: 3000000,
      number_of_employees: 25,
      applicant: { full_name: "Pedro Reyes", contact_number: "09201234567", email_address: "pedro@example.com" },
      business_address: { street: "7 Marina Blvd.", barangay: "Port Area", city_municipality: "Bay City" },
      permit_number: "PERMIT-003",
      permit_type: "Liquor",
      submitted_at: "2025-10-02",
      status: "For Compliance",
      assigned_officer: "Officer Cruz",
      total_amount: 8500,
      attachments: [{ name: "Floor Plan.pdf", url: "https://example.com/sample3.pdf" }],
      previous_permit_number: null,
      review_status: null,
      review_comments: "Missing health certificate and fire safety inspection",
      last_updated: "2025-10-02T13:30:00Z",
      compliance_remarks: "Please submit health certificate and fire safety inspection report",
      compliance_files: [
        { 
          id: 1, 
          name: "health_certificate.pdf", 
          type: "application/pdf",
          submitted_date: "2025-10-05T10:30:00Z",
          status: "pending_review",
          size: "1.8 MB"
        },
        { 
          id: 2, 
          name: "fire_safety_inspection.jpg", 
          type: "image/jpeg",
          submitted_date: "2025-10-05T10:30:00Z", 
          status: "approved",
          size: "2.3 MB"
        }
      ]
    },
    {
      id: "BP-1004",
      business_name: "Ace Hardware and Construction Supply",
      trade_name: "Ace Hardware",
      business_nature: "Retail - Hardware",
      business_structure: "Corporation",
      registration_no: "SEC-2022-07890",
      tin: "789-123-456-000",
      ownership_status: "Corporate Owned",
      building_type: "Industrial",
      business_activity: "Hardware and Construction Materials",
      business_description: "Complete hardware store serving construction and DIY needs",
      capital_investment: 8000000,
      number_of_employees: 35,
      applicant: { full_name: "Ana Lopez", contact_number: "09051234567", email_address: "ana@example.com" },
      business_address: { street: "88 Industrial Rd.", barangay: "Zone 2", city_municipality: "Metro City" },
      permit_number: "PERMIT-004",
      permit_type: "Amendment",
      submitted_at: "2025-10-03",
      status: "Rejected",
      assigned_officer: null,
      total_amount: 1800,
      attachments: [{ name: "Amendment Request.pdf", url: "https://example.com/sample4.pdf" }],
      previous_permit_number: "PERMIT-004-2024",
      review_status: "Rejected",
      review_comments: "Insufficient documentation for expansion",
      last_updated: "2025-10-04T09:00:00Z",
      compliance_remarks: "",
      compliance_files: []
    },
    {
      id: "BP-1005",
      business_name: "Lotus Spa and Wellness Center",
      trade_name: "Lotus Spa",
      business_nature: "Health and Wellness Services",
      business_structure: "Sole Proprietorship",
      registration_no: "BN-2024-00567",
      tin: "234-567-890-000",
      ownership_status: "Owner-Operated",
      building_type: "Commercial",
      business_activity: "Spa and Wellness Services",
      business_description: "Full-service spa offering massages, facials, and wellness treatments",
      capital_investment: 1200000,
      number_of_employees: 12,
      applicant: { full_name: "Liza Cruz", contact_number: "09191234567", email_address: "liza@example.com" },
      business_address: { street: "12 Wellness St.", barangay: "Green Park", city_municipality: "Metro City" },
      permit_number: "PERMIT-005",
      permit_type: "Special",
      submitted_at: "2025-10-04",
      status: "Approved",
      assigned_officer: "Officer Ramos",
      total_amount: 4500,
      attachments: [{ name: "Certificate.pdf", url: "https://example.com/sample5.pdf" }],
      previous_permit_number: null,
      review_status: "Approved",
      review_comments: "Approved with conditions - regular sanitation inspection required",
      last_updated: "2025-10-05T11:20:00Z",
      compliance_remarks: "",
      compliance_files: []
    },
    {
      id: "BP-1006",
      business_name: "Metro Pharmacy and Drugstore",
      trade_name: "Metro Pharmacy",
      business_nature: "Healthcare - Retail Pharmacy",
      business_structure: "Sole Proprietorship",
      registration_no: "BN-2024-00678",
      tin: "345-678-901-000",
      ownership_status: "Owner-Operated",
      building_type: "Commercial",
      business_activity: "Pharmacy and Drugstore",
      business_description: "Community pharmacy serving prescription and OTC medication needs",
      capital_investment: 800000,
      number_of_employees: 6,
      applicant: { full_name: "Mark Lim", contact_number: "09211234567", email_address: "mark@example.com" },
      business_address: { street: "200 Health Ave.", barangay: "Central", city_municipality: "Metro City" },
      permit_number: "PERMIT-006",
      permit_type: "New",
      submitted_at: "2025-10-05",
      status: "For Compliance",
      assigned_officer: null,
      total_amount: 3000,
      attachments: [{ name: "Owner ID.pdf", url: "https://example.com/sample6.pdf" }],
      previous_permit_number: null,
      review_status: null,
      review_comments: null,
      last_updated: "2025-10-05T14:45:00Z",
      compliance_remarks: "",
      compliance_files: []
    }
  ];

  // initialize states with mock data so manual input is immediately available
  const [business, setBusiness] = useState(mockBusinessData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("all"); // all | new | renewal | special | liquor | amendment

  const [selectedPermit, setSelectedPermit] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [assignedOfficerInput, setAssignedOfficerInput] = useState("");
  const [actionComment, setActionComment] = useState("");
  const [complianceRemarks, setComplianceRemarks] = useState("");
  const [complianceFiles, setComplianceFiles] = useState([]);
  const [previewUrl, setPreviewUrl] = useState(null);

  // canonical type detector — used by filtering and counts (strict)
  const getEntryType = (p) => {
    const pt = (p.permit_type || p.application_type || "").toString().toLowerCase();
    if (pt.includes("renew")) return "renewal";
    if (pt.includes("new")) return "new";
    if (pt.includes("special")) return "special";
    if (pt.includes("liquor")) return "liquor";
    if (pt.includes("amend")) return "amendment";
    // fallback heuristic: presence of previous_permit_number strongly implies renewal
    if (p.previous_permit_number) return "renewal";
    // conservative default — unknown so it won't show in strict tabs
    return "unknown";
  };

  const [businessData, setBusinessData] = useState(mockBusinessData); // central source for counts
  const [counts, setCounts] = useState({
    total: mockBusinessData.length,
    approved: mockBusinessData.filter(p => (p.status||"").toLowerCase() === "approved").length,
    pending: mockBusinessData.filter(p => (p.status||"").toLowerCase() === "for compliance").length,
    rejected: mockBusinessData.filter(p => (p.status||"").toLowerCase() === "rejected").length,
  });
  const [countByType, setCountByType] = useState(
    (() => {
      const byType = mockBusinessData.reduce((acc, p) => {
        const t = getEntryType(p);
        acc[t] = (acc[t] || 0) + 1;
        return acc;
      }, {});
      byType.all = mockBusinessData.length;
      return byType;
    })()
  );

  // fetch -> update both business and businessData so UI + counts use same source
  useEffect(() => {
    fetch("http://e-plms.goserveph.com/front-end/src/pages/admin/BusinessPermit/businessAdminMock.php")
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((data) => {
        const items = Array.isArray(data) && data.length ? data : mockBusinessData;
        setBusiness(items);
        setBusinessData(items);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Business Permit Service error:", err);
        // fallback to inline mock data when remote fetch fails
        setBusiness(mockBusinessData);
        setBusinessData(mockBusinessData);
        setError("");
        setLoading(false);
      });
  }, []);

  // recompute counts whenever businessData changes (keeps dashboard trackable)
  useEffect(() => {
    const items = businessData || [];
    const total = items.length;
    const approved = items.filter((p) => (p.status || "").toLowerCase() === "approved").length;
    const pending = items.filter((p) => (p.status || "").toLowerCase() === "for compliance").length;
    const rejected = items.filter((p) => (p.status || "").toLowerCase() === "rejected").length;

    const byType = items.reduce((acc, p) => {
      const t = getEntryType(p);
      acc[t] = (acc[t] || 0) + 1;
      return acc;
    }, {});
    // ensure "all" key exists so the All tab badge shows total count
    byType.all = total;

    setCounts({ total, approved, pending, rejected });
    setCountByType(byType);
  }, [businessData]);

  // 🔍 Filtering logic (strict type match per tab)
  const filteredBusiness = business.filter((permit) => {
    const type = getEntryType(permit);
    switch (activeTab) {
      case "new":
        return type === "new";
      case "renewal":
        return type === "renewal";
      case "special":
        return type === "special";
      case "liquor":
        return type === "liquor";
      case "amendment":
        return type === "amendment";
      case "all":
      default:
        return true;
    }
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "Approved":
        return "text-green-600 bg-green-100";
      case "Rejected":
        return "text-red-600 bg-red-100";
      case "For Compliance":
        return "text-orange-600 bg-orange-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getFileStatusColor = (status) => {
    switch (status) {
      case "approved": return "text-green-600 bg-green-100 border-green-200";
      case "rejected": return "text-red-600 bg-red-100 border-red-200";
      case "pending_review": return "text-yellow-600 bg-yellow-100 border-yellow-200";
      default: return "text-gray-600 bg-gray-100 border-gray-200";
    }
  };

  const getTabBadgeColor = (tab) =>
    tab === activeTab ? "bg-[#4CAF50] text-white" : "bg-gray-100 text-gray-600";

  const getTabBorderColor = (tab) => {
    return tab === activeTab ? "border-[#4CAF50]" : "border-transparent";
  };

  const getTabTextColor = (tab) => {
    return tab === activeTab ? "text-[#4CAF50] dark:text-[#4CAF50]" : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300";
  };

  const openModal = (permit) => {
    setSelectedPermit(permit);
    setAssignedOfficerInput(permit.assigned_officer || "");
    setActionComment(permit.review_comments || "");
    setComplianceRemarks(permit.compliance_remarks || "");
    setComplianceFiles(permit.compliance_files || []);
    setPreviewUrl(null);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedPermit(null);
    setAssignedOfficerInput("");
    setActionComment("");
    setComplianceRemarks("");
    setComplianceFiles([]);
    setPreviewUrl(null);
    setShowModal(false);
  };

  const updatePermitStatus = (id, status, comment = '', remarks = '', files = []) => {
    const now = new Date().toISOString();
    const updated = business.map(p =>
      p.id === id
        ? { 
            ...p, 
            status, 
            review_status: status, 
            review_comments: comment || p.review_comments, 
            compliance_remarks: remarks || p.compliance_remarks,
            compliance_files: files.length > 0 ? files : p.compliance_files,
            last_updated: now, 
            assigned_officer: assignedOfficerInput || p.assigned_officer 
          }
        : p
    );
    setBusiness(updated);
    setSelectedPermit(updated.find(p => p.id === id));
  };

  const handleApprove = () => {
    if (!selectedPermit) return;
    if (selectedPermit.status === "Approved") {
      updatePermitStatus(selectedPermit.id, 'Approved', actionComment);
      try { logTx({ service: 'business', permitId: selectedPermit.id, action: 'update_review', comment: actionComment }); } catch(e) {}
    } else {
      updatePermitStatus(selectedPermit.id, 'Approved', actionComment);
      try { logTx({ service: 'business', permitId: selectedPermit.id, action: 'approve', comment: actionComment }); } catch(e) {}
    }
  };

  const handleReject = () => {
    if (!selectedPermit) return;
    if (selectedPermit.status === "Rejected") {
      updatePermitStatus(selectedPermit.id, 'Rejected', actionComment);
      try { logTx({ service: 'business', permitId: selectedPermit.id, action: 'update_review', comment: actionComment }); } catch(e) {}
    } else {
      updatePermitStatus(selectedPermit.id, 'Rejected', actionComment);
      try { logTx({ service: 'business', permitId: selectedPermit.id, action: 'reject', comment: actionComment }); } catch(e) {}
    }
  };

  const handleForCompliance = () => {
    if (!selectedPermit) return;
    updatePermitStatus(selectedPermit.id, 'For Compliance', actionComment, complianceRemarks, complianceFiles);
    try { 
      logTx({ 
        service: 'business', 
        permitId: selectedPermit.id, 
        action: 'for_compliance', 
        comment: actionComment,
        remarks: complianceRemarks 
      }); 
    } catch(e) {}
  };

  const handleSaveAssignment = () => {
    if (!selectedPermit) return;
    const now = new Date().toISOString();
    const updated = business.map(p =>
      p.id === selectedPermit.id
        ? { ...p, assigned_officer: assignedOfficerInput, last_updated: now }
        : p
    );
    setBusiness(updated);
    setSelectedPermit(updated.find(p => p.id === selectedPermit.id));
    try { logTx({ service: 'business', permitId: selectedPermit.id, action: 'assign', comment: `assigned:${assignedOfficerInput}` }); } catch(e) {}
  };

  const handleFileStatusChange = (fileId, newStatus) => {
    if (!selectedPermit) return;
    
    const updatedFiles = selectedPermit.compliance_files.map(file => 
      file.id === fileId ? { ...file, status: newStatus } : file
    );
    
    const updated = business.map(p =>
      p.id === selectedPermit.id
        ? { ...p, compliance_files: updatedFiles }
        : p
    );
    
    setBusiness(updated);
    setSelectedPermit(updated.find(p => p.id === selectedPermit.id));
    
    try { 
      logTx({ 
        service: 'business', 
        permitId: selectedPermit.id, 
        action: 'update_file_status', 
        fileId: fileId,
        status: newStatus 
      }); 
    } catch(e) {}
  };

  const handleFileReview = (fileId, reviewComment) => {
    if (!selectedPermit) return;
    
    const updatedFiles = selectedPermit.compliance_files.map(file => 
      file.id === fileId ? { ...file, review_comment: reviewComment, reviewed_at: new Date().toISOString() } : file
    );
    
    const updated = business.map(p =>
      p.id === selectedPermit.id
        ? { ...p, compliance_files: updatedFiles }
        : p
    );
    
    setBusiness(updated);
    setSelectedPermit(updated.find(p => p.id === selectedPermit.id));
  };

  return (
    <div className="bg-white dark:bg-slate-700 p-6 rounded-lg">

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Business Permits Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage and track all business permit types
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-[#4CAF50]/10 p-4 rounded-lg border border-[#4CAF50]/20">
          <p className="text-[#4CAF50] text-sm font-medium">Total Permits</p>
          <p className="text-[#4CAF50] text-2xl font-bold">{counts.total}</p>
        </div>
        <div className="bg-[#4A90E2]/10 p-4 rounded-lg border border-[#4A90E2]/20">
          <p className="text-[#4A90E2] text-sm font-medium">Approved</p>
          <p className="text-[#4A90E2] text-2xl font-bold">{counts.approved}</p>
        </div>
        <div className="bg-[#FDA811]/10 p-4 rounded-lg border border-[#FDA811]/20">
          <p className="text-[#FDA811] text-sm font-medium">Pending</p>
          <p className="text-[#FDA811] text-2xl font-bold">{counts.pending}</p>
        </div>
        <div className="bg-red-100 p-4 rounded-lg border border-red-200">
          <p className="text-red-600 text-sm font-medium">Rejected</p>
          <p className="text-red-600 text-2xl font-bold">{counts.rejected}</p>
        </div>
      </div>

      {/* 🧭 Tab Navigation with New Color Scheme */}
      <div className="mb-6 bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 shadow-sm">
        <div className="border-b border-gray-200 dark:border-slate-700 overflow-x-auto">
          <nav className="flex space-x-6 px-6 min-w-max">
            {[
              { key: "all", label: "All Permits" },
              { key: "new", label: "New Permit" },
              { key: "renewal", label: "Renewal Permit" },
              { key: "special", label: "Special" },
              { key: "liquor", label: "Liquor Permit" },
              { key: "amendment", label: "Amendment" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`py-4 px-2 border-b-2 font-medium text-sm flex items-center gap-2 transition-all ${getTabBorderColor(tab.key)} ${getTabTextColor(tab.key)}`}
              >
                {tab.label}
                <span className={`px-2 py-1 text-xs rounded-full ${getTabBadgeColor(tab.key)}`}>
                  {countByType[tab.key] || 0}
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
                {activeTab === "new" && "New Permit Applications"}
                {activeTab === "renewal" && "Renewal Applications"}
                {activeTab === "special" && "Special Permits"}
                {activeTab === "liquor" && "Liquor Permits"}
                {activeTab === "amendment" && "Amendment Requests"}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                {countByType[activeTab] || 0} {countByType[activeTab] === 1 ? 'record' : 'records'} found
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-[#4CAF50] animate-pulse"></div>
              <span className="text-sm text-gray-500">Live</span>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {loading && (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-[#4CAF50]/10 rounded-full mb-4">
                <div className="w-6 h-6 border-2 border-[#4CAF50] border-t-transparent rounded-full animate-spin"></div>
              </div>
              <p className="text-gray-500 dark:text-gray-400">Loading permits...</p>
            </div>
          )}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-center">
              <div className="text-red-600 font-semibold">{error}</div>
            </div>
          )}
          {!loading && filteredBusiness.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📋</div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No {activeTab} permits found
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                There are currently no {activeTab} permits in the system.
              </p>
              <button className="px-4 py-2 bg-[#4CAF50] text-white rounded-lg hover:bg-[#4CAF50]/90 transition-colors">
                Refresh Data
              </button>
            </div>
          )}

          {!loading && filteredBusiness.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full bg-white dark:bg-slate-800 shadow rounded-lg">
                <thead className="bg-gradient-to-r from-[#4CAF50]/10 to-[#4A90E2]/10">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Business Name
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Owner
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Permit No.
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Submitted
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Assigned
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredBusiness.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                        {p.business_name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                        {p.applicant?.full_name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                        {`${p.business_address?.street || ""} ${p.business_address?.barangay || ""}`}
                      </td>
                      <td className="px-6 py-4 text-sm font-mono text-gray-600 dark:text-gray-300">
                        {p.permit_number}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span
                     className={`px-3 py-1.5 text-xs font-sm rounded-full ${

                            p.permit_type?.toLowerCase() === "new"
                              ? "bg-[#4CAF50]/20 text-[#4CAF50] border border-[#4CAF50]/30"
                              : p.permit_type?.toLowerCase() === "renewal"
                              ? "bg-[#4A90E2]/20 text-[#4A90E2] border border-[#4A90E2]/30"
                              : p.permit_type?.toLowerCase() === "special"
                              ? "bg-[#FDA811]/20 text-[#FDA811] border border-[#FDA811]/30"
                              : p.permit_type?.toLowerCase() === "liquor"
                              ? "bg-purple-100 text-purple-800 border border-purple-200"
                              : p.permit_type?.toLowerCase() === "amendment"
                              ? "bg-sky-100 text-sky-800 border border-sky-200"
                              : "bg-gray-100 text-gray-800 border border-gray-200"
                          }`}
                        >
                          {p.permit_type || "Unknown"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                        {p.submitted_at}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`px-3 py-1.5 text-xs font-medium rounded-full border ${getStatusColor(
                            p.status
                          )} border-current border-opacity-30`}
                        >
                          {p.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          p.assigned_officer 
                            ? "bg-[#4CAF50]/20 text-[#4CAF50] border border-[#4CAF50]/30" 
                            : "bg-gray-100 text-gray-600 border border-gray-200"
                        }`}>
                          {p.assigned_officer || "Unassigned"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <button
                          onClick={() => openModal(p)}
                          className="inline-flex items-center px-4 py-2 text-xs font-medium rounded-lg text-white bg-gradient-to-r from-[#4CAF50] to-[#4A90E2] hover:from-[#4CAF50]/90 hover:to-[#4A90E2]/90 transition-all shadow-sm hover:shadow-md"
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

      {/* Modal with Enhanced Business Details */}
      {showModal && selectedPermit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 overflow-auto">
          <div className="w-full max-w-6xl bg-white dark:bg-slate-800 rounded-xl shadow-2xl">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200 dark:border-slate-700 bg-gradient-to-r from-[#4CAF50]/5 to-[#4A90E2]/5 rounded-t-xl">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Business Permit Details</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {selectedPermit.permit_number} • {selectedPermit.business_name}
                  </p>
                  <span className={`mt-2 px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(selectedPermit.status)}`}>
                    {selectedPermit.status}
                  </span>
                </div>
                <button 
                  onClick={closeModal}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <span className="text-2xl text-gray-500">×</span>
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
              {/* Business Information Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Business Name</label>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white mt-1">
                      {selectedPermit.business_name}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Trade Name</label>
                    <p className="text-gray-900 dark:text-white mt-1">
                      {selectedPermit.trade_name || "N/A"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Business Nature</label>
                    <p className="text-gray-900 dark:text-white mt-1">
                      {selectedPermit.business_nature || "N/A"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Business Structure</label>
                    <p className="text-gray-900 dark:text-white mt-1">
                      {selectedPermit.business_structure || "N/A"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Registration Number</label>
                    <p className="text-gray-900 dark:text-white mt-1">
                      {selectedPermit.registration_no || "N/A"}
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">TIN Number</label>
                    <p className="text-gray-900 dark:text-white mt-1">
                      {selectedPermit.tin || "N/A"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Ownership Status</label>
                    <p className="text-gray-900 dark:text-white mt-1">
                      {selectedPermit.ownership_status || "N/A"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Building Type</label>
                    <p className="text-gray-900 dark:text-white mt-1">
                      {selectedPermit.building_type || "N/A"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Business Activity</label>
                    <p className="text-gray-900 dark:text-white mt-1">
                      {selectedPermit.business_activity || "N/A"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Number of Employees</label>
                    <p className="text-gray-900 dark:text-white mt-1">
                      {selectedPermit.number_of_employees || "0"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Business Description */}
              {selectedPermit.business_description && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Business Description</label>
                  <p className="text-gray-900 dark:text-white mt-1 bg-gray-50 dark:bg-slate-700 p-3 rounded-lg">
                    {selectedPermit.business_description}
                  </p>
                </div>
              )}

              {/* Financial Information */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Capital Investment</label>
                  <p className="text-xl font-bold text-[#4CAF50] mt-1">
                    ₱{selectedPermit.capital_investment?.toLocaleString() || "0"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Permit Fee</label>
                  <p className="text-xl font-bold text-[#4A90E2] mt-1">
                    ₱{selectedPermit.total_amount?.toLocaleString() || "0"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Employees</label>
                  <p className="text-xl font-bold text-[#FDA811] mt-1">
                    {selectedPermit.number_of_employees || "0"}
                  </p>
                </div>
              </div>

              {/* Applicant Information */}
              <div className="border-t border-gray-200 dark:border-slate-700 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Applicant Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Full Name</label>
                    <p className="text-gray-900 dark:text-white mt-1">
                      {selectedPermit.applicant?.full_name}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Contact Number</label>
                    <p className="text-gray-900 dark:text-white mt-1">
                      {selectedPermit.applicant?.contact_number || "N/A"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Email Address</label>
                    <p className="text-gray-900 dark:text-white mt-1">
                      {selectedPermit.applicant?.email_address || "N/A"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Business Address</label>
                    <p className="text-gray-900 dark:text-white mt-1">
                      {`${selectedPermit.business_address?.street || ""} ${selectedPermit.business_address?.barangay || ""}, ${selectedPermit.business_address?.city_municipality || ""}`}
                    </p>
                  </div>
                </div>
              </div>

              {/* Officer Assignment - Only show for For Compliance status */}
              {selectedPermit.status === "For Compliance" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Assign Inspection Officer
                  </label>
                  <div className="flex gap-3">
                    <input 
                      value={assignedOfficerInput} 
                      onChange={(e) => setAssignedOfficerInput(e.target.value)} 
                      className="flex-1 border border-gray-300 rounded-lg px-4 py-3 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
                      placeholder="Enter officer name" 
                    />
                    <button 
                      onClick={handleSaveAssignment}
                      className="px-6 py-3 bg-[#4CAF50] text-white rounded-lg hover:bg-[#4CAF50]/90 transition-colors font-medium"
                    >
                      Assign
                    </button>
                  </div>
                </div>
              )}

              {/* Review Comment - Only show for For Compliance status */}
              {selectedPermit.status === "For Compliance" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Review Comments
                  </label>
                  <textarea 
                    value={actionComment} 
                    onChange={(e) => setActionComment(e.target.value)} 
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
                    rows={4} 
                    placeholder="Add comments for approval or rejection..." 
                  />
                </div>
              )}

              {/* Submitted Compliance Attachments - Show for "For Compliance" status */}
              {selectedPermit.status === "For Compliance" && selectedPermit.compliance_files && selectedPermit.compliance_files.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Submitted Compliance Attachments</h3>
                  <div className="space-y-4">
                    {selectedPermit.compliance_files.map((file) => (
                      <div key={file.id} className="border border-gray-200 dark:border-slate-600 rounded-lg p-4 bg-gray-50 dark:bg-slate-700/50">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                              <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900 dark:text-white">{file.name}</h4>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {file.size} • Submitted on {new Date(file.submitted_date).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getFileStatusColor(file.status)}`}>
                            {file.status.replace('_', ' ').toUpperCase()}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-3 mb-3">
                          <button
                            onClick={() => handleFileStatusChange(file.id, 'approved')}
                            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                              file.status === 'approved' 
                                ? 'bg-green-600 text-white' 
                                : 'bg-green-100 text-green-700 hover:bg-green-200'
                            }`}
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleFileStatusChange(file.id, 'rejected')}
                            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                              file.status === 'rejected' 
                                ? 'bg-red-600 text-white' 
                                : 'bg-red-100 text-red-700 hover:bg-red-200'
                            }`}
                          >
                            Reject
                          </button>
                          <button
                            onClick={() => handleFileStatusChange(file.id, 'pending_review')}
                            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                              file.status === 'pending_review' 
                                ? 'bg-yellow-600 text-white' 
                                : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                            }`}
                          >
                            Pending
                          </button>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Review Comments</label>
                          <textarea
                            value={file.review_comment || ''}
                            onChange={(e) => handleFileReview(file.id, e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4CAF50] text-sm"
                            rows={2}
                            placeholder="Add comments about this file..."
                          />
                        </div>

                        <div className="flex justify-between items-center mt-3">
                          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center space-x-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            <span>Preview</span>
                          </button>
                          <button className="text-green-600 hover:text-green-800 text-sm font-medium flex items-center space-x-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            <span>Download</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Compliance Remarks - Only show for "For Compliance" status */}
              {selectedPermit.status === "For Compliance" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Compliance Remarks</label>
                  <textarea
                    value={complianceRemarks}
                    onChange={e => setComplianceRemarks(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4CAF50]"
                    rows={3}
                    placeholder="Update compliance remarks if needed..."
                  />
                </div>
              )}

              {/* Original Application Attachments */}
              {selectedPermit.attachments?.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Original Application Attachments</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedPermit.attachments?.map((a, i) => (
                      <div key={i} className="flex items-center justify-between p-3 border border-gray-200 dark:border-slate-600 rounded-lg">
                        <a 
                          className="text-[#4A90E2] hover:text-[#4A90E2]/80 font-medium flex items-center gap-2" 
                          href={a.url} 
                          target="_blank" 
                          rel="noreferrer"
                        >
                          📎 {a.name}
                        </a>
                        <button 
                          onClick={() => setPreviewUrl(a.url)} 
                          className="px-3 py-1 text-xs bg-[#FDA811] text-white rounded hover:bg-[#FDA811]/90 transition-colors"
                        >
                          Preview
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons - Only show for For Compliance status */}
              {selectedPermit.status === "For Compliance" ? (
                <div className="flex gap-3 justify-end pt-6 border-t border-gray-200 dark:border-slate-700">
                  <button 
                    onClick={handleReject}
                    className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                  >
                    Reject Application
                  </button>
                  <button 
                    onClick={handleApprove}
                    className="px-6 py-3 bg-gradient-to-r from-[#4CAF50] to-[#4A90E2] text-white rounded-lg hover:from-[#4CAF50]/90 hover:to-[#4A90E2]/90 transition-all font-medium shadow-sm"
                  >
                    Approve Permit
                  </button>
                </div>
              ) : (
                // Close button for Approved/Rejected status
                <div className="flex justify-end pt-6 border-t border-gray-200 dark:border-slate-700">
                  <button 
                    onClick={closeModal}
                    className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}