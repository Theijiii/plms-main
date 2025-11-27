import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// Nationalities dropdown
const NATIONALITIES = [
  "Afghan", "Albanian", "Algerian", "American", "Andorran", "Angolan", "Antiguans", "Argentinean", "Armenian", "Australian", "Austrian", "Azerbaijani", "Bahamian", "Bahraini", "Bangladeshi", "Barbadian", "Barbudans", "Batswana", "Belarusian", "Belgian", "Belizean", "Beninese", "Bhutanese", "Bolivian", "Bosnian", "Brazilian", "British", "Bruneian", "Bulgarian", "Burkinabe", "Burmese", "Burundian", "Cambodian", "Cameroonian", "Canadian", "Cape Verdean", "Central African", "Chadian", "Chilean", "Chinese", "Colombian", "Comoran", "Congolese", "Costa Rican", "Croatian", "Cuban", "Cypriot", "Czech", "Danish", "Djibouti", "Dominican", "Dutch", "East Timorese", "Ecuadorean", "Egyptian", "Emirian", "Equatorial Guinean", "Eritrean", "Estonian", "Ethiopian", "Fijian", "Filipino", "Finnish", "French", "Gabonese", "Gambian", "Georgian", "German", "Ghanaian", "Greek", "Grenadian", "Guatemalan", "Guinea-Bissauan", "Guinean", "Guyanese", "Haitian", "Herzegovinian", "Honduran", "Hungarian", "I-Kiribati", "Icelander", "Indian", "Indonesian", "Iranian", "Iraqi", "Irish", "Israeli", "Italian", "Ivorian", "Jamaican", "Japanese", "Jordanian", "Kazakhstani", "Kenyan", "Kittian and Nevisian", "Kuwaiti", "Kyrgyz", "Laotian", "Latvian", "Lebanese", "Liberian", "Libyan", "Liechtensteiner", "Lithuanian", "Luxembourger", "Macedonian", "Malagasy", "Malawian", "Malaysian", "Maldivan", "Malian", "Maltese", "Marshallese", "Mauritanian", "Mauritian", "Mexican", "Micronesian", "Moldovan", "Monacan", "Mongolian", "Moroccan", "Mosotho", "Motswana", "Mozambican", "Namibian", "Nauruan", "Nepalese", "New Zealander", "Nicaraguan", "Nigerian", "Nigerien", "North Korean", "Northern Irish", "Norwegian", "Omani", "Pakistani", "Palauan", "Palestinian", "Panamanian", "Papua New Guinean", "Paraguayan", "Peruvian", "Polish", "Portuguese", "Qatari", "Romanian", "Russian", "Rwandan", "Saint Lucian", "Salvadoran", "Samoan", "San Marinese", "Sao Tomean", "Saudi", "Scottish", "Senegalese", "Serbian", "Seychellois", "Sierra Leonean", "Singaporean", "Slovakian", "Slovenian", "Solomon Islander", "Somali", "South African", "South Korean", "Spanish", "Sri Lankan", "Sudanese", "Surinamer", "Swazi", "Swedish", "Swiss", "Syrian", "Taiwanese", "Tajik", "Tanzanian", "Thai", "Togolese", "Tongan", "Trinidadian or Tobagonian", "Tunisian", "Turkish", "Tuvaluan", "Ugandan", "Ukrainian", "Uruguayan", "Uzbekistani", "Venezuelan", "Vietnamese", "Welsh", "Yemenite", "Zambian", "Zimbabwean"
];

