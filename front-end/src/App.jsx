import { Routes, Route, Navigate } from "react-router-dom"
import { useState, useEffect } from "react"; // Add this line
import UserLayout from "./layouts/UserLayout"
import AdminLayout from "./layouts/AdminLayout"
import ProtectedRoute from "./components/ProtectedRoute";
import UserDashboard from "./pages/user/UserDashboard"
import Login from "./pages/user/Login"
import Register from "./pages/user/Register"

import BusPermitType from "./pages/user/BusinessPermit/BusPermitType"
import BusinessNew from "./pages/user/BusinessPermit/BusinessNew"
import BusinessRenewal from "./pages/user/BusinessPermit/BusinessRenewal"
import BusinessLiquor from "./pages/user/BusinessPermit/BusinessLiquor"
import BusinessSpecial from "./pages/user/BusinessPermit/BusinessSpecial"
import BusinessAmendment from "./pages/user/BusinessPermit/BusinessAmendment/BusinessAmend"
import BusinessChangeName from "./pages/user/BusinessPermit/BusinessAmendment/Business-cobn"
import BusinessChangeOwner from "./pages/user/BusinessPermit/BusinessAmendment/Business-coo"
import BusinessLine from "./pages/user/BusinessPermit/BusinessAmendment/Business-line"
import BusinessTransLoc from "./pages/user/BusinessPermit/BusinessAmendment/Business-tol"

import BuildingNew from "./pages/user/BuildingPermit/BuildingNew"
import BuildingPermitType from "./pages/user/BuildingPermit/BuildingPermitType"
import RenewalBuilding from "./pages/user/BuildingPermit/RenewalBuilding"
import AncillaryPermits from "./pages/user/BuildingPermit/Ancillary/Ancillary"
import ElectricalPermit from "./pages/user/BuildingPermit/ElectricalPermit"
import MechanicalPermit from "./pages/user/BuildingPermit/MechanicalPermit"
import PlumbingPermit from "./pages/user/BuildingPermit/PlumbingPermit"
import FencingPermit from "./pages/user/BuildingPermit/FencingPermit"
import DemolitionPermit from "./pages/user/BuildingPermit/DemolitionPermit"
import ExcavationPermit from "./pages/user/BuildingPermit/ExcavationPermit"
import OccupancyPermit from "./pages/user/BuildingPermit/OccupancyPermit"
import ElectronicsPermit from "./pages/user/BuildingPermit/ElectronicsPermit"
import SignagePermit from "./pages/user/BuildingPermit/SignagePermit"
import ProfessionalRegistration from "./pages/user/BuildingPermit/ProfessionalRegistration"
import FranchisePermitType from "./pages/user/FranchisePermit/FranchisePermitType"
import FranchiseNew from "./pages/user/FranchisePermit/FranchiseNew"


import BarangayNew from "./pages/user/BarangayPermit/BarangayNew"
import BarangayPermitType from "./pages/user/BarangayPermit/BarangayPermitType"
import UserTracker from "./pages/user/PermitTracker/UserTracker"
import UserGeneralSettings from "./pages/user/Settings/General"
import UserSecuritySettings from "./pages/user/Settings/Security"

// Admin imports
import AdminDashboard from "./pages/admin/AdminDashboard";

import BusinessPermit from "./pages/admin/BusinessPermit/Business";
import BusAppDash from "./pages/admin/BusinessPermit/businessdashboard";
import BusinessProcess from "./pages/admin/BusinessPermit/BusinessProcessing";

import Building from "./pages/admin/BuildingPermit/Building";
import BuildingDashboard from "./pages/admin/BuildingPermit/BuildingDashboard";
import BuildingProcess from "./pages/admin/BuildingPermit/BuildingProcess";

import Franchise from "./pages/admin/FranchisePermit/Franchise";
import FranchiseDashboard from "./pages/admin/FranchisePermit/FranchiseDashboard" 

import BarangayPermit from "./pages/admin/BarangayPermit/Barangay";
import RequestClearance from "./pages/admin/BarangayPermit/RequestClearance";

import Tracker from "./pages/admin/PermitTracker/Tracker";


