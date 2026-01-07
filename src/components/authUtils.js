// Match YOUR existing API structure from Login.jsx
const API_LOGIN = "http://localhost/eplms-main/backend/login/users.php";
const OTP_API = "http://localhost/eplms-main/backend/login/otp-admin.php";
const AUTOFILL_API = "http://localhost/eplms-main/backend/login/get_profile.php?action=get";

export const authUtils = {
  // --------------------- CHECK AUTHENTICATION ---------------------
  isAuthenticated: () => {
    const token = localStorage.getItem("auth_token");
    const email = localStorage.getItem("goserveph_email");
    return !!(token || email);
  },

  // --------------------- LOGIN FUNCTIONS (FROM YOUR LOGIN.JSX) ---------------------
  login: async (email, password) => {
    try {
      const response = await loginUser({ email, password });
      
      if (response.success) {
        // Store token for subsequent requests
        if (response.token) {
          localStorage.setItem("auth_token", response.token);
        }
        
        return { 
          success: true, 
          data: response,
          requireOTP: response.requireOTP || false 
        };
      } else {
        return { 
          success: false, 
          message: response.message || "Login failed" 
        };
      }
    } catch (err) {
      console.error("Login error:", err);
      return { success: false, message: "Network error" };
    }
  },

  // Send OTP function (matches your Login.jsx)
  sendOTP: async (email, purpose = "login") => {
    try {
      const response = await sendOtp(email, purpose);
      return response;
    } catch (error) {
      console.error("Send OTP error:", error);
      return { success: false, message: "Network error (send OTP)" };
    }
  },

  // Verify OTP function (matches your Login.jsx)
  verifyOTP: async (email, otp, purpose = "login") => {
    try {
      const response = await verifyOtp(email, otp, purpose);
      
      if (response.success) {
        // Store authentication data (EXACTLY like your Login.jsx)
        localStorage.setItem("auth_token", response.token || "dummy_token");
        localStorage.setItem("goserveph_role", response.role || "user");
        localStorage.setItem("goserveph_email", email);
        localStorage.setItem("email", email);
        
        // Save department if it exists
        if (response.department) {
          localStorage.setItem("goserveph_department", response.department);
        } else if (response.isAdmin) {
          // If isAdmin is true but department is not set, assign based on email
          const department = authUtils.getDepartmentFromEmail(email);
          if (department) {
            localStorage.setItem("goserveph_department", department);
          }
        }
        
        if (response.user_id) {
          localStorage.setItem("goserveph_user_id", response.user_id);
        }
        
        if (response.name) {
          localStorage.setItem("goserveph_name", response.name);
        }
      }
      
      return response;
    } catch (error) {
      console.error("Verify OTP error:", error);
      return { success: false, message: "Network error (verify OTP)" };
    }
  },

  // --------------------- GET USER PROFILE ---------------------
  fetchUserProfile: async () => {
    try {
      const token = localStorage.getItem("auth_token");
      const email = localStorage.getItem("goserveph_email") || localStorage.getItem("email");
      
      if (!token && !email) {
        return { 
          success: false, 
          message: "No authentication data found" 
        };
      }

      const headers = {
        "Content-Type": "application/json",
      };
      
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const res = await fetch(AUTOFILL_API, {
        method: "GET",
        headers: headers,
        credentials: "include",
      });

      if (res.status === 401) {
        return { 
          success: false, 
          message: "Authentication failed",
          isUnauthorized: true 
        };
      }

      const data = await res.json();
      
      if (data.success && data.data) {
        const userData = {
          firstName: data.data.first_name || "",
          lastName: data.data.last_name || "",
          email: data.data.email || email || "",
          fullName: `${data.data.first_name || ""} ${data.data.last_name || ""}`.trim() || 
                   (data.data.email ? data.data.email.split("@")[0] : "User"),
          username: data.data.email ? data.data.email.split("@")[0] : "User",
          role: data.data.role || localStorage.getItem("goserveph_role") || "user",
          department: data.data.department || localStorage.getItem("goserveph_department") || "",
          authMethod: data.auth_method || "unknown"
        };
        
        // Store in localStorage for consistency
        localStorage.setItem("user_name", userData.fullName);
        localStorage.setItem("first_name", userData.firstName);
        localStorage.setItem("last_name", userData.lastName);
        localStorage.setItem("email", userData.email);
        localStorage.setItem("user_profile", JSON.stringify(userData));
        
        // Update role and department if not set
        if (!localStorage.getItem("goserveph_role") && userData.role) {
          localStorage.setItem("goserveph_role", userData.role);
        }
        
        if (!localStorage.getItem("goserveph_department") && userData.department) {
          localStorage.setItem("goserveph_department", userData.department);
        }
        
        return { success: true, data: userData };
      } else {
        return { success: false, message: data.message || "Failed to fetch profile" };
      }
    } catch (err) {
      console.error("Get profile error:", err);
      return { success: false, message: "Network error" };
    }
  },

  // --------------------- LOGOUT ---------------------
  logout: async () => {
    try {
      const token = localStorage.getItem("auth_token");
      
      if (token) {
        // Call your logout endpoint
        await fetch(`${API_LOGIN}?action=logout`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": token ? `Bearer ${token}` : ""
          },
          credentials: "include",
          body: JSON.stringify({ token })
        });
      }
    } catch (err) {
      console.error("Logout API error:", err);
    } finally {
      // Clear ALL local storage
      localStorage.clear();
      // Clear session cookies
      document.cookie = "PHPSESSID=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    }
  },

  // --------------------- GET CACHED USER ---------------------
  getCachedUser: () => {
    const profile = localStorage.getItem("user_profile");
    if (profile) {
      try {
        return JSON.parse(profile);
      } catch (e) {
        console.error("Invalid cached profile:", e);
      }
    }
    
    // Fallback to individual fields (match your Login.jsx storage)
    const cachedName = localStorage.getItem("user_name") || localStorage.getItem("goserveph_name");
    const cachedFirstName = localStorage.getItem("first_name");
    const email = localStorage.getItem("goserveph_email") || localStorage.getItem("email");
    const role = localStorage.getItem("goserveph_role");
    const department = localStorage.getItem("goserveph_department");
    
    let fullName = "Loading...";
    if (cachedName) {
      fullName = cachedName;
    } else if (cachedFirstName) {
      fullName = cachedFirstName;
    } else if (email) {
      fullName = email.split("@")[0];
    }
    
    return {
      firstName: cachedFirstName || "",
      lastName: localStorage.getItem("last_name") || "",
      email: email || "",
      fullName,
      username: email ? email.split("@")[0] : fullName,
      role: role || "user",
      department: department || ""
    };
  },

  // --------------------- HELPER FUNCTIONS ---------------------
  getDepartmentFromEmail: (email) => {
    if (!email) return null;
    
    const emailToDepartment = {
      'superadmin@eplms.com': 'super',
      'businessadmin@eplms.com': 'business',
      'buildingadmin@eplms.com': 'building',
      'barangaystaff@eplms.com': 'barangay',
      'transportadmin@eplms.com': 'transport',
      'admin@eplms.com': 'super'
    };
    
    return emailToDepartment[email.toLowerCase()] || null;
  },

  getUserDisplayName: () => {
    const cached = authUtils.getCachedUser();
    return cached.fullName;
  },

  getUserRole: () => {
    const cached = authUtils.getCachedUser();
    return cached.role;
  },

  getUserDepartment: () => {
    const cached = authUtils.getCachedUser();
    return cached.department;
  },

  getDepartmentIcon: (department) => {
    if (!department) return null;
    
    const dept = department.toLowerCase();
    switch(dept) {
      case 'business':
        return 'Briefcase';
      case 'building':
        return 'Building';
      case 'transport':
        return 'Truck';
      case 'barangay':
      case 'barangaystaff':
        return 'Home';
      case 'super':
        return 'Shield';
      default:
        return 'User';
    }
  },

  getDepartmentDisplay: (department) => {
    if (!department) return "";
    
    if (department === 'barangaystaff') return 'Barangay Staff';
    if (department === 'super') return 'Super Admin';
    
    return department.charAt(0).toUpperCase() + department.slice(1);
  },

  getDashboardUrl: () => {
    const role = authUtils.getUserRole();
    if (role === 'admin') {
      return "/admin/dashboard";
    }
    return "/user/dashboard";
  }
};

