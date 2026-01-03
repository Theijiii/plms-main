import { Navigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [redirectTo, setRedirectTo] = useState("/login");

  useEffect(() => {
    const checkAuth = () => {
      // Get auth data from localStorage
      const token = localStorage.getItem("auth_token");
      const userRole = localStorage.getItem("goserveph_role");
      
      console.log("🔐 [ProtectedRoute] Checking auth:", {
        path: location.pathname,
        hasToken: !!token,
        userRole,
        requiredRole
      });
      
      // If no token, redirect to login
      if (!token) {
        console.log("🔐 NO TOKEN - Redirecting to login");
        setRedirectTo("/login");
        setShouldRedirect(true);
        setIsChecking(false);
        return;
      }
      
      // If role is required and doesn't match, redirect based on actual role
      if (requiredRole && userRole !== requiredRole) {
        console.log(`🔐 ROLE MISMATCH: ${userRole} trying to access ${requiredRole}`);
        
        if (userRole === "admin") {
          setRedirectTo("/admin/dashboard");
        } else if (userRole === "user") {
          setRedirectTo("/user/dashboard");
        } else {
          setRedirectTo("/login");
        }
        setShouldRedirect(true);
        setIsChecking(false);
        return;
      }
      
      console.log("🔐 ACCESS GRANTED for:", userRole);
      setIsChecking(false);
    };

    // Add a small delay to ensure localStorage is updated
    const timer = setTimeout(() => {
      checkAuth();
    }, 100);

    return () => clearTimeout(timer);
  }, [location.pathname, requiredRole]);

  // Show loading while checking
  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-2"></div>
          <p className="text-gray-600 text-sm">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Redirect if needed
  if (shouldRedirect) {
    console.log(`🔐 [ProtectedRoute] Redirecting to: ${redirectTo}`);
    return <Navigate to={redirectTo} replace state={{ from: location.pathname }} />;
  }

  console.log("🔐 [ProtectedRoute] Rendering protected content");
  return children;
};

export default ProtectedRoute;