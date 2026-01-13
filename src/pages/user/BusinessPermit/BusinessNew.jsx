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

const API_BUS = "http://localhost/plms-latest/backend/business_permit";
const NATIONALITIES = [
  "Afghan", "Albanian", "Algerian", "American", "Andorran", "Angolan", "Antiguans", "Argentinean", "Armenian", "Australian", "Austrian", "Azerbaijani", "Bahamian", "Bahraini", "Bangladeshi", "Barbadian", "Barbudans", "Batswana", "Belarusian", "Belgian", "Belizean", "Beninese", "Bhutanese", "Bolivian", "Bosnian", "Brazilian", "British", "Bruneian", "Bulgarian", "Burkinabe", "Burmese", "Burundian", "Cambodian", "Cameroonian", "Canadian", "Cape Verdean", "Central African", "Chadian", "Chilean", "Chinese", "Colombian", "Comoran", "Congolese", "Costa Rican", "Croatian", "Cuban", "Cypriot", "Czech", "Danish", "Djibouti", "Dominican", "Dutch", "East Timorese", "Ecuadorean", "Egyptian", "Emirian", "Equatorial Guinean", "Eritrean", "Estonian", "Ethiopian", "Fijian", "Filipino", "Finnish", "French", "Gabonese", "Gambian", "Georgian", "German", "Ghanaian", "Greek", "Grenadian", "Guatemalan", "Guinea-Bissauan", "Guinean", "Guyanese", "Haitian", "Herzegovinian", "Honduran", "Hungarian", "I-Kiribati", "Icelander", "Indian", "Indonesian", "Iranian", "Iraqi", "Irish", "Israeli", "Italian", "Ivorian", "Jamaican", "Japanese", "Jordanian", "Kazakhstani", "Kenyan", "Kittian and Nevisian", "Kuwaiti", "Kyrgyz", "Laotian", "Latvian", "Lebanese", "Liberian", "Libyan", "Liechtensteiner", "Lithuanian", "Luxembourger", "Macedonian", "Malagasy", "Malawian", "Malaysian", "Maldivan", "Malian", "Maltese", "Marshallese", "Mauritanian", "Mauritian", "Mexican", "Micronesian", "Moldovan", "Monacan", "Mongolian", "Moroccan", "Mosotho", "Motswana", "Mozambican", "Namibian", "Nauruan", "Nepalese", "New Zealander", "Nicaraguan", "Nigerian", "Nigerien", "North Korean", "Northern Irish", "Norwegian", "Omani", "Pakistani", "Palauan", "Palestinian", "Panamanian", "Papua New Guinean", "Paraguayan", "Peruvian", "Polish", "Portuguese", "Qatari", "Romanian", "Russian", "Rwandan", "Saint Lucian", "Salvadoran", "Samoan", "San Marinese", "Sao Tomean", "Saudi", "Scottish", "Senegalese", "Serbian", "Seychellois", "Sierra Leonean", "Singaporean", "Slovakian", "Slovenian", "Solomon Islander", "Somali", "South African", "South Korean", "Spanish", "Sri Lankan", "Sudanese", "Surinamer", "Swazi", "Swedish", "Swiss", "Syrian", "Taiwanese", "Tajik", "Tanzanian", "Thai", "Togolese", "Tongan", "Trinidadian or Tobagonian", "Tunisian", "Turkish", "Tuvaluan", "Ugandan", "Ukrainian", "Uruguayan", "Uzbekistani", "Venezuelan", "Vietnamese", "Welsh", "Yemenite", "Zambian", "Zimbabwean"
];

