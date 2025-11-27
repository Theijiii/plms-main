import { useState, useEffect } from "react";
import { User, LogOut, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function UserHeader({ username = "User" }) {
  const [time, setTime] = useState(new Date());
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [open, setOpen] = useState(false); // dropdown
  const [showLogoutModal, setShowLogoutModal] = useState(false); // logout modal
  const navigate = useNavigate();

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Scroll behavior
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsVisible(currentScrollY < lastScrollY || currentScrollY < 100);
      setLastScrollY(currentScrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const handleLogout = () => {
    // Add logout logic here (e.g., clear tokens)
    navigate("/login");
  };

  return (
    <header
      className={`sticky top-0 z-50 bg-white shadow-sm border-b-3 border-[#FDA811] transition-transform duration-300 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="container mx-auto px-6 py-2 flex justify-between items-center h-18">
        {/* LEFT: Logo + Title */}
<div className="flex items-center gap-3">
  <Link to="/user/dashboard" className="flex items-center gap-3">
    <img
      src="/GSM_logo.png"
      alt="Logo"
      className="w-12 h-12 object-contain cursor-pointer hover:opacity-90 transition"
    />
    <div className="flex flex-col leading-tight">
      <span className="text-lg font-bold font-montserrat">
        <span className="text-blue-700">Go</span>
        <span className="text-green-700">Serve</span>
        <span className="text-blue-700">PH</span>
      </span>
      <span className="text-xs text-gray-600 font-montserrat">
        Serbisyong Publiko, Abot-Kamay Mo.
      </span>
    </div>
  </Link>
</div>

        {/* RIGHT: Time + User */}
        <div className="flex items-center gap-6">
          <div className="text-right text-xs text-gray-800">
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

          {/* User Dropdown */}
          <div className="relative">
            <button
              onClick={() => setOpen(!open)}
              className="flex items-center space-x-2 px-3 py-1 rounded hover:bg-gray-100 transition"
            >
              <User size={20} />
              <span className="font-medium">{username}</span>
            </button>
{open && (
  <div className="absolute right-0 mt-2 w-36 bg-white shadow-lg rounded-lg border border-gray-200 z-50">
    <button
      className="flex items-center w-full px-4 py-2 text-left hover:bg-gray-100 transition"
      onClick={() => {
        // Close dropdown
        setOpen(false);


        // Redirect to login page
        window.location.href = '/login'; // or use react-router navigate('/user/login') if inside Router
      }}
    >
      <LogOut size={12} className="mr-2" /> Log Out
    </button>
  </div>
)}

          </div>
        </div>
      </div>

      {/* Logout Confirmation Modal 
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full relative">
            <button
              onClick={() => setShowLogoutModal(false)}
              className="absolute top-3 right-3 p-1 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X size={20} />
            </button>
            <h2 className="text-xl font-bold mb-4 text-center">Confirm Log Out</h2>
            <p className="text-center mb-6">
              Are you sure you want to log out?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleLogout}
                className="px-5 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition"
              >
                Yes, Log Out
              </button>
              <button
                onClick={() => setShowLogoutModal(false)}
                className="px-5 py-2 bg-gray-300 text-gray-800 rounded-lg font-semibold hover:bg-gray-400 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div> */}
      
    </header>
  );
}
