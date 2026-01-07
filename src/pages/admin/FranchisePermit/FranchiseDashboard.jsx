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

export default function FranchiseDashboard() {
  const [franchises, setFranchises] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFranchise, setSelectedFranchise] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [activeTab, setActiveTab] = useState("all"); // all | new | renewal
  const ITEMS_PER_PAGE = 15;

  useEffect(() => {
    fetchFranchises();
    
    // Detect dark mode globally
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, { attributes: true });
    setIsDark(document.documentElement.classList.contains("dark"));
    return () => observer.disconnect();
  }, []);

  // ---------- Fetch all franchises ----------
  const fetchFranchises = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/franchises.php");
      const data = await res.json();
      // Transform the data to use FRN-001 format and add type
      const transformedData = data.map((franchise, index) => ({
        ...franchise,
        id: `FRN-${String(index + 1).padStart(3, '0')}`,
        // Add type field if not present (randomly assign for demo)
        type: franchise.type || (Math.random() > 0.5 ? "New" : "Renewal")
      }));
      setFranchises(transformedData);
    } catch (err) {
      console.error("Franchise Permit Service error:", err);
      // Fallback mock data with FRN-001 format and types
      const mockFranchises = [
        { id: "FRN-001", full_name: "Mark Regular", contact_number: "09171234567", make_brand: "Toyota", model: "Vios", route_zone: "Caloocan-Monumento", toda_name: "Caloocan TODA", barangay_of_operation: "Caloocan City", status: "Pending", type: "New" },
        { id: "FRN-002", full_name: "Juan Dela Cruz", contact_number: "09181234567", make_brand: "Honda", model: "City", route_zone: "Caloocan-Grace Park", toda_name: "Caloocan TODA 2", barangay_of_operation: "Caloocan City", status: "Pending", type: "Renewal" },
        { id: "FRN-003", full_name: "Maria Santos", contact_number: "09201234567", make_brand: "Mitsubishi", model: "Mirage", route_zone: "Caloocan-Sangandaan", toda_name: "Caloocan TODA 3", barangay_of_operation: "Caloocan City", status: "Approved", type: "New" },
        { id: "FRN-004", full_name: "Pedro Reyes", contact_number: "09301234567", make_brand: "Toyota", model: "Innova", route_zone: "Caloocan-5th Ave", toda_name: "Caloocan TODA 4", barangay_of_operation: "Caloocan City", status: "Pending", type: "Renewal" },
        { id: "FRN-005", full_name: "Ana Lopez", contact_number: "09401234567", make_brand: "Nissan", model: "Almera", route_zone: "Caloocan-Rizal Ave", toda_name: "Caloocan TODA 5", barangay_of_operation: "Caloocan City", status: "Rejected", type: "New" },
        { id: "FRN-006", full_name: "Luis Garcia", contact_number: "09501234567", make_brand: "Toyota", model: "Wigo", route_zone: "Caloocan-10th Ave", toda_name: "Caloocan TODA 6", barangay_of_operation: "Caloocan City", status: "Pending", type: "Renewal" },
        { id: "FRN-007", full_name: "Sofia Martinez", contact_number: "09601234567", make_brand: "Honda", model: "Brio", route_zone: "Caloocan-11th Ave", toda_name: "Caloocan TODA 7", barangay_of_operation: "Caloocan City", status: "Approved", type: "New" },
        { id: "FRN-008", full_name: "Carlos Lim", contact_number: "09701234567", make_brand: "Mitsubishi", model: "Xpander", route_zone: "Caloocan-12th Ave", toda_name: "Caloocan TODA 8", barangay_of_operation: "Caloocan City", status: "Pending", type: "Renewal" }
      ];
      setFranchises(mockFranchises);
    }
  };

  // Filter franchises based on active tab
  const filteredFranchises = franchises.filter((franchise) => {
    switch (activeTab) {
      case "new":
        return franchise.type === "New";
      case "renewal":
        return franchise.type === "Renewal";
      case "all":
      default:
        return true;
    }
  });

  const totalPages = Math.ceil(filteredFranchises.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedFranchises = filteredFranchises.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Stats for all franchises
  const total = franchises.length;
  const approved = franchises.filter((f) => f.status === "Approved").length;
  const pending = franchises.filter((f) => f.status === "Pending").length;
  const rejected = franchises.filter((f) => f.status === "Rejected").length;

  // Count by type for tabs
  const countByType = {
    all: franchises.length,
    new: franchises.filter(f => f.type === "New").length,
    renewal: franchises.filter(f => f.type === "Renewal").length
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 dark:bg-green-700 text-green-700 dark:text-green-100";
      case "Pending":
        return "bg-yellow-100 dark:bg-yellow-700 text-yellow-700 dark:text-yellow-100";
      case "Rejected":
        return "bg-red-100 dark:bg-red-700 text-red-700 dark:text-red-100";
      case "For Compliance":
        return "bg-blue-100 dark:bg-blue-700 text-blue-700 dark:text-blue-100";
      default:
        return "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-100";
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "New":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      case "Renewal":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300";
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

  // ---------- View Franchise ----------
  const handleView = async (id) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/view_franchise.php?id=${id}`);
      const data = await res.json();
      if (data.success) {
        setSelectedFranchise(data.data);
        setIsModalOpen(true);
      } else {
        Swal.fire("Error", data.message, "error");
      }
    } catch (err) {
      console.error("Error fetching franchise details:", err);
      // Mock data for demo
      const franchise = franchises.find(f => f.id === id);
      const mockFranchiseData = {
        id: id,
        full_name: franchise?.full_name || "Mark Regular",
        contact_number: franchise?.contact_number || "09171234567",
        email_address: "mark@example.com",
        make_brand: franchise?.make_brand || "Toyota",
        model: franchise?.model || "Vios",
        year_model: "2023",
        plate_number: "ABC123",
        route_zone: franchise?.route_zone || "Caloocan-Monumento",
        toda_name: franchise?.toda_name || "Caloocan TODA",
        barangay_of_operation: franchise?.barangay_of_operation || "Caloocan City",
        address: "123 Main Street, Caloocan City",
        status: franchise?.status || "Pending",
        type: franchise?.type || "New",
        date_applied: "2025-09-01",
        vehicle_color: "White",
        or_number: "OR-001234",
        cr_number: "CR-005678",
        driver_license: "D123-456-789-012",
        franchise_number: id
      };
      setSelectedFranchise(mockFranchiseData);
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedFranchise(null);
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
      const res = await fetch("http://127.0.0.1:8000/api/update_status.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedFranchise.id,
          action,
          Notes: notes,
        }),
      });
      const data = await res.json();
      if (data.success) {
        Swal.fire("Updated!", data.message, "success");
        await fetchFranchises();
        setSelectedFranchise((prev) => ({ ...prev, status: action, notes }));
      } else {
        Swal.fire("Oops!", data.message, "error");
      }
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
            Franchise Permit Management System
          </h2>
          <p className="mt-2 text-sm md:text-base max-w-2xl text-gray-600 dark:text-gray-300">
            Welcome Back <span className="font-semibold">Admin!,</span> Here's a comprehensive overview of franchise permit applications and statistics.
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-blue-100 dark:bg-blue-900 p-5 rounded-lg shadow transition-colors duration-300">
          <p className="text-blue-800 dark:text-blue-300 text-sm font-medium">Total Franchise Permits</p>
          <p className="text-blue-900 dark:text-blue-100 text-2xl font-bold">{total}</p>
        </div>
        <div className="bg-green-100 dark:bg-green-900 p-5 rounded-lg shadow transition-colors duration-300">
          <p className="text-green-800 dark:text-green-300 text-sm font-medium">Approved</p>
          <p className="text-green-900 dark:text-green-100 text-2xl font-bold">{approved}</p>
        </div>
        <div className="bg-red-100 dark:bg-red-900 p-5 rounded-lg shadow transition-colors duration-300">
          <p className="text-red-800 dark:text-red-300 text-sm font-medium">Rejected</p>
          <p className="text-red-900 dark:text-red-100 text-2xl font-bold">{rejected}</p>
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
              { key: "all", label: "All Franchises" },
              { key: "new", label: "New Application" },
              { key: "renewal", label: "Renewal Application" },
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
                {activeTab === "all" && "All Franchise Permits"}
                {activeTab === "new" && "New Franchise Applications"}
                {activeTab === "renewal" && "Franchise Renewal Applications"}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                {filteredFranchises.length} {filteredFranchises.length === 1 ? 'record' : 'records'} found
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
                  {activeTab === "all" && "Franchise Applications by TODA"}
                  {activeTab === "new" && "New Applications by TODA"}
                  {activeTab === "renewal" && "Renewal Applications by TODA"}
                </span>
                <button className="text-gray-400 dark:text-gray-300 hover:text-orange-500 text-xl">⋮</button>
              </div>
              <div className="h-[300px]">
                <Bar
                  data={{
                    labels: Array.from(new Set(filteredFranchises.map(f => f.toda_name))).slice(0, 6),
                    datasets: [
                      {
                        label: "Applications",
                        data: Array.from(new Set(filteredFranchises.map(f => f.toda_name))).slice(0, 6).map(toda => 
                          filteredFranchises.filter(f => f.toda_name === toda).length
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
              </span>
              <div className="h-[260px] w-[260px]">
                <Pie
                  data={{
                    labels: ["Approved", "Pending", "Rejected", "For Compliance"],
                    datasets: [
                      {
                        data: [
                          filteredFranchises.filter((f) => f.status === "Approved").length,
                          filteredFranchises.filter((f) => f.status === "Pending").length,
                          filteredFranchises.filter((f) => f.status === "Rejected").length,
                          filteredFranchises.filter((f) => f.status === "For Compliance").length,
                        ],
                        backgroundColor: ["#B5F5B5", "#FFF7A3", "#FFB5B5", "#B5D8FF"],
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
                {filteredFranchises.filter(f => f.status === "Approved").length} approved / {filteredFranchises.length} total applications
              </span>
            </div>
          </div>

          {/* Table */}
          <div className="rounded-xl shadow p-6 bg-white dark:bg-slate-800 transition-colors duration-300">
            <div className="flex justify-between items-center mb-4">
              <span className="font-semibold text-lg text-black dark:text-white">
                {activeTab === "all" && "All Franchise Permit Applications"}
                {activeTab === "new" && "New Franchise Applications"}
                {activeTab === "renewal" && "Franchise Renewal Applications"}
              </span>
              <button className="text-gray-400 dark:text-gray-300 hover:text-orange-500 text-xl">⋮</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full shadow rounded-lg transition-colors duration-300">
                <thead className="bg-gray-50 dark:bg-slate-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Contact</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Vehicle</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Route</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">TODA</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Barangay</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {paginatedFranchises.length > 0 ? (
                    paginatedFranchises.map((f) => (
                      <tr key={f.id} className="hover:bg-gray-50 dark:hover:bg-slate-700">
                        <td className="px-6 py-4 text-sm font-medium">{f.id}</td>
                        <td className="px-6 py-4 text-sm">{f.full_name}</td>
                        <td className="px-6 py-4 text-sm">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(f.type)}`}>
                            {f.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm">{f.contact_number}</td>
                        <td className="px-6 py-4 text-sm">{f.make_brand} {f.model}</td>
                        <td className="px-6 py-4 text-sm">{f.route_zone}</td>
                        <td className="px-6 py-4 text-sm">{f.toda_name}</td>
                        <td className="px-6 py-4 text-sm">{f.barangay_of_operation}</td>
                        <td className="px-6 py-4 text-sm">
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(f.status)}`}
                          >
                            {f.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <button
                            onClick={() => handleView(f.id)}
                            className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="10" className="text-center py-4 text-gray-500 dark:text-gray-400">
                        No {activeTab} franchise permits found.
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
      {isModalOpen && selectedFranchise && (
        <div className="fixed inset-0 z-50 flex items-center justify-center animate-fadeIn font-[Montserrat]">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={closeModal}
          />

          {/* Modal Container */}
          <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-11/12 md:w-full max-w-2xl max-h-[85vh] overflow-y-auto z-10 border border-gray-200 dark:border-slate-700">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-slate-700 sticky top-0 bg-white dark:bg-slate-900 z-10">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                Franchise Details
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
                {Object.entries(selectedFranchise).map(([key, value]) => (
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