export default function BusinessNew() {
  const location = useLocation();
  const navigate = useNavigate();
  const permitType = location.state?.permitType || 'NEW';

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

  // State for attachment checkboxes
  const [attachmentChecks, setAttachmentChecks] = useState({
    barangay_clearance: true,
    bir_certificate: true,
    lease_or_title: true,
    fsic: true,
    owner_valid_id: true,
    id_picture: true,
    official_receipt_file: false,
  });

  const [formData, setFormData] = useState({
    permit_type: permitType,
    application_date: new Date().toISOString().split('T')[0],

    // Owner Information
    last_name: "",
    first_name: "",
    middle_name: "",
    owner_type: "",
    citizenship: "",
    corp_filipino_percent: 0,
    corp_foreign_percent: 0,
    date_of_birth: "",
    contact_number: "",
    email_address: "",
    home_address: "",
    valid_id_type: "",
    valid_id_number: "",

    // Business Information
    business_name: "",
    trade_name: "",
    business_nature: "",
    building_type: "",
    capital_investment: 0,

    // Business Address
    house_bldg_no: "",
    building_name: "",
    block_no: "",
    lot_no: "",
    street: "",
    subdivision: "",
    province: "Metro Manila",
    city_municipality: "Caloocan City",
    barangay: "",
    zip_code: "",
    district: "",

    // Operations Details
    zoning_permit_id: "",
    sanitation_permit_id: "",
    business_area: 0,
    total_floor_area: 0,
    operation_time_from: "",
    operation_time_to: "",
    total_employees: 0,
    male_employees: 0,
    female_employees: 0,
    employees_in_qc: 0,
    delivery_van_truck: 0,
    delivery_motorcycle: 0,
    
    // Barangay Clearance ID
    barangay_clearance_id: "",
    
    // Operations & Employment
    no_of_employees: 0,
    operation_type: "",

    // Attachments
    attachments_applicable: false,
    barangay_clearance: null,
    bir_certificate: null,
    lease_or_title: null,
    fsic: null,
    owner_valid_id: null,
    id_picture: null,
    official_receipt_file: null,
    owner_scanned_id: null,
    dti_registration: null,
    sec_registration: null,
    representative_scanned_id: null,

    // Declaration & Approval
    owner_type_declaration: "Business Owner",
    owner_representative_name: "",
    date_submitted: "",
  });

  // Steps array
  const steps = [
    { id: 1, title: 'Owner Information', description: 'Personal details of the business owner' },
    { id: 2, title: 'Business Information', description: 'Details about your business establishment' },
    { id: 3, title: 'Location & Operations', description: 'Business address and operational information' },
    { id: 4, title: 'Attachments', description: 'Upload required documents' },
    { id: 5, title: 'Declaration & Submit', description: 'Finalize and submit your application' },
    { id: 6, title: 'Review Application', description: 'Review your application details' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFile = (e) => {
    const { name, files } = e.target;
    const file = files?.[0] || null;
    setFormData((prev) => ({ ...prev, [name]: file }));
  };

  const handleCheckboxChange = (field) => {
    // Prevent unchecking required documents
    if (['barangay_clearance', 'bir_certificate', 'lease_or_title', 'fsic', 'owner_valid_id', 'id_picture'].includes(field)) {
      return;
    }
    
    setAttachmentChecks(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const previewFile = (file) => {
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      setShowPreview({
        url: fileUrl,
        type: file.type.split('/')[0],
        name: file.name
      });
    }
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
    const isEmpty = (val) => val === undefined || val === null || (typeof val === "string" && val.trim() === "");

    if (step === 1) {
      const missing = [];
      if (isEmpty(formData.first_name)) missing.push("First Name");
      if (isEmpty(formData.last_name)) missing.push("Last Name");
      if (isEmpty(formData.owner_type)) missing.push("Owner Type");
      if (isEmpty(formData.citizenship)) missing.push("Citizenship");

      // Check for Owner Type specific uploads
      if (formData.owner_type === "Individual") {
        if (isEmpty(formData.dti_registration)) missing.push("DTI Registration (Required for Individual)");
      } else if (formData.owner_type === "Partnership") {
        if (isEmpty(formData.sec_registration)) missing.push("SEC Registration (Required for Partnership)");
      }

      if (formData.owner_type === "Corporation") {
        if (isEmpty(formData.corp_filipino_percent)) missing.push("Filipino % (Corporation)");
        if (isEmpty(formData.corp_foreign_percent)) missing.push("Foreign % (Corporation)");
      }

      if (isEmpty(formData.date_of_birth)) missing.push("Date of Birth");
      if (isEmpty(formData.contact_number)) missing.push("Contact Number");
      if (isEmpty(formData.email_address)) missing.push("Email Address");
      if (isEmpty(formData.home_address)) missing.push("Home Address");
      if (isEmpty(formData.valid_id_type)) missing.push("Valid ID Type");
      if (isEmpty(formData.valid_id_number)) missing.push("Valid ID Number");

      if (missing.length) return { ok: false, message: "Missing: " + missing.join(", ") };
      return { ok: true };
    }

    if (step === 2) {
      const missing = [];
      if (isEmpty(formData.business_name)) missing.push("Registered Business Name");
      if (isEmpty(formData.trade_name)) missing.push("Trade / Brand Name");
      if (isEmpty(formData.business_nature)) missing.push("Nature of Business");
      if (isEmpty(formData.building_type)) missing.push("Building Type");
      if (isEmpty(formData.capital_investment)) missing.push("Capital Investment (₱)");

      if (missing.length) return { ok: false, message: "Missing: " + missing.join(", ") };
      return { ok: true };
    }

    if (step === 3) {
      const missing = [];
      if (isEmpty(formData.house_bldg_no)) missing.push("House/Bldg. No");
      if (isEmpty(formData.street)) missing.push("Street");
      if (isEmpty(formData.barangay)) missing.push("Barangay");
      if (isEmpty(formData.zoning_permit_id)) missing.push("Zoning Permit ID");
      if (isEmpty(formData.sanitation_permit_id)) missing.push("Sanitation Permit ID");
      if (isEmpty(formData.operation_type)) missing.push("Type of Operation");
      if (isEmpty(formData.business_area)) missing.push("Business Area");
      if (isEmpty(formData.total_floor_area)) missing.push("Total Floor/Building Area");
      if (isEmpty(formData.operation_time_from)) missing.push("Operation Time From");
      if (isEmpty(formData.operation_time_to)) missing.push("Operation Time To");
      if (isEmpty(formData.total_employees)) missing.push("Total No. of Employees");

      if (missing.length) return { ok: false, message: "Missing: " + missing.join(", ") };
      return { ok: true };
    }

 // In validateStep function, case 4:
if (step === 4) {
  const missing = [];
  
  // Check all mandatory documents
  const mandatoryDocs = [
    { field: 'bir_certificate', label: 'BIR Certificate of Registration' },
    { field: 'lease_or_title', label: 'Lease Contract / Land Title' },
    { field: 'fsic', label: 'Fire Safety Inspection Certificate (FSIC)' },
    { field: 'owner_valid_id', label: 'Owner Valid ID' },
    { field: 'id_picture', label: '2x2 ID Picture' }
  ];

  mandatoryDocs.forEach(doc => {
    if (isEmpty(formData[doc.field])) {
      missing.push(doc.label);
    }
  });

  // Barangay Clearance is required if no ID is provided
  if (isEmpty(formData.barangay_clearance) && isEmpty(formData.barangay_clearance_id)) {
    missing.push("Barangay Clearance (either file or ID must be provided)");
  }

  // Check optional documents if marked as required
  if (attachmentChecks.official_receipt_file && isEmpty(formData.official_receipt_file)) {
    missing.push("Official Receipt of Payment");
  }

  if (missing.length) return { ok: false, message: "Missing required attachments: " + missing.join(", ") };
  return { ok: true };
}

    if (step === 5) {
      const missing = [];
      if (isEmpty(formData.owner_type_declaration)) missing.push("Owner / Representative");
      if (isEmpty(formData.owner_representative_name)) missing.push("Owner / Representative Name");
      if (isEmpty(formData.date_submitted)) missing.push("Date Submitted");

      if (formData.owner_type_declaration === "Representative") {
        if (isEmpty(formData.representative_scanned_id)) missing.push("Representative's Scanned ID");
      }

      if (missing.length) return { ok: false, message: "Missing: " + missing.join(", ") };
      return { ok: true };
    }

    return { ok: true };
  };

  const nextStep = () => {
    const res = validateStep(currentStep);
    if (!res.ok) {
      setSubmitStatus({ type: 'error', message: res.message || 'Please complete required fields for this step.' });
      return;
    }
    setSubmitStatus(null);
    setCurrentStep(s => Math.min(s + 1, steps.length));
  };

  const prevStep = () => setCurrentStep(s => Math.max(s - 1, 1));

const handleSubmit = (e) => {
  e.preventDefault();
  
  // For step 6 (review), show declaration modal
  if (currentStep === 6) {
    const res = validateStep(6);
    if (!res.ok) {
      setSubmitStatus({ type: 'error', message: res.message || 'Please complete required fields for this step.' });
      return;
    }
    setSubmitStatus(null);
    setShowDeclarationModal(true);  // This will show the modal
  } else {
    // For other steps, validate and move to next
    const res = validateStep(currentStep);
    if (!res.ok) {
      setSubmitStatus({ type: 'error', message: res.message || 'Please complete required fields for this step.' });
      return;
    }
    setSubmitStatus(null);
    setCurrentStep(s => Math.min(s + 1, steps.length));
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
    
    // Add all form data to FormData
    Object.keys(formData).forEach((key) => {
      const value = formData[key];
      if (value === null || value === undefined) {
        // Skip null/undefined values
      } else if (value instanceof File) {
        formDataToSend.append(key, value, value.name);
      } else if (value === "") {
        formDataToSend.append(key, "");
      } else {
        formDataToSend.append(key, String(value));
      }
    });

    // Add attachment check status
    Object.keys(attachmentChecks).forEach(key => {
      formDataToSend.append(`attachment_${key}`, attachmentChecks[key] ? '1' : '0');
    });

    console.log('Making request to:', "http://localhost/plms-latest/backend/business_permit/business_permit.php");

    // First, test if we can reach the PHP file
    try {
      const testResponse = await fetch("http://localhost/plms-latest/backend/business_permit/business_permit.php", {
        method: 'OPTIONS',
      });
      console.log('OPTIONS test response:', testResponse.status);
    } catch (testError) {
      console.error('Cannot reach PHP file:', testError);
      throw new Error(`Cannot connect to server. Please make sure:
        1. XAMPP Apache is running (green in control panel)
        2. PHP file exists at: http://localhost/plms-latest/backend/business_permit/business_permit.php
        3. Open the URL above in browser to test`);
    }

    const response = await fetch("http://localhost/plms-latest/backend/business_permit/business_permit.php", {
      method: "POST",
      body: formDataToSend,
      // No need to set headers for FormData - browser sets it automatically
    });

    console.log('Response status:', response.status);

    const raw = await response.text();
    console.log('Raw response:', raw);
    
    // Check if response is empty
    if (!raw.trim()) {
      throw new Error('Server returned an empty response');
    }
    
    let data;
    try {
      data = JSON.parse(raw);
    } catch (parseError) {
      console.error('JSON parse error. Raw response:', raw);
      
      // Check if it's a PHP error
      if (raw.includes('<?php') || raw.includes('Fatal error') || raw.includes('Parse error')) {
        throw new Error('PHP error detected. Server returned PHP code instead of JSON.');
      }
      
      throw new Error('Server returned invalid JSON: ' + parseError.message);
    }

    if (!response.ok || !data.success) {
      throw new Error(data.message || `Submission failed with status: ${response.status}`);
    }

    showSuccessMessage(data.message || "Business permit application submitted successfully!");
    
    setTimeout(() => {
      navigate("/user/permittracker");
    }, 3000);

  } catch (err) {
    console.error("Submission error:", err);
    
    // More specific error messages
    let userMessage = err.message;
    
    if (err.message.includes('Failed to fetch') || err.message.includes('Network error')) {
      userMessage = `Network error. Please check:
        1. XAMPP Control Panel → Start Apache (make it green)
        2. Open browser and go to: http://localhost/
        3. If you see XAMPP dashboard, Apache is running
        4. Then visit: http://localhost/plms-latest/backend/business_permit/business_permit.php
        5. If you see JSON error or PHP code, the file is accessible`;
    }
    
    showErrorMessage(userMessage);
  } finally {
    setIsSubmitting(false);
  }
};

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-2" style={{ color: COLORS.secondary, fontFamily: COLORS.font }}>Owner Information</h3>
              <p className="text-sm text-gray-600 mb-4">{steps[0].description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: COLORS.secondary, fontFamily: COLORS.font }}>
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  placeholder="Enter first name"
                  className="p-3 border border-black rounded-lg w-full"
                  style={{ color: COLORS.secondary, fontFamily: COLORS.font }}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: COLORS.secondary, fontFamily: COLORS.font }}>
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  placeholder="Enter last name"
                  className="p-3 border border-black rounded-lg w-full"
                  style={{ color: COLORS.secondary, fontFamily: COLORS.font }}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: COLORS.secondary, fontFamily: COLORS.font }}>
                  Middle Name
                </label>
                <input
                  type="text"
                  name="middle_name"
                  value={formData.middle_name}
                  onChange={handleChange}
                  placeholder="Middle Name"
                  className="w-full p-3 border border-black rounded-lg"
                  style={{ color: COLORS.secondary, fontFamily: COLORS.font }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: COLORS.secondary, fontFamily: COLORS.font }}>
                  Owner Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="owner_type"
                  value={formData.owner_type}
                  onChange={handleChange}
                  className="p-3 border border-black rounded-lg w-full"
                  style={{ color: COLORS.secondary, fontFamily: COLORS.font }}
                  required
                >
                  <option value="">Select owner type</option>
                  <option value="Individual">Individual</option>
                  <option value="Partnership">Partnership</option>
                  <option value="Corporation">Corporation</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:col-span-2">
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: COLORS.secondary, fontFamily: COLORS.font }}>
                    Citizenship <span className="text-red-500">*</span>
                  </label>
                  <input
                    list="nationalities"
                    name="citizenship"
                    value={formData.citizenship}
                    onChange={handleChange}
                    placeholder="Enter citizenship"
                    className="p-3 border border-black rounded-lg w-full"
                    style={{ color: COLORS.secondary, fontFamily: COLORS.font }}
                    required
                  />
                  <datalist id="nationalities">
                    {NATIONALITIES.map((n) => (
                      <option key={n} value={n} />
                    ))}
                  </datalist>
                </div>

                {formData.owner_type === "Corporation" && (
                  <>
                    <div>
                      <label className="block text-sm font-medium mb-1" style={{ color: COLORS.secondary, fontFamily: COLORS.font }}>
                        Filipino (%) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        name="corp_filipino_percent"
                        value={formData.corp_filipino_percent}
                        onChange={handleChange}
                        placeholder="%"
                        className="p-3 border border-black rounded-lg w-full"
                        style={{ color: COLORS.secondary, fontFamily: COLORS.font }}
                        min="0"
                        max="100"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1" style={{ color: COLORS.secondary, fontFamily: COLORS.font }}>
                        Foreign (%) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        name="corp_foreign_percent"
                        value={formData.corp_foreign_percent}
                        onChange={handleChange}
                        placeholder="%"
                        className="p-3 border border-black rounded-lg w-full"
                        style={{ color: COLORS.secondary, fontFamily: COLORS.font }}
                        min="0"
                        max="100"
                        required
                      />
                    </div>
                  </>
                )}

                {formData.owner_type === "Individual" && (
                  <div className="md:col-span-2">
                    <div className="flex items-center justify-between p-3 border border-gray-300 rounded-lg">
                      <div className="flex items-center">
                        {formData.dti_registration ? (
                          <Check className="w-5 h-5 text-green-600 mr-3" />
                        ) : (
                          <X className="w-5 h-5 text-red-600 mr-3" />
                        )}
                        <div>
                          <span className="font-medium">DTI Registration:</span>
                          <p className="text-sm text-gray-600">
                            {formData.dti_registration ? formData.dti_registration.name : 'Required for Individual'}
                          </p>
                          <p className="text-xs text-red-500">* Required for Individual owner type</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <label className="cursor-pointer">
                          <input
                            type="file"
                            name="dti_registration"
                            onChange={handleFile}
                            accept=".pdf,.jpg,.png,.doc,.docx"
                            className="hidden"
                            required={formData.owner_type === "Individual"}
                          />
                          <div className={`flex items-center gap-1 px-3 py-1 text-sm rounded hover:bg-gray-100 transition-colors duration-300 border ${!formData.dti_registration ? 'border-gray-300' : 'border-green-200 bg-green-50'}`} style={{ color: COLORS.secondary }}>
                            <Upload className="w-4 h-4" />
                            Upload
                          </div>
                        </label>
                        {formData.dti_registration && (
                          <button
                            type="button"
                            onClick={() => previewFile(formData.dti_registration)}
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
                )}

                {formData.owner_type === "Partnership" && (
                  <div className="md:col-span-2">
                    <div className="flex items-center justify-between p-3 border border-gray-300 rounded-lg">
                      <div className="flex items-center">
                        {formData.sec_registration ? (
                          <Check className="w-5 h-5 text-green-600 mr-3" />
                        ) : (
                          <X className="w-5 h-5 text-red-600 mr-3" />
                        )}
                        <div>
                          <span className="font-medium">SEC Registration:</span>
                          <p className="text-sm text-gray-600">
                            {formData.sec_registration ? formData.sec_registration.name : 'Required for Partnership'}
                          </p>
                          <p className="text-xs text-red-500">* Required for Partnership owner type</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <label className="cursor-pointer">
                          <input
                            type="file"
                            name="sec_registration"
                            onChange={handleFile}
                            accept=".pdf,.jpg,.png,.doc,.docx"
                            className="hidden"
                            required={formData.owner_type === "Partnership"}
                          />
                          <div className={`flex items-center gap-1 px-3 py-1 text-sm rounded hover:bg-gray-100 transition-colors duration-300 border ${!formData.sec_registration ? 'border-gray-300' : 'border-green-200 bg-green-50'}`} style={{ color: COLORS.secondary }}>
                            <Upload className="w-4 h-4" />
                            Upload
                          </div>
                        </label>
                        {formData.sec_registration && (
                          <button
                            type="button"
                            onClick={() => previewFile(formData.sec_registration)}
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
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: COLORS.secondary, fontFamily: COLORS.font }}>
                  Date of Birth <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="date_of_birth"
                  value={formData.date_of_birth}
                  onChange={handleChange}
                  className="p-3 border border-black rounded-lg w-full"
                  style={{ color: COLORS.secondary, fontFamily: COLORS.font }}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: COLORS.secondary, fontFamily: COLORS.font }}>
                  Contact Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="contact_number"
                  value={formData.contact_number}
                  placeholder="(e.g. 09123456789)"
                  onChange={handleChange}
                  className="p-3 border border-black rounded-lg w-full"
                  style={{ color: COLORS.secondary, fontFamily: COLORS.font }}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: COLORS.secondary, fontFamily: COLORS.font }}>
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email_address"
                  value={formData.email_address}
                  onChange={handleChange}
                  placeholder="Enter email address"
                  className="p-3 border border-black rounded-lg w-full"
                  style={{ color: COLORS.secondary, fontFamily: COLORS.font }}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: COLORS.secondary, fontFamily: COLORS.font }}>
                  Home Address <span className="text-red-500">*</span>
                </label>
                <input
                  name="home_address"
                  value={formData.home_address}
                  onChange={handleChange}
                  placeholder="Enter home address"
                  className="p-3 border border-black rounded-lg w-full"
                  style={{ color: COLORS.secondary, fontFamily: COLORS.font }}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: COLORS.secondary, fontFamily: COLORS.font }}>
                  Valid ID Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="valid_id_type"
                  value={formData.valid_id_type}
                  onChange={handleChange}
                  className="p-3 border border-black rounded-lg w-full"
                  style={{ color: COLORS.secondary, fontFamily: COLORS.font }}
                  required
                >
                  <option value="">Select Valid ID Type</option>
                  <optgroup label="Primary Valid Government-Issued IDs">
                    <option value="PhilSys ID">Philippine National ID (PhilSys ID)</option>
                    <option value="Driver's License">Driver's License (LTO)</option>
                    <option value="Passport">Passport (DFA)</option>
                    <option value="UMID">UMID</option>
                    <option value="Voter's ID">Voter's ID / COMELEC</option>
                    <option value="Postal ID">Postal ID (PhilPost)</option>
                    <option value="PRC ID">PRC ID</option>
                    <option value="Senior Citizen ID">Senior Citizen ID</option>
                    <option value="PWD ID">PWD ID</option>
                    <option value="Barangay ID">Barangay ID</option>
                  </optgroup>
                  <optgroup label="Secondary / Supporting IDs">
                    <option value="School ID">School ID</option>
                    <option value="Company ID">Company / Employee ID</option>
                    <option value="Police Clearance">Police Clearance / NBI Clearance</option>
                    <option value="TIN ID">Tax Identification Number (TIN) ID</option>
                    <option value="PhilHealth ID">PhilHealth ID</option>
                    <option value="Pag-IBIG ID">Pag-IBIG ID</option>
                    <option value="GSIS eCard">GSIS eCard</option>
                    <option value="Solo Parent ID">Solo Parent ID</option>
                    <option value="IP ID">Indigenous People's (IP) ID</option>
                    <option value="Firearms License ID">Firearms License ID</option>
                  </optgroup>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: COLORS.secondary, fontFamily: COLORS.font }}>
                  Valid ID Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="valid_id_number"
                  value={formData.valid_id_number}
                  onChange={handleChange}
                  placeholder="Enter valid ID number"
                  className="p-3 border border-black rounded-lg w-full"
                  style={{ color: COLORS.secondary, fontFamily: COLORS.font }}
                  required
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-2" style={{ color: COLORS.secondary, fontFamily: COLORS.font }}>
                Business Information
              </h3>
              <p className="text-sm text-gray-600 mb-4">{steps[1].description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: COLORS.secondary, fontFamily: COLORS.font }}>
                  Registered Business Name <span className="text-red-500">*</span>
                </label>
                <input
                  name="business_name"
                  value={formData.business_name}
                  onChange={handleChange}
                  placeholder="Enter registered business name"
                  className="p-3 border border-black rounded-lg w-full"
                  style={{ color: COLORS.secondary, fontFamily: COLORS.font }}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: COLORS.secondary, fontFamily: COLORS.font }}>
                  Trade / Brand Name <span className="text-red-500">*</span>
                </label>
                <input
                  name="trade_name"
                  value={formData.trade_name}
                  onChange={handleChange}
                  placeholder="Enter trade or brand name"
                  className="p-3 border border-black rounded-lg w-full"
                  style={{ color: COLORS.secondary, fontFamily: COLORS.font }}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: COLORS.secondary, fontFamily: COLORS.font }}>
                  Nature of Business <span className="text-red-500">*</span>
                </label>
                <select
                  name="business_nature"
                  value={formData.business_nature}
                  onChange={handleChange}
                  className="p-3 border border-black rounded-lg w-full"
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
                <label className="block text-sm font-medium mb-1" style={{ color: COLORS.secondary, fontFamily: COLORS.font }}>
                  Building Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="building_type"
                  value={formData.building_type}
                  onChange={handleChange}
                  className="p-3 border border-black rounded-lg w-full"
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
                <label className="block text-sm font-medium mb-1" style={{ color: COLORS.secondary, fontFamily: COLORS.font }}>
                  Capital Investment (₱) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="capital_investment"
                  value={formData.capital_investment}
                  onChange={handleChange}
                  placeholder="Enter capital investment amount"
                  className="p-3 border border-black rounded-lg w-full"
                  style={{ color: COLORS.secondary, fontFamily: COLORS.font }}
                  required
                />
              </div>

            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-10">
            <div>
              <h3 className="text-xl font-semibold mb-2" style={{ color: COLORS.secondary, fontFamily: COLORS.font }}>Location & Operations</h3>
              <p className="text-sm text-gray-600 mb-4">{steps[2].description}</p>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4" style={{ color: COLORS.secondary, fontFamily: COLORS.font }}>Business Address</h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 font-medium" style={{ color: COLORS.secondary, fontFamily: COLORS.font }}>
                    House/Bldg. No <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="house_bldg_no"
                    value={formData.house_bldg_no}
                    onChange={handleChange}
                    className="w-full p-3 border border-black rounded-lg"
                    style={{ color: COLORS.secondary, fontFamily: COLORS.font }}
                    placeholder="Enter house or building number"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-2 font-medium" style={{ color: COLORS.secondary, fontFamily: COLORS.font }}>
                    Name of Building
                  </label>
                  <input
                    type="text"
                    name="building_name"
                    value={formData.building_name}
                    onChange={handleChange}
                    className="w-full p-3 border border-black rounded-lg"
                    style={{ color: COLORS.secondary, fontFamily: COLORS.font }}
                    placeholder="Enter building name (if applicable)"
                  />
                </div>

                <div>
                  <label className="block mb-2 font-medium" style={{ color: COLORS.secondary, fontFamily: COLORS.font }}>
                    Block No.
                  </label>
                  <input
                    type="text"
                    name="block_no"
                    value={formData.block_no}
                    onChange={handleChange}
                    className="w-full p-3 border border-black rounded-lg"
                    style={{ color: COLORS.secondary, fontFamily: COLORS.font }}
                    placeholder="Enter block number"
                  />
                </div>

                <div>
                  <label className="block mb-2 font-medium" style={{ color: COLORS.secondary, fontFamily: COLORS.font }}>
                    Lot No.
                  </label>
                  <input
                    type="text"
                    name="lot_no"
                    value={formData.lot_no}
                    onChange={handleChange}
                    className="w-full p-3 border border-black rounded-lg"
                    style={{ color: COLORS.secondary, fontFamily: COLORS.font }}
                    placeholder="Enter lot number"
                  />
                </div>

                <div>
                  <label className="block mb-2 font-medium" style={{ color: COLORS.secondary, fontFamily: COLORS.font }}>
                    Street <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="street"
                    value={formData.street}
                    onChange={handleChange}
                    className="w-full p-3 border border-black rounded-lg"
                    style={{ color: COLORS.secondary, fontFamily: COLORS.font }}
                    placeholder="Enter street name"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-2 font-medium" style={{ color: COLORS.secondary, fontFamily: COLORS.font }}>
                    Subdivision
                  </label>
                  <input
                    type="text"
                    name="subdivision"
                    value={formData.subdivision}
                    onChange={handleChange}
                    className="w-full p-3 border border-black rounded-lg"
                    style={{ color: COLORS.secondary, fontFamily: COLORS.font }}
                    placeholder="Enter subdivision name"
                  />
                </div>

                <div>
                  <label className="block mb-2 font-medium" style={{ color: COLORS.secondary, fontFamily: COLORS.font }}>
                    Province <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="province"
                    value="Metro Manila"
                    readOnly
                    className="w-full p-3 border border-black rounded-lg bg-gray-100"
                    style={{ color: COLORS.secondary, fontFamily: COLORS.font }}
                  />
                  <p className="text-xs text-gray-500 mt-1">Fixed as Metro Manila</p>
                </div>

                <div>
                  <label className="block mb-2 font-medium" style={{ color: COLORS.secondary, fontFamily: COLORS.font }}>
                    City/Municipality <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="city_municipality"
                    value="Caloocan City"
                    readOnly
                    className="w-full p-3 border border-black rounded-lg bg-gray-100"
                    style={{ color: COLORS.secondary, fontFamily: COLORS.font }}
                  />
                  <p className="text-xs text-gray-500 mt-1">Fixed as Caloocan City</p>
                </div>

                <div>
                  <label 
                    className="block text-sm font-medium mb-1" 
                    style={{ color: COLORS.secondary, fontFamily: COLORS.font }}
                  >
                    Barangay <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="barangay"
                    value={formData.barangay}
                    onChange={handleChange}
                    className="p-3 border border-black rounded-lg w-full focus:ring-1 focus:border-black-400 focus:outline-none"
                    style={{ color: COLORS.secondary, fontFamily: COLORS.font }}
                    required
                  >
                    <option value="">Select a barangay</option>
                    
                    {/* Barangay 1 to 175 */}
                    {Array.from({length: 175}, (_, i) => (
                      <option key={`Barangay ${i+1}`} value={`Barangay ${i+1}`}>
                        Barangay {i+1}
                      </option>
                    ))}
                    
                    {/* Barangay 176-A to 176-F */}
                    {['A', 'B', 'C', 'D', 'E', 'F'].map(letter => (
                      <option key={`Barangay 176-${letter}`} value={`Barangay 176-${letter}`}>
                        Barangay 176-{letter}
                      </option>
                    ))}
                    
                    {/* Barangay 177 to 188 */}
                    {Array.from({length: 12}, (_, i) => (
                      <option key={`Barangay ${177 + i}`} value={`Barangay ${177 + i}`}>
                        Barangay {177 + i}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block mb-2 font-medium" style={{ color: COLORS.secondary, fontFamily: COLORS.font }}>
                    Zip Code
                  </label>
                  <input
                    type="text"
                    name="zip_code"
                    value={formData.zip_code}
                    onChange={handleChange}
                    className="w-full p-3 border border-black rounded-lg"
                    style={{ color: COLORS.secondary, fontFamily: COLORS.font }}
                    placeholder="Enter ZIP code"
                    maxLength="4"
                  />
                </div>

                <div>
                  <label className="block mb-2 font-medium" style={{ color: COLORS.secondary, fontFamily: COLORS.font }}>
                    District
                  </label>
                  <select
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                    className="w-full p-3 border border-black rounded-lg"
                    style={{ color: COLORS.secondary, fontFamily: COLORS.font }}
                  >
                    <option value="">Select District</option>
                    <option value="District 1">District 1</option>
                    <option value="District 2">District 2</option>
                    <option value="District 3">District 3</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4" style={{ color: COLORS.secondary, fontFamily: COLORS.font }}>Operations Details</h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 font-medium" style={{ color: COLORS.secondary, fontFamily: COLORS.font }}>
                    Zoning Permit ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="zoning_permit_id"
                    value={formData.zoning_permit_id}
                    onChange={handleChange}
                    className="w-full p-3 border border-black rounded-lg"
                    style={{ color: COLORS.secondary, fontFamily: COLORS.font }}
                    placeholder="Enter zoning permit ID"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-2 font-medium" style={{ color: COLORS.secondary, fontFamily: COLORS.font }}>
                    Sanitation Permit ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="sanitation_permit_id"
                    value={formData.sanitation_permit_id}
                    onChange={handleChange}
                    className="w-full p-3 border border-black rounded-lg"
                    style={{ color: COLORS.secondary, fontFamily: COLORS.font }}
                    placeholder="Enter sanitation permit ID"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-2 font-medium" style={{ color: COLORS.secondary, fontFamily: COLORS.font }}>
                    Type of Operation <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="operation_type"
                    value={formData.operation_type}
                    onChange={handleChange}
                    className="w-full p-3 border border-black rounded-lg"
                    style={{ color: COLORS.secondary, fontFamily: COLORS.font }}
                    required
                  >
                    <option value="">Select Type of Operation</option>
                    <option value="Main Office">Main Office</option>
                    <option value="Branch">Branch</option>
                    <option value="Franchise">Franchise</option>
                    <option value="Headquarters">Headquarters</option>
                    <option value="Satellite Office">Satellite Office</option>
                    <option value="Warehouse">Warehouse</option>
                    <option value="Factory">Factory</option>
                    <option value="Retail Store">Retail Store</option>
                    <option value="Food Establishment">Food Establishment</option>
                    <option value="Service Center">Service Center</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-2 font-medium" style={{ color: COLORS.secondary, fontFamily: COLORS.font }}>
                    Business Area (in sq. m.) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="business_area"
                    value={formData.business_area}
                    onChange={handleChange}
                    className="w-full p-3 border border-black rounded-lg"
                    style={{ color: COLORS.secondary, fontFamily: COLORS.font }}
                    placeholder="Enter business area"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-2 font-medium" style={{ color: COLORS.secondary, fontFamily: COLORS.font }}>
                    Total Floor/Building Area (in sq.m.) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="total_floor_area"
                    value={formData.total_floor_area}
                    onChange={handleChange}
                    className="w-full p-3 border border-black rounded-lg"
                    style={{ color: COLORS.secondary, fontFamily: COLORS.font }}
                    placeholder="Enter total floor area"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block mb-2 font-medium" style={{ color: COLORS.secondary, fontFamily: COLORS.font }}>
                    Time of Operation <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm mb-1">From</label>
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
                      <label className="block text-sm mb-1">To</label>
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

                <div>
                  <label className="block mb-2 font-medium" style={{ color: COLORS.secondary, fontFamily: COLORS.font }}>
                    Total No. of Employees in Establishment <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="total_employees"
                    value={formData.total_employees}
                    onChange={handleChange}
                    className="w-full p-3 border border-black rounded-lg"
                    style={{ color: COLORS.secondary, fontFamily: COLORS.font }}
                    placeholder="Enter total employees"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-2 font-medium" style={{ color: COLORS.secondary, fontFamily: COLORS.font }}>
                    Male Employees
                  </label>
                  <input
                    type="number"
                    name="male_employees"
                    value={formData.male_employees}
                    onChange={handleChange}
                    className="w-full p-3 border border-black rounded-lg"
                    style={{ color: COLORS.secondary, fontFamily: COLORS.font }}
                    placeholder="Enter number of male employees"
                  />
                </div>

                <div>
                  <label className="block mb-2 font-medium" style={{ color: COLORS.secondary, fontFamily: COLORS.font }}>
                    Female Employees
                  </label>
                  <input
                    type="number"
                    name="female_employees"
                    value={formData.female_employees}
                    onChange={handleChange}
                    className="w-full p-3 border border-black rounded-lg"
                    style={{ color: COLORS.secondary, fontFamily: COLORS.font }}
                    placeholder="Enter number of female employees"
                  />
                </div>

                <div>
                  <label className="block mb-2 font-medium" style={{ color: COLORS.secondary, fontFamily: COLORS.font }}>
                    No. of Employees Residing within QC
                  </label>
                  <input
                    type="number"
                    name="employees_in_qc"
                    value={formData.employees_in_qc}
                    onChange={handleChange}
                    className="w-full p-3 border border-black rounded-lg"
                    style={{ color: COLORS.secondary, fontFamily: COLORS.font }}
                    placeholder="Enter number of employees in QC"
                  />
                </div>

                <div className="md:col-span-2">
                  <h5 className="font-medium mb-3" style={{ color: COLORS.secondary, fontFamily: COLORS.font }}>
                    No. of Delivery Vehicle (if applicable)
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm mb-1">Van/Truck</label>
                      <input
                        type="number"
                        name="delivery_van_truck"
                        value={formData.delivery_van_truck}
                        onChange={handleChange}
                        className="w-full p-3 border border-black rounded-lg"
                        style={{ color: COLORS.secondary, fontFamily: COLORS.font }}
                        placeholder="Enter number of vans/trucks"
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-1">Motorcycle</label>
                      <input
                        type="number"
                        name="delivery_motorcycle"
                        value={formData.delivery_motorcycle}
                        onChange={handleChange}
                        className="w-full p-3 border border-black rounded-lg"
                        style={{ color: COLORS.secondary, fontFamily: COLORS.font }}
                        placeholder="Enter number of motorcycles"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            {/* Important Note */}
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start">
                <Check className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-blue-800 mb-1">Important Note:</p>
                  <p className="text-sm text-blue-700">
                    • All documents marked with <span className="font-bold text-red-600">*</span> are <span className="font-bold text-red-600">MANDATORY</span> for business permit applications.
                  </p>
                  <p className="text-sm text-blue-700 mt-1">
                    • Official Receipt of Payment is optional unless you have already paid.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              {/* Barangay Clearance with ID field */}
{/* Barangay Clearance with ID field - file OR ID required */}
<div className="border border-gray-300 rounded-lg bg-blue-50">
  <div className="flex items-center justify-between p-3 border-b">
    <div className="flex items-center">
      <div className="mr-3">
        {(formData.barangay_clearance || formData.barangay_clearance_id) ? (
          <Check className="w-5 h-5 text-green-600" />
        ) : (
          <X className="w-5 h-5 text-red-600" />
        )}
      </div>
      <div>
        <span className="font-medium">Barangay Clearance: <span className="text-red-500">*</span></span>
        <p className="text-sm text-gray-600">
          {formData.barangay_clearance ? formData.barangay_clearance.name : 
           formData.barangay_clearance_id ? 'ID Provided' : 'File or ID required'}
        </p>
        <p className="text-xs text-red-500 font-semibold">
          * Either file upload OR ID number must be provided
        </p>
      </div>
    </div>
    <div className="flex items-center gap-2">
      <label className="cursor-pointer">
        <input
          type="file"
          name="barangay_clearance"
          onChange={handleFile}
          accept=".pdf,.jpg,.png,.doc,.docx"
          className="hidden"
        />
        <div className={`flex items-center gap-1 px-3 py-1 text-sm rounded hover:bg-gray-100 transition-colors duration-300 border ${
          !formData.barangay_clearance ? 'border-gray-300' : 'border-green-200 bg-green-50'
        }`} style={{ color: COLORS.secondary }}>
          <Upload className="w-4 h-4" />
          {formData.barangay_clearance ? 'Change' : 'Upload'}
        </div>
      </label>
      {formData.barangay_clearance && (
        <button
          type="button"
          onClick={() => previewFile(formData.barangay_clearance)}
          className="flex items-center gap-1 px-3 py-1 text-sm rounded hover:bg-gray-100 transition-colors duration-300"
          style={{ color: COLORS.secondary }}
        >
          <Eye className="w-4 h-4" />
          Preview
        </button>
      )}
    </div>
  </div>
  <div className="p-3 bg-gray-50">
    <label className="block text-sm font-medium mb-2" style={{ color: COLORS.secondary, fontFamily: COLORS.font }}>
      Barangay Clearance ID/Number (Alternative to file upload):
    </label>
    <input
      type="text"
      name="barangay_clearance_id"
      value={formData.barangay_clearance_id}
      onChange={handleChange}
      placeholder="Enter Barangay Clearance ID or Reference Number (if no file uploaded)"
      className="w-full p-2 border border-gray-300 rounded"
      style={{ color: COLORS.secondary, fontFamily: COLORS.font }}
    />

    <p className="text-xs mt-1">
      <span className={`font-medium ${
        formData.barangay_clearance || formData.barangay_clearance_id ? 'text-green-600' : 'text-red-600'
      }`}>
        {formData.barangay_clearance || formData.barangay_clearance_id 
          ? '✓ Requirement satisfied (either file or ID provided)' 
          : '⚠ Please provide either the document or ID number'}
      </span>
    </p>
  </div>
</div>

              {/* BIR Certificate of Registration - ALWAYS REQUIRED */}
              <div className="flex items-center justify-between p-3 border border-gray-300 rounded-lg bg-blue-50">
                <div className="flex items-center">
                  <div>
                    <span className="font-medium">BIR Certificate of Registration: <span className="text-red-500">*</span></span>
                    <p className="text-sm text-gray-600">
                      {formData.bir_certificate ? formData.bir_certificate.name : 'Required'}
                    </p>
                    <p className="text-xs text-red-500 font-semibold">* This document is mandatory</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      name="bir_certificate"
                      onChange={handleFile}
                      accept=".pdf,.jpg,.png,.doc,.docx"
                      className="hidden"
                      required
                    />
                    <div className={`flex items-center gap-1 px-3 py-1 text-sm rounded hover:bg-gray-100 transition-colors duration-300 border ${!formData.bir_certificate ? 'border-red-300 bg-red-50' : 'border-green-200 bg-green-50'}`} style={{ color: COLORS.secondary }}>
                      <Upload className="w-4 h-4" />
                      {formData.bir_certificate ? 'Change' : 'Upload'}
                    </div>
                  </label>
                  {formData.bir_certificate && (
                    <button
                      type="button"
                      onClick={() => previewFile(formData.bir_certificate)}
                      className="flex items-center gap-1 px-3 py-1 text-sm rounded hover:bg-gray-100 transition-colors duration-300"
                      style={{ color: COLORS.secondary }}
                    >
                      <Eye className="w-4 h-4" />
                      Preview
                    </button>
                  )}
                </div>
              </div>

              {/* Lease Contract / Land Title */}
              <div className="flex items-center justify-between p-3 border border-gray-300 rounded-lg bg-blue-50">
                <div className="flex items-center">
                  <div>
                    <span className="font-medium">Lease Contract / Land Title: <span className="text-red-500">*</span></span>
                    <p className="text-sm text-gray-600">
                      {formData.lease_or_title ? formData.lease_or_title.name : 'Required'}
                    </p>
                    <p className="text-xs text-red-500 font-semibold">* This document is mandatory</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      name="lease_or_title"
                      onChange={handleFile}
                      accept=".pdf,.jpg,.png,.doc,.docx"
                      className="hidden"
                      required
                    />
                    <div className={`flex items-center gap-1 px-3 py-1 text-sm rounded hover:bg-gray-100 transition-colors duration-300 border ${!formData.lease_or_title ? 'border-red-300 bg-red-50' : 'border-green-200 bg-green-50'}`} style={{ color: COLORS.secondary }}>
                      <Upload className="w-4 h-4" />
                      {formData.lease_or_title ? 'Change' : 'Upload'}
                    </div>
                  </label>
                  {formData.lease_or_title && (
                    <button
                      type="button"
                      onClick={() => previewFile(formData.lease_or_title)}
                      className="flex items-center gap-1 px-3 py-1 text-sm rounded hover:bg-gray-100 transition-colors duration-300"
                      style={{ color: COLORS.secondary }}
                    >
                      <Eye className="w-4 h-4" />
                      Preview
                    </button>
                  )}
                </div>
              </div>

              {/* Fire Safety Inspection Certificate (FSIC) */}
              <div className="flex items-center justify-between p-3 border border-gray-300 rounded-lg bg-blue-50">
                <div className="flex items-center">
                  <div>
                    <span className="font-medium">Fire Safety Inspection Certificate (FSIC): <span className="text-red-500">*</span></span>
                    <p className="text-sm text-gray-600">
                      {formData.fsic ? formData.fsic.name : 'Required'}
                    </p>
                    <p className="text-xs text-red-500 font-semibold">* This document is mandatory</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      name="fsic"
                      onChange={handleFile}
                      accept=".pdf,.jpg,.png,.doc,.docx"
                      className="hidden"
                      required
                    />
                    <div className={`flex items-center gap-1 px-3 py-1 text-sm rounded hover:bg-gray-100 transition-colors duration-300 border ${!formData.fsic ? 'border-red-300 bg-red-50' : 'border-green-200 bg-green-50'}`} style={{ color: COLORS.secondary }}>
                      <Upload className="w-4 h-4" />
                      {formData.fsic ? 'Change' : 'Upload'}
                    </div>
                  </label>
                  {formData.fsic && (
                    <button
                      type="button"
                      onClick={() => previewFile(formData.fsic)}
                      className="flex items-center gap-1 px-3 py-1 text-sm rounded hover:bg-gray-100 transition-colors duration-300"
                      style={{ color: COLORS.secondary }}
                    >
                      <Eye className="w-4 h-4" />
                      Preview
                    </button>
                  )}
                </div>
              </div>

              {/* Owner Valid ID */}
              <div className="flex items-center justify-between p-3 border border-gray-300 rounded-lg bg-blue-50">
                <div className="flex items-center">
                  <div>
                    <span className="font-medium">Owner Valid ID: <span className="text-red-500">*</span></span>
                    <p className="text-sm text-gray-600">
                      {formData.owner_valid_id ? formData.owner_valid_id.name : 'Required'}
                    </p>
                    <p className="text-xs text-red-500 font-semibold">* This document is mandatory</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      name="owner_valid_id"
                      onChange={handleFile}
                      accept=".pdf,.jpg,.png,.doc,.docx"
                      className="hidden"
                      required
                    />
                    <div className={`flex items-center gap-1 px-3 py-1 text-sm rounded hover:bg-gray-100 transition-colors duration-300 border ${!formData.owner_valid_id ? 'border-red-300 bg-red-50' : 'border-green-200 bg-green-50'}`} style={{ color: COLORS.secondary }}>
                      <Upload className="w-4 h-4" />
                      {formData.owner_valid_id ? 'Change' : 'Upload'}
                    </div>
                  </label>
                  {formData.owner_valid_id && (
                    <button
                      type="button"
                      onClick={() => previewFile(formData.owner_valid_id)}
                      className="flex items-center gap-1 px-3 py-1 text-sm rounded hover:bg-gray-100 transition-colors duration-300"
                      style={{ color: COLORS.secondary }}
                    >
                      <Eye className="w-4 h-4" />
                      Preview
                    </button>
                  )}
                </div>
              </div>

              {/* 2x2 ID Picture */}
              <div className="flex items-center justify-between p-3 border border-gray-300 rounded-lg bg-blue-50">
                <div className="flex items-center">
                  <div>
                    <span className="font-medium">2x2 ID Picture: <span className="text-red-500">*</span></span>
                    <p className="text-sm text-gray-600">
                      {formData.id_picture ? formData.id_picture.name : 'Required'}
                    </p>
                    <p className="text-xs text-red-500 font-semibold">* This document is mandatory</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      name="id_picture"
                      onChange={handleFile}
                      accept=".jpg,.jpeg,.png"
                      className="hidden"
                      required
                    />
                    <div className={`flex items-center gap-1 px-3 py-1 text-sm rounded hover:bg-gray-100 transition-colors duration-300 border ${!formData.id_picture ? 'border-red-300 bg-red-50' : 'border-green-200 bg-green-50'}`} style={{ color: COLORS.secondary }}>
                      <Upload className="w-4 h-4" />
                      {formData.id_picture ? 'Change' : 'Upload'}
                    </div>
                  </label>
                  {formData.id_picture && (
                    <button
                      type="button"
                      onClick={() => previewFile(formData.id_picture)}
                      className="flex items-center gap-1 px-3 py-1 text-sm rounded hover:bg-gray-100 transition-colors duration-300"
                      style={{ color: COLORS.secondary }}
                    >
                      <Eye className="w-4 h-4" />
                      Preview
                    </button>
                  )}
                </div>
              </div>

              {/* Official Receipt of Payment */}
              <div className="flex items-center justify-between p-3 border border-gray-300 rounded-lg">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={attachmentChecks.official_receipt_file}
                    onChange={() => handleCheckboxChange('official_receipt_file')}
                    className="mr-3 h-5 w-5"
                  />
                  <div>
                    <span className="font-medium">Official Receipt of Payment:</span>
                    <p className="text-sm text-gray-600">
                      {formData.official_receipt_file ? formData.official_receipt_file.name : attachmentChecks.official_receipt_file ? 'Required' : 'Optional'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      name="official_receipt_file"
                      onChange={handleFile}
                      accept=".pdf,.jpg,.png,.doc,.docx"
                      className="hidden"
                    />
                    <div className={`flex items-center gap-1 px-3 py-1 text-sm rounded hover:bg-gray-100 transition-colors duration-300 border ${!formData.official_receipt_file ? 'border-gray-300' : 'border-green-200 bg-green-50'}`} style={{ color: COLORS.secondary }}>
                      <Upload className="w-4 h-4" />
                      {formData.official_receipt_file ? 'Change' : 'Upload'}
                    </div>
                  </label>
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
        );

      case 5:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-2" style={{ color: COLORS.secondary, fontFamily: COLORS.font }}>
                Declaration & Submission
              </h3>
              <p className="text-sm text-gray-600 mb-4">{steps[4].description}</p>
            </div>

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
                </div>

                {formData.owner_type_declaration === "Representative" && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between p-3 border border-gray-300 rounded-lg">
                      <div className="flex items-center">
                        {formData.representative_scanned_id ? (
                          <Check className="w-5 h-5 text-green-600 mr-3" />
                        ) : (
                          <X className="w-5 h-5 text-red-600 mr-3" />
                        )}
                        <div>
                          <span className="font-medium">Scanned ID of Representative:</span>
                          <p className="text-sm text-gray-600">
                            {formData.representative_scanned_id ? formData.representative_scanned_id.name : 'Required'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <label className="cursor-pointer">
                          <input
                            type="file"
                            name="representative_scanned_id"
                            onChange={handleFile}
                            accept=".jpg,.jpeg,.png,.pdf"
                            className="hidden"
                          />
                          <div className={`flex items-center gap-1 px-3 py-1 text-sm rounded hover:bg-gray-100 transition-colors duration-300 border ${!formData.representative_scanned_id ? 'border-gray-300' : 'border-green-200 bg-green-50'}`} style={{ color: COLORS.secondary }}>
                            <Upload className="w-4 h-4" />
                            {formData.representative_scanned_id ? 'Change' : 'Upload'}
                          </div>
                        </label>
                        {formData.representative_scanned_id && (
                          <button
                            type="button"
                            onClick={() => previewFile(formData.representative_scanned_id)}
                            className="flex items-center gap-1 px-3 py-1 text-sm rounded hover:bg-gray-100 transition-colors duration-300"
                            style={{ color: COLORS.secondary }}
                          >
                            <Eye className="w-4 h-4" />
                            Preview
                          </button>
                        )}
                      </div>
                    </div>
                    <p className="text-sm mt-1" style={{ color: COLORS.danger, fontFamily: COLORS.font }}>Required for representatives only</p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: COLORS.secondary, fontFamily: COLORS.font }}>
                  Date Submitted: <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="date_submitted"
                  value={formData.date_submitted}
                  onChange={handleChange}
                  className="p-3 border border-black rounded-lg w-full"
                  style={{ color: COLORS.secondary, fontFamily: COLORS.font }}
                  required
                />
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-2" style={{ color: COLORS.secondary, fontFamily: COLORS.font }}>
                Review Your Application
              </h3>
              <p className="text-sm text-gray-600 mb-4">{steps[5].description}</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6 border border-black">
              <div className="space-y-8">
                <div>
                  <h5 className="font-semibold mb-4 text-lg border-b pb-2" style={{ color: COLORS.primary, fontFamily: COLORS.font }}>
                    Owner Information
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="font-medium" style={{ color: COLORS.secondary }}>First Name:</span>
                      <p>{formData.first_name || 'Not provided'}</p>
                    </div>
                    <div>
                      <span className="font-medium" style={{ color: COLORS.secondary }}>Middle Name:</span>
                      <p>{formData.middle_name || 'Not provided'}</p>
                    </div>
                    <div>
                      <span className="font-medium" style={{ color: COLORS.secondary }}>Last Name:</span>
                      <p>{formData.last_name || 'Not provided'}</p>
                    </div>
                    <div>
                      <span className="font-medium" style={{ color: COLORS.secondary }}>Owner Type:</span>
                      <p>{formData.owner_type || 'Not provided'}</p>
                    </div>
                    <div>
                      <span className="font-medium" style={{ color: COLORS.secondary }}>Citizenship:</span>
                      <p>{formData.citizenship || 'Not provided'}</p>
                    </div>
                    {formData.owner_type === "Corporation" && (
                      <>
                        <div>
                          <span className="font-medium" style={{ color: COLORS.secondary }}>Filipino %:</span>
                          <p>{formData.corp_filipino_percent || '0'}%</p>
                        </div>
                        <div>
                          <span className="font-medium" style={{ color: COLORS.secondary }}>Foreign %:</span>
                          <p>{formData.corp_foreign_percent || '0'}%</p>
                        </div>
                      </>
                    )}
                    <div>
                      <span className="font-medium" style={{ color: COLORS.secondary }}>Date of Birth:</span>
                      <p>{formData.date_of_birth || 'Not provided'}</p>
                    </div>
                    <div>
                      <span className="font-medium" style={{ color: COLORS.secondary }}>Contact Number:</span>
                      <p>{formData.contact_number || 'Not provided'}</p>
                    </div>
                    <div>
                      <span className="font-medium" style={{ color: COLORS.secondary }}>Email Address:</span>
                      <p>{formData.email_address || 'Not provided'}</p>
                    </div>
                    <div>
                      <span className="font-medium" style={{ color: COLORS.secondary }}>Home Address:</span>
                      <p>{formData.home_address || 'Not provided'}</p>
                    </div>
                    <div>
                      <span className="font-medium" style={{ color: COLORS.secondary }}>Valid ID Type:</span>
                      <p>{formData.valid_id_type || 'Not provided'}</p>
                    </div>
                    <div>
                      <span className="font-medium" style={{ color: COLORS.secondary }}>Valid ID Number:</span>
                      <p>{formData.valid_id_number || 'Not provided'}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h5 className="font-semibold mb-4 text-lg border-b pb-2" style={{ color: COLORS.primary, fontFamily: COLORS.font }}>
                    Business Information
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="font-medium" style={{ color: COLORS.secondary }}>Business Name:</span>
                      <p>{formData.business_name || 'Not provided'}</p>
                    </div>
                    <div>
                      <span className="font-medium" style={{ color: COLORS.secondary }}>Trade Name:</span>
                      <p>{formData.trade_name || 'Not provided'}</p>
                    </div>
                    <div>
                      <span className="font-medium" style={{ color: COLORS.secondary }}>Nature of Business:</span>
                      <p>{formData.business_nature || 'Not provided'}</p>
                    </div>
                    <div>
                      <span className="font-medium" style={{ color: COLORS.secondary }}>Building Type:</span>
                      <p>{formData.building_type || 'Not provided'}</p>
                    </div>
                    <div>
                      <span className="font-medium" style={{ color: COLORS.secondary }}>Capital Investment:</span>
                      <p>₱{formData.capital_investment || '0'}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h5 className="font-semibold mb-4 text-lg border-b pb-2" style={{ color: COLORS.primary, fontFamily: COLORS.font }}>
                    Location Information
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="font-medium" style={{ color: COLORS.secondary }}>House/Bldg. No:</span>
                      <p>{formData.house_bldg_no || 'Not provided'}</p>
                    </div>
                    <div>
                      <span className="font-medium" style={{ color: COLORS.secondary }}>Building Name:</span>
                      <p>{formData.building_name || 'Not provided'}</p>
                    </div>
                    <div>
                      <span className="font-medium" style={{ color: COLORS.secondary }}>Block No:</span>
                      <p>{formData.block_no || 'Not provided'}</p>
                    </div>
                    <div>
                      <span className="font-medium" style={{ color: COLORS.secondary }}>Lot No:</span>
                      <p>{formData.lot_no || 'Not provided'}</p>
                    </div>
                    <div>
                      <span className="font-medium" style={{ color: COLORS.secondary }}>Street:</span>
                      <p>{formData.street || 'Not provided'}</p>
                    </div>
                    <div>
                      <span className="font-medium" style={{ color: COLORS.secondary }}>Subdivision:</span>
                      <p>{formData.subdivision || 'Not provided'}</p>
                    </div>
                    <div>
                      <span className="font-medium" style={{ color: COLORS.secondary }}>Province:</span>
                      <p>{formData.province || 'Metro Manila'}</p>
                    </div>
                    <div>
                      <span className="font-medium" style={{ color: COLORS.secondary }}>City/Municipality:</span>
                      <p>{formData.city_municipality || 'Caloocan City'}</p>
                    </div>
                    <div>
                      <span className="font-medium" style={{ color: COLORS.secondary }}>Barangay:</span>
                      <p>{formData.barangay || 'Not provided'}</p>
                    </div>
                    <div>
                      <span className="font-medium" style={{ color: COLORS.secondary }}>Zip Code:</span>
                      <p>{formData.zip_code || 'Not provided'}</p>
                    </div>
                    <div>
                      <span className="font-medium" style={{ color: COLORS.secondary }}>District:</span>
                      <p>{formData.district || 'Not provided'}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h5 className="font-semibold mb-4 text-lg border-b pb-2" style={{ color: COLORS.primary, fontFamily: COLORS.font }}>
                    Operations Details
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="font-medium" style={{ color: COLORS.secondary }}>Zoning Permit ID:</span>
                      <p>{formData.zoning_permit_id || 'Not provided'}</p>
                    </div>
                    <div>
                      <span className="font-medium" style={{ color: COLORS.secondary }}>Sanitation Permit ID:</span>
                      <p>{formData.sanitation_permit_id || 'Not provided'}</p>
                    </div>
                    <div>
                      <span className="font-medium" style={{ color: COLORS.secondary }}>Type of Operation:</span>
                      <p>{formData.operation_type || 'Not provided'}</p>
                    </div>
                    <div>
                      <span className="font-medium" style={{ color: COLORS.secondary }}>Business Area:</span>
                      <p>{formData.business_area || '0'} sq. m.</p>
                    </div>
                    <div>
                      <span className="font-medium" style={{ color: COLORS.secondary }}>Total Floor Area:</span>
                      <p>{formData.total_floor_area || '0'} sq. m.</p>
                    </div>
                    <div>
                      <span className="font-medium" style={{ color: COLORS.secondary }}>Time of Operation:</span>
                      <p>{formData.operation_time_from && formData.operation_time_to ? 
                        `${formData.operation_time_from} to ${formData.operation_time_to}` : 
                        'Not provided'}</p>
                    </div>
                    <div>
                      <span className="font-medium" style={{ color: COLORS.secondary }}>Total Employees:</span>
                      <p>{formData.total_employees || '0'}</p>
                    </div>
                    <div>
                      <span className="font-medium" style={{ color: COLORS.secondary }}>Male Employees:</span>
                      <p>{formData.male_employees || '0'}</p>
                    </div>
                    <div>
                      <span className="font-medium" style={{ color: COLORS.secondary }}>Female Employees:</span>
                      <p>{formData.female_employees || '0'}</p>
                    </div>
                    <div>
                      <span className="font-medium" style={{ color: COLORS.secondary }}>Employees in QC:</span>
                      <p>{formData.employees_in_qc || '0'}</p>
                    </div>
                    <div>
                      <span className="font-medium" style={{ color: COLORS.secondary }}>Delivery Van/Truck:</span>
                      <p>{formData.delivery_van_truck || '0'}</p>
                    </div>
                    <div>
                      <span className="font-medium" style={{ color: COLORS.secondary }}>Delivery Motorcycle:</span>
                      <p>{formData.delivery_motorcycle || '0'}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h5 className="font-semibold mb-4 text-lg border-b pb-2" style={{ color: COLORS.primary, fontFamily: COLORS.font }}>
                    Permits & Clearances
                  </h5>
{/* In case 6, review section */}
<div className="flex items-center justify-between p-3 border border-gray-300 rounded-lg">
  <div className="flex items-center">
    {(formData.barangay_clearance || formData.barangay_clearance_id) ? (
      <Check className="w-5 h-5 text-green-600 mr-3" />
    ) : (
      <X className="w-5 h-5 text-red-600 mr-3" />
    )}
    <div>
      <span className="font-medium">Barangay Clearance:</span>
      <p className="text-sm text-gray-600">
        {formData.barangay_clearance 
          ? formData.barangay_clearance.name 
          : formData.barangay_clearance_id 
            ? `ID: ${formData.barangay_clearance_id}` 
            : 'Missing'}
      </p>
      <p className="text-xs text-gray-500">
        {!formData.barangay_clearance && !formData.barangay_clearance_id 
          ? 'Either file or ID required' 
          : formData.barangay_clearance_id ? 'ID provided instead of file' : ''}
      </p>
    </div>
  </div>
  {formData.barangay_clearance && (
    <button
      type="button"
      onClick={() => previewFile(formData.barangay_clearance)}
      className="flex items-center gap-1 px-3 py-1 text-sm rounded hover:bg-gray-100 transition-colors duration-300"
      style={{ color: COLORS.secondary }}
    >
      <Eye className="w-4 h-4" />
      Preview
    </button>
  )}
</div>
                </div>

                <div>
                  <h5 className="font-semibold mb-4 text-lg border-b pb-2" style={{ color: COLORS.primary, fontFamily: COLORS.font }}>
                    Attachments
                  </h5>
                  <div className="space-y-3">
                    {/* Owner Type Specific Documents */}
                    {formData.owner_type === "Individual" && formData.dti_registration && (
                      <div className="flex items-center justify-between p-3 border border-gray-300 rounded-lg">
                        <div className="flex items-center">
                          <Check className="w-5 h-5 text-green-600 mr-3" />
                          <div>
                            <span className="font-medium">DTI Registration:</span>
                            <p className="text-sm text-gray-600">{formData.dti_registration.name}</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => previewFile(formData.dti_registration)}
                          className="flex items-center gap-1 px-3 py-1 text-sm rounded hover:bg-gray-100 transition-colors duration-300"
                          style={{ color: COLORS.secondary }}
                        >
                          <Eye className="w-4 h-4" />
                          Preview
                        </button>
                      </div>
                    )}

                    {formData.owner_type === "Partnership" && formData.sec_registration && (
                      <div className="flex items-center justify-between p-3 border border-gray-300 rounded-lg">
                        <div className="flex items-center">
                          <Check className="w-5 h-5 text-green-600 mr-3" />
                          <div>
                            <span className="font-medium">SEC Registration:</span>
                            <p className="text-sm text-gray-600">{formData.sec_registration.name}</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => previewFile(formData.sec_registration)}
                          className="flex items-center gap-1 px-3 py-1 text-sm rounded hover:bg-gray-100 transition-colors duration-300"
                          style={{ color: COLORS.secondary }}
                        >
                          <Eye className="w-4 h-4" />
                          Preview
                        </button>
                      </div>
                    )}

                    {/* All mandatory documents */}
                    {[
                      { field: 'barangay_clearance', label: 'Barangay Clearance' },
                      { field: 'bir_certificate', label: 'BIR Certificate of Registration' },
                      { field: 'lease_or_title', label: 'Lease Contract / Land Title' },
                      { field: 'fsic', label: 'Fire Safety Inspection Certificate (FSIC)' },
                      { field: 'owner_valid_id', label: 'Owner Valid ID' },
                      { field: 'id_picture', label: '2x2 ID Picture' }
                    ].map(doc => (
                      formData[doc.field] && (
                        <div key={doc.field} className="flex items-center justify-between p-3 border border-gray-300 rounded-lg">
                          <div className="flex items-center">
                            <Check className="w-5 h-5 text-green-600 mr-3" />
                            <div>
                              <span className="font-medium">{doc.label}:</span>
                              <p className="text-sm text-gray-600">{formData[doc.field].name}</p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => previewFile(formData[doc.field])}
                            className="flex items-center gap-1 px-3 py-1 text-sm rounded hover:bg-gray-100 transition-colors duration-300"
                            style={{ color: COLORS.secondary }}
                          >
                            <Eye className="w-4 h-4" />
                            Preview
                          </button>
                        </div>
                      )
                    ))}

                    {/* Optional documents if uploaded */}
                    {formData.official_receipt_file && (
                      <div className="flex items-center justify-between p-3 border border-gray-300 rounded-lg">
                        <div className="flex items-center">
                          <Check className="w-5 h-5 text-green-600 mr-3" />
                          <div>
                            <span className="font-medium">Official Receipt of Payment:</span>
                            <p className="text-sm text-gray-600">{formData.official_receipt_file.name}</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => previewFile(formData.official_receipt_file)}
                          className="flex items-center gap-1 px-3 py-1 text-sm rounded hover:bg-gray-100 transition-colors duration-300"
                          style={{ color: COLORS.secondary }}
                        >
                          <Eye className="w-4 h-4" />
                          Preview
                        </button>
                      </div>
                    )}

                    {/* Representative Scanned ID if applicable */}
                    {formData.owner_type_declaration === "Representative" && formData.representative_scanned_id && (
                      <div className="flex items-center justify-between p-3 border border-gray-300 rounded-lg">
                        <div className="flex items-center">
                          <Check className="w-5 h-5 text-green-600 mr-3" />
                          <div>
                            <span className="font-medium">Representative's Scanned ID:</span>
                            <p className="text-sm text-gray-600">{formData.representative_scanned_id.name}</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => previewFile(formData.representative_scanned_id)}
                          className="flex items-center gap-1 px-3 py-1 text-sm rounded hover:bg-gray-100 transition-colors duration-300"
                          style={{ color: COLORS.secondary }}
                        >
                          <Eye className="w-4 h-4" />
                          Preview
                        </button>
                      </div>
                    )}

                    {/* Missing documents warning */}
                    {!formData.barangay_clearance && !formData.barangay_clearance_id && (
                      <div className="p-3 border border-red-300 rounded-lg bg-red-50">
                        <div className="flex items-center">
                          <X className="w-5 h-5 text-red-600 mr-3" />
                          <span className="font-medium text-red-600">Missing: Barangay Clearance or ID</span>
                        </div>
                      </div>
                    )}

                    {!formData.bir_certificate && (
                      <div className="p-3 border border-red-300 rounded-lg bg-red-50">
                        <div className="flex items-center">
                          <X className="w-5 h-5 text-red-600 mr-3" />
                          <span className="font-medium text-red-600">Missing: BIR Certificate of Registration</span>
                        </div>
                      </div>
                    )}

                    {!formData.lease_or_title && (
                      <div className="p-3 border border-red-300 rounded-lg bg-red-50">
                        <div className="flex items-center">
                          <X className="w-5 h-5 text-red-600 mr-3" />
                          <span className="font-medium text-red-600">Missing: Lease Contract / Land Title</span>
                        </div>
                      </div>
                    )}

                    {!formData.fsic && (
                      <div className="p-3 border border-red-300 rounded-lg bg-red-50">
                        <div className="flex items-center">
                          <X className="w-5 h-5 text-red-600 mr-3" />
                          <span className="font-medium text-red-600">Missing: Fire Safety Inspection Certificate (FSIC)</span>
                        </div>
                      </div>
                    )}

                    {!formData.owner_valid_id && (
                      <div className="p-3 border border-red-300 rounded-lg bg-red-50">
                        <div className="flex items-center">
                          <X className="w-5 h-5 text-red-600 mr-3" />
                          <span className="font-medium text-red-600">Missing: Owner Valid ID</span>
                        </div>
                      </div>
                    )}

                    {!formData.id_picture && (
                      <div className="p-3 border border-red-300 rounded-lg bg-red-50">
                        <div className="flex items-center">
                          <X className="w-5 h-5 text-red-600 mr-3" />
                          <span className="font-medium text-red-600">Missing: 2x2 ID Picture</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h5 className="font-semibold mb-4 text-lg border-b pb-2" style={{ color: COLORS.primary, fontFamily: COLORS.font }}>
                    Declaration
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="font-medium" style={{ color: COLORS.secondary }}>Submitted by:</span>
                      <p>{formData.owner_type_declaration || 'Not provided'}</p>
                    </div>
                    <div>
                      <span className="font-medium" style={{ color: COLORS.secondary }}>Name:</span>
                      <p>{formData.owner_representative_name || 'Not provided'}</p>
                    </div>
                    <div>
                      <span className="font-medium" style={{ color: COLORS.secondary }}>Date Submitted:</span>
                      <p>{formData.date_submitted || 'Not provided'}</p>
                    </div>
                    <div>
                      <span className="font-medium" style={{ color: COLORS.secondary }}>Application Date:</span>
                      <p>{formData.application_date || 'Not provided'}</p>
                    </div>
                    <div>
                      <span className="font-medium" style={{ color: COLORS.secondary }}>Permit Type:</span>
                      <p>{formData.permit_type || 'Not provided'}</p>
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
          <h1 className="text-2xl md:text-4xl font-bold" style={{ color: COLORS.primary, fontFamily: COLORS.font }}>Business Permit Application</h1>
          <p className="mt-2" style={{ color: COLORS.secondary, fontFamily: COLORS.font }}>Permit Type: <span className="font-semibold" style={{ color: COLORS.success }}>{permitType}</span></p>
        </div>
        <div className="flex justify-end">
          <button
            onClick={() => navigate('/user/business/type')}
            className="px-4 py-2 rounded-lg font-semibold text-white hover:bg-[#FDA811] transition-colors duration-300"
            style={{ background: COLORS.success, fontFamily: COLORS.font }}
            onMouseEnter={e => e.currentTarget.style.background = COLORS.accent}
            onMouseLeave={e => e.currentTarget.style.background = COLORS.success}
          >
            Change Type
          </button>
        </div>
      </div>

      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-2" style={{ 
                background: currentStep >= step.id ? COLORS.success : 'transparent', 
                borderColor: currentStep >= step.id ? COLORS.success : '#9CA3AF', 
                color: currentStep >= step.id ? '#fff' : '#9CA3AF',
                fontFamily: COLORS.font
              }}>{step.id}</div>
              <div className="ml-3 hidden md:block">
                <p className="text-sm font-medium" style={{ 
                  color: currentStep >= step.id ? COLORS.success : COLORS.secondary,
                  fontFamily: COLORS.font
                }}>{step.title}</p>
                <p className="text-xs text-gray-500">{step.description}</p>
              </div>
              {index < steps.length - 1 && <div className="hidden md:block w-16 h-0.5 mx-4" style={{ background: currentStep > step.id ? COLORS.success : '#9CA3AF' }} />}
            </div>
          ))}
        </div>
      </div>

      {submitStatus && <div className="p-4 mb-6 rounded" style={{ 
        background: submitStatus.type === 'success' ? '#e6f9ed' : '#fdecea', 
        color: submitStatus.type === 'success' ? COLORS.success : COLORS.danger,
        fontFamily: COLORS.font,
        border: '1px solid ' + (submitStatus.type === 'success' ? COLORS.success : COLORS.danger)
      }}>{submitStatus.message}</div>}

      <form onSubmit={handleSubmit} className="space-y-8">
        {renderStepContent()}

