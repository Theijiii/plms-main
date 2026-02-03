import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Upload, Check, X, Eye, FileText, AlertCircle, Shield, Key } from "lucide-react";

// Design constants
const COLORS = {
  primary: '#4A90E2',
  secondary: '#000000',
  accent: '#FDA811',
  success: '#4CAF50',
  danger: '#E53935',
  background: '#FBFBFB',
  font: 'Montserrat, Arial, sans-serif'
};

const NATIONALITIES = ["Filipino", "Afghan", "Albanian", "Algerian", "American", "Andorran", "Angolan", "Antiguans", "Argentinean", "Armenian", "Australian", "Austrian", "Azerbaijani", "Bahamian", "Bahraini", "Bangladeshi", "Barbadian", "Barbudans", "Batswana", "Belarusian", "Belgian", "Belizean", "Beninese", "Bhutanese", "Bolivian", "Bosnian", "Brazilian", "British", "Bruneian", "Bulgarian", "Burkinabe", "Burmese", "Burundian", "Cambodian", "Cameroonian", "Canadian", "Cape Verdean", "Central African", "Chadian", "Chilean", "Chinese", "Colombian", "Comoran", "Congolese", "Costa Rican", "Croatian", "Cuban", "Cypriot", "Czech", "Danish", "Djibouti", "Dominican", "Dutch", "East Timorese", "Ecuadorean", "Egyptian", "Emirian", "Equatorial Guinean", "Eritrean", "Estonian", "Ethiopian", "Fijian", "Finnish", "French", "Gabonese", "Gambian", "Georgian", "German", "Ghanaian", "Greek", "Grenadian", "Guatemalan", "Guinea-Bissauan", "Guinean", "Guyanese", "Haitian", "Herzegovinian", "Honduran", "Hungarian", "I-Kiribati", "Icelander", "Indian", "Indonesian", "Iranian", "Iraqi", "Irish", "Israeli", "Italian", "Ivorian", "Jamaican", "Japanese", "Jordanian", "Kazakhstani", "Kenyan", "Kittian and Nevisian", "Kuwaiti", "Kyrgyz", "Laotian", "Latvian", "Lebanese", "Liberian", "Libyan", "Liechtensteiner", "Lithuanian", "Luxembourger", "Macedonian", "Malagasy", "Malawian", "Malaysian", "Maldivan", "Malian", "Maltese", "Marshallese", "Mauritanian", "Mauritian", "Mexican", "Micronesian", "Moldovan", "Monacan", "Mongolian", "Moroccan", "Mosotho", "Motswana", "Mozambican", "Namibian", "Nauruan", "Nepalese", "New Zealander", "Nicaraguan", "Nigerian", "Nigerien", "North Korean", "Northern Irish", "Norwegian", "Omani", "Pakistani", "Palauan", "Palestinian", "Panamanian", "Papua New Guinean", "Paraguayan", "Peruvian", "Polish", "Portuguese", "Qatari", "Romanian", "Russian", "Rwandan", "Saint Lucian", "Salvadoran", "Samoan", "San Marinese", "Sao Tomean", "Saudi", "Scottish", "Senegalese", "Serbian", "Seychellois", "Sierra Leonean", "Singaporean", "Slovakian", "Slovenian", "Solomon Islander", "Somali", "South African", "South Korean", "Spanish", "Sri Lankan", "Sudanese", "Surinamer", "Swazi", "Swedish", "Swiss", "Syrian", "Taiwanese", "Tajik", "Tanzanian", "Thai", "Togolese", "Tongan", "Trinidadian or Tobagonian", "Tunisian", "Turkish", "Tuvaluan", "Ugandan", "Ukrainian", "Uruguayan", "Uzbekistani", "Venezuelan", "Vietnamese", "Welsh", "Yemenite", "Zambian", "Zimbabwean"];

