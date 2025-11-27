import { useEffect, useState, useMemo } from "react";
import { logTx } from '../../../lib/txLogger';

export default function Franchise(){
  const [franchise, setFranchise] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("all");

  // Modal state
  const [selectedPermit, setSelectedPermit] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [assignedOfficerInput, setAssignedOfficerInput] = useState("");
  const [actionComment, setActionComment] = useState("");
  const [compliancePreview, setCompliancePreview] = useState(null);

  // Mock data that matches your database structure
  const mockFranchiseData = [
    {
      id: 1,
      full_name: "Juan Dela Cruz",
      home_address: "123 Main St, Bagong Barrio, Caloocan",
      contact_number: "09123456789",
      email: "juan@example.com",
      citizenship: "Filipino",
      birth_date: "1985-05-15",
      id_type: "Driver's License",
      id_number: "DL123456789",
      make_brand: "Honda",
      model: "TMX 155",
      engine_number: "ENG123456",
      chassis_number: "CHS123456",
      plate_number: "ABC123",
      year_acquired: "2020",
      color: "Red",
      vehicle_type: "Tricycle",
      lto_or_number: "OR123456",
      lto_cr_number: "CR123456",
      lto_expiration_date: "2025-12-31",
      mv_file_number: "MV123456",
      district: "District 1",
      route_zone: "Bagong Barrio – Bagong Barrio Terminal – EDSA – Monumento Circle",
      toda_name: "Bagong Barrio TODA",
      barangay_of_operation: "Bagong Barrio",
      status: "Pending",
      date_submitted: "2024-01-15",
      applicant_signature: "Juan Dela Cruz",
      barangay_captain_signature: "Capt. Rodriguez",
      
      // Checkbox fields
      barangay_clearance_checked: 1,
      toda_endorsement_checked: 1,
      lto_or_cr_checked: 1,
      insurance_certificate_checked: 0,
      drivers_license_checked: 1,
      emission_test_checked: 1,
      tricycle_body_number_picture_checked: 0,
      id_picture_checked: 1,
      proof_of_residency_checked: 1,
      affidavit_of_ownership_checked: 0,
      police_clearance_checked: 1,
      official_receipt_checked: 1,
      franchise_fee_checked: 1,
      sticker_id_fee_checked: 1,
      inspection_fee_checked: 1,
      
      // Payment fields
      franchise_fee_or: "OR001234",
      sticker_id_fee_or: "OR001235", 
      inspection_fee_or: "OR001236",
      
      // File attachments
      file_attachments: JSON.stringify({
        proof_of_residency: "residency_juan.pdf",
        barangay_clearance: "clearance_juan.pdf",
        toda_endorsement: "toda_juan.pdf",
        lto_or_cr: "lto_juan.pdf",
        drivers_license: "license_juan.pdf",
        emission_test: "emission_juan.pdf",
        id_picture: "id_juan.jpg"
      }),
      
      compliance_requirements: [
        { name: "Updated Insurance Certificate", url: "/documents/insurance.pdf", uploaded: false },
        { name: "Recent Emission Test", url: "/documents/emission.pdf", uploaded: true },
      ]
    },
    {
      id: 2,
      full_name: "Maria Santos",
      home_address: "456 Oak St, Grace Park, Caloocan",
      contact_number: "09198765432",
      email: "maria@example.com",
      citizenship: "Filipino",
      birth_date: "1990-08-20",
      id_type: "National ID",
      id_number: "NAT987654321",
      make_brand: "Kawasaki",
      model: "Barako 175",
      engine_number: "ENG654321",
      chassis_number: "CHS654321",
      plate_number: "XYZ789",
      year_acquired: "2021",
      color: "Blue",
      vehicle_type: "Tricycle",
      lto_or_number: "OR654321",
      lto_cr_number: "CR654321",
      lto_expiration_date: "2025-11-30",
      mv_file_number: "MV654321",
      district: "District 2",
      route_zone: "Grace Park – Rizal Avenue – MCU – Monumento",
      toda_name: "Grace Park TODA",
      barangay_of_operation: "Grace Park",
      status: "Approved",
      date_submitted: "2024-01-10",
      applicant_signature: "Maria Santos",
      barangay_captain_signature: "Capt. Garcia",
      
      // Checkbox fields
      barangay_clearance_checked: 1,
      toda_endorsement_checked: 1,
      lto_or_cr_checked: 1,
      insurance_certificate_checked: 1,
      drivers_license_checked: 1,
      emission_test_checked: 1,
      tricycle_body_number_picture_checked: 1,
      id_picture_checked: 1,
      proof_of_residency_checked: 1,
      affidavit_of_ownership_checked: 1,
      police_clearance_checked: 1,
      official_receipt_checked: 1,
      franchise_fee_checked: 1,
      sticker_id_fee_checked: 1,
      inspection_fee_checked: 1,
      
      // Payment fields
      franchise_fee_or: "OR002345",
      sticker_id_fee_or: "OR002346",
      inspection_fee_or: "OR002347",
      
      // File attachments
      file_attachments: JSON.stringify({
        proof_of_residency: "residency_maria.pdf",
        barangay_clearance: "clearance_maria.pdf",
        toda_endorsement: "toda_maria.pdf",
        lto_or_cr: "lto_maria.pdf",
        insurance_certificate: "insurance_maria.pdf",
        drivers_license: "license_maria.pdf",
        emission_test: "emission_maria.pdf",
        id_picture: "id_maria.jpg",
        official_receipt: "receipt_maria.pdf"
      }),
      
      compliance_requirements: []
    },
    {
      id: 3,
      full_name: "Pedro Reyes",
      home_address: "789 Pine St, Camarin, Caloocan",
      contact_number: "09155512345",
      email: "pedro@example.com",
      citizenship: "Filipino",
      birth_date: "1988-03-10",
      id_type: "Driver's License",
      id_number: "DL555123456",
      make_brand: "Yamaha",
      model: "Sniper 150",
      engine_number: "ENG555123",
      chassis_number: "CHS555123",
      plate_number: "DEF456",
      year_acquired: "2022",
      color: "Black",
      vehicle_type: "Tricycle",
      lto_or_number: "OR555123",
      lto_cr_number: "CR555123",
      lto_expiration_date: "2025-10-31",
      mv_file_number: "MV555123",
      district: "District 3",
      route_zone: "Camarin Road – Zabarte – SM Fairview",
      toda_name: "Camarin TODA",
      barangay_of_operation: "Camarin",
      status: "For Compliance",
      date_submitted: "2024-01-18",
      applicant_signature: "Pedro Reyes",
      barangay_captain_signature: "Capt. Santos",
      
      // Checkbox fields
      barangay_clearance_checked: 1,
      toda_endorsement_checked: 1,
      lto_or_cr_checked: 1,
      insurance_certificate_checked: 0,
      drivers_license_checked: 1,
      emission_test_checked: 0,
      tricycle_body_number_picture_checked: 1,
      id_picture_checked: 1,
      proof_of_residency_checked: 1,
      affidavit_of_ownership_checked: 0,
      police_clearance_checked: 1,
      official_receipt_checked: 1,
      franchise_fee_checked: 1,
      sticker_id_fee_checked: 1,
      inspection_fee_checked: 0,
      
      // Payment fields
      franchise_fee_or: "OR003456",
      sticker_id_fee_or: "OR003457",
      inspection_fee_or: "",
      
      // File attachments
      file_attachments: JSON.stringify({
        proof_of_residency: "residency_pedro.pdf",
        barangay_clearance: "clearance_pedro.pdf",
        toda_endorsement: "toda_pedro.pdf",
        lto_or_cr: "lto_pedro.pdf",
        drivers_license: "license_pedro.pdf",
        id_picture: "id_pedro.jpg"
      }),
      
      compliance_requirements: [
        { name: "Insurance Certificate", url: "/documents/insurance_pedro.pdf", uploaded: false },
        { name: "Emission Test", url: "/documents/emission_pedro.pdf", uploaded: false },
        { name: "Inspection Fee Receipt", url: "/documents/inspection_pedro.pdf", uploaded: false }
      ]
    },
    {
      id: 4,
      full_name: "Ana Lopez",
      home_address: "321 Elm St, Bagumbong, Caloocan",
      contact_number: "09177788899",
      email: "ana@example.com",
      citizenship: "Filipino",
      birth_date: "1992-11-25",
      id_type: "Passport",
      id_number: "PP777888999",
      make_brand: "Suzuki",
      model: "Raider 150",
      engine_number: "ENG777888",
      chassis_number: "CHS777888",
      plate_number: "GHI789",
      year_acquired: "2023",
      color: "White",
      vehicle_type: "Tricycle",
      lto_or_number: "OR777888",
      lto_cr_number: "CR777888",
      lto_expiration_date: "2025-09-30",
      mv_file_number: "MV777888",
      district: "District 4",
      route_zone: "Bagumbong Road – Deparo – Camarin – Zabarte",
      toda_name: "Bagumbong TODA",
      barangay_of_operation: "Bagumbong",
      status: "Rejected",
      date_submitted: "2024-01-05",
      applicant_signature: "Ana Lopez",
      barangay_captain_signature: "Capt. Lim",
      
      // Checkbox fields
      barangay_clearance_checked: 0,
      toda_endorsement_checked: 0,
      lto_or_cr_checked: 1,
      insurance_certificate_checked: 0,
      drivers_license_checked: 1,
      emission_test_checked: 0,
      tricycle_body_number_picture_checked: 0,
      id_picture_checked: 1,
      proof_of_residency_checked: 0,
      affidavit_of_ownership_checked: 0,
      police_clearance_checked: 0,
      official_receipt_checked: 0,
      franchise_fee_checked: 0,
      sticker_id_fee_checked: 0,
      inspection_fee_checked: 0,
      
      // Payment fields
      franchise_fee_or: "",
      sticker_id_fee_or: "",
      inspection_fee_or: "",
      
      // File attachments
      file_attachments: JSON.stringify({
        lto_or_cr: "lto_ana.pdf",
        drivers_license: "license_ana.pdf",
        id_picture: "id_ana.jpg"
      }),
      
      compliance_requirements: []
    }
  ];

  // Transform mock data to frontend format
  const transformFranchiseData = (data) => {
    return data.map(item => ({
      id: item.id,
      name: item.full_name,
      location: item.barangay_of_operation,
      permit: {
        permitNo: `FR-${item.id.toString().padStart(4, '0')}`,
        issued: item.date_submitted || '',
        expiry: '',
        status: item.status || 'Pending',
        type: 'NEW'
      },
      submitted_at: item.date_submitted,
      last_updated: item.date_submitted,
      assigned_officer: item.status === 'Approved' ? 'Officer Smith' : '',
      review_status: item.status || 'Pending',
      review_comments: item.status === 'Rejected' ? 'Missing required documents' : '',
      applicant: {
        contact_person: item.full_name,
        contact_number: item.contact_number,
        email: item.email || 'N/A'
      },
      operation: {
        toda_name: item.toda_name,
        route_zone: item.route_zone,
        barangay_of_operation: item.barangay_of_operation
      },
      vehicle: {
        make_brand: item.make_brand,
        model: item.model
      },
      attachments: [],
      internal_notes: `Citizenship: ${item.citizenship}`,
      compliance_requirements: item.compliance_requirements || [],
      // Include all original data for detailed view
      originalData: item
    }));
  };

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Try to load from localStorage first (for persistence)
        const savedData = localStorage.getItem('franchise_applications');
        if (savedData) {
          const parsedData = JSON.parse(savedData);
          setFranchise(parsedData);
        } else {
          // Use mock data if nothing saved
          const transformedData = transformFranchiseData(mockFranchiseData);
          setFranchise(transformedData);
          // Save to localStorage for persistence
          localStorage.setItem('franchise_applications', JSON.stringify(transformedData));
        }
        
        setError(null);
      } catch (err) {
        console.error("Error loading franchise data:", err);
        // Fallback to mock data
        const transformedData = transformFranchiseData(mockFranchiseData);
        setFranchise(transformedData);
        setError("Using demo data. PHP backend is not available.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (franchise.length > 0) {
      localStorage.setItem('franchise_applications', JSON.stringify(franchise));
    }
  }, [franchise]);

  // Filter logic based on active tab
  const filteredFranchise = useMemo(() => {
    if (!franchise || franchise.length === 0) return [];

    let filtered = franchise;

    switch (activeTab) {
      case "new":
        filtered = franchise.filter(item => 
          !item.permit.status || 
          item.permit.status === 'Pending' || 
          item.permit.type === 'NEW'
        );
        break;
      case "renewal":
        filtered = franchise.filter(item => 
          item.permit.type === 'RENEWAL'
        );
        break;
      default:
        filtered = franchise;
    }

    return filtered;
  }, [franchise, activeTab]);

  // KPI counters
  const total = filteredFranchise.length;
  const approved = filteredFranchise.filter((p) => p.permit.status === "Approved").length;
  const rejected = filteredFranchise.filter((p) => p.permit.status === "Rejected").length;
  const pending = filteredFranchise.filter((p) => 
    !p.permit.status || p.permit.status === "Pending"
  ).length;
  const forCompliance = filteredFranchise.filter((p) => p.permit.status === "For Compliance").length;

  // Tab counts
  const countByType = {
    all: franchise.length,
    new: franchise.filter(item => 
      !item.permit.status || item.permit.status === 'Pending' || item.permit.type === 'NEW'
    ).length,
    renewal: franchise.filter(item => item.permit.type === 'RENEWAL').length,
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Approved":
        return "text-green-600 bg-green-100";
      case "Rejected":
        return "text-red-600 bg-red-100";
      case "Pending":
        return "text-yellow-600 bg-yellow-100";
      case "For Compliance":
        return "text-blue-600 bg-blue-100";
      default:
        return "text-gray-600 bg-gray-100";
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

  const getTabDisplayName = (tab) => {
    const names = {
      all: "All Applications",
      new: "New Applications",
      renewal: "Renewal Applications"
    };
    return names[tab] || tab;
  };

  const getTabDescription = (tab) => {
    const descriptions = {
      all: "Complete list of all franchise applications",
      new: "New franchise permit applications",
      renewal: "Franchise permit renewal requests"
    };
    return descriptions[tab] || "Franchise applications";
  };

  const openModal = (permit) => {
    setSelectedPermit(permit);
    setAssignedOfficerInput(permit.assigned_officer || "");
    setActionComment(permit.review_comments || "");
    setCompliancePreview(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedPermit(null);
    setAssignedOfficerInput("");
    setActionComment("");
    setCompliancePreview(null);
    setIsModalOpen(false);
  };

  const handlePreviewCompliance = (url) => {
    setCompliancePreview(url);
  };

  const closeCompliancePreview = () => {
    setCompliancePreview(null);
  };

  const updatePermitStatus = (id, status, comment) => {
    setFranchise((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              permit: { ...p.permit, status },
              review_status: status,
              review_comments: comment || p.review_comments,
              last_updated: new Date().toISOString(),
              assigned_officer: status === 'Approved' ? (p.assigned_officer || assignedOfficerInput || 'Officer Smith') : p.assigned_officer
            }
          : p
      )
    );

    setSelectedPermit((prev) => 
      prev && prev.id === id ? { 
        ...prev, 
        permit: { ...prev.permit, status }, 
        review_comments: comment || prev.review_comments 
      } : prev
    );

    try { 
      logTx({ 
        service: 'franchise', 
        permitId: id, 
        action: status.toLowerCase(), 
        comment: comment 
      }); 
    } catch(e) {}

    return true;
  };

  const handleApprove = () => {
    if (!selectedPermit) return;
    updatePermitStatus(selectedPermit.id, "Approved", actionComment);
    closeModal();
  };

  const handleReject = () => {
    if (!selectedPermit) return;
    updatePermitStatus(selectedPermit.id, "Rejected", actionComment);
    closeModal();
  };

  const handleForCompliance = () => {
    if (!selectedPermit) return;
    updatePermitStatus(selectedPermit.id, "For Compliance", actionComment);
    closeModal();
  };

  const handleSaveAssignment = () => {
    if (!selectedPermit) return;
    setFranchise((prev) => 
      prev.map((p) => 
        p.id === selectedPermit.id ? { 
          ...p, 
          assigned_officer: assignedOfficerInput, 
          last_updated: new Date().toISOString() 
        } : p
      )
    );
    setSelectedPermit((prev) => 
      prev ? { ...prev, assigned_officer: assignedOfficerInput } : prev
    );
    try { 
      logTx({ 
        service: 'franchise', 
        permitId: selectedPermit.id, 
        action: 'assign', 
        comment: `assigned:${assignedOfficerInput}` 
      }); 
    } catch(e) {}
  };

  const tabCategories = [
    { key: "all", label: "All Applications" },
    { key: "new", label: "NEW" },
    { key: "renewal", label: "RENEWAL" },
  ];

  // Helper function to parse file attachments
  const parseFileAttachments = (fileAttachments) => {
    try {
      if (!fileAttachments) return [];
      const attachments = JSON.parse(fileAttachments);
      return Object.entries(attachments).map(([key, value]) => ({
        name: key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        file: value,
        url: `/documents/${value}`
      }));
    } catch (e) {
      return [];
    }
  };

  // Helper function to format checkbox values
  const formatCheckboxValue = (value) => {
    return value ? 'Yes' : 'No';
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-lg">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Franchise Applications Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage and track all franchise applications
        </p>
        
        {error && (
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="text-yellow-700 font-semibold">{error}</div>
            <p className="text-sm text-yellow-600 mt-1">
              To connect to PHP backend, start the server: <code>php -S localhost:8000 -t back-end</code>
            </p>
          </div>
        )}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <div className="bg-[#4CAF50]/10 p-4 rounded-lg border border-[#4CAF50]/20">
          <p className="text-[#4CAF50] text-sm font-medium">Total</p>
          <p className="text-[#4CAF50] text-2xl font-bold">{total}</p>
        </div>
        <div className="bg-[#4A90E2]/10 p-4 rounded-lg border border-[#4A90E2]/20">
          <p className="text-[#4A90E2] text-sm font-medium">Approved</p>
          <p className="text-[#4A90E2] text-2xl font-bold">{approved}</p>
        </div>
        <div className="bg-[#FDA811]/10 p-4 rounded-lg border border-[#FDA811]/20">
          <p className="text-[#FDA811] text-sm font-medium">Pending</p>
          <p className="text-[#FDA811] text-2xl font-bold">{pending}</p>
        </div>
        <div className="bg-blue-100 p-4 rounded-lg border border-blue-200">
          <p className="text-blue-600 text-sm font-medium">For Compliance</p>
          <p className="text-blue-600 text-2xl font-bold">{forCompliance}</p>
        </div>
        <div className="bg-red-100 p-4 rounded-lg border border-red-200">
          <p className="text-red-600 text-sm font-medium">Rejected</p>
          <p className="text-red-600 text-2xl font-bold">{rejected}</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="mb-6 bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 shadow-sm">
        {/* Tab Header */}
        <div className="p-4 border-b border-gray-200 dark:border-slate-700 bg-gradient-to-r from-[#4CAF50]/5 to-[#4A90E2]/5">
          <nav className="flex space-x-6">
            {tabCategories.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`py-2 px-3 border-b-2 font-medium text-sm flex items-center gap-2 transition-all whitespace-nowrap ${getTabBorderColor(tab.key)} ${getTabTextColor(tab.key)}`}
              >
                {tab.label}
                <span className={`px-2 py-1 text-xs rounded-full ${getTabBadgeColor(tab.key)}`}>
                  {countByType[tab.key]}
                </span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content Header */}
        <div className="p-6 border-b border-gray-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {getTabDisplayName(activeTab)}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                {getTabDescription(activeTab)} • {total} {total === 1 ? 'record' : 'records'} found
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-[#4CAF50] animate-pulse"></div>
              <span className="text-sm text-gray-500"> Live </span>
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
              <p className="text-gray-500 dark:text-gray-400">Loading franchise applications...</p>
            </div>
          )}
          {!loading && filteredFranchise.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">🚗</div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No {getTabDisplayName(activeTab).toLowerCase()} found
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                There are currently no {getTabDisplayName(activeTab).toLowerCase()} in the system.
              </p>
            </div>
          )}

          {!loading && filteredFranchise.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full bg-white dark:bg-slate-800 shadow rounded-lg">
                <thead className="bg-gradient-to-r from-[#4CAF50]/10 to-[#4A90E2]/10">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Applicant
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      TODA
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Barangay
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Vehicle
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
                  {filteredFranchise.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {p.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {p.applicant.contact_number}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                        {p.operation?.toda_name || 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                        {p.location}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                        {p.vehicle?.make_brand} {p.vehicle?.model}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-3 py-1.5 text-xs font-medium rounded-full border ${getStatusColor(p.permit.status)} border-current border-opacity-30`}>
                          {p.permit.status}
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

      {/* Main Modal with transparent blur background */}
      {isModalOpen && selectedPermit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm p-4">
          <div className="w-full max-w-6xl bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-slate-700 bg-gradient-to-r from-[#4CAF50]/5 to-[#4A90E2]/5 rounded-t-xl">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Application Details</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {selectedPermit.permit.permitNo} • {selectedPermit.name}
                  </p>
                </div>
                <button 
                  onClick={closeModal}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <span className="text-2xl text-gray-500">×</span>
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Applicant Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b pb-2">Applicant Information</h3>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Full Name</label>
                    <p className="text-gray-900 dark:text-white">{selectedPermit.originalData.full_name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Home Address</label>
                    <p className="text-gray-900 dark:text-white">{selectedPermit.originalData.home_address}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Contact Number</label>
                    <p className="text-gray-900 dark:text-white">{selectedPermit.originalData.contact_number}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Email</label>
                    <p className="text-gray-900 dark:text-white">{selectedPermit.originalData.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Citizenship</label>
                    <p className="text-gray-900 dark:text-white">{selectedPermit.originalData.citizenship}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Birth Date</label>
                    <p className="text-gray-900 dark:text-white">{selectedPermit.originalData.birth_date}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">ID Type</label>
                    <p className="text-gray-900 dark:text-white">{selectedPermit.originalData.id_type}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">ID Number</label>
                    <p className="text-gray-900 dark:text-white">{selectedPermit.originalData.id_number}</p>
                  </div>
                </div>

                {/* Vehicle Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b pb-2">Vehicle Information</h3>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Make/Brand</label>
                    <p className="text-gray-900 dark:text-white">{selectedPermit.originalData.make_brand}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Model</label>
                    <p className="text-gray-900 dark:text-white">{selectedPermit.originalData.model}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Engine Number</label>
                    <p className="text-gray-900 dark:text-white">{selectedPermit.originalData.engine_number}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Chassis Number</label>
                    <p className="text-gray-900 dark:text-white">{selectedPermit.originalData.chassis_number}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Plate Number</label>
                    <p className="text-gray-900 dark:text-white">{selectedPermit.originalData.plate_number}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Year Acquired</label>
                    <p className="text-gray-900 dark:text-white">{selectedPermit.originalData.year_acquired}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Color</label>
                    <p className="text-gray-900 dark:text-white">{selectedPermit.originalData.color}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Vehicle Type</label>
                    <p className="text-gray-900 dark:text-white">{selectedPermit.originalData.vehicle_type}</p>
                  </div>
                </div>

                {/* LTO & Operation Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b pb-2">LTO & Operation</h3>
                  <div>
                    <label className="text-sm font-medium text-gray-500">LTO OR Number</label>
                    <p className="text-gray-900 dark:text-white">{selectedPermit.originalData.lto_or_number}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">LTO CR Number</label>
                    <p className="text-gray-900 dark:text-white">{selectedPermit.originalData.lto_cr_number}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">LTO Expiration</label>
                    <p className="text-gray-900 dark:text-white">{selectedPermit.originalData.lto_expiration_date}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">MV File Number</label>
                    <p className="text-gray-900 dark:text-white">{selectedPermit.originalData.mv_file_number || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">District</label>
                    <p className="text-gray-900 dark:text-white">{selectedPermit.originalData.district}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Route Zone</label>
                    <p className="text-gray-900 dark:text-white">{selectedPermit.originalData.route_zone}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">TODA Name</label>
                    <p className="text-gray-900 dark:text-white">{selectedPermit.originalData.toda_name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Barangay of Operation</label>
                    <p className="text-gray-900 dark:text-white">{selectedPermit.originalData.barangay_of_operation}</p>
                  </div>
                </div>
              </div>

              {/* Document Attachments */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Document Attachments</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {parseFileAttachments(selectedPermit.originalData.file_attachments).map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded bg-gray-50">
                      <span className="text-gray-700 font-medium">{file.name}</span>
                      <button 
                        onClick={() => handlePreviewCompliance(file.url)}
                        className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                      >
                        Preview
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Information */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Payment Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Franchise Fee OR</label>
                    <p className="text-gray-900 dark:text-white">{selectedPermit.originalData.franchise_fee_or || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Sticker/ID Fee OR</label>
                    <p className="text-gray-900 dark:text-white">{selectedPermit.originalData.sticker_id_fee_or || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Inspection Fee OR</label>
                    <p className="text-gray-900 dark:text-white">{selectedPermit.originalData.inspection_fee_or || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Signatures */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Signatures</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Applicant Signature</label>
                    <p className="text-gray-900 dark:text-white">{selectedPermit.originalData.applicant_signature}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Barangay Captain Signature</label>
                    <p className="text-gray-900 dark:text-white">{selectedPermit.originalData.barangay_captain_signature}</p>
                  </div>
                </div>
              </div>

              {/* Current Status */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Current Status</h3>
                <p className={`text-lg font-semibold px-3 py-1 rounded-full inline-block ${getStatusColor(selectedPermit.permit.status)}`}>
                  {selectedPermit.permit.status}
                </p>
              </div>

              {/* Compliance Requirements Section - Only show for "For Compliance" status */}
              {selectedPermit.permit.status === "For Compliance" && selectedPermit.compliance_requirements && selectedPermit.compliance_requirements.length > 0 && (
                <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
                  <h3 className="text-lg font-semibold text-blue-900 mb-3">Compliance Requirements</h3>
                  <div className="space-y-3">
                    {selectedPermit.compliance_requirements.map((req, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border border-blue-100 rounded bg-white">
                        <div className="flex items-center gap-3">
                          <span className={`w-3 h-3 rounded-full ${req.uploaded ? 'bg-green-500' : 'bg-red-500'}`}></span>
                          <span className="text-gray-700 font-medium">{req.name}</span>
                          <span className={`text-xs px-2 py-1 rounded ${req.uploaded ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {req.uploaded ? 'Uploaded' : 'Pending'}
                          </span>
                        </div>
                        {req.uploaded && (
                          <button 
                            onClick={() => handlePreviewCompliance(req.url)}
                            className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                          >
                            Preview
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons - Conditional based on current status */}
              <div className="flex gap-3 justify-end pt-6 border-t border-gray-200 dark:border-slate-700">
                {selectedPermit.permit.status === "Pending" && (
                  <>
                    <button 
                      onClick={handleForCompliance}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      For Compliance
                    </button>
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
                      Approve Application
                    </button>
                  </>
                )}
                {selectedPermit.permit.status === "For Compliance" && (
                  <>
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
                      Approve Application
                    </button>
                  </>
                )}
                {selectedPermit.permit.status === "Approved" && (
                  <div className="text-green-600 font-semibold text-lg">
                    ✓ Application has been approved - No further actions available
                  </div>
                )}
                {selectedPermit.permit.status === "Rejected" && (
                  <div className="text-red-600 font-semibold text-lg">
                    ✗ Application has been rejected - No further actions available
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Compliance Preview Modal with transparent blur background */}
      {compliancePreview && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm p-4">
          <div className="w-full max-w-4xl bg-white rounded-xl shadow-2xl">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold">Document Preview</h3>
              <button 
                onClick={closeCompliancePreview}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <span className="text-2xl text-gray-500">×</span>
              </button>
            </div>
            <div className="p-4">
              <div className="border rounded-lg bg-gray-100 p-8 text-center">
                <p className="text-gray-600 mb-4">Document Preview: {compliancePreview}</p>
                <p className="text-sm text-gray-500">In a real application, this would display the actual document</p>
              </div>
              <div className="mt-4 flex justify-end">
                <button 
                  onClick={closeCompliancePreview}
                  className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                >
                  Close Preview
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}