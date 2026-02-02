import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Upload, Check, X, Eye, FileText, AlertCircle, Shield, Key, RefreshCw, Calendar, Receipt, UserCheck } from "lucide-react";

// Design constants
const COLORS = {
  primary: '#4A90E2',
  secondary: '#000000',
  accent: '#FDA811',
  success: '#4CAF50',
  danger: '#E53935',
  warning: '#FF9800',
  background: '#FBFBFB',
  font: 'Montserrat, Arial, sans-serif'
};

const NATIONALITIES = ["Filipino", "Afghan", "Albanian", "Algerian", "American", "Andorran", "Angolan", "Antiguans", "Argentinean", "Armenian", "Australian", "Austrian", "Azerbaijani", "Bahamian", "Bahraini", "Bangladeshi", "Barbadian", "Barbudans", "Batswana", "Belarusian", "Belgian", "Belizean", "Beninese", "Bhutanese", "Bolivian", "Bosnian", "Brazilian", "British", "Bruneian", "Bulgarian", "Burkinabe", "Burmese", "Burundian", "Cambodian", "Cameroonian", "Canadian", "Cape Verdean", "Central African", "Chadian", "Chilean", "Chinese", "Colombian", "Comoran", "Congolese", "Costa Rican", "Croatian", "Cuban", "Cypriot", "Czech", "Danish", "Djibouti", "Dominican", "Dutch", "East Timorese", "Ecuadorean", "Egyptian", "Emirian", "Equatorial Guinean", "Eritrean", "Estonian", "Ethiopian", "Fijian", "Finnish", "French", "Gabonese", "Gambian", "Georgian", "German", "Ghanaian", "Greek", "Grenadian", "Guatemalan", "Guinea-Bissauan", "Guinean", "Guyanese", "Haitian", "Herzegovinian", "Honduran", "Hungarian", "I-Kiribati", "Icelander", "Indian", "Indonesian", "Iranian", "Iraqi", "Irish", "Israeli", "Italian", "Ivorian", "Jamaican", "Japanese", "Jordanian", "Kazakhstani", "Kenyan", "Kittian and Nevisian", "Kuwaiti", "Kyrgyz", "Laotian", "Latvian", "Lebanese", "Liberian", "Libyan", "Liechtensteiner", "Lithuanian", "Luxembourger", "Macedonian", "Malagasy", "Malawian", "Malaysian", "Maldivan", "Malian", "Maltese", "Marshallese", "Mauritanian", "Mauritian", "Mexican", "Micronesian", "Moldovan", "Monacan", "Mongolian", "Moroccan", "Mosotho", "Motswana", "Mozambican", "Namibian", "Nauruan", "Nepalese", "New Zealander", "Nicaraguan", "Nigerian", "Nigerien", "North Korean", "Northern Irish", "Norwegian", "Omani", "Pakistani", "Palauan", "Palestinian", "Panamanian", "Papua New Guinean", "Paraguayan", "Peruvian", "Polish", "Portuguese", "Qatari", "Romanian", "Russian", "Rwandan", "Saint Lucian", "Salvadoran", "Samoan", "San Marinese", "Sao Tomean", "Saudi", "Scottish", "Senegalese", "Serbian", "Seychellois", "Sierra Leonean", "Singaporean", "Slovakian", "Slovenian", "Solomon Islander", "Somali", "South African", "South Korean", "Spanish", "Sri Lankan", "Sudanese", "Surinamer", "Swazi", "Swedish", "Swiss", "Syrian", "Taiwanese", "Tajik", "Tanzanian", "Thai", "Togolese", "Tongan", "Trinidadian or Tobagonian", "Tunisian", "Turkish", "Tuvaluan", "Ugandan", "Ukrainian", "Uruguayan", "Uzbekistani", "Venezuelan", "Vietnamese", "Welsh", "Yemenite", "Zambian", "Zimbabwean"];

