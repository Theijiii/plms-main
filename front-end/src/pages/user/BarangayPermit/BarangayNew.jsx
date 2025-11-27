import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Upload } from "lucide-react";

const COLORS = {
  primary: '#4CAF50',
  secondary: '#4A90E2',
  accent: '#FDA811',
  background: '#FBFBFB',
  font: 'Segoe UI, Arial, Helvetica Neue, sans-serif'
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
  const [submitStatus, setSubmitStatus] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [formData, setFormData] = useState({
    // Step 1: Permit Information
    permit_type: permitType,
    application_date: new Date().toISOString().split('T')[0],
    // Step 2: Applicant Information
    first_name: '',
    middle_initial: '',
    last_name: '',
    suffix: '',
    contact_number: '',
    email: '',
    birth_date: '',
    gender: '',
    civil_status: '',
    nationality: '',
    // Step 3: Address Information
    house_no: '',
    street: '',
    barangay: '',
    city_municipality: '',
    province: '',
    zip_code: '',
    // Step 4: Clearance Details
    purpose: '',
    duration: '',
    id_type: '',
    id_number: '',
    // Step 5: Business Details & Requirements
    business_name: '',
    business_address: '',
    nature_of_business: '',
    business_registration_number: '',
    // Requirements files
    valid_id_file: null,
    proof_of_residence_file: null,
    receipt_file: null,
    signature_file: null,
    photo_fingerprint_file: null,
    // Step 6: Review
    attachments: [],
  });

  const steps = [
    { id: 1, title: 'Applicant Information', description: 'Personal details' },
    { id: 2, title: 'Address Information', description: 'Where you live' },
    { id: 3, title: 'Clearance Details', description: 'Purpose, ID, Duration' },
    { id: 4, title: 'Business & Requirements', description: 'Business info and documents' },
    { id: 5, title: 'Review', description: 'View your permit before submitting' }
  ];

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    
    if (type === 'file') {
      setFormData(prev => ({
        ...prev,
        [name]: files[0] || null
      }));
    } else if (name === "contact_number") {
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

  // validation errors per field
  const [errors, setErrors] = useState({});

  const validateStep = (step) => {
    const newErrors = {};
    if (step === 1) {
      if (!formData.first_name || formData.first_name.trim() === '') newErrors.first_name = 'First name is required';
      if (!formData.last_name || formData.last_name.trim() === '') newErrors.last_name = 'Last name is required';
      if (!formData.contact_number || formData.contact_number.trim() === '') newErrors.contact_number = 'Contact number is required';
      if (!formData.birth_date) newErrors.birth_date = 'Birth date is required';
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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // pure check (no side-effects) used for disabling buttons
  const isStepValid = (step) => {
    if (step === 1) {
      if (!formData.first_name || formData.first_name.trim() === '') return false;
      if (!formData.last_name || formData.last_name.trim() === '') return false;
      if (!formData.contact_number || formData.contact_number.trim() === '') return false;
      if (!formData.birth_date) return false;
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

  const handleFinalStep = (e) => {
    e.preventDefault();
    const ok = validateStep(currentStep);
    if (ok) {
      setShowConfirm(true);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (currentStep < steps.length) {
      nextStep();
    } else {
      handleFinalStep(e);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const step1Ok = validateStep(1);
    const step2Ok = validateStep(2);
    const step3Ok = validateStep(3);
    if (!(step1Ok && step2Ok && step3Ok)) {
      setIsSubmitting(false);
      if (!step1Ok) setCurrentStep(1);
      else if (!step2Ok) setCurrentStep(2);
      else setCurrentStep(3);
      return;
    }

    const formDataObj = new FormData();
    Object.keys(formData).forEach(key => {
      if (key === 'attachments') {
        formData.attachments.forEach(file => {
          formDataObj.append('attachments', file);
        });
      } else if (formData[key] instanceof File) {
        formDataObj.append(key, formData[key]);
      } else {
        formDataObj.append(key, formData[key]);
      }
    });

    try {
      const response = await fetch('/back-end/api/barangay_permit.php', {
        method: 'POST',
        body: formDataObj,
        credentials: 'include'
      });

      console.log('Response status:', response.status);
      const data = await response.json();

      if (data.success) {
        setSubmitStatus({ type: 'success', message: data.message });
        setTimeout(() => {
          navigate('/user/dashboard');
        }, 2000);
      } else {
        setSubmitStatus({ type: 'error', message: data.message || 'Failed to submit application' });
      }
    } catch (error) {
      console.error('Submission error:', error);
      setSubmitStatus({ type: 'error', message: 'Network error: ' + error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold mb-4">Applicant Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} placeholder="First Name *" className={`p-3 border border-black rounded-lg ${errors.first_name ? 'border-red-500' : ''}`} />
              {errors.first_name && <p className="text-red-600 text-sm">{errors.first_name}</p>}
              <input type="text" name="middle_initial" value={formData.middle_initial} onChange={handleChange} placeholder="Middle Initial" className="p-3 border border-black rounded-lg" />
              <input type="text" name="last_name" value={formData.last_name} onChange={handleChange} placeholder="Last Name *" className={`p-3 border border-black rounded-lg ${errors.last_name ? 'border-red-500' : ''}`} />
              {errors.last_name && <p className="text-red-600 text-sm">{errors.last_name}</p>}
              <input type="text" name="suffix" value={formData.suffix} onChange={handleChange} placeholder="Suffix" className="p-3 border border-black rounded-lg" />
              <input type="text" name="contact_number" value={formData.contact_number} onChange={handleChange} placeholder="Contact Number *" className={`p-3 border border-black rounded-lg ${errors.contact_number ? 'border-red-500' : ''}`} />
              {errors.contact_number && <p className="text-red-600 text-sm">{errors.contact_number}</p>}
              <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" className="p-3 border border-black rounded-lg" />
              <input type="date" name="birth_date" value={formData.birth_date} onChange={handleChange} placeholder="Birth Date *" className={`p-3 border border-black rounded-lg ${errors.birth_date ? 'border-red-500' : ''}`} />
              {errors.birth_date && <p className="text-red-600 text-sm">{errors.birth_date}</p>}
              <select name="gender" value={formData.gender} onChange={handleChange} className={`p-3 border border-black rounded-lg ${errors.gender ? 'border-red-500' : ''}`} >
                <option value="">Gender *</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              {errors.gender && <p className="text-red-600 text-sm">{errors.gender}</p>}
              <select name="civil_status" value={formData.civil_status} onChange={handleChange} className={`p-3 border border-black rounded-lg ${errors.civil_status ? 'border-red-500' : ''}`} >
                <option value="">Civil Status *</option>
                <option value="Single">Single</option>
                <option value="Married">Married</option>
                <option value="Widowed">Widowed</option>
                <option value="Separated">Separated</option>
              </select>
              {errors.civil_status && <p className="text-red-600 text-sm">{errors.civil_status}</p>}
              <select name="nationality" value={formData.nationality} onChange={handleChange} className={`p-3 border border-black rounded-lg ${errors.nationality ? 'border-red-500' : ''}`} >
                <option value="">Nationality *</option>
                {NATIONALITIES.map(nat => (
                  <option key={nat} value={nat}>{nat}</option>
                ))}
              </select>
              {errors.nationality && <p className="text-red-600 text-sm">{errors.nationality}</p>}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold mb-4">Address Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" name="house_no" value={formData.house_no} onChange={handleChange} placeholder="House/Building No. *" className={`p-3 border border-black rounded-lg ${errors.house_no ? 'border-red-500' : ''}`} />
              {errors.house_no && <p className="text-red-600 text-sm">{errors.house_no}</p>}
              <input type="text" name="street" value={formData.street} onChange={handleChange} placeholder="Street *" className={`p-3 border border-black rounded-lg ${errors.street ? 'border-red-500' : ''}`} />
              {errors.street && <p className="text-red-600 text-sm">{errors.street}</p>}
              <input type="text" name="barangay" value={formData.barangay} onChange={handleChange} placeholder="Barangay *" className={`p-3 border border-black rounded-lg ${errors.barangay ? 'border-red-500' : ''}`} />
              {errors.barangay && <p className="text-red-600 text-sm">{errors.barangay}</p>}
              <input type="text" name="city_municipality" value={formData.city_municipality} onChange={handleChange} placeholder="City/Municipality *" className={`p-3 border border-black rounded-lg ${errors.city_municipality ? 'border-red-500' : ''}`} />
              {errors.city_municipality && <p className="text-red-600 text-sm">{errors.city_municipality}</p>}
              <input type="text" name="province" value={formData.province} onChange={handleChange} placeholder="Province *" className={`p-3 border border-black rounded-lg ${errors.province ? 'border-red-500' : ''}`} />
              {errors.province && <p className="text-red-600 text-sm">{errors.province}</p>}
              <input type="text" name="zip_code" value={formData.zip_code} onChange={handleChange} placeholder="ZIP Code" className="p-3 border border-black rounded-lg" />
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold mb-4">Clearance Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select name="purpose" value={formData.purpose} onChange={handleChange} className={`p-3 border border-black rounded-lg ${errors.purpose ? 'border-red-500' : ''}`} >
                <option value="">Purpose of Clearance *</option>
                <optgroup label="Personal Purposes">
                  <option value="For personal identification">For personal identification</option>
                  <option value="For residency verification">For residency verification</option>
                  <option value="For school requirement">For school requirement</option>
                  <option value="For scholarship application">For scholarship application</option>
                  <option value="For government assistance">For government assistance (e.g., DSWD, QC social services)</option>
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
                  <option value="For utility connection">For utility connection (e.g., Meralco, Manila Water, Maynilad)</option>
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
                  <option value="For loan application">For loan application (bank or lending company)</option>
                  <option value="For SSS / Pag-IBIG / PhilHealth registration">For SSS / Pag-IBIG / PhilHealth registration</option>
                </optgroup>
              </select>
              {errors.purpose && <p className="text-red-600 text-sm">{errors.purpose}</p>}
              <input
                type="date"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                placeholder="Duration / Period of Validity *"
                className={`p-3 border border-black rounded-lg ${errors.duration ? 'border-red-500' : ''}`}
                min="1900-01-01"
                max="2100-12-31"
                required
              />
              <select name="id_type" value={formData.id_type} onChange={handleChange} className={`p-3 border border-black rounded-lg ${errors.id_type ? 'border-red-500' : ''}`} >
                <option value="">Valid ID Type *</option>
                <optgroup label="Primary Valid Government-Issued IDs">
                  <option value="Philippine National ID (PhilSys ID)">Philippine National ID (PhilSys ID)</option>
                  <option value="Driver's License (LTO)">Driver's License (issued by LTO)</option>
                  <option value="Passport (DFA)">Passport (DFA)</option>
                  <option value="UMID">UMID (Unified Multi-Purpose ID) – SSS, GSIS, PhilHealth, Pag-IBIG</option>
                  <option value="Voter's ID or COMELEC Voter's Certificate">Voter's ID or COMELEC Voter's Certificate</option>
                  <option value="Postal ID (PhilPost)">Postal ID (PhilPost)</option>
                  <option value="PRC ID">PRC ID (Professional Regulation Commission)</option>
                  <option value="Senior Citizen ID">Senior Citizen ID</option>
                  <option value="PWD ID">PWD ID (Persons with Disability ID)</option>
                  <option value="Barangay ID">Barangay ID (if already issued in your barangay)</option>
                </optgroup>
                <optgroup label="Secondary / Supporting IDs">
                  <option value="School ID">School ID (for students, usually with current enrollment certificate)</option>
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
              {errors.id_type && <p className="text-red-600 text-sm">{errors.id_type}</p>}
              <input type="text" name="id_number" value={formData.id_number} onChange={handleChange} placeholder="Valid ID Number *" className={`p-3 border border-black rounded-lg ${errors.id_number ? 'border-red-500' : ''}`} />
              {errors.id_number && <p className="text-red-600 text-sm">{errors.id_number}</p>}
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold mb-4">Business Details & Requirements</h3>
            
            {/* Business Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <input type="text" name="business_name" value={formData.business_name} onChange={handleChange} placeholder="Business Name" className="p-3 border border-black rounded-lg" />
              <input type="text" name="business_address" value={formData.business_address} onChange={handleChange} placeholder="Business Address" className="p-3 border border-black rounded-lg" />
              <input type="text" name="nature_of_business" value={formData.nature_of_business} onChange={handleChange} placeholder="Nature of Business or Trade" className="p-3 border border-black rounded-lg" />
              <input type="text" name="business_registration_number" value={formData.business_registration_number} onChange={handleChange} placeholder="DTI/SEC/Business Registration Number" className="p-3 border border-black rounded-lg" />
            </div>

            {/* Requirements Upload */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Required Documents</h4>
              
              {/* Valid ID */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  Valid ID (Government-issued, school, company ID) *
                </label>
                <div className="flex items-center gap-3 p-3 border border-black rounded w-full bg-white">
                  <Upload className="w-5 h-5 text-gray-500" />
                  <input
                    type="file"
                    name="valid_id_file"
                    onChange={handleChange}
                    className="w-full text-sm text-gray-700 file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-sm file:font-medium file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                  />
                </div>
              </div>

              {/* Proof of Residence */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  Proof of Residence (Utility bill, barangay certificate) *
                </label>
                <div className="flex items-center gap-3 p-3 border border-black rounded w-full bg-white">
                  <Upload className="w-5 h-5 text-gray-500" />
                  <input
                    type="file"
                    name="proof_of_residence_file"
                    onChange={handleChange}
                    className="w-full text-sm text-gray-700 file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-sm file:font-medium file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                  />
                </div>
              </div>

              {/* Official Receipt */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  Official Receipt or Proof of Payment *
                </label>
                <div className="flex items-center gap-3 p-3 border border-black rounded w-full bg-white">
                  <Upload className="w-5 h-5 text-gray-500" />
                  <input
                    type="file"
                    name="receipt_file"
                    onChange={handleChange}
                    className="w-full text-sm text-gray-700 file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-sm file:font-medium file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                  />
                </div>
              </div>

              {/* Applicant's Signature */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  Applicant's Signature *
                </label>
                <div className="flex items-center gap-3 p-3 border border-black rounded w-full bg-white">
                  <Upload className="w-5 h-5 text-gray-500" />
                  <input
                    type="file"
                    name="signature_file"
                    onChange={handleChange}
                    className="w-full text-sm text-gray-700 file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-sm file:font-medium file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                  />
                </div>
              </div>

              {/* Photo and Fingerprint */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  Photo and Fingerprint (if required)
                </label>
                <div className="flex items-center gap-3 p-3 border border-black rounded w-full bg-white">
                  <Upload className="w-5 h-5 text-gray-500" />
                  <input
                    type="file"
                    name="photo_fingerprint_file"
                    onChange={handleChange}
                    className="w-full text-sm text-gray-700 file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-sm file:font-medium file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                  />
                </div>
              </div>
            </div>
          </div>
        );
      case 5:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold mb-4">Review Your Application</h3>
            <div className="bg-white rounded-lg shadow p-4 border border-black">
              <h4 className="font-bold mb-2">Applicant Information</h4>
              <p><strong>First Name:</strong> {formData.first_name}</p>
              <p><strong>Middle Initial:</strong> {formData.middle_initial}</p>
              <p><strong>Last Name:</strong> {formData.last_name}</p>
              <p><strong>Suffix:</strong> {formData.suffix}</p>
              <p><strong>Contact Number:</strong> {formData.contact_number}</p>
              <p><strong>Email:</strong> {formData.email}</p>
              <p><strong>Birth Date:</strong> {formData.birth_date}</p>
              <p><strong>Gender:</strong> {formData.gender}</p>
              <p><strong>Civil Status:</strong> {formData.civil_status}</p>
              <p><strong>Nationality:</strong> {formData.nationality}</p>
              
              <h4 className="font-bold mt-4 mb-2">Address Information</h4>
              <p><strong>House/Building No.:</strong> {formData.house_no}</p>
              <p><strong>Street:</strong> {formData.street}</p>
              <p><strong>Barangay:</strong> {formData.barangay}</p>
              <p><strong>City/Municipality:</strong> {formData.city_municipality}</p>
              <p><strong>Province:</strong> {formData.province}</p>
              <p><strong>ZIP Code:</strong> {formData.zip_code}</p>
              
              <h4 className="font-bold mt-4 mb-2">Clearance Details</h4>
              <p><strong>Purpose:</strong> {formData.purpose}</p>
              <p><strong>ID Type:</strong> {formData.id_type}</p>
              <p><strong>ID Number:</strong> {formData.id_number}</p>
              
              <h4 className="font-bold mt-4 mb-2">Business Details</h4>
              <p><strong>Business Name:</strong> {formData.business_name || 'N/A'}</p>
              <p><strong>Business Address:</strong> {formData.business_address || 'N/A'}</p>
              <p><strong>Nature of Business:</strong> {formData.nature_of_business || 'N/A'}</p>
              <p><strong>Registration Number:</strong> {formData.business_registration_number || 'N/A'}</p>
              
              <h4 className="font-bold mt-4 mb-2">Uploaded Documents</h4>
              <ul>
                {formData.valid_id_file && <li>Valid ID: {formData.valid_id_file.name}</li>}
                {formData.proof_of_residence_file && <li>Proof of Residence: {formData.proof_of_residence_file.name}</li>}
                {formData.receipt_file && <li>Receipt: {formData.receipt_file.name}</li>}
                {formData.signature_file && <li>Signature: {formData.signature_file.name}</li>}
                {formData.photo_fingerprint_file && <li>Photo & Fingerprint: {formData.photo_fingerprint_file.name}</li>}
                {!formData.valid_id_file && !formData.proof_of_residence_file && !formData.receipt_file && !formData.signature_file && !formData.photo_fingerprint_file && (
                  <li>No files uploaded</li>
                )}
              </ul>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="mx-1 mt-1 p-6 rounded-lg min-h-screen font-sans" style={{ background: COLORS.background, color: COLORS.secondary, fontFamily: COLORS.font }}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-4xl font-bold" style={{ color: COLORS.primary }}>Barangay Clearance Application</h1>
          <p className="mt-2" style={{ color: COLORS.secondary }}>
            Application Date: <span className="font-semibold" style={{ color: COLORS.primary }}>{formData.application_date}</span>
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => navigate('/user/dashboard')}
            style={{ background: COLORS.secondary, color: '#fff' }}
            className="px-4 py-2 rounded-lg transition-colors hover:bg-[#FDA811]"
          >
            Back to Dashboard
          </button>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2`} style={{ background: currentStep >= step.id ? COLORS.primary : 'transparent', borderColor: currentStep >= step.id ? COLORS.primary : COLORS.secondary, color: currentStep >= step.id ? '#fff' : COLORS.secondary }}>
                {step.id}
              </div>
              <div className="ml-3 hidden md:block">
                <p className={`text-sm font-medium`} style={{ color: currentStep >= step.id ? COLORS.primary : COLORS.secondary }}>
                  {step.title}
                </p>
                <p className="text-xs" style={{ color: COLORS.secondary }}>{step.description}</p>
              </div>
              {index < steps.length - 1 && (
                <div className={`hidden md:block w-16 h-0.5 mx-4`} style={{ background: currentStep > step.id ? COLORS.primary : COLORS.secondary }} />
              )}
            </div>
          ))}
        </div>
      </div>

      {submitStatus && (
        <div className={`p-4 mb-6 rounded ${
          submitStatus.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
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
              style={{ background: COLORS.secondary, color: '#fff' }}
              className="px-6 py-3 rounded-lg font-semibold hover:bg-[#FDA811] transition-colors"
            >
              Previous
            </button>
          )}

          {currentStep < steps.length ? (
            <button
              type="button"
              onClick={nextStep}
              disabled={!isStepValid(currentStep)}
              style={{ background: !isStepValid(currentStep) ? COLORS.secondary : COLORS.primary, color: '#fff' }}
              className={`px-6 py-3 rounded-lg font-semibold ${!isStepValid(currentStep) ? 'cursor-not-allowed' : 'hover:bg-[#FDA811] transition-colors'}`}
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting || !(isStepValid(1) && isStepValid(2) && isStepValid(3))}
              style={{ background: (isSubmitting || !(isStepValid(1) && isStepValid(2) && isStepValid(3))) ? COLORS.secondary : COLORS.accent, color: '#fff' }}
              className={`px-6 py-3 rounded-lg font-semibold ${(isSubmitting || !(isStepValid(1) && isStepValid(2) && isStepValid(3))) ? 'cursor-not-allowed' : 'hover:bg-[#FDA811] transition-colors'}`}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </button>
          )}
        </div>
      </form>

      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="p-8 rounded-lg shadow-lg w-full max-w-md" style={{ background: COLORS.background }}>
            <h2 className="text-xl font-bold mb-4" style={{ color: COLORS.primary }}>Confirm Submission</h2>
            <p className="mb-6" style={{ color: COLORS.secondary }}>Are you sure you want to submit your Barangay Clearance application?</p>
            <div className="flex justify-end gap-4">
              <button
                className="px-6 py-2 rounded-lg font-semibold transition-colors"
                style={{ background: COLORS.secondary, color: '#fff' }}
                onClick={() => setShowConfirm(false)}
              >
                Cancel
              </button>
              <button
                className="px-6 py-2 rounded-lg font-semibold transition-colors"
                style={{ background: COLORS.accent, color: '#fff' }}
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}