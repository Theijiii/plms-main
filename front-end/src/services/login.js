const API_URL = "http://localhost/eplms-main/backend/users.php";

export const loginUser = async ({ email, password }) => {
  try {
    const res = await fetch(`${API_URL}?action=login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json(); // parse JSON response
    return data; // { success: true, token: "...", user_id: 1 } or { success: false, message: "..." }
  } catch (err) {
    console.error("Login error:", err);
    return { success: false, message: "Network error" };
  }
};