// Import your existing AuthService functions
const loginUser = async ({ email, password }) => {
  try {
    const res = await fetch(`${API_LOGIN}?action=login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      credentials: "include",
    });

    const data = await res.json();

    if (!data.success) return data;

    // Store token in localStorage for subsequent requests
    if (data.token) {
      localStorage.setItem("auth_token", data.token);
      localStorage.setItem("email", email);
    }

    // Admin detected? start OTP flow
    if (data.isAdmin) {
      const otpRes = await fetch(`${OTP_API}?action=send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, purpose: "login" }),
      });

      const otpData = await otpRes.json();
      return {
        ...otpData,
        requireOTP: true,
        department: otpData.department,
      };
    }

    // Regular user
    return { ...data, requireOTP: false };

  } catch (err) {
    console.error("Login error:", err);
    return { success: false, message: "Network error" };
  }
};

const sendOtp = async (email, purpose = "login") => {
  try {
    const res = await fetch(`${OTP_API}?action=send`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, purpose }),
    });
    return await res.json();
  } catch (err) {
    console.error("Send OTP error:", err);
    return { success: false, message: "Network error (send OTP)" };
  }
};

const verifyOtp = async (email, otp, purpose = "login") => {
  try {
    const res = await fetch(`${OTP_API}?action=verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, otp, purpose }),
    });
    return await res.json();
  } catch (error) {
    console.error("Verify OTP error:", error);
    return { success: false, message: "Network error (verify OTP)" };
  }
};