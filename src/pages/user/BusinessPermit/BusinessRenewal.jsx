import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Upload, Check, X, Eye, FileText, Loader2 } from "lucide-react";

const COLORS = {
  primary: '#4A90E2',
  secondary: '#000000',
  accent: '#FDA811',
  success: '#4CAF50',
  danger: '#E53935',
  background: '#FBFBFB',
  font: 'Montserrat, Arial, sans-serif'
};

export default function BusinessRenewal() {
  const location = useLocation();
  const navigate = useNavigate();
  const application_type = location.state?.application_type || 'RENEWAL';
  const permitType = location.state?.permit_type || 'NEW_BUSINESS_PERMIT';

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalTitle, setModalTitle] = useState('');
  const [agreeDeclaration, setAgreeDeclaration] = useState(false);
  const [showPreview, setShowPreview] = useState({});
  
  const [isLoadingOwnerType, setIsLoadingOwnerType] = useState(false);
  const [permitNumberEntered, setPermitNumberEntered] = useState('');

  const [formData, setFormData] = useState({
    // Step 1: Renewal Info
    permit_type: permitType,
    application_date: new Date().toISOString().split('T')[0],
    permit_number: '',
    permit_expiry: '',
    official_receipt_no: '',
    owner_type: '', // Will be fetched from API based on permit number

    business_name: '',
    trade_name: '',
    gross_sales: '',
    total_employees: '',
    
    business_nature: '',
    
    // Documents
    barangay_clearance_file: null,
    owner_valid_id_file: null,
    official_receipt_file: null,
  });

  const steps = [
    { id: 1, title: 'Renewal Information', description: 'Existing permit details' },
    { id: 2, title: 'Business Information', description: 'Updated business info' },
    { id: 3, title: 'Documents', description: 'Upload required documents' },
    { id: 4, title: 'Review', description: 'Review your application' }
  ];

  // Debounce the fetch function
  useEffect(() => {
    const timer = setTimeout(() => {
      if (permitNumberEntered && permitNumberEntered.trim() !== '' && permitNumberEntered.length >= 3) {
        // fetchBusinessData(permitNumberEntered); // Commented out for now
      }
    }, 1000); // 1 second debounce

    return () => clearTimeout(timer);
  }, [permitNumberEntered]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    
    if (type === 'file') {
      const file = files[0];
      setFormData(prev => ({
        ...prev,
        [name]: file || null
      }));
    } else if (name === "permit_number") {
      // Update permit number and trigger fetch
      setPermitNumberEntered(value);
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
      
      // Reset data if permit number is cleared
      if (!value || value.trim() === '') {
        setFormData(prev => ({
          ...prev,
          owner_type: '',
          business_name: '',
          trade_name: '',
          business_nature: '',
          permit_expiry: ''
        }));
      }
    } else if (name === "gross_sales" || name === "total_employees") {
      setFormData(prev => ({
        ...prev,
        [name]: value === '' ? '' : Number(value)
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
      if (!formData.permit_number || formData.permit_number.trim() === '') {
        newErrors.permit_number = 'Permit number is required';
      }
      if (!formData.permit_expiry) {
        newErrors.permit_expiry = 'Permit expiry date is required';
      }
      if (!formData.owner_type) {
        newErrors.owner_type = 'Owner type is required';
      }
      if (!formData.official_receipt_no) {
        newErrors.official_receipt_no = 'Official receipt number is required';
      }
    }
    
    if (step === 2) {
      if (!formData.business_name || formData.business_name.trim() === '') {
        newErrors.business_name = 'Business name is required';
      }
      if (!formData.trade_name || formData.trade_name.trim() === '') {
        newErrors.trade_name = 'Trade name is required';
      }
      if (!formData.business_nature) {
        newErrors.business_nature = 'Nature of business is required';
      }
    }
    
    if (step === 3) {
      if (!formData.barangay_clearance_file) {
        newErrors.barangay_clearance_file = 'Barangay clearance is required';
      }
      if (!formData.owner_valid_id_file) {
        newErrors.owner_valid_id_file = 'Owner valid ID is required';
      }
      if (!formData.official_receipt_file) {
        newErrors.official_receipt_file = 'Official receipt is required';
      }
    }
    
    return newErrors;
  };
const isEmpty = (val) => {
  if (val instanceof File) return false; // File is not empty
  return val === undefined || val === null || 
         (typeof val === "string" && val.trim() === "");
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

  const handleFormSubmit = (e) => {
    e.preventDefault();
    
    if (currentStep < steps.length) {
      // For steps 1-3, just go to next step
      nextStep();
    } else {
      // On Step 4 (Review), show confirmation modal
      setShowConfirmModal(true);
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
    
    // Debug: Log all form data
    console.log('=== Form Data to Send ===');
    
    // Add ALL form data using ORIGINAL field names
    Object.keys(formData).forEach((fieldName) => {
      const value = formData[fieldName];
      
      // Skip null/undefined values for strings, but keep 0 for numbers
      if (value !== null && value !== undefined) {
        if (typeof value === 'number') {
          formDataToSend.append(fieldName, value.toString());
          console.log(`${fieldName}: ${value} (number)`);
        } else if (value instanceof File) {
          formDataToSend.append(fieldName, value);
          console.log(`${fieldName}: ${value.name} (file)`);
        } else if (typeof value === 'string' && value.trim() !== '') {
          formDataToSend.append(fieldName, value);
          console.log(`${fieldName}: ${value}`);
        } else if (typeof value === 'string' && value.trim() === '') {
          // Send empty string for required fields
          formDataToSend.append(fieldName, '');
        }
      } else {
        // For null/undefined, send empty string for string fields
        formDataToSend.append(fieldName, '');
      }
    });

    // Add boolean flags for document attachments
    const documentFlags = {
      has_barangay_clearance: formData.barangay_clearance || formData.barangay_clearance_id,
      has_bir_certificate: !!formData.bir_certificate,
      has_lease_or_title: !!formData.lease_or_title,
      has_fsic: !!formData.fsic,
      has_owner_valid_id: !!formData.owner_valid_id,
      has_id_picture: !!formData.id_picture,
      has_official_receipt: !!formData.official_receipt_file,
      has_owner_scanned_id: !!formData.owner_scanned_id,
      has_dti_registration: !!formData.dti_registration,
      has_sec_registration: !!formData.sec_registration,
      has_representative_scanned_id: !!formData.representative_scanned_id
    };
    
    Object.keys(documentFlags).forEach(flag => {
      formDataToSend.append(flag, documentFlags[flag] ? '1' : '0');
    });

    // Add barangay clearance status
    const barangayClearanceStatus = formData.barangay_clearance || formData.barangay_clearance_id ? 'ID_PROVIDED' : 'PENDING';
    formDataToSend.append('barangay_clearance_status', barangayClearanceStatus);

    // Add required fields that might be missing
    if (!formDataToSend.has('owner_last_name') && formData.last_name) {
      formDataToSend.append('owner_last_name', formData.last_name);
    }
    if (!formDataToSend.has('owner_first_name') && formData.first_name) {
      formDataToSend.append('owner_first_name', formData.first_name);
    }
    if (!formDataToSend.has('owner_middle_name') && formData.middle_name) {
      formDataToSend.append('owner_middle_name', formData.middle_name || '');
    }

    // Log FormData entries for debugging
    console.log('FormData entries:');
    for (let [key, value] of formDataToSend.entries()) {
      if (value instanceof File) {
        console.log(`${key}: [File] ${value.name} (${value.size} bytes)`);
      } else {
        console.log(`${key}: ${value}`);
      }
    }

    // Test connection
    try {
      const testResponse = await fetch(API_BUS, { method: 'GET' });
      console.log('Connection test:', testResponse.status);
    } catch (testError) {
      console.error('Connection error:', testError);
      throw new Error('Cannot connect to server. Please ensure backend is running.');
    }

    // Submit the form
    const response = await fetch(API_BUS, {
      method: "POST",
      body: formDataToSend,
      credentials: 'include'
    });

    console.log('Response status:', response.status);

    const raw = await response.text();
    console.log('Raw response:', raw);
    
    if (!raw.trim()) {
      throw new Error('Server returned an empty response');
    }
    
    let data;
    try {
      data = JSON.parse(raw);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      console.log('Raw response that failed to parse:', raw);
      
      if (raw.includes('<?php') || raw.includes('Fatal error') || raw.includes('Parse error')) {
        throw new Error('PHP error detected. Please check server logs.');
      }
      
      throw new Error('Server returned invalid JSON. Check console for details.');
    }

    if (!response.ok || !data.success) {
      throw new Error(data.message || data.errors?.join(', ') || `Submission failed with status: ${response.status}`);
    }

    showSuccessMessage(data.message || "Business permit application submitted successfully!");
    
    setTimeout(() => {
      navigate("/user/permittracker");
    }, 3000);

  } catch (err) {
    console.error("Submission error:", err);
    
    let userMessage = err.message;
    if (err.message.includes('Failed to fetch') || err.message.includes('Network error')) {
      userMessage = `Network error. Please check:
        1. Server is running
        2. API endpoint is correct: ${API_BUS}
        3. No CORS issues`;
    }
    
    showErrorMessage(userMessage);
  } finally {
    setIsSubmitting(false);
  }
};

  const isStepValid = (step) => {
    if (step === 1) {
      if (!formData.permit_number || formData.permit_number.trim() === '') return false;
      if (!formData.permit_expiry) return false;
      if (!formData.owner_type) return false;
      return true;
    }
    if (step === 2) {
      if (!formData.business_name || formData.business_name.trim() === '') return false;
      if (!formData.trade_name || formData.trade_name.trim() === '') return false;
      if (!formData.business_nature) return false;
      return true;
    }
    if (step === 3) {
      if (!formData.barangay_clearance_file) return false;
      if (!formData.owner_valid_id_file) return false;
      if (!formData.official_receipt_file) return false;
      return true;
    }
    return true;
  };

  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return 'N/A';
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold mb-4" style={{ color: COLORS.secondary }}>Renewal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 font-medium" style={{ color: COLORS.secondary }}>Permit Type</label>
                <input
                  type="text"
                  name="permit_type"
                  value={formData.permit_type}
                  readOnly
                  className="w-full p-3 border border-black rounded-lg bg-gray-100"
                  style={{ color: COLORS.secondary, fontFamily: COLORS.font }}
                />
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
                <label className="block mb-2 font-medium" style={{ color: COLORS.secondary }}>Permit Number *</label>
                <div className="relative">
                  <input
                    type="text"
                    name="permit_number"
                    value={formData.permit_number}
                    onChange={handleChange}
                    className="w-full p-3 border border-black rounded-lg"
                    style={{ color: COLORS.secondary, fontFamily: COLORS.font }}
                    placeholder="e.g., BP-2024-00123"
                    required
                  />
                  {isLoadingOwnerType && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
                    </div>
                  )}
                </div>
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
                <label className="block mb-2 font-medium" style={{ color: COLORS.secondary }}>Official Receipt Number *</label>
                <input
                  type="text"
                  name="official_receipt_no"
                  value={formData.official_receipt_no}
                  onChange={handleChange}
                  className="w-full p-3 border border-black rounded-lg"
                  style={{ color: COLORS.secondary, fontFamily: COLORS.font }}
                  placeholder="e.g., OR-2024-00123"
                  required
                />
                {submitStatus?.type === 'error' && !formData.official_receipt_no && (
                  <p className="text-red-600 text-sm mt-1" style={{ fontFamily: COLORS.font }}>Official receipt number is required</p>
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
              
              {/* Owner Type Input Field */}
              <div className="md:col-span-2">
                <label className="block mb-2 font-medium" style={{ color: COLORS.secondary }}>Business Ownership Type *</label>
                <select
                  name="owner_type"
                  value={formData.owner_type}
                  onChange={handleChange}
                  className="w-full p-3 border border-black rounded-lg"
                  style={{ color: COLORS.secondary, fontFamily: COLORS.font }}
                  required
                >
                  <option value="">Select Ownership Type</option>
                  <option value="Individual">Individual / Sole Proprietorship</option>
                  <option value="Partnership">Partnership</option>
                  <option value="Corporation">Corporation</option>
                </select>
                {submitStatus?.type === 'error' && !formData.owner_type && (
                  <p className="text-red-600 text-sm mt-1" style={{ fontFamily: COLORS.font }}>Owner type is required</p>
                )}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold mb-4" style={{ color: COLORS.secondary }}>Business Information</h3>
            
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
                  placeholder="e.g., Juan's Food Products Trading"
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
                  placeholder="e.g., Juan's Eatery"
                  required
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
                  min="0"
                  placeholder="0.00"
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
                  min="0"
                  placeholder="0"
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
              
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold mb-4" style={{ color: COLORS.secondary }}>Required Documents</h3>
            
            {/* Ownership Information Summary */}

            
            <div className="space-y-4">
              {[
                { name: 'barangay_clearance_file', label: 'Barangay Clearance *', required: true },
                { name: 'owner_valid_id_file', label: 'Owner Valid ID *', required: true },
                { name: 'official_receipt_file', label: 'Official Receipt of Payment of Business Tax *', required: true },
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

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold mb-4" style={{ color: COLORS.secondary }}>Review Your Application</h3>
            <div className="bg-white rounded-lg shadow p-6 border border-black">
              <div className="space-y-6">
                <div>
                  <h5 className="font-semibold mb-3 text-lg" style={{ color: COLORS.primary }}>Renewal Information</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm" style={{ fontFamily: COLORS.font }}>
                    <div className="flex items-center">
                      <span className="font-medium w-40">Permit Type:</span>
                      <span className="flex-1">{formData.permit_type}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium w-40">Application Date:</span>
                      <span className="flex-1">{formData.application_date}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium w-40">Permit Number:</span>
                      <span className="flex-1">{formData.permit_number}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium w-40">Permit Expiry Date:</span>
                      <span className="flex-1">{formData.permit_expiry}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium w-40">Ownership Type:</span>
                      <span className="flex-1">{formData.owner_type}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h5 className="font-semibold mb-3 text-lg" style={{ color: COLORS.primary }}>Business Information</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm" style={{ fontFamily: COLORS.font }}>
                    <div className="flex items-center">
                      <span className="font-medium w-40">Business Name:</span>
                      <span className="flex-1">{formData.business_name}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium w-40">Trade/Brand Name:</span>
                      <span className="flex-1">{formData.trade_name}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium w-40">Gross Sales:</span>
                      <span className="flex-1">{formatCurrency(formData.gross_sales)}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium w-40">Total Employees:</span>
                      <span className="flex-1">{formData.total_employees || 'N/A'}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium w-40">Nature of Business:</span>
                      <span className="flex-1">{formData.business_nature}</span>
                    </div>
                 
                  </div>
                </div>

                <div>
                  <h5 className="font-semibold mb-3 text-lg" style={{ color: COLORS.primary }}>Uploaded Documents</h5>
                  <div className="space-y-4">
                    {/* Barangay Clearance */}
                    <div className="flex items-center justify-between p-3 border border-gray-300 rounded-lg">
                      <div className="flex items-center">
                        {formData.barangay_clearance_file ? (
                          <Check className="w-5 h-5 text-green-600 mr-3" />
                        ) : (
                          <X className="w-5 h-5 text-red-600 mr-3" />
                        )}
                        <div>
                          <span className="font-medium">Barangay Clearance:</span>
                          <p className="text-sm text-gray-600">
                            {formData.barangay_clearance_file ? formData.barangay_clearance_file.name : 'Not uploaded'}
                          </p>
                        </div>
                      </div>
                      {formData.barangay_clearance_file && (
                        <button
                          type="button"
                          onClick={() => previewFile(formData.barangay_clearance_file)}
                          className="flex items-center gap-1 px-3 py-1 text-sm rounded hover:bg-gray-100 transition-colors duration-300"
                          style={{ color: COLORS.secondary }}
                        >
                          <Eye className="w-4 h-4" />
                          Preview
                        </button>
                      )}
                    </div>

                    {/* Owner Valid ID */}
                    <div className="flex items-center justify-between p-3 border border-gray-300 rounded-lg">
                      <div className="flex items-center">
                        {formData.owner_valid_id_file ? (
                          <Check className="w-5 h-5 text-green-600 mr-3" />
                        ) : (
                          <X className="w-5 h-5 text-red-600 mr-3" />
                        )}
                        <div>
                          <span className="font-medium">Owner Valid ID:</span>
                          <p className="text-sm text-gray-600">
                            {formData.owner_valid_id_file ? formData.owner_valid_id_file.name : 'Not uploaded'}
                          </p>
                        </div>
                      </div>
                      {formData.owner_valid_id_file && (
                        <button
                          type="button"
                          onClick={() => previewFile(formData.owner_valid_id_file)}
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
                        {formData.official_receipt_file ? (
                          <Check className="w-5 h-5 text-green-600 mr-3" />
                        ) : (
                          <X className="w-5 h-5 text-red-600 mr-3" />
                        )}
                        <div>
                          <span className="font-medium">Official Receipt of Payment:</span>
                          <p className="text-sm text-gray-600">
                            {formData.official_receipt_file ? formData.official_receipt_file.name : 'Not uploaded'}
                          </p>
                        </div>
                      </div>
                      {formData.official_receipt_file && (
                        <button
                          type="button"
                          onClick={() => previewFile(formData.official_receipt_file)}
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

      {/* Progress Steps - Oval Design */}
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
              className={`px-6 py-3 rounded-lg font-semibold text-white ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'transition-colors duration-300'}`}
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
            <h2 className="text-xl font-bold mb-6" style={{ color: COLORS.primary }}>Confirm Application</h2>
            
            <div className="mb-6">
              <p className="text-sm mb-3" style={{ color: COLORS.secondary, fontFamily: COLORS.font }}>
                Are you sure you want to submit your business permit renewal application? Please review your information before submitting.
              </p>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg border mb-6">
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
                onClick={confirmDeclaration}
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
                  navigate("/user/permittracker");
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