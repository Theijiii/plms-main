const API_URL = "http://localhost/eplms-main/backend/login/users.php";
const OTP_API = "http://localhost/eplms-main/backend/login/otp-admin.php";

// --------------------- USERS ---------------------

// Login user (regular + admin)
export const loginUser = async ({ email, password }) => {
  try {
    const res = await fetch(`${API_URL}?action=login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      credentials: "include", // important for session handling
    });

    const data = await res.json();

    // Admin detected? start OTP flow
    if (data.isAdmin) {
      // Send OTP to super admin
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
    const res = await fetch(`${API_URL}?action=register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
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
// Verify OTP
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
