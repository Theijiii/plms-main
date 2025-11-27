import { useEffect, useState } from "react";
import { logTx } from '../../../lib/txLogger';

// Mock data directly in the component file
const MOCK_PERMITS = [
  {
    id: 1,
    permit_number: "BRGY-2024-001",
    permit_type: "Business Permit",
    application_date: "2024-01-15T08:30:00Z",
    first_name: "Maria",
    middle_initial: "R",
    last_name: "Santos",
    suffix: "",
    contact_number: "+639171234567",
    email: "maria.santos@email.com",
    birth_date: "1985-03-15",
    gender: "Female",
    civil_status: "Married",
    nationality: "Filipino",
    house_no: "123",
    street: "Main Street",
    barangay: "Barangay 1",
    city_municipality: "Quezon City",
    province: "Metro Manila",
    zip_code: "1100",
    purpose: "Small Sari-sari Store",
    duration: "1 year",
    id_type: "Driver's License",
    id_number: "DL123456789",
    business_name: "Maria's Sari-Sari Store",
    business_address: "123 Main Street, Barangay 1, Quezon City",
    nature_of_business: "Retail - General Merchandise",
    business_registration_number: "BN-2024-00123",
    clearance_fee: "500.00",
    receipt_number: "RCPT-2024-001",
    applicant_signature: "data:image/svg+xml;base64,...",
    applicant_photo: "data:image/jpeg;base64,...",
    applicant_fingerprint: "data:image/png;base64,...",
    attachments: ["barangay_clearance.pdf", "business_permit.pdf"],
    created_at: "2024-01-15T08:30:00Z",
    updated_at: "2024-01-15T08:30:00Z",
    status: "For Compliance",
    assigned_officer: "Officer Cruz",
    review_comments: "",
    compliance_remarks: "",
    compliance_files: []
  },
  {
    id: 2,
    permit_number: "BRGY-2024-002",
    permit_type: "Residence Certificate",
    application_date: "2024-01-10T14:20:00Z",
    first_name: "Juan",
    middle_initial: "M",
    last_name: "dela Cruz",
    suffix: "Jr",
    contact_number: "+639182345678",
    email: "juan.delacruz@email.com",
    birth_date: "1990-07-22",
    gender: "Male",
    civil_status: "Single",
    nationality: "Filipino",
    house_no: "456",
    street: "Oak Avenue",
    barangay: "Barangay 2",
    city_municipality: "Makati City",
    province: "Metro Manila",
    zip_code: "1200",
    purpose: "Employment Requirement",
    duration: "6 months",
    id_type: "Passport",
    id_number: "P12345678",
    business_name: "",
    business_address: "",
    nature_of_business: "",
    business_registration_number: "",
    clearance_fee: "50.00",
    receipt_number: "RCPT-2024-002",
    applicant_signature: "data:image/svg+xml;base64,...",
    applicant_photo: "data:image/jpeg;base64,...",
    applicant_fingerprint: "data:image/png;base64,...",
    attachments: ["birth_certificate.pdf", "proof_of_residence.pdf"],
    created_at: "2024-01-10T14:20:00Z",
    updated_at: "2024-01-12T09:15:00Z",
    status: "Approved",
    assigned_officer: "Officer Reyes",
    review_comments: "All documents verified and complete",
    compliance_remarks: "",
    compliance_files: []
  },
  {
    id: 3,
    permit_number: "BRGY-2024-003",
    permit_type: "Event Permit",
    application_date: "2024-01-08T10:45:00Z",
    first_name: "Ana",
    middle_initial: "L",
    last_name: "Ramos",
    suffix: "",
    contact_number: "+639193456789",
    email: "ana.ramos@email.com",
    birth_date: "1988-12-03",
    gender: "Female",
    civil_status: "Married",
    nationality: "Filipino",
    house_no: "789",
    street: "Pine Street",
    barangay: "Barangay 3",
    city_municipality: "Mandaluyong City",
    province: "Metro Manila",
    zip_code: "1550",
    purpose: "Birthday Party",
    duration: "1 day",
    id_type: "UMID",
    id_number: "UMID123456789",
    business_name: "",
    business_address: "",
    nature_of_business: "",
    business_registration_number: "",
    clearance_fee: "200.00",
    receipt_number: "RCPT-2024-003",
    applicant_signature: "data:image/svg+xml;base64,...",
    applicant_photo: "data:image/jpeg;base64,...",
    applicant_fingerprint: "data:image/png;base64,...",
    attachments: ["venue_layout.pdf", "guest_list.pdf"],
    created_at: "2024-01-08T10:45:00Z",
    updated_at: "2024-01-14T16:30:00Z",
    status: "For Compliance",
    assigned_officer: "Officer Torres",
    review_comments: "Missing noise permit and security plan",
    compliance_remarks: "Please submit noise permit application and security detail plan",
    compliance_files: [
      { 
        id: 1, 
        name: "noise_permit_application.pdf", 
        type: "application/pdf",
        submitted_date: "2024-01-16T10:30:00Z",
        status: "pending_review",
        size: "2.4 MB"
      },
      { 
        id: 2, 
        name: "security_plan.pdf", 
        type: "application/pdf",
        submitted_date: "2024-01-16T10:30:00Z", 
        status: "pending_review",
        size: "1.8 MB"
      },
      { 
        id: 3, 
        name: "venue_insurance.jpg", 
        type: "image/jpeg",
        submitted_date: "2024-01-16T11:15:00Z",
        status: "approved",
        size: "3.2 MB"
      }
    ]
  },
  {
    id: 4,
    permit_number: "BRGY-2024-004",
    permit_type: "Business Permit",
    application_date: "2024-01-05T11:20:00Z",
    first_name: "Carlos",
    middle_initial: "T",
    last_name: "Lim",
    suffix: "",
    contact_number: "+639204567890",
    email: "carlos.lim@email.com",
    birth_date: "1975-09-18",
    gender: "Male",
    civil_status: "Married",
    nationality: "Filipino",
    house_no: "321",
    street: "Elm Boulevard",
    barangay: "Barangay 4",
    city_municipality: "Pasig City",
    province: "Metro Manila",
    zip_code: "1600",
    purpose: "Computer Shop",
    duration: "1 year",
    id_type: "SSS ID",
    id_number: "SSS123456789",
    business_name: "CyberNet Cafe",
    business_address: "321 Elm Boulevard, Barangay 4, Pasig City",
    nature_of_business: "Internet and Gaming Cafe",
    business_registration_number: "BN-2024-00456",
    clearance_fee: "750.00",
    receipt_number: "RCPT-2024-004",
    applicant_signature: "data:image/svg+xml;base64,...",
    applicant_photo: "data:image/jpeg;base64,...",
    applicant_fingerprint: "data:image/png;base64,...",
    attachments: ["business_permit.pdf", "sanitary_permit.pdf"],
    created_at: "2024-01-05T11:20:00Z",
    updated_at: "2024-01-09T13:45:00Z",
    status: "Rejected",
    assigned_officer: "Officer Gomez",
    review_comments: "Location not zoned for commercial computer shop",
    compliance_remarks: "",
    compliance_files: []
  },
  {
    id: 5,
    permit_number: "BRGY-2024-005",
    permit_type: "Construction Permit",
    application_date: "2024-01-20T09:15:00Z",
    first_name: "Roberto",
    middle_initial: "S",
    last_name: "Gonzales",
    suffix: "III",
    contact_number: "+639215678901",
    email: "roberto.gonzales@email.com",
    birth_date: "1982-04-25",
    gender: "Male",
    civil_status: "Married",
    nationality: "Filipino",
    house_no: "654",
    street: "Maple Road",
    barangay: "Barangay 5",
    city_municipality: "Taguig City",
    province: "Metro Manila",
    zip_code: "1637",
    purpose: "House Renovation",
    duration: "3 months",
    id_type: "Driver's License",
    id_number: "DL987654321",
    business_name: "",
    business_address: "",
    nature_of_business: "",
    business_registration_number: "",
    clearance_fee: "300.00",
    receipt_number: "RCPT-2024-005",
    applicant_signature: "data:image/svg+xml;base64,...",
    applicant_photo: "data:image/jpeg;base64,...",
    applicant_fingerprint: "data:image/png;base64,...",
    attachments: ["building_plans.pdf", "owner_consent.pdf"],
    created_at: "2024-01-20T09:15:00Z",
    updated_at: "2024-01-20T09:15:00Z",
    status: "For Compliance",
    assigned_officer: "",
    review_comments: "",
    compliance_remarks: "",
    compliance_files: []
  },
  {
    id: 6,
    permit_number: "BRGY-2024-006",
    permit_type: "Business Permit",
    application_date: "2024-01-18T13:45:00Z",
    first_name: "Lorna",
    middle_initial: "D",
    last_name: "Fernandez",
    suffix: "",
    contact_number: "+639226789012",
    email: "lorna.fernandez@email.com",
    birth_date: "1978-11-30",
    gender: "Female",
    civil_status: "Widowed",
    nationality: "Filipino",
    house_no: "987",
    street: "Cedar Lane",
    barangay: "Barangay 6",
    city_municipality: "Marikina City",
    province: "Metro Manila",
    zip_code: "1800",
    purpose: "Beauty Salon",
    duration: "1 year",
    id_type: "PRC ID",
    id_number: "PRC123456789",
    business_name: "Lorna's Beauty Haven",
    business_address: "987 Cedar Lane, Barangay 6, Marikina City",
    nature_of_business: "Beauty and Wellness Services",
    business_registration_number: "BN-2024-00789",
    clearance_fee: "600.00",
    receipt_number: "RCPT-2024-006",
    applicant_signature: "data:image/svg+xml;base64,...",
    applicant_photo: "data:image/jpeg;base64,...",
    applicant_fingerprint: "data:image/png;base64,...",
    attachments: ["sanitary_permit.pdf", "business_permit_application.pdf"],
    created_at: "2024-01-18T13:45:00Z",
    updated_at: "2024-01-19T10:30:00Z",
    status: "Approved",
    assigned_officer: "Officer Reyes",
    review_comments: "Complete documents and compliant with requirements",
    compliance_remarks: "",
    compliance_files: []
  },
  {
    id: 7,
    permit_number: "BRGY-2024-007",
    permit_type: "Residence Certificate",
    application_date: "2024-01-22T08:00:00Z",
    first_name: "Michael",
    middle_initial: "P",
    last_name: "Tan",
    suffix: "",
    contact_number: "+639237890123",
    email: "michael.tan@email.com",
    birth_date: "1995-06-14",
    gender: "Male",
    civil_status: "Single",
    nationality: "Filipino",
    house_no: "147",
    street: "Birch Street",
    barangay: "Barangay 7",
    city_municipality: "Parañaque City",
    province: "Metro Manila",
    zip_code: "1700",
    purpose: "School Requirement",
    duration: "6 months",
    id_type: "Student ID",
    id_number: "STU202412345",
    business_name: "",
    business_address: "",
    nature_of_business: "",
    business_registration_number: "",
    clearance_fee: "50.00",
    receipt_number: "RCPT-2024-007",
    applicant_signature: "data:image/svg+xml;base64,...",
    applicant_photo: "data:image/jpeg;base64,...",
    applicant_fingerprint: "data:image/png;base64,...",
    attachments: ["school_id.pdf", "proof_of_residence.pdf"],
    created_at: "2024-01-22T08:00:00Z",
    updated_at: "2024-01-22T08:00:00Z",
    status: "For Compliance",
    assigned_officer: "Officer Cruz",
    review_comments: "",
    compliance_remarks: "",
    compliance_files: []
  }
];

