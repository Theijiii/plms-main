const OTP_API = "http://localhost/eplms-main/backend/otp.php";

// Send OTP
export const sendOtp = async (email) => {
  try {
    const res = await fetch(`${OTP_API}?action=send`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    return await res.json();
  } catch (error) {
    return { success: false, message: "Network error (send OTP)" };
  }
};

// Verify OTP
export const verifyOtp = async (email, otp) => {
  try {
    const res = await fetch(`${OTP_API}?action=verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp }),
    });
    return await res.json();
  } catch (error) {
    return { success: false, message: "Network error (verify OTP)" };
  }
};
