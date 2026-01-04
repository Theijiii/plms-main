import { LayoutDashboard, Briefcase, Building2, Bus, Home } from 'lucide-react'

const AdminSidebarItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    path: "/admin/dashboard",
    department: ["super", "business", "building", "transport", "barangay"] // All admins can see dashboard
  },
  {
    id: "businessPermit",
    label: "Business Permit",
    icon: Briefcase,
    path: "/admin/businessdashboard",
    department: ["business", "super"],
    subItems: [
      {
        id: "businessDashboardSub",
        label: "Dashboard",
        path: "/admin/businessdashboard",
        department: ["business", "super"]
      },
      {
        id: "businessPermitSub",
        label: "Permit Application",
        path: "/admin/businesspermit",
        department: ["business", "super"]
      },
      {
        id: "businessProcessingSub",
        label: "Processing",
        path: "/admin/businessprocessing",
        department: ["business", "super"]
      }
    ]
  },
  {
    id: "buildingPermit",
    label: "Building Permit",
    icon: Building2,
    path: "/admin/buildingdashboard",
    department: ["building", "super"],
    subItems: [
      {
        id: "buildingDashboardSub",
        label: "Building Dashboard",
        path: "/admin/buildingdashboard",
        department: ["building", "super"]
      },
      {
        id: "buildingApplicationsSub",
        label: "Permit Applications",
        path: "/admin/buildingpermit",
        department: ["building", "super"]
      },
      {
        id: "buildingProcessingSub",
        label: "Processing",
        path: "/admin/buildingprocessing",
        department: ["building", "super"]
      }
    ]
  },
  {
    id: "franchisePermit",
    label: "Franchise Permit",
    icon: Bus,
    path: "/admin/franchisedashboard",
    department: ["transport", "super"], // CHANGED: "franchise" → "transport"
    subItems: [
      {
        id: "franchiseDashboardSub",
        label: "Dashboard",
        path: "/admin/franchisedashboard",
        department: ["transport", "super"] // CHANGED: "franchise" → "transport"
      },
      {
        id: "franchiseApplicationsSub",
        label: "Permit Application",
        path: "/admin/franchisepermit",
        department: ["transport", "super"] // CHANGED: "franchise" → "transport"
      }
    ]
  },
  {
    id: "barangayPermit",
    label: "Barangay Permit",
    icon: Home,
    path: "/admin/barangaypermit",
    department: ["barangay", "super"],
    subItems: [
      {
        id: "barangayDashboardSub",
        label: "Dashboard",
        path: "/admin/barangaypermit",
        department: ["barangay", "super"]
      },
      {
        id: "requestClearanceSub",
        label: "Clearance Requests",
        path: "/admin/requestclearance",
        department: ["barangay", "super"]
      }
    ]
  }
];

export default AdminSidebarItems;