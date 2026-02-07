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
  Users,
  Sparkles,
  BarChart3,
  ShieldCheck,
  Smartphone,
  CheckCircle2
} from "lucide-react";
import Footer from '../components/user/Footer';

export default function LandingPage() {
  const [time, setTime] = useState(new Date());
  const [isVisible, setIsVisible] = useState(true);
  const [activeCard, setActiveCard] = useState(null);
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate("/login");
  };

  const services = [
    {
      id: 1,
      title: "Business Permit Application",
      description: "Apply, renew, and manage your business permits online with streamlined processing and real-time status tracking.",
      icon: <FileText className="w-10 h-10" />,
      color: "#4A90E2",
      lightColor: "rgba(74, 144, 226, 0.1)",
      features: ["New Business", "Renewal", "Amendments", "Payment Tracking"],
      stats: "3-5 Days",
      statsLabel: "Processing Time",
      statsIcon: <TrendingUp className="w-5 h-5" />
    },
    {
      id: 2,
      title: "Transport & Franchise Permit",
      description: "Secure transport permits, vehicle registration, and franchise applications digitally with automated verification.",
      icon: <Car className="w-10 h-10" />,
      color: "#4CAF50",
      lightColor: "rgba(76, 175, 80, 0.1)",
      features: ["Registration", "Franchise", "Renewal", "E-Verification"],
      stats: "24/7",
      statsLabel: "Online Access",
      statsIcon: <Globe className="w-5 h-5" />
    },
    {
      id: 3,
      title: "Building & Construction Permit",
      description: "Submit building plans, get construction permits, and schedule inspections with digital plan submission.",
      icon: <Building className="w-10 h-10" />,
      color: "#FDA811",
      lightColor: "rgba(253, 168, 17, 0.1)",
      features: ["Building Plans", "Permits", "Inspections", "Clearances"],
      stats: "Digital",
      statsLabel: "Plan Submission",
      statsIcon: <Zap className="w-5 h-5" />
    },
    {
      id: 4,
      title: "Barangay Permit & Clearance",
      description: "Obtain barangay clearance, community permits, and local certifications with express processing options.",
      icon: <Home className="w-10 h-10" />,
      color: "#E53935",
      lightColor: "rgba(229, 57, 53, 0.1)",
      features: ["Clearance", "Certifications", "Community Permits", "ID Services"],
      stats: "24 Hours",
      statsLabel: "Fast Issuance",
      statsIcon: <Clock className="w-5 h-5" />
    }
  ];

  const features = [
    {
      icon: <ShieldCheck className="w-7 h-7" />,
      title: "Secure & Encrypted",
      description: "Bank-level security with 256-bit encryption",
      color: "#FDA811"
    },
    {
      icon: <Smartphone className="w-7 h-7" />,
      title: "24/7 Accessibility",
      description: "Apply anytime from any device",
      color: "#4A90E2"
    },
    {
      icon: <Zap className="w-7 h-7" />,
      title: "Fast Processing",
      description: "Quick turnaround with real-time updates",
      color: "#4CAF50"
    },
    {
      icon: <BarChart3 className="w-7 h-7" />,
      title: "Track Progress",
      description: "Monitor your application status live",
      color: "#E53935"
    }
  ];

  const stats = [
    { value: "50K+", label: "Active Users", sublabel: "Trusted by thousands", icon: <Users className="w-6 h-6" />, color: "#4A90E2" },
    { value: "100K+", label: "Applications", sublabel: "Successfully processed", icon: <FileText className="w-6 h-6" />, color: "#4CAF50" },
    { value: "99%", label: "Satisfaction", sublabel: "Customer rating", icon: <Award className="w-6 h-6" />, color: "#FDA811" },
    { value: "24/7", label: "Support", sublabel: "Always available", icon: <Clock className="w-6 h-6" />, color: "#E53935" }
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
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full opacity-30">
          <div className="absolute top-20 -right-32 w-96 h-96 bg-gradient-to-br from-blue-400 to-cyan-300 rounded-full blur-3xl opacity-30 animate-pulse"></div>
          <div className="absolute bottom-40 -left-32 w-[500px] h-[500px] bg-gradient-to-br from-green-400 to-emerald-300 rounded-full blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 right-1/4 w-80 h-80 bg-gradient-to-br from-amber-400 to-orange-300 rounded-full blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `linear-gradient(${COLORS.textmain} 1px, transparent 1px), linear-gradient(90deg, ${COLORS.textmain} 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}></div>
      </div>
      {/* Modern Header with Glassmorphism */}
      <header
        className={`sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b transition-all duration-300 ${
          isVisible ? "translate-y-0" : "-translate-y-full"
        }`}
        style={{ borderBottomColor: COLORS.accent, borderBottomWidth: '3px' }}
      >
        <div className="px-6 md:px-12 lg:px-20 py-5 flex justify-between items-center">
          {/* Logo & Branding */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl blur opacity-40"></div>
              <div className="relative w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-xl border-2 border-white/50">
                <img
                  src="/GSM_logo.png"
                  alt="GoServePH Logo"
                  className="w-12 h-12 object-contain"
                />
              </div>
            </div>
            <div className="flex flex-col leading-tight">
              <div className="text-2xl font-bold tracking-tight">
                <span style={{ color: COLORS.secondary }}>Go</span>
                <span style={{ color: COLORS.primary }}>Serve</span>
                <span style={{ color: COLORS.secondary }}>PH</span>
              </div>
              <span className="text-xs font-semibold text-gray-600">
                Serbisyong Publiko, Abot-Kamay Mo.
              </span>
            </div>
          </div>

          {/* Time & Actions */}
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-3 px-4 py-2.5 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200">
              <Clock className="w-5 h-5 text-gray-600" />
              <div className="text-right">
                <div className="font-bold text-sm text-gray-800">{time.toLocaleTimeString()}</div>
                <div className="text-xs text-gray-500">
                  {time.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })}
                </div>
              </div>
            </div>
            <button
              onClick={handleLoginClick}
              className="group relative px-8 py-3 rounded-xl font-bold text-white overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-105"
              style={{ background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary})` }}
            >
              <span className="relative z-10 flex items-center gap-2">
                <UserPlus className="w-5 h-5" />
                Sign In
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 translate-x-full group-hover:translate-x-[-200%] transition-transform duration-700"></div>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 px-6 md:px-12 lg:px-20 py-16 md:py-20">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section - Enhanced */}
          <div className="text-center space-y-12 mb-24">
            {/* Animated Badge */}
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/90 backdrop-blur-sm rounded-full shadow-xl border-2 border-amber-200 hover:scale-105 transition-transform duration-300">
              <Sparkles className="w-5 h-5 text-amber-500 animate-pulse" />
              <span className="text-sm font-bold bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
                Trusted Government Service Platform
              </span>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </div>

            {/* Hero Title */}
            <div className="space-y-8 max-w-5xl mx-auto">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-tight tracking-tight">
                <span className="bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  Permit & Licensing
                </span>
                <br />
                <span className="bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent animate-gradient">
                  Made Simple & Fast
                </span>
              </h1>
              <p className="text-lg md:text-2xl leading-relaxed font-medium max-w-4xl mx-auto text-gray-600">
                Transform your permit applications with our secure digital platform.
                <span className="block mt-2 text-xl text-gray-500">
                  Government services are now faster, simpler, and accessible 24/7.
                </span>
              </p>
            </div>

            {/* Features Grid - Enhanced */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {features.map((feature, index) => (
                <div 
                  key={index} 
                  className="group relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-200 hover:border-gray-300"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-50 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative">
                    <div 
                      className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg"
                      style={{ background: `linear-gradient(135deg, ${feature.color}, ${feature.color}dd)` }}
                    >
                      <div className="text-white">
                        {feature.icon}
                      </div>
                    </div>
                    <h3 className="font-bold text-lg mb-3 text-gray-800 group-hover:text-gray-900">
                      {feature.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-gray-600">
                      {feature.description}
                    </p>
                    <div className="absolute top-0 right-0 w-20 h-20 rounded-full blur-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-500" style={{ background: feature.color }}></div>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Button - Enhanced */}
            <div className="flex justify-center pt-8">
              <button
                onClick={handleLoginClick}
                className="group relative px-12 py-5 text-white rounded-2xl font-bold overflow-hidden transition-all duration-500 hover:shadow-2xl hover:scale-105 flex items-center justify-center gap-4"
                style={{ background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary})` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                <UserPlus className="w-7 h-7 relative z-10 group-hover:rotate-12 transition-transform" />
                <span className="text-xl relative z-10">Get Started Now</span>
                <ArrowRight className="w-7 h-7 relative z-10 group-hover:translate-x-2 transition-transform" />
              </button>
            </div>

            {/* Stats - Enhanced */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-16 max-w-6xl mx-auto">
              {stats.map((stat, index) => (
                <div 
                  key={index} 
                  className="group relative bg-white/70 backdrop-blur-sm rounded-3xl p-8 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-200"
                >
                  <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: `linear-gradient(135deg, ${stat.color}10, ${stat.color}05)` }}></div>
                  <div className="relative text-center space-y-4">
                    <div className="flex items-center justify-center mb-3">
                      <div className="w-14 h-14 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg" style={{ background: `linear-gradient(135deg, ${stat.color}, ${stat.color}dd)` }}>
                        <div className="text-white">
                          {stat.icon}
                        </div>
                      </div>
                    </div>
                    <div className="text-4xl md:text-5xl font-black" style={{ color: stat.color }}>
                      {stat.value}
                    </div>
                    <div className="space-y-1">
                      <div className="text-base font-bold text-gray-800">
                        {stat.label}
                      </div>
                      <div className="text-xs text-gray-500">
                        {stat.sublabel}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Services Section - Enhanced */}
          <div className="space-y-12 mt-32">
            <div className="text-center space-y-6">
              <div className="inline-flex items-center gap-4 mb-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl blur opacity-40"></div>
                  <div className="relative w-16 h-16 rounded-2xl flex items-center justify-center shadow-xl" style={{ background: `linear-gradient(135deg, ${COLORS.secondary}, ${COLORS.primary})` }}>
                    <FileText className="w-8 h-8 text-white" />
                  </div>
                </div>
                <h2 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  Our Services
                </h2>
              </div>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
               Wide ranging digital solutions for all your permit needs with streamlined processing and real-time tracking
              </p>
            </div>

            {/* Service Cards Grid - Enhanced */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {services.map((service) => (
                <div
                  key={service.id}
                  onMouseEnter={() => setActiveCard(service.id)}
                  onMouseLeave={() => setActiveCard(null)}
                  className="group relative bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-200 overflow-hidden"
                >
                  {/* Hover Gradient Background */}
                  <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ background: `linear-gradient(135deg, ${service.lightColor}, transparent)` }}
                  ></div>
                  
                  {/* Content */}
                  <div className="relative">
                    <div className="flex items-start gap-6 mb-6">
                      {/* Icon */}
                      <div className="relative flex-shrink-0">
                        <div className="absolute inset-0 rounded-2xl blur-lg opacity-50 group-hover:opacity-70 transition-opacity" style={{ background: service.color }}></div>
                        <div 
                          className="relative w-20 h-20 rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500"
                          style={{ background: `linear-gradient(135deg, ${service.color}, ${service.color}dd)` }}
                        >
                          <div className="text-white">
                            {service.icon}
                          </div>
                        </div>
                      </div>

                      {/* Title & Description */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-black text-2xl mb-3 text-gray-800 group-hover:text-gray-900" style={{ color: service.color }}>
                          {service.title}
                        </h3>
                        <p className="text-sm leading-relaxed text-gray-600">
                          {service.description}
                        </p>
                      </div>
                    </div>

                    {/* Stats Badge */}
                    <div 
                      className="inline-flex items-center gap-3 px-5 py-3 rounded-2xl mb-6 shadow-md group-hover:shadow-lg transition-all"
                      style={{ background: service.lightColor, border: `2px solid ${service.color}20` }}
                    >
                      <div style={{ color: service.color }}>
                        {service.statsIcon}
                      </div>
                      <div className="text-left">
                        <div className="text-xs font-semibold text-gray-600">{service.statsLabel}</div>
                        <div className="text-lg font-black" style={{ color: service.color }}>{service.stats}</div>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="flex flex-wrap gap-2.5">
                      {service.features.map((feature, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-white/80 backdrop-blur-sm text-gray-700 border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-300 hover:scale-105"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" style={{ color: service.color }} />
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Corner Decoration */}
                  <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500" style={{ background: service.color }}></div>
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