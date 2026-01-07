import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  // Check authentication status on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const email = localStorage.getItem('email');

      // Check if we have authentication data
      if (!token && !email) {
        setLoading(false);
        return;
      }

      // Prepare headers
      const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      // Fetch user profile
      const res = await fetch('http://localhost/eplms-main/backend/login/get_profile.php?action=get', {
        method: 'GET',
        credentials: 'include',
        headers: headers
      });

      if (res.status === 401) {
        // Authentication failed
        clearAuth();
        setLoading(false);
        return;
      }

      const data = await res.json();

      if (data.success && data.data) {
        const userData = processUserData(data.data);
        setUser(userData);
        setIsAuthenticated(true);
        
        // Store in localStorage
        localStorage.setItem('user_profile', JSON.stringify(userData));
        localStorage.setItem('user_name', userData.fullName || userData.username);
        localStorage.setItem('first_name', userData.firstName || '');
        localStorage.setItem('last_name', userData.lastName || '');
        localStorage.setItem('email', userData.email || '');
        
        if (data.auth_method) {
          localStorage.setItem('auth_method', data.auth_method);
        }
        
        // Store role for route protection
        if (userData.role) {
          localStorage.setItem('user_role', userData.role);
        }
        if (userData.department) {
          localStorage.setItem('user_department', userData.department);
        }
      } else {
        // Try to use cached data
        useCachedData();
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      useCachedData();
    } finally {
      setLoading(false);
    }
  };

  const processUserData = (data) => {
    const firstName = data.first_name || data.firstName || '';
    const lastName = data.last_name || data.lastName || '';
    const email = data.email || '';
    const role = data.role || data.user_type || 'user';
    const department = data.department || data.dept || '';
    
    return {
      ...data,
      firstName,
      lastName,
      email,
      role,
      department,
      fullName: `${firstName} ${lastName}`.trim(),
      username: email ? email.split('@')[0] : 'User'
    };
  };

  const useCachedData = () => {
    const profile = localStorage.getItem('user_profile');
    if (profile) {
      try {
        const userData = JSON.parse(profile);
        setUser(userData);
        setIsAuthenticated(true);
      } catch (e) {
        // Invalid JSON
      }
    } else {
      // Check for individual fields
      const userName = localStorage.getItem('user_name');
      const email = localStorage.getItem('email');
      const role = localStorage.getItem('user_role');
      const department = localStorage.getItem('user_department');
      
      if (userName || email) {
        setUser({
          fullName: userName || '',
          username: email ? email.split('@')[0] : userName || 'User',
          email: email || '',
          role: role || 'user',
          department: department || ''
        });
        setIsAuthenticated(true);
      }
    }
  };

  const login = async (loginData) => {
    try {
      // Clear any existing auth
      clearAuth();
      
      const response = await fetch('http://localhost/eplms-main/backend/login/login.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData)
      });

      const data = await response.json();

      if (data.success) {
        if (data.token) {
          localStorage.setItem('auth_token', data.token);
        }
        if (data.email) {
          localStorage.setItem('email', data.email);
        }
        if (data.user_id) {
          localStorage.setItem('user_id', data.user_id);
        }
        if (data.role) {
          localStorage.setItem('user_role', data.role);
        }
        if (data.department) {
          localStorage.setItem('user_department', data.department);
        }

        // Refresh auth status
        await checkAuthStatus();
        return { success: true, data };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Network error' };
    }
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      
      await fetch('http://localhost/eplms-main/backend/login/logout.php', {
        method: 'POST',
        credentials: 'include',
        headers: token ? {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        } : {
          'Content-Type': 'application/json'
        }
      });
    } catch (err) {
      console.error('Logout API error:', err);
    } finally {
      clearAuth();
      navigate('/login');
    }
  };

  const clearAuth = () => {
    localStorage.clear();
    setUser(null);
    setIsAuthenticated(false);
    // Clear session cookie
    document.cookie = 'PHPSESSID=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  };

  const updateUser = (updates) => {
    setUser(prev => ({ ...prev, ...updates }));
    // Also update localStorage if needed
    if (updates.firstName || updates.lastName) {
      const fullName = `${updates.firstName || user?.firstName || ''} ${updates.lastName || user?.lastName || ''}`.trim();
      localStorage.setItem('user_name', fullName);
    }
    if (updates.role) {
      localStorage.setItem('user_role', updates.role);
    }
    if (updates.department) {
      localStorage.setItem('user_department', updates.department);
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    updateUser,
    checkAuthStatus,
    clearAuth
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};