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

  // ================= FETCH USER =================
  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("http://localhost/eplms-main/backend/login/get_profile.php?action=get", {
          method: "GET",
          credentials: "include", // important for PHP session
        });
        const data = await res.json();
        if (data.success && data.data) {
          const { first_name, last_name } = data.data;
          setUserName(`${first_name} ${last_name}`);
        } else {
          setUserName("Guest");
          navigate("/login"); // redirect if not logged in
        }
      } catch (err) {
        console.error("Failed to fetch user profile:", err);
        setUserName("Guest");
        navigate("/login");
      }
    }

    fetchUser();
  }, [navigate]);

  // ================= LOGOUT =================
  const handleLogout = async () => {
    try {
      await fetch("http://localhost/eplms-main/backend/login/logout.php", {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
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
                <button onClick={handleLogout} className="flex items-center w-full px-4 py-2 hover:bg-gray-100">
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
