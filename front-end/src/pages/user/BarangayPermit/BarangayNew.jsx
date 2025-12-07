import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Upload, Check, X, Eye, FileText } from "lucide-react";

const COLORS = {
  primary: '#4A90E2',
  secondary: '#000000',
  accent: '#FDA811',
  success: '#4CAF50',
  danger: '#E53935',
  background: '#FBFBFB',
  font: 'Montserrat, Arial, sans-serif'
};

const NATIONALITIES = [
  "Afghan", "Albanian", "Algerian", "American", "Andorran", "Angolan", "Antiguans", "Argentinean", "Armenian", "Australian", "Austrian", "Azerbaijani", "Bahamian", "Bahraini", "Bangladeshi", "Barbadian", "Barbudans", "Batswana", "Belarusian", "Belgian", "Belizean", "Beninese", "Bhutanese", "Bolivian", "Bosnian", "Brazilian", "British", "Bruneian", "Bulgarian", "Burkinabe", "Burmese", "Burundian", "Cambodian", "Cameroonian", "Canadian", "Cape Verdean", "Central African", "Chadian", "Chilean", "Chinese", "Colombian", "Comoran", "Congolese", "Costa Rican", "Croatian", "Cuban", "Cypriot", "Czech", "Danish", "Djibouti", "Dominican", "Dutch", "East Timorese", "Ecuadorean", "Egyptian", "Emirian", "Equatorial Guinean", "Eritrean", "Estonian", "Ethiopian", "Fijian", "Filipino", "Finnish", "French", "Gabonese", "Gambian", "Georgian", "German", "Ghanaian", "Greek", "Grenadian", "Guatemalan", "Guinea-Bissauan", "Guinean", "Guyanese", "Haitian", "Herzegovinian", "Honduran", "Hungarian", "I-Kiribati", "Icelander", "Indian", "Indonesian", "Iranian", "Iraqi", "Irish", "Israeli", "Italian", "Ivorian", "Jamaican", "Japanese", "Jordanian", "Kazakhstani", "Kenyan", "Kittian and Nevisian", "Kuwaiti", "Kyrgyz", "Laotian", "Latvian", "Lebanese", "Liberian", "Libyan", "Liechtensteiner", "Lithuanian", "Luxembourger", "Macedonian", "Malagasy", "Malawian", "Malaysian", "Maldivan", "Malian", "Maltese", "Marshallese", "Mauritanian", "Mauritian", "Mexican", "Micronesian", "Moldovan", "Monacan", "Mongolian", "Moroccan", "Mosotho", "Motswana", "Mozambican", "Namibian", "Nauruan", "Nepalese", "New Zealander", "Nicaraguan", "Nigerian", "Nigerien", "North Korean", "Northern Irish", "Norwegian", "Omani", "Pakistani", "Palauan", "Palestinian", "Panamanian", "Papua New Guinean", "Paraguayan", "Peruvian", "Polish", "Portuguese", "Qatari", "Romanian", "Russian", "Rwandan", "Saint Lucian", "Salvadoran", "Samoan", "San Marinese", "Sao Tomean", "Saudi", "Scottish", "Senegalese", "Serbian", "Seychellois", "Sierra Leonean", "Singaporean", "Slovakian", "Slovenian", "Solomon Islander", "Somali", "South African", "South Korean", "Spanish", "Sri Lankan", "Sudanese", "Surinamer", "Swazi", "Swedish", "Swiss", "Syrian", "Taiwanese", "Tajik", "Tanzanian", "Thai", "Togolese", "Tongan", "Trinidadian or Tobagonian", "Tunisian", "Turkish", "Tuvaluan", "Ugandan", "Ukrainian", "Uruguayan", "Uzbekistani", "Venezuelan", "Vietnamese", "Welsh", "Yemenite", "Zambian", "Zimbabwean"
];

