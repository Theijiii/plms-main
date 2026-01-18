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
  ArrowRight,
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

  const services = [
    {
      id: 1,
      title: "Business Permit Application",
      description: "Apply, renew, and manage your business permits online with streamlined processing.",
      icon: <FileText className="w-8 h-8 text-[#4A90E2]" />,
      color: "bg-white border-blue-200 hover:bg-blue-100",
      textColor: "text-[#4A90E2]",
      features: ["New Business", "Renewal", "Amendments", "Payment"],
      stats: "Processed in 3-5 days",
      height: "h-80"
    },
    {
      id: 2,
      title: "Transport & Franchise Permit",
      description: "Secure transport permits, vehicle registration, and franchise applications digitally.",
      icon: <Car className="w-8 h-8 text-[#4CAF50]" />,
      color: "bg-white border-green-200 hover:bg-green-100",
      textColor: "text-[#4CAF50]",
      features: ["Registration", "Franchise", "Renewal"],
      stats: "24/7 Online Application",
      height: "h-64"
    },
    {
      id: 3,
      title: "Building & Construction Permit",
      description: "Submit building plans, get construction permits, and schedule inspections online.",
      icon: <Building className="w-8 h-8 text-[#FDA811]" />,
      color: "bg-white border-orange-200 hover:bg-orange-100",
      textColor: "text-[#FDA811]",
      features: ["Building Plans", "Permits", "Clearances"],
      stats: "Digital Plan Submission",
      height: "h-72"
    },
    {
      id: 4,
      title: "Barangay Permit & Clearance",
      description: "Obtain barangay clearance, community permits, and local certifications quickly.",
      icon: <Home className="w-8 h-8 text-[#E53935]" />,
      color: "bg-white border-red-200 hover:bg-red-100",
      textColor: "text-[#E53935]",
      features: ["Clearance", "Certifications", "Community", "Local"],
      stats: "Issued in 24 hours",
      height: "h-60"
    }
  ];

  const features = [
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Secure & Encrypted",
      description: "Bank-level security for all your transactions",
      iconColor: "text-[#FDA811]"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "24/7 Access",
      description: "Access services anytime, anywhere",
      iconColor: "text-[#4A90E2]"
    },
    {
      icon: <CheckCircle className="w-6 h-6" />,
      title: "Real-time Tracking",
      description: "Monitor your application status live",
      iconColor: "text-[#4CAF50]"
    }
  ];

  const stats = [
    { value: "50K+", label: "Active Users" },
    { value: "100K+", label: "Applications" },
    { value: "99%", label: "Satisfaction" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#4CAF50] to-[#4A90E2] relative overflow-hidden">
      {/* Header - WHITE (unchanged) */}
      <header
        className={`sticky top-0 z-50 bg-white shadow-sm border-b-4 border-[#FDA811] transition-transform duration-300 ${
          isVisible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="px-[50px] py-3 flex justify-between items-center">
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
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 px-[50px] py-8 md:py-10 lg:py-12">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-10 items-start">
          {/* Left Section - Hero Content - CENTERED */}
          <div className="text-center space-y-6 mt-8">
            <div className="space-y-4">
              {/* Permit & Licensing Management System Title */}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-white">
                Welcome to Permit & Licensing Management System
              </h1>
              <p className="text-lg text-white leading-relaxed font-medium max-w-2xl mx-auto">
                Streamline your permit applications and licensing processes through our 
                digital platform. Fast, secure, and efficient government services at your fingertips.
              </p>
            </div>

            {/* Features Grid - CENTERED with colored icons */}
            <div className="grid grid-cols-3 gap-3 py-4 max-w-md mx-auto">
              {features.map((feature, index) => (
                <div key={index} className="text-center space-y-2">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center mx-auto hover:shadow-md transition-shadow border border-white/50">
                    <div className={feature.iconColor}>
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="font-bold text-white text-xs">
                    {feature.title}
                  </h3>
                  <p className="text-xs text-white/90">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>

            {/* CTA Button - CENTERED with FDA811 color */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 justify-center">
              <button
                onClick={handleLoginClick}
                className="px-6 py-3 bg-[#FDA811] text-white rounded-xl font-semibold hover:bg-[#e69500] transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 mx-auto sm:mx-0"
              >
                <UserPlus className="w-4 h-4" />
                Sign In
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Stats - CENTERED with WHITE numbers */}
            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-white/30 max-w-md mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-xl md:text-2xl font-bold text-white">
                    {stat.value}
                  </div>
                  <div className="text-xs text-white/90">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Section - Masonry Grid Services Cards */}
          <div className="space-y-4">
            <div className="text-center lg:text-left mb-4">
              <h2 className="text-xl md:text-2xl font-bold text-white mb-2">
                Available Permit & Licensing Services
              </h2>
              <p className="text-white/90 text-sm">
                Streamline your government compliance with our comprehensive digital services
              </p>
            </div>

            {/* Masonry Grid Container - Uses masonry columns */}
            <div className="columns-1 md:columns-2 gap-4">
              {services.map((service) => (
                <div
                  key={service.id}
                  className={`${service.color} ${service.height} border border-gray-300 rounded-xl p-5 shadow-lg hover:shadow-2xl transition-all duration-300 hover:translate-y-[-2px] mb-4 break-inside-avoid`}
                >
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm flex-shrink-0 border border-gray-200">
                      {service.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className={`font-bold text-lg mb-2 ${service.textColor}`}>
                        {service.title}
                      </h3>
                      <p className="text-sm text-gray-700 mb-3">
                        {service.description}
                      </p>
                      <div className="text-sm font-medium text-gray-600 flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {service.stats}
                      </div>
                    </div>
                  </div>

                  <div className="mb-4 flex-1">
                    <div className="flex flex-wrap gap-2">
                      {service.features.map((feature, index) => (
                        <span
                          key={index}
                          className="px-3 py-1.5 bg-white rounded-md text-sm font-medium text-gray-700 border border-gray-200"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Footer (unchanged) */}
      <Footer />
    </div>
  );
}