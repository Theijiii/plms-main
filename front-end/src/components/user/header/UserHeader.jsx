import { useState, useEffect } from "react";
import { User, LogOut } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";

export default function UserHeader() {
  const [time, setTime] = useState(new Date());
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [open, setOpen] = useState(false);
  const [userName, setUserName] = useState("Loading...");
  const navigate = useNavigate();

  // ================= TIME =================
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // ================= SCROLL =================
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsVisible(currentScrollY < lastScrollY || currentScrollY < 100);
      setLastScrollY(currentScrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // ================= FETCH USER (DUAL AUTH) =================
  useEffect(() => {
    async function fetchUser() {
      try {
        console.log("🔄 UserHeader: Fetching user profile...");
        
        // Get authentication data
        const token = localStorage.getItem("auth_token");
        const email = localStorage.getItem("email");
        
        if (!token && !email) {
          console.warn("No authentication data found");
          setUserName("Guest");
          return;
        }

        // Prepare headers
        const headers = {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        };
        
        // Add token if available
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        // Fetch profile
        const res = await fetch("http://localhost/eplms-main/backend/login/get_profile.php?action=get", {
          method: "GET",
          credentials: "include", // Important for sessions
          headers: headers
        });

        console.log("Response status:", res.status);
        
        if (res.status === 401) {
          console.error("Authentication failed");
          handleAuthFailure();
          return;
        }

        const data = await res.json();
        console.log("Profile data:", data);
        
        if (data.success && data.data) {
          const { first_name, last_name, email } = data.data;
          
          // Use name if available
          if (first_name || last_name) {
            const fullName = `${first_name || ''} ${last_name || ''}`.trim();
            setUserName(fullName);
            
            // Store data
            localStorage.setItem("user_name", fullName);
            localStorage.setItem("first_name", first_name || "");
            localStorage.setItem("last_name", last_name || "");
            localStorage.setItem("email", email || "");
            localStorage.setItem("user_profile", JSON.stringify(data.data));
            
            console.log(`✅ User: ${fullName} (via ${data.auth_method})`);
          } else if (email) {
            // Fallback to email
            const username = email.split("@")[0];
            setUserName(username);
            localStorage.setItem("user_name", username);
            localStorage.setItem("email", email);
            console.log(`✅ User: ${username} (via email, auth: ${data.auth_method})`);
          } else {
            setUserName("User");
          }
        } else {
          console.warn("Profile fetch failed:", data.message);
          useCachedData();
        }
        
      } catch (err) {
        console.error("Network error:", err);
        useCachedData();
      }
    }

    function handleAuthFailure() {
      // Clear auth data
      localStorage.removeItem("auth_token");
      localStorage.removeItem("email");
      localStorage.removeItem("user_id");
      
      // Check if we're already on login page
      if (window.location.pathname !== "/login") {
        navigate("/login");
      } else {
        setUserName("Guest");
      }
    }

    function useCachedData() {
      const cachedName = localStorage.getItem("user_name");
      const cachedFirstName = localStorage.getItem("first_name");
      const email = localStorage.getItem("email");
      
      if (cachedName) {
        setUserName(cachedName);
      } else if (cachedFirstName) {
        setUserName(cachedFirstName);
      } else if (email) {
        setUserName(email.split("@")[0]);
      } else {
        setUserName("User");
      }
    }

    fetchUser();
  }, [navigate]);

  // ================= LOGOUT (DUAL SYSTEM) =================
  const handleLogout = async () => {
    try {
      // Get token for API logout
      const token = localStorage.getItem("auth_token");
      
      // Call logout API
      await fetch("http://localhost/eplms-main/backend/login/logout.php", {
        method: "POST",
        credentials: "include", // Clear session cookies
        headers: token ? {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        } : {
          'Content-Type': 'application/json'
        }
      });
      
    } catch (err) {
      console.error("Logout API error:", err);
    } finally {
      // Clear ALL local storage
      localStorage.clear();
      
      // Clear session cookies
      document.cookie = "PHPSESSID=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      
      // Redirect to login
      navigate("/login");
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 bg-white shadow-sm border-b-3 border-[#FDA811] transition-transform duration-300 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="container mx-auto px-6 py-2 flex justify-between items-center h-18">
        {/* LEFT */}
        <Link to="/user/dashboard" className="flex items-center gap-3">
          <img src="/GSM_logo.png" alt="Logo" className="w-12 h-12" />
          <div>
            <div className="text-lg font-bold">
              <span className="text-blue-700">Go</span>
              <span className="text-green-700">Serve</span>
              <span className="text-blue-700">PH</span>
            </div>
            <div className="text-xs text-gray-600">Serbisyong Publiko, Abot-Kamay Mo.</div>
          </div>
        </Link>

        {/* RIGHT */}
        <div className="flex items-center gap-6">
          <div className="text-right text-xs">
            <div className="font-semibold">{time.toLocaleTimeString()}</div>
            <div>
              {time.toLocaleDateString(undefined, {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
          </div>

          {/* USER DROPDOWN */}
          <div className="relative">
            <button
              onClick={() => setOpen(!open)}
              className="flex items-center space-x-2 px-3 py-1 rounded hover:bg-gray-100"
            >
              <User size={20} />
              <span className="font-medium">{userName}</span>
            </button>

            {open && (
              <div className="absolute right-0 mt-2 w-36 bg-white shadow-lg rounded-lg border">
                <button 
                  onClick={handleLogout} 
                  className="flex items-center w-full px-4 py-2 hover:bg-gray-100 text-red-600"
                >
                  <LogOut size={12} className="mr-2" /> Log Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}