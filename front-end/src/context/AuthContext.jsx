// src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on mount
    const token = localStorage.getItem("auth_token");
    const userRole = localStorage.getItem("goserveph_role");
    const userDepartment = localStorage.getItem("goserveph_department");
    
    console.log("🔍 [AuthProvider] Initial load:", {
      token: !!token,
      userRole,
      userDepartment,
      allStorage: {
        auth_token: localStorage.getItem("auth_token"),
        goserveph_role: localStorage.getItem("goserveph_role"),
        goserveph_department: localStorage.getItem("goserveph_department"),
        goserveph_email: localStorage.getItem("goserveph_email"),
        goserveph_name: localStorage.getItem("goserveph_name"),
        goserveph_user_id: localStorage.getItem("goserveph_user_id")
      }
    });
    
    if (token && userRole) {
      setUser({
        token,
        role: userRole,
        department: userDepartment,
        email: localStorage.getItem("goserveph_email"),
        name: localStorage.getItem("goserveph_name"),
        userId: localStorage.getItem("goserveph_user_id")
      });
    }
    setLoading(false);
  }, []);

  const login = (data) => {
    console.log("🔍 [AuthProvider] Login called with data:", data);
    
    // Store user data in localStorage
    localStorage.setItem("auth_token", data.token);
    localStorage.setItem("goserveph_role", data.role);
    localStorage.setItem("goserveph_email", data.email);
    localStorage.setItem("goserveph_name", data.name);
    localStorage.setItem("goserveph_user_id", data.user_id);
    
    if (data.department) {
      localStorage.setItem("goserveph_department", data.department);
    }

    setUser({
      token: data.token,
      role: data.role,
      department: data.department,
      email: data.email,
      name: data.name,
      userId: data.user_id
    });
    
    console.log("🔍 [AuthProvider] After login - localStorage:", {
      role: localStorage.getItem("goserveph_role"),
      department: localStorage.getItem("goserveph_department"),
      email: localStorage.getItem("goserveph_email")
    });
  };

  const logout = async () => {
    const token = localStorage.getItem("auth_token");
    
    if (token) {
      try {
        await fetch(`http://localhost/plms-latest/api/auth.php?action=logout`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token })
        });
      } catch (error) {
        console.error('Logout error:', error);
      }
    }
    
    // Clear all auth data
    localStorage.removeItem("auth_token");
    localStorage.removeItem("goserveph_role");
    localStorage.removeItem("goserveph_email");
    localStorage.removeItem("goserveph_name");
    localStorage.removeItem("goserveph_department");
    localStorage.removeItem("goserveph_user_id");
    
    setUser(null);
    window.location.href = '/login';
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    getUserDepartment: () => user?.department
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};