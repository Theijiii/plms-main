import { useEffect } from "react";

export default function AutofillProfile({ onProfileFetched }) {
  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (!token) return;

    fetch("http://localhost/eplms-main/backend/login/user_profile.php", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then(res => res.json())
      .then(data => {
        if (data.success && onProfileFetched) {
          onProfileFetched(data.data); // send profile to parent
        }
      })
      .catch(err => console.error("Failed to fetch profile:", err));
  }, [onProfileFetched]);

  return null; // no UI
}
