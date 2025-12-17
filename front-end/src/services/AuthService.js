const API_LOGIN = "http://localhost/eplms-main/backend/login/users.php";
const OTP_API = "http://localhost/eplms-main/backend/login/otp-admin.php";
const AUTOFILL_API = "http://localhost/eplms-main/backend/login/get_profile.php?action=get";

// --------------------- USERS ---------------------

// Login user (regular + admin)
export const loginUser = async ({ email, password }) => {
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

// --------------------- REGISTER ---------------------
export const registerUser = async (userData) => {
  try {
    const res = await fetch(`${API_LOGIN}?action=register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
      credentials: "include",
    });

    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error("Register error:", err);
    return { success: false, message: "Network error" };
  }
};

// --------------------- OTP ---------------------
export const sendOtp = async (email, purpose = "login") => {
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

export const verifyOtp = async (email, otp, purpose = "login") => {
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

// --------------------- GET USER PROFILE ---------------------
export const getUserProfile = async () => {
  try {
    const token = localStorage.getItem("auth_token");
    if (!token) return { success: false, message: "No auth token found" };

    const res = await fetch(AUTOFILL_API, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // ✅ send token to backend
      },
      credentials: "include",
    });

    return await res.json();
  } catch (error) {
    console.error("Get profile error:", error);
    return { success: false, message: "Network error (get profile)" };
  }
};
