import { LayoutDashboard, Settings, Briefcase, Building2, Bus, Home, Search } from 'lucide-react'

const AdminSidebarItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    path: "/admin/dashboard",
  },
  {
    id: "businessPermit",
    label: "Business Permit",
    icon: Briefcase,
    path: "/admin/businessdashboard" ,
    subItems: [
    {
        id: "businessDashboard",
        label: "Dashboard",
        path: "/admin/businessdashboard" 
      },
      {
        id: "businessPermit",
        label: "Permit Application",
        path: "/admin/businesspermit" // updated to match route
      }]
    
  },
  {
    id: "BuildingPermit",
    label: "Building Permit",
    icon: Building2,
    path: "/admin/buildingdashboard",
    subItems: [
      {
        id: "buildingDashboard",
        label: "Building Dashboard",
        path: "/admin/buildingdashboard"
      },
      {
        id: "buildingApplications",
        label: "Permit Applications",
        path: "/admin/buildingpermit"
      }]
  },
  {
    id: "FranchisePermit",
    label: "Franchise Permit",
    icon: Bus,
    path: "/admin/franchisepermit",
    path: "/admin/franchisedashboard",
    subItems: [
      {
        id: "franchiseDashboard",
        label: "Dashboard",
        path: "/admin/franchisedashboard"
      },
        {
        id: "franchiseApplications",
        label: "Permit Application",
        path: "/admin/franchisepermit"
      }
    ]
  },
  {
    id: "BarangayPermit",
    label: "Barangay Permit",
    icon: Home,
    path: "/admin/barangaypermit",
    subItems: [
      {
        id: "barangayDashboard",
        label: "Dashboard",
        path: "/admin/barangaypermit"
  },
        {
        id: "franchiseDashboard",
        label: "Permit Application",
        path: "/admin/requestclearance"
  }]
  },

]

export default AdminSidebarItems