{/* In the form buttons section */}
<div className="flex justify-between pt-6">
  {currentStep > 1 && (
    <button 
      type="button" 
      onClick={prevStep}
      className="px-6 py-3 rounded-lg font-semibold text-white hover:bg-[#FDA811] transition-colors duration-300" 
      style={{ 
        background: COLORS.success, 
        fontFamily: COLORS.font
      }}
      onMouseEnter={e => e.currentTarget.style.background = COLORS.accent}
      onMouseLeave={e => e.currentTarget.style.background = COLORS.success}
    >
      Previous
    </button>
  )}
  
  {currentStep < steps.length ? (
    <button 
      type="submit"
      className="px-6 py-3 rounded-lg font-semibold text-white hover:bg-[#FDA811] transition-colors duration-300" 
      style={{ 
        background: COLORS.success, 
        fontFamily: COLORS.font
      }}
      onMouseEnter={e => e.currentTarget.style.background = COLORS.accent}
      onMouseLeave={e => e.currentTarget.style.background = COLORS.success}
    >
      {currentStep === steps.length - 1 ? 'Review' : 'Next'}
    </button>
  ) : (
    <button 
      type="button" 
      onClick={handleSubmit}  // Changed from setCurrentStep(6)
      className="px-6 py-3 rounded-lg font-semibold text-white hover:bg-[#FDA811] transition-colors duration-300" 
      style={{ 
        background: COLORS.success, 
        fontFamily: COLORS.font
      }}
      onMouseEnter={e => e.currentTarget.style.background = COLORS.accent}
      onMouseLeave={e => e.currentTarget.style.background = COLORS.success}
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
            <h2 className="text-xl font-bold mb-6" style={{ color: COLORS.primary }}>Declaration & Submission</h2>
            
            <div className="mb-6">
              <div className="p-4 bg-gray-50 rounded-lg border mb-4">
                <p className="text-sm font-semibold mb-2" style={{ color: COLORS.secondary, fontFamily: COLORS.font }}>Declaration:</p>
                <p className="text-sm mb-3" style={{ color: COLORS.secondary, fontFamily: COLORS.font }}>
                  I hereby declare that all information provided in this business permit application is true and correct to the best of my knowledge. I understand that any false information may result in the rejection of my application and possible legal consequences.
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
                By submitting this application, you confirm that all information provided is accurate and complete.
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
                {isSubmitting ? 'Submitting...' : 'Submit Application'}
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
              
              <button
                onClick={() => setShowErrorModal(false)}
                style={{ background: COLORS.success }}
                onMouseEnter={e => e.currentTarget.style.background = COLORS.accent}
                onMouseLeave={e => e.currentTarget.style.background = COLORS.success}
                className="px-6 py-2 rounded-lg font-semibold text-white transition-colors duration-300"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}