export default function FranchiseNew() {
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
  const [errors, setErrors] = useState({});
  const [isCheckingMTOP, setIsCheckingMTOP] = useState(false);
  const [mtopValidation, setMtopValidation] = useState({
    hasExistingPermit: false,
    permitDetails: null,
    message: '',
    canProceed: false
  });
  const [originalMTOPData, setOriginalMTOPData] = useState(null);
  const [autoFilledFields, setAutoFilledFields] = useState({});
  const [businessPermitMethod, setBusinessPermitMethod] = useState('id');
  const [paymentStatus, setPaymentStatus] = useState({
    isPaid: false,
    paymentMethod: '',
    paymentDate: '',
    transactionId: ''
  });
  
  const [formData, setFormData] = useState({
    permit_subtype: 'MTOP',
    mtop_application_id: '',
    mtop_plate_number: '',
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
    proof_of_residency: null,
    operator_type: 'Individual Operator',
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
    route_zone: '',
    toda_name: '',
    toda_president_cert: null,
    barangay_of_operation: '',
    company_name: '',
    barangay_clearance: null,
    barangay_clearance_id: '',
    business_permit_id: '',
    business_permit_file: null,
    toda_endorsement: null,
    lto_or_cr: null,
    insurance_certificate: null,
    drivers_license: null,
    emission_test: null,
    id_picture: null,
    official_receipt: null,
    nbi_clearance: null,
    police_clearance: null,
    medical_certificate: null,
    franchise_fee_checked: false,
    sticker_id_fee_checked: false,
    inspection_fee_checked: false,
    franchise_fee_or: '',
    sticker_id_fee_or: '',
    inspection_fee_or: '',
    franchise_fee_receipt: null,
    sticker_id_fee_receipt: null,
    inspection_fee_receipt: null,
    payment_method: 'online',
    applicant_signature: '',
    date_submitted: '',
    barangay_captain_signature: '',
    remarks: '',
    notes: ''
  });

  const steps = [
    { id: 1, title: 'Permit Type', description: 'Select permit type' },
    { id: 2, title: formData.permit_subtype === 'MTOP' ? 'Operator Information' : 'Applicant Information', description: 'Personal details' },
    { id: 3, title: 'Vehicle & Route Information', description: 'Vehicle, route and operation details' },
    { id: 4, title: 'Required Documents', description: 'Upload required documents' },
    { id: 5, title: 'Payment Information', description: 'Fees and payment' },
    { id: 6, title: 'Declaration', description: 'Sign and submit' },
    { id: 7, title: 'Review', description: 'Review your application' }
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
  const FEES = { franchise_fee: 250.00, sticker_id_fee: 150.00, inspection_fee: 100.00 };

  // Validation functions
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
    return { valid, formatted: cleanID, error: '' };
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


  const autoFillFromMTOP = (mtopData) => {
    if (!mtopData) return;
    
    const fieldsToAutoFill = {};
    const updatedData = { ...formData };
    const autoFillableFields = [
      'first_name', 'last_name', 'middle_initial', 'home_address', 'contact_number', 'email',
      'citizenship', 'birth_date', 'id_type', 'id_number', 'make_brand', 'model', 'engine_number',
      'chassis_number', 'plate_number', 'year_acquired', 'color', 'vehicle_type', 'lto_or_number',
      'lto_cr_number', 'lto_expiration_date', 'mv_file_number', 'district', 'route_zone',
      'barangay_of_operation', 'toda_name'
    ];
    
    autoFillableFields.forEach(field => {
      if (mtopData[field]) {
        updatedData[field] = mtopData[field];
        fieldsToAutoFill[field] = true;
      }
    });
    
    updatedData.operator_type = 'TODA Member';
    fieldsToAutoFill['operator_type'] = true;
    
    if (mtopData.application_id) {
      updatedData.mtop_application_id = mtopData.application_id;
    }
    
    // Apply validations to auto-filled data
    if (updatedData.plate_number) {
      const plateValidation = validatePlateNumber(updatedData.plate_number);
      if (plateValidation.valid) updatedData.plate_number = plateValidation.formatted;
    }
    
    if (updatedData.chassis_number) {
      const chassisValidation = validateChassisNumber(updatedData.chassis_number);
      if (chassisValidation.valid) updatedData.chassis_number = chassisValidation.formatted;
    }
    
    if (updatedData.engine_number) {
      const engineValidation = validateEngineNumber(updatedData.engine_number);
      if (engineValidation.valid) updatedData.engine_number = engineValidation.formatted;
    }
    
    if (updatedData.lto_or_number) {
      const orValidation = validateORNumber(updatedData.lto_or_number);
      if (orValidation.valid) updatedData.lto_or_number = orValidation.formatted;
    }
    
    if (updatedData.lto_cr_number) {
      const crValidation = validateCRNumber(updatedData.lto_cr_number);
      if (crValidation.valid) updatedData.lto_cr_number = crValidation.formatted;
    }
    
    if (updatedData.id_number) {
      const idValidation = validateIDNumber(updatedData.id_number);
      if (idValidation.valid) updatedData.id_number = idValidation.formatted;
    }
    
    if (updatedData.year_acquired) {
      const yearValidation = validateYearAcquired(updatedData.year_acquired);
      if (yearValidation.valid) updatedData.year_acquired = yearValidation.formatted;
    }
    
    const alwaysAutoFillFields = ['engine_number', 'chassis_number', 'lto_or_number', 'lto_cr_number'];
    alwaysAutoFillFields.forEach(field => fieldsToAutoFill[field] = true);
    
    setFormData(updatedData);
    setAutoFilledFields(fieldsToAutoFill);
    setOriginalMTOPData(mtopData);
  };

  const resetAutoFilledData = () => {
    const resetData = { ...formData };
    Object.keys(autoFilledFields).forEach(field => resetData[field] = '');
    setFormData(resetData);
    setAutoFilledFields({});
    setOriginalMTOPData(null);
    setMtopValidation(prev => ({ 
      ...prev, 
      canProceed: false, 
      message: 'Auto-filled data has been cleared. Please validate MTOP again.' 
    }));
  };

  const checkExistingMTOPPermit = async () => {
    let validationData = {};
    
    if (formData.permit_subtype === 'FRANCHISE') {
      if (!formData.mtop_application_id || !formData.mtop_plate_number) {
        showErrorMessage("Please enter MTOP Application ID and Plate Number for validation.");
        return false;
      }
      validationData = { 
        application_id: formData.mtop_application_id, 
        plate_number: formData.mtop_plate_number, 
        permit_subtype: formData.permit_subtype 
      };
    } else {
      if (!formData.id_number || !formData.plate_number) {
        showErrorMessage("Please complete your ID number and plate number before validation.");
        return false;
      }
      validationData = { 
        id_number: formData.id_number, 
        plate_number: formData.plate_number, 
        permit_subtype: formData.permit_subtype 
      };
    }
    
    setIsCheckingMTOP(true);
    try {
      const response = await fetch('backend/franchise_permit/check_mtop.php', {
        method: 'POST', 
        headers: {'Content-Type': 'application/json'}, 
        body: JSON.stringify(validationData)
      });
      
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      
      if (data.success) {
        if (formData.permit_subtype === 'FRANCHISE') {
          const isApproved = data.mtopStatus && data.mtopStatus.toLowerCase() === 'approved';
          
          if (data.hasExistingMTOP && isApproved) {
            if (data.permitDetails) {
              autoFillFromMTOP(data.permitDetails);
              setMtopValidation({
                hasExistingPermit: true, 
                permitDetails: data.permitDetails,
                message: ` Valid MTOP permit found! Data has been auto-filled for your franchise application.`,
                canProceed: true
              });
            } else {
              setMtopValidation({
                hasExistingPermit: true, 
                permitDetails: data.permitDetails,
                message: ` Valid MTOP permit found! (ID: ${data.application_id}, Status: ${data.mtopStatus}). You may proceed with Franchise application.`,
                canProceed: true
              });
            }
            return true;
          } else if (data.hasExistingMTOP && !isApproved) {
            setMtopValidation({
              hasExistingPermit: true, 
              permitDetails: data.permitDetails,
              message: ` MTOP permit found but status is "${data.mtopStatus}". You need an APPROVED MTOP permit before applying for Franchise.`,
              canProceed: false
            });
            return false;
          } else {
            setMtopValidation({
              hasExistingPermit: false, 
              permitDetails: null,
              message: 'No existing MTOP permit found with the provided details. Please apply for MTOP first.',
              canProceed: false
            });
            return false;
          }
        } else {
          const isApproved = data.mtopStatus && data.mtopStatus.toLowerCase() === 'approved';
          
          if (data.hasExistingMTOP && isApproved) {
            setMtopValidation({
              hasExistingPermit: true, 
              permitDetails: data.permitDetails,
              message: `You already have an APPROVED MTOP permit (ID: ${data.application_id}). Please renew your existing permit instead.`,
              canProceed: false
            });
            return false;
          } else if (data.hasExistingMTOP && !isApproved) {
            setMtopValidation({
              hasExistingPermit: true, 
              permitDetails: data.permitDetails,
              message: `You have a MTOP application with status "${data.mtopStatus}". Please wait for it to be approved.`,
              canProceed: false
            });
            return false;
          } else {
            setMtopValidation({
              hasExistingPermit: false, 
              permitDetails: null,
              message: 'No existing MTOP permit found. You may proceed with MTOP application.',
              canProceed: true
            });
            return true;
          }
        }
      } else {
        setMtopValidation({ 
          hasExistingPermit: false, 
          permitDetails: null, 
          message: data.message || 'Unable to verify existing permits. Please try again.', 
          canProceed: false 
        });
        return false;
      }
    } catch (error) {
      console.error('Error checking MTOP permit:', error);
      setMtopValidation({ 
        hasExistingPermit: false, 
        permitDetails: null, 
        message: '❌ Error checking existing permits. Please check your connection and try again.', 
        canProceed: false 
      });
      showErrorMessage(`Network error: ${error.message}`);
      return false;
    } finally {
      setIsCheckingMTOP(false);
    }
  };

  useEffect(() => {
    if (formData.permit_subtype === 'MTOP' && formData.plate_number && formData.plate_number.length >= 3 && formData.id_number && formData.id_number.length >= 1) {
      const timer = setTimeout(() => { 
        checkExistingMTOPPermit(); 
        checkForDuplicateApplication(); 
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [formData.plate_number, formData.id_number, formData.permit_subtype]);

  useEffect(() => {
    if (formData.permit_subtype === 'FRANCHISE' && formData.mtop_application_id && formData.mtop_plate_number) {
      const timer = setTimeout(() => { checkForDuplicateApplication(); }, 1000);
      return () => clearTimeout(timer);
    }
  }, [formData.mtop_application_id, formData.mtop_plate_number, formData.permit_subtype]);

  useEffect(() => {
    if (formData.permit_subtype === 'MTOP') {
      setMtopValidation({ hasExistingPermit: false, permitDetails: null, message: '', canProceed: false });
      setOriginalMTOPData(null);
      setAutoFilledFields({});
    } else if (formData.permit_subtype === 'FRANCHISE') {
      setOriginalMTOPData(null);
      setAutoFilledFields({});
      setMtopValidation({ hasExistingPermit: false, permitDetails: null, message: '', canProceed: false });
    }
  }, [formData.permit_subtype]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    
    if (formData.permit_subtype === 'FRANCHISE' && autoFilledFields[name]) {
      showErrorMessage("This field is auto-filled from your MTOP record and cannot be modified.");
      return;
    }
    
    if (name === "contact_number") {
      const onlyNums = value.replace(/[^0-9]/g, "");
      let finalValue = onlyNums;
      if (onlyNums.length > 0) {
        if (!onlyNums.startsWith('09')) finalValue = '09' + onlyNums;
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
      if (name === 'barangay_clearance' && file) setFormData(prev => ({ ...prev, barangay_clearance_id: '' }));
      if (errors[name]) { 
        const newErrors = { ...errors }; 
        delete newErrors[name]; 
        setErrors(newErrors); 
      }
    } else if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      let finalValue = value;
      
      switch(name) {
        case 'plate_number': 
        case 'mtop_plate_number':
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
          
        case 'barangay_clearance_id':
          if (value && value.trim() !== '') {
            setFormData(prev => ({ ...prev, barangay_clearance: null }));
          }
          finalValue = value; 
          break;
          
        default: 
          finalValue = value;
      }
      
      setFormData(prev => ({ ...prev, [name]: finalValue }));
      
      if (name === 'lto_expiration_date' && value) {
        const today = new Date(); 
        today.setHours(0, 0, 0, 0);
        const selectedDate = new Date(value);
        if (selectedDate < today) {
          setErrors(prev => ({ 
            ...prev, 
            lto_expiration_date: 'LTO Expiration Date cannot be in the past. Please select a future date.' 
          }));
        } else if (errors.lto_expiration_date) { 
          const newErrors = { ...errors }; 
          delete newErrors.lto_expiration_date; 
          setErrors(newErrors); 
        }
      }
      
      if (name === 'permit_subtype') {
        setMtopValidation({ hasExistingPermit: false, permitDetails: null, message: '', canProceed: false });
        setOriginalMTOPData(null); 
        setAutoFilledFields({}); 
      }
      
      if (name === 'mtop_application_id' || name === 'mtop_plate_number') {
        setMtopValidation({ hasExistingPermit: false, permitDetails: null, message: '', canProceed: false });
        setOriginalMTOPData(null); 
        setAutoFilledFields({}); 
      }
    }
  };

  const previewFile = (file) => {
    if (!file) return null;
    const url = URL.createObjectURL(file);
    const fileType = file.type.split('/')[0];
    setShowPreview({ url, type: fileType, name: file.name });
  };

  const closePreview = () => {
    if (showPreview.url) URL.revokeObjectURL(showPreview.url);
    setShowPreview({});
  };

  const handleOnlinePayment = () => {
    let totalAmount = 0;
    if (formData.franchise_fee_checked) totalAmount += FEES.franchise_fee;
    if (formData.sticker_id_fee_checked) totalAmount += FEES.sticker_id_fee;
    if (formData.inspection_fee_checked) totalAmount += FEES.inspection_fee;
    
    if (totalAmount <= 0) {
      showErrorMessage("Please select at least one fee to pay.");
      return;
    }
    
    // Generate unique reference ID
    const referenceId = `FRAN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const paymentData = {
      system: 'franchise',
      ref: referenceId,
      amount: totalAmount.toFixed(2),
      purpose: `${formData.permit_subtype} Application - ${formData.plate_number || 'New Application'}`,
      callback: "https://revenuetreasury.goserveph.com/citizen_dashboard/market/api/market_payment_api.php",
    };

    // Save payment reference locally
    localStorage.setItem('payment_reference', referenceId);
    localStorage.setItem('payment_amount', totalAmount.toFixed(2));
    localStorage.setItem('application_plate', formData.plate_number || formData.mtop_plate_number);
    
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
          showSuccessMessage("Payment confirmed! Your application is now being processed.");
          
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
      if (formData.permit_subtype === 'FRANCHISE' && !mtopValidation.canProceed) {
        newErrors.mtop_validation = 'Please validate your existing MTOP permit before proceeding';
      }
    }
    
    if (step === 2) {
      if (!formData.first_name.trim()) newErrors.first_name = 'First name is required';
      if (!formData.last_name.trim()) newErrors.last_name = 'Last name is required';
      if (!formData.home_address.trim()) newErrors.home_address = 'Home address is required';
      if (!formData.contact_number.trim()) newErrors.contact_number = 'Contact number is required';
      else if (formData.contact_number.length !== 11) newErrors.contact_number = 'Contact number must be 11 digits (09XXXXXXXXX)';
      if (!formData.email.trim()) newErrors.email = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
      if (!formData.citizenship) newErrors.citizenship = 'Citizenship is required';
      if (!formData.birth_date) newErrors.birth_date = 'Birth date is required';
      if (!formData.id_type) newErrors.id_type = 'ID type is required';
      if (!formData.id_number.trim()) newErrors.id_number = 'ID number is required';
      else { 
        const idValidation = validateIDNumber(formData.id_number); 
        if (!idValidation.valid) newErrors.id_number = idValidation.error; 
      }
      if (formData.permit_subtype === 'MTOP' && !formData.operator_type) newErrors.operator_type = 'Operator type is required';
    }
    
    if (step === 3) {
      if (!formData.make_brand.trim()) newErrors.make_brand = 'Make/Brand is required';
      if (!formData.model.trim()) newErrors.model = 'Model is required';
      if (!formData.engine_number.trim()) newErrors.engine_number = 'Engine number is required';
      else { 
        const engineValidation = validateEngineNumber(formData.engine_number); 
        if (!engineValidation.valid) newErrors.engine_number = engineValidation.error; 
      }
      if (!formData.chassis_number.trim()) newErrors.chassis_number = 'Chassis number is required';
      else { 
        const chassisValidation = validateChassisNumber(formData.chassis_number); 
        if (!chassisValidation.valid) newErrors.chassis_number = chassisValidation.error; 
      }
      if (!formData.plate_number.trim()) newErrors.plate_number = 'Plate number is required';
      else { 
        const plateValidation = validatePlateNumber(formData.plate_number); 
        if (!plateValidation.valid) newErrors.plate_number = plateValidation.error; 
      }
      if (!formData.year_acquired.trim()) newErrors.year_acquired = 'Year acquired is required';
      else { 
        const yearValidation = validateYearAcquired(formData.year_acquired); 
        if (!yearValidation.valid) newErrors.year_acquired = yearValidation.error; 
      }
      if (!formData.color.trim()) newErrors.color = 'Color is required';
      if (!formData.vehicle_type.trim()) newErrors.vehicle_type = 'Vehicle type is required';
      if (!formData.lto_or_number.trim()) newErrors.lto_or_number = 'LTO OR number is required';
      else { 
        const orValidation = validateORNumber(formData.lto_or_number); 
        if (!orValidation.valid) newErrors.lto_or_number = orValidation.error; 
      }
      if (!formData.lto_cr_number.trim()) newErrors.lto_cr_number = 'LTO CR number is required';
      else { 
        const crValidation = validateCRNumber(formData.lto_cr_number); 
        if (!crValidation.valid) newErrors.lto_cr_number = crValidation.error; 
      }
      if (!formData.lto_expiration_date) newErrors.lto_expiration_date = 'LTO expiration date is required';
      else {
        const today = new Date(); 
        today.setHours(0, 0, 0, 0);
        const selectedDate = new Date(formData.lto_expiration_date);
        if (selectedDate < today) {
          newErrors.lto_expiration_date = 'LTO Expiration Date cannot be in the past. Please select a future date.';
        }
      }
      if (!formData.district.trim()) newErrors.district = 'District is required';
      if (!formData.route_zone.trim()) newErrors.route_zone = 'Route is required';
      if (!formData.barangay_of_operation.trim()) newErrors.barangay_of_operation = 'Barangay of operation is required';
      if (formData.permit_subtype === 'FRANCHISE' && !formData.toda_name.trim()) newErrors.toda_name = 'TODA name is required';
    }
    
    if (step === 4) {
      const requiredDocs = [
        { name: 'proof_of_residency', label: 'Proof of Residency' }, 
        { name: 'lto_or_cr', label: 'LTO OR/CR' }
      ];
      
      if (!formData.barangay_clearance_id && !formData.barangay_clearance) {
        newErrors.barangay_clearance = 'Barangay Clearance is required - either enter ID or upload document';
      }
      
      if (formData.permit_subtype === 'MTOP') {
        requiredDocs.push(
          { name: 'nbi_clearance', label: 'NBI Clearance' }, 
          { name: 'police_clearance', label: 'Police Clearance' }, 
          { name: 'medical_certificate', label: 'Medical Certificate' }
        );
      }
      
      if (formData.permit_subtype === 'FRANCHISE') {
        requiredDocs.push({ name: 'toda_endorsement', label: 'TODA Endorsement' });
      }
      
      let uploadedCount = 0;
      requiredDocs.forEach(doc => {
        if (!formData[doc.name]) {
          newErrors[doc.name] = `${doc.label} is required`;
        } else {
          uploadedCount++;
        }
      });
      
      if (uploadedCount < requiredDocs.length) {
        newErrors.min_documents = `All required documents must be uploaded`;
      }
    }
    
    if (step === 5) {
      if (formData.payment_method === 'upload') {
        const feeChecks = [
          { name: 'franchise_fee', checked: formData.franchise_fee_checked, receipt: formData.franchise_fee_receipt },
          { name: 'sticker_id_fee', checked: formData.sticker_id_fee_checked, receipt: formData.sticker_id_fee_receipt },
          { name: 'inspection_fee', checked: formData.inspection_fee_checked, receipt: formData.inspection_fee_receipt }
        ];
        
        let hasValidFee = false;
        feeChecks.forEach(fee => {
          if (fee.checked && fee.receipt) {
            hasValidFee = true;
          }
        });
        
        if (!hasValidFee) {
          newErrors.payment = 'At least one fee must be checked and its receipt uploaded';
        }
      } else {
        const hasSelectedFee = formData.franchise_fee_checked || formData.sticker_id_fee_checked || formData.inspection_fee_checked;
        if (!hasSelectedFee) {
          newErrors.payment = 'Please select at least one fee to pay';
        }
      }
    }
    
    if (step === 6) {
      if (!formData.applicant_signature) {
        newErrors.applicant_signature = 'Applicant signature is required';
      }
      if (!formData.date_submitted) {
        newErrors.date_submitted = 'Date of submission is required';
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
      1: () => {
        if (!formData.permit_subtype) return false;
        if (formData.permit_subtype === 'MTOP') return true;
        if (formData.permit_subtype === 'FRANCHISE') return mtopValidation.canProceed;
        return true;
      },
      2: () => {
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
        if (formData.permit_subtype === 'FRANCHISE') return true;
        if (formData.permit_subtype === 'MTOP' && !formData.operator_type) return false;
        return true;
      },
      3: () => {
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
        if (!formData.route_zone.trim()) return false;
        if (!formData.barangay_of_operation.trim()) return false;
        if (formData.permit_subtype === 'FRANCHISE' && !formData.toda_name.trim()) return false;
        return true;
      },
      4: () => {
        const requiredDocs = [{ file: formData.proof_of_residency }, { file: formData.lto_or_cr }];
        const hasBarangayClearance = formData.barangay_clearance_id || formData.barangay_clearance;
        
        if (formData.permit_subtype === 'MTOP') {
          requiredDocs.push(
            { file: formData.nbi_clearance }, 
            { file: formData.police_clearance }, 
            { file: formData.medical_certificate }
          );
        }
        
        if (formData.permit_subtype === 'FRANCHISE') {
          requiredDocs.push({ file: formData.toda_endorsement });
        }
        
        return hasBarangayClearance && requiredDocs.every(doc => doc.file);
      },
      5: () => {
        if (formData.payment_method === 'upload') {
          const feeChecks = [
            { checked: formData.franchise_fee_checked, receipt: formData.franchise_fee_receipt },
            { checked: formData.sticker_id_fee_checked, receipt: formData.sticker_id_fee_receipt },
            { checked: formData.inspection_fee_checked, receipt: formData.inspection_fee_receipt }
          ];
          
          return feeChecks.some(fee => fee.checked && fee.receipt);
        } else {
          const hasSelectedFee = formData.franchise_fee_checked || formData.sticker_id_fee_checked || formData.inspection_fee_checked;
          return hasSelectedFee;
        }
      },
      6: () => formData.applicant_signature && formData.date_submitted && agreeDeclaration,
      7: () => true
    };
    
    return validators[step] ? validators[step]() : true;
  };

  const getFullName = () => {
    return `${formData.first_name} ${formData.middle_initial ? formData.middle_initial + '.' : ''} ${formData.last_name}`.trim();
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      if (formData.permit_subtype === 'FRANCHISE' && currentStep === 1 && !mtopValidation.canProceed) {
        showErrorMessage("Please validate your existing MTOP permit before proceeding.");
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
    if (currentStep > 1) setCurrentStep(currentStep - 1); 
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
    if (formData.permit_subtype === 'FRANCHISE' && !mtopValidation.canProceed) {
      showErrorMessage("Please complete MTOP validation before submitting.");
      setShowConfirmModal(false);
      return;
    }
    
    setIsSubmitting(true);
    const backendUrl = "/backend/franchise_permit/franchise_permit.php";
    
    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        const value = formData[key];
        if (value === null || value === undefined) return;
        
        if (value instanceof File) {
          formDataToSend.append(key, value);
        } else if (typeof value === 'boolean') {
          formDataToSend.append(key, value ? '1' : '0');
        } else {
          formDataToSend.append(key, String(value));
        }
      });
      
      formDataToSend.append('permit_type', permitType);
      formDataToSend.append('payment_method', formData.payment_method);
      formDataToSend.append('franchise_fee_checked', formData.franchise_fee_checked ? '1' : '0');
      formDataToSend.append('sticker_id_fee_checked', formData.sticker_id_fee_checked ? '1' : '0');
      formDataToSend.append('inspection_fee_checked', formData.inspection_fee_checked ? '1' : '0');
      
      if (formData.permit_subtype === 'FRANCHISE' && formData.mtop_application_id) {
        formDataToSend.append('mtop_reference_id', formData.mtop_application_id);
      }
      
      const response = await fetch(backendUrl, { method: "POST", body: formDataToSend });
      const responseText = await response.text();
      let data;
      
      try { 
        data = JSON.parse(responseText); 
      } catch (parseError) {
        console.error("Failed to parse JSON:", parseError);
        if (responseText.includes('<b>') || responseText.includes('PHP Error')) {
          showErrorMessage("Backend error occurred. Please check server logs.");
        } else {
          showErrorMessage("Invalid response from server");
        }
        setShowConfirmModal(false); 
        return;
      }
      
      if (data.success) {
        showSuccessMessage(`Application submitted successfully! Application ID: ${data.data.application_id}`);
        setTimeout(() => { navigate("/user/permittracker"); }, 3000);
      } else {
        showErrorMessage(`Error: ${data.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error("Submit error:", error);
      showErrorMessage("Failed to submit application. Please check your connection.");
    } finally {
      setIsSubmitting(false); 
      setShowConfirmModal(false);
    }
  };

  const handleSignatureUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setFormData(prev => ({ ...prev, applicant_signature: event.target.result }));
      reader.readAsDataURL(file);
    }
  };

  const renderInputField = (name, label, type = 'text', options = [], required = false) => {
    const isAutoFilled = formData.permit_subtype === 'FRANCHISE' && autoFilledFields[name];
    
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
            className={`w-full p-3 border rounded-lg ${errors[name] ? 'border-red-500' : 'border-black'} ${isAutoFilled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}
            style={{ color: COLORS.secondary, fontFamily: COLORS.font }} 
            required={required} 
            disabled={isAutoFilled}
          >
            <option value="">Select {label.replace('*', '').trim()}</option>
            {options.map(option => <option key={option} value={option}>{option}</option>)}
          </select>
        ) : (
          <input 
            type={type} 
            name={name} 
            value={formData[name] || ''} 
            onChange={handleChange} 
            placeholder={label}
            className={`w-full p-3 border rounded-lg ${errors[name] ? 'border-red-500' : 'border-black'} ${isAutoFilled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}
            style={{ color: COLORS.secondary, fontFamily: COLORS.font }} 
            required={required} 
            readOnly={isAutoFilled} 
          />
        )}
        
        {isAutoFilled && (
          <div className="absolute top-9 right-0 mt-1 mr-3">
            <div className="flex items-center text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
              <Check className="w-3 h-3 mr-1" /> Auto-filled
            </div>
          </div>
        )}
        
        {errors[name] && (
          <p className="text-red-600 text-sm mt-1" style={{ fontFamily: COLORS.font }}>
            {errors[name]}
          </p>
        )}
        
        {!errors[name] && name === 'plate_number' && (
          <p className="text-gray-500 text-xs mt-1">
            Format: 3 letters followed by 4 digits (e.g., ABC1234)
          </p>
        )}
        
        {!errors[name] && name === 'chassis_number' && (
          <p className="text-gray-500 text-xs mt-1">
            Must be exactly 17 characters
          </p>
        )}
        
        {!errors[name] && name === 'engine_number' && (
          <p className="text-gray-500 text-xs mt-1">
            Must be 8-12 characters
          </p>
        )}
        
        {!errors[name] && (name === 'lto_or_number' || name === 'lto_cr_number') && (
          <p className="text-gray-500 text-xs mt-1">
            Must be 7-8 digits
          </p>
        )}
        
        {!errors[name] && name === 'year_acquired' && (
          <p className="text-gray-500 text-xs mt-1">
            Format: YYYY (e.g., 2023)
          </p>
        )}
      </div>
    );
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold mb-4" style={{ color: COLORS.secondary }}>
              Select Permit Type
            </h3>
            
            {formData.permit_subtype && (
              <div className={`p-4 rounded-lg border mb-4 ${
                mtopValidation.hasExistingPermit ? 
                  (formData.permit_subtype === 'MTOP' ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200') : 
                  (formData.permit_subtype === 'MTOP' ? 'bg-blue-50 border-blue-200' : 'bg-yellow-50 border-yellow-200')
              }`}>
                <div className="flex items-start">
                  <Key className={`w-5 h-5 mr-2 mt-0.5 ${
                    mtopValidation.hasExistingPermit ? 
                      (formData.permit_subtype === 'MTOP' ? 'text-red-600' : 'text-green-600') : 
                      (formData.permit_subtype === 'MTOP' ? 'text-blue-600' : 'text-yellow-600')
                  }`} />
                  <div>
                    <p className={`text-sm font-medium ${
                      mtopValidation.hasExistingPermit ? 
                        (formData.permit_subtype === 'MTOP' ? 'text-red-700' : 'text-green-700') : 
                        (formData.permit_subtype === 'MTOP' ? 'text-blue-700' : 'text-yellow-700')
                    }`}>
                      {formData.permit_subtype === 'MTOP' ? 'MTOP Application Requirements' : 'Franchise Application Requirements'}
                    </p>
                    <p className="text-xs mt-1" style={{ color: COLORS.secondary, fontFamily: COLORS.font }}>
                      {formData.permit_subtype === 'MTOP' ? 
                        '• For individual tricycle operators' : 
                        '• MUST have existing APPROVED MTOP permit first'
                      }
                    </p>
                    {mtopValidation.message && (
                      <p className="text-xs mt-1 font-medium">{mtopValidation.message}</p>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            {formData.permit_subtype === 'FRANCHISE' && (
              <div className="bg-white rounded-lg shadow p-6 border border-black mb-4">
                <h4 className="font-bold text-lg mb-4" style={{ color: COLORS.primary }}>
                  Validate Existing MTOP Permit
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2 font-medium" style={{ color: COLORS.secondary }}>
                      Existing MTOP Application ID *
                    </label>
                    <input 
                      type="text" 
                      name="mtop_application_id" 
                      value={formData.mtop_application_id || ''} 
                      onChange={handleChange} 
                      placeholder="Enter your MTOP Application ID" 
                      className="w-full p-3 border border-black rounded-lg" 
                      style={{ color: COLORS.secondary, fontFamily: COLORS.font }} 
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Enter the application ID from your approved MTOP permit
                    </p>
                  </div>
                  <div>
                    <label className="block mb-2 font-medium" style={{ color: COLORS.secondary }}>
                      Plate Number *
                    </label>
                    <input 
                      type="text" 
                      name="mtop_plate_number" 
                      value={formData.mtop_plate_number || ''} 
                      onChange={handleChange} 
                      placeholder="ABC1234" 
                      className={`w-full p-3 border rounded-lg ${errors.mtop_plate_number ? 'border-red-500' : 'border-black'}`} 
                      style={{ color: COLORS.secondary, fontFamily: COLORS.font, textTransform: 'uppercase' }} 
                    />
                    {errors.mtop_plate_number && (
                      <p className="text-red-600 text-sm mt-1">{errors.mtop_plate_number}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      Format: 3 letters followed by 4 digits (e.g., ABC1234)
                    </p>
                  </div>
                </div>
                <div className="mt-4">
                  <button 
                    type="button" 
                    onClick={checkExistingMTOPPermit} 
                    disabled={isCheckingMTOP || !formData.mtop_application_id || !formData.mtop_plate_number} 
                    style={{ background: (isCheckingMTOP || !formData.mtop_application_id || !formData.mtop_plate_number) ? '#9CA3AF' : COLORS.primary }} 
                    className="px-6 py-3 rounded-lg font-semibold text-white transition-colors duration-300"
                  >
                    {isCheckingMTOP ? 'Validating...' : 'Validate MTOP Permit'}
                  </button>
                </div>
                {mtopValidation.message && (
                  <div className={`mt-4 p-3 rounded-lg ${
                    mtopValidation.canProceed ? 
                      'bg-green-100 border border-green-300 text-green-800' : 
                      'bg-red-100 border border-red-300 text-red-800'
                  }`}>
                    <div className="flex items-center">
                      {mtopValidation.canProceed ? (
                        <Check className="w-5 h-5 mr-2" />
                      ) : (
                        <X className="w-5 h-5 mr-2" />
                      )}
                      <span className="text-sm">{mtopValidation.message}</span>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            <div className="bg-white rounded-lg shadow p-6 border border-black">
              <div className="space-y-4">
                <div 
                  className="p-4 border-2 border-blue-300 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors duration-200 cursor-pointer" 
                  onClick={() => setFormData(prev => ({...prev, permit_subtype: 'MTOP'}))}
                >
                  <div className="flex items-center">
                    <input 
                      type="radio" 
                      name="permit_subtype" 
                      value="MTOP" 
                      checked={formData.permit_subtype === 'MTOP'} 
                      onChange={handleChange} 
                      className="w-5 h-5 text-blue-600" 
                    />
                    <div className="ml-3">
                      <h4 className="font-bold text-lg" style={{ color: COLORS.primary }}>
                        Motorized Tricycle Operator's Permit (MTOP)
                      </h4>
                      <p className="text-sm mt-1" style={{ color: COLORS.secondary }}>
                        For individual tricycle operators. This permit allows you to operate a tricycle as an independent operator.
                      </p>
                      <p className="text-xs mt-2 font-semibold text-blue-700">
                        REQUIREMENT: No existing approved MTOP permit
                      </p>
                    </div>
                  </div>
                </div>
                
                <div 
                  className="p-4 border-2 border-green-300 rounded-lg bg-green-50 hover:bg-green-100 transition-colors duration-200 cursor-pointer" 
                  onClick={() => setFormData(prev => ({...prev, permit_subtype: 'FRANCHISE'}))}
                >
                  <div className="flex items-center">
                    <input 
                      type="radio" 
                      name="permit_subtype" 
                      value="FRANCHISE" 
                      checked={formData.permit_subtype === 'FRANCHISE'} 
                      onChange={handleChange} 
                      className="w-5 h-5 text-green-600" 
                    />
                    <div className="ml-3">
                      <h4 className="font-bold text-lg" style={{ color: COLORS.success }}>
                        Transport Permit
                      </h4>
                      <p className="text-sm mt-1" style={{ color: COLORS.secondary }}>
                        For TODA (Tricycle Operators and Drivers Association) members or corporations operating multiple units under a franchise.
                      </p>
                      <p className="text-xs mt-2 font-semibold text-green-700">
                        REQUIREMENT: Must have existing APPROVED MTOP permit
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium" style={{ color: COLORS.secondary }}>
                    Selected: <span className="font-bold">
                      {formData.permit_subtype === 'MTOP' ? 'Motorized Tricycle Operator\'s Permit (MTOP)' : 'Franchise Permit'}
                    </span>
                  </p>
                  {mtopValidation.message && (
                    <p className={`text-xs mt-2 ${mtopValidation.canProceed ? 'text-green-600' : 'text-red-600'}`}>
                      {mtopValidation.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
        
      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold mb-4" style={{ color: COLORS.secondary }}>
              {formData.permit_subtype === 'MTOP' ? 'Operator Information' : 'Applicant Information'}
            </h3>
            
            {formData.permit_subtype === 'FRANCHISE' && originalMTOPData && (
              <div className="p-4 rounded-lg border mb-4 bg-blue-50 border-blue-200">
                <div className="flex items-start">
                  <div className="bg-blue-100 p-2 rounded-full mr-3">
                    <Check className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-blue-700">
                      ✓ Data Auto-filled from MTOP (READ-ONLY)
                    </p>
                    <p className="text-xs mt-1 text-blue-600">
                      Your information has been automatically filled from your existing MTOP permit and cannot be modified. Fields marked with "Auto-filled" are read-only.
                    </p>
                    <p className="text-xs mt-2 font-medium text-blue-700">
                      MTOP ID: {originalMTOPData.application_id} | Status: {originalMTOPData.status} | Plate: {originalMTOPData.plate_number}
                    </p>
                  </div>
                </div>
                <div className="flex justify-end mt-4">
                  <button 
                    type="button" 
                    onClick={resetAutoFilledData} 
                    className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4" />Clear Auto-filled Data
                  </button>
                </div>
              </div>
            )}
            
            {formData.permit_subtype === 'FRANCHISE' && mtopValidation.message && (
              <div className={`p-4 rounded-lg border mb-4 ${
                mtopValidation.canProceed ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
              }`}>
                <div className="flex items-start">
                  <Shield className={`w-5 h-5 mr-2 mt-0.5 ${
                    mtopValidation.canProceed ? 'text-green-600' : 'text-red-600'
                  }`} />
                  <div>
                    <p className={`text-sm font-medium ${
                      mtopValidation.canProceed ? 'text-green-700' : 'text-red-700'
                    }`}>
                      {mtopValidation.canProceed ? '✓ Eligible for Franchise' : '✗ Not Eligible for Franchise'}
                    </p>
                    <p className="text-xs mt-1" style={{ color: COLORS.secondary, fontFamily: COLORS.font }}>
                      {mtopValidation.message}
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderInputField('first_name', 'First Name *', 'text', [], true)}
              {renderInputField('last_name', 'Last Name *', 'text', [], true)}
              
              <div className="relative">
                <label className="block mb-2 font-medium" style={{ color: COLORS.secondary }}>
                  Middle Initial
                </label>
                <input 
                  type="text" 
                  name="middle_initial" 
                  value={formData.middle_initial || ''} 
                  onChange={handleChange} 
                  placeholder="M.I." 
                  maxLength="1" 
                  className={`w-full p-3 border rounded-lg ${'border-black'} ${
                    formData.permit_subtype === 'FRANCHISE' && autoFilledFields['middle_initial'] ? 
                    'bg-gray-100 cursor-not-allowed' : 'bg-white'
                  }`} 
                  style={{ color: COLORS.secondary, fontFamily: COLORS.font }} 
                  readOnly={formData.permit_subtype === 'FRANCHISE' && autoFilledFields['middle_initial']} 
                />
                {formData.permit_subtype === 'FRANCHISE' && autoFilledFields['middle_initial'] && (
                  <div className="absolute top-9 right-0 mt-1 mr-3">
                    <div className="flex items-center text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                      <Check className="w-3 h-3 mr-1" /> Auto-filled
                    </div>
                  </div>
                )}
              </div>
              
              {renderInputField('home_address', 'Home Address *', 'text', [], true)}
              
              <div className="relative">
                <label className="block mb-2 font-medium" style={{ color: COLORS.secondary }}>
                  Contact Number *
                </label>
                <div className="relative">
                  <input 
                    type="tel" 
                    name="contact_number" 
                    value={formData.contact_number} 
                    onChange={handleChange} 
                    placeholder="09XXXXXXXXX" 
                    maxLength={11} 
                    className={`w-full p-3 border rounded-lg ${
                      errors.contact_number ? 'border-red-500' : 'border-black'
                    } ${
                      formData.permit_subtype === 'FRANCHISE' && autoFilledFields['contact_number'] ? 
                      'bg-gray-100 cursor-not-allowed' : 'bg-white'
                    }`} 
                    style={{ color: COLORS.secondary, fontFamily: COLORS.font }} 
                    readOnly={formData.permit_subtype === 'FRANCHISE' && autoFilledFields['contact_number']} 
                  />
                  {formData.permit_subtype === 'FRANCHISE' && autoFilledFields['contact_number'] && (
                    <div className="absolute top-0 right-0 mt-3 mr-3">
                      <div className="flex items-center text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                        <Check className="w-3 h-3 mr-1" /> Auto-filled
                      </div>
                    </div>
                  )}
                </div>
                {errors.contact_number ? (
                  <p className="text-red-600 text-sm mt-1" style={{ fontFamily: COLORS.font }}>
                    {errors.contact_number}
                  </p>
                ) : (
                  <p className="text-gray-500 text-xs mt-1" style={{ fontFamily: COLORS.font }}>
                    Format: 09XXXXXXXXX (11 digits total)
                  </p>
                )}
              </div>
              
              {renderInputField('email', 'Email Address *', 'email', [], true)}
              {renderInputField('citizenship', 'Citizenship *', 'select', NATIONALITIES, true)}
              
              <div className="relative">
                <label className="block mb-2 font-medium" style={{ color: COLORS.secondary }}>
                  Date of Birth *
                </label>
                <input 
                  type="date" 
                  name="birth_date" 
                  value={formData.birth_date || ''} 
                  onChange={handleChange} 
                  className={`w-full p-3 border rounded-lg ${
                    errors.birth_date ? 'border-red-500' : 'border-black'
                  } ${
                    formData.permit_subtype === 'FRANCHISE' && autoFilledFields['birth_date'] ? 
                    'bg-gray-100 cursor-not-allowed' : 'bg-white'
                  }`} 
                  style={{ color: COLORS.secondary, fontFamily: COLORS.font }} 
                  readOnly={formData.permit_subtype === 'FRANCHISE' && autoFilledFields['birth_date']} 
                />
                {formData.permit_subtype === 'FRANCHISE' && autoFilledFields['birth_date'] && (
                  <div className="absolute top-9 right-0 mt-1 mr-3">
                    <div className="flex items-center text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                      <Check className="w-3 h-3 mr-1" /> Auto-filled
                    </div>
                  </div>
                )}
                {errors.birth_date && (
                  <p className="text-red-600 text-sm mt-1" style={{ fontFamily: COLORS.font }}>
                    {errors.birth_date}
                  </p>
                )}
              </div>
              
              {renderInputField('id_type', 'Valid ID Type *', 'select', ["Driver's License", "Passport", "National ID", "UMID", "Postal ID", "Voter's ID"], true)}
              
              <div className="relative">
                <label className="block mb-2 font-medium" style={{ color: COLORS.secondary }}>
                  Valid ID Number *
                </label>
                <input 
                  type="text" 
                  name="id_number" 
                  value={formData.id_number || ''} 
                  onChange={handleChange} 
                  placeholder="ID Number" 
                  className={`w-full p-3 border rounded-lg ${
                    errors.id_number ? 'border-red-500' : 'border-black'
                  } ${
                    formData.permit_subtype === 'FRANCHISE' && autoFilledFields['id_number'] ? 
                    'bg-gray-100 cursor-not-allowed' : 'bg-white'
                  }`} 
                  style={{ color: COLORS.secondary, fontFamily: COLORS.font }} 
                  required={true} 
                  readOnly={formData.permit_subtype === 'FRANCHISE' && autoFilledFields['id_number']} 
                />
                {formData.permit_subtype === 'FRANCHISE' && autoFilledFields['id_number'] && (
                  <div className="absolute top-9 right-0 mt-1 mr-3">
                    <div className="flex items-center text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                      <Check className="w-3 h-3 mr-1" /> Auto-filled
                    </div>
                  </div>
                )}
              </div>
              
              {formData.permit_subtype === 'MTOP' && (
                renderInputField('operator_type', 'Operator Type *', 'select', OPERATOR_TYPES, true)
              )}
            </div>
          </div>
        );
        
      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold mb-4" style={{ color: COLORS.secondary }}>
              Vehicle & Route Information
            </h3>
            
            {formData.permit_subtype === 'FRANCHISE' && originalMTOPData && (
              <div className="p-4 rounded-lg border mb-4 bg-blue-50 border-blue-200">
                <div className="flex items-start">
                  <div className="bg-blue-100 p-2 rounded-full mr-3">
                    <Check className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-blue-700">
                      ✓ Vehicle & Route Data Auto-filled from MTOP (READ-ONLY)
                    </p>
                    <p className="text-xs mt-1 text-blue-600">
                      Vehicle and route information has been automatically filled from your existing MTOP permit and cannot be modified.
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {formData.permit_subtype === 'MTOP' && mtopValidation.message && (
              <div className={`p-4 rounded-lg border mb-4 ${
                mtopValidation.canProceed ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
              }`}>
                <div className="flex items-start">
                  <Key className={`w-5 h-5 mr-2 mt-0.5 ${
                    mtopValidation.canProceed ? 'text-green-600' : 'text-red-600'
                  }`} />
                  <div>
                    <p className={`text-sm font-medium ${
                      mtopValidation.canProceed ? 'text-green-700' : 'text-red-700'
                    }`}>
                      {mtopValidation.canProceed ? '✓ Eligible for MTOP Application' : '✗ Not Eligible for MTOP Application'}
                    </p>
                    <p className="text-xs mt-1" style={{ color: COLORS.secondary, fontFamily: COLORS.font }}>
                      {mtopValidation.message}
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="bg-white rounded-lg shadow p-6 border border-black mb-6">
              <h4 className="font-bold text-lg mb-4" style={{ color: COLORS.primary }}>
                Vehicle Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderInputField('make_brand', 'Make / Brand *', 'text', [], true)}
                {renderInputField('model', 'Model *', 'text', [], true)}
                
                <div className="relative">
                  <label className="block mb-2 font-medium" style={{ color: COLORS.secondary }}>
                    Engine Number *
                  </label>
                  <div className="relative">
                    <input 
                      type="text" 
                      name="engine_number" 
                      value={formData.engine_number || ''} 
                      onChange={handleChange} 
                      placeholder="Engine Number" 
                      maxLength="12" 
                      className={`w-full p-3 border rounded-lg ${
                        errors.engine_number ? 'border-red-500' : 'border-black'
                      } ${
                        formData.permit_subtype === 'FRANCHISE' && autoFilledFields['engine_number'] ? 
                        'bg-gray-100 cursor-not-allowed' : 'bg-white'
                      }`} 
                      style={{ color: COLORS.secondary, fontFamily: COLORS.font, textTransform: 'uppercase' }} 
                      required={true} 
                      readOnly={formData.permit_subtype === 'FRANCHISE' && autoFilledFields['engine_number']} 
                    />
                    {formData.permit_subtype === 'FRANCHISE' && autoFilledFields['engine_number'] && (
                      <div className="absolute top-0 right-0 mt-3 mr-3">
                        <div className="flex items-center text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                          <Check className="w-3 h-3 mr-1" /> Auto-filled
                        </div>
                      </div>
                    )}
                  </div>
                  {errors.engine_number ? (
                    <p className="text-red-600 text-sm mt-1" style={{ fontFamily: COLORS.font }}>
                      {errors.engine_number}
                    </p>
                  ) : (
                    <p className="text-gray-500 text-xs mt-1" style={{ fontFamily: COLORS.font }}>
                      Must be 8-12 characters
                    </p>
                  )}
                </div>
                
                <div className="relative">
                  <label className="block mb-2 font-medium" style={{ color: COLORS.secondary }}>
                    Chassis Number *
                  </label>
                  <div className="relative">
                    <input 
                      type="text" 
                      name="chassis_number" 
                      value={formData.chassis_number || ''} 
                      onChange={handleChange} 
                      placeholder="Chassis Number" 
                      maxLength="17" 
                      className={`w-full p-3 border rounded-lg ${
                        errors.chassis_number ? 'border-red-500' : 'border-black'
                      } ${
                        formData.permit_subtype === 'FRANCHISE' && autoFilledFields['chassis_number'] ? 
                        'bg-gray-100 cursor-not-allowed' : 'bg-white'
                      }`} 
                      style={{ color: COLORS.secondary, fontFamily: COLORS.font, textTransform: 'uppercase' }} 
                      required={true} 
                      readOnly={formData.permit_subtype === 'FRANCHISE' && autoFilledFields['chassis_number']} 
                    />
                    {formData.permit_subtype === 'FRANCHISE' && autoFilledFields['chassis_number'] && (
                      <div className="absolute top-0 right-0 mt-3 mr-3">
                        <div className="flex items-center text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                          <Check className="w-3 h-3 mr-1" /> Auto-filled
                        </div>
                      </div>
                    )}
                  </div>
                  {errors.chassis_number ? (
                    <p className="text-red-600 text-sm mt-1" style={{ fontFamily: COLORS.font }}>
                      {errors.chassis_number}
                    </p>
                  ) : (
                    <p className="text-gray-500 text-xs mt-1" style={{ fontFamily: COLORS.font }}>
                      Must be exactly 17 characters
                    </p>
                  )}
                </div>
                
                <div className="relative">
                  <label className="block mb-2 font-medium" style={{ color: COLORS.secondary }}>
                    Plate Number *
                  </label>
                  <div className="relative">
                    <input 
                      type="text" 
                      name="plate_number" 
                      value={formData.plate_number || ''} 
                      onChange={handleChange} 
                      placeholder="ABC1234" 
                      maxLength="7" 
                      className={`w-full p-3 border rounded-lg ${
                        errors.plate_number ? 'border-red-500' : 'border-black'
                      } ${
                        formData.permit_subtype === 'FRANCHISE' && autoFilledFields['plate_number'] ? 
                        'bg-gray-100 cursor-not-allowed' : 'bg-white'
                      }`} 
                      style={{ color: COLORS.secondary, fontFamily: COLORS.font, textTransform: 'uppercase' }} 
                      required={true} 
                      readOnly={formData.permit_subtype === 'FRANCHISE' && autoFilledFields['plate_number']} 
                    />
                    {formData.permit_subtype === 'FRANCHISE' && autoFilledFields['plate_number'] && (
                      <div className="absolute top-0 right-0 mt-3 mr-3">
                        <div className="flex items-center text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                          <Check className="w-3 h-3 mr-1" /> Auto-filled
                        </div>
                      </div>
                    )}
                  </div>
                  {errors.plate_number ? (
                    <p className="text-red-600 text-sm mt-1" style={{ fontFamily: COLORS.font }}>
                      {errors.plate_number}
                    </p>
                  ) : (
                    <p className="text-gray-500 text-xs mt-1" style={{ fontFamily: COLORS.font }}>
                      Format: 3 letters followed by 4 digits (e.g., ABC1234)
                    </p>
                  )}
                </div>
                
                <div className="relative">
                  <label className="block mb-2 font-medium" style={{ color: COLORS.secondary }}>
                    Year Acquired *
                  </label>
                  <div className="relative">
                    <input 
                      type="text" 
                      name="year_acquired" 
                      value={formData.year_acquired || ''} 
                      onChange={handleChange} 
                      placeholder="YYYY" 
                      maxLength="4" 
                      className={`w-full p-3 border rounded-lg ${
                        errors.year_acquired ? 'border-red-500' : 'border-black'
                      } ${
                        formData.permit_subtype === 'FRANCHISE' && autoFilledFields['year_acquired'] ? 
                        'bg-gray-100 cursor-not-allowed' : 'bg-white'
                      }`} 
                      style={{ color: COLORS.secondary, fontFamily: COLORS.font }} 
                      required={true} 
                      readOnly={formData.permit_subtype === 'FRANCHISE' && autoFilledFields['year_acquired']} 
                    />
                    {formData.permit_subtype === 'FRANCHISE' && autoFilledFields['year_acquired'] && (
                      <div className="absolute top-0 right-0 mt-3 mr-3">
                        <div className="flex items-center text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                          <Check className="w-3 h-3 mr-1" /> Auto-filled
                        </div>
                      </div>
                    )}
                  </div>
                  {errors.year_acquired ? (
                    <p className="text-red-600 text-sm mt-1" style={{ fontFamily: COLORS.font }}>
                      {errors.year_acquired}
                    </p>
                  ) : (
                    <p className="text-gray-500 text-xs mt-1" style={{ fontFamily: COLORS.font }}>
                      Format: YYYY (e.g., 2023)
                    </p>
                  )}
                </div>
                
                {renderInputField('color', 'Color ', 'text', [], true)}
                {renderInputField('vehicle_type', 'Vehicle Type ', 'select', ['Tricycle', 'Motorcycle', 'Pedicabs', 'E-Tricycle'], true)}
                
                <div className="relative">
                  <label className="block mb-2 font-medium" style={{ color: COLORS.secondary }}>
                    LTO OR Number *
                  </label>
                  <div className="relative">
                    <input 
                      type="text" 
                      name="lto_or_number" 
                      value={formData.lto_or_number || ''} 
                      onChange={handleChange} 
                      placeholder="OR Number" 
                      maxLength="8" 
                      className={`w-full p-3 border rounded-lg ${
                        errors.lto_or_number ? 'border-red-500' : 'border-black'
                      } ${
                        formData.permit_subtype === 'FRANCHISE' && autoFilledFields['lto_or_number'] ? 
                        'bg-gray-100 cursor-not-allowed' : 'bg-white'
                      }`} 
                      style={{ color: COLORS.secondary, fontFamily: COLORS.font }} 
                      required={true} 
                      readOnly={formData.permit_subtype === 'FRANCHISE' && autoFilledFields['lto_or_number']} 
                    />
                    {formData.permit_subtype === 'FRANCHISE' && autoFilledFields['lto_or_number'] && (
                      <div className="absolute top-0 right-0 mt-3 mr-3">
                        <div className="flex items-center text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                          <Check className="w-3 h-3 mr-1" /> Auto-filled
                        </div>
                      </div>
                    )}
                  </div>
                  {errors.lto_or_number ? (
                    <p className="text-red-600 text-sm mt-1" style={{ fontFamily: COLORS.font }}>
                      {errors.lto_or_number}
                    </p>
                  ) : (
                    <p className="text-gray-500 text-xs mt-1" style={{ fontFamily: COLORS.font }}>
                      Must be 7-8 digits
                    </p>
                  )}
                </div>
                
                <div className="relative">
                  <label className="block mb-2 font-medium" style={{ color: COLORS.secondary }}>
                    LTO CR Number *
                  </label>
                  <div className="relative">
                    <input 
                      type="text" 
                      name="lto_cr_number" 
                      value={formData.lto_cr_number || ''} 
                      onChange={handleChange} 
                      placeholder="CR Number" 
                      maxLength="8" 
                      className={`w-full p-3 border rounded-lg ${
                        errors.lto_cr_number ? 'border-red-500' : 'border-black'
                      } ${
                        formData.permit_subtype === 'FRANCHISE' && autoFilledFields['lto_cr_number'] ? 
                        'bg-gray-100 cursor-not-allowed' : 'bg-white'
                      }`} 
                      style={{ color: COLORS.secondary, fontFamily: COLORS.font }} 
                      required={true} 
                      readOnly={formData.permit_subtype === 'FRANCHISE' && autoFilledFields['lto_cr_number']} 
                    />
                    {formData.permit_subtype === 'FRANCHISE' && autoFilledFields['lto_cr_number'] && (
                      <div className="absolute top-0 right-0 mt-3 mr-3">
                        <div className="flex items-center text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                          <Check className="w-3 h-3 mr-1" /> Auto-filled
                        </div>
                      </div>
                    )}
                  </div>
                  {errors.lto_cr_number ? (
                    <p className="text-red-600 text-sm mt-1" style={{ fontFamily: COLORS.font }}>
                      {errors.lto_cr_number}
                    </p>
                  ) : (
                    <p className="text-gray-500 text-xs mt-1" style={{ fontFamily: COLORS.font }}>
                      Must be 7-8 digits
                    </p>
                  )}
                </div>
                
                <div className="relative">
                  <label className="block mb-2 font-medium" style={{ color: COLORS.secondary }}>
                    LTO Expiration Date *
                  </label>
                  <input 
                    type="date" 
                    name="lto_expiration_date" 
                    value={formData.lto_expiration_date || ''} 
                    onChange={handleChange} 
                    className={`w-full p-3 border rounded-lg ${
                      errors.lto_expiration_date ? 'border-red-500' : 'border-black'
                    } ${
                      formData.permit_subtype === 'FRANCHISE' && autoFilledFields['lto_expiration_date'] ? 
                      'bg-gray-100 cursor-not-allowed' : 'bg-white'
                    }`} 
                    style={{ color: COLORS.secondary, fontFamily: COLORS.font }} 
                    readOnly={formData.permit_subtype === 'FRANCHISE' && autoFilledFields['lto_expiration_date']} 
                  />
                  {formData.permit_subtype === 'FRANCHISE' && autoFilledFields['lto_expiration_date'] && (
                    <div className="absolute top-9 right-0 mt-1 mr-3">
                      <div className="flex items-center text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                        <Check className="w-3 h-3 mr-1" /> Auto-filled
                      </div>
                    </div>
                  )}
                  {errors.lto_expiration_date && (
                    <p className="text-red-600 text-sm mt-1" style={{ fontFamily: COLORS.font }}>
                      {errors.lto_expiration_date}
                    </p>
                  )}
                </div>
                
                <div className="relative">
                  <label className="block mb-2 font-medium" style={{ color: COLORS.secondary }}>
                    MV File Number
                  </label>
                  <input 
                    type="text" 
                    name="mv_file_number" 
                    value={formData.mv_file_number || ''} 
                    onChange={handleChange} 
                    placeholder="MV File Number" 
                    className={`w-full p-3 border border-black rounded-lg ${
                      formData.permit_subtype === 'FRANCHISE' && autoFilledFields['mv_file_number'] ? 
                      'bg-gray-100 cursor-not-allowed' : 'bg-white'
                    }`} 
                    style={{ color: COLORS.secondary, fontFamily: COLORS.font }} 
                    readOnly={formData.permit_subtype === 'FRANCHISE' && autoFilledFields['mv_file_number']} 
                  />
                  {formData.permit_subtype === 'FRANCHISE' && autoFilledFields['mv_file_number'] && (
                    <div className="absolute top-9 right-0 mt-1 mr-3">
                      <div className="flex items-center text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                        <Check className="w-3 h-3 mr-1" /> Auto-filled
                      </div>
                    </div>
                  )}
                </div>
                
                {renderInputField('district', 'District ', 'text', [], true)}
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6 border border-black">
              <h4 className="font-bold text-lg mb-4" style={{ color: COLORS.primary }}>
                Route & Operation Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <label className="block mb-2 font-medium" style={{ color: COLORS.secondary }}>
                    Route / Zone *
                  </label>
                  <input 
                    list="route-list" 
                    name="route_zone" 
                    value={formData.route_zone} 
                    onChange={handleChange} 
                    placeholder="Select or type route" 
                    className={`w-full p-3 border rounded-lg ${
                      errors.route_zone ? 'border-red-500' : 'border-black'
                    } ${
                      formData.permit_subtype === 'FRANCHISE' && autoFilledFields['route_zone'] ? 
                      'bg-gray-100 cursor-not-allowed' : 'bg-white'
                    }`} 
                    style={{ color: COLORS.secondary, fontFamily: COLORS.font }} 
                    readOnly={formData.permit_subtype === 'FRANCHISE' && autoFilledFields['route_zone']} 
                  />
                  <datalist id="route-list">
                    {ROUTES.map(r => <option key={r.value} value={r.label} />)}
                  </datalist>
                  {formData.permit_subtype === 'FRANCHISE' && autoFilledFields['route_zone'] && (
                    <div className="absolute top-9 right-0 mt-1 mr-3">
                      <div className="flex items-center text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                        <Check className="w-3 h-3 mr-1" /> Auto-filled
                      </div>
                    </div>
                  )}
                  {errors.route_zone && (
                    <p className="text-red-600 text-sm mt-1" style={{ fontFamily: COLORS.font }}>
                      {errors.route_zone}
                    </p>
                  )}
                </div>
                
                {formData.permit_subtype === 'FRANCHISE' && (
                  <>
                    <div className="relative">
                      <label className="block mb-2 font-medium" style={{ color: COLORS.secondary }}>
                        TODA Name *
                      </label>
                      <input 
                        list="toda-list" 
                        name="toda_name" 
                        value={formData.toda_name} 
                        onChange={handleChange} 
                        placeholder="Select or type TODA" 
                        className={`w-full p-3 border rounded-lg ${
                          errors.toda_name ? 'border-red-500' : 'border-black'
                        } ${
                          formData.permit_subtype === 'FRANCHISE' && autoFilledFields['toda_name'] ? 
                          'bg-gray-100 cursor-not-allowed' : 'bg-white'
                        }`} 
                        style={{ color: COLORS.secondary, fontFamily: COLORS.font }} 
                        readOnly={formData.permit_subtype === 'FRANCHISE' && autoFilledFields['toda_name']} 
                      />
                      <datalist id="toda-list">
                        {TODA_NAMES.map(name => <option key={name} value={name} />)}
                      </datalist>
                      {formData.permit_subtype === 'FRANCHISE' && autoFilledFields['toda_name'] && (
                        <div className="absolute top-9 right-0 mt-1 mr-3">
                          <div className="flex items-center text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                            <Check className="w-3 h-3 mr-1" /> Auto-filled
                          </div>
                        </div>
                      )}
                      {errors.toda_name && (
                        <p className="text-red-600 text-sm mt-1" style={{ fontFamily: COLORS.font }}>
                          {errors.toda_name}
                        </p>
                      )}
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block mb-2 font-medium" style={{ color: COLORS.secondary }}>
                        TODA President Certificate
                      </label>
                      <input 
                        type="file" 
                        name="toda_president_cert" 
                        onChange={handleChange} 
                        accept=".jpg,.jpeg,.png,.pdf" 
                        className="w-full p-2 border border-black rounded" 
                        style={{ fontFamily: COLORS.font }} 
                      />
                      {formData.toda_president_cert && (
                        <div className="mt-2 flex items-center justify-between">
                          <p className="text-green-600 text-xs flex items-center">
                            <Check className="w-3 h-3 mr-1" />
                            Uploaded: {formData.toda_president_cert.name}
                          </p>
                          <button 
                            type="button" 
                            onClick={() => previewFile(formData.toda_president_cert)} 
                            className="text-xs text-blue-600 hover:text-blue-800"
                          >
                            Preview
                          </button>
                        </div>
                      )}
                    </div>
                  </>
                )}
                
                <div className="relative">
                  <label className="block mb-2 font-medium" style={{ color: COLORS.secondary }}>
                    Barangay of Operation *
                  </label>
                  <input 
                    list="barangay-list" 
                    name="barangay_of_operation" 
                    value={formData.barangay_of_operation} 
                    onChange={handleChange} 
                    placeholder="Select or type barangay" 
                    className={`w-full p-3 border rounded-lg ${
                      errors.barangay_of_operation ? 'border-red-500' : 'border-black'
                    } ${
                      formData.permit_subtype === 'FRANCHISE' && autoFilledFields['barangay_of_operation'] ? 
                      'bg-gray-100 cursor-not-allowed' : 'bg-white'
                    }`} 
                    style={{ color: COLORS.secondary, fontFamily: COLORS.font }} 
                    readOnly={formData.permit_subtype === 'FRANCHISE' && autoFilledFields['barangay_of_operation']} 
                  />
                  <datalist id="barangay-list">
                    {barangaysCaloocan.map(b => <option key={b} value={b} />)}
                  </datalist>
                  {formData.permit_subtype === 'FRANCHISE' && autoFilledFields['barangay_of_operation'] && (
                    <div className="absolute top-9 right-0 mt-1 mr-3">
                      <div className="flex items-center text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                        <Check className="w-3 h-3 mr-1" /> Auto-filled
                      </div>
                    </div>
                  )}
                  {errors.barangay_of_operation && (
                    <p className="text-red-600 text-sm mt-1" style={{ fontFamily: COLORS.font }}>
                      {errors.barangay_of_operation}
                    </p>
                  )}
                </div>
                
                {formData.permit_subtype === 'FRANCHISE' && (
                  <div>
                    <label className="block mb-2 font-medium" style={{ color: COLORS.secondary }}>
                      Company/Organization Name (Optional)
                    </label>
                    <input 
                      type="text" 
                      name="company_name" 
                      value={formData.company_name} 
                      onChange={handleChange} 
                      placeholder="Company/Organization Name" 
                      className="w-full p-3 border border-black rounded-lg" 
                      style={{ color: COLORS.secondary, fontFamily: COLORS.font }} 
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        );
        
      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold mb-4" style={{ color: COLORS.secondary }}>
              Required Documents
            </h3>
            <p className="text-sm mb-4 text-gray-600" style={{ fontFamily: COLORS.font }}>
              <span className="text-red-600 font-bold">* All required documents must be uploaded.</span> Documents marked with * are required for {formData.permit_subtype === 'MTOP' ? 'MTOP' : 'Franchise'} application.
            </p>
            
            {errors.min_documents && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg mb-4">
                <p className="text-red-600 font-medium" style={{ fontFamily: COLORS.font }}>
                  {errors.min_documents}
                </p>
              </div>
            )}
            
            <div className="space-y-4">
              {[
                { 
                  name: 'proof_of_residency', 
                  label: 'Proof of Residency *', 
                  description: 'Utility bill, lease agreement, or any document proving your residency' 
                },
                { 
                  name: 'barangay_clearance', 
                  label: 'Barangay Clearance *', 
                  description: 'Clearance from your barangay of residence - either upload file OR enter Barangay Clearance ID', 
                  specialType: 'barangayClearance' 
                },
                { 
                  name: 'lto_or_cr', 
                  label: 'LTO OR/CR *', 
                  description: 'Official Receipt and Certificate of Registration from LTO' 
                },
                { 
                  name: 'insurance_certificate', 
                  label: 'Insurance Certificate', 
                  description: 'Comprehensive insurance coverage for the vehicle', 
                  optional: true 
                },
                { 
                  name: 'drivers_license', 
                  label: 'Driver\'s License', 
                  description: 'Valid driver\'s license of the operator', 
                  optional: true 
                },
                { 
                  name: 'emission_test', 
                  label: 'Emission Test', 
                  description: 'Latest emission test result', 
                  optional: true 
                },
                { 
                  name: 'id_picture', 
                  label: '2x2 ID Picture', 
                  description: 'Recent 2x2 ID photo with white background', 
                  optional: true 
                },
                { 
                  name: 'official_receipt', 
                  label: 'Official Receipt', 
                  description: 'Payment receipt for fees', 
                  optional: true 
                },
              ].map((doc) => (
                <div key={doc.name} className="flex flex-col p-4 border border-gray-300 rounded-lg">
                  <div className="mb-3">
                    <label className="flex items-center font-medium">
                      <span className={`${doc.optional ? '' : 'text-red-600'}`} style={{ 
                        color: doc.optional ? COLORS.secondary : COLORS.danger, 
                        fontFamily: COLORS.font 
                      }}>
                        {doc.label}
                      </span>
                      {doc.optional && (
                        <span className="ml-2 text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                          Optional
                        </span>
                      )}
                    </label>
                    {doc.description && (
                      <p className="text-sm text-gray-600 mt-1">{doc.description}</p>
                    )}
                  </div>
                  
                  {doc.specialType === 'barangayClearance' ? (
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block mb-2 text-sm font-medium" style={{ color: COLORS.secondary, fontFamily: COLORS.font }}>
                            Barangay Clearance ID (Alternative to Upload)
                          </label>
                          <input 
                            type="text" 
                            name="barangay_clearance_id" 
                            value={formData.barangay_clearance_id || ''} 
                            onChange={handleChange} 
                            placeholder="Enter Barangay Clearance ID" 
                            className="w-full p-3 border border-black rounded-lg" 
                            style={{ color: COLORS.secondary, fontFamily: COLORS.font }} 
                          />
                        </div>
                        <div>
                          <label className="block mb-2 text-sm font-medium" style={{ color: COLORS.secondary, fontFamily: COLORS.font }}>
                            Or Upload Barangay Clearance Document
                          </label>
                          <div className="flex items-center gap-3 p-3 border border-black rounded w-full bg-white">
                            <Upload className="w-5 h-5 text-gray-500" />
                            <input 
                              type="file" 
                              name="barangay_clearance" 
                              onChange={handleChange} 
                              accept=".jpg,.jpeg,.png,.pdf" 
                              className="w-full text-sm file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-sm file:font-medium file:bg-green-50 file:text-green-700 hover:file:bg-green-100" 
                              style={{ fontFamily: COLORS.font }} 
                            />
                          </div>
                        </div>
                      </div>
                      
                      {(formData.barangay_clearance_id || formData.barangay_clearance) && (
                        <div className="flex items-center justify-between p-2 bg-green-50 border border-green-200 rounded">
                          <div className="flex items-center">
                            <Check className="w-4 h-4 text-green-600 mr-2" />
                            <span className="text-sm text-green-700">
                              {formData.barangay_clearance_id ? 
                                `Barangay Clearance ID: ${formData.barangay_clearance_id}` : 
                                formData.barangay_clearance ? 
                                `Uploaded: ${formData.barangay_clearance.name}` : ''
                              }
                            </span>
                          </div>
                          {formData.barangay_clearance && (
                            <button 
                              type="button" 
                              onClick={() => previewFile(formData.barangay_clearance)} 
                              className="text-xs text-blue-600 hover:text-blue-800"
                            >
                              Preview
                            </button>
                          )}
                        </div>
                      )}
                      
                      {(!formData.barangay_clearance_id && !formData.barangay_clearance) && errors.barangay_clearance && (
                        <p className="text-red-600 text-sm mt-1" style={{ fontFamily: COLORS.font }}>
                          {errors.barangay_clearance}
                        </p>
                      )}
                    </div>
                  ) : (
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
                          required={!doc.optional} 
                        />
                      </div>
                      
                      {errors[doc.name] && (
                        <p className="text-red-600 text-sm mt-1" style={{ fontFamily: COLORS.font }}>
                          {errors[doc.name]}
                        </p>
                      )}
                      
                      {formData[doc.name] && (
                        <div className="mt-2 flex items-center justify-between">
                          <p className="text-green-600 text-xs flex items-center">
                            <Check className="w-3 h-3 mr-1" />
                            Uploaded: {formData[doc.name].name}
                          </p>
                          <button 
                            type="button" 
                            onClick={() => previewFile(formData[doc.name])} 
                            className="text-xs text-blue-600 hover:text-blue-800"
                          >
                            Preview
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
              
              {formData.permit_subtype === 'FRANCHISE' && (
                <div className="flex flex-col p-4 border border-gray-300 rounded-lg">
                  <div className="mb-3">
                    <label className="flex items-center font-medium">
                      <span className="text-red-600" style={{ fontFamily: COLORS.font }}>
                        TODA Endorsement *
                      </span>
                    </label>
                    <p className="text-sm text-gray-600 mt-1">
                      Endorsement letter from the Tricycle Operators and Drivers Association
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center gap-3 p-3 border border-black rounded w-full bg-white">
                      <Upload className="w-5 h-5 text-gray-500" />
                      <input 
                        type="file" 
                        name="toda_endorsement" 
                        onChange={handleChange} 
                        accept=".jpg,.jpeg,.png,.pdf" 
                        className="w-full text-sm file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-sm file:font-medium file:bg-green-50 file:text-green-700 hover:file:bg-green-100" 
                        style={{ fontFamily: COLORS.font }} 
                        required 
                      />
                    </div>
                    {errors.toda_endorsement && (
                      <p className="text-red-600 text-sm mt-1" style={{ fontFamily: COLORS.font }}>
                        {errors.toda_endorsement}
                      </p>
                    )}
                    {formData.toda_endorsement && (
                      <div className="mt-2 flex items-center justify-between">
                        <p className="text-green-600 text-xs flex items-center">
                          <Check className="w-3 h-3 mr-1" />
                          Uploaded: {formData.toda_endorsement.name}
                        </p>
                        <button 
                          type="button" 
                          onClick={() => previewFile(formData.toda_endorsement)} 
                          className="text-xs text-blue-600 hover:text-blue-800"
                        >
                          Preview
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {formData.permit_subtype === 'MTOP' && (
                <>
                  {[
                    { 
                      name: 'nbi_clearance', 
                      label: 'NBI Clearance *', 
                      description: 'Valid NBI clearance certificate' 
                    },
                    { 
                      name: 'police_clearance', 
                      label: 'Police Clearance *', 
                      description: 'Police clearance from local police station' 
                    },
                    { 
                      name: 'medical_certificate', 
                      label: 'Medical Certificate *', 
                      description: 'Medical certificate from accredited clinic/hospital' 
                    },
                  ].map((doc) => (
                    <div key={doc.name} className="flex flex-col p-4 border border-gray-300 rounded-lg">
                      <div className="mb-3">
                        <label className="flex items-center font-medium">
                          <span className="text-red-600" style={{ fontFamily: COLORS.font }}>
                            {doc.label}
                          </span>
                        </label>
                        {doc.description && (
                          <p className="text-sm text-gray-600 mt-1">{doc.description}</p>
                        )}
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
                        {errors[doc.name] && (
                          <p className="text-red-600 text-sm mt-1" style={{ fontFamily: COLORS.font }}>
                            {errors[doc.name]}
                          </p>
                        )}
                        {formData[doc.name] && (
                          <div className="mt-2 flex items-center justify-between">
                            <p className="text-green-600 text-xs flex items-center">
                              <Check className="w-3 h-3 mr-1" />
                              Uploaded: {formData[doc.name].name}
                            </p>
                            <button 
                              type="button" 
                              onClick={() => previewFile(formData[doc.name])} 
                              className="text-xs text-blue-600 hover:text-blue-800"
                            >
                              Preview
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        );
        
      case 5:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold mb-4" style={{ color: COLORS.secondary }}>
              Payment Information
            </h3>
            <p className="text-sm mb-4 text-gray-600" style={{ fontFamily: COLORS.font }}>
              <span className="text-red-600 font-bold">* Please select your payment method and choose which fees to pay.</span>
            </p>
            
            {errors.payment && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg mb-4">
                <p className="text-red-600 font-medium" style={{ fontFamily: COLORS.font }}>
                  {errors.payment}
                </p>
              </div>
            )}
            
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
            
            <div className="bg-white rounded-lg shadow p-6 border border-black">
              <h4 className="font-bold text-lg mb-4" style={{ color: COLORS.primary }}>
                Select Fees to Pay
              </h4>
              <div className="space-y-4">
                {[
                  { 
                    name: 'franchise_fee', 
                    label: formData.permit_subtype === 'MTOP' ? 'MTOP Application Fee' : 'Franchise Fee', 
                    amount: FEES.franchise_fee, 
                    checked: formData.franchise_fee_checked 
                  },
                  { 
                    name: 'sticker_id_fee', 
                    label: 'Sticker / ID Fee', 
                    amount: FEES.sticker_id_fee, 
                    checked: formData.sticker_id_fee_checked 
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
                          (formData.franchise_fee_checked ? FEES.franchise_fee : 0) + 
                          (formData.sticker_id_fee_checked ? FEES.sticker_id_fee : 0) + 
                          (formData.inspection_fee_checked ? FEES.inspection_fee : 0)
                        ).toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-600">
                        {[
                          formData.franchise_fee_checked, 
                          formData.sticker_id_fee_checked, 
                          formData.inspection_fee_checked
                        ].filter(Boolean).length} fee(s) selected
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Show payment status if paid */}
                {paymentStatus.isPaid && (
                  <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center">
                      <Check className="w-6 h-6 text-green-600 mr-3" />
                      <div>
                        <p className="font-semibold text-green-700">
                          ✓ Payment Completed
                        </p>
                        <p className="text-sm text-green-600 mt-1">
                          Payment Method: {paymentStatus.paymentMethod === 'online' ? 'Online Payment' : 'Receipt Upload'}
                        </p>
                        {paymentStatus.paymentDate && (
                          <p className="text-xs text-green-600 mt-1">
                            Paid on: {paymentStatus.paymentDate}
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
                
                {formData.payment_method === 'online' && (
                  <div className="mt-6">
                    <button 
                      type="button" 
                      onClick={handleOnlinePayment} 
                      disabled={!formData.franchise_fee_checked && !formData.sticker_id_fee_checked && !formData.inspection_fee_checked} 
                      style={{ 
                        background: (!formData.franchise_fee_checked && !formData.sticker_id_fee_checked && !formData.inspection_fee_checked) ? 
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
        
      case 6:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold mb-4" style={{ color: COLORS.secondary }}>
              Declaration and Signature
            </h3>
            
            <div className="bg-white rounded-lg shadow p-6 border border-black">
              <div className="mb-8 p-6 border-2 border-red-200 bg-red-50 rounded-lg">
                <h4 className="font-bold text-lg mb-4 text-red-700">
                  LEGAL DECLARATION
                </h4>
                <div className="space-y-3 text-sm" style={{ fontFamily: COLORS.font }}>
                  <p>
                    I, <span className="font-bold">{getFullName() || '[Full Name]'}</span>, hereby solemnly declare that:
                  </p>
                  <ol className="list-decimal ml-5 space-y-2">
                    <li>All information provided in this application form is true, complete, and correct to the best of my knowledge;</li>
                    <li>I am the registered owner/authorized representative of the tricycle unit described in this application;</li>
                    <li>The vehicle is roadworthy and complies with all safety and emission standards;</li>
                    <li>I have secured all necessary clearances, permits, and insurance coverage;</li>
                    <li>I shall abide by all traffic rules, regulations, and ordinances of Caloocan City;</li>
                    <li>I understand that any false statement or misrepresentation shall be grounds for:</li>
                    <ul className="list-disc ml-8 mt-2 space-y-1">
                      <li>Immediate cancellation of the permit</li>
                      <li>Administrative and criminal liability</li>
                      <li>Blacklisting from future applications</li>
                      <li>Fines and penalties as per existing laws</li>
                    </ul>
                    <li>I agree to the processing of my personal data for the purpose of this application in accordance with the Data Privacy Act of 2012;</li>
                    <li>I consent to inspections and monitoring by authorized personnel.</li>
                  </ol>
                  <p className="mt-4 font-semibold">
                    Republic Act No. 4136 - Land Transportation and Traffic Code
                  </p>
                  <p className="text-xs italic">
                    "Any person who makes any false statement in any document required by this Act shall, upon conviction, be punished by a fine of not less than ₱5,000 nor more than ₱20,000 or imprisonment of not less than 6 months nor more than 1 year, or both."
                  </p>
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
                        <img src={formData.applicant_signature} alt="Applicant Signature" className="max-h-20 mx-auto" />
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
                          <p className="text-red-600 text-sm mt-1">
                            {errors.applicant_signature}
                          </p>
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
                    value={formData.date_submitted || new Date().toISOString().split('T')[0]} 
                    onChange={handleChange} 
                    className={`w-full p-3 border border-black rounded-lg ${errors.date_submitted ? 'border-red-500' : ''}`} 
                    style={{ color: COLORS.secondary, fontFamily: COLORS.font }} 
                    required 
                  />
                  {errors.date_submitted && (
                    <p className="text-red-600 text-sm mt-1">
                      {errors.date_submitted}
                    </p>
                  )}
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
                      I, <span className="font-semibold">{getFullName() || '[Full Name]'}</span>, have read, understood, and agree to all terms and conditions stated in this declaration. I certify that all information provided is accurate and I accept full responsibility for its veracity.
                    </p>
                    {errors.declaration && (
                      <p className="text-red-600 text-sm mt-1">
                        {errors.declaration}
                      </p>
                    )}
                  </label>
                </div>
              </div>
            </div>
          </div>
        );
        
      case 7:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold mb-4" style={{ color: COLORS.secondary }}>
              Review Your Application
            </h3>
            
            <div className="bg-white rounded-lg shadow p-6 border border-black">
              <div className="space-y-6">
                <div className="p-4 bg-blue-50 rounded-lg mb-4">
                  <h5 className="font-bold text-lg mb-2" style={{ color: COLORS.primary }}>
                    Application Type: {formData.permit_subtype === 'MTOP' ? 'Motorized Tricycle Operator\'s Permit (MTOP)' : 'Franchise Permit'}
                  </h5>
                  {formData.permit_subtype === 'MTOP' && (
                    <p className="text-sm" style={{ color: COLORS.secondary }}>
                      Operator Type: {formData.operator_type}
                    </p>
                  )}
                  {formData.permit_subtype === 'FRANCHISE' && formData.mtop_application_id && (
                    <p className="text-sm" style={{ color: COLORS.secondary }}>
                      MTOP Reference ID: {formData.mtop_application_id}
                    </p>
                  )}
                </div>
                
                {formData.permit_subtype === 'FRANCHISE' && originalMTOPData && (
                  <div className="p-4 rounded-lg border mb-4 bg-blue-50 border-blue-200">
                    <div className="flex items-start">
                      <div className="bg-blue-100 p-2 rounded-full mr-3">
                        <Check className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-blue-700">
                          ✓ Data Auto-filled from MTOP (READ-ONLY)
                        </p>
                        <p className="text-xs mt-1 text-blue-600">
                          Your application has been pre-filled with data from your existing MTOP permit (ID: {formData.mtop_application_id})
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="p-4 bg-gray-50 rounded-lg mb-4">
                  <h5 className="font-bold text-lg mb-2" style={{ color: COLORS.primary }}>
                    Payment Summary
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="font-medium" style={{ color: COLORS.secondary }}>
                        Payment Method:
                      </p>
                      <p className={`font-bold ${formData.payment_method === 'online' ? 'text-blue-600' : 'text-green-600'}`}>
                        {formData.payment_method === 'online' ? 'Online Payment' : 'Receipt Upload'}
                      </p>
                    </div>
                    <div>
                      <p className="font-medium" style={{ color: COLORS.secondary }}>
                        Total Amount:
                      </p>
                      <p className="text-2xl font-bold" style={{ color: COLORS.primary }}>
                        ₱{(
                          (formData.franchise_fee_checked ? FEES.franchise_fee : 0) + 
                          (formData.sticker_id_fee_checked ? FEES.sticker_id_fee : 0) + 
                          (formData.inspection_fee_checked ? FEES.inspection_fee : 0)
                        ).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h5 className="font-semibold mb-3 text-lg" style={{ color: COLORS.primary }}>
                    {formData.permit_subtype === 'MTOP' ? 'Operator Information' : 'Applicant Information'}
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm" style={{ fontFamily: COLORS.font }}>
                    <div className="flex items-center">
                      <span className="font-medium w-40">Full Name:</span>
                      <span className="flex-1">{getFullName()}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium w-40">First Name:</span>
                      <span className="flex-1">{formData.first_name}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium w-40">Last Name:</span>
                      <span className="flex-1">{formData.last_name}</span>
                    </div>
                    {formData.middle_initial && (
                      <div className="flex items-center">
                        <span className="font-medium w-40">Middle Initial:</span>
                        <span className="flex-1">{formData.middle_initial}.</span>
                      </div>
                    )}
                    <div className="flex items-center">
                      <span className="font-medium w-40">Home Address:</span>
                      <span className="flex-1">{formData.home_address}</span>
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
                      <span className="font-medium w-40">Citizenship:</span>
                      <span className="flex-1">{formData.citizenship}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium w-40">Birth Date:</span>
                      <span className="flex-1">{formData.birth_date}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium w-40">ID Type:</span>
                      <span className="flex-1">{formData.id_type}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium w-40">ID Number:</span>
                      <span className="flex-1">{formData.id_number}</span>
                    </div>
                    {formData.permit_subtype === 'MTOP' && (
                      <div className="flex items-center">
                        <span className="font-medium w-40">Operator Type:</span>
                        <span className="flex-1">{formData.operator_type}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <h5 className="font-semibold mb-3 text-lg" style={{ color: COLORS.primary }}>
                    Tricycle Information
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm" style={{ fontFamily: COLORS.font }}>
                    <div className="flex items-center">
                      <span className="font-medium w-40">Make/Brand:</span>
                      <span className="flex-1">{formData.make_brand}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium w-40">Model:</span>
                      <span className="flex-1">{formData.model}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium w-40">Engine Number:</span>
                      <span className="flex-1">{formData.engine_number}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium w-40">Chassis Number:</span>
                      <span className="flex-1">{formData.chassis_number}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium w-40">Plate Number:</span>
                      <span className="flex-1">{formData.plate_number}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium w-40">Year Acquired:</span>
                      <span className="flex-1">{formData.year_acquired}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium w-40">Color:</span>
                      <span className="flex-1">{formData.color}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium w-40">Vehicle Type:</span>
                      <span className="flex-1">{formData.vehicle_type}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium w-40">LTO OR Number:</span>
                      <span className="flex-1">{formData.lto_or_number}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium w-40">LTO CR Number:</span>
                      <span className="flex-1">{formData.lto_cr_number}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium w-40">LTO Expiration:</span>
                      <span className="flex-1">{formData.lto_expiration_date}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium w-40">District:</span>
                      <span className="flex-1">{formData.district}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h5 className="font-semibold mb-3 text-lg" style={{ color: COLORS.primary }}>
                    Operation Information
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm" style={{ fontFamily: COLORS.font }}>
                    <div className="flex items-center">
                      <span className="font-medium w-40">Route/Zone:</span>
                      <span className="flex-1">{formData.route_zone}</span>
                    </div>
                    {formData.permit_subtype === 'FRANCHISE' && (
                      <div className="flex items-center">
                        <span className="font-medium w-40">TODA Name:</span>
                        <span className="flex-1">{formData.toda_name}</span>
                      </div>
                    )}
                    <div className="flex items-center">
                      <span className="font-medium w-40">Barangay of Operation:</span>
                      <span className="flex-1">{formData.barangay_of_operation}</span>
                    </div>
                    {formData.permit_subtype === 'FRANCHISE' && formData.company_name && (
                      <div className="flex items-center">
                        <span className="font-medium w-40">Company Name:</span>
                        <span className="flex-1">{formData.company_name}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <h5 className="font-semibold mb-3 text-lg" style={{ color: COLORS.primary }}>
                    Documents Summary
                  </h5>
                  <div className="space-y-4">
                    {[
                      { name: 'proof_of_residency', label: 'Proof of Residency', file: formData.proof_of_residency },
                      { name: 'barangay_clearance', label: 'Barangay Clearance', file: formData.barangay_clearance, id: formData.barangay_clearance_id },
                      { name: 'lto_or_cr', label: 'LTO OR/CR', file: formData.lto_or_cr },
                      { name: 'insurance_certificate', label: 'Insurance Certificate', file: formData.insurance_certificate },
                      { name: 'drivers_license', label: 'Driver\'s License', file: formData.drivers_license },
                      { name: 'emission_test', label: 'Emission Test', file: formData.emission_test },
                      { name: 'id_picture', label: '2x2 ID Picture', file: formData.id_picture },
                      { name: 'official_receipt', label: 'Official Receipt', file: formData.official_receipt },
                      ...(formData.permit_subtype === 'FRANCHISE' ? 
                        [{ name: 'toda_endorsement', label: 'TODA Endorsement', file: formData.toda_endorsement }] : 
                        []
                      ),
                      ...(formData.permit_subtype === 'MTOP' ? 
                        [
                          { name: 'nbi_clearance', label: 'NBI Clearance', file: formData.nbi_clearance },
                          { name: 'police_clearance', label: 'Police Clearance', file: formData.police_clearance },
                          { name: 'medical_certificate', label: 'Medical Certificate', file: formData.medical_certificate }
                        ] : 
                        []
                      )
                    ].map((doc) => (
                      <div key={doc.name} className="flex items-center justify-between p-3 border border-gray-300 rounded-lg">
                        <div className="flex items-center">
                          {doc.file || doc.id ? (
                            <Check className="w-5 h-5 text-green-600 mr-3" />
                          ) : (
                            <X className="w-5 h-5 text-red-600 mr-3" />
                          )}
                          <div>
                            <span className="font-medium">{doc.label}:</span>
                            <p className="text-sm text-gray-600">
                              {doc.file ? doc.file.name : doc.id ? `ID: ${doc.id}` : 'Not provided'}
                            </p>
                          </div>
                        </div>
                        {doc.file && (
                          <button 
                            type="button" 
                            onClick={() => previewFile(doc.file)} 
                            className="flex items-center gap-1 px-3 py-1 text-sm rounded hover:bg-gray-100 transition-colors duration-300" 
                            style={{ color: COLORS.secondary }}
                          >
                            <Eye className="w-4 h-4" />Preview
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h5 className="font-semibold mb-3 text-lg" style={{ color: COLORS.primary }}>
                    Payment Summary
                  </h5>
                  <div className="space-y-4">
                    {[
                      { 
                        name: 'franchise_fee', 
                        label: formData.permit_subtype === 'MTOP' ? 'MTOP Application Fee' : 'Franchise Fee', 
                        checked: formData.franchise_fee_checked 
                      },
                      { 
                        name: 'sticker_id_fee', 
                        label: 'Sticker / ID Fee', 
                        checked: formData.sticker_id_fee_checked 
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
                    
                    {paymentStatus.isPaid && (
                      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center">
                          <Check className="w-6 h-6 text-green-600 mr-3" />
                          <div>
                            <p className="font-semibold text-green-700">
                              ✓ Payment Status: {paymentStatus.isPaid ? 'Paid' : 'Pending'}
                            </p>
                            <p className="text-sm text-green-600 mt-1">
                              Payment Method: {paymentStatus.paymentMethod === 'online' ? 'Online Payment' : 'Receipt Upload'}
                            </p>
                            {paymentStatus.paymentDate && (
                              <p className="text-xs text-green-600 mt-1">
                                Payment Date: {paymentStatus.paymentDate}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <h5 className="font-semibold mb-3 text-lg" style={{ color: COLORS.primary }}>
                    Declaration Summary
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm" style={{ fontFamily: COLORS.font }}>
                    <div className="flex items-center">
                      <span className="font-medium w-48">Applicant's Signature:</span>
                      <span className="flex-1">
                        {formData.applicant_signature ? (
                          <span className="text-green-600 font-medium">✓ Provided</span>
                        ) : (
                          <span className="text-red-600 font-medium">✗ Missing</span>
                        )}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium w-48">Date of Submission:</span>
                      <span className="flex-1">{formData.date_submitted || 'Not set'}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium w-48">Agreement to Declaration:</span>
                      <span className="flex-1">
                        {agreeDeclaration ? (
                          <span className="text-green-600 font-medium">✓ Agreed</span>
                        ) : (
                          <span className="text-red-600 font-medium">✗ Not agreed</span>
                        )}
                      </span>
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
    <div className="mx-1 mt-1 p-6 rounded-lg min-h-screen" style={{ 
      background: COLORS.background, 
      color: COLORS.secondary, 
      fontFamily: COLORS.font 
    }}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-4xl font-bold" style={{ color: COLORS.primary }}>
            FRANCHISE PERMIT APPLICATION
          </h1>
          <p className="mt-2" style={{ color: COLORS.secondary }}>
            Apply for {formData.permit_subtype === 'MTOP' ? 'Motorized Tricycle Operator\'s Permit (MTOP)' : 'Franchise Permit'} for tricycle operation.
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
                <p className="text-sm font-medium" style={{ 
                  color: currentStep >= step.id ? COLORS.success : COLORS.secondary, 
                  fontFamily: COLORS.font 
                }}>
                  {step.title}
                </p>
                <p className="text-xs" style={{ color: COLORS.secondary, fontFamily: COLORS.font }}>
                  {step.description}
                </p>
              </div>
              {index < steps.length - 1 && (
                <div className="hidden md:block w-16 h-0.5 mx-4" style={{ 
                  background: currentStep > step.id ? COLORS.success : '#9CA3AF' 
                }} />
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
              disabled={
                !isStepValid(currentStep) || 
                (formData.permit_subtype === 'FRANCHISE' && !mtopValidation.canProceed)
              } 
              style={{ 
                background: (
                  !isStepValid(currentStep) || 
                  (formData.permit_subtype === 'FRANCHISE' && !mtopValidation.canProceed)
                ) ? '#9CA3AF' : COLORS.success 
              }} 
              onMouseEnter={e => { 
                if (isStepValid(currentStep) && 
                    !(formData.permit_subtype === 'FRANCHISE' && !mtopValidation.canProceed)) {
                  e.currentTarget.style.background = COLORS.accent; 
                }
              }} 
              onMouseLeave={e => { 
                if (isStepValid(currentStep) && 
                    !(formData.permit_subtype === 'FRANCHISE' && !mtopValidation.canProceed)) {
                  e.currentTarget.style.background = COLORS.success; 
                }
              }} 
              className={`px-6 py-3 rounded-lg font-semibold text-white ${
                (!isStepValid(currentStep) || 
                (formData.permit_subtype === 'FRANCHISE' && !mtopValidation.canProceed)) ? 'cursor-not-allowed' : 'transition-colors duration-300'
              }`}
            >
              {currentStep === steps.length - 1 ? 'Review Application' : 'Next'}
            </button>
          ) : (
            <button 
              type="button" 
              onClick={() => setShowConfirmModal(true)} 
              disabled={isSubmitting || !mtopValidation.canProceed} 
              onMouseEnter={e => { 
                if (!isSubmitting && mtopValidation.canProceed) {
                  e.currentTarget.style.background = COLORS.accent; 
                }
              }} 
              onMouseLeave={e => { 
                if (!isSubmitting && mtopValidation.canProceed) {
                  e.currentTarget.style.background = COLORS.success; 
                }
              }} 
              style={{ 
                background: (isSubmitting || !mtopValidation.canProceed) ? 
                '#9CA3AF' : COLORS.success 
              }} 
              className={`px-6 py-3 rounded-lg font-semibold text-white ${
                (isSubmitting || !mtopValidation.canProceed) ? 
                'cursor-not-allowed' : 'transition-colors duration-300'
              }`}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </button>
          )}
        </div>
      </form>
      
      {showPreview.url && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm z-50 p-4">
          <div className="rounded-lg shadow-lg w-full max-w-4xl border border-gray-200 overflow-hidden" style={{ 
            background: 'rgba(255, 255, 255, 0.95)', 
            fontFamily: COLORS.font, 
            backdropFilter: 'blur(10px)', 
            maxHeight: '90vh' 
          }}>
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-xl font-bold" style={{ color: COLORS.primary }}>
                Preview Document
              </h2>
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
                    <img src={showPreview.url} alt="Preview" className="max-w-full h-auto max-h-[500px]" />
                  </div>
                ) : showPreview.type === 'application' && showPreview.name?.includes('.pdf') ? (
                  <iframe src={showPreview.url} className="w-full h-[500px] rounded" title="PDF Preview" />
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
      
      {showConfirmModal && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm z-50 p-4">
          <div className="p-8 rounded-lg shadow-lg w-full max-w-lg border border-gray-200" style={{ 
            background: 'rgba(255, 255, 255, 0.95)', 
            fontFamily: COLORS.font, 
            backdropFilter: 'blur(10px)' 
          }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold" style={{ color: COLORS.primary }}>
                  Confirm Submission
                </h2>
                <p className="text-sm text-gray-600">
                  Review your information before submitting
                </p>
              </div>
            </div>
            
            <div className="mb-6">
              <p className="text-sm mb-3" style={{ color: COLORS.secondary, fontFamily: COLORS.font }}>
                You are about to submit your {formData.permit_subtype === 'MTOP' ? 'Motorized Tricycle Operator\'s Permit (MTOP)' : 'Franchise Permit'} application.
              </p>
              
              {formData.permit_subtype === 'FRANCHISE' && originalMTOPData && (
                <div className="p-4 rounded-lg border mb-4 bg-blue-50 border-blue-200">
                  <div className="flex items-start">
                    <Check className="w-5 h-5 text-blue-600 mr-2 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-blue-700">
                        ✓ Data Auto-filled from MTOP (READ-ONLY)
                      </p>
                      <p className="text-xs mt-1 text-blue-600">
                        Your application has been pre-filled with data from your existing MTOP permit.
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              
              <div className={`p-4 rounded-lg border mb-4 ${
                mtopValidation.canProceed ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
              }`}>
                <div className="flex items-start">
                  <Key className={`w-5 h-5 mr-2 mt-0.5 ${
                    mtopValidation.canProceed ? 'text-green-600' : 'text-red-600'
                  }`} />
                  <div>
                    <p className={`text-sm font-medium ${
                      mtopValidation.canProceed ? 'text-green-700' : 'text-red-700'
                    }`}>
                      {mtopValidation.canProceed ? '✓ Eligibility Check: PASSED' : '✗ Eligibility Check: FAILED'}
                    </p>
                    <p className="text-xs mt-1" style={{ color: COLORS.secondary, fontFamily: COLORS.font }}>
                      {mtopValidation.message}
                    </p>
                    {mtopValidation.permitDetails && (
                      <div className="mt-2 text-xs">
                        <p><strong>Existing Permit ID:</strong> {mtopValidation.permitDetails.application_id}</p>
                        <p><strong>Status:</strong> {mtopValidation.permitDetails.status}</p>
                        <p><strong>Plate Number:</strong> {mtopValidation.permitDetails.plate_number}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg border mb-4">
                <p className="text-sm font-semibold mb-2" style={{ color: COLORS.secondary, fontFamily: COLORS.font }}>
                  Payment Method:
                </p>
                <p className={`font-bold ${formData.payment_method === 'online' ? 'text-blue-600' : 'text-green-600'}`}>
                  {formData.payment_method === 'online' ? 'Online Payment' : 'Receipt Upload'}
                </p>
                <p className="text-sm mt-2" style={{ color: COLORS.secondary, fontFamily: COLORS.font }}>
                  Total Amount: ₱{(
                    (formData.franchise_fee_checked ? FEES.franchise_fee : 0) + 
                    (formData.sticker_id_fee_checked ? FEES.sticker_id_fee : 0) + 
                    (formData.inspection_fee_checked ? FEES.inspection_fee : 0)
                  ).toFixed(2)}
                </p>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg border mb-4">
                <p className="text-sm font-semibold mb-2" style={{ color: COLORS.secondary, fontFamily: COLORS.font }}>
                  Declaration:
                </p>
                <p className="text-sm mb-3" style={{ color: COLORS.secondary, fontFamily: COLORS.font }}>
                  I hereby declare that all information provided is true and correct to the best of my knowledge. I understand that any false information may result in the rejection of my application and possible legal consequences.
                </p>
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="declaration-checkbox" 
                    checked={agreeDeclaration} 
                    onChange={(e) => setAgreeDeclaration(e.target.checked)} 
                    className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500" 
                  />
                  <label htmlFor="declaration-checkbox" className="ml-2 text-sm" style={{ 
                    color: COLORS.secondary, 
                    fontFamily: COLORS.font 
                  }}>
                    I agree to the above declaration *
                  </label>
                </div>
              </div>
              
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mb-4">
                <p className="text-sm font-medium mb-2 text-blue-700">
                  Application Requirements Summary:
                </p>
                <ul className="text-xs space-y-1" style={{ color: COLORS.secondary, fontFamily: COLORS.font }}>
                  {formData.permit_subtype === 'MTOP' ? (
                    <>
                      <li>✓ Must NOT have existing approved MTOP permit</li>
                      <li>✓ No duplicate applications found</li>
                      <li>✓ All required documents uploaded</li>
                      <li>✓ Payment {formData.payment_method === 'online' ? 'to be made online' : 'receipt(s) provided'}</li>
                      <li>✓ Declaration signed</li>
                    </>
                  ) : (
                    <>
                      <li>✓ MUST have existing APPROVED MTOP permit</li>
                      <li>✓ No duplicate applications found</li>
                      <li>✓ Data auto-filled from MTOP</li>
                      <li>✓ TODA endorsement uploaded</li>
                      <li>✓ All required documents uploaded</li>
                      <li>✓ Payment {formData.payment_method === 'online' ? 'to be made online' : 'receipt(s) provided'}</li>
                      <li>✓ Declaration signed</li>
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
                disabled={
                  isSubmitting || 
                  !agreeDeclaration || 
                  (formData.permit_subtype === 'FRANCHISE' && !mtopValidation.canProceed)
                } 
                style={{ 
                  background: (
                    isSubmitting || 
                    !agreeDeclaration || 
                    (formData.permit_subtype === 'FRANCHISE' && !mtopValidation.canProceed)
                  ) ? '#9CA3AF' : COLORS.success 
                }} 
                onMouseEnter={e => { 
                  if (!(
                    isSubmitting || 
                    !agreeDeclaration || 
                    (formData.permit_subtype === 'FRANCHISE' && !mtopValidation.canProceed)
                  )) {
                    e.currentTarget.style.background = COLORS.accent; 
                  }
                }} 
                onMouseLeave={e => { 
                  if (!(
                    isSubmitting || 
                    !agreeDeclaration || 
                    (formData.permit_subtype === 'FRANCHISE' && !mtopValidation.canProceed)
                  )) {
                    e.currentTarget.style.background = COLORS.success; 
                  }
                }} 
                className={`px-6 py-3 rounded-lg font-semibold text-white ${
                  (
                    isSubmitting || 
                    !agreeDeclaration || 
                    (formData.permit_subtype === 'FRANCHISE' && !mtopValidation.canProceed)
                  ) ? 'cursor-not-allowed' : 'transition-colors duration-300'
                }`}
              >
                {isSubmitting ? 'Submitting...' : 'Confirm & Submit'}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {showSuccessModal && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm z-50 p-4">
          <div className="p-8 rounded-lg shadow-lg w-full max-w-lg border border-gray-200" style={{ 
            background: 'rgba(255, 255, 255, 0.95)', 
            fontFamily: COLORS.font, 
            backdropFilter: 'blur(10px)' 
          }}>
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                <Check className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <h2 className="text-xl font-bold text-center mb-4" style={{ color: COLORS.primary }}>
              {modalTitle}
            </h2>
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
      
      {showErrorModal && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm z-50 p-4">
          <div className="p-8 rounded-lg shadow-lg w-full max-w-lg border border-gray-200" style={{ 
            background: 'rgba(255, 255, 255, 0.95)', 
            fontFamily: COLORS.font, 
            backdropFilter: 'blur(10px)' 
          }}>
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
                <X className="w-8 h-8 text-red-600" />
              </div>
            </div>
            <h2 className="text-xl font-bold text-center mb-4" style={{ color: COLORS.danger }}>
              {modalTitle}
            </h2>
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