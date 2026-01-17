import React, { useState } from 'react';
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

export default function BusinessRenewal() {
  const location = useLocation();
  const navigate = useNavigate();
  const application_type = location.state?.application_type || 'RENEWAL';

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [showDeclarationModal, setShowDeclarationModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalTitle, setModalTitle] = useState('');
  const [agreeDeclaration, setAgreeDeclaration] = useState(false);
  const [showPreview, setShowPreview] = useState({});

  const [formData, setFormData] = useState({
    // Step 1: Renewal Info
    permit_type: permitType,
    application_date: new Date().toISOString().split('T')[0],
    permit_number: '',
    permit_expiry: '',

    // Step 2: Applicant Info
    first_name: '',
    last_name: '',
    middle_name: '',
    suffix: '',
    contact_no: '',
    email: '',
    
    // Step 2 Extended: Personal Details
    date_of_birth: '',
    gender: '',
    civil_status: '',
    nationality: '',
    home_address: '',
    valid_id_type: '',
    valid_id_number: '',

    // Step 3: Business Info
    business_name: '',
    trade_name: '',
    gross_sales: '',
    total_employees: '',
    
    // Step 3 Extended: Business Details
    business_nature: '',
    building_type: '',
    capital_investment: 0,
    house_bldg_no: '',
    street: '',
    barangay: '',
    business_area: 0,
    total_floor_area: 0,
    operation_time_from: '',
    operation_time_to: '',
    zoning_permit_id: '',
    sanitation_permit_id: '',
    
    // Step 4: Documents
    barangay_clearance_file: null,
    bir_certificate_file: null,
    lease_or_title_file: null,
    fsic_file: null,
    owner_valid_id_file: null,
    id_picture_file: null,
    official_receipt_file: null,
    
    // Declaration
    owner_type_declaration: 'Business Owner',
    owner_representative_name: '',
    date_submitted: '',
  });

  const steps = [
    { id: 1, title: 'Renewal Information', description: 'Existing permit details' },
    { id: 2, title: 'Applicant Information', description: 'Personal details' },
    { id: 3, title: 'Business Information', description: 'Updated business info' },
    { id: 4, title: 'Documents', description: 'Upload required documents' },
    { id: 5, title: 'Declaration & Submit', description: 'Finalize and submit' }
  ];

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    
    if (type === 'file') {
      const file = files[0];
      setFormData(prev => ({
        ...prev,
        [name]: file || null
      }));
    } else if (name === "contact_no") {
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

  const validateStep = (step) => {
    const newErrors = {};
    
    if (step === 1) {
      if (!formData.permit_number || formData.permit_number.trim() === '') newErrors.permit_number = 'Permit number is required';
      if (!formData.permit_expiry) newErrors.permit_expiry = 'Permit expiry date is required';
    }
    
    if (step === 2) {
      if (!formData.first_name || formData.first_name.trim() === '') newErrors.first_name = 'First name is required';
      if (!formData.last_name || formData.last_name.trim() === '') newErrors.last_name = 'Last name is required';
      if (!formData.contact_no || formData.contact_no.trim() === '') newErrors.contact_no = 'Contact number is required';
      if (!formData.email || formData.email.trim() === '') newErrors.email = 'Email is required';
      if (!formData.date_of_birth) newErrors.date_of_birth = 'Date of birth is required';
      if (!formData.gender) newErrors.gender = 'Gender is required';
      if (!formData.civil_status) newErrors.civil_status = 'Civil status is required';
      if (!formData.nationality || formData.nationality.trim() === '') newErrors.nationality = 'Nationality is required';
      if (!formData.home_address || formData.home_address.trim() === '') newErrors.home_address = 'Home address is required';
      if (!formData.valid_id_type) newErrors.valid_id_type = 'Valid ID type is required';
      if (!formData.valid_id_number || formData.valid_id_number.trim() === '') newErrors.valid_id_number = 'Valid ID number is required';
    }
    
    if (step === 3) {
      if (!formData.business_name || formData.business_name.trim() === '') newErrors.business_name = 'Business name is required';
      if (!formData.trade_name || formData.trade_name.trim() === '') newErrors.trade_name = 'Trade name is required';
      if (!formData.business_nature) newErrors.business_nature = 'Nature of business is required';
      if (!formData.building_type) newErrors.building_type = 'Building type is required';
      if (!formData.house_bldg_no || formData.house_bldg_no.trim() === '') newErrors.house_bldg_no = 'House/Building number is required';
      if (!formData.street || formData.street.trim() === '') newErrors.street = 'Street is required';
      if (!formData.barangay || formData.barangay.trim() === '') newErrors.barangay = 'Barangay is required';
      if (!formData.business_area || formData.business_area <= 0) newErrors.business_area = 'Business area is required';
      if (!formData.total_floor_area || formData.total_floor_area <= 0) newErrors.total_floor_area = 'Total floor area is required';
      if (!formData.operation_time_from) newErrors.operation_time_from = 'Operation start time is required';
      if (!formData.operation_time_to) newErrors.operation_time_to = 'Operation end time is required';
      if (!formData.zoning_permit_id || formData.zoning_permit_id.trim() === '') newErrors.zoning_permit_id = 'Zoning permit ID is required';
      if (!formData.sanitation_permit_id || formData.sanitation_permit_id.trim() === '') newErrors.sanitation_permit_id = 'Sanitation permit ID is required';
    }
    
    if (step === 4) {
      if (!formData.barangay_clearance_file) newErrors.barangay_clearance_file = 'Barangay clearance is required';
      if (!formData.bir_certificate_file) newErrors.bir_certificate_file = 'BIR certificate is required';
      if (!formData.lease_or_title_file) newErrors.lease_or_title_file = 'Lease contract or land title is required';
      if (!formData.fsic_file) newErrors.fsic_file = 'Fire Safety Inspection Certificate is required';
      if (!formData.owner_valid_id_file) newErrors.owner_valid_id_file = 'Owner valid ID is required';
      if (!formData.id_picture_file) newErrors.id_picture_file = 'ID picture is required';
    }
    
    if (step === 5) {
      if (!formData.owner_representative_name || formData.owner_representative_name.trim() === '') newErrors.owner_representative_name = 'Name is required';
      if (!formData.date_submitted) newErrors.date_submitted = 'Date submitted is required';
    }
    
    return newErrors;
  };

  const nextStep = () => {
    const errors = validateStep(currentStep);
    if (Object.keys(errors).length > 0) {
      setSubmitStatus({
        type: 'error',
        message: 'Please complete all required fields for this step.'
      });
      return;
    }
    setSubmitStatus(null);
    setCurrentStep(s => Math.min(s + 1, steps.length));
  };

  const prevStep = () => setCurrentStep(s => Math.max(s - 1, 1));

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (currentStep === steps.length) {
      const errors = validateStep(currentStep);
      if (Object.keys(errors).length > 0) {
        setSubmitStatus({
          type: 'error',
          message: 'Please complete all required fields before submitting.'
        });
        return;
      }
      setShowDeclarationModal(true);
    } else {
      nextStep();
    }
  };

  const confirmDeclaration = async () => {
    if (!agreeDeclaration) {
      setSubmitStatus({ type: 'error', message: 'You must agree to the declaration to proceed.' });
      setShowDeclarationModal(false);
      return;
    }
    
    setIsSubmitting(true);
    setShowDeclarationModal(false);

    try {
      const formDataToSend = new FormData();
      
      // Append all form data
      Object.entries(formData).forEach(([key, value]) => {
        if (value instanceof File) {
          formDataToSend.append(key, value);
        } else if (value !== null && value !== undefined) {
          formDataToSend.append(key, String(value));
        }
      });

      const response = await fetch('/user/renewal-form/', {
        method: 'POST',
        body: formDataToSend,
      });

      const data = await response.json();
      if (data.success) {
        showSuccessMessage(data.message || 'Renewal application submitted successfully!');
        
        setTimeout(() => {
          navigate('/user/permittracker');
        }, 3000);
      } else {
        showErrorMessage(data.message || 'Failed to submit renewal application');
      }
    } catch (error) {
      console.error('Submission error:', error);
      showErrorMessage('Network error: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatLabel = (field) => {
    return field.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold mb-4" style={{ color: COLORS.secondary }}>Renewal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 font-medium" style={{ color: COLORS.secondary }}>Permit Number *</label>
                <input
                  type="text"
                  name="permit_number"
                  value={formData.permit_number}
                  onChange={handleChange}
                  className="w-full p-3 border border-black rounded-lg"
                  style={{ color: COLORS.secondary, fontFamily: COLORS.font }}
                  required
                />
                {submitStatus?.type === 'error' && !formData.permit_number && (
                  <p className="text-red-600 text-sm mt-1" style={{ fontFamily: COLORS.font }}>Permit number is required</p>
                )}
              </div>
              <div>
                <label className="block mb-2 font-medium" style={{ color: COLORS.secondary }}>Permit Expiry Date *</label>
                <input
                  type="date"
                  name="permit_expiry"
                  value={formData.permit_expiry}
                  onChange={handleChange}
                  className="w-full p-3 border border-black rounded-lg"
                  style={{ color: COLORS.secondary, fontFamily: COLORS.font }}
                  required
                />
                {submitStatus?.type === 'error' && !formData.permit_expiry && (
                  <p className="text-red-600 text-sm mt-1" style={{ fontFamily: COLORS.font }}>Permit expiry date is required</p>
                )}
              </div>
              <div>
                <label className="block mb-2 font-medium" style={{ color: COLORS.secondary }}>Application Date</label>
                <input
                  type="date"
                  name="application_date"
                  value={formData.application_date}
                  readOnly
                  className="w-full p-3 border border-black rounded-lg bg-gray-100"
                  style={{ color: COLORS.secondary, fontFamily: COLORS.font }}
                />
              </div>
              <div>
                <label className="block mb-2 font-medium" style={{ color: COLORS.secondary }}>Application Type</label>
                <input
                  type="text"
                  name="application_type"
                  value={formData.application_type}
                  readOnly
                  className="w-full p-3 border border-black rounded-lg bg-gray-100"
                  style={{ color: COLORS.secondary, fontFamily: COLORS.font }}
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold mb-4" style={{ color: COLORS.secondary }}>Applicant Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {['first_name', 'middle_name', 'last_name', 'suffix', 'contact_no', 'email'].map(field => (
                <div key={field}>
                  <label className="block mb-2 font-medium" style={{ color: COLORS.secondary }}>{formatLabel(field)} *</label>
                  <input
                    type={field === 'email' ? 'email' : 'text'}
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    className="w-full p-3 border border-black rounded-lg"
                    style={{ color: COLORS.secondary, fontFamily: COLORS.font }}
                    required
                  />
                  {submitStatus?.type === 'error' && !formData[field] && field !== 'middle_name' && field !== 'suffix' && (
                    <p className="text-red-600 text-sm mt-1" style={{ fontFamily: COLORS.font }}>{formatLabel(field)} is required</p>
                  )}
                </div>
              ))}
              
              <div>
                <label className="block mb-2 font-medium" style={{ color: COLORS.secondary }}>Date of Birth *</label>
                <input
                  type="date"
                  name="date_of_birth"
                  value={formData.date_of_birth}
                  onChange={handleChange}
                  className="w-full p-3 border border-black rounded-lg"
                  style={{ color: COLORS.secondary, fontFamily: COLORS.font }}
                  required
                />
              </div>
              
              <div>
                <label className="block mb-2 font-medium" style={{ color: COLORS.secondary }}>Gender *</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full p-3 border border-black rounded-lg"
                  style={{ color: COLORS.secondary, fontFamily: COLORS.font }}
                  required
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div>
                <label className="block mb-2 font-medium" style={{ color: COLORS.secondary }}>Civil Status *</label>
                <select
                  name="civil_status"
                  value={formData.civil_status}
                  onChange={handleChange}
                  className="w-full p-3 border border-black rounded-lg"
                  style={{ color: COLORS.secondary, fontFamily: COLORS.font }}
                  required
                >
                  <option value="">Select civil status</option>
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                  <option value="Widowed">Widowed</option>
                  <option value="Separated">Separated</option>
                </select>
              </div>
              
              <div>
                <label className="block mb-2 font-medium" style={{ color: COLORS.secondary }}>Nationality *</label>
                <select
                  name="nationality"
                  value={formData.nationality}
                  onChange={handleChange}
                  className="w-full p-3 border border-black rounded-lg"
                  style={{ color: COLORS.secondary, fontFamily: COLORS.font }}
                  required
                >
                  <option value="">Select nationality</option>
                  {NATIONALITIES.map(nat => (
                    <option key={nat} value={nat}>{nat}</option>
                  ))}
                </select>
              </div>
              
              <div className="md:col-span-2">
                <label className="block mb-2 font-medium" style={{ color: COLORS.secondary }}>Home Address *</label>
                <input
                  type="text"
                  name="home_address"
                  value={formData.home_address}
                  onChange={handleChange}
                  className="w-full p-3 border border-black rounded-lg"
                  style={{ color: COLORS.secondary, fontFamily: COLORS.font }}
                  placeholder="Enter complete home address"
                  required
                />
              </div>
              
              <div>
                <label className="block mb-2 font-medium" style={{ color: COLORS.secondary }}>Valid ID Type *</label>
                <select
                  name="valid_id_type"
                  value={formData.valid_id_type}
                  onChange={handleChange}
                  className="w-full p-3 border border-black rounded-lg"
                  style={{ color: COLORS.secondary, fontFamily: COLORS.font }}
                  required
                >
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
              </div>
              
              <div>
                <label className="block mb-2 font-medium" style={{ color: COLORS.secondary }}>Valid ID Number *</label>
                <input
                  type="text"
                  name="valid_id_number"
                  value={formData.valid_id_number}
                  onChange={handleChange}
                  className="w-full p-3 border border-black rounded-lg"
                  style={{ color: COLORS.secondary, fontFamily: COLORS.font }}
                  placeholder="Enter ID number"
                  required
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold mb-4" style={{ color: COLORS.secondary }}>Business Information</h3>
            
            <div className="mb-6">
              <h4 className="text-lg font-semibold mb-4" style={{ color: COLORS.secondary }}>Basic Business Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 font-medium" style={{ color: COLORS.secondary }}>Registered Business Name *</label>
                  <input
                    type="text"
                    name="business_name"
                    value={formData.business_name}
                    onChange={handleChange}
                    className="w-full p-3 border border-black rounded-lg"
                    style={{ color: COLORS.secondary, fontFamily: COLORS.font }}
                    required
                  />
                </div>
                
                <div>
                  <label className="block mb-2 font-medium" style={{ color: COLORS.secondary }}>Trade / Brand Name *</label>
                  <input
                    type="text"
                    name="trade_name"
                    value={formData.trade_name}
                    onChange={handleChange}
                    className="w-full p-3 border border-black rounded-lg"
                    style={{ color: COLORS.secondary, fontFamily: COLORS.font }}
                    required
                  />
                </div>
                
                <div>
                  <label className="block mb-2 font-medium" style={{ color: COLORS.secondary }}>Nature of Business *</label>
                  <select
                    name="business_nature"
                    value={formData.business_nature}
                    onChange={handleChange}
                    className="w-full p-3 border border-black rounded-lg"
                    style={{ color: COLORS.secondary, fontFamily: COLORS.font }}
                    required
                  >
                    <option value="">Select Business Nature</option>
                    <option value="Retail / Sari-sari Store">Retail / Sari-sari Store</option>
                    <option value="Grocery / Mini Grocery">Grocery / Mini Grocery</option>
                    <option value="Restaurant / Eatery / Food Service">Restaurant / Eatery / Food Service</option>
                    <option value="Catering Services">Catering Services</option>
                    <option value="Wholesale Trade">Wholesale Trade</option>
                    <option value="Manufacturing (Light Industry)">Manufacturing (Light Industry)</option>
                    <option value="Repairs / Technical Services">Repairs / Technical Services (Electronics, Appliances)</option>
                    <option value="Printing / Publishing">Printing / Publishing</option>
                    <option value="Beauty / Barber / Salon / Spa">Beauty / Barber / Salon / Spa</option>
                    <option value="Health / Clinic / Pharmacy">Health / Clinic / Pharmacy</option>
                    <option value="Education / Tutorial Center">Education / Tutorial Center</option>
                    <option value="Office / Administrative Services">Office / Administrative Services</option>
                    <option value="Logistics / Transport / Courier">Logistics / Transport / Courier</option>
                    <option value="Real Estate / Leasing / Rental Services">Real Estate / Leasing / Rental Services</option>
                    <option value="Construction / Contractor">Construction / Contractor</option>
                    <option value="Workshops (Metal, Carpentry, Furniture)">Workshops (Metal, Carpentry, Furniture)</option>
                    <option value="Bakery / Pastry / Cake Shop">Bakery / Pastry / Cake Shop</option>
                    <option value="Laundry / Dry Cleaning">Laundry / Dry Cleaning</option>
                    <option value="Automotive (Repair, Car Wash)">Automotive (Repair, Car Wash)</option>
                    <option value="Water Refilling Station">Water Refilling Station</option>
                    <option value="Entertainment / Recreation">Entertainment / Recreation</option>
                    <option value="Advertising / Signage">Advertising / Signage</option>
                    <option value="Online Business / E-commerce">Online Business / E-commerce</option>
                    <option value="Agricultural / Farming">Agricultural / Farming</option>
                  </select>
                </div>
                
                <div>
                  <label className="block mb-2 font-medium" style={{ color: COLORS.secondary }}>Building Type *</label>
                  <select
                    name="building_type"
                    value={formData.building_type}
                    onChange={handleChange}
                    className="w-full p-3 border border-black rounded-lg"
                    style={{ color: COLORS.secondary, fontFamily: COLORS.font }}
                    required
                  >
                    <option value="">Select Building Type</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Residential">Residential</option>
                    <option value="Industrial">Industrial</option>
                  </select>
                </div>
                
                <div>
                  <label className="block mb-2 font-medium" style={{ color: COLORS.secondary }}>Capital Investment (₱)</label>
                  <input
                    type="number"
                    name="capital_investment"
                    value={formData.capital_investment}
                    onChange={handleChange}
                    className="w-full p-3 border border-black rounded-lg"
                    style={{ color: COLORS.secondary, fontFamily: COLORS.font }}
                  />
                </div>
                
                <div>
                  <label className="block mb-2 font-medium" style={{ color: COLORS.secondary }}>Gross Sales (₱)</label>
                  <input
                    type="number"
                    name="gross_sales"
                    value={formData.gross_sales}
                    onChange={handleChange}
                    className="w-full p-3 border border-black rounded-lg"
                    style={{ color: COLORS.secondary, fontFamily: COLORS.font }}
                  />
                </div>
                
                <div>
                  <label className="block mb-2 font-medium" style={{ color: COLORS.secondary }}>Total Employees</label>
                  <input
                    type="number"
                    name="total_employees"
                    value={formData.total_employees}
                    onChange={handleChange}
                    className="w-full p-3 border border-black rounded-lg"
                    style={{ color: COLORS.secondary, fontFamily: COLORS.font }}
                  />
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4" style={{ color: COLORS.secondary }}>Business Address</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 font-medium" style={{ color: COLORS.secondary }}>House/Bldg. No *</label>
                  <input
                    type="text"
                    name="house_bldg_no"
                    value={formData.house_bldg_no}
                    onChange={handleChange}
                    className="w-full p-3 border border-black rounded-lg"
                    style={{ color: COLORS.secondary, fontFamily: COLORS.font }}
                    required
                  />
                </div>
                
                <div>
                  <label className="block mb-2 font-medium" style={{ color: COLORS.secondary }}>Street *</label>
                  <input
                    type="text"
                    name="street"
                    value={formData.street}
                    onChange={handleChange}
                    className="w-full p-3 border border-black rounded-lg"
                    style={{ color: COLORS.secondary, fontFamily: COLORS.font }}
                    required
                  />
                </div>
                
                <div>
                  <label className="block mb-2 font-medium" style={{ color: COLORS.secondary }}>Barangay *</label>
                  <select
                    name="barangay"
                    value={formData.barangay}
                    onChange={handleChange}
                    className="w-full p-3 border border-black rounded-lg"
                    style={{ color: COLORS.secondary, fontFamily: COLORS.font }}
                    required
                  >
                    <option value="">Select a barangay</option>
                    {Array.from({length: 175}, (_, i) => (
                      <option key={`Barangay ${i+1}`} value={`Barangay ${i+1}`}>
                        Barangay {i+1}
                      </option>
                    ))}
                    {['A', 'B', 'C', 'D', 'E', 'F'].map(letter => (
                      <option key={`Barangay 176-${letter}`} value={`Barangay 176-${letter}`}>
                        Barangay 176-{letter}
                      </option>
                    ))}
                    {Array.from({length: 12}, (_, i) => (
                      <option key={`Barangay ${177 + i}`} value={`Barangay ${177 + i}`}>
                        Barangay {177 + i}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block mb-2 font-medium" style={{ color: COLORS.secondary }}>Province</label>
                  <input
                    type="text"
                    value="Metro Manila"
                    readOnly
                    className="w-full p-3 border border-black rounded-lg bg-gray-100"
                    style={{ color: COLORS.secondary, fontFamily: COLORS.font }}
                  />
                </div>
                
                <div>
                  <label className="block mb-2 font-medium" style={{ color: COLORS.secondary }}>City/Municipality</label>
                  <input
                    type="text"
                    value="Caloocan City"
                    readOnly
                    className="w-full p-3 border border-black rounded-lg bg-gray-100"
                    style={{ color: COLORS.secondary, fontFamily: COLORS.font }}
                  />
                </div>
                
                <div>
                  <label className="block mb-2 font-medium" style={{ color: COLORS.secondary }}>Business Area (sq. m.) *</label>
                  <input
                    type="number"
                    name="business_area"
                    value={formData.business_area}
                    onChange={handleChange}
                    className="w-full p-3 border border-black rounded-lg"
                    style={{ color: COLORS.secondary, fontFamily: COLORS.font }}
                    required
                  />
                </div>
                
                <div>
                  <label className="block mb-2 font-medium" style={{ color: COLORS.secondary }}>Total Floor Area (sq. m.) *</label>
                  <input
                    type="number"
                    name="total_floor_area"
                    value={formData.total_floor_area}
                    onChange={handleChange}
                    className="w-full p-3 border border-black rounded-lg"
                    style={{ color: COLORS.secondary, fontFamily: COLORS.font }}
                    required
                  />
                </div>
                
                <div>
                  <label className="block mb-2 font-medium" style={{ color: COLORS.secondary }}>Zoning Permit ID *</label>
                  <input
                    type="text"
                    name="zoning_permit_id"
                    value={formData.zoning_permit_id}
                    onChange={handleChange}
                    className="w-full p-3 border border-black rounded-lg"
                    style={{ color: COLORS.secondary, fontFamily: COLORS.font }}
                    required
                  />
                </div>
                
                <div>
                  <label className="block mb-2 font-medium" style={{ color: COLORS.secondary }}>Sanitation Permit ID *</label>
                  <input
                    type="text"
                    name="sanitation_permit_id"
                    value={formData.sanitation_permit_id}
                    onChange={handleChange}
                    className="w-full p-3 border border-black rounded-lg"
                    style={{ color: COLORS.secondary, fontFamily: COLORS.font }}
                    required
                  />
                </div>
                
                <div>
                  <label className="block mb-2 font-medium" style={{ color: COLORS.secondary }}>Operation Time From *</label>
                  <input
                    type="time"
                    name="operation_time_from"
                    value={formData.operation_time_from}
                    onChange={handleChange}
                    className="w-full p-3 border border-black rounded-lg"
                    style={{ color: COLORS.secondary, fontFamily: COLORS.font }}
                    required
                  />
                </div>
                
                <div>
                  <label className="block mb-2 font-medium" style={{ color: COLORS.secondary }}>Operation Time To *</label>
                  <input
                    type="time"
                    name="operation_time_to"
                    value={formData.operation_time_to}
                    onChange={handleChange}
                    className="w-full p-3 border border-black rounded-lg"
                    style={{ color: COLORS.secondary, fontFamily: COLORS.font }}
                    required
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold mb-4" style={{ color: COLORS.secondary }}>Required Documents</h3>
            
            <div className="space-y-4">
              {[
                { name: 'barangay_clearance_file', label: 'Barangay Clearance *', required: true },
                { name: 'bir_certificate_file', label: 'BIR Certificate of Registration *', required: true },
                { name: 'lease_or_title_file', label: 'Lease Contract / Land Title *', required: true },
                { name: 'fsic_file', label: 'Fire Safety Inspection Certificate (FSIC) *', required: true },
                { name: 'owner_valid_id_file', label: 'Owner Valid ID *', required: true },
                { name: 'id_picture_file', label: '2x2 ID Picture *', required: true, accept: '.jpg,.jpeg,.png' },
                { name: 'official_receipt_file', label: 'Official Receipt of Payment', required: false }
              ].map(doc => (
                <div key={doc.name}>
                  <label className="block text-sm font-medium mb-1" style={{ color: COLORS.secondary }}>
                    {doc.label}
                  </label>
                  <div className="flex items-center gap-3 p-3 border border-black rounded w-full bg-white">
                    {formData[doc.name] ? (
                      <Check className="w-5 h-5 text-green-600" />
                    ) : (
                      <Upload className="w-5 h-5 text-gray-500" />
                    )}
                    <input
                      type="file"
                      name={doc.name}
                      onChange={handleChange}
                      accept={doc.accept || ".pdf,.jpg,.png,.doc,.docx"}
                      className="w-full text-sm file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-sm file:font-medium file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                      style={{ fontFamily: COLORS.font }}
                      required={doc.required}
                    />
                  </div>
                  {submitStatus?.type === 'error' && doc.required && !formData[doc.name] && (
                    <p className="text-red-600 text-sm mt-1" style={{ fontFamily: COLORS.font }}>{doc.label.replace(' *', '')} is required</p>
                  )}
                  
                  {formData[doc.name] && (
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-sm text-gray-600">
                        Uploaded: {formData[doc.name].name}
                      </p>
                      <button
                        type="button"
                        onClick={() => previewFile(formData[doc.name])}
                        className="flex items-center gap-1 px-3 py-1 text-sm rounded hover:bg-gray-100 transition-colors duration-300"
                        style={{ color: COLORS.secondary }}
                      >
                        <Eye className="w-4 h-4" />
                        Preview
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold mb-4" style={{ color: COLORS.secondary }}>Declaration & Submission</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <div className="flex items-center gap-4 mb-4">
                  <label className="flex items-center gap-2" style={{ color: COLORS.secondary, fontFamily: COLORS.font }}>
                    <input
                      type="radio"
                      name="owner_type_declaration"
                      value="Business Owner"
                      checked={formData.owner_type_declaration === "Business Owner"}
                      onChange={handleChange}
                      className="accent-blue-600"
                    />
                    Business Owner
                  </label>

                  <label className="flex items-center gap-2" style={{ color: COLORS.secondary, fontFamily: COLORS.font }}>
                    <input
                      type="radio"
                      name="owner_type_declaration"
                      value="Representative"
                      checked={formData.owner_type_declaration === "Representative"}
                      onChange={handleChange}
                      className="accent-blue-600"
                    />
                    Representative
                  </label>
                </div>

                <div className="mb-4">
                  <label className="block mb-2 font-medium" style={{ color: COLORS.secondary, fontFamily: COLORS.font }}>
                    Name: <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="owner_representative_name"
                    value={formData.owner_representative_name}
                    onChange={handleChange}
                    placeholder={
                      formData.owner_type_declaration === "Business Owner" 
                        ? "Enter full name of business owner" 
                        : "Enter full name of representative"
                    }
                    className="w-full p-3 border border-black rounded-lg"
                    style={{ color: COLORS.secondary, fontFamily: COLORS.font }}
                    required
                  />
                  {submitStatus?.type === 'error' && !formData.owner_representative_name && (
                    <p className="text-red-600 text-sm mt-1" style={{ fontFamily: COLORS.font }}>Name is required</p>
                  )}
                </div>

                <div className="mb-4">
                  <label className="block mb-2 font-medium" style={{ color: COLORS.secondary, fontFamily: COLORS.font }}>
                    Date Submitted: <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="date_submitted"
                    value={formData.date_submitted}
                    onChange={handleChange}
                    className="w-full p-3 border border-black rounded-lg"
                    style={{ color: COLORS.secondary, fontFamily: COLORS.font }}
                    required
                  />
                  {submitStatus?.type === 'error' && !formData.date_submitted && (
                    <p className="text-red-600 text-sm mt-1" style={{ fontFamily: COLORS.font }}>Date submitted is required</p>
                  )}
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg border">
              <p className="text-sm font-semibold mb-2" style={{ color: COLORS.secondary, fontFamily: COLORS.font }}>Declaration:</p>
              <p className="text-sm mb-3" style={{ color: COLORS.secondary, fontFamily: COLORS.font }}>
                I hereby declare that all information provided in this business renewal application is true and correct to the best of my knowledge. I understand that any false information may result in the rejection of my application.
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
          <h1 className="text-2xl md:text-4xl font-bold" style={{ color: COLORS.primary }}>BUSINESS PERMIT RENEWAL APPLICATION</h1>
          <p className="mt-2" style={{ color: COLORS.secondary }}>
            Renew your existing business permit for continued operation.
          </p>
        </div>
        <button
          onClick={() => navigate('/user/business/type')}
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

      {submitStatus && (
        <div className={`p-4 mb-6 rounded ${submitStatus.type === 'success' ? 'bg-green-100 text-green-700 border border-green-300' : 'bg-red-100 text-red-700 border border-red-300'}`} style={{ fontFamily: COLORS.font }}>
          {submitStatus.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
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
              style={{ background: COLORS.success }}
              onMouseEnter={e => e.currentTarget.style.background = COLORS.accent}
              onMouseLeave={e => e.currentTarget.style.background = COLORS.success}
              className="px-6 py-3 rounded-lg font-semibold text-white transition-colors duration-300"
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              onMouseEnter={e => e.currentTarget.style.background = COLORS.accent}
              onMouseLeave={e => e.currentTarget.style.background = COLORS.success}
              style={{ background: COLORS.success }}
              className={`px-6 py-3 rounded-lg font-semibold text-white ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'transition-colors duration-300'}`}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
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

      {/* Declaration Modal */}
      {showDeclarationModal && (
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
              <div className="p-4 bg-gray-50 rounded-lg border mb-4">
                <p className="text-sm font-semibold mb-2" style={{ color: COLORS.secondary, fontFamily: COLORS.font }}>Declaration:</p>
                <p className="text-sm mb-3" style={{ color: COLORS.secondary, fontFamily: COLORS.font }}>
                  I hereby declare that all information provided is true and correct to the best of my knowledge. I understand that any false information may result in the rejection of my application.
                </p>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="modal-declaration-checkbox"
                    checked={agreeDeclaration}
                    onChange={(e) => setAgreeDeclaration(e.target.checked)}
                    className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  />
                  <label htmlFor="modal-declaration-checkbox" className="ml-2 text-sm" style={{ color: COLORS.secondary, fontFamily: COLORS.font }}>
                    I agree to the above declaration *
                  </label>
                </div>
              </div>
              
              <p className="text-sm" style={{ color: COLORS.secondary, fontFamily: COLORS.font }}>
                Are you sure you want to submit your business permit renewal application?
              </p>
            </div>

            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowDeclarationModal(false)}
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
                onClick={confirmDeclaration}
                disabled={isSubmitting || !agreeDeclaration}
                style={{ background: (!agreeDeclaration || isSubmitting) ? '#9CA3AF' : COLORS.success }}
                onMouseEnter={e => {
                  if (!isSubmitting && agreeDeclaration) e.currentTarget.style.background = COLORS.accent;
                }}
                onMouseLeave={e => {
                  if (!isSubmitting && agreeDeclaration) e.currentTarget.style.background = COLORS.success;
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
                  navigate("/user/permittracker");
                }}
                style={{ background: COLORS.success }}
                onMouseEnter={e => e.currentTarget.style.background = COLORS.accent}
                onMouseLeave={e => e.currentTarget.style.background = COLORS.success}
                className="px-6 py-2 rounded-lg font-semibold text-white transition-colors duration-300"
              >
                Track Application
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
              
              {!showDeclarationModal && (
                <button
                  onClick={() => {
                    setShowErrorModal(false);
                    setShowDeclarationModal(true);
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