export default function BarangayPermit() {
  const [selectedPermit, setSelectedPermit] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [permits, setPermits] = useState([]);
  const [actionComment, setActionComment] = useState('');
  const [assignedOfficerInput, setAssignedOfficerInput] = useState('');
  const [complianceRemarks, setComplianceRemarks] = useState('');
  const [complianceFiles, setComplianceFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Use mock data directly instead of fetching
    setPermits(MOCK_PERMITS);
    setLoading(false);
  }, []);

  const total = permits.length;
  const approved = permits.filter(p => p.status === "Approved").length;
  const rejected = permits.filter(p => p.status === "Rejected").length;
  const pending = permits.filter(p => p.status === "For Compliance").length; // Count "For Compliance" as pending
  const forCompliance = permits.filter(p => p.status === "For Compliance").length;

  const getStatusColor = (status) => {
    switch (status) {
      case "Approved": return "text-green-600 bg-green-100";
      case "Rejected": return "text-red-600 bg-red-100";
      case "For Compliance": return "text-orange-600 bg-orange-100";
      default: return "text-gray-600 bg-gray-100";
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

  const openModal = (permit) => {
    setSelectedPermit(permit);
    setAssignedOfficerInput(permit.assigned_officer || '');
    setActionComment(permit.review_comments || '');
    setComplianceRemarks(permit.compliance_remarks || '');
    setComplianceFiles(permit.compliance_files || []);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedPermit(null);
    setAssignedOfficerInput('');
    setActionComment('');
    setComplianceRemarks('');
    setComplianceFiles([]);
    setShowModal(false);
  };

  const updatePermitStatus = (id, status, comment = '', remarks = '', files = []) => {
    const now = new Date().toISOString();
    const updated = permits.map(p =>
      p.id === id
        ? { 
            ...p, 
            status, 
            review_comments: comment || p.review_comments, 
            compliance_remarks: remarks || p.compliance_remarks,
            compliance_files: files.length > 0 ? files : p.compliance_files,
            updated_at: now, 
            assigned_officer: assignedOfficerInput || p.assigned_officer 
          }
        : p
    );
    setPermits(updated);
    setSelectedPermit(updated.find(p => p.id === id));
  };

  const handleApprove = () => {
    if (!selectedPermit) return;
    if (selectedPermit.status === "Approved") {
      updatePermitStatus(selectedPermit.id, 'Approved', actionComment);
      try { logTx({ service: 'barangay', permitId: selectedPermit.id, action: 'update_review', comment: actionComment }); } catch(e) {}
    } else {
      updatePermitStatus(selectedPermit.id, 'Approved', actionComment);
      try { logTx({ service: 'barangay', permitId: selectedPermit.id, action: 'approve', comment: actionComment }); } catch(e) {}
    }
  };

  const handleReject = () => {
    if (!selectedPermit) return;
    if (selectedPermit.status === "Rejected") {
      updatePermitStatus(selectedPermit.id, 'Rejected', actionComment);
      try { logTx({ service: 'barangay', permitId: selectedPermit.id, action: 'update_review', comment: actionComment }); } catch(e) {}
    } else {
      updatePermitStatus(selectedPermit.id, 'Rejected', actionComment);
      try { logTx({ service: 'barangay', permitId: selectedPermit.id, action: 'reject', comment: actionComment }); } catch(e) {}
    }
  };

  const handleForCompliance = () => {
    if (!selectedPermit) return;
    updatePermitStatus(selectedPermit.id, 'For Compliance', actionComment, complianceRemarks, complianceFiles);
    try { 
      logTx({ 
        service: 'barangay', 
        permitId: selectedPermit.id, 
        action: 'for_compliance', 
        comment: actionComment,
        remarks: complianceRemarks 
      }); 
    } catch(e) {}
  };

  const handleSaveAssignment = () => {
    if (!selectedPermit) return;
    const updated = permits.map(p =>
      p.id === selectedPermit.id
        ? { ...p, assigned_officer: assignedOfficerInput || p.assigned_officer, updated_at: new Date().toISOString() }
        : p
    );
    setPermits(updated);
    setSelectedPermit(updated.find(p => p.id === selectedPermit.id));
    try { logTx({ service: 'barangay', permitId: selectedPermit.id, action: 'assign', comment: `assigned:${assignedOfficerInput}` }); } catch(e) {}
  };

  const handleFileStatusChange = (fileId, newStatus) => {
    if (!selectedPermit) return;
    
    const updatedFiles = selectedPermit.compliance_files.map(file => 
      file.id === fileId ? { ...file, status: newStatus } : file
    );
    
    const updated = permits.map(p =>
      p.id === selectedPermit.id
        ? { ...p, compliance_files: updatedFiles }
        : p
    );
    
    setPermits(updated);
    setSelectedPermit(updated.find(p => p.id === selectedPermit.id));
    
    try { 
      logTx({ 
        service: 'barangay', 
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
    
    const updated = permits.map(p =>
      p.id === selectedPermit.id
        ? { ...p, compliance_files: updatedFiles }
        : p
    );
    
    setPermits(updated);
    setSelectedPermit(updated.find(p => p.id === selectedPermit.id));
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-lg">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Barangay Permits Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">Overview of submitted barangay permits</p>
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
          <p className="text-[#FDA811] text-sm font-medium">Pending</p>
          <p className="text-[#FDA811] text-2xl font-bold">{pending}</p>
        </div>

        <div className="bg-red-100 p-4 rounded-lg border border-red-200">
          <p className="text-red-600 text-sm font-medium">Rejected</p>
          <p className="text-red-600 text-2xl font-bold">{rejected}</p>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full bg-white dark:bg-slate-800 shadow rounded-lg">
          <thead className="bg-gradient-to-r from-[#4CAF50]/10 to-[#4A90E2]/10">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Permit No.</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Applicant</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Barangay</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Purpose</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Assigned</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {permits.map(p => (
              <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50">
                <td className="px-6 py-4 text-sm font-mono text-gray-600 dark:text-gray-300">{p.permit_number}</td>
                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                  {p.first_name} {p.middle_initial} {p.last_name} {p.suffix}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{p.barangay}</td>
                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{p.purpose}</td>
                <td className="px-6 py-4 text-sm">
                  <span className={`px-3 py-1.5 text-xs font-medium rounded-full border ${getStatusColor(p.status)}`}>
                    {p.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{p.assigned_officer || 'Unassigned'}</td>
                <td className="px-6 py-4 text-sm">
                  <button
                    className="px-4 py-2 text-xs font-medium rounded-lg text-white bg-gradient-to-r from-[#4CAF50] to-[#4A90E2] hover:from-[#4CAF50]/90 hover:to-[#4A90E2]/90 transition-all shadow-sm"
                    onClick={() => openModal(p)}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && selectedPermit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-20 backdrop-blur-sm p-4 overflow-auto">
          <div className="w-full max-w-6xl bg-white dark:bg-slate-800 rounded-xl shadow-2xl">
            {/* Header */}
            <div className="p-6 border-b border-gray-200 dark:border-slate-700 bg-gradient-to-r from-[#4CAF50]/5 to-[#4A90E2]/5 rounded-t-xl flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Permit Details</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {selectedPermit.permit_type} • {selectedPermit.purpose}
                </p>
                <span className={`mt-2 px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(selectedPermit.status)}`}>
                  {selectedPermit.status}
                </span>
              </div>
              <button onClick={closeModal} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                <span className="text-2xl text-gray-500">×</span>
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Personal Information */}
              <div className="col-span-1 md:col-span-2">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">FULL NAME</label>
                    <p className="text-gray-900 dark:text-white mt-1">
                      {selectedPermit.first_name} {selectedPermit.middle_initial} {selectedPermit.last_name} {selectedPermit.suffix}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">CONTACT NUMBER</label>
                    <p className="text-gray-900 dark:text-white mt-1">{selectedPermit.contact_number}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">EMAIL</label>
                    <p className="text-gray-900 dark:text-white mt-1">{selectedPermit.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">BIRTH DATE</label>
                    <p className="text-gray-900 dark:text-white mt-1">
                      {new Date(selectedPermit.birth_date).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">GENDER</label>
                    <p className="text-gray-900 dark:text-white mt-1">{selectedPermit.gender}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">CIVIL STATUS</label>
                    <p className="text-gray-900 dark:text-white mt-1">{selectedPermit.civil_status}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">NATIONALITY</label>
                    <p className="text-gray-900 dark:text-white mt-1">{selectedPermit.nationality}</p>
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div className="col-span-1 md:col-span-2">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Address Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">HOUSE NO.</label>
                    <p className="text-gray-900 dark:text-white mt-1">{selectedPermit.house_no}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">STREET</label>
                    <p className="text-gray-900 dark:text-white mt-1">{selectedPermit.street}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">BARANGAY</label>
                    <p className="text-gray-900 dark:text-white mt-1">{selectedPermit.barangay}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">CITY/MUNICIPALITY</label>
                    <p className="text-gray-900 dark:text-white mt-1">{selectedPermit.city_municipality}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">PROVINCE</label>
                    <p className="text-gray-900 dark:text-white mt-1">{selectedPermit.province}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">ZIP CODE</label>
                    <p className="text-gray-900 dark:text-white mt-1">{selectedPermit.zip_code}</p>
                  </div>
                </div>
              </div>

              {/* Permit Details */}
              <div className="col-span-1 md:col-span-2">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Permit Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">PERMIT TYPE</label>
                    <p className="text-gray-900 dark:text-white mt-1">{selectedPermit.permit_type}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">PURPOSE</label>
                    <p className="text-gray-900 dark:text-white mt-1">{selectedPermit.purpose}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">DURATION</label>
                    <p className="text-gray-900 dark:text-white mt-1">{selectedPermit.duration}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">ID TYPE</label>
                    <p className="text-gray-900 dark:text-white mt-1">{selectedPermit.id_type}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">ID NUMBER</label>
                    <p className="text-gray-900 dark:text-white mt-1">{selectedPermit.id_number}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">APPLICATION DATE</label>
                    <p className="text-gray-900 dark:text-white mt-1">
                      {new Date(selectedPermit.application_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Business Information - Only show if applicable */}
              {selectedPermit.business_name && (
                <div className="col-span-1 md:col-span-2">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Business Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-500">BUSINESS NAME</label>
                      <p className="text-gray-900 dark:text-white mt-1">{selectedPermit.business_name}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">BUSINESS ADDRESS</label>
                      <p className="text-gray-900 dark:text-white mt-1">{selectedPermit.business_address}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">NATURE OF BUSINESS</label>
                      <p className="text-gray-900 dark:text-white mt-1">{selectedPermit.nature_of_business}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">BUSINESS REGISTRATION NUMBER</label>
                      <p className="text-gray-900 dark:text-white mt-1">{selectedPermit.business_registration_number}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Payment Information */}
              <div className="col-span-1 md:col-span-2">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Payment Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">CLEARANCE FEE</label>
                    <p className="text-gray-900 dark:text-white mt-1">₱{selectedPermit.clearance_fee}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">RECEIPT NUMBER</label>
                    <p className="text-gray-900 dark:text-white mt-1">{selectedPermit.receipt_number}</p>
                  </div>
                </div>
              </div>

              {/* Officer Assignment - Only show for "For Compliance" status */}
              {selectedPermit.status === "For Compliance" && (
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Assign Inspection Officer</label>
                  <div className="flex gap-3">
                    <input
                      value={assignedOfficerInput}
                      onChange={e => setAssignedOfficerInput(e.target.value)}
                      placeholder="Enter officer name"
                      className="flex-1 border border-gray-300 rounded-lg px-4 py-3 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4CAF50]"
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

              {/* Review Comments - Only show for "For Compliance" status */}
              {selectedPermit.status === "For Compliance" && (
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Review Comments</label>
                  <textarea
                    value={actionComment}
                    onChange={e => setActionComment(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4CAF50]"
                    rows={3}
                    placeholder="Enter review comments..."
                  />
                </div>
              )}

              {/* Submitted Compliance Attachments - Show for "For Compliance" status */}
              {selectedPermit.status === "For Compliance" && selectedPermit.compliance_files && selectedPermit.compliance_files.length > 0 && (
                <div className="col-span-1 md:col-span-2">
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
                <div className="col-span-1 md:col-span-2">
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

              {/* Action Buttons - Only show for "For Compliance" status */}
              {selectedPermit.status === "For Compliance" ? (
                <div className="col-span-1 md:col-span-2 flex gap-3 justify-end pt-6 border-t border-gray-200 dark:border-slate-700">
                  <button
                    onClick={handleForCompliance}
                    className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium"
                  >
                    Mark for Compliance
                  </button>
                  
                  <button
                    onClick={handleReject}
                    className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                  >
                    Reject
                  </button>
                  
                  <button
                    onClick={handleApprove}
                    className="px-6 py-3 bg-gradient-to-r from-[#4CAF50] to-[#4A90E2] text-white rounded-lg hover:from-[#4CAF50]/90 hover:to-[#4A90E2]/90 transition-all font-medium shadow-sm"
                  >
                    Approve
                  </button>
                </div>
              ) : (
                // Close button for Approved/Rejected status
                <div className="col-span-1 md:col-span-2 flex justify-end pt-6 border-t border-gray-200 dark:border-slate-700">
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