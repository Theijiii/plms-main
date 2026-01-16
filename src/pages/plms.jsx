import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Building, 
  Car, 
  FileText, 
  Home,
  Shield,
  Clock,
  CheckCircle,
  Users,
  ArrowRight,
  Lock,
  UserPlus
} from "lucide-react";
import Footer from '../components/user/Footer';

export default function LandingPage() {
  const [time, setTime] = useState(new Date());
  const [isVisible, setIsVisible] = useState(true);
  const navigate = useNavigate();

  // Update current time
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Header visibility on scroll
  useEffect(() => {
    let lastScrollY = window.scrollY;
    
    const updateScrollDirection = () => {
      const scrollY = window.scrollY;
      const direction = scrollY > lastScrollY ? "down" : "up";
      if (direction !== "down" && scrollY > 50) {
        setIsVisible(true);
      } else if (direction === "down" && scrollY > 50) {
        setIsVisible(false);
      }
      lastScrollY = scrollY > 0 ? scrollY : 0;
    };

    window.addEventListener("scroll", updateScrollDirection);
    return () => window.removeEventListener("scroll", updateScrollDirection);
  }, []);

  const handleLoginClick = () => {
    navigate("/login");
  };

  const handleRegisterClick = () => {
    navigate("/register");
  };

  const services = [
    {
      id: 1,
      title: "Business Permit Application",
      description: "Apply, renew, and manage your business permits online with streamlined processing.",
      icon: <FileText className="w-10 h-10 text-blue-600" />,
      color: "bg-blue-50 border-blue-200 hover:bg-blue-100",
      textColor: "text-blue-800",
      buttonColor: "bg-blue-600 hover:bg-blue-700",
      features: ["New Business", "Renewal", "Amendments", "Payment"],
      stats: "Processed in 3-5 days",
      height: "h-64"
    },
    {
      id: 2,
      title: "Transport & Franchise Permit",
      description: "Secure transport permits, vehicle registration, and franchise applications digitally.",
      icon: <Car className="w-10 h-10 text-green-600" />,
      color: "bg-green-50 border-green-200 hover:bg-green-100",
      textColor: "text-green-800",
      buttonColor: "bg-green-600 hover:bg-green-700",
      features: ["Vehicle Registration", "Franchise", "Renewal", "Permits"],
      stats: "24/7 Online Application",
      height: "h-72"
    },
    {
      id: 3,
      title: "Building & Construction Permit",
      description: "Submit building plans, get construction permits, and schedule inspections online.",
      icon: <Building className="w-10 h-10 text-orange-600" />,
      color: "bg-orange-50 border-orange-200 hover:bg-orange-100",
      textColor: "text-orange-800",
      buttonColor: "bg-orange-600 hover:bg-orange-700",
      features: ["Building Plans", "Permits", "Inspections", "Clearances"],
      stats: "Digital Plan Submission",
      height: "h-68"
    },
    {
      id: 4,
      title: "Barangay Permit & Clearance",
      description: "Obtain barangay clearance, community permits, and local certifications quickly.",
      icon: <Home className="w-10 h-10 text-purple-600" />,
      color: "bg-purple-50 border-purple-200 hover:bg-purple-100",
      textColor: "text-purple-800",
      buttonColor: "bg-purple-600 hover:bg-purple-700",
      features: ["Clearance", "Certifications", "Community", "Local"],
      stats: "Issued in 24 hours",
      height: "h-60"
    }
  ];

  const features = [
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Secure & Encrypted",
      description: "Bank-level security for all your transactions"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "24/7 Access",
      description: "Access services anytime, anywhere"
    },
    {
      icon: <CheckCircle className="w-6 h-6" />,
      title: "Real-time Tracking",
      description: "Monitor your application status live"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Dedicated Support",
      description: "Get help from government agents"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-500 via-black to-gray-500 relative overflow-hidden">
      {/* Black Background with 40% opacity overlay */}
      <div className="fixed inset-0 z-0 bg-black/10"></div>
      
      {/* Background Image with Low Opacity */}
      <div className="fixed inset-0 z-0 bg-[url('/GovServePH.png')] bg-center bg-contain bg-no-repeat opacity-10"></div>

      {/* Animated Background Particles */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(76,175,80,0.05)_0%,transparent_50%),radial-gradient(circle_at_80%_20%,rgba(74,144,226,0.05)_0%,transparent_50%),radial-gradient(circle_at_40%_40%,rgba(253,168,17,0.03)_0%,transparent_50%)] animate-pulse"></div>
      </div>

      {/* Header - WHITE */}
      <header
        className={`sticky top-0 z-50 bg-white shadow-sm border-b-4 border-[#FDA811] transition-transform duration-300 ${
          isVisible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          {/* LEFT: Logo + Title + Tagline */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-200">
              <img
                src="/GSM_logo.png"
                alt="GoServePH Logo"
                className="w-10 h-10 object-contain"
              />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-xl font-bold">
                <span className="text-blue-700">Go</span>
                <span className="text-green-600">Serve</span>
                <span className="text-blue-700">PH</span>
              </span>
              <span className="text-sm text-gray-600">
                Serbisyong Publiko, Abot-Kamay Mo.
              </span>
            </div>
          </div>

          {/* RIGHT: Auth Buttons */}
          <div className="flex items-center gap-3">
            <div className="hidden md:block text-right text-sm text-gray-800 mr-3">
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
            <button
              onClick={handleLoginClick}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors flex items-center gap-2 hover:bg-gray-100 rounded-lg"
            >
              <Lock className="w-4 h-4" />
              Mag-login
            </button>
            <button
              onClick={handleRegisterClick}
              className="px-5 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg font-semibold hover:from-green-700 hover:to-green-800 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg flex items-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              Mag-register
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-4 py-8 md:py-10 lg:py-12">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-10 items-start max-w-6xl mx-auto">
          {/* Left Section - Hero Content */}
          <div className="text-center lg:text-left space-y-6">
            <div className="space-y-4">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-white">
                <span className="bg-gradient-to-r from-blue-400 via-green-400 to-blue-400 bg-clip-text text-transparent bg-size-600 animate-gradient">
                  Abot-Kamay mo ang Serbisyong Publiko!
                </span>
              </h1>
              <p className="text-lg text-gray-300 max-w-xl leading-relaxed">
                Access government services conveniently through our digital platform. 
                Fast, secure, and reliable public service at your fingertips.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 py-4">
              {features.map((feature, index) => (
                <div key={index} className="text-center space-y-2">
                  <div className="w-10 h-10 bg-gray-800/80 rounded-xl flex items-center justify-center mx-auto hover:shadow-md transition-shadow">
                    <div className="text-blue-400">
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="font-semibold text-gray-200 text-xs">
                    {feature.title}
                  </h3>
                  <p className="text-xs text-gray-400">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                onClick={handleRegisterClick}
                className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-semibold hover:from-green-700 hover:to-green-800 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                <UserPlus className="w-4 h-4" />
                Mag-register Ngayon
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={handleLoginClick}
                className="px-6 py-3 bg-gray-800 text-gray-200 border border-gray-700 rounded-xl font-semibold hover:bg-gray-700 hover:border-gray-600 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4" />
                Mag-login sa Account
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-gray-700">
              <div className="text-center">
                <div className="text-xl md:text-2xl font-bold text-blue-400">50K+</div>
                <div className="text-xs text-gray-400">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-xl md:text-2xl font-bold text-green-400">100K+</div>
                <div className="text-xs text-gray-400">Applications</div>
              </div>
              <div className="text-center">
                <div className="text-xl md:text-2xl font-bold text-orange-400">99%</div>
                <div className="text-xs text-gray-400">Satisfaction</div>
              </div>
            </div>
          </div>

          {/* Right Section - Masonry Grid Services Cards */}
          <div className="space-y-4">
            <div className="text-center lg:text-left mb-4">
              <h2 className="text-xl md:text-2xl font-bold text-white mb-2">
                Available Government Services
              </h2>
              <p className="text-gray-400 text-sm">
                Choose from our comprehensive range of digital government services
              </p>
            </div>

            {/* Masonry Grid Container */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {services.map((service) => (
                <div
                  key={service.id}
                  className={`${service.color} ${service.height} border border-gray-300/20 rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:translate-y-[-2px] flex flex-col`}
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm flex-shrink-0">
                      {service.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className={`font-bold text-base mb-1 ${service.textColor}`}>
                        {service.title}
                      </h3>
                      <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                        {service.description}
                      </p>
                      <div className="text-xs font-medium text-gray-500">
                        ⏱️ {service.stats}
                      </div>
                    </div>
                  </div>

                  <div className="mb-3 flex-1">
                    <div className="flex flex-wrap gap-1">
                      {service.features.map((feature, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-white/90 rounded text-xs font-medium text-gray-700 border border-gray-200"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => navigate("/services")}
                    className={`${service.buttonColor} text-white px-3 py-2 rounded-lg text-xs font-medium transition-all duration-300 hover:shadow-md w-full flex items-center justify-center gap-1 mt-auto`}
                  >
                    Access Service
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />

      {/* Custom Animations */}
      <style>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 6s ease infinite;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}