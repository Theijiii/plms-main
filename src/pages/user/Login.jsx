import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import Swal from 'sweetalert2';
import Footer from '../../components/user/Footer';
import { sendOtp, verifyOtp, registerUser, loginUser, getUserProfile } from "../../services/AuthService";

export default function Login() {
  const [pendingRegistration, setPendingRegistration] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [time, setTime] = useState(new Date());
  const [isVisible, setIsVisible] = useState(true);
  
  // Modal states
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  
  // OTP states
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpError, setOtpError] = useState("");
  const [otpSuccess, setOtpSuccess] = useState("");
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [loginData, setLoginData] = useState(null);
  const [otpContext, setOtpContext] = useState(null); // 'login' | 'register'
  const [otpTargetEmail, setOtpTargetEmail] = useState("");

  const [registerForm, setRegisterForm] = useState({
    firstName: "",
    lastName: "",
    middleName: "",
    suffix: "",
    birthdate: "",
    regEmail: "",
    mobile: "",
    address: "",
    houseNumber: "",
    street: "",
    barangay: "",
    regPassword: "",
    confirmPassword: ""
  });
  const [noMiddleName, setNoMiddleName] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  
  const navigate = useNavigate();

  // Update current time
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Countdown timer for OTP resend
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

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

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!username || !password) {
      setError("Please enter both username/email and password.");
      return;
    }

    try {
      const response = await loginUser({ email: username, password });

      if (response.success) {
        setSuccess("Login successful! Sending OTP...");
        setLoginData({ username, token: response.token });

        const otpResponse = await sendOtp(username, "login");

        if (!otpResponse.success) {
          setLoginData(null);
          setError(otpResponse.message || "Failed to send OTP. Please try again.");
          setSuccess("");
          return;
        }

        setOtpContext("login");
        setOtpTargetEmail(username);
        setOtp(["", "", "", "", "", ""]);
        setOtpError("");
        setOtpSuccess("");
        setShowOtpModal(true);
        setCountdown(30);
        setSuccess("");
      } else {
        setError(response.message || "Invalid username/email or password.");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred while logging in. Please try again.");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      // Initialize Google OAuth - use environment variable or fallback
      const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '888986438781-nrfbgrlpdd4an80gpsk5sdtrc5f14bmn.apps.googleusercontent.com';
      
      // Create Google OAuth URL
      const redirectUri = window.location.origin + '/auth/google/callback';
      const scope = 'email profile';
      const responseType = 'code';
      const accessType = 'offline';
      const prompt = 'consent';
      
      const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
        `client_id=${clientId}&` +
        `redirect_uri=${encodeURIComponent(redirectUri)}&` +
        `response_type=${responseType}&` +
        `scope=${encodeURIComponent(scope)}&` +
        `access_type=${accessType}&` +
        `prompt=${prompt}`;
      
      // Redirect to Google OAuth
      window.location.href = googleAuthUrl;
    } catch (error) {
      console.error('Google login error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Google Login Failed',
        text: 'Unable to connect to Google. Please try again.',
        confirmButtonColor: '#4CAF50'
      });
    }
  };

  const handleRegisterClick = () => {
    setShowRegisterModal(true);
  };

  const handleCloseRegisterModal = () => {
    setShowRegisterModal(false);
    setRegisterForm({
      firstName: "",
      lastName: "",
      middleName: "",
      suffix: "",
      birthdate: "",
      regEmail: "",
      mobile: "",
      address: "",
      houseNumber: "",
      street: "",
      barangay: "",
      regPassword: "",
      confirmPassword: ""
    });
    setNoMiddleName(false);
    setAgreeTerms(false);
    setAgreePrivacy(false);
    setPendingRegistration(null);
  };

  const handleOpenTerms = () => {
    Swal.fire({
      title: 'GoServePH Terms of Service Agreement',
      html: `
        <div style="text-align: left; max-height: 400px; overflow-y: auto; padding: 10px;">
          <p><strong>Welcome to GoServePH!</strong></p>
          <p>This GoServePH Services Agreement ("Agreement") is a binding legal contract for the use of our software systems—which handle data input, monitoring, processing, and analytics—("Services") between GoServePH ("us," "our," or "we") and you, the registered user ("you" or "user").</p>
          <p>By accessing or using any GoServePH Services, you agree to these terms. If you don't understand any part of this Agreement, please contact us at info@goserveph.com.</p>
          <h4 style="font-weight: bold; margin-top: 10px;">SECTION A: GENERAL TERMS</h4>
          <p><strong>1. Your Account and Registration</strong></p>
          <p>To use our Services, you must create an Account. We reserve the right to review and approve your application. Only businesses and entities based in the Philippines are eligible.</p>
          <p><strong>2. Services and Support</strong></p>
          <p>We provide support for general account inquiries and System Errors through our Ticketing System and Documentation.</p>
          <p><strong>3. Service Rules and Restrictions</strong></p>
          <p>You must use the Services lawfully and comply with all Philippine laws. Prohibited activities include accessing non-public systems, copying or reselling Services, and interfering with normal operation.</p>
          <p><strong>4. Termination</strong></p>
          <p>This Agreement continues until terminated by you or us. We may suspend or terminate your Account for violations or legal requirements.</p>
          <h4 style="font-weight: bold; margin-top: 10px;">SECTION B: TECHNOLOGY</h4>
          <p>We provide access to the web system and mobile application. You retain ownership of your data. GoServePH exclusively owns all system IP, patents, copyrights, and trademarks.</p>
          <h4 style="font-weight: bold; margin-top: 10px;">SECTION C: PAYMENT TERMS</h4>
          <p>Service fees are charged as described on our website. All payments must be settled via PayPal.</p>
          <h4 style="font-weight: bold; margin-top: 10px;">SECTION D: DATA PRIVACY</h4>
          <p>Data security is our top priority. We use Data to provide Services and improve systems. We do not share Personal Data for marketing purposes.</p>
          <h4 style="font-weight: bold; margin-top: 10px;">SECTION E: LEGAL TERMS</h4>
          <p>We provide Services "AS IS" without warranties. We are not liable for indirect, incidental, or consequential damages.</p>
          <p style="margin-top: 10px;"><em>For full terms, please visit our website or contact us at info@goserveph.com</em></p>
        </div>
      `,
      width: '600px',
      confirmButtonText: 'I Understand',
      confirmButtonColor: '#4CAF50',
      customClass: {
        popup: 'terms-modal'
      }
    });
  };

  const handleOpenPrivacy = () => {
    Swal.fire({
      title: 'GoServePH Data Privacy Policy',
      html: `
        <div style="text-align: left; max-height: 400px; overflow-y: auto; padding: 10px;">
          <p><strong>Protecting the information you handle through our system is our highest priority.</strong></p>
          <h4 style="font-weight: bold; margin-top: 10px;">1. How We Define and Use Data</h4>
          <p><strong>Personal Data:</strong> Information that can identify a specific person.</p>
          <p><strong>User Data:</strong> Information about your business operations.</p>
          <p><strong>GoServePH Data:</strong> Transaction details and platform activity.</p>
          <p>We analyze data only to provide Services, detect fraud, and improve our systems. We will not sell or share Personal Data for marketing purposes.</p>
          <h4 style="font-weight: bold; margin-top: 10px;">2. Data Protection and Compliance</h4>
          <p><strong>Confidentiality:</strong> We commit to using Data only as permitted. We will only disclose Data when legally required.</p>
          <p><strong>Privacy Compliance:</strong> You must comply with Philippine Data Privacy Act of 2012. You are responsible for obtaining consents from End-Users.</p>
          <p><strong>Data Processing Roles:</strong> You are the Data Controller. We are the Data Intermediary.</p>
          <h4 style="font-weight: bold; margin-top: 10px;">3. Account Deactivation</h4>
          <p>To remove your information, use the 'Deactivate Account' button in your profile. Personal Identifying Information will be deleted, but transactional records are retained for legal purposes.</p>
          <h4 style="font-weight: bold; margin-top: 10px;">4. Security Controls</h4>
          <p>We implement reasonable security measures. You must also implement your own security controls including firewalls, anti-virus, and data handling protocols.</p>
          <p style="margin-top: 10px;"><em>For complete privacy policy, visit our website or contact us.</em></p>
        </div>
      `,
      width: '600px',
      confirmButtonText: 'I Understand',
      confirmButtonColor: '#4CAF50',
      customClass: {
        popup: 'privacy-modal'
      }
    });
  };

  const handleFooterTerms = () => handleOpenTerms();
  const handleFooterPrivacy = () => handleOpenPrivacy();

  // Handle input changes
  const handleRegisterInputChange = (e) => {
    const { name, value } = e.target;
    setRegisterForm(prev => ({ ...prev, [name]: value }));
  };

  const handleNoMiddleNameChange = (e) => {
    setNoMiddleName(e.target.checked);
    setRegisterForm(prev => ({
      ...prev,
      middleName: e.target.checked ? "N/A" : ""
    }));
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();

    if (!agreeTerms || !agreePrivacy) {
      Swal.fire({
        icon: 'warning',
        title: 'Agreement Required',
        text: 'Please agree to both Terms of Service and Privacy Policy',
        confirmButtonColor: '#4CAF50'
      });
      return;
    }

    if (!registerForm.firstName || !registerForm.lastName || !registerForm.regEmail || !registerForm.regPassword) {
      Swal.fire({
        icon: 'warning',
        title: 'Required Fields',
        text: 'Please fill in all required fields',
        confirmButtonColor: '#4CAF50'
      });
      return;
    }

    if (registerForm.regPassword !== registerForm.confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Password Mismatch',
        text: 'Passwords do not match',
        confirmButtonColor: '#4CAF50'
      });
      return;
    }

    try {
      // SEND OTP
      const otpResponse = await sendOtp(registerForm.regEmail, "register");

      if (!otpResponse.success) {
        Swal.fire({
          icon: 'error',
          title: 'OTP Error',
          text: otpResponse.message || 'Failed to send OTP',
          confirmButtonColor: '#4CAF50'
        });
        return;
      }

      // Open OTP modal and track context
      setOtpContext("register");
      setOtpTargetEmail(registerForm.regEmail);
      setOtp(["", "", "", "", "", ""]);
      setOtpError("");
      setOtpSuccess("");
      setShowOtpModal(true);
      setCountdown(30);

      // Save registration data temporarily until OTP is verified
      setPendingRegistration({
        email: registerForm.regEmail,
        password: registerForm.regPassword,
        firstName: registerForm.firstName,
        lastName: registerForm.lastName,
        middleName: noMiddleName ? "N/A" : registerForm.middleName,
        suffix: registerForm.suffix,
        birthdate: registerForm.birthdate,
        mobile_number: registerForm.mobile,
        house_number: registerForm.houseNumber,
        street: registerForm.street,
        barangay: registerForm.barangay,
        city_municipality: "Default City", // You might want to make these dynamic
        province: "Default Province",
        region: "Default Region",
        zip_code: null
      });
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'An error occurred while sending OTP',
        confirmButtonColor: '#4CAF50'
      });
    }
  };

  // OTP Input Handlers
  const handleOtpChange = (index, value) => {
    if (!/^\d?$/.test(value)) return; // Only allow numbers
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    const pastedNumbers = pastedData.replace(/\D/g, '').split('').slice(0, 6);
    
    if (pastedNumbers.length === 6) {
      const newOtp = [...otp];
      pastedNumbers.forEach((num, index) => {
        newOtp[index] = num;
      });
      setOtp(newOtp);
      
      // Focus last input
      const lastInput = document.getElementById(`otp-5`);
      if (lastInput) lastInput.focus();
    }
  };

  const finalizeLogin = () => {
    if (!loginData?.token) {
      setOtpError("Login session expired. Please login again.");
      return;
    }

    const { token, username: loginEmail } = loginData;

    // Store under the key your header expects
    localStorage.setItem("auth_token", token); // <-- must match UserHeader
    localStorage.setItem("email", loginEmail);

    closeOtpModal();
    navigate("/user/dashboard");
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setOtpError("");
    setOtpSuccess("");

    const otpString = otp.join("");

    if (otpString.length !== 6) {
      setOtpError("Please enter the complete 6-digit OTP.");
      return;
    }

    if (!otpContext || !otpTargetEmail) {
      setOtpError("No OTP request in progress. Please try again.");
      return;
    }

    try {
      // Call OTP verification API
      const response = await verifyOtp(otpTargetEmail, otpString, otpContext);
      
      console.log("🔐 [OTP API Response]:", response);
      
      if (!response.success) {
        setOtpError(response.message || "Invalid OTP");
        return;
      }

      setOtpSuccess("OTP verified successfully!");
      
      // ✅ CRITICAL: If this is registration, complete the registration process
      if (otpContext === "register" && pendingRegistration) {
        console.log("📝 Starting registration process with data:", pendingRegistration);
        
        // Call the registerUser function to save data to database
        const registerResponse = await registerUser(pendingRegistration);
        
        console.log("📝 [Registration API Response]:", registerResponse);
        
        if (!registerResponse.success) {
          setOtpError(registerResponse.message || "Registration failed after OTP verification");
          return;
        }
        
        // Registration successful - save auth data
        localStorage.setItem("auth_token", registerResponse.token || response.token || "dummy_token");
        localStorage.setItem("goserveph_role", "user");
        localStorage.setItem("goserveph_email", otpTargetEmail);
        localStorage.setItem("email", otpTargetEmail);
        
        // Save user profile data if returned
        if (registerResponse.first_name) {
          localStorage.setItem("first_name", registerResponse.first_name);
        }
        if (registerResponse.last_name) {
          localStorage.setItem("last_name", registerResponse.last_name);
        }
        if (registerResponse.full_name) {
          localStorage.setItem("full_name", registerResponse.full_name);
          localStorage.setItem("display_name", registerResponse.full_name);
        }
        
        if (registerResponse.user_id) {
          localStorage.setItem("goserveph_user_id", registerResponse.user_id);
        }
        
        setOtpSuccess("Registration successful! Redirecting to dashboard...");
        
        closeOtpModal();
        
        // Redirect to user dashboard
        setTimeout(() => {
          navigate("/user/dashboard");
        }, 1000);
        
        return;
      }
      
      // If it's login OTP verification, continue with existing logic
      if (otpContext === "login") {
        // ... existing login logic ...
        
        // CRITICAL: Save department for admin routing
        console.log("✅ Saving department data:", response.department);
        
        // Store ALL authentication data
        localStorage.setItem("auth_token", response.token || "dummy_token");
        localStorage.setItem("goserveph_role", response.role || "user");
        localStorage.setItem("goserveph_email", otpTargetEmail);
        localStorage.setItem("email", otpTargetEmail);
        
        // THIS IS THE KEY: Save department if it exists
        if (response.department) {
          localStorage.setItem("goserveph_department", response.department);
          console.log("✅ Department saved:", response.department);
        } else if (response.isAdmin) {
          // If isAdmin is true but department is not set, assign based on email
          const department = getDepartmentFromEmail(otpTargetEmail);
          if (department) {
            localStorage.setItem("goserveph_department", department);
            console.log("✅ Department assigned from email:", department);
          }
        }
        
        if (response.user_id) {
          localStorage.setItem("goserveph_user_id", response.user_id);
        }
        
        if (response.name) {
          localStorage.setItem("goserveph_name", response.name);
          sessionStorage.setItem("admin_name", response.name);
        }
        
        // Also store department in sessionStorage for AdminSidebar
        if (response.department) {
          sessionStorage.setItem("admin_department", response.department);
        }
        
        // Debug what was saved
        console.log("🔍 After login - localStorage:", {
          role: localStorage.getItem("goserveph_role"),
          department: localStorage.getItem("goserveph_department"),
          email: localStorage.getItem("goserveph_email")
        });
        
        closeOtpModal();
        
        // Redirect based on role
        setTimeout(() => {
          if (response.role === "admin") {
            navigate("/admin/dashboard");
          } else {
            navigate("/user/dashboard");
          }
        }, 300);
      }
      
    } catch (err) {
      console.error(err);
      setOtpError("Network error while verifying OTP");
    }
  };

  // Helper function to get department from email
  function getDepartmentFromEmail(email) {
    const emailToDepartment = {
      'superadmin@eplms.com': 'super',
      'businessadmin@eplms.com': 'business',
      'buildingadmin@eplms.com': 'building',
      'barangaystaff@eplms.com': 'barangay',
      'transportadmin@eplms.com': 'transport',
      'admin@eplms.com': 'super'
    };
    return emailToDepartment[email.toLowerCase()] || null;
  }

  const handleResendOtp = async () => {
    if (countdown > 0 || !otpTargetEmail || !otpContext) return;
    if (otpContext === "register" && !pendingRegistration?.email) return;

    setIsResending(true);
    setOtpError("");
    setOtpSuccess("Resending OTP...");

    try {
      const otpResponse = await sendOtp(otpTargetEmail, otpContext);

      if (!otpResponse.success) {
        setOtpError(otpResponse.message || "Failed to resend OTP");
      } else {
        setOtpSuccess("New OTP has been sent to your email.");
        setOtp(["", "", "", "", "", ""]);
        setCountdown(30);
      }
    } catch (err) {
      setOtpError("Network error while resending OTP");
    }

    setIsResending(false);
  };

  const closeOtpModal = () => {
    setShowOtpModal(false);
    setOtp(["", "", "", "", "", ""]);
    setOtpError("");
    setOtpSuccess("");
    setLoginData(null);
    setOtpContext(null);
    setOtpTargetEmail("");
    setCountdown(0);
    setIsResending(false);
    setPendingRegistration(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 relative overflow-hidden">
      {/* Background Image with Low Opacity */}
      <div className="fixed inset-0 z-0 bg-[url('/GovServePH.png')] bg-center bg-contain bg-no-repeat opacity-15"></div>

      {/* Animated Background Particles */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(76,175,80,0.1)_0%,transparent_50%),radial-gradient(circle_at_80%_20%,rgba(74,144,226,0.1)_0%,transparent_50%),radial-gradient(circle_at_40%_40%,rgba(253,168,17,0.05)_0%,transparent_50%)] animate-pulse"></div>
      </div>

      {/* Header */}
      <header
        className={`sticky top-0 z-50 bg-white shadow-sm border-b-4 border-[#FDA811] transition-transform duration-300 ${
          isVisible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="container mx-auto px-6 py-3 flex justify-between items-center">
          {/* LEFT: Logo + Title + Tagline + Back Button */}
          <div className="flex items-center gap-3">
            
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
              <img
                src="/GSM_logo.png"
                alt="Logo"
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

          {/* RIGHT: Time and Date */}
          <div className="text-right text-sm text-gray-800">
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
      </header>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-6 py-8 flex-1">
                            {/* Back Button */}
<button
  onClick={() => navigate(-1)}
  className="px-4 py-2 bg-[#4CAF50] text-white rounded-md hover:bg-[#45a049] transition-colors duration-300 border border-[#3d8b40] shadow-sm hover:shadow-md mr-2 flex items-center gap-2"
  aria-label="Go back"
>
  <ArrowLeft className="w-5 h-5" />
  <span>Back</span>
</button>
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
          
          {/* Left Section - Features */}
          <div className="text-center lg:text-left space-y-6">
            <h2 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 via-green-600 to-blue-600 bg-clip-text text-transparent bg-size-600 animate-gradient">
              Abot-Kamay mo ang Serbisyong Publiko!
            </h2>
            <p className="text-lg text-gray-600 max-w-lg mx-auto lg:mx-0 leading-relaxed">
              Access government services conveniently through our digital platform. 
              Fast, secure, and reliable public service at your fingertips.
            </p>
          </div>

          {/* Right Section - Login Form */}
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl p-8 max-w-md mx-auto w-full border border-white/20 hover:shadow-2xl transition-all duration-300 hover:translate-y-[-4px]">
            <div className="text-center mb-8 space-y-2">
              <h2 className="text-2xl font-bold text-gray-900">Mag-login</h2>
              <p className="text-gray-600 text-sm">Punan ang mga kailangan impormasyon upang ma-access ang iyong account</p>
            </div>

            <form className="space-y-6" onSubmit={handleLoginSubmit}>
              <div>
                <input 
                  type="text" 
                  id="username" 
                  name="username" 
                  placeholder="Ilagay ang iyong username o email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              
              <div>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    id="password" 
                    name="password" 
                    placeholder="Ilagay ang iyong password"
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-600 transition-colors"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Error/Success Messages */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}
              {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
                  {success}
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    Tandaan ako
                  </label>
                </div>
                <div className="text-sm">
                  <a href="#" className="font-medium text-blue-600 hover:text-blue-800 transition-colors">
                    Nakalimutan ang password?
                  </a>
                </div>
              </div>
              
              <button 
                type="submit" 
                className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Mag-login
              </button>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">O</span>
                </div>
              </div>
              
              <div>
                <button 
                  type="button" 
                  className="w-full bg-white border border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
                  onClick={handleGoogleLogin}
                >
                  <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"/>
                  </svg>
                  <span>Magpatuloy gamit ang Google</span>
                </button>
              </div>
              
              <div className="text-center">
                <p className="text-gray-600 text-sm">
                  Wala pang account? 
                  <button 
                    type="button" 
                    className="text-blue-600 hover:text-blue-800 font-semibold ml-1 transition-colors"
                    onClick={handleRegisterClick}
                  >
                    Mag-register dito
                  </button>
                </p>
              </div>
            </form>

            {/* Security Features */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="p-4 rounded-lg border bg-blue-50 border-blue-200">
                <h3 className="text-sm font-medium mb-2 text-blue-800">Mga Paalala sa Seguridad:</h3>
                <ul className="text-xs space-y-1 text-blue-700">
                  <li>• Siguraduhing tama ang impormasyong ilalagay</li>
                  <li>• Huwag ibahagi ang iyong password sa iba</li>
                  <li>• Kung may problema, tumawag sa IT Department</li>
                  <li>• Account ay maaaring ma-lock pagkatapos ng 5 failed attempts</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Registration Modal */}
      {showRegisterModal && (
        <div className="fixed inset-0 bg-black/40 flex items-start justify-center pt-20 px-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-[10px] shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden">

            {/* HEADER – fixed, full-width, clean */}
            <div className="sticky top-0 w-full bg-white/95 backdrop-blur border-b border-gray-200 px-6 py-4 text-center z-10">
              <h2 className="text-xl md:text-2xl font-semibold text-green-600">
                Create your GoServePH account
              </h2>
            </div>

            {/* FORM AREA */}
            <form 
              id="registerForm" 
              className="space-y-5 p-6 overflow-y-auto max-h-[calc(80vh-60px)]" 
              onSubmit={handleRegisterSubmit}
            >

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1">First Name<span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    name="firstName" 
                    required 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    value={registerForm.firstName}
                    onChange={handleRegisterInputChange}
                  />
                </div>

                <div>
                  <label className="block text-sm mb-1">Last Name<span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    name="lastName" 
                    required 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    value={registerForm.lastName}
                    onChange={handleRegisterInputChange}
                  />
                </div>

                <div>
                  <label className="block text-sm mb-1">Middle Name<span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    id="middleName" 
                    name="middleName" 
                    required 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    value={registerForm.middleName}
                    onChange={handleRegisterInputChange}
                    disabled={noMiddleName}
                  />
                  <label className="inline-flex items-center mt-2 text-sm">
                    <input 
                      type="checkbox" 
                      id="noMiddleName" 
                      className="mr-2"
                      checked={noMiddleName}
                      onChange={handleNoMiddleNameChange}
                    /> 
                    No middle name
                  </label>
                </div>

                <div>
                  <label className="block text-sm mb-1">Suffix</label>
                  <input 
                    type="text" 
                    name="suffix" 
                    placeholder="Jr., Sr., III (optional)" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    value={registerForm.suffix}
                    onChange={handleRegisterInputChange}
                  />
                </div>

                <div>
                  <label className="block text-sm mb-1">Birthdate<span className="text-red-500">*</span></label>
                  <input 
                    type="date" 
                    name="birthdate" 
                    required 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    value={registerForm.birthdate}
                    onChange={handleRegisterInputChange}
                  />
                </div>

                <div>
                  <label className="block text-sm mb-1">Email Address<span className="text-red-500">*</span></label>
                  <input 
                    type="email" 
                    name="regEmail" 
                    required 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    value={registerForm.regEmail}
                    onChange={handleRegisterInputChange}
                  />
                </div>

                <div>
                  <label className="block text-sm mb-1">Mobile Number<span className="text-red-500">*</span></label>
                  <input 
                    type="tel" 
                    name="mobile" 
                    required 
                    placeholder="09XXXXXXXXX"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    value={registerForm.mobile}
                    onChange={handleRegisterInputChange}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm mb-1">Address<span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    name="address" 
                    required 
                    placeholder="Lot/Unit, Building, Subdivision"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    value={registerForm.address}
                    onChange={handleRegisterInputChange}
                  />
                </div>

                <div>
                  <label className="block text-sm mb-1">House #<span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    name="houseNumber" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    value={registerForm.houseNumber}
                    onChange={handleRegisterInputChange}
                  />
                </div>

                <div>
                  <label className="block text-sm mb-1">Street<span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    name="street" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    value={registerForm.street}
                    onChange={handleRegisterInputChange}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm mb-1">Barangay<span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    name="barangay" 
                    required 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    value={registerForm.barangay}
                    onChange={handleRegisterInputChange}
                  />
                </div>

                <div>
                  <label className="block text-sm mb-1">Password<span className="text-red-500">*</span></label>
                  <div className="relative">
                    <input 
                      type={showRegPassword ? "text" : "password"}
                      id="regPassword" 
                      name="regPassword" 
                      minLength="10" 
                      required 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg pr-10"
                      value={registerForm.regPassword}
                      onChange={handleRegisterInputChange}
                    />
                    <button 
                      type="button" 
                      className="absolute inset-y-0 right-0 px-3 text-gray-500 hover:text-blue-600 transition-colors"
                      onClick={() => setShowRegPassword(!showRegPassword)}
                      aria-label="Toggle password visibility"
                    >
                      {showRegPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm mb-1">Confirm Password<span className="text-red-500">*</span></label>
                  <div className="relative">
                    <input 
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword" 
                      name="confirmPassword" 
                      minLength="10" 
                      required 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg pr-10"
                      value={registerForm.confirmPassword}
                      onChange={handleRegisterInputChange}
                    />
                    <button 
                      type="button" 
                      className="absolute inset-y-0 right-0 px-3 text-gray-500 hover:text-blue-600 transition-colors"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      aria-label="Toggle password visibility"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Terms & Privacy */}
              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <label className="inline-flex items-center">
                    <input 
                      type="checkbox" 
                      id="agreeTerms" 
                      className="mr-2" 
                      required
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                    />
                    <span>I have read, understood, and agreed to the</span>
                  </label>
                  <button 
                    type="button" 
                    className="ml-2 text-green-600 hover:underline"
                    onClick={handleOpenTerms}
                  >
                    Terms of Use
                  </button>
                </div>

                <div className="flex items-center text-sm">
                  <label className="inline-flex items-center">
                    <input 
                      type="checkbox" 
                      id="agreePrivacy" 
                      className="mr-2" 
                      required
                      checked={agreePrivacy}
                      onChange={(e) => setAgreePrivacy(e.target.checked)}
                    />
                    <span>I have read, understood, and agreed to the</span>
                  </label>
                  <button 
                    type="button" 
                    className="ml-2 text-green-600 hover:underline"
                    onClick={handleOpenPrivacy}
                  >
                    Data Privacy Policy
                  </button>
                </div>

                <p className="text-xs text-gray-600">
                  By clicking on the register button below, I hereby agree to both the Terms of Use and Data Privacy Policy
                </p>
              </div>

              {/* Buttons */}
              <div className="flex justify-end space-x-3 pt-2">
                <button 
                  type="button" 
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                  onClick={handleCloseRegisterModal}
                >
                  Cancel
                </button>

                <button 
                  type="submit" 
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Register
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* OTP Verification Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="px-6 py-4 border-b flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">OTP Verification</h3>
              <button 
                type="button" 
                className="text-gray-500 hover:text-gray-700 transition-colors"
                onClick={closeOtpModal}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="px-6 py-6 space-y-6">
              <div className="text-center space-y-3">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h4 className="text-lg font-semibold text-gray-900">Enter Verification Code</h4>
                <p className="text-gray-600 text-sm">
                  Your verification code has been sent to your email address. Enter the 6-digit code here.
                </p>
              </div>

              <form onSubmit={handleOtpSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    6-Digit OTP Code
                  </label>
                  <div className="flex justify-between space-x-2">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        id={`otp-${index}`}
                        type="text"
                        inputMode="numeric"
                        maxLength="1"
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        onPaste={handleOtpPaste}
                        className="w-12 h-12 text-center text-lg font-semibold border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                        autoFocus={index === 0}
                      />
                    ))}
                  </div>
                </div>

                {/* OTP Error/Success Messages */}
                {otpError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                    {otpError}
                  </div>
                )}
                {otpSuccess && (
                  <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
                    {otpSuccess}
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={countdown > 0 || isResending}
                    className={`text-sm font-medium ${
                      countdown > 0 || isResending
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-blue-600 hover:text-blue-800 transition-colors'
                    }`}
                  >
                    {isResending ? 'Sending...' : countdown > 0 ? `Resend in ${countdown}s` : 'Resend OTP'}
                  </button>
                </div>

                <button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  Verify OTP
                </button>
              </form>

              <div className="p-4 rounded-lg border bg-yellow-50 border-yellow-200">
                <h5 className="text-sm font-medium mb-2 text-yellow-800 flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  Security Notice
                </h5>
                <ul className="text-xs space-y-1 text-yellow-700">
                  <li>• Never share your OTP with anyone</li>
                  <li>• This OTP will expire in 10 minutes</li>
                  <li>• Contact support if you didn't request this code</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
      
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
      `}</style>
    </div>
  );
}