export default function FranchiseRenewal() {
  const location = useLocation();
  const navigate = useNavigate();
  const permitType = location.state?.permitType || 'RENEWAL';
  
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalTitle, setModalTitle] = useState('');
  const [agreeDeclaration, setAgreeDeclaration] = useState(false);
  const [showPreview, setShowPreview] = useState({});
  const [errors, setErrors] = useState({});
  const [isCheckingExisting, setIsCheckingExisting] = useState(false);
  const [existingPermit, setExistingPermit] = useState(null);
  const [autoFilledFields, setAutoFilledFields] = useState({});
  const [renewalType, setRenewalType] = useState('MTOP');
  const [isLoadingPermit, setIsLoadingPermit] = useState(false);
  const [showPaymentSuccessModal, setShowPaymentSuccessModal] = useState(false);
  const [showPaymentCompletionModal, setShowPaymentCompletionModal] = useState(false);
  const [barangayClearanceMethod, setBarangayClearanceMethod] = useState('id'); // 'id' or 'upload'
  
  // Payment status state
  const [paymentStatus, setPaymentStatus] = useState({
    isPaid: false,
    paymentMethod: '',
    paymentDate: '',
    transactionId: '',
    receiptNumber: ''
  });
  
  // Fee structure - REMOVED BUSINESS TAX FEE
  const FEES = {
    renewal_fee: renewalType === 'MTOP' ? 250.00 : 500.00,
    sticker_fee: 150.00,
    inspection_fee: 100.00
  };
  
  const [formData, setFormData] = useState({
    renewal_type: 'MTOP',
    existing_permit_id: '',
    existing_plate_number: '',
    
    // Applicant Information
    first_name: '',
    last_name: '',
    middle_initial: '',
    home_address: '',
    contact_number: '',
    email: '',
    citizenship: 'Filipino',
    birth_date: '',
    id_type: '',
    id_number: '',
    
    // Vehicle Information
    make_brand: '',
    model: '',
    engine_number: '',
    chassis_number: '',
    plate_number: '',
    year_acquired: '',
    color: '',
    vehicle_type: '',
    lto_or_number: '',
    lto_cr_number: '',
    lto_expiration_date: '',
    mv_file_number: '',
    district: '',
    
    // Operation Information
    route_zone: '',
    barangay_of_operation: '',
    toda_name: '',
    operator_type: '',
    company_name: '',
    
    // Required Documents for Renewal - UPDATED
    old_permit_copy: null,
    lto_cr_copy: null,
    lto_or_copy: null,
    barangay_clearance_id: '', // Can be ID or Upload
    barangay_clearance_file: null, // Alternative to ID
    community_tax_certificate: null,
    drivers_license: null,
    inspection_report: null,
    
    // Additional Documents for Mayor's Permit Renewal
    barangay_business_clearance: null,
    previous_mayors_permit: null,
    
    // Payment Information
    payment_method: 'online',
    renewal_fee_checked: true,
    sticker_fee_checked: true,
    inspection_fee_checked: true,
    renewal_fee_or: '',
    sticker_fee_or: '',
    inspection_fee_or: '',
    renewal_fee_receipt: null,
    sticker_fee_receipt: null,
    inspection_fee_receipt: null,
    
    // Declaration
    applicant_signature: '',
    date_submitted: new Date().toISOString().split('T')[0],
    barangay_captain_signature: '',
    remarks: '',
    notes: '',
    
    // Original permit details
    original_permit_id: '',
    original_issue_date: '',
    original_expiry_date: '',
    permit_status: ''
  });

  const steps = [
    { id: 1, title: 'Renewal Type', description: 'Select permit to renew' },
    { id: 2, title: 'Existing Permit', description: 'Verify existing permit' },
    { id: 3, title: 'Applicant Information', description: 'Personal details' },
    { id: 4, title: 'Vehicle Information', description: 'Vehicle details' },
    { id: 5, title: 'Required Documents', description: 'Upload renewal documents' },
    { id: 6, title: 'Payment Information', description: 'Fees and payment' },
    { id: 7, title: 'Declaration', description: 'Sign and submit' },
    { id: 8, title: 'Review', description: 'Review your renewal' }
  ];

  const barangaysCaloocan = ["Bagong Barrio", "Grace Park East", "Grace Park West", "Barangay 28", "Barangay 35", "Barangay 63", "Barangay 71", "Barangay 75", "Barangay 120", "Barangay 122", "Barangay 126", "Barangay 129", "Barangay 132", "Barangay 134", "Barangay 136", "Barangay 143", "Barangay 146", "Barangay 148", "Barangay 151", "Barangay 155", "Barangay 160", "Barangay 162", "Barangay 164", "Barangay 167", "Barangay 171", "Barangay 172", "Barangay 175", "Barangay 176", "Barangay 177", "Barangay 178", "Barangay 179", "Barangay 180", "Barangay 181", "Barangay 182", "Barangay 183", "Barangay 184", "Barangay 185", "Barangay 186", "Barangay 187", "Barangay 188", "Deparo", "Bagumbong", "Tala", "Camarin", "Bagong Silang", "Pangarap Village"];

  const TODA_NAMES = ["Bagong Barrio TODA", "Grace Park TODA", "Camarin TODA", "Barangay 120 TODA", "Barangay 177 TODA", "Barangay 178 TODA", "Barangay 188 TODA", "Tala TODA", "Deparo TODA", "Bagumbong TODA", "Phase 1 TODA", "Phase 8 TODA", "Pangarap TODA", "Camarin East TODA", "Bagong Silang TODA", "Barangay 176 TODA", "Barangay 175 TODA", "Barangay 170 TODA", "Barangay 171 TODA", "Barangay 172 TODA"];

  const ROUTES = [
    { label: "Bagong Barrio TODA – Bagong Barrio Terminal – EDSA – Monumento Circle", value: "Bagong Barrio – Bagong Barrio Terminal – EDSA – Monumento Circle" },
    { label: "Grace Park TODA – Grace Park – Rizal Avenue – MCU – Monumento", value: "Grace Park – Rizal Avenue – MCU – Monumento" },
    { label: "Camarin TODA – Camarin Road – Zabarte – SM Fairview", value: "Camarin Road – Zabarte – SM Fairview" },
    { label: "Barangay 120 TODA – Barangay 120 – Camarin Road – Zabarte – SM Fairview", value: "Barangay 120 – Camarin Road – Zabarte – SM Fairview" },
    { label: "Barangay 177 TODA – Barangay 177 – Susano Road – Zabarte – Quirino Highway", value: "Barangay 177 – Susano Road – Zabarte – Quirino Highway" },
    { label: "Barangay 178 TODA – Barangay 178 – Mindanao Avenue Extension – Zabarte", value: "Barangay 178 – Mindanao Avenue Extension – Zabarte" },
    { label: "Barangay 188 TODA – Barangay 188 – Camarin – Novaliches Bayan", value: "Barangay 188 – Camarin – Novaliches Bayan" },
    { label: "Tala TODA – Tala Hospital – Phase 8 – Phase 7 – Camarin", value: "Tala Hospital – Phase 8 – Phase 7 – Camarin" },
    { label: "Deparo TODA – Deparo Road – Bagumbong – Quirino Highway", value: "Deparo Road – Bagumbong – Quirino Highway" },
    { label: "Bagumbong TODA – Bagumbong Road – Deparo – Camarin – Zabarte", value: "Bagumbong Road – Deparo – Camarin – Zabarte" },
    { label: "Phase 1 TODA – Phase 1 – Phase 2 – Zabarte – Camarin", value: "Phase 1 – Phase 2 – Zabarte – Camarin" },
    { label: "Phase 8 TODA – Phase 8 – Tala Hospital – Camarin Road", value: "Phase 8 – Tala Hospital – Camarin Road" },
    { label: "Pangarap TODA – Pangarap Village – Quirino Highway – Zabarte", value: "Pangarap Village – Quirino Highway – Zabarte" },
    { label: "Camarin East TODA – Camarin East – Zabarte – Fairview", value: "Camarin East – Zabarte – Fairview" },
    { label: "Bagong Silang TODA – Bagong Silang Phases 1–12 – Zabarte – Camarin", value: "Bagong Silang Phases 1–12 – Zabarte – Camarin" },
    { label: "Barangay 176 TODA – Barangay 176 – Susano Road – Zabarte", value: "Barangay 176 – Susano Road – Zabarte" },
    { label: "Barangay 175 TODA – Barangay 175 – Camarin Road – Zabarte", value: "Barangay 175 – Camarin Road – Zabarte" },
    { label: "Barangay 170 TODA – Barangay 170 – Zabarte – Quirino Highway", value: "Barangay 170 – Zabarte – Quirino Highway" },
    { label: "Barangay 171 TODA – Barangay 171 – Zabarte – SM Fairview", value: "Barangay 171 – Zabarte – SM Fairview" },
    { label: "Barangay 172 TODA – Barangay 172 – Quirino Highway – Zabarte", value: "Barangay 172 – Quirino Highway – Zabarte" }
  ];

  const OPERATOR_TYPES = ["Individual Operator", "TODA Member", "Transport Cooperative", "Corporation"];

  // Validation functions with permanent notes
  const validatePlateNumber = (plate) => {
    if (!plate) return { valid: false, error: '' };
    const cleanPlate = plate.replace(/\s/g, '').toUpperCase();
    const platePattern = /^[A-Z]{3}\d{4}$/;
    const valid = platePattern.test(cleanPlate);
    return {
      valid,
      formatted: cleanPlate,
      error: valid ? '' : 'Plate number must be in 3-letter, 4-digit format (e.g., ABC1234)'
    };
  };

  const validateChassisNumber = (chassis) => {
    if (!chassis) return { valid: false, error: '' };
    const cleanChassis = chassis.replace(/\s/g, '').toUpperCase();
    const valid = cleanChassis.length === 17;
    return {
      valid,
      formatted: cleanChassis,
      error: valid ? '' : 'Chassis number must be exactly 17 characters'
    };
  };

  const validateEngineNumber = (engine) => {
    if (!engine) return { valid: false, error: '' };
    const cleanEngine = engine.replace(/\s/g, '').toUpperCase();
    const valid = cleanEngine.length >= 8 && cleanEngine.length <= 12;
    return {
      valid,
      formatted: cleanEngine,
      error: valid ? '' : 'Engine number must be between 8-12 characters'
    };
  };

  const validateORNumber = (orNumber) => {
    if (!orNumber) return { valid: false, error: '' };
    const cleanOR = orNumber.replace(/\s/g, '');
    const orPattern = /^\d{7,8}$/;
    const valid = orPattern.test(cleanOR);
    return {
      valid,
      formatted: cleanOR,
      error: valid ? '' : 'OR number must be 7-8 digits'
    };
  };

  const validateCRNumber = (crNumber) => {
    if (!crNumber) return { valid: false, error: '' };
    const cleanCR = crNumber.replace(/\s/g, '');
    const crPattern = /^\d{7,8}$/;
    const valid = crPattern.test(cleanCR);
    return {
      valid,
      formatted: cleanCR,
      error: valid ? '' : 'CR number must be 7-8 digits'
    };
  };

  const validateIDNumber = (idNumber) => {
    if (!idNumber) return { valid: false, error: '' };
    const cleanID = idNumber.replace(/\s/g, '');
    const valid = cleanID.length > 0;
    return {
      valid,
      formatted: cleanID,
      error: '' // No error message for length
    };
  };

  const validateYearAcquired = (year) => {
    if (!year) return { valid: false, error: '' };
    const currentYear = new Date().getFullYear();
    const yearNum = parseInt(year);
    const valid = /^\d{4}$/.test(year) && yearNum <= currentYear && yearNum >= 1900;
    return {
      valid,
      formatted: year,
      error: valid ? '' : 'Year must be a valid 4-digit year (1900-present)'
    };
  };

  const checkExistingPermit = async () => {
    if (!formData.existing_permit_id || !formData.existing_plate_number) {
      showErrorMessage("Please enter your existing Permit ID and Plate Number for validation.");
      return false;
    }
    
    setIsCheckingExisting(true);
    
    try {
      const response = await fetch('/backend/franchise_permit/check_existing_permit.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          permit_id: formData.existing_permit_id,
          plate_number: formData.existing_plate_number,
          renewal_type: renewalType
        })
      });
      
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const responseText = await response.text();
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Failed to parse JSON:', parseError);
        return false;
      }
      
      if (data.success && data.existingPermit) {
        setExistingPermit(data.existingPermit);
        autoFillFromExistingPermit(data.existingPermit);
        
        // Check if permit is expired
        const expiryDate = new Date(data.existingPermit.expiry_date);
        const today = new Date();
        const daysUntilExpiry = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
        
        let message = '';
        if (data.existingPermit.status === 'EXPIRED') {
          message = '⚠️ Your permit has expired. Please renew immediately.';
        } else if (daysUntilExpiry <= 30 && daysUntilExpiry > 0) {
          message = `⚠️ Your permit expires in ${daysUntilExpiry} days.`;
        } else if (daysUntilExpiry <= 0) {
          message = '⚠️ Your permit has expired. Please renew immediately.';
        } else {
          message = '✅ Valid permit found. You may proceed with renewal.';
        }
        
        // Show success message but don't block the flow
        setModalTitle('Success!');
        setModalMessage(`Existing ${renewalType === 'MTOP' ? 'MTOP' : 'Mayor\'s'} permit found! ${message}`);
        setShowSuccessModal(true);
        
        // Auto-proceed to next step after a short delay
        setTimeout(() => {
          setShowSuccessModal(false);
          setCurrentStep(3); // Proceed to Step 3 (Applicant Information)
        }, 3000);
        
        return true;
      } else {
        showErrorMessage(data.message || 'No existing permit found with the provided details.');
        return false;
      }
    } catch (error) {
      console.error('Error checking existing permit:', error);
      showErrorMessage('Error checking existing permit. Please check your connection.');
      return false;
    } finally {
      setIsCheckingExisting(false);
    }
  };

  const autoFillFromExistingPermit = (permitData) => {
    if (!permitData) return;
    
    const fieldsToAutoFill = {};
    const updatedData = { ...formData };
    
    // Define which fields should be auto-filled
    const autoFillableFields = [
      'first_name', 'last_name', 'middle_initial',
      'home_address', 'contact_number', 'email',
      'citizenship', 'birth_date', 'id_type', 'id_number',
      'make_brand', 'model', 'engine_number', 'chassis_number',
      'plate_number', 'year_acquired', 'color', 'vehicle_type',
      'lto_or_number', 'lto_cr_number', 'lto_expiration_date',
      'mv_file_number', 'district', 'route_zone',
      'barangay_of_operation', 'toda_name', 'operator_type',
      'company_name'
    ];
    
    autoFillableFields.forEach(field => {
      if (permitData[field]) {
        updatedData[field] = permitData[field];
        fieldsToAutoFill[field] = true;
      }
    });
    
    // Set original permit details
    if (permitData.application_id) {
      updatedData.original_permit_id = permitData.application_id;
      updatedData.existing_permit_id = permitData.application_id;
    }
    if (permitData.date_approved) {
      updatedData.original_issue_date = permitData.date_approved;
    }
    if (permitData.expiry_date) {
      updatedData.original_expiry_date = permitData.expiry_date;
    }
    if (permitData.status) {
      updatedData.permit_status = permitData.status;
    }
    
    // Format specific fields
    if (updatedData.plate_number) {
      const plateValidation = validatePlateNumber(updatedData.plate_number);
      if (plateValidation.valid) {
        updatedData.plate_number = plateValidation.formatted;
      }
    }
    
    if (updatedData.chassis_number) {
      const chassisValidation = validateChassisNumber(updatedData.chassis_number);
      if (chassisValidation.valid) {
        updatedData.chassis_number = chassisValidation.formatted;
      }
    }
    
    if (updatedData.engine_number) {
      const engineValidation = validateEngineNumber(updatedData.engine_number);
      if (engineValidation.valid) {
        updatedData.engine_number = engineValidation.formatted;
      }
    }
    
    if (updatedData.lto_or_number) {
      const orValidation = validateORNumber(updatedData.lto_or_number);
      if (orValidation.valid) {
        updatedData.lto_or_number = orValidation.formatted;
      }
    }
    
    if (updatedData.lto_cr_number) {
      const crValidation = validateCRNumber(updatedData.lto_cr_number);
      if (crValidation.valid) {
        updatedData.lto_cr_number = crValidation.formatted;
      }
    }
    
    if (updatedData.id_number) {
      const idValidation = validateIDNumber(updatedData.id_number);
      if (idValidation.valid) {
        updatedData.id_number = idValidation.formatted;
      }
    }
    
    if (updatedData.year_acquired) {
      const yearValidation = validateYearAcquired(updatedData.year_acquired);
      if (yearValidation.valid) {
        updatedData.year_acquired = yearValidation.formatted;
      }
    }
    
    setFormData(updatedData);
    setAutoFilledFields(fieldsToAutoFill);
  };

  const resetAutoFilledData = () => {
    const resetData = { ...formData };
    Object.keys(autoFilledFields).forEach(field => {
      resetData[field] = '';
    });
    resetData.original_permit_id = '';
    resetData.original_issue_date = '';
    resetData.original_expiry_date = '';
    resetData.permit_status = '';
    setFormData(resetData);
    setAutoFilledFields({});
    setExistingPermit(null);
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    
    // Prevent changes to auto-filled fields
    if (autoFilledFields[name]) {
      showErrorMessage("This field is auto-filled from your existing permit and cannot be modified.");
      return;
    }
    
    if (name === "contact_number") {
      const onlyNums = value.replace(/[^0-9]/g, "");
      let finalValue = onlyNums;
      if (onlyNums.length > 0) {
        if (!onlyNums.startsWith('09')) {
          finalValue = '09' + onlyNums;
        }
        finalValue = finalValue.slice(0, 11);
      }
      
      setFormData(prev => ({ ...prev, [name]: finalValue }));
      
      if (finalValue.length > 0 && finalValue.length !== 11) {
        setErrors(prev => ({ ...prev, contact_number: 'Contact number must be 11 digits (09XXXXXXXXX)' }));
      } else if (errors.contact_number) {
        const newErrors = { ...errors };
        delete newErrors.contact_number;
        setErrors(newErrors);
      }
    } else if (type === 'file') {
      const file = files[0];
      setFormData(prev => ({ ...prev, [name]: file || null }));
      
      if (errors[name]) {
        const newErrors = { ...errors };
        delete newErrors[name];
        setErrors(newErrors);
      }
    } else if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (name === 'renewal_type') {
      setRenewalType(value);
      setFormData(prev => ({ ...prev, [name]: value }));
      setExistingPermit(null);
      setAutoFilledFields({});
    } else if (name === 'payment_method') {
      setFormData(prev => ({ ...prev, [name]: value }));
    } else if (name === 'date_submitted') {
      // Prevent changing the date_submitted field
      showErrorMessage("Submission date is automatically set to today's date and cannot be changed.");
      return;
    } else {
      let finalValue = value;
      
      // Special handling for specific fields with validation
      switch(name) {
        case 'plate_number':
        case 'existing_plate_number':
          const cleanPlate = value.replace(/\s/g, '').toUpperCase();
          finalValue = cleanPlate;
          
          if (cleanPlate) {
            const validation = validatePlateNumber(cleanPlate);
            if (!validation.valid && cleanPlate.length >= 3) {
              setErrors(prev => ({ ...prev, [name]: validation.error }));
            } else if (errors[name]) {
              const newErrors = { ...errors };
              delete newErrors[name];
              setErrors(newErrors);
            }
          }
          break;
          
        case 'chassis_number':
          const cleanChassis = value.replace(/\s/g, '').toUpperCase();
          finalValue = cleanChassis;
          
          if (cleanChassis) {
            const validation = validateChassisNumber(cleanChassis);
            if (!validation.valid && cleanChassis.length >= 10) {
              setErrors(prev => ({ ...prev, [name]: validation.error }));
            } else if (errors[name]) {
              const newErrors = { ...errors };
              delete newErrors[name];
              setErrors(newErrors);
            }
          }
          break;
          
        case 'engine_number':
          const cleanEngine = value.replace(/\s/g, '').toUpperCase();
          finalValue = cleanEngine;
          
          if (cleanEngine) {
            const validation = validateEngineNumber(cleanEngine);
            if (!validation.valid && cleanEngine.length >= 6) {
              setErrors(prev => ({ ...prev, [name]: validation.error }));
            } else if (errors[name]) {
              const newErrors = { ...errors };
              delete newErrors[name];
              setErrors(newErrors);
            }
          }
          break;
          
        case 'lto_or_number':
          const cleanOR = value.replace(/\s/g, '');
          finalValue = cleanOR;
          
          if (cleanOR) {
            const validation = validateORNumber(cleanOR);
            if (!validation.valid && cleanOR.length >= 6) {
              setErrors(prev => ({ ...prev, [name]: validation.error }));
            } else if (errors[name]) {
              const newErrors = { ...errors };
              delete newErrors[name];
              setErrors(newErrors);
            }
          }
          break;
          
        case 'lto_cr_number':
          const cleanCR = value.replace(/\s/g, '');
          finalValue = cleanCR;
          
          if (cleanCR) {
            const validation = validateCRNumber(cleanCR);
            if (!validation.valid && cleanCR.length >= 6) {
              setErrors(prev => ({ ...prev, [name]: validation.error }));
            } else if (errors[name]) {
              const newErrors = { ...errors };
              delete newErrors[name];
              setErrors(newErrors);
            }
          }
          break;
          
        case 'id_number':
          const cleanID = value.replace(/\s/g, '');
          finalValue = cleanID;
          
          if (cleanID) {
            const validation = validateIDNumber(cleanID);
            if (!validation.valid) {
              setErrors(prev => ({ ...prev, [name]: validation.error }));
            } else if (errors[name]) {
              const newErrors = { ...errors };
              delete newErrors[name];
              setErrors(newErrors);
            }
          }
          break;
          
        case 'year_acquired':
          if (value) {
            const validation = validateYearAcquired(value);
            if (!validation.valid) {
              setErrors(prev => ({ ...prev, [name]: validation.error }));
            } else if (errors[name]) {
              const newErrors = { ...errors };
              delete newErrors[name];
              setErrors(newErrors);
            }
          }
          finalValue = value;
          break;
          
        default:
          finalValue = value;
      }
      
      setFormData(prev => ({ ...prev, [name]: finalValue }));
      
      // Validate LTO Expiration Date
      if (name === 'lto_expiration_date' && value) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const selectedDate = new Date(value);
        
        if (selectedDate < today) {
          setErrors(prev => ({
            ...prev,
            lto_expiration_date: 'LTO Expiration Date cannot be in the past. Please select a future date.'
          }));
        } else {
          if (errors.lto_expiration_date) {
            const newErrors = { ...errors };
            delete newErrors.lto_expiration_date;
            setErrors(newErrors);
          }
        }
      }
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

  // Online Payment Function
  const handleOnlinePayment = () => {
    let totalAmount = 0;
    
    // Calculate total based on checked fees
    if (formData.renewal_fee_checked) totalAmount += FEES.renewal_fee;
    if (formData.sticker_fee_checked) totalAmount += FEES.sticker_fee;
    if (formData.inspection_fee_checked) totalAmount += FEES.inspection_fee;
    
    if (totalAmount <= 0) {
      showErrorMessage("Please select at least one fee to pay.");
      return;
    }
    
    // Generate unique reference ID
    const referenceId = `RENEW-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const paymentData = {
      system: 'franchise_renewal',
      ref: referenceId,
      amount: totalAmount.toFixed(2),
      purpose: `${renewalType === 'MTOP' ? 'MTOP' : 'Mayor\'s Permit'} Renewal - ${formData.plate_number || 'Renewal Application'}`,
      callback: "https://revenuetreasury.goserveph.com/citizen_dashboard/market/api/market_payment_api.php",
    };

    // Save payment reference locally
    localStorage.setItem('payment_reference', referenceId);
    localStorage.setItem('payment_amount', totalAmount.toFixed(2));
    localStorage.setItem('application_plate', formData.plate_number || formData.existing_plate_number);
    localStorage.setItem('renewal_type', renewalType);
    
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = 'https://revenuetreasury.goserveph.com/citizen_dashboard/digital/index.php';
    form.target = '_blank';
    
    Object.entries(paymentData).forEach(([key, value]) => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = key;
      input.value = value;
      form.appendChild(input);
    });
    
    document.body.appendChild(form);
    form.submit();
    
    // Show payment completion modal after a delay
    setTimeout(() => {
      setShowPaymentCompletionModal(true);
    }, 2000);
    
    // Start polling for payment status
    startPaymentPolling(referenceId);
  };

  const startPaymentPolling = (referenceId) => {
    console.log('Starting payment polling for:', referenceId);
    
    const checkPayment = async () => {
      try {
        const response = await fetch(`/backend/franchise_permit/get_payment_status.php?reference_id=${referenceId}`);
        
        if (!response.ok) {
          console.error('HTTP error! status:', response.status);
          return;
        }
        
        const text = await response.text();
        console.log('Payment check raw response:', text);
        
        let data;
        try {
          data = JSON.parse(text);
        } catch (e) {
          console.error('Failed to parse JSON:', text);
          return;
        }
        
        console.log('Payment status data:', data);
        
        if (data.success && data.payment_status === 'paid') {
          setPaymentStatus({
            isPaid: true,
            paymentMethod: 'online',
            paymentDate: data.paid_at || new Date().toISOString(),
            transactionId: data.payment_id || referenceId,
            receiptNumber: data.receipt_number || 'N/A'
          });
          
          clearInterval(pollingInterval);
          
          // Show payment success modal
          setModalTitle('Payment Successful!');
          setModalMessage('Your payment has been confirmed successfully! You can now proceed to the next step.');
          setShowPaymentSuccessModal(true);
          
          setFormData(prev => ({
            ...prev,
            payment_method: 'online',
            payment_status: 'paid'
          }));
        }
        
      } catch (error) {
        console.error('Error checking payment:', error);
      }
    };
    
    const pollingInterval = setInterval(checkPayment, 5000);
    
    setTimeout(() => {
      clearInterval(pollingInterval);
      console.log('Payment polling stopped after 10 minutes');
    }, 10 * 60 * 1000);
    
    checkPayment();
  };

  const handlePaymentMethodChange = (method) => {
    setFormData(prev => ({ ...prev, payment_method: method }));
  };

  const validateStep = (step) => {
    const newErrors = {};
    
    if (step === 1) {
      if (!renewalType) {
        newErrors.renewal_type = 'Please select renewal type';
      }
    }
    
    if (step === 2) {
      if (!formData.existing_permit_id) {
        newErrors.existing_permit_id = 'Existing permit ID is required';
      }
      if (!formData.existing_plate_number) {
        newErrors.existing_plate_number = 'Plate number is required';
      } else {
        const plateValidation = validatePlateNumber(formData.existing_plate_number);
        if (!plateValidation.valid) {
          newErrors.existing_plate_number = plateValidation.error;
        }
      }
      
      if (!existingPermit) {
        newErrors.existing_permit = 'Please verify your existing permit before proceeding';
      }
    }
    
    if (step === 3) {
      if (!formData.first_name.trim()) newErrors.first_name = 'First name is required';
      if (!formData.last_name.trim()) newErrors.last_name = 'Last name is required';
      if (!formData.home_address.trim()) newErrors.home_address = 'Home address is required';
      if (!formData.contact_number.trim()) newErrors.contact_number = 'Contact number is required';
      else if (formData.contact_number.length !== 11) {
        newErrors.contact_number = 'Contact number must be 11 digits (09XXXXXXXXX)';
      }
      if (!formData.email.trim()) newErrors.email = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
      if (!formData.citizenship) newErrors.citizenship = 'Citizenship is required';
      if (!formData.birth_date) newErrors.birth_date = 'Birth date is required';
      if (!formData.id_type) newErrors.id_type = 'ID type is required';
      if (!formData.id_number.trim()) newErrors.id_number = 'ID number is required';
      else {
        const idValidation = validateIDNumber(formData.id_number);
        if (!idValidation.valid) {
          newErrors.id_number = idValidation.error;
        }
      }
      if (!formData.operator_type) newErrors.operator_type = 'Operator type is required';
    }
    
    if (step === 4) {
      if (!formData.make_brand.trim()) newErrors.make_brand = 'Make/Brand is required';
      if (!formData.model.trim()) newErrors.model = 'Model is required';
      
      if (!formData.engine_number.trim()) {
        newErrors.engine_number = 'Engine number is required';
      } else {
        const engineValidation = validateEngineNumber(formData.engine_number);
        if (!engineValidation.valid) {
          newErrors.engine_number = engineValidation.error;
        }
      }
      
      if (!formData.chassis_number.trim()) {
        newErrors.chassis_number = 'Chassis number is required';
      } else {
        const chassisValidation = validateChassisNumber(formData.chassis_number);
        if (!chassisValidation.valid) {
          newErrors.chassis_number = chassisValidation.error;
        }
      }
      
      if (!formData.plate_number.trim()) {
        newErrors.plate_number = 'Plate number is required';
      } else {
        const plateValidation = validatePlateNumber(formData.plate_number);
        if (!plateValidation.valid) {
          newErrors.plate_number = plateValidation.error;
        }
      }
      
      if (!formData.year_acquired.trim()) {
        newErrors.year_acquired = 'Year acquired is required';
      } else {
        const yearValidation = validateYearAcquired(formData.year_acquired);
        if (!yearValidation.valid) {
          newErrors.year_acquired = yearValidation.error;
        }
      }
      
      if (!formData.color.trim()) newErrors.color = 'Color is required';
      if (!formData.vehicle_type.trim()) newErrors.vehicle_type = 'Vehicle type is required';
      
      if (!formData.lto_or_number.trim()) {
        newErrors.lto_or_number = 'LTO OR number is required';
      } else {
        const orValidation = validateORNumber(formData.lto_or_number);
        if (!orValidation.valid) {
          newErrors.lto_or_number = orValidation.error;
        }
      }
      
      if (!formData.lto_cr_number.trim()) {
        newErrors.lto_cr_number = 'LTO CR number is required';
      } else {
        const crValidation = validateCRNumber(formData.lto_cr_number);
        if (!crValidation.valid) {
          newErrors.lto_cr_number = crValidation.error;
        }
      }
      
      if (!formData.lto_expiration_date) {
        newErrors.lto_expiration_date = 'LTO expiration date is required';
      } else {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const selectedDate = new Date(formData.lto_expiration_date);
        
        if (selectedDate < today) {
          newErrors.lto_expiration_date = 'LTO Expiration Date cannot be in the past. Please select a future date.';
        }
      }
      if (!formData.district.trim()) newErrors.district = 'District is required';
    }
    
    if (step === 5) {
      const requiredDocs = [];
      
      // Common documents for both renewal types
      requiredDocs.push(
        { name: 'old_permit_copy', label: 'Old Permit Copy' },
        { name: 'lto_cr_copy', label: 'LTO CR Copy' },
        { name: 'lto_or_copy', label: 'LTO OR Copy' },
        { name: 'community_tax_certificate', label: 'Community Tax Certificate' }
      );
      
      // Additional documents for Mayor's Permit
      if (renewalType === 'MAYOR') {
        requiredDocs.push(
          { name: 'barangay_business_clearance', label: 'Barangay Business Clearance' },
          { name: 'previous_mayors_permit', label: 'Previous Mayor\'s Permit' }
        );
      }
      
      // Check for barangay clearance (either ID or upload)
      if (barangayClearanceMethod === 'id') {
        if (!formData.barangay_clearance_id?.trim()) {
          newErrors.barangay_clearance_id = 'Barangay Clearance ID is required';
        }
      } else {
        if (!formData.barangay_clearance_file) {
          newErrors.barangay_clearance_file = 'Barangay Clearance file is required';
        }
      }
      
      let uploadedCount = 0;
      requiredDocs.forEach(doc => {
        if (!formData[doc.name]) {
          newErrors[doc.name] = `${doc.label} is required for ${renewalType === 'MTOP' ? 'MTOP' : 'Mayor\'s Permit'} renewal`;
        } else {
          uploadedCount++;
        }
      });
      
      if (uploadedCount < requiredDocs.length) {
        newErrors.min_documents = `All required documents must be uploaded`;
      }
    }
    
    if (step === 6) {
      // Updated validation for online payment
      if (formData.payment_method === 'upload') {
        const feeChecks = [
          { name: 'renewal_fee', checked: formData.renewal_fee_checked, receipt: formData.renewal_fee_receipt, or: formData.renewal_fee_or },
          { name: 'sticker_fee', checked: formData.sticker_fee_checked, receipt: formData.sticker_fee_receipt, or: formData.sticker_fee_or },
          { name: 'inspection_fee', checked: formData.inspection_fee_checked, receipt: formData.inspection_fee_receipt, or: formData.inspection_fee_or }
        ];
        
        let hasValidFee = false;
        feeChecks.forEach(fee => {
          if (fee.checked) {
            if (!fee.or) {
              newErrors[`${fee.name}_or`] = 'OR Number is required';
            }
            if (!fee.receipt) {
              newErrors[`${fee.name}_receipt`] = 'Receipt is required';
            }
            if (fee.or && fee.receipt) {
              hasValidFee = true;
            }
          }
        });
        
        if (!hasValidFee) {
          newErrors.payment = 'At least one fee must be checked with valid OR number and receipt';
        }
      } else {
        // For online payment, just check if at least one fee is selected
        const hasSelectedFee = formData.renewal_fee_checked || formData.sticker_fee_checked || 
                              formData.inspection_fee_checked;
        if (!hasSelectedFee) {
          newErrors.payment = 'Please select at least one fee to pay';
        }
      }
    }
    
    if (step === 7) {
      if (!formData.applicant_signature) {
        newErrors.applicant_signature = 'Applicant signature is required';
      }
      if (!agreeDeclaration) {
        newErrors.declaration = 'You must agree to the declaration';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isStepValid = (step) => {
    const validators = {
      1: () => renewalType === 'MTOP' || renewalType === 'MAYOR',
      2: () => {
        if (!formData.existing_permit_id) return false;
        if (!formData.existing_plate_number) return false;
        const plateValidation = validatePlateNumber(formData.existing_plate_number);
        if (!plateValidation.valid) return false;
        return !!existingPermit;
      },
      3: () => {
        if (!formData.first_name.trim()) return false;
        if (!formData.last_name.trim()) return false;
        if (!formData.home_address.trim()) return false;
        if (!formData.contact_number.trim()) return false;
        if (formData.contact_number.length !== 11) return false;
        if (!formData.email.trim()) return false;
        if (!/\S+@\S+\.\S+/.test(formData.email)) return false;
        if (!formData.citizenship) return false;
        if (!formData.birth_date) return false;
        if (!formData.id_type) return false;
        if (!formData.id_number.trim()) return false;
        const idValidation = validateIDNumber(formData.id_number);
        if (!idValidation.valid) return false;
        if (!formData.operator_type) return false;
        return true;
      },
      4: () => {
        if (!formData.make_brand.trim()) return false;
        if (!formData.model.trim()) return false;
        if (!formData.engine_number.trim()) return false;
        const engineValidation = validateEngineNumber(formData.engine_number);
        if (!engineValidation.valid) return false;
        if (!formData.chassis_number.trim()) return false;
        const chassisValidation = validateChassisNumber(formData.chassis_number);
        if (!chassisValidation.valid) return false;
        if (!formData.plate_number.trim()) return false;
        const plateValidation = validatePlateNumber(formData.plate_number);
        if (!plateValidation.valid) return false;
        if (!formData.year_acquired.trim()) return false;
        const yearValidation = validateYearAcquired(formData.year_acquired);
        if (!yearValidation.valid) return false;
        if (!formData.color.trim()) return false;
        if (!formData.vehicle_type.trim()) return false;
        if (!formData.lto_or_number.trim()) return false;
        const orValidation = validateORNumber(formData.lto_or_number);
        if (!orValidation.valid) return false;
        if (!formData.lto_cr_number.trim()) return false;
        const crValidation = validateCRNumber(formData.lto_cr_number);
        if (!crValidation.valid) return false;
        if (!formData.lto_expiration_date) return false;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const selectedDate = new Date(formData.lto_expiration_date);
        if (selectedDate < today) return false;
        if (!formData.district.trim()) return false;
        return true;
      },
      5: () => {
        const requiredDocs = ['old_permit_copy', 'lto_cr_copy', 'lto_or_copy', 'community_tax_certificate'];
        if (renewalType === 'MAYOR') {
          requiredDocs.push('barangay_business_clearance', 'previous_mayors_permit');
        }
        
        // Check barangay clearance (either ID or upload)
        const hasBarangayClearance = barangayClearanceMethod === 'id' 
          ? formData.barangay_clearance_id?.trim() 
          : formData.barangay_clearance_file;
        
        if (!hasBarangayClearance) return false;
        
        return requiredDocs.every(doc => formData[doc]);
      },
      6: () => {
        if (formData.payment_method === 'upload') {
          const feeChecks = [
            { checked: formData.renewal_fee_checked, receipt: formData.renewal_fee_receipt, or: formData.renewal_fee_or },
            { checked: formData.sticker_fee_checked, receipt: formData.sticker_fee_receipt, or: formData.sticker_fee_or },
            { checked: formData.inspection_fee_checked, receipt: formData.inspection_fee_receipt, or: formData.inspection_fee_or }
          ];
          
          return feeChecks.some(fee => fee.checked && fee.receipt && fee.or);
        } else {
          // For online payment, just check if at least one fee is selected
          const hasSelectedFee = formData.renewal_fee_checked || formData.sticker_fee_checked || 
                                formData.inspection_fee_checked;
          return hasSelectedFee;
        }
      },
      7: () => formData.applicant_signature && agreeDeclaration,
      8: () => true
    };
    
    return validators[step] ? validators[step]() : true;
  };

  const getFullName = () => {
    return `${formData.first_name} ${formData.middle_initial ? formData.middle_initial + '.' : ''} ${formData.last_name}`.trim();
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      if (currentStep === 2 && !existingPermit) {
        showErrorMessage("Please verify your existing permit before proceeding.");
        return;
      }
      
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
      nextStep();
    } else if (currentStep === steps.length - 1) {
      const ok = validateStep(currentStep);
      if (ok) {
        setCurrentStep(currentStep + 1);
        setErrors({});
      }
    } else {
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
    if (!existingPermit) {
      showErrorMessage("Please verify your existing permit before submitting.");
      setShowConfirmModal(false);
      return;
    }

    setIsSubmitting(true);
    
    const backendUrl = "/backend/franchise_permit/franchise_permit.php";
    
    try {
      const formDataToSend = new FormData();
      
      // Add all form data (including files)
      Object.keys(formData).forEach(key => {
        const value = formData[key];
        
        if (value === null || value === undefined) {
          return;
        }
        
        if (value instanceof File) {
          formDataToSend.append(key, value);
        } else if (typeof value === 'boolean') {
          formDataToSend.append(key, value ? '1' : '0');
        } else {
          formDataToSend.append(key, String(value));
        }
      });
      
      formDataToSend.append('permit_type', permitType);
      formDataToSend.append('renewal_type', renewalType);
      formDataToSend.append('original_permit_id', formData.original_permit_id);
      formDataToSend.append('barangay_clearance_method', barangayClearanceMethod);
      
      // Add checkbox values
      formDataToSend.append('renewal_fee_checked', formData.renewal_fee_checked ? '1' : '0');
      formDataToSend.append('sticker_fee_checked', formData.sticker_fee_checked ? '1' : '0');
      formDataToSend.append('inspection_fee_checked', formData.inspection_fee_checked ? '1' : '0');
      
      const response = await fetch(backendUrl, {
        method: "POST",
        body: formDataToSend
      });
      
      const responseText = await response.text();
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error("Failed to parse JSON:", parseError);
        showErrorMessage("Invalid response from server");
        setShowConfirmModal(false);
        return;
      }
      
      if (data.success) {
        showSuccessMessage(`Renewal application submitted successfully! Application ID: ${data.data.application_id}`);
        
        setTimeout(() => {
          navigate("/user/permittracker");
        }, 3000);
      } else {
        showErrorMessage(`Error: ${data.message || 'Unknown error'}`);
      }
      
    } catch (error) {
      console.error("Submit error:", error);
      showErrorMessage("Failed to submit renewal application. Please check your connection.");
    } finally {
      setIsSubmitting(false);
      setShowConfirmModal(false);
    }
  };

  const handleSignatureUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData(prev => ({
          ...prev,
          applicant_signature: event.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const renderInputField = (name, label, type = 'text', options = [], required = false, note = '') => {
    const isAutoFilled = autoFilledFields[name];
    
    return (
      <div className="relative">
        <label className="block mb-2 font-medium" style={{ color: COLORS.secondary }}>
          {label} {required && '*'}
        </label>
        
        {type === 'select' ? (
          <select
            name={name}
            value={formData[name] || ''}
            onChange={handleChange}
            className={`w-full p-3 border rounded-lg ${
              errors[name] ? 'border-red-500' : 'border-black'
            } ${isAutoFilled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}
            style={{ color: COLORS.secondary, fontFamily: COLORS.font }}
            required={required}
            disabled={isAutoFilled}
          >
            <option value="">Select {label.replace('*', '').trim()}</option>
            {options.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        ) : (
          <input
            type={type}
            name={name}
            value={formData[name] || ''}
            onChange={handleChange}
            placeholder={label}
            className={`w-full p-3 border rounded-lg ${
              errors[name] ? 'border-red-500' : 'border-black'
            } ${isAutoFilled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}
            style={{ color: COLORS.secondary, fontFamily: COLORS.font }}
            required={required}
            readOnly={isAutoFilled}
          />
        )}
        
        {isAutoFilled && (
          <div className="absolute top-9 right-0 mt-1 mr-3">
            <div className="flex items-center text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
              <Check className="w-3 h-3 mr-1" />
              Auto-filled
            </div>
          </div>
        )}
        
        {note && (
          <p className="text-xs text-gray-500 mt-1" style={{ fontFamily: COLORS.font }}>
            {note}
          </p>
        )}
        
        {errors[name] && (
          <p className="text-red-600 text-sm mt-1" style={{ fontFamily: COLORS.font }}>
            {errors[name]}
          </p>
        )}
      </div>
    );
  };

  // Step 5: Required Documents with combined Barangay Clearance
  const renderStep5Content = () => {
    return (
      <div className="space-y-6">
        <h3 className="text-xl font-semibold mb-4" style={{ color: COLORS.secondary }}>Required Documents for Renewal</h3>
        <p className="text-sm mb-4 text-gray-600" style={{ fontFamily: COLORS.font }}>
          <span className="text-red-600 font-bold">* All required documents must be uploaded.</span> Documents marked with * are required for {renewalType === 'MTOP' ? 'MTOP' : 'Mayor\'s Permit'} renewal.
        </p>
        
        {errors.min_documents && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg mb-4">
            <p className="text-red-600 font-medium" style={{ fontFamily: COLORS.font }}>{errors.min_documents}</p>
          </div>
        )}
        
        {/* Combined Barangay Clearance Field */}
        <div className="bg-white rounded-lg shadow p-6 border border-black mb-6">
          <h4 className="font-bold text-lg mb-4" style={{ color: COLORS.primary }}>
            Barangay Clearance Information *
          </h4>
          <p className="text-sm text-gray-600 mb-4">
            Provide either your Barangay Clearance ID or upload the clearance document.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div 
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-300 ${
                barangayClearanceMethod === 'id' ? 
                'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
              }`} 
              onClick={() => setBarangayClearanceMethod('id')}
            >
              <div className="flex items-center">
                <div className={`w-5 h-5 rounded-full border-2 mr-3 ${
                  barangayClearanceMethod === 'id' ? 
                  'border-blue-500 bg-blue-500' : 'border-gray-300'
                }`}>
                  {barangayClearanceMethod === 'id' && (
                    <div className="w-full h-full flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
                <div>
                  <h5 className="font-semibold">Enter Clearance ID</h5>
                  <p className="text-sm text-gray-600">
                    Enter your Barangay Clearance ID number
                  </p>
                </div>
              </div>
            </div>
            
            <div 
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-300 ${
                barangayClearanceMethod === 'upload' ? 
                'border-green-500 bg-green-50' : 'border-gray-300 hover:border-gray-400'
              }`} 
              onClick={() => setBarangayClearanceMethod('upload')}
            >
              <div className="flex items-center">
                <div className={`w-5 h-5 rounded-full border-2 mr-3 ${
                  barangayClearanceMethod === 'upload' ? 
                  'border-green-500 bg-green-500' : 'border-gray-300'
                }`}>
                  {barangayClearanceMethod === 'upload' && (
                    <div className="w-full h-full flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
                <div>
                  <h5 className="font-semibold">Upload Clearance Document</h5>
                  <p className="text-sm text-gray-600">
                    Upload scanned copy or photo of clearance
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {barangayClearanceMethod === 'id' ? (
            <div>
              <label className="block mb-2 font-medium" style={{ color: COLORS.secondary }}>
                Barangay Clearance ID *
              </label>
              <input
                type="text"
                name="barangay_clearance_id"
                value={formData.barangay_clearance_id || ''}
                onChange={handleChange}
                placeholder="Enter Barangay Clearance ID"
                className={`w-full p-3 border rounded-lg ${errors.barangay_clearance_id ? 'border-red-500' : 'border-black'}`}
                style={{ color: COLORS.secondary, fontFamily: COLORS.font }}
                required
              />
              {errors.barangay_clearance_id && (
                <p className="text-red-600 text-sm mt-1" style={{ fontFamily: COLORS.font }}>
                  {errors.barangay_clearance_id}
                </p>
              )}
              <p className="text-xs text-gray-500 mt-1">Enter your Barangay Clearance/Certification ID number</p>
            </div>
          ) : (
            <div>
              <label className="block mb-2 font-medium" style={{ color: COLORS.secondary }}>
                Barangay Clearance Document *
              </label>
              <div className="flex items-center gap-3 p-3 border border-black rounded w-full bg-white">
                <Upload className="w-5 h-5 text-gray-500" />
                <input 
                  type="file" 
                  name="barangay_clearance_file" 
                  onChange={handleChange} 
                  accept=".jpg,.jpeg,.png,.pdf" 
                  className="w-full text-sm file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-sm file:font-medium file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                  style={{ fontFamily: COLORS.font }}
                  required
                />
              </div>
              {errors.barangay_clearance_file && (
                <p className="text-red-600 text-sm mt-1" style={{ fontFamily: COLORS.font }}>
                  {errors.barangay_clearance_file}
                </p>
              )}
              {formData.barangay_clearance_file && (
                <p className="text-green-600 text-xs mt-1 flex items-center">
                  <Check className="w-3 h-3 mr-1" />
                  Uploaded: {formData.barangay_clearance_file.name}
                </p>
              )}
              <p className="text-xs text-gray-500 mt-1">Upload scanned copy or photo of your Barangay Clearance</p>
            </div>
          )}
        </div>
        
        <div className="space-y-4">
          {/* Common required documents */}
          {[
            { name: 'old_permit_copy', label: 'Old Permit Copy *', description: 'Photocopy of your existing permit for renewal' },
            { name: 'lto_cr_copy', label: 'LTO CR Copy *', description: 'Photocopy of LTO Certificate of Registration' },
            { name: 'lto_or_copy', label: 'LTO OR Copy *', description: 'Photocopy of valid LTO Official Receipt' },
            { name: 'community_tax_certificate', label: 'Community Tax Certificate *', description: 'CTC/Cedula' },
          ].map((doc) => (
            <div key={doc.name} className="flex flex-col p-4 border border-gray-300 rounded-lg">
              <div className="mb-3">
                <label className="flex items-center font-medium">
                  <span className="text-red-600" style={{ fontFamily: COLORS.font }}>
                    {doc.label}
                  </span>
                </label>
                {doc.description && <p className="text-sm text-gray-600 mt-1">{doc.description}</p>}
              </div>
              <div>
                <div className="flex items-center gap-3 p-3 border border-black rounded w-full bg-white">
                  <Upload className="w-5 h-5 text-gray-500" />
                  <input 
                    type="file" 
                    name={doc.name} 
                    onChange={handleChange} 
                    accept=".jpg,.jpeg,.png,.pdf" 
                    className="w-full text-sm file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-sm file:font-medium file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                    style={{ fontFamily: COLORS.font }}
                    required
                  />
                </div>
                {errors[doc.name] && <p className="text-red-600 text-sm mt-1" style={{ fontFamily: COLORS.font }}>{errors[doc.name]}</p>}
                {formData[doc.name] && (
                  <p className="text-green-600 text-xs mt-1 flex items-center">
                    <Check className="w-3 h-3 mr-1" />
                    Uploaded: {formData[doc.name].name}
                  </p>
                )}
              </div>
            </div>
          ))}
          
          {/* Optional documents */}
          {[
            { name: 'drivers_license', label: 'Driver\'s License', description: 'Valid driver\'s license of the operator (if applicable)', optional: true },
            { name: 'inspection_report', label: 'Inspection Report', description: 'Roadworthiness inspection report (if required)', optional: true },
          ].map((doc) => (
            <div key={doc.name} className="flex flex-col p-4 border border-gray-300 rounded-lg">
              <div className="mb-3">
                <label className="flex items-center font-medium">
                  <span style={{ color: COLORS.secondary, fontFamily: COLORS.font }}>
                    {doc.label}
                  </span>
                  {doc.optional && <span className="ml-2 text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">Optional</span>}
                </label>
                {doc.description && <p className="text-sm text-gray-600 mt-1">{doc.description}</p>}
              </div>
              <div>
                <div className="flex items-center gap-3 p-3 border border-black rounded w-full bg-white">
                  <Upload className="w-5 h-5 text-gray-500" />
                  <input 
                    type="file" 
                    name={doc.name} 
                    onChange={handleChange} 
                    accept=".jpg,.jpeg,.png,.pdf" 
                    className="w-full text-sm file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-sm file:font-medium file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                    style={{ fontFamily: COLORS.font }}
                  />
                </div>
                {formData[doc.name] && (
                  <p className="text-green-600 text-xs mt-1 flex items-center">
                    <Check className="w-3 h-3 mr-1" />
                    Uploaded: {formData[doc.name].name}
                  </p>
                )}
              </div>
            </div>
          ))}
          
          {/* Mayor's Permit specific documents */}
          {renewalType === 'MAYOR' && (
            <>
              {[
                { name: 'barangay_business_clearance', label: 'Barangay Business Clearance *', description: 'Business clearance from your barangay' },
                { name: 'previous_mayors_permit', label: 'Previous Mayor\'s Permit *', description: 'Copy of previous/current Mayor\'s Permit' },
              ].map((doc) => (
                <div key={doc.name} className="flex flex-col p-4 border border-gray-300 rounded-lg">
                  <div className="mb-3">
                    <label className="flex items-center font-medium">
                      <span className="text-red-600" style={{ fontFamily: COLORS.font }}>
                        {doc.label}
                      </span>
                    </label>
                    {doc.description && <p className="text-sm text-gray-600 mt-1">{doc.description}</p>}
                  </div>
                  <div>
                    <div className="flex items-center gap-3 p-3 border border-black rounded w-full bg-white">
                      <Upload className="w-5 h-5 text-gray-500" />
                      <input 
                        type="file" 
                        name={doc.name} 
                        onChange={handleChange} 
                        accept=".jpg,.jpeg,.png,.pdf" 
                        className="w-full text-sm file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-sm file:font-medium file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                        style={{ fontFamily: COLORS.font }}
                        required
                      />
                    </div>
                    {errors[doc.name] && <p className="text-red-600 text-sm mt-1" style={{ fontFamily: COLORS.font }}>{errors[doc.name]}</p>}
                    {formData[doc.name] && (
                      <p className="text-green-600 text-xs mt-1 flex items-center">
                        <Check className="w-3 h-3 mr-1" />
                        Uploaded: {formData[doc.name].name}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    );
  };

  // Step 6: Payment Information - REMOVED BUSINESS TAX
  const renderStep6Content = () => {
    return (
      <div className="space-y-6">
        <h3 className="text-xl font-semibold mb-4" style={{ color: COLORS.secondary }}>Payment Information</h3>
        <p className="text-sm mb-4 text-gray-600" style={{ fontFamily: COLORS.font }}>
          <span className="text-red-600 font-bold">* Please select your payment method and choose which fees to pay.</span>
        </p>
        
        {errors.payment && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg mb-4">
            <p className="text-red-600 font-medium" style={{ fontFamily: COLORS.font }}>{errors.payment}</p>
          </div>
        )}
        
        {/* Show payment success notification */}
        {paymentStatus.isPaid && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center">
              <Check className="w-6 h-6 text-green-600 mr-3" />
              <div>
                <p className="font-semibold text-green-700">
                  ✓ Payment Completed
                </p>
                <p className="text-sm text-green-600 mt-1">
                  Your payment has been verified. You can now proceed to the next step.
                </p>
                {paymentStatus.paymentDate && (
                  <p className="text-xs text-green-600 mt-1">
                    Paid on: {new Date(paymentStatus.paymentDate).toLocaleDateString()}
                  </p>
                )}
                {paymentStatus.transactionId && (
                  <p className="text-xs text-green-600 mt-1">
                    Transaction ID: {paymentStatus.transactionId}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
        
        {/* Payment Method Selection */}
        <div className="bg-white rounded-lg shadow p-6 border border-black mb-6">
          <h4 className="font-bold text-lg mb-4" style={{ color: COLORS.primary }}>
            Select Payment Method
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div 
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-300 ${
                formData.payment_method === 'upload' ? 
                'border-green-500 bg-green-50' : 'border-gray-300 hover:border-gray-400'
              }`} 
              onClick={() => handlePaymentMethodChange('upload')}
            >
              <div className="flex items-center">
                <div className={`w-5 h-5 rounded-full border-2 mr-3 ${
                  formData.payment_method === 'upload' ? 
                  'border-green-500 bg-green-500' : 'border-gray-300'
                }`}>
                  {formData.payment_method === 'upload' && (
                    <div className="w-full h-full flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
                <div>
                  <h5 className="font-semibold">Upload Receipts</h5>
                  <p className="text-sm text-gray-600">
                    Upload payment receipts from offline payment
                  </p>
                </div>
              </div>
            </div>
            
            <div 
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-300 ${
                formData.payment_method === 'online' ? 
                'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
              }`} 
              onClick={() => handlePaymentMethodChange('online')}
            >
              <div className="flex items-center">
                <div className={`w-5 h-5 rounded-full border-2 mr-3 ${
                  formData.payment_method === 'online' ? 
                  'border-blue-500 bg-blue-500' : 'border-gray-300'
                }`}>
                  {formData.payment_method === 'online' && (
                    <div className="w-full h-full flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
                <div>
                  <h5 className="font-semibold">Pay Online Now</h5>
                  <p className="text-sm text-gray-600">
                    Pay securely via Revenue Treasury portal
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Fees Selection - REMOVED BUSINESS TAX */}
        <div className="bg-white rounded-lg shadow p-6 border border-black">
          <h4 className="font-bold text-lg mb-4" style={{ color: COLORS.primary }}>
            Select Fees to Pay
          </h4>
          <div className="space-y-4">
            {[
              { 
                name: 'renewal_fee', 
                label: renewalType === 'MTOP' ? 'MTOP Renewal Fee' : 'Mayor\'s Permit Renewal Fee', 
                amount: FEES.renewal_fee, 
                checked: formData.renewal_fee_checked 
              },
              { 
                name: 'sticker_fee', 
                label: 'Sticker Fee', 
                amount: FEES.sticker_fee, 
                checked: formData.sticker_fee_checked 
              },
              { 
                name: 'inspection_fee', 
                label: 'Inspection Fee', 
                amount: FEES.inspection_fee, 
                checked: formData.inspection_fee_checked 
              }
            ].map((fee) => (
              <div key={fee.name} className="flex flex-col p-4 border border-gray-300 rounded-lg">
                <label className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      name={`${fee.name}_checked`} 
                      checked={fee.checked} 
                      onChange={handleChange} 
                      className="w-5 h-5 mr-2" 
                      style={{ color: COLORS.primary }} 
                    />
                    <span className="font-medium" style={{ color: COLORS.secondary, fontFamily: COLORS.font }}>
                      {fee.label}
                    </span>
                  </div>
                  <span className="font-bold" style={{ color: COLORS.primary }}>
                    ₱{fee.amount.toFixed(2)}
                  </span>
                </label>
                
                {fee.checked && formData.payment_method === 'online' && (
                  <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded">
                    <p className="text-sm text-blue-700">
                      This fee will be included in your online payment. You will be redirected to the Revenue Treasury portal to complete payment.
                    </p>
                  </div>
                )}
                
                {fee.checked && formData.payment_method === 'upload' && (
                  <div className="mt-3 space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block mb-2 text-sm font-medium" style={{ color: COLORS.secondary, fontFamily: COLORS.font }}>
                          OR Number
                        </label>
                        <input 
                          type="text" 
                          name={`${fee.name}_or`} 
                          value={formData[`${fee.name}_or`] || ''} 
                          onChange={handleChange} 
                          placeholder="OR Number" 
                          className="w-full p-2 border border-black rounded" 
                          style={{ fontFamily: COLORS.font }}
                          required={fee.checked}
                        />
                      </div>
                      <div>
                        <label className="block mb-2 text-sm font-medium" style={{ color: COLORS.secondary, fontFamily: COLORS.font }}>
                          Receipt *
                        </label>
                        <div className="flex items-center gap-3 p-2 border border-black rounded w-full bg-white">
                          <Upload className="w-4 h-4 text-gray-500" />
                          <input 
                            type="file" 
                            name={`${fee.name}_receipt`} 
                            onChange={handleChange} 
                            accept=".jpg,.jpeg,.png,.pdf" 
                            className="w-full text-sm file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-sm file:font-medium file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                            style={{ fontFamily: COLORS.font }}
                            required={fee.checked}
                          />
                        </div>
                        {formData[`${fee.name}_receipt`] && (
                          <p className="text-green-600 text-xs mt-1 flex items-center">
                            <Check className="w-3 h-3 mr-1" />
                            Uploaded: {formData[`${fee.name}_receipt`].name}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
                
                {errors[`${fee.name}_receipt`] && (
                  <p className="text-red-600 text-sm mt-2">
                    {errors[`${fee.name}_receipt`]}
                  </p>
                )}
              </div>
            ))}
            
            <div className="mt-6 p-4 bg-gray-50 border border-gray-300 rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold" style={{ color: COLORS.secondary }}>
                    Total Amount:
                  </p>
                  <p className="text-sm text-gray-600">
                    Selected {formData.payment_method === 'online' ? 'for online payment' : 'for receipt upload'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold" style={{ color: COLORS.primary }}>
                    ₱{(
                      (formData.renewal_fee_checked ? FEES.renewal_fee : 0) + 
                      (formData.sticker_fee_checked ? FEES.sticker_fee : 0) + 
                      (formData.inspection_fee_checked ? FEES.inspection_fee : 0)
                    ).toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-600">
                    {[
                      formData.renewal_fee_checked, 
                      formData.sticker_fee_checked, 
                      formData.inspection_fee_checked
                    ].filter(Boolean).length} fee(s) selected
                  </p>
                </div>
              </div>
            </div>
            
            {formData.payment_method === 'online' && (
              <div className="mt-6">
                <button 
                  type="button" 
                  onClick={handleOnlinePayment} 
                  disabled={!formData.renewal_fee_checked && !formData.sticker_fee_checked && !formData.inspection_fee_checked} 
                  style={{ 
                    background: (!formData.renewal_fee_checked && !formData.sticker_fee_checked && !formData.inspection_fee_checked) ? 
                    '#9CA3AF' : COLORS.primary 
                  }} 
                  className="w-full py-3 rounded-lg font-semibold text-white transition-colors duration-300 flex items-center justify-center gap-3"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  Pay Now via Revenue Treasury (Opens in New Tab)
                </button>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  You will be redirected to the Revenue Treasury secure payment portal in a new tab
                </p>
              </div>
            )}
            
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm font-medium text-yellow-800 mb-2">
                Payment Instructions:
              </p>
              <ul className="text-xs text-yellow-700 space-y-1">
                <li>• Select at least one fee to proceed</li>
                <li>• For online payment: Click "Pay Now" to complete payment in a new tab</li>
                <li>• For receipt upload: Upload clear photos/scans of official receipts</li>
                <li>• All fees are non-refundable once paid</li>
                <li>• Keep your payment references for verification</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Step 4: Vehicle Information with permanent notes
  const renderStep4Content = () => {
    return (
      <div className="space-y-6">
        <h3 className="text-xl font-semibold mb-4" style={{ color: COLORS.secondary }}>Vehicle Information</h3>
        
        {existingPermit && (
          <div className="p-4 rounded-lg border mb-4 bg-blue-50 border-blue-200">
            <div className="flex items-start">
              <div className="bg-blue-100 p-2 rounded-full mr-3">
                <Check className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-blue-700">✓ Vehicle Data Auto-filled from Existing Permit (READ-ONLY)</p>
                <p className="text-xs mt-1 text-blue-600">
                  Vehicle information has been automatically filled from your existing permit and cannot be modified.
                </p>
              </div>
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderInputField('make_brand', 'Make / Brand *', 'text', [], true)}
          {renderInputField('model', 'Model *', 'text', [], true)}
          
          {/* Engine Number with permanent note */}
          <div className="relative">
            <label className="block mb-2 font-medium" style={{ color: COLORS.secondary }}>Engine Number *</label>
            <input
              type="text"
              name="engine_number"
              value={formData.engine_number || ''}
              onChange={handleChange}
              placeholder="Enter engine number"
              maxLength="12"
              className={`w-full p-3 border rounded-lg ${errors.engine_number ? 'border-red-500' : 'border-black'} ${
                autoFilledFields['engine_number'] ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'
              }`}
              style={{ color: COLORS.secondary, fontFamily: COLORS.font, textTransform: 'uppercase' }}
              required={true}
              readOnly={autoFilledFields['engine_number']}
            />
            <p className="text-xs text-gray-500 mt-1">Must be 8-12 characters</p>
            {errors.engine_number && (
              <p className="text-red-600 text-sm mt-1" style={{ fontFamily: COLORS.font }}>{errors.engine_number}</p>
            )}
          </div>
          
          {/* Chassis Number with permanent note */}
          <div className="relative">
            <label className="block mb-2 font-medium" style={{ color: COLORS.secondary }}>Chassis Number *</label>
            <input
              type="text"
              name="chassis_number"
              value={formData.chassis_number || ''}
              onChange={handleChange}
              placeholder="Enter chassis number"
              maxLength="17"
              className={`w-full p-3 border rounded-lg ${errors.chassis_number ? 'border-red-500' : 'border-black'} ${
                autoFilledFields['chassis_number'] ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'
              }`}
              style={{ color: COLORS.secondary, fontFamily: COLORS.font, textTransform: 'uppercase' }}
              required={true}
              readOnly={autoFilledFields['chassis_number']}
            />
            <p className="text-xs text-gray-500 mt-1">Must be exactly 17 characters</p>
            {errors.chassis_number && (
              <p className="text-red-600 text-sm mt-1" style={{ fontFamily: COLORS.font }}>{errors.chassis_number}</p>
            )}
          </div>
          
          {/* Plate Number with permanent note */}
          <div className="relative">
            <label className="block mb-2 font-medium" style={{ color: COLORS.secondary }}>Plate Number *</label>
            <input
              type="text"
              name="plate_number"
              value={formData.plate_number || ''}
              onChange={handleChange}
              placeholder="ABC1234"
              maxLength="7"
              className={`w-full p-3 border rounded-lg ${errors.plate_number ? 'border-red-500' : 'border-black'} ${
                autoFilledFields['plate_number'] ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'
              }`}
              style={{ color: COLORS.secondary, fontFamily: COLORS.font, textTransform: 'uppercase' }}
              required={true}
              readOnly={autoFilledFields['plate_number']}
            />
            <p className="text-xs text-gray-500 mt-1">Format: 3 letters + 4 digits (e.g., ABC1234)</p>
            {errors.plate_number && (
              <p className="text-red-600 text-sm mt-1" style={{ fontFamily: COLORS.font }}>{errors.plate_number}</p>
            )}
          </div>
          
          {/* Year Acquired with permanent note */}
          <div className="relative">
            <label className="block mb-2 font-medium" style={{ color: COLORS.secondary }}>Year Acquired *</label>
            <input
              type="text"
              name="year_acquired"
              value={formData.year_acquired || ''}
              onChange={handleChange}
              placeholder="YYYY"
              maxLength="4"
              className={`w-full p-3 border rounded-lg ${errors.year_acquired ? 'border-red-500' : 'border-black'} ${
                autoFilledFields['year_acquired'] ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'
              }`}
              style={{ color: COLORS.secondary, fontFamily: COLORS.font }}
              required={true}
              readOnly={autoFilledFields['year_acquired']}
            />
            <p className="text-xs text-gray-500 mt-1">Must be a valid 4-digit year (1900-present)</p>
            {errors.year_acquired && (
              <p className="text-red-600 text-sm mt-1" style={{ fontFamily: COLORS.font }}>{errors.year_acquired}</p>
            )}
          </div>
          
          {renderInputField('color', 'Color *', 'text', [], true)}
          {renderInputField('vehicle_type', 'Vehicle Type *', 'select', ['Tricycle', 'Motorcycle', 'Pedicabs', 'E-Tricycle'], true)}
          
          {/* LTO OR Number with permanent note */}
          <div className="relative">
            <label className="block mb-2 font-medium" style={{ color: COLORS.secondary }}>LTO OR Number *</label>
            <input
              type="text"
              name="lto_or_number"
              value={formData.lto_or_number || ''}
              onChange={handleChange}
              placeholder="Enter OR number"
              maxLength="8"
              className={`w-full p-3 border rounded-lg ${errors.lto_or_number ? 'border-red-500' : 'border-black'} ${
                autoFilledFields['lto_or_number'] ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'
              }`}
              style={{ color: COLORS.secondary, fontFamily: COLORS.font }}
              required={true}
              readOnly={autoFilledFields['lto_or_number']}
            />
            <p className="text-xs text-gray-500 mt-1">Must be 7-8 digits</p>
            {errors.lto_or_number && (
              <p className="text-red-600 text-sm mt-1" style={{ fontFamily: COLORS.font }}>{errors.lto_or_number}</p>
            )}
          </div>
          
          {/* LTO CR Number with permanent note */}
          <div className="relative">
            <label className="block mb-2 font-medium" style={{ color: COLORS.secondary }}>LTO CR Number *</label>
            <input
              type="text"
              name="lto_cr_number"
              value={formData.lto_cr_number || ''}
              onChange={handleChange}
              placeholder="Enter CR number"
              maxLength="8"
              className={`w-full p-3 border rounded-lg ${errors.lto_cr_number ? 'border-red-500' : 'border-black'} ${
                autoFilledFields['lto_cr_number'] ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'
              }`}
              style={{ color: COLORS.secondary, fontFamily: COLORS.font }}
              required={true}
              readOnly={autoFilledFields['lto_cr_number']}
            />
            <p className="text-xs text-gray-500 mt-1">Must be 7-8 digits</p>
            {errors.lto_cr_number && (
              <p className="text-red-600 text-sm mt-1" style={{ fontFamily: COLORS.font }}>{errors.lto_cr_number}</p>
            )}
          </div>
          
          <div className="relative">
            <label className="block mb-2 font-medium" style={{ color: COLORS.secondary }}>LTO Expiration Date *</label>
            <input
              type="date"
              name="lto_expiration_date"
              value={formData.lto_expiration_date || ''}
              onChange={handleChange}
              className={`w-full p-3 border rounded-lg ${errors.lto_expiration_date ? 'border-red-500' : 'border-black'} ${
                autoFilledFields['lto_expiration_date'] ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'
              }`}
              style={{ color: COLORS.secondary, fontFamily: COLORS.font }}
              readOnly={autoFilledFields['lto_expiration_date']}
            />
            <p className="text-xs text-gray-500 mt-1">Must be a future date</p>
            {errors.lto_expiration_date && <p className="text-red-600 text-sm mt-1" style={{ fontFamily: COLORS.font }}>{errors.lto_expiration_date}</p>}
          </div>
          
          <div className="relative">
            <label className="block mb-2 font-medium" style={{ color: COLORS.secondary }}>MV File Number</label>
            <input
              type="text"
              name="mv_file_number"
              value={formData.mv_file_number || ''}
              onChange={handleChange}
              placeholder="MV File Number"
              className={`w-full p-3 border border-black rounded-lg ${
                autoFilledFields['mv_file_number'] ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'
              }`}
              style={{ color: COLORS.secondary, fontFamily: COLORS.font }}
              readOnly={autoFilledFields['mv_file_number']}
            />
          </div>
          
          {renderInputField('district', 'District *', 'text', [], true)}
          {renderInputField('route_zone', 'Route / Zone *', 'text', [], true)}
          {renderInputField('barangay_of_operation', 'Barangay of Operation *', 'text', [], true)}
          {renderInputField('toda_name', 'TODA Name', 'text', [], false)}
          {renderInputField('company_name', 'Company/Organization Name', 'text', [], false)}
        </div>
      </div>
    );
  };

  // Main render function for step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold mb-4" style={{ color: COLORS.secondary }}>Select Permit to Renew</h3>
            
            <div className="bg-white rounded-lg shadow p-6 border border-black">
              <div className="space-y-4">
                <div 
                  className="p-6 border-2 border-blue-300 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors duration-200 cursor-pointer" 
                  onClick={() => setRenewalType('MTOP')}
                >
                  <div className="flex items-center">
                    <input
                      type="radio"
                      name="renewal_type"
                      value="MTOP"
                      checked={renewalType === 'MTOP'}
                      onChange={handleChange}
                      className="w-5 h-5 text-blue-600"
                    />
                    <div className="ml-4">
                      <div className="flex items-center gap-3">
                        <RefreshCw className="w-6 h-6 text-blue-600" />
                        <h4 className="font-bold text-xl" style={{ color: COLORS.primary }}>MTOP Renewal</h4>
                      </div>
                      <p className="text-sm mt-2" style={{ color: COLORS.secondary }}>
                        Motorized Tricycle Operator's Permit (MTOP) must be renewed annually so your tricycle can legally operate for hire.
                      </p>
                      <div className="mt-4 p-3 bg-blue-100 rounded-lg">
                        <p className="text-sm font-semibold text-blue-800 mb-2">Required Documents:</p>
                        <ul className="text-xs space-y-1 text-blue-700">
                          <li>• Old MTOP permit (for renewal) – photocopy</li>
                          <li>• LTO Certificate of Registration (CR) – photocopy</li>
                          <li>• Valid LTO Official Receipt (OR) – photocopy</li>
                          <li>• Barangay Clearance/Certification (ID or upload)</li>
                          <li>• Community Tax Certificate (CTC/Cedula)</li>
                          <li>• Valid Driver's License (if applicable)</li>
                          <li>• Inspection report (if required)</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div 
                  className="p-6 border-2 border-green-300 rounded-lg bg-green-50 hover:bg-green-100 transition-colors duration-200 cursor-pointer" 
                  onClick={() => setRenewalType('MAYOR')}
                >
                  <div className="flex items-center">
                    <input
                      type="radio"
                      name="renewal_type"
                      value="MAYOR"
                      checked={renewalType === 'MAYOR'}
                      onChange={handleChange}
                      className="w-5 h-5 text-green-600"
                    />
                    <div className="ml-4">
                      <div className="flex items-center gap-3">
                        <Receipt className="w-6 h-6 text-green-600" />
                        <h4 className="font-bold text-xl" style={{ color: COLORS.success }}>Transport Mayor's Permit Renewal</h4>
                      </div>
                      <p className="text-sm mt-2" style={{ color: COLORS.secondary }}>
                        For Mayor's Permit renewal (business/transport category) — this applies if your tricycle operation is registered as a business.
                      </p>
                      <div className="mt-4 p-3 bg-green-100 rounded-lg">
                        <p className="text-sm font-semibold text-green-800 mb-2">Required Documents:</p>
                        <ul className="text-xs space-y-1 text-green-700">
                          <li>• Barangay Business Clearance</li>
                          <li>• Previous Mayor's Permit</li>
                          <li>• Old MTOP permit (photocopy)</li>
                          <li>• LTO CR and OR (photocopies)</li>
                          <li>• Barangay Clearance (ID or upload)</li>
                          <li>• Community Tax Certificate</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium" style={{ color: COLORS.secondary }}>
                    Selected: <span className="font-bold">{renewalType === 'MTOP' ? 'MTOP Renewal' : 'Transport Mayor\'s Permit Renewal'}</span>
                  </p>
                  <p className="text-xs mt-2 text-gray-600">
                    {renewalType === 'MTOP' 
                      ? 'Quezon City Tricycle Franchising Board and TTMD handle MTOP renewal, confirmed yearly with LTO.'
                      : 'Submit to City Treasurer\'s Office with completed renewal application.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold mb-4" style={{ color: COLORS.secondary }}>Verify Existing Permit</h3>
            
            <div className="bg-white rounded-lg shadow p-6 border border-black mb-6">
              <h4 className="font-bold text-lg mb-4" style={{ color: COLORS.primary }}>
                Check {renewalType === 'MTOP' ? 'MTOP' : 'Mayor\'s'} Permit Status
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 font-medium" style={{ color: COLORS.secondary }}>
                    Existing Permit ID *
                  </label>
                  <input
                    type="text"
                    name="existing_permit_id"
                    value={formData.existing_permit_id || ''}
                    onChange={handleChange}
                    placeholder="Enter your existing permit ID"
                    className={`w-full p-3 border rounded-lg ${
                      errors.existing_permit_id ? 'border-red-500' : 'border-black'
                    }`}
                    style={{ color: COLORS.secondary, fontFamily: COLORS.font }}
                  />
                  {errors.existing_permit_id && (
                    <p className="text-red-600 text-sm mt-1">{errors.existing_permit_id}</p>
                  )}
                </div>
                <div>
                  <label className="block mb-2 font-medium" style={{ color: COLORS.secondary }}>
                    Plate Number *
                  </label>
                  <input
                    type="text"
                    name="existing_plate_number"
                    value={formData.existing_plate_number || ''}
                    onChange={handleChange}
                    placeholder="ABC1234"
                    className={`w-full p-3 border rounded-lg ${
                      errors.existing_plate_number ? 'border-red-500' : 'border-black'
                    }`}
                    style={{ color: COLORS.secondary, fontFamily: COLORS.font, textTransform: 'uppercase' }}
                  />
                  {errors.existing_plate_number && (
                    <p className="text-red-600 text-sm mt-1">{errors.existing_plate_number}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">Format: 3 letters followed by 4 digits (e.g., ABC1234)</p>
                </div>
              </div>
              
              <div className="mt-6">
                <button
                  type="button"
                  onClick={checkExistingPermit}
                  disabled={isCheckingExisting || !formData.existing_permit_id || !formData.existing_plate_number}
                  style={{ 
                    background: (isCheckingExisting || !formData.existing_permit_id || !formData.existing_plate_number) 
                      ? '#9CA3AF' 
                      : COLORS.primary 
                  }}
                  className="px-6 py-3 rounded-lg font-semibold text-white transition-colors duration-300"
                >
                  {isCheckingExisting ? 'Checking...' : `Verify ${renewalType === 'MTOP' ? 'MTOP' : 'Mayor\'s'} Permit`}
                </button>
              </div>
            </div>
            
            {existingPermit && (
              <div className="bg-white rounded-lg shadow p-6 border border-black">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-bold text-lg" style={{ color: COLORS.success }}>
                    ✅ Existing Permit Verified
                  </h4>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={resetAutoFilledData}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4" />
                      Clear Data
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm font-medium text-blue-700 mb-2">Permit Details</p>
                    <div className="space-y-1 text-sm">
                      <p><span className="font-medium">Permit ID:</span> {existingPermit.application_id}</p>
                      <p><span className="font-medium">Type:</span> {existingPermit.permit_subtype || renewalType}</p>
                      <p><span className="font-medium">Status:</span> <span className={`font-semibold ${existingPermit.status === 'EXPIRED' ? 'text-red-600' : 'text-green-600'}`}>{existingPermit.status}</span></p>
                      <p><span className="font-medium">Issue Date:</span> {existingPermit.date_approved}</p>
                      <p><span className="font-medium">Expiry Date:</span> {existingPermit.expiry_date}</p>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-sm font-medium text-green-700 mb-2">Vehicle Details</p>
                    <div className="space-y-1 text-sm">
                      <p><span className="font-medium">Plate:</span> {existingPermit.plate_number}</p>
                      <p><span className="font-medium">Make/Model:</span> {existingPermit.make_brand} {existingPermit.model}</p>
                      <p><span className="font-medium">Color:</span> {existingPermit.color}</p>
                      <p><span className="font-medium">Operator:</span> {existingPermit.operator_type}</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-start">
                    <AlertCircle className="w-5 h-5 text-yellow-600 mr-2 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-yellow-800">Data Auto-filled</p>
                      <p className="text-xs mt-1 text-yellow-700">
                        Your information has been automatically filled from your existing permit. Fields marked with "Auto-filled" are read-only.
                        You can clear the data if you need to make changes.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {formData.original_expiry_date && (
              <div className="mt-4">
                <div className={`p-4 rounded-lg border ${
                  new Date(formData.original_expiry_date) < new Date() 
                    ? 'bg-red-50 border-red-200' 
                    : 'bg-green-50 border-green-200'
                }`}>
                  <div className="flex items-start">
                    <Calendar className={`w-5 h-5 mr-2 mt-0.5 ${
                      new Date(formData.original_expiry_date) < new Date() 
                        ? 'text-red-600' 
                        : 'text-green-600'
                    }`} />
                    <div>
                      <p className={`text-sm font-medium ${
                        new Date(formData.original_expiry_date) < new Date() 
                          ? 'text-red-700' 
                          : 'text-green-700'
                      }`}>
                        {new Date(formData.original_expiry_date) < new Date() 
                          ? '⚠️ PERMIT EXPIRED' 
                          : '✅ Permit Active'}
                      </p>
                      <p className="text-xs mt-1" style={{ color: COLORS.secondary, fontFamily: COLORS.font }}>
                        Original expiry date: {formData.original_expiry_date}
                        {new Date(formData.original_expiry_date) < new Date() 
                          ? ' (Expired ' + Math.ceil((new Date() - new Date(formData.original_expiry_date)) / (1000 * 60 * 60 * 24)) + ' days ago)'
                          : ' (Expires in ' + Math.ceil((new Date(formData.original_expiry_date) - new Date()) / (1000 * 60 * 60 * 24)) + ' days)'
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold mb-4" style={{ color: COLORS.secondary }}>Applicant Information</h3>
            
            {existingPermit && (
              <div className="p-4 rounded-lg border mb-4 bg-blue-50 border-blue-200">
                <div className="flex items-start">
                  <div className="bg-blue-100 p-2 rounded-full mr-3">
                    <UserCheck className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-blue-700">✓ Data Auto-filled from Existing Permit (READ-ONLY)</p>
                    <p className="text-xs mt-1 text-blue-600">
                      Your information has been automatically filled from your existing permit and cannot be modified.
                      Fields marked with "Auto-filled" are read-only.
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderInputField('first_name', 'First Name *', 'text', [], true)}
              {renderInputField('last_name', 'Last Name *', 'text', [], true)}
              
              <div className="relative">
                <label className="block mb-2 font-medium" style={{ color: COLORS.secondary }}>Middle Initial</label>
                <input
                  type="text"
                  name="middle_initial"
                  value={formData.middle_initial || ''}
                  onChange={handleChange}
                  placeholder="M.I."
                  maxLength="1"
                  className={`w-full p-3 border rounded-lg border-black ${
                    autoFilledFields['middle_initial'] ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'
                  }`}
                  style={{ color: COLORS.secondary, fontFamily: COLORS.font }}
                  readOnly={autoFilledFields['middle_initial']}
                />
                {autoFilledFields['middle_initial'] && (
                  <div className="absolute top-9 right-0 mt-1 mr-3">
                    <div className="flex items-center text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                      <Check className="w-3 h-3 mr-1" />
                      Auto-filled
                    </div>
                  </div>
                )}
              </div>
              
              {renderInputField('home_address', 'Home Address *', 'text', [], true)}
              
              <div className="relative">
                <label className="block mb-2 font-medium" style={{ color: COLORS.secondary }}>Contact Number *</label>
                <input 
                  type="tel" 
                  name="contact_number" 
                  value={formData.contact_number} 
                  onChange={handleChange} 
                  placeholder="09XXXXXXXXX" 
                  maxLength={11}
                  className={`w-full p-3 border rounded-lg ${errors.contact_number ? 'border-red-500' : 'border-black'} ${
                    autoFilledFields['contact_number'] ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'
                  }`}
                  style={{ color: COLORS.secondary, fontFamily: COLORS.font }}
                  readOnly={autoFilledFields['contact_number']}
                />
                <p className="text-xs text-gray-500 mt-1">Must be 11 digits starting with 09</p>
                {errors.contact_number && (
                  <p className="text-red-600 text-sm mt-1" style={{ fontFamily: COLORS.font }}>{errors.contact_number}</p>
                )}
              </div>
              
              {renderInputField('email', 'Email Address *', 'email', [], true)}
              {renderInputField('citizenship', 'Citizenship *', 'select', NATIONALITIES, true)}
              
              <div className="relative">
                <label className="block mb-2 font-medium" style={{ color: COLORS.secondary }}>Date of Birth *</label>
                <input
                  type="date"
                  name="birth_date"
                  value={formData.birth_date || ''}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded-lg ${errors.birth_date ? 'border-red-500' : 'border-black'} ${
                    autoFilledFields['birth_date'] ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'
                  }`}
                  style={{ color: COLORS.secondary, fontFamily: COLORS.font }}
                  readOnly={autoFilledFields['birth_date']}
                />
                {errors.birth_date && <p className="text-red-600 text-sm mt-1" style={{ fontFamily: COLORS.font }}>{errors.birth_date}</p>}
              </div>
              
              {renderInputField('id_type', 'Valid ID Type *', 'select', ["Driver's License", "Passport", "National ID", "UMID", "Postal ID", "Voter's ID"], true)}
              
              <div className="relative">
                <label className="block mb-2 font-medium" style={{ color: COLORS.secondary }}>Valid ID Number *</label>
                <input
                  type="text"
                  name="id_number"
                  value={formData.id_number || ''}
                  onChange={handleChange}
                  placeholder="ID Number"
                  className={`w-full p-3 border rounded-lg ${errors.id_number ? 'border-red-500' : 'border-black'} ${
                    autoFilledFields['id_number'] ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'
                  }`}
                  style={{ color: COLORS.secondary, fontFamily: COLORS.font }}
                  required={true}
                  readOnly={autoFilledFields['id_number']}
                />
              </div>
              
              {renderInputField('operator_type', 'Operator Type *', 'select', OPERATOR_TYPES, true)}
            </div>
          </div>
        );
      case 4:
        return renderStep4Content();
      case 5:
        return renderStep5Content();
      case 6:
        return renderStep6Content();
      case 7:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold mb-4" style={{ color: COLORS.secondary }}>Declaration and Signature</h3>
            
            <div className="bg-white rounded-lg shadow p-6 border border-black">
              <div className="mb-8 p-6 border-2 border-red-200 bg-red-50 rounded-lg">
                <h4 className="font-bold text-lg mb-4 text-red-700">RENEWAL DECLARATION</h4>
                <div className="space-y-3 text-sm" style={{ fontFamily: COLORS.font }}>
                  <p>I, <span className="font-bold">{getFullName() || '[Full Name]'}</span>, hereby solemnly declare that:</p>
                  
                  <ol className="list-decimal ml-5 space-y-2">
                    <li>All information provided in this renewal application is true, complete, and correct;</li>
                    <li>I am the registered owner/authorized representative of the tricycle unit described in this renewal application;</li>
                    <li>The vehicle remains roadworthy and complies with all safety and emission standards;</li>
                    <li>I have secured all necessary clearances, permits, and insurance coverage for renewal;</li>
                    <li>I shall continue to abide by all traffic rules, regulations, and ordinances of Caloocan City;</li>
                    <li>I understand that any false statement or misrepresentation shall be grounds for:</li>
                    <ul className="list-disc ml-8 mt-2 space-y-1">
                      <li>Immediate cancellation of the permit renewal</li>
                      <li>Administrative and criminal liability</li>
                      <li>Blacklisting from future applications</li>
                      <li>Fines and penalties as per existing laws</li>
                    </ul>
                    <li>I agree to the processing of my personal data for renewal purposes in accordance with the Data Privacy Act of 2012;</li>
                    <li>I consent to inspections and monitoring by authorized personnel.</li>
                  </ol>
                  
                  <p className="mt-4 font-semibold">Republic Act No. 4136 - Land Transportation and Traffic Code</p>
                  <p className="text-xs italic">"Any person who makes any false statement in any document required by this Act shall, upon conviction, be punished by a fine of not less than ₱5,000 nor more than ₱20,000 or imprisonment of not less than 6 months nor more than 1 year, or both."</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block mb-2 font-medium" style={{ color: COLORS.secondary }}>
                    Applicant's Signature <span className="text-red-600">*</span>
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 h-32 flex items-center justify-center">
                    {formData.applicant_signature ? (
                      <div className="text-center">
                        <img 
                          src={formData.applicant_signature} 
                          alt="Applicant Signature" 
                          className="max-h-20 mx-auto"
                        />
                        <p className="text-xs mt-2 text-green-600">Signature uploaded</p>
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, applicant_signature: '' }))}
                          className="text-xs text-red-600 mt-1 hover:text-red-800"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <div className="text-center">
                        <p className="text-gray-500 mb-2">Upload your signature</p>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleSignatureUpload}
                          className="hidden"
                          id="signature-upload"
                        />
                        <label
                          htmlFor="signature-upload"
                          className="px-3 py-1.5 text-sm bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition-colors cursor-pointer"
                        >
                          Upload Signature
                        </label>
                        {errors.applicant_signature && (
                          <p className="text-red-600 text-sm mt-1">{errors.applicant_signature}</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block mb-2 font-medium" style={{ color: COLORS.secondary }}>
                    Date of Submission <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="date"
                    name="date_submitted"
                    value={formData.date_submitted}
                    readOnly
                    className="w-full p-3 border border-black rounded-lg bg-gray-50 cursor-not-allowed"
                    style={{ color: COLORS.secondary, fontFamily: COLORS.font }}
                  />
                  <p className="text-xs text-gray-500 mt-1">Automatically set to today's date</p>
                </div>

                <div className="md:col-span-2">
                  <label className="block mb-2 font-medium" style={{ color: COLORS.secondary }}>
                    Barangay Captain/Authorized Signatory (For office use only)
                  </label>
                  <input
                    type="text"
                    name="barangay_captain_signature"
                    value={formData.barangay_captain_signature}
                    onChange={handleChange}
                    placeholder="Will be filled by Barangay Office"
                    className="w-full p-3 border border-gray-300 bg-gray-50 rounded-lg"
                    style={{ color: COLORS.secondary, fontFamily: COLORS.font }}
                    disabled
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block mb-2 font-medium" style={{ color: COLORS.secondary }}>
                    Remarks / Additional Notes
                  </label>
                  <textarea
                    name="remarks"
                    value={formData.remarks}
                    onChange={handleChange}
                    placeholder="Any additional information or special requests..."
                    rows="3"
                    className="w-full p-3 border border-black rounded-lg"
                    style={{ color: COLORS.secondary, fontFamily: COLORS.font }}
                  />
                </div>
              </div>

              <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start">
                  <input
                    type="checkbox"
                    id="final-declaration"
                    checked={agreeDeclaration}
                    onChange={(e) => setAgreeDeclaration(e.target.checked)}
                    className={`w-5 h-5 mt-1 text-green-600 border-gray-300 rounded focus:ring-green-500 ${errors.declaration ? 'border-red-500' : ''}`}
                  />
                  <label htmlFor="final-declaration" className="ml-3">
                    <span className="font-bold text-red-700">FINAL DECLARATION AND CONSENT *</span>
                    <p className="text-sm mt-1" style={{ color: COLORS.secondary, fontFamily: COLORS.font }}>
                      I, <span className="font-semibold">{getFullName() || '[Full Name]'}</span>, have read, understood, and agree to all terms and conditions stated in this renewal declaration. I certify that all information provided is accurate and I accept full responsibility for its veracity.
                    </p>
                    {errors.declaration && (
                      <p className="text-red-600 text-sm mt-1">{errors.declaration}</p>
                    )}
                  </label>
                </div>
              </div>
            </div>
          </div>
        );
      case 8:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold mb-4" style={{ color: COLORS.secondary }}>Review Your Renewal Application</h3>
            <div className="bg-white rounded-lg shadow p-6 border border-black">
              <div className="space-y-6">
                <div className="p-4 bg-blue-50 rounded-lg mb-4">
                  <h5 className="font-bold text-lg mb-2" style={{ color: COLORS.primary }}>
                    {renewalType === 'MTOP' ? 'MTOP Renewal Application' : 'Mayor\'s Permit Renewal Application'}
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                    <p><span className="font-medium">Original Permit ID:</span> {formData.original_permit_id}</p>
                    <p><span className="font-medium">Issue Date:</span> {formData.original_issue_date}</p>
                    <p><span className="font-medium">Expiry Date:</span> {formData.original_expiry_date}</p>
                    <p><span className="font-medium">Status:</span> <span className={`font-semibold ${formData.permit_status === 'EXPIRED' ? 'text-red-600' : 'text-green-600'}`}>{formData.permit_status}</span></p>
                  </div>
                </div>
                
                {existingPermit && (
                  <div className="p-4 rounded-lg border mb-4 bg-blue-50 border-blue-200">
                    <div className="flex items-start">
                      <div className="bg-blue-100 p-2 rounded-full mr-3">
                        <Check className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-blue-700">✓ Data Auto-filled from Existing Permit</p>
                        <p className="text-xs mt-1 text-blue-600">
                          Your application has been pre-filled with data from your existing permit
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                
                <div>
                  <h5 className="font-semibold mb-3 text-lg" style={{ color: COLORS.primary }}>Applicant Information</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm" style={{ fontFamily: COLORS.font }}>
                    <div className="flex items-center">
                      <span className="font-medium w-40">Full Name:</span>
                      <span className="flex-1">{getFullName()}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium w-40">Contact Number:</span>
                      <span className="flex-1">{formData.contact_number}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium w-40">Email:</span>
                      <span className="flex-1">{formData.email}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium w-40">Operator Type:</span>
                      <span className="flex-1">{formData.operator_type}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h5 className="font-semibold mb-3 text-lg" style={{ color: COLORS.primary }}>Vehicle Information</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm" style={{ fontFamily: COLORS.font }}>
                    <div className="flex items-center">
                      <span className="font-medium w-40">Plate Number:</span>
                      <span className="flex-1">{formData.plate_number}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium w-40">Make/Model:</span>
                      <span className="flex-1">{formData.make_brand} {formData.model}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium w-40">Engine Number:</span>
                      <span className="flex-1">{formData.engine_number}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium w-40">Chassis Number:</span>
                      <span className="flex-1">{formData.chassis_number}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h5 className="font-semibold mb-3 text-lg" style={{ color: COLORS.primary }}>Payment Summary</h5>
                  <div className="space-y-4">
                    {[
                      { 
                        name: 'renewal_fee', 
                        label: renewalType === 'MTOP' ? 'MTOP Renewal Fee' : 'Mayor\'s Permit Renewal Fee', 
                        checked: formData.renewal_fee_checked 
                      },
                      { 
                        name: 'sticker_fee', 
                        label: 'Sticker Fee', 
                        checked: formData.sticker_fee_checked 
                      },
                      { 
                        name: 'inspection_fee', 
                        label: 'Inspection Fee', 
                        checked: formData.inspection_fee_checked 
                      }
                    ].map((fee) => (
                      <div key={fee.name} className="flex items-center justify-between p-3 border border-gray-300 rounded-lg">
                        <div className="flex items-center">
                          {fee.checked ? (
                            <Check className="w-5 h-5 text-green-600 mr-3" />
                          ) : (
                            <div className="w-5 h-5 border border-gray-300 rounded mr-3"></div>
                          )}
                          <div>
                            <span className="font-medium">{fee.label}:</span>
                            <p className="text-sm text-gray-600">
                              {fee.checked ? 'Selected' : 'Not selected'}
                            </p>
                          </div>
                        </div>
                        {fee.checked && (
                          <span className="font-bold" style={{ color: COLORS.primary }}>
                            ₱{FEES[fee.name].toFixed(2)}
                          </span>
                        )}
                      </div>
                    ))}
                    
                    <div className="p-4 bg-gray-50 rounded-lg border">
                      <div className="flex justify-between items-center">
                        <p className="font-semibold">Total Amount:</p>
                        <p className="text-2xl font-bold" style={{ color: COLORS.primary }}>
                          ₱{(
                            (formData.renewal_fee_checked ? FEES.renewal_fee : 0) + 
                            (formData.sticker_fee_checked ? FEES.sticker_fee : 0) + 
                            (formData.inspection_fee_checked ? FEES.inspection_fee : 0)
                          ).toFixed(2)}
                        </p>
                      </div>
                      <p className="text-sm text-gray-600 mt-2">
                        Payment Method: <span className={`font-bold ${formData.payment_method === 'online' ? 'text-blue-600' : 'text-green-600'}`}>
                          {formData.payment_method === 'online' ? 'Online Payment' : 'Receipt Upload'}
                        </span>
                      </p>
                      {paymentStatus.isPaid && (
                        <p className="text-sm text-green-600 mt-1">
                          ✓ Payment Status: <span className="font-semibold">Paid</span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                
                <div>
                  <h5 className="font-semibold mb-3 text-lg" style={{ color: COLORS.primary }}>Barangay Clearance</h5>
                  <div className="p-3 border border-gray-300 rounded-lg">
                    <p className="text-sm">
                      <span className="font-medium">Method:</span> {barangayClearanceMethod === 'id' ? 'ID Entry' : 'Document Upload'}
                    </p>
                    {barangayClearanceMethod === 'id' ? (
                      <p className="text-sm mt-1">
                        <span className="font-medium">Clearance ID:</span> {formData.barangay_clearance_id || 'Not provided'}
                      </p>
                    ) : (
                      <p className="text-sm mt-1">
                        <span className="font-medium">File:</span> {formData.barangay_clearance_file?.name || 'Not uploaded'}
                      </p>
                    )}
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
          <h1 className="text-2xl md:text-4xl font-bold" style={{ color: COLORS.primary }}>PERMIT RENEWAL APPLICATION</h1>
          <p className="mt-2" style={{ color: COLORS.secondary }}>
            Renew your {renewalType === 'MTOP' ? 'Motorized Tricycle Operator\'s Permit (MTOP)' : 'Transport Mayor\'s Permit'}.
          </p>
        </div>
        <button
          onClick={() => navigate('/user/franchise/type')}
          onMouseEnter={e => e.currentTarget.style.background = COLORS.accent}
          onMouseLeave={e => e.currentTarget.style.background = COLORS.success}
          style={{ background: COLORS.success }}
          className="px-4 py-2 rounded-lg font-medium text-white hover:bg-[#FDA811] transition-colors duration-300"
        >
          Back to Dashboard
        </button>
      </div>

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
              style={{ 
                background: !isStepValid(currentStep) ? '#9CA3AF' : COLORS.success 
              }}
              onMouseEnter={e => {
                if (isStepValid(currentStep)) {
                  e.currentTarget.style.background = COLORS.accent;
                }
              }}
              onMouseLeave={e => {
                if (isStepValid(currentStep)) {
                  e.currentTarget.style.background = COLORS.success;
                }
              }}
              className={`px-6 py-3 rounded-lg font-semibold text-white ${
                !isStepValid(currentStep) ? 'cursor-not-allowed' : 'transition-colors duration-300'
              }`}
            >
              {currentStep === steps.length - 1 ? 'Review Application' : 'Next'}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setShowConfirmModal(true)}
              disabled={isSubmitting || !existingPermit}
              onMouseEnter={e => {
                if (!isSubmitting && existingPermit) e.currentTarget.style.background = COLORS.accent;
              }}
              onMouseLeave={e => {
                if (!isSubmitting && existingPermit) e.currentTarget.style.background = COLORS.success;
              }}
              style={{ 
                background: (isSubmitting || !existingPermit) 
                  ? '#9CA3AF' 
                  : COLORS.success 
              }}
              className={`px-6 py-3 rounded-lg font-semibold text-white ${
                (isSubmitting || !existingPermit) ? 'cursor-not-allowed' : 'transition-colors duration-300'
              }`}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Renewal Application'}
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

      {/* Payment Completion Modal */}
      {showPaymentCompletionModal && (
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
              <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
                <Check className="w-10 h-10 text-green-600" />
              </div>
            </div>
            
            <h2 className="text-xl font-bold text-center mb-4" style={{ color: COLORS.primary }}>Payment Portal Opened</h2>
            
            <div className="mb-6">
              <p className="text-sm text-center mb-3" style={{ color: COLORS.secondary, fontFamily: COLORS.font }}>
                The Revenue Treasury payment portal has been opened in a new tab. Please complete your payment there.
              </p>
              
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 mb-4">
                <p className="text-sm font-medium text-blue-700 mb-2">Next Steps:</p>
                <ul className="text-xs space-y-2 text-blue-700">
                  <li className="flex items-start">
                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                      <span className="text-xs font-bold">1</span>
                    </div>
                    <span>Complete payment in the new tab</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                      <span className="text-xs font-bold">2</span>
                    </div>
                    <span>Return to this tab after payment</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                      <span className="text-xs font-bold">3</span>
                    </div>
                    <span>Your payment status will be automatically verified</span>
                  </li>
                </ul>
              </div>
              
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm font-medium text-yellow-700 mb-2">Important:</p>
                <ul className="text-xs space-y-1 text-yellow-700">
                  <li>• Do not close this tab while making payment</li>
                  <li>• Keep the payment reference number for verification</li>
                  <li>• You can proceed to the next step once payment is confirmed</li>
                </ul>
              </div>
            </div>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowPaymentCompletionModal(false)}
                style={{ background: COLORS.primary }}
                onMouseEnter={e => e.currentTarget.style.background = COLORS.accent}
                onMouseLeave={e => e.currentTarget.style.background = COLORS.primary}
                className="px-6 py-2 rounded-lg font-semibold text-white transition-colors duration-300"
              >
                Return to Application
              </button>
            </div>
            
            <div className="mt-6">
              <p className="text-xs text-center text-gray-500" style={{ fontFamily: COLORS.font }}>
                Your payment status will be checked automatically. You can continue with your application.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Payment Success Modal */}
      {showPaymentSuccessModal && (
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
              <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
                <Check className="w-10 h-10 text-green-600" />
              </div>
            </div>
            
            <h2 className="text-xl font-bold text-center mb-4" style={{ color: COLORS.primary }}>{modalTitle}</h2>
            
            <div className="mb-6">
              <p className="text-sm text-center mb-3" style={{ color: COLORS.secondary, fontFamily: COLORS.font }}>
                {modalMessage}
              </p>
              
              {paymentStatus.transactionId && (
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 mb-4">
                  <p className="text-sm font-medium text-blue-700 mb-2">Payment Details:</p>
                  <div className="text-xs space-y-1">
                    <p><span className="font-medium">Transaction ID:</span> {paymentStatus.transactionId}</p>
                    <p><span className="font-medium">Payment Date:</span> {new Date(paymentStatus.paymentDate).toLocaleDateString()}</p>
                    <p><span className="font-medium">Payment Method:</span> Online Payment</p>
                  </div>
                </div>
              )}
              
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm font-medium text-green-700 mb-2">What happens next:</p>
                <ul className="text-xs space-y-1 text-green-700">
                  <li>• Your payment has been recorded in the system</li>
                  <li>• You can now proceed to the declaration step</li>
                  <li>• Your application will be processed after submission</li>
                  <li>• You will receive updates via email</li>
                </ul>
              </div>
            </div>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowPaymentSuccessModal(false)}
                style={{ background: COLORS.primary }}
                onMouseEnter={e => e.currentTarget.style.background = COLORS.accent}
                onMouseLeave={e => e.currentTarget.style.background = COLORS.primary}
                className="px-6 py-2 rounded-lg font-semibold text-white transition-colors duration-300"
              >
                Continue to Declaration
              </button>
            </div>
            
            <div className="mt-6">
              <p className="text-xs text-center text-gray-500" style={{ fontFamily: COLORS.font }}>
                You can continue with your renewal application. Your payment status is now verified.
              </p>
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
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <RefreshCw className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold" style={{ color: COLORS.primary }}>Confirm Renewal Submission</h2>
                <p className="text-sm text-gray-600">Review your information before submitting renewal</p>
              </div>
            </div>
            
            <div className="mb-6">
              <p className="text-sm mb-3" style={{ color: COLORS.secondary, fontFamily: COLORS.font }}>
                You are about to submit your {renewalType === 'MTOP' ? 'MTOP' : 'Mayor\'s'} renewal application.
              </p>
              
              {existingPermit && (
                <div className="p-4 rounded-lg border mb-4 bg-blue-50 border-blue-200">
                  <div className="flex items-start">
                    <Check className="w-5 h-5 text-blue-600 mr-2 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-blue-700">✓ Existing Permit Verified</p>
                      <div className="text-xs mt-1 space-y-1">
                        <p><span className="font-medium">Permit ID:</span> {existingPermit.application_id}</p>
                        <p><span className="font-medium">Status:</span> {existingPermit.status}</p>
                        <p><span className="font-medium">Expiry:</span> {existingPermit.expiry_date}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="p-4 bg-gray-50 rounded-lg border mb-4">
                <p className="text-sm font-semibold mb-2" style={{ color: COLORS.secondary, fontFamily: COLORS.font }}>Renewal Declaration:</p>
                <p className="text-sm mb-3" style={{ color: COLORS.secondary, fontFamily: COLORS.font }}>
                  I hereby declare that all information provided is true and correct to the best of my knowledge. I understand that any false information may result in the rejection of my renewal application.
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

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mb-4">
                <p className="text-sm font-medium mb-2 text-blue-700">Renewal Requirements Summary:</p>
                <ul className="text-xs space-y-1" style={{ color: COLORS.secondary, fontFamily: COLORS.font }}>
                  <li>✓ Existing permit verified</li>
                  <li>✓ All required documents uploaded</li>
                  <li>✓ Payment receipt(s) provided</li>
                  <li>✓ Declaration signed</li>
                  {renewalType === 'MAYOR' && (
                    <>
                      <li>✓ Barangay business clearance uploaded</li>
                      <li>✓ Previous Mayor's Permit uploaded</li>
                    </>
                  )}
                </ul>
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
                disabled={isSubmitting || !agreeDeclaration || !existingPermit}
                style={{ 
                  background: (isSubmitting || !agreeDeclaration || !existingPermit) 
                    ? '#9CA3AF' 
                    : COLORS.success 
                }}
                onMouseEnter={e => {
                  if (!(isSubmitting || !agreeDeclaration || !existingPermit)) {
                    e.currentTarget.style.background = COLORS.accent;
                  }
                }}
                onMouseLeave={e => {
                  if (!(isSubmitting || !agreeDeclaration || !existingPermit)) {
                    e.currentTarget.style.background = COLORS.success;
                  }
                }}
                className={`px-6 py-2 rounded-lg font-semibold text-white ${
                  (isSubmitting || !agreeDeclaration || !existingPermit) 
                    ? 'cursor-not-allowed' 
                    : 'transition-colors duration-300'
                }`}
              >
                {isSubmitting ? 'Submitting...' : 'Confirm & Submit Renewal'}
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
                Proceeding to applicant information...
              </p>
            </div>

            <div className="flex justify-center">
              <button
                onClick={() => {
                  setShowSuccessModal(false);
                  setCurrentStep(3);
                }}
                style={{ background: COLORS.success }}
                onMouseEnter={e => e.currentTarget.style.background = COLORS.accent}
                onMouseLeave={e => e.currentTarget.style.background = COLORS.success}
                className="px-6 py-2 rounded-lg font-semibold text-white transition-colors duration-300"
              >
                Proceed to Next Step
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