export default function FranchiseNew() {
  const location = useLocation();
  const navigate = useNavigate();
  const permitType = location.state?.permitType || 'NEW';
  
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  
  const [formData, setFormData] = useState({
    // I. Applicant Information
    full_name: '',
    home_address: '',
    contact_number: '',
    email: '',
    citizenship: '',
    birth_date: '',
    id_type: '',
    id_number: '',
    proof_of_residency: null,

    // II. Tricycle / Unit Information
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

    // III. Route / Operation Information
    route_zone: '',
    toda_name: '',
    toda_president_cert: null,
    barangay_of_operation: '',

    // IV. Required Clearances & Attachments
    barangay_clearance: null,
    toda_endorsement: null,
    lto_or_cr: null,
    insurance_certificate: null,
    drivers_license: null,
    emission_test: null,
    id_picture: null,
    official_receipt: null,
    attachments: [],
    
    // Checked flags for showing upload inputs
    barangay_clearance_checked: false,
    toda_endorsement_checked: false,
    lto_or_cr_checked: false,
    insurance_certificate_checked: false,
    drivers_license_checked: false,
    emission_test_checked: false,
    tricycle_body_number_picture_checked: false,
    id_picture_checked: false,
    proof_of_residency_checked: false,
    affidavit_of_ownership_checked: false,
    police_clearance_checked: false,
    official_receipt_checked: false,

    // V. Payment & Validity
    franchise_fee_checked: false,
    sticker_id_fee_checked: false,
    inspection_fee_checked: false,
    franchise_fee_or: '',
    sticker_id_fee_or: '',
    inspection_fee_or: '',
    franchise_fee_receipt: null,
    sticker_id_fee_receipt: null,
    inspection_fee_receipt: null,

    // VI. Declaration
    applicant_signature: '',
    date_submitted: '',
    barangay_captain_signature: '',
    remarks: ''
  });

  // File-like fields that should be appended as files in FormData
  const FILE_FIELDS = [
    'proof_of_residency',
    'lto_or_cr',
    'insurance_certificate',
    'drivers_license',
    'emission_test',
    'id_picture',
    'official_receipt',
    'affidavit_of_ownership',
    'police_clearance',
    'tricycle_body_number_picture',
    'toda_president_cert',
    'toda_endorsement',
    'barangay_clearance',
    'franchise_fee_receipt',
    'sticker_id_fee_receipt',
    'inspection_fee_receipt'
  ];

  // Modal state
  const [showModal, setShowModal] = useState(false);

  const steps = [
    { id: 1, title: 'Applicant Information', description: 'Personal details' },
    { id: 2, title: 'Tricycle / Unit Information', description: 'Vehicle details' },
    { id: 3, title: 'Route / Operation Information', description: 'Route and TODA details' },
    { id: 4, title: 'Required Clearances & Attachments', description: 'Upload required documents' },
    { id: 5, title: 'Payment & Validity', description: 'Fees and validity period' },
    { id: 6, title: 'Declaration', description: 'Sign and submit' }
  ];

  const barangaysCaloocan = [
    "Bagong Barrio", "Grace Park East", "Grace Park West", "Barangay 28", "Barangay 35", 
    "Barangay 63", "Barangay 71", "Barangay 75", "Barangay 120", "Barangay 122", 
    "Barangay 126", "Barangay 129", "Barangay 132", "Barangay 134", "Barangay 136", 
    "Barangay 143", "Barangay 146", "Barangay 148", "Barangay 151", "Barangay 155", 
    "Barangay 160", "Barangay 162", "Barangay 164", "Barangay 167", "Barangay 171", 
    "Barangay 172", "Barangay 175", "Barangay 176", "Barangay 177", "Barangay 178", 
    "Barangay 179", "Barangay 180", "Barangay 181", "Barangay 182", "Barangay 183", 
    "Barangay 184", "Barangay 185", "Barangay 186", "Barangay 187", "Barangay 188", 
    "Deparo", "Bagumbong", "Tala", "Camarin", "Bagong Silang", "Pangarap Village"
  ];

  const TODA_NAMES = [
    "Bagong Barrio TODA", "Grace Park TODA", "Camarin TODA", "Barangay 120 TODA", 
    "Barangay 177 TODA", "Barangay 178 TODA", "Barangay 188 TODA", "Tala TODA", 
    "Deparo TODA", "Bagumbong TODA", "Phase 1 TODA", "Phase 8 TODA", "Pangarap TODA", 
    "Camarin East TODA", "Bagong Silang TODA", "Barangay 176 TODA", "Barangay 175 TODA", 
    "Barangay 170 TODA", "Barangay 171 TODA", "Barangay 172 TODA"
  ];

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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
if (name === "contact_number") {
  const onlyNums = value.replace(/[^0-9]/g, "");
  const formatted = onlyNums.startsWith("09") ? onlyNums : "09" + onlyNums.replace(/^0+/, "");
  setFormData(prev => ({
    ...prev,
    [name]: formatted.slice(0, 11), // limit to 11 digits
  }));


    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
      // Clear any existing submitStatus/error when user updates fields
      if (submitStatus) setSubmitStatus(null);
    }
  };

  const handleSingleFileChange = (e) => {
    const { name, files } = e.target;
    const file = (files && files.length > 0) ? files[0] : null;
    setFormData(prev => ({ ...prev, [name]: file }));
  };

  const nextStep = () => {
    // Basic validation before advancing
    const requiredFieldsByStep = {
      1: ['full_name', 'home_address', 'contact_number', 'email', 'citizenship', 'birth_date', 'id_type', 'id_number'],
      2: ['make_brand', 'model', 'engine_number', 'chassis_number', 'plate_number', 'year_acquired', 'color', 'vehicle_type', 'lto_or_number', 'lto_cr_number', 'lto_expiration_date', 'mv_file_number'],
      3: ['toda_name', 'route_zone', 'barangay_of_operation', 'district'],
      4: [], // File validation handled separately
      5: [], // Payment validation handled separately
      6: ['applicant_signature', 'date_submitted', 'barangay_captain_signature']
    };

    const currentRequired = requiredFieldsByStep[currentStep] || [];
    for (const field of currentRequired) {
      if (!formData[field] || String(formData[field]).trim() === '') {
        setSubmitStatus({ type: 'error', message: `Please fill out ${field.replace(/_/g, ' ')}.` });
        return;
      }
    }

    setCurrentStep(prev => Math.min(prev + 1, steps.length));
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowModal(true);
  };

