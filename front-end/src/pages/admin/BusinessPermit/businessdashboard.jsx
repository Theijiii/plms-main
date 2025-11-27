import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

export default function BusinessPermit() {
  const [business, setBusiness] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDark, setIsDark] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState("all"); // all | new | renewal | amendment | special | liquor
  const ITEMS_PER_PAGE = 15;

  // Mock data matching your table structure
  const mockBusinessData = [
    {
      id: "PERMIT-001",
      business_name: "Sunrise Bakery",
      owner_name: "Juan Dela Cruz",
      location: "123 M.L. Quezon St. San Isidro",
      permit_no: "PERMIT-001",
      permit_type: "New",
      date_applied: "2025-09-28",
      status: "For Compliance",
      assigned_to: "Unassigned",
      email_address: "juan.delacruz@email.com",
      business_address: "123 M.L. Quezon St. San Isidro, Caloocan City",
      contact_number: "09171234567",
      business_type: "Food and Beverage",
      tin_number: "123-456-789-000",
      dti_number: "DTI-2024-001234",
      mayor_permit_number: "MP-2024-567890",
      sanitary_permit: "SP-2024-112233",
      fire_safety_permit: "FS-2024-445566",
      barangay_clearance: "BC-2024-778899",
      zoning_clearance: "ZC-2024-001122",
      floor_area: "50 sqm",
      employees_count: "5",
      annual_income: "₱1,500,000",
      notes: "Initial application pending review"
    },
    {
      id: "PERMIT-002",
      business_name: "Green Grocers Corporation",
      owner_name: "Maria Santos",
      location: "45 Rizal Ave. Bagong Bayan",
      permit_no: "PERMIT-002",
      permit_type: "Renewal",
      date_applied: "2025-09-30",
      status: "Approved",
      assigned_to: "Officer Reyes",
      email_address: "maria.santos@email.com",
      business_address: "45 Rizal Ave. Bagong Bayan, Caloocan City",
      contact_number: "09181234567",
      business_type: "Retail",
      tin_number: "234-567-890-000",
      dti_number: "DTI-2023-002345",
      mayor_permit_number: "MP-2023-678901",
      sanitary_permit: "SP-2023-223344",
      fire_safety_permit: "FS-2023-556677",
      barangay_clearance: "BC-2023-889900",
      zoning_clearance: "ZC-2023-112233",
      floor_area: "120 sqm",
      employees_count: "8",
      annual_income: "₱3,200,000",
      notes: "Renewal application approved"
    },
    {
      id: "PERMIT-003",
      business_name: "Blue Harbor Restaurant",
      owner_name: "Pedro Reyes",
      location: "7 Marina Blvd. Port Area",
      permit_no: "PERMIT-003",
      permit_type: "Liquor",
      date_applied: "2025-10-02",
      status: "For Compliance",
      assigned_to: "Officer Cruz",
      email_address: "pedro.reyes@email.com",
      business_address: "7 Marina Blvd. Port Area, Caloocan City",
      contact_number: "09201234567",
      business_type: "Restaurant",
      tin_number: "345-678-901-000",
      dti_number: "DTI-2024-003456",
      mayor_permit_number: "MP-2024-789012",
      sanitary_permit: "SP-2024-334455",
      fire_safety_permit: "FS-2024-667788",
      barangay_clearance: "BC-2024-990011",
      zoning_clearance: "ZC-2024-223344",
      floor_area: "200 sqm",
      employees_count: "15",
      annual_income: "₱5,800,000",
      notes: "Liquor license application - needs additional documents"
    },
    {
      id: "PERMIT-004",
      business_name: "Ace Hardware and Construction Supply",
      owner_name: "Ana Lopez",
      location: "88 Industrial Rd. Zone 2",
      permit_no: "PERMIT-004",
      permit_type: "Amendment",
      date_applied: "2025-10-03",
      status: "Rejected",
      assigned_to: "Unassigned",
      email_address: "ana.lopez@email.com",
      business_address: "88 Industrial Rd. Zone 2, Caloocan City",
      contact_number: "09301234567",
      business_type: "Hardware",
      tin_number: "456-789-012-000",
      dti_number: "DTI-2022-004567",
      mayor_permit_number: "MP-2022-890123",
      sanitary_permit: "SP-2022-445566",
      fire_safety_permit: "FS-2022-778899",
      barangay_clearance: "BC-2022-001122",
      zoning_clearance: "ZC-2022-334455",
      floor_area: "300 sqm",
      employees_count: "12",
      annual_income: "₱8,500,000",
      notes: "Amendment request rejected - zoning violation"
    },
    {
      id: "PERMIT-005",
      business_name: "Lotus Spa and Wellness Center",
      owner_name: "Liza Cruz",
      location: "12 Wellness St. Green Park",
      permit_no: "PERMIT-005",
      permit_type: "Special",
      date_applied: "2025-10-04",
      status: "Approved",
      assigned_to: "Officer Ramos",
      email_address: "liza.cruz@email.com",
      business_address: "12 Wellness St. Green Park, Caloocan City",
      contact_number: "09401234567",
      business_type: "Wellness Services",
      tin_number: "567-890-123-000",
      dti_number: "DTI-2024-005678",
      mayor_permit_number: "MP-2024-901234",
      sanitary_permit: "SP-2024-556677",
      fire_safety_permit: "FS-2024-889900",
      barangay_clearance: "BC-2024-112233",
      zoning_clearance: "ZC-2024-445566",
      floor_area: "150 sqm",
      employees_count: "10",
      annual_income: "₱2,800,000",
      notes: "Special permit for wellness services approved"
    },
    {
      id: "PERMIT-006",
      business_name: "Metro Pharmacy and Drugstore",
      owner_name: "Mark Lim",
      location: "200 Health Ave. Central",
      permit_no: "PERMIT-006",
      permit_type: "New",
      date_applied: "2025-10-05",
      status: "For Compliance",
      assigned_to: "Unassigned",
      email_address: "mark.lim@email.com",
      business_address: "200 Health Ave. Central, Caloocan City",
      contact_number: "09501234567",
      business_type: "Pharmacy",
      tin_number: "678-901-234-000",
      dti_number: "DTI-2024-006789",
      mayor_permit_number: "MP-2024-012345",
      sanitary_permit: "SP-2024-667788",
      fire_safety_permit: "FS-2024-990011",
      barangay_clearance: "BC-2024-223344",
      zoning_clearance: "ZC-2024-556677",
      floor_area: "80 sqm",
      employees_count: "6",
      annual_income: "₱4,200,000",
      notes: "New pharmacy application - pending FDA clearance"
    }
  ];

  useEffect(() => {
    // Detect dark mode globally
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, { attributes: true });
    setIsDark(document.documentElement.classList.contains("dark"));

    const fetchData = async () => {
      try {
        // For demo purposes, using mock data
        setTimeout(() => {
          setBusiness(mockBusinessData);
          setLoading(false);
        }, 1000);
        
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to load business permits.");
        setLoading(false);
      }
    };

    // Single fetch on component mount
    fetchData();

    return () => observer.disconnect();
  }, []);

  // Filter business permits based on active tab
  const filteredBusiness = business.filter((permit) => {
    switch (activeTab) {
      case "new":
        return permit.permit_type === "New";
      case "renewal":
        return permit.permit_type === "Renewal";
      case "amendment":
        return permit.permit_type === "Amendment";
      case "special":
        return permit.permit_type === "Special";
      case "liquor":
        return permit.permit_type === "Liquor";
      case "all":
      default:
        return true;
    }
  });

  const totalPages = Math.ceil(filteredBusiness.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedBusiness = filteredBusiness.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Stats calculations - removed unassigned
  const stats = {
    total: business.length,
    approved: business.filter((p) => (p.status || "").toLowerCase() === "approved").length,
    rejected: business.filter((p) => (p.status || "").toLowerCase() === "rejected").length,
    forCompliance: business.filter((p) => (p.status || "").toLowerCase() === "for compliance").length,
  };

  // Count by permit type for tabs
  const countByType = {
    all: business.length,
    new: business.filter(p => p.permit_type === "New").length,
    renewal: business.filter(p => p.permit_type === "Renewal").length,
    amendment: business.filter(p => p.permit_type === "Amendment").length,
    special: business.filter(p => p.permit_type === "Special").length,
    liquor: business.filter(p => p.permit_type === "Liquor").length
  };

  // Count by permit type for charts
  const permitTypes = Array.from(new Set(business.map(p => p.permit_type || "Unknown")));
  const permitTypeCounts = permitTypes.map(type => 
    business.filter(p => p.permit_type === type).length
  );

  // Get status color
  const getStatusColor = (status) => {
    const statusLower = (status || "").toLowerCase();
    switch (statusLower) {
      case "approved":
        return "bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-100 border border-green-300 dark:border-green-600";
      case "rejected":
        return "bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-100 border border-red-300 dark:border-red-600";
      case "for compliance":
        return "bg-yellow-100 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-100 border border-yellow-300 dark:border-yellow-600";
      case "pending":
        return "bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-100 border border-blue-300 dark:border-blue-600";
      default:
        return "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 border border-gray-300 dark:border-gray-600";
    }
  };

  // Get assigned color
  const getAssignedColor = (assigned) => {
    const assignedLower = (assigned || "").toLowerCase();
    return assignedLower === "unassigned" 
      ? "bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-100 border border-red-300 dark:border-red-600"
      : "bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-100 border border-green-300 dark:border-green-600";
  };

  const getTabBadgeColor = (tab) =>
    tab === activeTab ? "bg-[#4CAF50] text-white" : "bg-gray-100 text-gray-600";

  const getTabBorderColor = (tab) => {
    return tab === activeTab ? "border-[#4CAF50]" : "border-transparent";
  };

  const getTabTextColor = (tab) => {
    return tab === activeTab ? "text-[#4CAF50] dark:text-[#4CAF50]" : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300";
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // ---------- View Business Permit ----------
  const handleView = async (id) => {
    try {
      // For demo, use mock data
      const businessPermit = business.find(b => b.id === id);
      if (businessPermit) {
        setSelectedBusiness(businessPermit);
        setIsModalOpen(true);
      } else {
        Swal.fire("Error", "Business permit not found", "error");
      }
    } catch (err) {
      console.error("Error fetching business details:", err);
      Swal.fire("Error", "Failed to load business details", "error");
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedBusiness(null);
  };

  // ---------- CRUDE Action ----------
  const handleCrudeAction = (action) => {
    if (action === "For Compliance") {
      Swal.fire({
        title: `Action: ${action}`,
        input: "textarea",
        inputLabel: "Notes",
        inputPlaceholder: "Type your remarks here...",
        inputAttributes: { "aria-label": "Type your remarks here" },
        showCancelButton: true,
        confirmButtonText: "Submit",
        cancelButtonText: "Cancel",
      }).then(async (result) => {
        if (result.isConfirmed) {
          const notes = result.value || "";
          await updateStatus(action, notes);
        }
      });
    } else {
      Swal.fire({
        title: `Are you sure you want to ${action}?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "Cancel",
      }).then(async (result) => {
        if (result.isConfirmed) {
          await updateStatus(action, "");
        }
      });
    }
  };

  const updateStatus = async (action, notes) => {
    try {
      // For demo, update local state
      const updatedBusiness = business.map(b => 
        b.id === selectedBusiness.id 
          ? { ...b, status: action, notes: notes || b.notes }
          : b
      );
      
      setBusiness(updatedBusiness);
      setSelectedBusiness(prev => ({ ...prev, status: action, notes: notes || prev.notes }));
      
      Swal.fire("Updated!", `Business permit has been ${action.toLowerCase()}.`, "success");
    } catch (err) {
      Swal.fire("Error", "Something went wrong.", "error");
    }
  };

  return (
    <div className="min-h-screen p-8 bg-white dark:bg-slate-900 text-black dark:text-white transition-colors duration-300 font-sans">
      {/* Header Card */}
      <div className="relative shadow-lg rounded-2xl border border-gray-200 dark:border-gray-700 flex flex-col md:flex-row items-center justify-between mb-8 overflow-hidden min-h-[250px] p-12 bg-white dark:bg-slate-800 transition-colors duration-300">
        <div className="absolute inset-0 bg-[url('/bgaddash.jpg')] bg-cover bg-center opacity-30"></div>
        <div className="relative">
          <h2 className="text-3xl font-extrabold text-[#4CAF50] tracking-wide font-[Montserrat]">
            Business Permit Management System
          </h2>
          <p className="mt-2 text-sm md:text-base max-w-2xl text-gray-600 dark:text-gray-300">
            Welcome Back <span className="font-semibold">Admin!,</span> Here's a comprehensive overview of business permit applications and statistics.
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-blue-100 dark:bg-blue-900 p-5 rounded-lg shadow transition-colors duration-300">
          <p className="text-blue-800 dark:text-blue-300 text-sm font-medium">Total Business Permits</p>
          <p className="text-blue-900 dark:text-blue-100 text-2xl font-bold">{stats.total}</p>
        </div>
        <div className="bg-green-100 dark:bg-green-900 p-5 rounded-lg shadow transition-colors duration-300">
          <p className="text-green-800 dark:text-green-300 text-sm font-medium">Approved</p>
          <p className="text-green-900 dark:text-green-100 text-2xl font-bold">{stats.approved}</p>
        </div>
        <div className="bg-red-100 dark:bg-red-900 p-5 rounded-lg shadow transition-colors duration-300">
          <p className="text-red-800 dark:text-red-300 text-sm font-medium">Rejected</p>
          <p className="text-red-900 dark:text-red-100 text-2xl font-bold">{stats.rejected}</p>
        </div>
        <div className="bg-yellow-100 dark:bg-yellow-900 p-5 rounded-lg shadow transition-colors duration-300">
          <p className="text-yellow-800 dark:text-yellow-300 text-sm font-medium">For Compliance</p>
          <p className="text-yellow-900 dark:text-yellow-100 text-2xl font-bold">{stats.forCompliance}</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="mb-6 bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 shadow-sm">
        <div className="border-b border-gray-200 dark:border-slate-700 overflow-x-auto">
          <nav className="flex space-x-6 px-6 min-w-max">
            {[
              { key: "all", label: "All Permits" },
              { key: "new", label: "New Application" },
              { key: "renewal", label: "Renewal Application" },
              { key: "amendment", label: "Amendment" },
              { key: "special", label: "Special Permit" },
              { key: "liquor", label: "Liquor Permit" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => {
                  setActiveTab(tab.key);
                  setCurrentPage(1); // Reset to first page when changing tabs
                }}
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
                {activeTab === "new" && "New Business Applications"}
                {activeTab === "renewal" && "Business Renewal Applications"}
                {activeTab === "amendment" && "Business Amendment Applications"}
                {activeTab === "special" && "Special Business Permits"}
                {activeTab === "liquor" && "Liquor License Applications"}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                {filteredBusiness.length} {filteredBusiness.length === 1 ? 'record' : 'records'} found
              </p>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* Bar Chart */}
            <div className="rounded-xl shadow p-6 flex-1 col-span-2 bg-white dark:bg-slate-800 transition-colors duration-300 min-h-[420px]">
              <div className="flex justify-between items-center mb-4">
                <span className="font-semibold text-black dark:text-white text-lg">
                  {activeTab === "all" && "Business Permits by Type"}
                  {activeTab === "new" && "New Applications by Business Type"}
                  {activeTab === "renewal" && "Renewal Applications by Business Type"}
                  {activeTab === "amendment" && "Amendment Applications by Business Type"}
                  {activeTab === "special" && "Special Permits by Business Type"}
                  {activeTab === "liquor" && "Liquor Licenses by Business Type"}
                </span>
                <button className="text-gray-400 dark:text-gray-300 hover:text-orange-500 text-xl">⋮</button>
              </div>
              <div className="h-[300px]">
                <Bar
                  data={{
                    labels: Array.from(new Set(filteredBusiness.map(b => b.business_type))).slice(0, 6),
                    datasets: [
                      {
                        label: "Applications",
                        data: Array.from(new Set(filteredBusiness.map(b => b.business_type))).slice(0, 6).map(type => 
                          filteredBusiness.filter(b => b.business_type === type).length
                        ),
                        backgroundColor: ["#FFF7A3", "#B5F5B5", "#FFB5B5", "#B5D8FF", "#D9B5FF", "#FFB5E8"],
                        borderRadius: 8,
                        borderWidth: 1,
                        borderColor: "#ccc",
                      },
                    ],
                  }}
                  options={{
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { labels: { color: isDark ? "#fff" : "#000", font: { weight: "bold" } } },
                    },
                    scales: {
                      x: { ticks: { color: isDark ? "#fff" : "#000" }, grid: { color: "rgba(0,0,0,0.05)" } },
                      y: { ticks: { color: isDark ? "#fff" : "#000" }, grid: { color: "rgba(0,0,0,0.05)" }, beginAtZero: true },
                    },
                  }}
                />
              </div>
            </div>

            {/* Pie Chart */}
            <div className="rounded-xl shadow p-6 flex flex-col items-center justify-center bg-white dark:bg-slate-800 transition-colors duration-300 min-h-[420px]">
              <span className="font-semibold mb-6 text-black dark:text-white text-lg">
                {activeTab === "all" && "Applications Status"}
                {activeTab === "new" && "New Applications Status"}
                {activeTab === "renewal" && "Renewal Applications Status"}
                {activeTab === "amendment" && "Amendment Applications Status"}
                {activeTab === "special" && "Special Permits Status"}
                {activeTab === "liquor" && "Liquor Licenses Status"}
              </span>
              <div className="h-[260px] w-[260px]">
                <Pie
                  data={{
                    labels: ["Approved", "For Compliance", "Rejected"],
                    datasets: [
                      {
                        data: [
                          filteredBusiness.filter((b) => b.status === "Approved").length,
                          filteredBusiness.filter((b) => b.status === "For Compliance").length,
                          filteredBusiness.filter((b) => b.status === "Rejected").length,
                        ],
                        backgroundColor: ["#B5F5B5", "#FFF7A3", "#FFB5B5"],
                        borderColor: isDark ? "#1e293b" : "#fff",
                        borderWidth: 2,
                      },
                    ],
                  }}
                  options={{
                    plugins: {
                      legend: {
                        position: "bottom",
                        labels: { color: isDark ? "#fff" : "#000", font: { weight: "500" } },
                      },
                    },
                    maintainAspectRatio: false,
                  }}
                />
              </div>
              <span className="text-sm mt-6 text-gray-700 dark:text-gray-300">
                {filteredBusiness.filter(b => b.status === "Approved").length} approved / {filteredBusiness.length} total applications
              </span>
            </div>
          </div>

          {/* Table */}
          <div className="rounded-xl shadow p-6 bg-white dark:bg-slate-800 transition-colors duration-300">
            <div className="flex justify-between items-center mb-4">
              <span className="font-semibold text-lg text-black dark:text-white">
                {activeTab === "all" && "All Business Permit Applications"}
                {activeTab === "new" && "New Business Applications"}
                {activeTab === "renewal" && "Business Renewal Applications"}
                {activeTab === "amendment" && "Business Amendment Applications"}
                {activeTab === "special" && "Special Business Permits"}
                {activeTab === "liquor" && "Liquor License Applications"}
              </span>
              <button className="text-gray-400 dark:text-gray-300 hover:text-orange-500 text-xl">⋮</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full shadow rounded-lg transition-colors duration-300">
                <thead className="bg-gray-50 dark:bg-slate-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Business Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Owner
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Permit No.
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Submitted
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Assigned
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {paginatedBusiness.length > 0 ? (
                    paginatedBusiness.map((p, index) => (
                      <tr
                        key={index}
                        className="hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors duration-200"
                      >
                        <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                          {p.business_name || "N/A"}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                          {p.owner_name || "N/A"}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300 max-w-xs truncate">
                          {p.location || "N/A"}
                        </td>
                        <td className="px-6 py-4 text-sm font-mono text-gray-600 dark:text-gray-300">
                          {p.permit_no || "N/A"}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                          {p.permit_type || "N/A"}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                          {formatDate(p.date_applied)}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span
                            className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(
                              p.status
                            )}`}
                          >
                            {p.status || "Unknown"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span
                            className={`px-3 py-1 text-xs font-medium rounded-full ${getAssignedColor(
                              p.assigned_to
                            )}`}
                          >
                            {p.assigned_to || "Unassigned"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <button
                            onClick={() => handleView(p.id)}
                            className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="9" className="text-center py-4 text-gray-500 dark:text-gray-400">
                        No {activeTab} business permits found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-4">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 dark:bg-slate-700 dark:hover:bg-slate-600 disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Page {currentPage} of {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 dark:bg-slate-700 dark:hover:bg-slate-600 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ---------------- Modal ---------------- */}
      {isModalOpen && selectedBusiness && (
        <div className="fixed inset-0 z-50 flex items-center justify-center animate-fadeIn font-[Montserrat]">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={closeModal}
          />

          {/* Modal Container */}
          <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-11/12 md:w-full max-w-4xl max-h-[85vh] overflow-y-auto z-10 border border-gray-200 dark:border-slate-700">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-slate-700 sticky top-0 bg-white dark:bg-slate-900 z-10">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                Business Permit Details - {selectedBusiness.business_name}
              </h2>
              <button
                aria-label="Close"
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-200 transition"
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Business Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 border-b pb-2">
                    Business Information
                  </h3>
                  {[
                    { key: "business_name", label: "Business Name" },
                    { key: "owner_name", label: "Owner Name" },
                    { key: "business_type", label: "Business Type" },
                    { key: "business_address", label: "Business Address" },
                    { key: "contact_number", label: "Contact Number" },
                    { key: "email_address", label: "Email Address" },
                    { key: "floor_area", label: "Floor Area" },
                    { key: "employees_count", label: "Number of Employees" },
                    { key: "annual_income", label: "Annual Income" }
                  ].map(({ key, label }) => (
                    <div key={key} className="p-3 rounded-lg bg-gray-50 dark:bg-slate-800/70 border border-gray-100 dark:border-slate-700">
                      <div className="text-xs uppercase text-gray-500 dark:text-gray-400 tracking-wide mb-1">
                        {label}
                      </div>
                      <div className="font-medium text-gray-800 dark:text-gray-100 break-words">
                        {selectedBusiness[key] || "-"}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Permit Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 border-b pb-2">
                    Permit Information
                  </h3>
                  {[
                    { key: "permit_no", label: "Permit Number" },
                    { key: "permit_type", label: "Permit Type" },
                    { key: "status", label: "Status" },
                    { key: "assigned_to", label: "Assigned To" },
                    { key: "date_applied", label: "Date Applied" },
                    { key: "tin_number", label: "TIN Number" },
                    { key: "dti_number", label: "DTI Number" },
                    { key: "mayor_permit_number", label: "Mayor's Permit" },
                    { key: "notes", label: "Notes" }
                  ].map(({ key, label }) => (
                    <div key={key} className="p-3 rounded-lg bg-gray-50 dark:bg-slate-800/70 border border-gray-100 dark:border-slate-700">
                      <div className="text-xs uppercase text-gray-500 dark:text-gray-400 tracking-wide mb-1">
                        {label}
                      </div>
                      <div className="font-medium text-gray-800 dark:text-gray-100 break-words">
                        {key === 'status' ? (
                          <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(selectedBusiness[key])}`}>
                            {selectedBusiness[key] || "-"}
                          </span>
                        ) : key === 'assigned_to' ? (
                          <span className={`px-2 py-1 text-xs rounded-full ${getAssignedColor(selectedBusiness[key])}`}>
                            {selectedBusiness[key] || "-"}
                          </span>
                        ) : key === 'date_applied' ? (
                          formatDate(selectedBusiness[key])
                        ) : (
                          selectedBusiness[key] || "-"
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Additional Documents */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 border-b pb-2">
                  Additional Documents & Clearances
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { key: "sanitary_permit", label: "Sanitary Permit" },
                    { key: "fire_safety_permit", label: "Fire Safety Permit" },
                    { key: "barangay_clearance", label: "Barangay Clearance" },
                    { key: "zoning_clearance", label: "Zoning Clearance" }
                  ].map(({ key, label }) => (
                    <div key={key} className="p-3 rounded-lg bg-gray-50 dark:bg-slate-800/70 border border-gray-100 dark:border-slate-700">
                      <div className="text-xs uppercase text-gray-500 dark:text-gray-400 tracking-wide mb-1">
                        {label}
                      </div>
                      <div className="font-medium text-gray-800 dark:text-gray-100 break-words">
                        {selectedBusiness[key] || "Not Provided"}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="px-6 py-4 border-t border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 sticky bottom-0 z-10 flex justify-end flex-wrap gap-3">
              
             
              <button
                onClick={closeModal}
                className="px-4 py-2 rounded-lg font-semibold text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 bg-[#FBFBFB] hover:bg-gray-100 dark:hover:bg-slate-800 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}