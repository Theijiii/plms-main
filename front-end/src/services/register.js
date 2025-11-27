const API_URL = "http://localhost/eplms-main/backend/users.php";

export const registerUser = async (userData) => {
  try {
    const res = await fetch(`${API_URL}?action=register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    return await res.json();
  } catch (err) {
    console.error("Register error:", err);
    return { success: false, message: "Network error" };
  }
};