const confirmSubmit = async () => {
  setIsSubmitting(true);
  setShowModal(false);

  try {
    const formDataToSend = new FormData();

    // ✅ Append all form fields correctly
    Object.keys(formData).forEach(key => {
      const value = formData[key];
      if (value !== null && value !== '' && value !== undefined) {
        if (value instanceof File) {
          formDataToSend.append(key, value);
        } else if (typeof value === 'boolean') {
          formDataToSend.append(key, value ? '1' : '0');
        } else {
          formDataToSend.append(key, String(value));
        }
      }
    });

    console.log('Submitting form to PHP backend...');

    // ✅ FIXED: Send formDataToSend (the FormData object)
    const response = await fetch('http://localhost:8000/back-end/api/franchise_permit.php', {
      method: 'POST',
      body: formDataToSend, // ← CHANGED THIS LINE
    });

    console.log('Response status:', response.status);

    const data = await response.json();
    console.log('Response data:', data);

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
              <input type="text" name="full_name" value={formData.full_name} onChange={handleChange} placeholder="Full Name *" className="p-3 border rounded-lg" required />
              <input type="text" name="home_address" value={formData.home_address} onChange={handleChange} placeholder="Home Address *" className="p-3 border rounded-lg" required />
              <input type="text" name="contact_number" value={formData.contact_number} onChange={handleChange} placeholder="Contact Number *" className="p-3 border rounded-lg" required />
              <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email Address *" className="p-3 border rounded-lg" required />
              <select name="citizenship" value={formData.citizenship} onChange={handleChange} className="p-3 border rounded-lg" required>
                <option value="">Citizenship *</option>
                {NATIONALITIES.map(n => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
              <input type="date" name="birth_date" value={formData.birth_date} onChange={handleChange} placeholder="Date of Birth *" className="p-3 border rounded-lg" required />
              <select name="id_type" value={formData.id_type} onChange={handleChange} className="p-3 border rounded-lg" required>
                <option value="">Select Valid ID Type *</option>
                <option value="Driver's License">Driver's License</option>
                <option value="Passport">Passport</option>
                <option value="National ID">National ID</option>
                <option value="UMID">UMID</option>
                <option value="Postal ID">Postal ID</option>
              </select>
              <input type="text" name="id_number" value={formData.id_number} onChange={handleChange} placeholder="Valid ID Number *" className="p-3 border rounded-lg" required />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold mb-4">Tricycle / Unit Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" name="make_brand" value={formData.make_brand} onChange={handleChange} placeholder="Make / Brand *" className="p-3 border rounded-lg" required />
              <input type="text" name="model" value={formData.model} onChange={handleChange} placeholder="Model *" className="p-3 border rounded-lg" required />
              <input type="text" name="engine_number" value={formData.engine_number} onChange={handleChange} placeholder="Engine Number *" className="p-3 border rounded-lg" required />
              <input type="text" name="chassis_number" value={formData.chassis_number} onChange={handleChange} placeholder="Chassis Number *" className="p-3 border rounded-lg" required />
              <input type="text" name="plate_number" value={formData.plate_number} onChange={handleChange} placeholder="Plate Number *" className="p-3 border rounded-lg" required />
              <input type="text" name="year_acquired" value={formData.year_acquired} onChange={handleChange} placeholder="Year Acquired *" className="p-3 border rounded-lg" required />
              <input type="text" name="color" value={formData.color} onChange={handleChange} placeholder="Color *" className="p-3 border rounded-lg" required />
              <input type="text" name="vehicle_type" value={formData.vehicle_type} onChange={handleChange} placeholder="Vehicle Type *" className="p-3 border rounded-lg" required />
              <input type="text" name="lto_or_number" value={formData.lto_or_number} onChange={handleChange} placeholder="LTO OR Number *" className="p-3 border rounded-lg" required />
              <input type="text" name="lto_cr_number" value={formData.lto_cr_number} onChange={handleChange} placeholder="LTO CR Number *" className="p-3 border rounded-lg" required />
              <input type="date" name="lto_expiration_date" value={formData.lto_expiration_date} onChange={handleChange} placeholder="Expiration Date (LTO) *" className="p-3 border rounded-lg" required />
              <input type="text" name="mv_file_number" value={formData.mv_file_number} onChange={handleChange} placeholder="MV File Number" className="p-3 border rounded-lg" />
              <input type="text" name="district" value={formData.district} onChange={handleChange} placeholder="District *" className="p-3 border rounded-lg" required />
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold mb-4">Route / Operation Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input list="route-list" name="route_zone" value={formData.route_zone} onChange={handleChange} placeholder="Select or type route *" className="p-3 border rounded-lg" required />
              <datalist id="route-list">
                {ROUTES.map(r => <option key={r.value} value={r.label} />)}
              </datalist>
              
              <input list="toda-list" name="toda_name" value={formData.toda_name} onChange={handleChange} placeholder="Select or type TODA *" className="p-3 border rounded-lg" required />
              <datalist id="toda-list">
                {TODA_NAMES.map(name => <option key={name} value={name} />)}
              </datalist>
              
              <input list="barangay-list" name="barangay_of_operation" value={formData.barangay_of_operation} onChange={handleChange} placeholder="Select or type barangay *" className="p-3 border rounded-lg" required />
              <datalist id="barangay-list">
                {barangaysCaloocan.map(b => <option key={b} value={b} />)}
              </datalist>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold mb-4">Required Documents</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { name: 'proof_of_residency', label: 'Proof of Residency', checked: formData.proof_of_residency_checked },
                { name: 'barangay_clearance', label: 'Barangay Clearance', checked: formData.barangay_clearance_checked },
                { name: 'toda_endorsement', label: 'TODA Endorsement', checked: formData.toda_endorsement_checked },
                { name: 'lto_or_cr', label: 'LTO OR/CR', checked: formData.lto_or_cr_checked },
                { name: 'insurance_certificate', label: 'Insurance Certificate', checked: formData.insurance_certificate_checked },
                { name: 'drivers_license', label: 'Driver\'s License', checked: formData.drivers_license_checked },
                { name: 'emission_test', label: 'Emission Test', checked: formData.emission_test_checked },
                { name: 'id_picture', label: '2x2 ID Picture', checked: formData.id_picture_checked }
              ].map((doc) => (
                <div key={doc.name} className="flex flex-col">
                  <label className="flex items-center">
                    <input type="checkbox" name={`${doc.name}_checked`} checked={doc.checked} onChange={handleChange} className="mr-2" />
                    {doc.label}
                  </label>
                  {doc.checked && (
                    <div className="mt-2">
                      <label className="cursor-pointer p-3 border rounded-lg w-full inline-block text-center bg-white">
                        {formData[doc.name] ? `Selected: ${formData[doc.name].name}` : 'Choose file'}
                        <input type="file" name={doc.name} onChange={handleSingleFileChange} accept=".jpg,.jpeg,.png,.pdf" className="hidden" />
                      </label>
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
            <h3 className="text-xl font-semibold mb-4">Payment Information</h3>
            <div className="space-y-4">
              {[
                { name: 'franchise_fee', label: 'Franchise Fee', checked: formData.franchise_fee_checked, or: formData.franchise_fee_or },
                { name: 'sticker_id_fee', label: 'Sticker / ID Fee', checked: formData.sticker_id_fee_checked, or: formData.sticker_id_fee_or },
                { name: 'inspection_fee', label: 'Inspection Fee', checked: formData.inspection_fee_checked, or: formData.inspection_fee_or }
              ].map((fee) => (
                <div key={fee.name} className="flex items-center justify-between border p-4 rounded-lg">
                  <label className="flex items-center">
                    <input type="checkbox" name={`${fee.name}_checked`} checked={fee.checked} onChange={handleChange} className="mr-2" />
                    {fee.label}
                  </label>
                  {fee.checked && (
                    <div className="flex items-center gap-3">
                      <input type="text" name={`${fee.name}_or`} value={fee.or} onChange={handleChange} placeholder="OR Number" className="p-2 border rounded w-40" />
                      <label className="cursor-pointer p-2 border rounded inline-block bg-white">
                        {formData[`${fee.name}_receipt`] ? `Selected: ${formData[`${fee.name}_receipt`].name}` : 'Upload Receipt'}
                        <input type="file" name={`${fee.name}_receipt`} onChange={handleSingleFileChange} accept=".jpg,.jpeg,.png,.pdf" className="hidden" />
                      </label>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      case 6:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold mb-4">Declaration</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" name="applicant_signature" value={formData.applicant_signature} onChange={handleChange} placeholder="Applicant's Signature *" className="p-3 border rounded-lg" required />
              <input type="date" name="date_submitted" value={formData.date_submitted} onChange={handleChange} placeholder="Date Submitted *" className="p-3 border rounded-lg" required />
              <input type="text" name="barangay_captain_signature" value={formData.barangay_captain_signature} onChange={handleChange} placeholder="Barangay Captain Signature *" className="p-3 border rounded-lg" required />
              <textarea name="remarks" value={formData.remarks} onChange={handleChange} placeholder="Remarks / Notes" className="p-3 border rounded-lg md:col-span-2" rows="4" />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="mx-1 mt-1 p-6 font-sans" style={{ background: '#FBFBFB', minHeight: '100vh', borderRadius: '0.75rem', fontFamily: 'Inter, Segoe UI, Arial, Helvetica Neue, sans-serif' }}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-4xl font-bold" style={{ color: '#4a90e2' }}>Franchise Permit Application</h1>
          <p className="mt-2" style={{ color: '#9aa5b1' }}>
            Permit Type: <span className="font-semibold" style={{ color: '#4caf50' }}>{permitType}</span>
          </p>
        </div>
        <button
          onClick={() => navigate('/user/franchise/type')}
          style={{ background: '#9aa5b1', color: 'white' }}
          className="px-4 py-2 rounded-lg transition-colors hover:bg-[#4a90e2]"
        >
          Change Type
        </button>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div
                className="flex items-center justify-center w-10 h-10 rounded-full border-2"
                style={{
                  background: currentStep >= step.id ? '#4a90e2' : '#fbfbfb',
                  borderColor: currentStep >= step.id ? '#4a90e2' : '#9aa5b1',
                  color: currentStep >= step.id ? 'white' : '#9aa5b1'
                }}
              >
                {step.id}
              </div>
              <div className="ml-3 hidden md:block">
                <p className="text-sm font-medium" style={{ color: currentStep >= step.id ? '#4a90e2' : '#9aa5b1' }}>
                  {step.title}
                </p>
                <p className="text-xs" style={{ color: '#9aa5b1' }}>{step.description}</p>
              </div>
              {index < steps.length - 1 && (
                <div className="hidden md:block w-16 h-0.5 mx-4" style={{ background: currentStep > step.id ? '#4a90e2' : '#9aa5b1' }} />
              )}
            </div>
          ))}
        </div>
      </div>

      {submitStatus && (
        <div className={`p-4 mb-6 rounded ${submitStatus.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {submitStatus.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {renderStepContent()}

        <div className="flex justify-between pt-6">
          {currentStep > 1 && (
            <button type="button" onClick={prevStep} className="px-6 py-3 rounded-lg font-semibold bg-gray-400 text-white hover:bg-blue-600">
              Previous
            </button>
          )}
          {currentStep < steps.length ? (
            <button type="button" onClick={nextStep} className="px-6 py-3 rounded-lg font-semibold bg-blue-600 text-white hover:bg-green-600">
              Next
            </button>
          ) : (
            <button type="submit" disabled={isSubmitting} className={`px-6 py-3 rounded-lg font-semibold ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'} text-white`}>
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </button>
          )}
        </div>
      </form>

      {/* Review & Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-3xl w-full border-2 border-blue-600">
            <h2 className="text-xl font-bold mb-4 text-blue-600">Review Your Application</h2>
            <div className="max-h-[60vh] overflow-auto mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(formData).map(([key, val]) => {
                  if (val instanceof File) {
                    return (
                      <div key={key} className="p-3 border rounded">
                        <strong className="capitalize">{key.replace(/_/g, ' ')}:</strong>
                        <div className="text-sm">{val.name}</div>
                      </div>
                    );
                  } else if (typeof val === 'boolean') {
                    return (
                      <div key={key} className="p-3 border rounded">
                        <strong className="capitalize">{key.replace(/_/g, ' ')}:</strong>
                        <div className="text-sm">{val ? 'Yes' : 'No'}</div>
                      </div>
                    );
                  } else if (val) {
                    return (
                      <div key={key} className="p-3 border rounded">
                        <strong className="capitalize">{key.replace(/_/g, ' ')}:</strong>
                        <div className="text-sm break-words">{String(val)}</div>
                      </div>
                    );
                  }
                  return null;
                }).filter(Boolean)}
              </div>
            </div>
            <div className="flex justify-between">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 rounded-lg font-semibold bg-gray-400 text-white">
                Back to Edit
              </button>
              <div className="flex gap-3">
                <button onClick={() => { setShowModal(false); setCurrentStep(1); }} className="px-4 py-2 rounded-lg font-semibold bg-gray-200 text-gray-800">
                  Start Over
                </button>
                <button onClick={confirmSubmit} disabled={isSubmitting} className={`px-4 py-2 rounded-lg font-semibold ${isSubmitting ? 'bg-gray-400' : 'bg-green-600'} text-white`}>
                  {isSubmitting ? 'Submitting...' : 'Confirm & Submit'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}