import TestForm from "./components/TestForm";
import TestBarangayForm from "./components/TestBarangayForm";

function App() {
  return (
    <Routes>
      {/* Public routes (no authentication required) */}
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/register" element={<Register />} />
      <Route path="/testbarangayform" element={<TestBarangayForm />} />
      <Route path="/testform" element={<TestForm />} />

      {/* Protected User routes */}
      <Route 
        path="/user" 
        element={
          <ProtectedRoute requiredRole="user">
            <UserLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<UserDashboard />} />
        <Route path="dashboard" element={<UserDashboard />} />

        {/* Legacy/redirects */}
        <Route path="newbusiness" element={<Navigate to="/user/business/new" replace />} />
        <Route path="newfranchise" element={<Navigate to="/user/franchise/new" replace />} />
        <Route path="businesspermittype" element={<Navigate to="/user/business/type" replace />} />
        <Route path="franchisepermit" element={<Navigate to="/user/franchise/type" replace />} />

        {/* Business routes */}
        <Route path="business/new" element={<BusinessNew />} />
        <Route path="business/type" element={<BusPermitType />} />
        <Route path="business/renewal" element={<BusinessRenewal />} />
        <Route path="business/amendment" element={<BusinessAmendment />} />
        <Route path="business/liquor" element={<BusinessLiquor />} />
        <Route path="business/special" element={<BusinessSpecial />} />
        <Route path="business/line" element={<BusinessLine />} />
        <Route path="business/owner" element={<BusinessChangeOwner />} />
        <Route path="business/location" element={<BusinessTransLoc />} />
        <Route path="business/name" element={<BusinessChangeName />} />

        {/* Building routes */}
        <Route path="building/new" element={<BuildingNew />} />
        <Route path="building/type" element={<BuildingPermitType />} />
        <Route path="building/renewal" element={<RenewalBuilding />} />
        <Route path="building/ancillary" element={<AncillaryPermits />} />
        <Route path="building/electrical" element={<ElectricalPermit />} />
        <Route path="building/mechanical" element={<MechanicalPermit />} />
        <Route path="building/plumbing" element={<PlumbingPermit />} />
        <Route path="building/fencing" element={<FencingPermit />} />
        <Route path="building/demolition" element={<DemolitionPermit />} />
        <Route path="building/excavation" element={<ExcavationPermit />} />
        <Route path="building/occupancy" element={<OccupancyPermit />} />
        <Route path="building/electronics" element={<ElectronicsPermit />} />
        <Route path="building/signage" element={<SignagePermit />} />
        <Route path="building/professional" element={<ProfessionalRegistration />} />

        {/* Franchise routes */}
        <Route path="franchise/new" element={<FranchiseNew />} />
        <Route path="franchise/type" element={<FranchisePermitType />} />

        {/* Barangay routes */}
        <Route path="barangay/new" element={<BarangayNew />} />
        <Route path="barangay/type" element={<BarangayPermitType />} />

        {/* Other user routes */}
        <Route path="permittracker" element={<UserTracker />} />
        <Route path="general" element={<UserGeneralSettings />} />
        <Route path="security" element={<UserSecuritySettings />} />
      </Route>

      {/* Protected Admin routes */}
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="businesspermit" element={<BusinessPermit />} />
        <Route path="businessdashboard" element={<BusAppDash />} />
        <Route path="businessprocessing" element={<BusinessProcess />} />
        <Route path="buildingpermit" element={<Building />} />
        <Route path="buildingdashboard" element={<BuildingDashboard />} />
        <Route path="buildingprocessing" element={<BuildingProcess />} />
        <Route path="franchisepermit" element={<Franchise />} />
        <Route path="franchisedashboard" element={<FranchiseDashboard />} />
        <Route path="barangaypermit" element={<BarangayPermit />} />
        <Route path="barangay" element={<Navigate to="/admin/barangaypermit" replace />} />
        <Route path="requestclearance" element={<RequestClearance />} />
        <Route path="permittracker" element={<Tracker />} />
      </Route>
    </Routes>
  );
}

export default App;