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

export default function BuildingDashboard() {
  const [building, setBuilding] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [activeTab, setActiveTab] = useState("all"); // all | commercial | residential
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    fetchBuildingData();
    
    // Detect dark mode globally
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, { attributes: true });
    setIsDark(document.documentElement.classList.contains("dark"));
    return () => observer.disconnect();
  }, []);

  // ---------- Fetch all building permits ----------
  const fetchBuildingData = async () => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock building permit data with additional fields for modal
      const mockBuildingData = [
        { 
          id: "BLD-001", 
          name: "Commercial Building A", 
          location: "Barangay 121", 
          building_type: "Commercial",
          owner_name: "John Smith",
          contact_number: "09171234567",
          email_address: "john.smith@example.com",
          address: "123 Main Street, Barangay 142",
          floor_area: "2,500 sqm",
          number_of_floors: "15",
          construction_type: "Concrete",
          estimated_cost: "₱50,000,000",
          permit: { 
            permitNo: "BP-2024-001", 
            issued: "2024-01-15", 
            expiry: "2025-01-14", 
            status: "Active" 
          } 
        },
        { 
          id: "BLD-002", 
          name: "Residential Complex B", 
          location: "Barangay 647", 
          building_type: "Residential",
          owner_name: "Maria Santos",
          contact_number: "09181234567",
          email_address: "maria.santos@example.com",
          address: "456 Oak Avenue, Barangay 88",
          floor_area: "1,200 sqm",
          number_of_floors: "8",
          construction_type: "Concrete",
          estimated_cost: "₱25,000,000",
          permit: { 
            permitNo: "BP-2024-002", 
            issued: "2024-02-20", 
            expiry: "2024-08-19", 
            status: "Expired" 
          } 
        },
        { 
          id: "BLD-003", 
          name: "Office Tower C", 
          location: "Barangay 111", 
          building_type: "Commercial",
          owner_name: "ABC Corporation",
          contact_number: "09201234567",
          email_address: "info@abccorp.com",
          address: "789 Business District, Barangay Sakanto",
          floor_area: "5,000 sqm",
          number_of_floors: "25",
          construction_type: "Steel & Concrete",
          estimated_cost: "₱120,000,000",
          permit: { 
            permitNo: "BP-2024-003", 
            issued: "2024-03-10", 
            expiry: "2025-03-09", 
            status: "Active" 
          } 
        },
        { 
          id: "BLD-004", 
          name: "Shopping Mall D", 
          location: "Barangay 034", 
          building_type: "Commercial",
          owner_name: "Retail Holdings Inc.",
          contact_number: "09301234567",
          email_address: "admin@retailholdings.com",
          address: "321 Commerce Street, Manila",
          floor_area: "8,000 sqm",
          number_of_floors: "6",
          construction_type: "Concrete",
          estimated_cost: "₱200,000,000",
          permit: { 
            permitNo: "BP-2024-004", 
            issued: "2024-04-05", 
            expiry: "2025-04-04", 
            status: "Pending" 
          } 
        },
        { 
          id: "BLD-005", 
          name: "Apartment Building E", 
          location: "Barangay Bagbag", 
          building_type: "Residential",
          owner_name: "Robert Garcia",
          contact_number: "09401234567",
          email_address: "robert.garcia@example.com",
          address: "654 Pine Street, Pasig City",
          floor_area: "800 sqm",
          number_of_floors: "5",
          construction_type: "Concrete",
          estimated_cost: "₱15,000,000",
          permit: { 
            permitNo: "BP-2024-005", 
            issued: "2024-01-30", 
            expiry: "2024-07-29", 
            status: "Expired" 
          } 
        },
        { 
          id: "BLD-006", 
          name: "Hospital Wing F", 
          location: "Barangay 142", 
          building_type: "Institutional",
          owner_name: "City Health Department",
          contact_number: "09501234567",
          email_address: "health@caloocancity.gov.ph",
          address: "987 Health Avenue, Barangay 142",
          floor_area: "3,500 sqm",
          number_of_floors: "10",
          construction_type: "Concrete",
          estimated_cost: "₱85,000,000",
          permit: { 
            permitNo: "BP-2024-006", 
            issued: "2024-05-15", 
            expiry: "2025-05-14", 
            status: "Active" 
          } 
        },
        { 
          id: "BLD-007", 
          name: "School Building G", 
          location: "Barangay 88", 
          building_type: "Institutional",
          owner_name: "Barangay 88 LGU",
          contact_number: "09601234567",
          email_address: "education@qc.gov.ph",
          address: "753 Education Road, Barangay 88",
          floor_area: "2,000 sqm",
          number_of_floors: "4",
          construction_type: "Concrete",
          estimated_cost: "₱35,000,000",
          permit: { 
            permitNo: "BP-2024-007", 
            issued: "2024-06-01", 
            expiry: "2025-05-31", 
            status: "Active" 
          } 
        },
        { 
          id: "BLD-008", 
          name: "Factory Building H", 
          location: "Barangay Culiat", 
          building_type: "Industrial",
          owner_name: "Manufacturing Corp",
          contact_number: "09701234567",
          email_address: "operations@manufacturingcorp.com",
          address: "159 Industrial Zone, Barangay Culiat",
          floor_area: "4,500 sqm",
          number_of_floors: "3",
          construction_type: "Steel",
          estimated_cost: "₱65,000,000",
          permit: { 
            permitNo: "BP-2024-008", 
            issued: "2024-02-28", 
            expiry: "2024-08-27", 
            status: "Expired" 
          } 
        },
        { 
          id: "BLD-009", 
          name: "Hotel Tower I", 
          location: "Barangay Sakanto", 
          building_type: "Commercial",
          owner_name: "Hospitality Group",
          contact_number: "09801234567",
          email_address: "reservations@hospitalitygroup.com",
          address: "246 Luxury Avenue, Barangay Sakanto",
          floor_area: "6,000 sqm",
          number_of_floors: "20",
          construction_type: "Concrete",
          estimated_cost: "₱150,000,000",
          permit: { 
            permitNo: "BP-2024-009", 
            issued: "2024-07-10", 
            expiry: "2025-07-09", 
            status: "Pending" 
          } 
        },
        { 
          id: "BLD-010", 
          name: "Warehouse Complex J", 
          location: "Barangay 142", 
          building_type: "Industrial",
          owner_name: "Logistics Solutions Inc.",
          contact_number: "09901234567",
          email_address: "info@logisticssolutions.com",
          address: "864 Storage Road, Barangay 142",
          floor_area: "7,500 sqm",
          number_of_floors: "2",
          construction_type: "Steel",
          estimated_cost: "₱45,000,000",
          permit: { 
            permitNo: "BP-2024-010", 
            issued: "2024-03-25", 
            expiry: "2025-03-24", 
            status: "Active" 
          } 
        }
      ];

      setBuilding(mockBuildingData);
    } catch (err) {
      console.error("Building Permit Service error:", err);
      Swal.fire("Error", "Failed to load building permits.", "error");
    }
  };

  // Filter building permits based on active tab
  const filteredBuilding = building.filter((building) => {
    switch (activeTab) {
      case "commercial":
        return building.building_type === "Commercial";
      case "residential":
        return building.building_type === "Residential";
      case "industrial":
        return building.building_type === "Industrial";
      case "institutional":
        return building.building_type === "Institutional";
      case "all":
      default:
        return true;
    }
  });

  const totalPages = Math.ceil(filteredBuilding.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedBuilding = filteredBuilding.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Stats for all building permits
  const total = building.length;
  const active = building.filter((p) => p.permit.status === "Active").length;
  const expired = building.filter((p) => p.permit.status === "Expired").length;
  const pending = building.filter((p) => p.permit.status === "Pending").length;

  // Count by type for tabs
  const countByType = {
    all: building.length,
    commercial: building.filter(b => b.building_type === "Commercial").length,
    residential: building.filter(b => b.building_type === "Residential").length,
    industrial: building.filter(b => b.building_type === "Industrial").length,
    institutional: building.filter(b => b.building_type === "Institutional").length
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-100 dark:bg-green-700 text-green-700 dark:text-green-100";
      case "Expired":
        return "bg-red-100 dark:bg-red-700 text-red-700 dark:text-red-100";
      case "Pending":
        return "bg-yellow-100 dark:bg-yellow-700 text-yellow-700 dark:text-yellow-100";
      case "For Compliance":
        return "bg-blue-100 dark:bg-blue-700 text-blue-700 dark:text-blue-100";
      default:
        return "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-100";
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "Commercial":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      case "Residential":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300";
      case "Industrial":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "Institutional":
        return "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
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

  // ---------- View Building Permit ----------
  const handleView = async (id) => {
    try {
      // Mock API call for building details
      const building = filteredBuilding.find(b => b.id === id);
      if (building) {
        setSelectedBuilding(building);
        setIsModalOpen(true);
      } else {
        Swal.fire("Error", "Building permit not found.", "error");
      }
    } catch (err) {
      console.error("Error fetching building details:", err);
      Swal.fire("Error", "Failed to load building details.", "error");
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedBuilding(null);
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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update local state
      setBuilding(prev => prev.map(b => 
        b.id === selectedBuilding.id 
          ? { 
              ...b, 
              permit: { ...b.permit, status: action },
              notes: notes
            } 
          : b
      ));
      
      setSelectedBuilding(prev => ({ 
        ...prev, 
        permit: { ...prev.permit, status: action },
        notes: notes 
      }));

      Swal.fire("Updated!", `Building permit has been ${action.toLowerCase()}.`, "success");
    } catch (err) {
      Swal.fire("Error", "Something went wrong.", "error");
    }
  };

  // Chart data preparation
  const locations = Array.from(new Set(filteredBuilding.map(p => p.location))).slice(0, 6);
  const locationCounts = locations.map(location => 
    filteredBuilding.filter(p => p.location === location).length
  );

  return (
    <div className="min-h-screen p-8 bg-white dark:bg-slate-900 text-black dark:text-white transition-colors duration-300 font-sans">
      {/* Header Card */}
      <div className="relative shadow-lg rounded-2xl border border-gray-200 dark:border-gray-700 flex flex-col md:flex-row items-center justify-between mb-8 overflow-hidden min-h-[250px] p-12 bg-white dark:bg-slate-800 transition-colors duration-300">
        <div className="absolute inset-0 bg-[url('/bgaddash.jpg')] bg-cover bg-center opacity-30"></div>
        <div className="relative">
          <h2 className="text-3xl font-extrabold text-[#4CAF50] tracking-wide font-[Montserrat]">
            Building Permit Management System
          </h2>
          <p className="mt-2 text-sm md:text-base max-w-2xl text-gray-600 dark:text-gray-300">
            Welcome Back <span className="font-semibold">Admin!,</span> Here's a comprehensive overview of building permit applications and statistics.
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-blue-100 dark:bg-blue-900 p-5 rounded-lg shadow transition-colors duration-300">
          <p className="text-blue-800 dark:text-blue-300 text-sm font-medium">Total Building Permits</p>
          <p className="text-blue-900 dark:text-blue-100 text-2xl font-bold">{total}</p>
        </div>
        <div className="bg-green-100 dark:bg-green-900 p-5 rounded-lg shadow transition-colors duration-300">
          <p className="text-green-800 dark:text-green-300 text-sm font-medium">Active</p>
          <p className="text-green-900 dark:text-green-100 text-2xl font-bold">{active}</p>
        </div>
        <div className="bg-red-100 dark:bg-red-900 p-5 rounded-lg shadow transition-colors duration-300">
          <p className="text-red-800 dark:text-red-300 text-sm font-medium">Expired</p>
          <p className="text-red-900 dark:text-red-100 text-2xl font-bold">{expired}</p>
        </div>
        <div className="bg-yellow-100 dark:bg-yellow-900 p-5 rounded-lg shadow transition-colors duration-300">
          <p className="text-yellow-800 dark:text-yellow-300 text-sm font-medium">Pending</p>
          <p className="text-yellow-900 dark:text-yellow-100 text-2xl font-bold">{pending}</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="mb-6 bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 shadow-sm">
        <div className="border-b border-gray-200 dark:border-slate-700 overflow-x-auto">
          <nav className="flex space-x-6 px-6 min-w-max">
            {[
              { key: "all", label: "All Buildings" },
              { key: "commercial", label: "Commercial" },
              { key: "residential", label: "Residential" },
              { key: "industrial", label: "Industrial" },
              { key: "institutional", label: "Institutional" },
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
                {activeTab === "all" && "All Building Permits"}
                {activeTab === "commercial" && "Commercial Building Permits"}
                {activeTab === "residential" && "Residential Building Permits"}
                {activeTab === "industrial" && "Industrial Building Permits"}
                {activeTab === "institutional" && "Institutional Building Permits"}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                {filteredBuilding.length} {filteredBuilding.length === 1 ? 'record' : 'records'} found
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
                  {activeTab === "all" && "Building Permits by Location"}
                  {activeTab !== "all" && `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Buildings by Location`}
                </span>
                <button className="text-gray-400 dark:text-gray-300 hover:text-orange-500 text-xl">⋮</button>
              </div>
              <div className="h-[300px]">
                <Bar
                  data={{
                    labels: locations,
                    datasets: [
                      {
                        label: "Number of Permits",
                        data: locationCounts,
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
                {activeTab === "all" && "Permit Status Distribution"}
                {activeTab !== "all" && `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Buildings Status`}
              </span>
              <div className="h-[260px] w-[260px]">
                <Pie
                  data={{
                    labels: ["Active", "Pending", "Expired"],
                    datasets: [
                      {
                        data: [
                          filteredBuilding.filter((p) => p.permit.status === "Active").length,
                          filteredBuilding.filter((p) => p.permit.status === "Pending").length,
                          filteredBuilding.filter((p) => p.permit.status === "Expired").length,
                        ],
                        backgroundColor: ["#B5F5B5", "#FFF7A3", "#FFB5B5"],
                        borderColor: "#fff",
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
                {filteredBuilding.filter(p => p.permit.status === "Active").length} active / {filteredBuilding.length} total permits
              </span>
            </div>
          </div>

          {/* Table */}
          <div className="rounded-xl shadow p-6 bg-white dark:bg-slate-800 transition-colors duration-300">
            <div className="flex justify-between items-center mb-4">
              <span className="font-semibold text-lg text-black dark:text-white">
                {activeTab === "all" && "All Building Permit Applications"}
                {activeTab !== "all" && `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Building Permit Applications`}
              </span>
              <button className="text-gray-400 dark:text-gray-300 hover:text-orange-500 text-xl">⋮</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full shadow rounded-lg transition-colors duration-300">
                <thead className="bg-gray-50 dark:bg-slate-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Building Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Location</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Owner</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Permit No.</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Expiry</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {paginatedBuilding.length > 0 ? (
                    paginatedBuilding.map((b) => (
                      <tr key={b.id} className="hover:bg-gray-50 dark:hover:bg-slate-700">
                        <td className="px-6 py-4 text-sm font-medium">{b.id}</td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{b.name}</td>
                        <td className="px-6 py-4 text-sm">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(b.building_type)}`}>
                            {b.building_type}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{b.location}</td>
                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{b.owner_name}</td>
                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{b.permit.permitNo}</td>
                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{b.permit.expiry}</td>
                        <td className="px-6 py-4 text-sm">
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(b.permit.status)}`}
                          >
                            {b.permit.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <button
                            onClick={() => handleView(b.id)}
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
                        No {activeTab} building permits found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {filteredBuilding.length > 0 && (
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
            )}
          </div>
        </div>
      </div>

      {/* ---------------- Modal ---------------- */}
      {isModalOpen && selectedBuilding && (
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
                Building Permit Details
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
                {Object.entries({
                  id: selectedBuilding.id,
                  name: selectedBuilding.name,
                  building_type: selectedBuilding.building_type,
                  location: selectedBuilding.location,
                  owner_name: selectedBuilding.owner_name,
                  contact_number: selectedBuilding.contact_number,
                  email_address: selectedBuilding.email_address,
                  address: selectedBuilding.address,
                  floor_area: selectedBuilding.floor_area,
                  number_of_floors: selectedBuilding.number_of_floors,
                  construction_type: selectedBuilding.construction_type,
                  estimated_cost: selectedBuilding.estimated_cost,
                  permit_no: selectedBuilding.permit.permitNo,
                  issued: selectedBuilding.permit.issued,
                  expiry: selectedBuilding.permit.expiry,
                  status: selectedBuilding.permit.status,
                  ...(selectedBuilding.notes && { notes: selectedBuilding.notes })
                }).map(([key, value]) => (
                  <div
                    key={key}
                    className="p-3 rounded-lg bg-gray-50 dark:bg-slate-800/70 border border-gray-100 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-800 transition"
                  >
                    <div className="text-xs uppercase text-gray-500 dark:text-gray-400 tracking-wide mb-1">
                      {key.replaceAll("_", " ")}
                    </div>
                    <div className="font-medium text-gray-800 dark:text-gray-100 break-words">
                      {value || "-"}
                    </div>
                  </div>
                ))}
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