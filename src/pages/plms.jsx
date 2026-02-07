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
  UserPlus,
  TrendingUp,
  Award,
  Zap,
  Lock,
  Globe,
  Users
} from "lucide-react";
import Footer from '../components/user/Footer';

export default function LandingPage() {
  const [time, setTime] = useState(new Date());
  const [isVisible, setIsVisible] = useState(true);
  const [activeCard, setActiveCard] = useState(null);
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
      icon: <FileText className="w-8 h-8" />,
      gradient: "from-blue-500 to-blue-600",
      bgColor: "bg-gradient-to-br from-blue-50 to-indigo-100",
      borderColor: "border-blue-400",
      iconBg: "bg-gradient-to-br from-blue-500 to-indigo-600",
      textColor: "text-blue-700",
      features: ["New Business", "Renewal", "Amendments", "Payment"],
      stats: "Processed in 3-5 days",
      statsIcon: <TrendingUp className="w-4 h-4" />
    },
    {
      id: 2,
      title: "Transport & Franchise Permit",
      description: "Secure transport permits, vehicle registration, and franchise applications digitally.",
      icon: <Car className="w-8 h-8" />,
      gradient: "from-green-500 to-green-600",
      bgColor: "bg-gradient-to-br from-emerald-50 to-teal-100",
      borderColor: "border-emerald-400",
      iconBg: "bg-gradient-to-br from-emerald-500 to-teal-600",
      textColor: "text-emerald-700",
      features: ["Registration", "Franchise", "Renewal"],
      stats: "24/7 Online Application",
      statsIcon: <Globe className="w-4 h-4" />
    },
    {
      id: 3,
      title: "Building & Construction Permit",
      description: "Submit building plans, get construction permits, and schedule inspections online.",
      icon: <Building className="w-8 h-8" />,
      gradient: "from-orange-500 to-orange-600",
      bgColor: "bg-gradient-to-br from-amber-50 to-orange-100",
      borderColor: "border-amber-400",
      iconBg: "bg-gradient-to-br from-amber-500 to-orange-600",
      textColor: "text-amber-700",
      features: ["Building Plans", "Permits", "Clearances"],
      stats: "Digital Plan Submission",
      statsIcon: <Zap className="w-4 h-4" />
    },
    {
      id: 4,
      title: "Barangay Permit & Clearance",
      description: "Obtain barangay clearance, community permits, and local certifications quickly.",
      icon: <Home className="w-8 h-8" />,
      gradient: "from-red-500 to-red-600",
      bgColor: "bg-gradient-to-br from-rose-50 to-pink-100",
      borderColor: "border-rose-400",
      iconBg: "bg-gradient-to-br from-rose-500 to-pink-600",
      textColor: "text-rose-700",
      features: ["Clearance", "Certifications", "Community", "Local"],
      stats: "Issued in 24 hours",
      statsIcon: <Clock className="w-4 h-4" />
    }
  ];

  const features = [
    {
      icon: <Lock className="w-6 h-6" />,
      title: "Secure & Encrypted",
      description: "Bank-level security protection",
      gradient: "from-yellow-400 to-orange-500",
      iconBg: "bg-gradient-to-br from-yellow-400 to-orange-500"
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "24/7 Access",
      description: "Apply anytime, anywhere",
      gradient: "from-blue-400 to-blue-600",
      iconBg: "bg-gradient-to-br from-blue-400 to-blue-600"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Fast Processing",
      description: "Quick turnaround times",
      gradient: "from-green-400 to-green-600",
      iconBg: "bg-gradient-to-br from-green-400 to-green-600"
    }
  ];

  const stats = [
    { value: "50K+", label: "Active Users", icon: <Users className="w-5 h-5" /> },
    { value: "100K+", label: "Applications", icon: <FileText className="w-5 h-5" /> },
    { value: "99%", label: "Satisfaction", icon: <Award className="w-5 h-5" /> }
  ];

  const COLORS = {
    primary: '#4CAF50',
    secondary: '#4A90E2',
    accent: '#FDA811',
    background: '#FBFBFB',
    textmain: '#4D4A4A',
    border: '#E9E7E7'
  };

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: COLORS.background }}>
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-5">
        <div className="absolute top-0 left-0 w-full h-full" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, ${COLORS.border} 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}></div>
      </div>
      {/* Accent Shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 -right-20 w-80 h-80 rounded-full blur-3xl opacity-10" style={{ background: COLORS.primary }}></div>
        <div className="absolute bottom-40 -left-20 w-96 h-96 rounded-full blur-3xl opacity-10" style={{ background: COLORS.secondary }}></div>
        <div className="absolute top-1/2 right-1/3 w-64 h-64 rounded-full blur-3xl opacity-10" style={{ background: COLORS.accent }}></div>
      </div>
      {/* Header */}
      <header
        className={`sticky top-0 z-50 bg-white shadow-md transition-transform duration-300 ${
          isVisible ? "translate-y-0" : "-translate-y-full"
        }`}
        style={{ borderBottom: `4px solid ${COLORS.accent}` }}
      >
        <div className="px-6 md:px-12 lg:px-[50px] py-4 flex justify-between items-center">
          {/* LEFT: Logo + Title + Tagline */}
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center shadow-lg" style={{ border: `2px solid ${COLORS.border}` }}>
              <img
                src="/GSM_logo.png"
                alt="GoServePH Logo"
                className="w-11 h-11 object-contain"
              />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-2xl font-bold">
                <span style={{ color: COLORS.secondary }}>Go</span>
                <span style={{ color: COLORS.primary }}>Serve</span>
                <span style={{ color: COLORS.secondary }}>PH</span>
              </span>
              <span className="text-xs font-medium" style={{ color: COLORS.textmain }}>
                Serbisyong Publiko, Abot-Kamay Mo.
              </span>
            </div>
          </div>

          {/* RIGHT: Time & Login */}
          <div className="flex items-center gap-4">
            <div className="hidden md:block text-right text-sm mr-3" style={{ color: COLORS.textmain }}>
              <div className="font-bold text-base">{time.toLocaleTimeString()}</div>
              <div className="text-xs opacity-80">
                {time.toLocaleDateString(undefined, {
                  weekday: "long",
                  month: "short",
                  day: "numeric",
                })}
              </div>
            </div>
            <button
              onClick={handleLoginClick}
              className="px-6 py-2.5 rounded-lg font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              style={{ background: COLORS.primary }}
            >
              Sign In
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 px-6 md:px-12 lg:px-[50px] py-12 md:py-16">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center space-y-8 mb-16">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white rounded-full shadow-md" style={{ border: `2px solid ${COLORS.accent}` }}>
              <Award className="w-5 h-5" style={{ color: COLORS.accent }} />
              <span className="text-sm font-bold" style={{ color: COLORS.textmain }}>Trusted Government Service Platform</span>
            </div>

            <div className="space-y-6 max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight" style={{ color: COLORS.textmain }}>
                Permit & Licensing Made{" "}
                <span className="block mt-2" style={{ color: COLORS.primary }}>
                  Simple & Fast
                </span>
              </h1>
              <p className="text-lg md:text-xl leading-relaxed font-medium max-w-3xl mx-auto" style={{ color: COLORS.textmain, opacity: 0.8 }}>
                Transform your permit applications with our secure digital platform. Government services are now faster, simpler, and accessible at your fingertips.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {features.map((feature, index) => (
                <div 
                  key={index} 
                  className="bg-white rounded-2xl p-6 hover:shadow-2xl transition-all duration-300 hover:scale-105 group"
                  style={{ border: `2px solid ${COLORS.border}` }}
                >
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform" style={{ background: index === 0 ? COLORS.accent : index === 1 ? COLORS.secondary : COLORS.primary }}>
                    <div className="text-white">
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="font-bold text-lg mb-2" style={{ color: COLORS.textmain }}>
                    {feature.title}
                  </h3>
                  <p className="text-sm" style={{ color: COLORS.textmain, opacity: 0.7 }}>
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <div className="flex justify-center pt-4">
              <button
                onClick={handleLoginClick}
                className="group px-10 py-4 text-white rounded-xl font-bold hover:shadow-2xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3 shadow-lg"
                style={{ background: COLORS.primary }}
              >
                <UserPlus className="w-6 h-6" />
                <span className="text-lg">Get Started Now</span>
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-12 max-w-4xl mx-auto" style={{ borderTop: `2px solid ${COLORS.border}` }}>
              {stats.map((stat, index) => (
                <div key={index} className="text-center space-y-3">
                  <div className="flex items-center justify-center" style={{ color: COLORS.primary }}>
                    {stat.icon}
                  </div>
                  <div className="text-3xl md:text-4xl font-bold" style={{ color: COLORS.primary }}>
                    {stat.value}
                  </div>
                  <div className="text-sm font-semibold" style={{ color: COLORS.textmain, opacity: 0.7 }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Services Section */}
          <div className="space-y-8 mt-16">
            <div className="text-center">
              <div className="inline-flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg" style={{ background: COLORS.secondary }}>
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold" style={{ color: COLORS.textmain }}>
                  Our Services
                </h2>
              </div>
              <p className="text-lg" style={{ color: COLORS.textmain, opacity: 0.7 }}>
                Comprehensive digital solutions for all your permit needs
              </p>
            </div>

            {/* Service Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {services.map((service, idx) => {
                const bgColor = idx === 0 ? COLORS.secondary : idx === 1 ? COLORS.primary : idx === 2 ? COLORS.accent : '#E53935';
                return (
                  <div
                    key={service.id}
                    onMouseEnter={() => setActiveCard(service.id)}
                    onMouseLeave={() => setActiveCard(null)}
                    className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] cursor-pointer group"
                    style={{ border: `2px solid ${COLORS.border}` }}
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-16 h-16 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform flex-shrink-0" style={{ background: bgColor }}>
                        <div className="text-white">
                          {service.icon}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-xl mb-2 group-hover:underline" style={{ color: COLORS.textmain }}>
                          {service.title}
                        </h3>
                        <p className="text-sm leading-relaxed" style={{ color: COLORS.textmain, opacity: 0.7 }}>
                          {service.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm font-semibold mb-4 px-3 py-2 rounded-lg w-fit" style={{ background: `${bgColor}15`, color: bgColor, border: `1px solid ${bgColor}40` }}>
                      {service.statsIcon}
                      <span>{service.stats}</span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {service.features.map((feature, index) => (
                        <span
                          key={index}
                          className="px-3 py-1.5 rounded-lg text-xs font-medium hover:shadow-md transition-all duration-200"
                          style={{ background: COLORS.background, color: COLORS.textmain, border: `1px solid ${COLORS.border}` }}
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>

      {/* Footer (unchanged) */}
      <Footer />
    </div>
  );
}