export default function BarangayNew() {
  const location = useLocation();
  const navigate = useNavigate();
  const permitType = location.state?.permitType || 'NEW';
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalTitle, setModalTitle] = useState('');
  const [agreeDeclaration, setAgreeDeclaration] = useState(false);
  const [showPreview, setShowPreview] = useState({});
  const [userData, setUserData] = useState(null);
  
  // Initialize form data
  const [formData, setFormData] = useState({
    // Permit Information
    permit_type: permitType,
    application_date: new Date().toISOString().split('T')[0],
    status: 'pending',
    
    // Applicant Information
    first_name: '',
    middle_name: '',
    last_name: '',
    suffix: '',
    mobile_number: '',
    email: '',
    birthdate: '',
    gender: '',
    civil_status: '',
    nationality: '',
    
    // Address Information
    house_no: '',
    street: '',
    barangay: '',
    city_municipality: '',
    province: '',
    zip_code: '',
    
    // Clearance Details
    purpose: '',
    duration: '',
    id_type: '',
    id_number: '',
    
    // Additional fields
    clearance_fee: 0.00,
    receipt_number: '',
    user_id: null,
    applicant_signature: '',
    
    // File attachments
    valid_id_file: null,
    proof_of_residence_file: null,
    receipt_file: null,
    signature_file: null,
    photo_fingerprint_file: null,
    
    attachments: '',
  });

  const steps = [
    { id: 1, title: 'Applicant Information', description: 'Personal details' },
    { id: 2, title: 'Address Information', description: 'Where you live' },
    { id: 3, title: 'Clearance Details', description: 'Purpose, ID, Duration' },
    { id: 4, title: 'Uploads', description: 'Required documents' },
    { id: 5, title: 'Review', description: 'Review your application' }
  ];

  // Fetch user data when component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/back-end/api/auth/me.php', {
          method: 'GET',
          credentials: 'include'
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.user) {
            setUserData(data.user);
            
            // Pre-fill form with user data
            setFormData(prev => ({
              ...prev,
              first_name: data.user.first_name || '',
              middle_name: data.user.middle_name || '',
              last_name: data.user.last_name || '',
              email: data.user.email || '',
              mobile_number: data.user.mobile_number || '',
              birthdate: data.user.birthdate || '',
              gender: data.user.gender || '',
              civil_status: data.user.civil_status || '',
              nationality: data.user.nationality || '',
              house_no: data.user.house_no || '',
              street: data.user.street || '',
              barangay: data.user.barangay || '',
              city_municipality: data.user.city_municipality || '',
              province: data.user.province || '',
              zip_code: data.user.zip_code || '',
              user_id: data.user.id || null
            }));
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    
    if (type === 'file') {
      const file = files[0];
      setFormData(prev => ({
        ...prev,
        [name]: file || null,
        ...(name === 'signature_file' && { applicant_signature: file?.name || '' })
      }));
    } else if (name === "mobile_number") {
      const onlyNums = value.replace(/[^0-9]/g, "");
      setFormData(prev => ({
        ...prev,
        [name]: onlyNums
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const previewFile = (file) => {
    if (!file) return null;
    
    const url = URL.createObjectURL(file);
    const fileType = file.type.split('/')[0];
    
    setShowPreview({
      url: url,
      type: fileType,
      name: file.name
    });
  };

  const closePreview = () => {
    if (showPreview.url) {
      URL.revokeObjectURL(showPreview.url);
    }
    setShowPreview({});
  };

  const [errors, setErrors] = useState({});

  const validateStep = (step) => {
    const newErrors = {};
    if (step === 1) {
      if (!formData.first_name || formData.first_name.trim() === '') newErrors.first_name = 'First name is required';
      if (!formData.last_name || formData.last_name.trim() === '') newErrors.last_name = 'Last name is required';
      if (!formData.mobile_number || formData.mobile_number.trim() === '') newErrors.mobile_number = 'Mobile number is required';
      if (!formData.birthdate) newErrors.birthdate = 'Birth date is required';
      if (!formData.gender) newErrors.gender = 'Gender is required';
      if (!formData.civil_status) newErrors.civil_status = 'Civil status is required';
      if (!formData.nationality || formData.nationality.trim() === '') newErrors.nationality = 'Nationality is required';
    }
    if (step === 2) {
      if (!formData.house_no || formData.house_no.trim() === '') newErrors.house_no = 'House/Building No. is required';
      if (!formData.street || formData.street.trim() === '') newErrors.street = 'Street is required';
      if (!formData.barangay || formData.barangay.trim() === '') newErrors.barangay = 'Barangay is required';
      if (!formData.city_municipality || formData.city_municipality.trim() === '') newErrors.city_municipality = 'City/Municipality is required';
      if (!formData.province || formData.province.trim() === '') newErrors.province = 'Province is required';
    }
    if (step === 3) {
      if (!formData.purpose || formData.purpose.trim() === '') newErrors.purpose = 'Purpose is required';
      if (!formData.id_type || formData.id_type.trim() === '') newErrors.id_type = 'ID type is required';
      if (!formData.id_number || formData.id_number.trim() === '') newErrors.id_number = 'ID number is required';
    }
    if (step === 4) {
      if (!formData.valid_id_file) newErrors.valid_id_file = 'Valid ID is required';
      if (!formData.signature_file) newErrors.signature_file = 'Applicant Signature is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isStepValid = (step) => {
    if (step === 1) {
      if (!formData.first_name || formData.first_name.trim() === '') return false;
      if (!formData.last_name || formData.last_name.trim() === '') return false;
      if (!formData.mobile_number || formData.mobile_number.trim() === '') return false;
      if (!formData.birthdate) return false;
      if (!formData.gender) return false;
      if (!formData.civil_status) return false;
      if (!formData.nationality || formData.nationality.trim() === '') return false;
      return true;
    }
    if (step === 2) {
      if (!formData.house_no || formData.house_no.trim() === '') return false;
      if (!formData.street || formData.street.trim() === '') return false;
      if (!formData.barangay || formData.barangay.trim() === '') return false;
      if (!formData.city_municipality || formData.city_municipality.trim() === '') return false;
      if (!formData.province || formData.province.trim() === '') return false;
      return true;
    }
    if (step === 3) {
      if (!formData.purpose || formData.purpose.trim() === '') return false;
      if (!formData.id_type || formData.id_type.trim() === '') return false;
      if (!formData.id_number || formData.id_number.trim() === '') return false;
      return true;
    }
    if (step === 4) {
      if (!formData.valid_id_file) return false;
      if (!formData.signature_file) return false;
      return true;
    }
    return true;
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      const ok = validateStep(currentStep);
      if (ok) {
        setCurrentStep(currentStep + 1);
        setErrors({});
      }
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (currentStep < steps.length - 1) {
      // For steps 1-4, just go to next step
      nextStep();
    } else if (currentStep === steps.length - 1) {
      // For step 4, go to review (step 5)
      const ok = validateStep(currentStep);
      if (ok) {
        setCurrentStep(currentStep + 1);
        setErrors({});
      }
    } else {
      // On Step 5 (Review), show confirmation modal
      setShowConfirmModal(true);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const showSuccessMessage = (message) => {
    setModalTitle('Success!');
    setModalMessage(message);
    setShowSuccessModal(true);
  };

  const showErrorMessage = (message) => {
    setModalTitle('Error');
    setModalMessage(message);
    setShowErrorModal(true);
  };

  const handleSubmit = async () => {
    if (!agreeDeclaration) {
      showErrorMessage("You must agree to the declaration before submitting.");
      return;
    }

    setIsSubmitting(true);

    // Validate steps
    const step1Ok = validateStep(1);
    const step2Ok = validateStep(2);
    const step3Ok = validateStep(3);
    const step4Ok = validateStep(4);

    if (!(step1Ok && step2Ok && step3Ok && step4Ok)) {
      setIsSubmitting(false);
      if (!step1Ok) setCurrentStep(1);
      else if (!step2Ok) setCurrentStep(2);
      else if (!step3Ok) setCurrentStep(3);
      else setCurrentStep(4);

      setShowConfirmModal(false);
      return;
    }

    try {
      // Prepare FormData for backend
      const formDataToSend = new FormData();

      // Append all text fields
      Object.entries({
        user_id: formData.user_id || "",
        application_date: formData.application_date,
        first_name: formData.first_name,
        middle_name: formData.middle_name || "",
        last_name: formData.last_name,
        suffix: formData.suffix || "",
        birthdate: formData.birthdate,
        mobile_number: formData.mobile_number,
        email: formData.email || "",
        gender: formData.gender,
        civil_status: formData.civil_status,
        nationality: formData.nationality,
        house_no: formData.house_no,
        street: formData.street,
        barangay: formData.barangay,
        city_municipality: formData.city_municipality,
        province: formData.province,
        zip_code: formData.zip_code || "",
        purpose: formData.purpose,
        duration: formData.duration || "",
        id_type: formData.id_type,
        id_number: formData.id_number,
        clearance_fee: formData.clearance_fee || "0.00",
        receipt_number: formData.receipt_number || "",
        status: formData.status || "pending",
      }).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });

      // Attach file uploads
      const fileFields = [
        "valid_id_file",
        "proof_of_residence_file",
        "receipt_file",
        "signature_file",
        "photo_fingerprint_file",
      ];

      fileFields.forEach((field) => {
        if (formData[field] instanceof File) {
          formDataToSend.append(field, formData[field]);
        }
      });

      console.log("Submitting barangay permit application...");

      const response = await fetch("http://localhost/eplms-main/backend/barangay_permit/barangay_permit.php", {
        method: "POST",
        body: formDataToSend,
      });

      const responseClone = response.clone();
      let data;

      try {
        data = await response.json();
      } catch {
        const rawText = await responseClone.text();
        console.error("Raw server response:", rawText);
        throw new Error("Server did not return valid JSON");
      }

      // Success
      if (data.success) {
        setShowConfirmModal(false);
        showSuccessMessage(data.message || "Application submitted successfully!");
        
        // Reset form after successful submission
        setTimeout(() => {
          setFormData({
            permit_type: permitType,
            application_date: new Date().toISOString().split('T')[0],
            status: 'pending',
            first_name: '',
            middle_name: '',
            last_name: '',
            suffix: '',
            mobile_number: '',
            email: '',
            birthdate: '',
            gender: '',
            civil_status: '',
            nationality: '',
            house_no: '',
            street: '',
            barangay: '',
            city_municipality: '',
            province: '',
            zip_code: '',
            purpose: '',
            duration: '',
            id_type: '',
            id_number: '',
            clearance_fee: 0.00,
            receipt_number: '',
            user_id: userData?.id || null,
            applicant_signature: '',
            valid_id_file: null,
            proof_of_residence_file: null,
            receipt_file: null,
            signature_file: null,
            photo_fingerprint_file: null,
            attachments: '',
          });
          setCurrentStep(1);
          setAgreeDeclaration(false);
        }, 2000);

        // Navigate after showing success message
        setTimeout(() => {
          navigate("/user/dashboard");
        }, 3000);
      } else {
        showErrorMessage(data.message || "Failed to submit application.");
      }

    } catch (error) {
      console.error("Submission error:", error);
      showErrorMessage("Network error: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold mb-4" style={{ color: COLORS.secondary }}>Applicant Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 font-medium" style={{ color: COLORS.secondary }}>First Name *</label>
                <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} placeholder="First Name" className={`w-full p-3 border border-black rounded-lg ${errors.first_name ? 'border-red-500' : ''}`} style={{ color: COLORS.secondary, fontFamily: COLORS.font }} />
                {errors.first_name && <p className="text-red-600 text-sm mt-1" style={{ fontFamily: COLORS.font }}>{errors.first_name}</p>}
              </div>
              <div>
                <label className="block mb-2 font-medium" style={{ color: COLORS.secondary }}>Middle Name</label>
                <input type="text" name="middle_name" value={formData.middle_name} onChange={handleChange} placeholder="Middle Name" className="w-full p-3 border border-black rounded-lg" style={{ color: COLORS.secondary, fontFamily: COLORS.font }} />
              </div>
              <div>
                <label className="block mb-2 font-medium" style={{ color: COLORS.secondary }}>Last Name *</label>
                <input type="text" name="last_name" value={formData.last_name} onChange={handleChange} placeholder="Last Name" className={`w-full p-3 border border-black rounded-lg ${errors.last_name ? 'border-red-500' : ''}`} style={{ color: COLORS.secondary, fontFamily: COLORS.font }} />
                {errors.last_name && <p className="text-red-600 text-sm mt-1" style={{ fontFamily: COLORS.font }}>{errors.last_name}</p>}
              </div>
              <div>
                <label className="block mb-2 font-medium" style={{ color: COLORS.secondary }}>Suffix</label>
                <input type="text" name="suffix" value={formData.suffix} onChange={handleChange} placeholder="Suffix" className="w-full p-3 border border-black rounded-lg" style={{ color: COLORS.secondary, fontFamily: COLORS.font }} />
              </div>
              <div>
                <label className="block mb-2 font-medium" style={{ color: COLORS.secondary }}>Mobile Number *</label>
                <input type="text" name="mobile_number" value={formData.mobile_number} onChange={handleChange} placeholder="Mobile Number" className={`w-full p-3 border border-black rounded-lg ${errors.mobile_number ? 'border-red-500' : ''}`} style={{ color: COLORS.secondary, fontFamily: COLORS.font }} />
                {errors.mobile_number && <p className="text-red-600 text-sm mt-1" style={{ fontFamily: COLORS.font }}>{errors.mobile_number}</p>}
              </div>
              <div>
                <label className="block mb-2 font-medium" style={{ color: COLORS.secondary }}>Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" className="w-full p-3 border border-black rounded-lg" style={{ color: COLORS.secondary, fontFamily: COLORS.font }} />
              </div>
              <div>
                <label className="block mb-2 font-medium" style={{ color: COLORS.secondary }}>Birth Date *</label>
                <input type="date" name="birthdate" value={formData.birthdate} onChange={handleChange} className={`w-full p-3 border border-black rounded-lg ${errors.birthdate ? 'border-red-500' : ''}`} style={{ color: COLORS.secondary, fontFamily: COLORS.font }} />
                {errors.birthdate && <p className="text-red-600 text-sm mt-1" style={{ fontFamily: COLORS.font }}>{errors.birthdate}</p>}
              </div>
              <div>
                <label className="block mb-2 font-medium" style={{ color: COLORS.secondary }}>Gender *</label>
                <select name="gender" value={formData.gender} onChange={handleChange} className={`w-full p-3 border border-black rounded-lg ${errors.gender ? 'border-red-500' : ''}`} style={{ color: COLORS.secondary, fontFamily: COLORS.font }} >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                {errors.gender && <p className="text-red-600 text-sm mt-1" style={{ fontFamily: COLORS.font }}>{errors.gender}</p>}
              </div>
              <div>
                <label className="block mb-2 font-medium" style={{ color: COLORS.secondary }}>Civil Status *</label>
                <select name="civil_status" value={formData.civil_status} onChange={handleChange} className={`w-full p-3 border border-black rounded-lg ${errors.civil_status ? 'border-red-500' : ''}`} style={{ color: COLORS.secondary, fontFamily: COLORS.font }} >
                  <option value="">Select civil status</option>
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                  <option value="Widowed">Widowed</option>
                  <option value="Separated">Separated</option>
                </select>
                {errors.civil_status && <p className="text-red-600 text-sm mt-1" style={{ fontFamily: COLORS.font }}>{errors.civil_status}</p>}
              </div>
              <div>
                <label className="block mb-2 font-medium" style={{ color: COLORS.secondary }}>Nationality *</label>
                <select name="nationality" value={formData.nationality} onChange={handleChange} className={`w-full p-3 border border-black rounded-lg ${errors.nationality ? 'border-red-500' : ''}`} style={{ color: COLORS.secondary, fontFamily: COLORS.font }} >
                  <option value="">Select nationality</option>
                  {NATIONALITIES.map(nat => (
                    <option key={nat} value={nat}>{nat}</option>
                  ))}
                </select>
                {errors.nationality && <p className="text-red-600 text-sm mt-1" style={{ fontFamily: COLORS.font }}>{errors.nationality}</p>}
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold mb-4" style={{ color: COLORS.secondary }}>Address Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 font-medium" style={{ color: COLORS.secondary }}>House/Building No. *</label>
                <input type="text" name="house_no" value={formData.house_no} onChange={handleChange} placeholder="House/Building No." className={`w-full p-3 border border-black rounded-lg ${errors.house_no ? 'border-red-500' : ''}`} style={{ color: COLORS.secondary, fontFamily: COLORS.font }} />
                {errors.house_no && <p className="text-red-600 text-sm mt-1" style={{ fontFamily: COLORS.font }}>{errors.house_no}</p>}
              </div>
              <div>
                <label className="block mb-2 font-medium" style={{ color: COLORS.secondary }}>Street *</label>
                <input type="text" name="street" value={formData.street} onChange={handleChange} placeholder="Street" className={`w-full p-3 border border-black rounded-lg ${errors.street ? 'border-red-500' : ''}`} style={{ color: COLORS.secondary, fontFamily: COLORS.font }} />
                {errors.street && <p className="text-red-600 text-sm mt-1" style={{ fontFamily: COLORS.font }}>{errors.street}</p>}
              </div>
              <div>
                <label className="block mb-2 font-medium" style={{ color: COLORS.secondary }}>Barangay *</label>
                <input type="text" name="barangay" value={formData.barangay} onChange={handleChange} placeholder="Barangay" className={`w-full p-3 border border-black rounded-lg ${errors.barangay ? 'border-red-500' : ''}`} style={{ color: COLORS.secondary, fontFamily: COLORS.font }} />
                {errors.barangay && <p className="text-red-600 text-sm mt-1" style={{ fontFamily: COLORS.font }}>{errors.barangay}</p>}
              </div>
              <div>
                <label className="block mb-2 font-medium" style={{ color: COLORS.secondary }}>City/Municipality *</label>
                <input type="text" name="city_municipality" value={formData.city_municipality} onChange={handleChange} placeholder="City/Municipality" className={`w-full p-3 border border-black rounded-lg ${errors.city_municipality ? 'border-red-500' : ''}`} style={{ color: COLORS.secondary, fontFamily: COLORS.font }} />
                {errors.city_municipality && <p className="text-red-600 text-sm mt-1" style={{ fontFamily: COLORS.font }}>{errors.city_municipality}</p>}
              </div>
              <div>
                <label className="block mb-2 font-medium" style={{ color: COLORS.secondary }}>Province *</label>
                <input type="text" name="province" value={formData.province} onChange={handleChange} placeholder="Province" className={`w-full p-3 border border-black rounded-lg ${errors.province ? 'border-red-500' : ''}`} style={{ color: COLORS.secondary, fontFamily: COLORS.font }} />
                {errors.province && <p className="text-red-600 text-sm mt-1" style={{ fontFamily: COLORS.font }}>{errors.province}</p>}
              </div>
              <div>
                <label className="block mb-2 font-medium" style={{ color: COLORS.secondary }}>ZIP Code</label>
                <input type="text" name="zip_code" value={formData.zip_code} onChange={handleChange} placeholder="ZIP Code" className="w-full p-3 border border-black rounded-lg" style={{ color: COLORS.secondary, fontFamily: COLORS.font }} />
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold mb-4" style={{ color: COLORS.secondary }}>Clearance Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block mb-2 font-medium" style={{ color: COLORS.secondary }}>Purpose of Clearance *</label>
                <select name="purpose" value={formData.purpose} onChange={handleChange} className={`w-full p-3 border border-black rounded-lg ${errors.purpose ? 'border-red-500' : ''}`} style={{ color: COLORS.secondary, fontFamily: COLORS.font }} >
                  <option value="">Select purpose</option>
                  <optgroup label="Personal Purposes">
                    <option value="For personal identification">For personal identification</option>
                    <option value="For residency verification">For residency verification</option>
                    <option value="For school requirement">For school requirement</option>
                    <option value="For scholarship application">For scholarship application</option>
                    <option value="For government assistance">For government assistance</option>
                    <option value="For medical assistance application">For medical assistance application</option>
                    <option value="For financial assistance or aid">For financial assistance or aid</option>
                    <option value="For barangay ID application">For barangay ID application</option>
                    <option value="For court requirement / affidavit / legal matter">For court requirement / affidavit / legal matter</option>
                    <option value="For police clearance / NBI clearance requirement">For police clearance / NBI clearance requirement</option>
                  </optgroup>
                  <optgroup label="Employment-Related Purposes">
                    <option value="For local employment">For local employment</option>
                    <option value="For job application (private company)">For job application (private company)</option>
                    <option value="For government employment">For government employment</option>
                    <option value="For on-the-job training (OJT)">For on-the-job training (OJT)</option>
                    <option value="For job order / contractual employment">For job order / contractual employment</option>
                    <option value="For agency employment requirement">For agency employment requirement</option>
                    <option value="For renewal of work contract">For renewal of work contract</option>
                    <option value="For employment abroad (POEA / OFW)">For employment abroad (POEA / OFW)</option>
                  </optgroup>
                  <optgroup label="Business-Related Purposes">
                    <option value="For new business permit application">For new business permit application</option>
                    <option value="For renewal of business permit">For renewal of business permit</option>
                    <option value="For DTI / SEC business registration">For DTI / SEC business registration</option>
                    <option value="For business tax application">For business tax application</option>
                    <option value="For stall rental or space lease">For stall rental or space lease</option>
                    <option value="For business name registration">For business name registration</option>
                    <option value="For operation of new establishment">For operation of new establishment</option>
                    <option value="For business closure / cancellation">For business closure / cancellation</option>
                    <option value="For relocation / change of business address">For relocation / change of business address</option>
                  </optgroup>
                  <optgroup label="Residency / Property Purposes">
                    <option value="For proof of residency">For proof of residency</option>
                    <option value="For transfer of residence">For transfer of residence</option>
                    <option value="For lot / land ownership verification">For lot / land ownership verification</option>
                    <option value="For construction permit requirement">For construction permit requirement</option>
                    <option value="For fencing / excavation / building permit application">For fencing / excavation / building permit application</option>
                    <option value="For utility connection">For utility connection</option>
                    <option value="For barangay boundary certification">For barangay boundary certification</option>
                  </optgroup>
                  <optgroup label="Other Official / Legal Purposes">
                    <option value="For marriage license application">For marriage license application</option>
                    <option value="For travel / local mobility clearance">For travel / local mobility clearance</option>
                    <option value="For firearm license application">For firearm license application</option>
                    <option value="For barangay mediation / complaint settlement record">For barangay mediation / complaint settlement record</option>
                    <option value="For notarization requirement">For notarization requirement</option>
                    <option value="For business closure or transfer">For business closure or transfer</option>
                    <option value="For franchise or transport operation permit">For franchise or transport operation permit</option>
                    <option value="For cooperative registration">For cooperative registration</option>
                    <option value="For loan application">For loan application</option>
                    <option value="For SSS / Pag-IBIG / PhilHealth registration">For SSS / Pag-IBIG / PhilHealth registration</option>
                  </optgroup>
                </select>
                {errors.purpose && <p className="text-red-600 text-sm mt-1" style={{ fontFamily: COLORS.font }}>{errors.purpose}</p>}
              </div>
              <div>
                <label className="block mb-2 font-medium" style={{ color: COLORS.secondary }}>Duration / Period of Validity *</label>
                <input
                  type="date"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  className={`w-full p-3 border border-black rounded-lg ${errors.duration ? 'border-red-500' : ''}`}
                  style={{ color: COLORS.secondary, fontFamily: COLORS.font }}
                  min="1900-01-01"
                  max="2100-12-31"
                />
              </div>
              <div>
                <label className="block mb-2 font-medium" style={{ color: COLORS.secondary }}>Valid ID Type *</label>
                <select name="id_type" value={formData.id_type} onChange={handleChange} className={`w-full p-3 border border-black rounded-lg ${errors.id_type ? 'border-red-500' : ''}`} style={{ color: COLORS.secondary, fontFamily: COLORS.font }} >
                  <option value="">Select ID type</option>
                  <optgroup label="Primary Valid Government-Issued IDs">
                    <option value="Philippine National ID (PhilSys ID)">Philippine National ID (PhilSys ID)</option>
                    <option value="Driver's License (LTO)">Driver's License (LTO)</option>
                    <option value="Passport (DFA)">Passport (DFA)</option>
                    <option value="UMID">UMID</option>
                    <option value="Voter's ID or COMELEC Voter's Certificate">Voter's ID or COMELEC Voter's Certificate</option>
                    <option value="Postal ID (PhilPost)">Postal ID (PhilPost)</option>
                    <option value="PRC ID">PRC ID</option>
                    <option value="Senior Citizen ID">Senior Citizen ID</option>
                    <option value="PWD ID">PWD ID</option>
                    <option value="Barangay ID">Barangay ID</option>
                  </optgroup>
                  <optgroup label="Secondary / Supporting IDs">
                    <option value="School ID">School ID</option>
                    <option value="Company / Employee ID">Company / Employee ID</option>
                    <option value="Police Clearance or NBI Clearance">Police Clearance or NBI Clearance</option>
                    <option value="Tax Identification Number (TIN) ID">Tax Identification Number (TIN) ID</option>
                    <option value="PhilHealth ID">PhilHealth ID</option>
                    <option value="Pag-IBIG ID">Pag-IBIG ID</option>
                    <option value="GSIS eCard">GSIS eCard</option>
                    <option value="Solo Parent ID">Solo Parent ID</option>
                    <option value="Indigenous People's (IP) ID">Indigenous People's (IP) ID</option>
                    <option value="Firearms License ID">Firearms License ID</option>
                  </optgroup>
                </select>
                {errors.id_type && <p className="text-red-600 text-sm mt-1" style={{ fontFamily: COLORS.font }}>{errors.id_type}</p>}
              </div>
              <div>
                <label className="block mb-2 font-medium" style={{ color: COLORS.secondary }}>Valid ID Number *</label>
                <input type="text" name="id_number" value={formData.id_number} onChange={handleChange} placeholder="ID Number" className={`w-full p-3 border border-black rounded-lg ${errors.id_number ? 'border-red-500' : ''}`} style={{ color: COLORS.secondary, fontFamily: COLORS.font }} />
                {errors.id_number && <p className="text-red-600 text-sm mt-1" style={{ fontFamily: COLORS.font }}>{errors.id_number}</p>}
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold mb-4" style={{ color: COLORS.secondary }}>Required Documents</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: COLORS.secondary }}>
                  Valid ID (Government-issued, school, company ID) *
                </label>
                <div className="flex items-center gap-3 p-3 border border-black rounded w-full bg-white">
                  <Upload className="w-5 h-5 text-gray-500" />
                  <input
                    type="file"
                    name="valid_id_file"
                    onChange={handleChange}
                    className="w-full text-sm file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-sm file:font-medium file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                    style={{ fontFamily: COLORS.font }}
                  />
                </div>
                {errors.valid_id_file && <p className="text-red-600 text-sm mt-1" style={{ fontFamily: COLORS.font }}>{errors.valid_id_file}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: COLORS.secondary }}>
                  Proof of Residence (Utility bill, barangay certificate)
                </label>
                <div className="flex items-center gap-3 p-3 border border-black rounded w-full bg-white">
                  <Upload className="w-5 h-5 text-gray-500" />
                  <input
                    type="file"
                    name="proof_of_residence_file"
                    onChange={handleChange}
                    className="w-full text-sm file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-sm file:font-medium file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                    style={{ fontFamily: COLORS.font }}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: COLORS.secondary }}>
                  Official Receipt or Proof of Payment
                </label>
                <div className="flex items-center gap-3 p-3 border border-black rounded w-full bg-white">
                  <Upload className="w-5 h-5 text-gray-500" />
                  <input
                    type="file"
                    name="receipt_file"
                    onChange={handleChange}
                    className="w-full text-sm file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-sm file:font-medium file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                    style={{ fontFamily: COLORS.font }}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: COLORS.secondary }}>
                  Applicant's Signature *
                </label>
                <div className="flex items-center gap-3 p-3 border border-black rounded w-full bg-white">
                  <Upload className="w-5 h-5 text-gray-500" />
                  <input
                    type="file"
                    name="signature_file"
                    onChange={handleChange}
                    className="w-full text-sm file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-sm file:font-medium file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                    style={{ fontFamily: COLORS.font }}
                  />
                </div>
                {errors.signature_file && <p className="text-red-600 text-sm mt-1" style={{ fontFamily: COLORS.font }}>{errors.signature_file}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: COLORS.secondary }}>
                  Photo and Fingerprint (if required)
                </label>
                <div className="flex items-center gap-3 p-3 border border-black rounded w-full bg-white">
                  <Upload className="w-5 h-5 text-gray-500" />
                  <input
                    type="file"
                    name="photo_fingerprint_file"
                    onChange={handleChange}
                    className="w-full text-sm file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-sm file:font-medium file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                    style={{ fontFamily: COLORS.font }}
                  />
                </div>
              </div>
            </div>
          </div>
        );
      case 5:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold mb-4" style={{ color: COLORS.secondary }}>Review Your Application</h3>
            <div className="bg-white rounded-lg shadow p-6 border border-black">
              <div className="space-y-6">
                <div>
                  <h5 className="font-semibold mb-3 text-lg" style={{ color: COLORS.primary }}>Applicant Information</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm" style={{ fontFamily: COLORS.font }}>
                    <div className="flex items-center">
                      <span className="font-medium w-32">First Name:</span>
                      <span className="flex-1">{formData.first_name}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium w-32">Middle Name:</span>
                      <span className="flex-1">{formData.middle_name || 'N/A'}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium w-32">Last Name:</span>
                      <span className="flex-1">{formData.last_name}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium w-32">Suffix:</span>
                      <span className="flex-1">{formData.suffix || 'N/A'}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium w-32">Mobile Number:</span>
                      <span className="flex-1">{formData.mobile_number}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium w-32">Email:</span>
                      <span className="flex-1">{formData.email || 'N/A'}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium w-32">Birth Date:</span>
                      <span className="flex-1">{formData.birthdate}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium w-32">Gender:</span>
                      <span className="flex-1">{formData.gender}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium w-32">Civil Status:</span>
                      <span className="flex-1">{formData.civil_status}</span>
                    </div>
                    <div className="flex items-center md:col-span-2">
                      <span className="font-medium w-32">Nationality:</span>
                      <span className="flex-1">{formData.nationality}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h5 className="font-semibold mb-3 text-lg" style={{ color: COLORS.primary }}>Address Information</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm" style={{ fontFamily: COLORS.font }}>
                    <div className="flex items-center">
                      <span className="font-medium w-32">House/Building No.:</span>
                      <span className="flex-1">{formData.house_no}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium w-32">Street:</span>
                      <span className="flex-1">{formData.street}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium w-32">Barangay:</span>
                      <span className="flex-1">{formData.barangay}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium w-32">City/Municipality:</span>
                      <span className="flex-1">{formData.city_municipality}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium w-32">Province:</span>
                      <span className="flex-1">{formData.province}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium w-32">ZIP Code:</span>
                      <span className="flex-1">{formData.zip_code || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h5 className="font-semibold mb-3 text-lg" style={{ color: COLORS.primary }}>Clearance Details</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm" style={{ fontFamily: COLORS.font }}>
                    <div className="flex items-center">
                      <span className="font-medium w-32">Purpose:</span>
                      <span className="flex-1">{formData.purpose}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium w-32">Duration:</span>
                      <span className="flex-1">{formData.duration || 'N/A'}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium w-32">ID Type:</span>
                      <span className="flex-1">{formData.id_type}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium w-32">ID Number:</span>
                      <span className="flex-1">{formData.id_number}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h5 className="font-semibold mb-3 text-lg" style={{ color: COLORS.primary }}>Uploaded Documents</h5>
                  <div className="space-y-4">
                    {/* Valid ID */}
                    <div className="flex items-center justify-between p-3 border border-gray-300 rounded-lg">
                      <div className="flex items-center">
                        {formData.valid_id_file ? (
                          <Check className="w-5 h-5 text-green-600 mr-3" />
                        ) : (
                          <X className="w-5 h-5 text-red-600 mr-3" />
                        )}
                        <div>
                          <span className="font-medium">Valid ID:</span>
                          <p className="text-sm text-gray-600">
                            {formData.valid_id_file ? formData.valid_id_file.name : 'Not uploaded'}
                          </p>
                        </div>
                      </div>
                      {formData.valid_id_file && (
                        <button
                          type="button"
                          onClick={() => previewFile(formData.valid_id_file)}
                          className="flex items-center gap-1 px-3 py-1 text-sm rounded hover:bg-gray-100 transition-colors duration-300"
                          style={{ color: COLORS.secondary }}
                        >
                          <Eye className="w-4 h-4" />
                          Preview
                        </button>
                      )}
                    </div>

                    {/* Proof of Residence */}
                    <div className="flex items-center justify-between p-3 border border-gray-300 rounded-lg">
                      <div className="flex items-center">
                        {formData.proof_of_residence_file ? (
                          <Check className="w-5 h-5 text-green-600 mr-3" />
                        ) : (
                          <X className="w-5 h-5 text-gray-400 mr-3" />
                        )}
                        <div>
                          <span className="font-medium">Proof of Residence:</span>
                          <p className="text-sm text-gray-600">
                            {formData.proof_of_residence_file ? formData.proof_of_residence_file.name : 'Optional'}
                          </p>
                        </div>
                      </div>
                      {formData.proof_of_residence_file && (
                        <button
                          type="button"
                          onClick={() => previewFile(formData.proof_of_residence_file)}
                          className="flex items-center gap-1 px-3 py-1 text-sm rounded hover:bg-gray-100 transition-colors duration-300"
                          style={{ color: COLORS.secondary }}
                        >
                          <Eye className="w-4 h-4" />
                          Preview
                        </button>
                      )}
                    </div>

                    {/* Official Receipt */}
                    <div className="flex items-center justify-between p-3 border border-gray-300 rounded-lg">
                      <div className="flex items-center">
                        {formData.receipt_file ? (
                          <Check className="w-5 h-5 text-green-600 mr-3" />
                        ) : (
                          <X className="w-5 h-5 text-gray-400 mr-3" />
                        )}
                        <div>
                          <span className="font-medium">Official Receipt:</span>
                          <p className="text-sm text-gray-600">
                            {formData.receipt_file ? formData.receipt_file.name : 'Optional'}
                          </p>
                        </div>
                      </div>
                      {formData.receipt_file && (
                        <button
                          type="button"
                          onClick={() => previewFile(formData.receipt_file)}
                          className="flex items-center gap-1 px-3 py-1 text-sm rounded hover:bg-gray-100 transition-colors duration-300"
                          style={{ color: COLORS.secondary }}
                        >
                          <Eye className="w-4 h-4" />
                          Preview
                        </button>
                      )}
                    </div>

                    {/* Signature */}
                    <div className="flex items-center justify-between p-3 border border-gray-300 rounded-lg">
                      <div className="flex items-center">
                        {formData.signature_file ? (
                          <Check className="w-5 h-5 text-green-600 mr-3" />
                        ) : (
                          <X className="w-5 h-5 text-red-600 mr-3" />
                        )}
                        <div>
                          <span className="font-medium">Signature:</span>
                          <p className="text-sm text-gray-600">
                            {formData.signature_file ? formData.signature_file.name : 'Not uploaded'}
                          </p>
                        </div>
                      </div>
                      {formData.signature_file && (
                        <button
                          type="button"
                          onClick={() => previewFile(formData.signature_file)}
                          className="flex items-center gap-1 px-3 py-1 text-sm rounded hover:bg-gray-100 transition-colors duration-300"
                          style={{ color: COLORS.secondary }}
                        >
                          <Eye className="w-4 h-4" />
                          Preview
                        </button>
                      )}
                    </div>

                    {/* Photo & Fingerprint */}
                    <div className="flex items-center justify-between p-3 border border-gray-300 rounded-lg">
                      <div className="flex items-center">
                        {formData.photo_fingerprint_file ? (
                          <Check className="w-5 h-5 text-green-600 mr-3" />
                        ) : (
                          <X className="w-5 h-5 text-gray-400 mr-3" />
                        )}
                        <div>
                          <span className="font-medium">Photo & Fingerprint:</span>
                          <p className="text-sm text-gray-600">
                            {formData.photo_fingerprint_file ? formData.photo_fingerprint_file.name : 'Optional'}
                          </p>
                        </div>
                      </div>
                      {formData.photo_fingerprint_file && (
                        <button
                          type="button"
                          onClick={() => previewFile(formData.photo_fingerprint_file)}
                          className="flex items-center gap-1 px-3 py-1 text-sm rounded hover:bg-gray-100 transition-colors duration-300"
                          style={{ color: COLORS.secondary }}
                        >
                          <Eye className="w-4 h-4" />
                          Preview
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="mx-1 mt-1 p-6 rounded-lg min-h-screen" style={{ background: COLORS.background, color: COLORS.secondary, fontFamily: COLORS.font }}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-4xl font-bold" style={{ color: COLORS.primary }}>BARANGAY CLEARANCE APPLICATION</h1>
          <p className="mt-2" style={{ color: COLORS.secondary }}>
            Apply for a barangay clearance for various personal, employment, or business purposes.
          </p>
        </div>
        <button
          onClick={() => navigate('/user/barangay/type')}
          onMouseEnter={e => e.currentTarget.style.background = COLORS.accent}
          onMouseLeave={e => e.currentTarget.style.background = COLORS.success}
          style={{ background: COLORS.success }}
          className="px-4 py-2 rounded-lg font-medium text-white hover:bg-[#FDA811] transition-colors duration-300"
        >
          Back to Dashboard
        </button>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div 
                className={`flex items-center justify-center rounded-full border-2 font-semibold transition-all duration-300 ${
                  currentStep >= step.id ? 'text-white' : 'text-gray-500'
                }`}
                style={{
                  background: currentStep >= step.id ? COLORS.success : 'transparent',
                  borderColor: currentStep >= step.id ? COLORS.success : '#9CA3AF',
                  width: '45px',
                  height: '30px',
                  borderRadius: '20px',
                  fontFamily: COLORS.font
                }}
              >
                {step.id}
              </div>
              <div className="ml-3 hidden md:block">
                <p 
                  className="text-sm font-medium" 
                  style={{ 
                    color: currentStep >= step.id ? COLORS.success : COLORS.secondary,
                    fontFamily: COLORS.font
                  }}
                >
                  {step.title}
                </p>
                <p className="text-xs" style={{ color: COLORS.secondary, fontFamily: COLORS.font }}>{step.description}</p>
              </div>
              {index < steps.length - 1 && (
                <div 
                  className="hidden md:block w-16 h-0.5 mx-4" 
                  style={{ background: currentStep > step.id ? COLORS.success : '#9CA3AF' }} 
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleFormSubmit} className="space-y-8">
        {renderStepContent()}

        <div className="flex justify-between pt-6">
          {currentStep > 1 && (
            <button
              type="button"
              onClick={prevStep}
              onMouseEnter={e => e.currentTarget.style.background = COLORS.accent}
              onMouseLeave={e => e.currentTarget.style.background = COLORS.success}
              style={{ background: COLORS.success }}
              className="px-6 py-3 rounded-lg font-semibold text-white transition-colors duration-300"
            >
              Previous
            </button>
          )}

          {currentStep < steps.length ? (
            <button
              type="submit"
              disabled={!isStepValid(currentStep)}
              style={{ background: !isStepValid(currentStep) ? '#9CA3AF' : COLORS.success }}
              onMouseEnter={e => {
                if (isStepValid(currentStep)) e.currentTarget.style.background = COLORS.accent;
              }}
              onMouseLeave={e => {
                if (isStepValid(currentStep)) e.currentTarget.style.background = COLORS.success;
              }}
              className={`px-6 py-3 rounded-lg font-semibold text-white ${
                !isStepValid(currentStep) ? 'cursor-not-allowed' : 'transition-colors duration-300'
              }`}
            >
              {currentStep === steps.length - 1 ? 'Review Application' : 'Next'}
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              onMouseEnter={e => e.currentTarget.style.background = COLORS.accent}
              onMouseLeave={e => e.currentTarget.style.background = COLORS.success}
              style={{ background: COLORS.success }}
              className="px-6 py-3 rounded-lg font-semibold text-white transition-colors duration-300"
            >
              Submit Application
            </button>
          )}
        </div>
      </form>

      {/* File Preview Modal */}
      {showPreview.url && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm z-50 p-4">
          <div 
            className="rounded-lg shadow-lg w-full max-w-4xl border border-gray-200 overflow-hidden"
            style={{ 
              background: 'rgba(255, 255, 255, 0.95)',
              fontFamily: COLORS.font,
              backdropFilter: 'blur(10px)',
              maxHeight: '90vh'
            }}
          >
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-xl font-bold" style={{ color: COLORS.primary }}>Preview Document</h2>
              <button
                onClick={closePreview}
                className="text-gray-500 hover:text-gray-700 transition-colors duration-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 overflow-auto" style={{ maxHeight: 'calc(90vh - 80px)' }}>
              <p className="text-sm mb-4" style={{ color: COLORS.secondary, fontFamily: COLORS.font }}>
                File: <span className="font-medium">{showPreview.name}</span>
              </p>
              
              <div className="bg-white rounded-lg border p-4">
                {showPreview.type === 'image' ? (
                  <div className="flex justify-center">
                    <img 
                      src={showPreview.url} 
                      alt="Preview" 
                      className="max-w-full h-auto max-h-[500px]"
                    />
                  </div>
                ) : showPreview.type === 'application' && showPreview.name?.includes('.pdf') ? (
                  <iframe 
                    src={showPreview.url} 
                    className="w-full h-[500px] rounded"
                    title="PDF Preview"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center p-8">
                    <FileText className="w-24 h-24 text-gray-400 mb-4" />
                    <p className="text-gray-600 mb-2">File: {showPreview.name}</p>
                    <p className="text-gray-500 mb-6">Preview not available for this file type</p>
                    <a 
                      href={showPreview.url} 
                      download={showPreview.name}
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-300"
                    >
                      Download File
                    </a>
                  </div>
                )}
              </div>
              
              <div className="flex justify-end mt-6">
                <button
                  onClick={closePreview}
                  style={{ background: COLORS.success }}
                  onMouseEnter={e => e.currentTarget.style.background = COLORS.accent}
                  onMouseLeave={e => e.currentTarget.style.background = COLORS.success}
                  className="px-6 py-2 rounded-lg font-semibold text-white transition-colors duration-300"
                >
                  Close Preview
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm z-50 p-4">
          <div 
            className="p-8 rounded-lg shadow-lg w-full max-w-lg border border-gray-200"
            style={{ 
              background: 'rgba(255, 255, 255, 0.95)',
              fontFamily: COLORS.font,
              backdropFilter: 'blur(10px)'
            }}
          >
            <h2 className="text-xl font-bold mb-6" style={{ color: COLORS.primary }}>Confirm Submission</h2>
            
            <div className="mb-6">
              <p className="text-sm mb-3" style={{ color: COLORS.secondary, fontFamily: COLORS.font }}>
                Are you sure you want to submit your barangay clearance application? Please review your information before submitting.
              </p>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg border mb-6">
              <p className="text-sm font-semibold mb-2" style={{ color: COLORS.secondary, fontFamily: COLORS.font }}>Declaration:</p>
              <p className="text-sm mb-3" style={{ color: COLORS.secondary, fontFamily: COLORS.font }}>
                I hereby declare that all information provided is true and correct to the best of my knowledge. I understand that any false information may result in the rejection of my application.
              </p>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="declaration-checkbox"
                  checked={agreeDeclaration}
                  onChange={(e) => setAgreeDeclaration(e.target.checked)}
                  className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                />
                <label htmlFor="declaration-checkbox" className="ml-2 text-sm" style={{ color: COLORS.secondary, fontFamily: COLORS.font }}>
                  I agree to the above declaration *
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <button
                onClick={() => {
                  setShowConfirmModal(false);
                  setAgreeDeclaration(false);
                }}
                disabled={isSubmitting}
                style={{ background: COLORS.danger }}
                onMouseEnter={e => {
                  if (!isSubmitting) e.currentTarget.style.background = COLORS.accent;
                }}
                onMouseLeave={e => {
                  if (!isSubmitting) e.currentTarget.style.background = COLORS.danger;
                }}
                className={`px-6 py-2 rounded-lg font-semibold text-white ${
                  isSubmitting ? 'cursor-not-allowed' : 'transition-colors duration-300'
                }`}
              >
                Cancel
              </button>

              <button
                onClick={handleSubmit}
                disabled={isSubmitting || !agreeDeclaration}
                style={{ background: (isSubmitting || !agreeDeclaration) ? '#9CA3AF' : COLORS.success }}
                onMouseEnter={e => {
                  if (!(isSubmitting || !agreeDeclaration)) e.currentTarget.style.background = COLORS.accent;
                }}
                onMouseLeave={e => {
                  if (!(isSubmitting || !agreeDeclaration)) e.currentTarget.style.background = COLORS.success;
                }}
                className={`px-6 py-2 rounded-lg font-semibold text-white ${
                  (isSubmitting || !agreeDeclaration) ? 'cursor-not-allowed' : 'transition-colors duration-300'
                }`}
              >
                {isSubmitting ? 'Submitting...' : 'Confirm & Submit'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm z-50 p-4">
          <div 
            className="p-8 rounded-lg shadow-lg w-full max-w-lg border border-gray-200"
            style={{ 
              background: 'rgba(255, 255, 255, 0.95)',
              fontFamily: COLORS.font,
              backdropFilter: 'blur(10px)'
            }}
          >
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                <Check className="w-8 h-8 text-green-600" />
              </div>
            </div>
            
            <h2 className="text-xl font-bold text-center mb-4" style={{ color: COLORS.primary }}>{modalTitle}</h2>
            
            <div className="mb-6">
              <p className="text-sm text-center mb-3" style={{ color: COLORS.secondary, fontFamily: COLORS.font }}>
                {modalMessage}
              </p>
              <p className="text-xs text-center text-gray-500" style={{ fontFamily: COLORS.font }}>
                You will be redirected to your dashboard in a few seconds...
              </p>
            </div>

            <div className="flex justify-center">
              <button
                onClick={() => {
                  setShowSuccessModal(false);
                  navigate("/user/dashboard");
                }}
                style={{ background: COLORS.success }}
                onMouseEnter={e => e.currentTarget.style.background = COLORS.accent}
                onMouseLeave={e => e.currentTarget.style.background = COLORS.success}
                className="px-6 py-2 rounded-lg font-semibold text-white transition-colors duration-300"
              >
                Go to Dashboard Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error Modal */}
      {showErrorModal && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm z-50 p-4">
          <div 
            className="p-8 rounded-lg shadow-lg w-full max-w-lg border border-gray-200"
            style={{ 
              background: 'rgba(255, 255, 255, 0.95)',
              fontFamily: COLORS.font,
              backdropFilter: 'blur(10px)'
            }}
          >
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
                <X className="w-8 h-8 text-red-600" />
              </div>
            </div>
            
            <h2 className="text-xl font-bold text-center mb-4" style={{ color: COLORS.danger }}>{modalTitle}</h2>
            
            <div className="mb-6">
              <p className="text-sm text-center mb-3" style={{ color: COLORS.secondary, fontFamily: COLORS.font }}>
                {modalMessage}
              </p>
              <p className="text-xs text-center text-gray-500" style={{ fontFamily: COLORS.font }}>
                Please check your information and try again.
              </p>
            </div>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowErrorModal(false)}
                style={{ background: COLORS.danger }}
                onMouseEnter={e => e.currentTarget.style.background = COLORS.accent}
                onMouseLeave={e => e.currentTarget.style.background = COLORS.danger}
                className="px-6 py-2 rounded-lg font-semibold text-white transition-colors duration-300"
              >
                Close
              </button>
              
              {!showConfirmModal && (
                <button
                  onClick={() => {
                    setShowErrorModal(false);
                    setShowConfirmModal(true);
                  }}
                  style={{ background: COLORS.success }}
                  onMouseEnter={e => e.currentTarget.style.background = COLORS.accent}
                  onMouseLeave={e => e.currentTarget.style.background = COLORS.success}
                  className="px-6 py-2 rounded-lg font-semibold text-white transition-colors duration-300"
                >
                  Try Again
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}