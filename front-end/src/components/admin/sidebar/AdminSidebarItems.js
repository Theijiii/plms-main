import { LayoutDashboard, Briefcase, Building2, Bus, Home } from 'lucide-react'

const AdminSidebarItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    path: "/admin/dashboard",
    department: ["super"] // visible to all admins
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
      }
    ]
  },
  {
    id: "franchisePermit",
    label: "Franchise Permit",
    icon: Bus,
    path: "/admin/franchisedashboard",
    department: ["franchise", "super"],
    subItems: [
      {
        id: "franchiseDashboardSub",
        label: "Dashboard",
        path: "/admin/franchisedashboard",
        department: ["franchise", "super"]
      },
      {
        id: "franchiseApplicationsSub",
        label: "Permit Application",
        path: "/admin/franchisepermit",
        department: ["franchise", "super"]
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
        label: "Permit Application",
        path: "/admin/requestclearance",
        department: ["barangay", "super"]
      }
    ]
  }
];

export default AdminSidebarItems;
