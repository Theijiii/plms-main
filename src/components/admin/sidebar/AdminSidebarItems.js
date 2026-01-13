import {
  BarChart3,   // graph icon for dashboards
  Briefcase,
  Building2,
  Bus,
  Home,
  FileText     // papers icon for requests
} from "lucide-react";

const AdminSidebarItems = [
  // MAIN DASHBOARD
  {
    id: "dashboard",
    label: "Dashboard",
    icon: BarChart3,
    path: "/admin/dashboard",
    department: ["super"],
  },

  // BUSINESS PERMIT
  {
    id: "businessDashboard",
    label: "Permit Dashboard",
    icon: BarChart3,
    path: "/admin/businessdashboard",
    department: ["business", "super"],
  },
  {
    id: "businessPermit",
    label: "Business Permit Application",
    icon: Briefcase,
    path: "/admin/businesspermit",
    department: ["business", "super"],
  },
  {
    id: "businessProcessing",
    label: "Business Processing",
    icon: Briefcase,
    path: "/admin/businessprocessing",
    department: ["business", "super"],
  },

  // BUILDING PERMIT
  {
    id: "buildingDashboard",
    label: "Permit Dashboard",
    icon: BarChart3,
    path: "/admin/buildingdashboard",
    department: ["building", "super"],
  },
  {
    id: "buildingPermit",
    label: "Building Permit Applications",
    icon: Building2,
    path: "/admin/buildingpermit",
    department: ["building", "super"],
  },
  {
    id: "buildingProcessing",
    label: "Building Processing",
    icon: Building2,
    path: "/admin/buildingprocessing",
    department: ["building", "super"],
  },

  // FRANCHISE / TRANSPORT
  {
    id: "franchiseDashboard",
    label: "Permit Dashboard",
    icon: BarChart3,
    path: "/admin/franchisedashboard",
    department: ["transport", "super"],
  },
  {
    id: "franchisePermit",
    label: "Franchise Permit Application",
    icon: Bus,
    path: "/admin/franchisepermit",
    department: ["transport", "super"],
  },

  // BARANGAY
  {
    id: "barangayPermit",
    label: "Permit Applications",
    icon: Home,
    path: "/admin/barangaypermit",
    department: ["barangay", "super"],
  },
  {
    id: "clearanceRequests",
    label: "Clearance Requests",
    icon: FileText,
    path: "/admin/requestclearance",
    department: ["barangay", "super"],
  },
];

export default AdminSidebarItems;
