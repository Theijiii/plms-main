const API_URL = "http://localhost/eplms-main/backend/otp.php";

export const sendOtp = async (email, purpose = 'login') => {
  try {
    const res = await fetch(`${API_URL}?action=send`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, purpose }),
    });
    return await res.json();
  } catch (err) {
    console.error("OTP error:", err);
    return { success: false, message: "Failed to send OTP" };
  }
};


export const verifyOtp = async (email, otp, purpose = 'login') => {
  try {
    const res = await fetch(`${API_URL}?action=verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, otp, purpose }),
    });
    return await res.json();
  } catch (err) {
    console.error("Verify error:", err);
    return { success: false, message: "Failed to verify OTP" };
  }
};