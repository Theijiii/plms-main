import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

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
  const [showModal, setShowModal] = useState(false);

const [formData, setFormData] = useState({
  permit_type: permitType,
  application_date: new Date().toISOString().split('T')[0],

  // 🧑 Owner Information
  last_name: "",
  first_name: "",
  middle_name: null, // optional → null
  owner_type: "",
  citizenship: "",
  corp_filipino_percent: 0,
  corp_foreign_percent: 0,
  date_of_birth: "",
  contact_number: "",
  email_address: null,
  home_address: null,
  valid_id_type: null,
  valid_id_number: null,

  // 🏢 Business Information
  business_name: "",
  trade_name: null,
  business_nature: null,
  business_structure: null,
  registration_no: null,
  tin: null,
  ownership_status: null,
  building_type: null,
  business_activity: null,
  business_description: null,
  capital_investment: 0,
  number_of_employees: 0,

  // 🗺 Location & Zoning
  house_bldg_no: null,
  building_name: null,
  street: null,
  barangay: null,
  city_municipality: null,
  province: null,
  zip_code: null,
  zone_district: null,
  business_zone: null,

  // 📏 Operations & Employment
  establishment_type: null,
  land_use_classification: null,
  total_floor_area: 0,
  operation_from_time: null,
  operation_from_ampm: "AM",
  operation_to_time: null,
  operation_to_ampm: "PM",
  total_employees: 0,
  male_employees: 0,
  female_employees: 0,
  lgu_resident_employees: 0,
  delivery_van_truck: 0,
  delivery_motorcycle: 0,

  // 📄 Attachments
  attachments_applicable: false,
  barangay_clearance: null,
  registration_doc: null,
  bir_certificate: null,
  lease_or_title: null,
  fsic: null,
  sanitary_permit: null,
  zoning_clearance: null,
  occupancy_permit: null,
  owner_valid_id: null,
  id_picture: null,
  official_receipt_file: null,
  owner_scanned_id: null,

  // 📝 Declaration & Approval
  owner_type_declaration: "Business Owner",
  owner_representative_name: null,
  date_submitted: "",
  remarks: null,
});


  const steps = [
    { id: 1, title: 'Owner Information' },
    { id: 2, title: 'Business Information' },
    { id: 3, title: 'Locatio, Zoning and Operation Details'},
    { id: 4, title: 'Operations & Employment Details' },
    { id: 5, title: 'Declration & Review'}
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

const validateStep = (step) => {
  const isEmpty = (val) =>
    val === undefined || val === null || (typeof val === "string" && val.trim() === "");

  // 🧩 STEP 1 — Owner Information
  if (step === 1) {
    const missing = [];

    if (isEmpty(formData.first_name)) missing.push("First Name");
    if (isEmpty(formData.last_name)) missing.push("Last Name");
    if (isEmpty(formData.middle_name)) missing.push("Middle Name");
    if (isEmpty(formData.owner_type)) missing.push("Owner Type");
    if (isEmpty(formData.citizenship)) missing.push("Citizenship");

    if (formData.owner_type === "Corporation") {
      if (isEmpty(formData.corp_filipino_percent))
        missing.push("Filipino % (Corporation)");
      if (isEmpty(formData.corp_foreign_percent))
        missing.push("Foreign % (Corporation)");
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

  // 🧩 STEP 2 — Business Information
  if (step === 2) {
    const missing = [];

    if (isEmpty(formData.business_name)) missing.push("Registered Business Name");
    if (isEmpty(formData.trade_name)) missing.push("Trade / Brand Name");
    if (isEmpty(formData.business_nature)) missing.push("Nature of Business");
    if (isEmpty(formData.ownership_status)) missing.push("Ownership Status");
    if (isEmpty(formData.building_type)) missing.push("Building Type");
    if (isEmpty(formData.business_activity)) missing.push("Primary Business Activity");
    if (isEmpty(formData.business_description)) missing.push("Brief Description of Business");
    if (isEmpty(formData.capital_investment)) missing.push("Capital Investment (₱)");

    if (missing.length) return { ok: false, message: "Missing: " + missing.join(", ") };
    return { ok: true };
  }

  // 🧩 STEP 3 — Business Address
if (step === 3) {
  const missing = [];

  if (isEmpty(formData.house_bldg_no)) missing.push("House / Building Number");
  if (isEmpty(formData.street)) missing.push("Street");
  if (isEmpty(formData.barangay)) missing.push("Barangay");
  if (isEmpty(formData.city_municipality)) missing.push("City / Municipality");
  if (isEmpty(formData.province)) missing.push("Province");

  if (missing.length) return { ok: false, message: "Missing: " + missing.join(", ") };
  return { ok: true };
}


  // 🧩 STEP 4 — Operation Details
  if (step === 4) {
    const missing = [];

    if (isEmpty(formData.total_floor_area)) missing.push("Total Floor/Building Area");
    if (isEmpty(formData.total_employees)) missing.push("Total Number of Employees");
    if (isEmpty(formData.male_employees)) missing.push("Male Employees");
    if (isEmpty(formData.female_employees)) missing.push("Female Employees");

    if (missing.length) return { ok: false, message: "Missing: " + missing.join(", ") };
    return { ok: true };
  }

  // 🧩 STEP 5 — Attachments
  if (step === 5) {
    const missing = [];

    if (!formData.attachments_applicable) return { ok: true }; // Skip if not required

    const requiredFiles = [
      { field: "barangay_clearance", label: "Barangay Clearance" },
      { field: "registration_doc", label: "DTI / SEC / CDA Registration" },
      { field: "bir_certificate", label: "BIR Certificate of Registration" },
      { field: "lease_or_title", label: "Lease Contract / Land Title" },
      { field: "fsic", label: "Fire Safety Inspection Certificate (FSIC)" },
      { field: "sanitary_permit", label: "Sanitary / Health Permit" },
      { field: "zoning_clearance", label: "Zoning Clearance" },
      { field: "occupancy_permit", label: "Occupancy Permit" },
      { field: "owner_valid_id", label: "Owner Valid ID" },
      { field: "id_picture", label: "2x2 ID Picture" },
      { field: "official_receipt_file", label: "Official Receipt of Payment" },
      { field: "owner_scanned_id", label: "Scanned ID of Owner" },
    ];

    requiredFiles.forEach((file) => {
      if (isEmpty(formData[file.field])) missing.push(file.label);
    });

    if (missing.length) return { ok: false, message: "Missing: " + missing.join(", ") };
    return { ok: true };
  }

  // 🧩 STEP 6 — Declaration & Submission
  if (step === 6) {
    const missing = [];

    if (isEmpty(formData.owner_type_declaration))
      missing.push("Owner / Representative");
    if (isEmpty(formData.owner_representative_name))
      missing.push("Owner / Representative Name");
    if (isEmpty(formData.owner_scanned_id))
      missing.push("Scanned ID of Owner");
    if (isEmpty(formData.date_submitted))
      missing.push("Date Submitted");

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
    const res = validateStep(currentStep);
    if (!res.ok) {
      setSubmitStatus({ type: 'error', message: res.message || 'Please complete required fields for this step.' });
      return;
    }
    setSubmitStatus(null);
    setShowModal(true);
  };

  
const confirmSubmit = async () => {
  setIsSubmitting(true);
  setShowModal(false);

  try {
    const formDataToSend = new FormData();

    Object.keys(formData).forEach((key) => {
      const value = formData[key];
      if (value === null || value === undefined || value === "") {
        formDataToSend.append(key, "");
      } else {
        formDataToSend.append(key, value);
      }
    });

    const response = await fetch("/api/business_permit.php", {
      method: "POST",
      body: formDataToSend,
    });

    // 🧾 Always read raw text and safely parse it
    const raw = await response.text();
    console.log("🧾 Raw backend response:", raw);

    let data;
    try {
      data = JSON.parse(raw);
    } catch {
      throw new Error("Invalid JSON response from backend");
    }

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Submission failed");
    }

    // ✅ Success
    setSubmitStatus({ type: "success", message: "Application submitted successfully" });
    setTimeout(() => navigate("/user/businesspermittype"), 1200);

  } catch (err) {
    console.error("Submission error:", err);
    setSubmitStatus({
      type: "error",
      message: err.message || "Submission failed. Please try again.",
    });
  } finally {
    setIsSubmitting(false);
  }
};



  const renderStepContent = () => {
    switch (currentStep) {
case 1:
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">Owner Information</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* First Name */}
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">First Name</label>
          <input
            name="first_name"
            value={formData.first_name || ""}
            onChange={handleChange}
            placeholder="Enter first name"
            className="p-3 border rounded w-full"
          />
        </div>

        {/* Last Name */}
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">Last Name</label>
          <input
            name="last_name"
            value={formData.last_name || ""}
            onChange={handleChange}
            placeholder="Enter last name"
            className="p-3 border rounded w-full"
          />
        </div>

        {/* Middle Name */}
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">Middle Name</label>
          <input
            name="middle_name"
            value={formData.middle_name || ""}
            onChange={handleChange}
            placeholder="Enter middle name"
            className="p-3 border rounded w-full"
          />
        </div>

        {/* Owner Type */}
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">Owner Type</label>
          <select
            name="owner_type"
            value={formData.owner_type || ""}
            onChange={handleChange}
            className="p-3 border rounded w-full"
          >
            <option value="">Select owner type</option>
            <option value="Individual">Individual</option>
            <option value="Partnership">Partnership</option>
            <option value="Corporation">Corporation</option>
          </select>
        </div>

        {/* Citizenship + Conditional Fields */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:col-span-2">
          {/* Citizenship */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Citizenship</label>
            <input
              list="nationalities"
              name="citizenship"
              value={formData.citizenship || ""}
              onChange={handleChange}
              placeholder="Enter citizenship"
              className="p-3 border rounded w-full"
            />
            <datalist id="nationalities">
              {NATIONALITIES.map((n) => (
                <option key={n} value={n} />
              ))}
            </datalist>
          </div>

          {/* Conditional Fields beside Citizenship */}
          {formData.owner_type === "Corporation" && (
            <>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  Filipino (%)
                </label>
                <input
                  type="number"
                  name="corp_filipino_percent"
                  value={formData.corp_filipino_percent || ""}
                  onChange={handleChange}
                  placeholder="%"
                  className="p-3 border rounded w-full"
                  min="0"
                  max="100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  Foreign (%)
                </label>
                <input
                  type="number"
                  name="corp_foreign_percent"
                  value={formData.corp_foreign_percent || ""}
                  onChange={handleChange}
                  placeholder="%"
                  className="p-3 border rounded w-full"
                  min="0"
                  max="100"
                />
              </div>
            </>
          )}

          {formData.owner_type === "Individual" && (
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Upload DTI Registration
              </label>
              <input
                type="file"
                name="dti_registration"
                onChange={handleChange}
                accept=".pdf,.jpg,.png"
                className="p-3 border rounded w-full"
              />
            </div>
          )}

          {formData.owner_type === "Partnership" && (
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Upload SEC Registration
              </label>
              <input
                type="file"
                name="sec_registration"
                onChange={handleChange}
                accept=".pdf,.jpg,.png"
                className="p-3 border rounded w-full"
              />
            </div>
          )}
        </div>

        {/* Date of Birth */}
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">Date of Birth</label>
          <input
            type="date"
            name="date_of_birth"
            value={formData.date_of_birth || ""}
            onChange={handleChange}
            className="p-3 border rounded w-full"
          />
        </div>

        {/* Contact Number */}
<div>
  <label className="block text-sm font-medium mb-1 text-gray-700">Contact Number</label>
  <input
    type="number"
    name="contact_number"
    value={formData.contact_number || ""}
    placeholder="(e.g. 09123456789)"
     onChange={handleChange}
    className="p-3 border rounded w-full"
  />
</div>


        {/* Email Address */}
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">Email Address</label>
          <input
            type="email"
            name="email_address"
            value={formData.email_address || ""}
            onChange={handleChange}
            placeholder="Enter email address"
            className="p-3 border rounded w-full"
          />
        </div>

        {/* Home Address */}
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">Home Address</label>
          <input
            name="home_address"
            value={formData.home_address || ""}
            onChange={handleChange}
            placeholder="Enter home address"
            className="p-3 border rounded w-full"
          />
        </div>

        {/* Valid ID Type */}
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">Valid ID Type</label>
          <select
            name="valid_id_type"
            value={formData.valid_id_type || ""}
            onChange={handleChange}
            className="p-3 border rounded w-full"
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

        {/* Valid ID Number */}
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">Valid ID Number</label>
          <input
            type="number"
            name="valid_id_number"
            value={formData.valid_id_number || ""}
            onChange={handleChange}
            placeholder="Enter valid ID number"
            className="p-3 border rounded w-full"
          />
        </div>
      </div>
    </div>
  );


case 2:
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-800">
        Establishment Information
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 🏢 Basic Business Details */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Registered Business Name
          </label>
          <input
            name="business_name"
            value={formData.business_name || ""}
            onChange={handleChange}
            placeholder="Registered Business Name"
            className="p-3 border rounded w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Trade / Brand Name
          </label>
          <input
            name="trade_name"
            value={formData.trade_name || ""}
            onChange={handleChange}
            placeholder="Trade / Brand Name"
            className="p-3 border rounded w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nature of Business
          </label>
          <select
            name="business_nature"
            value={formData.business_nature || ""}
            onChange={handleChange}
            className="p-3 border rounded w-full"
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
        {/* 💼 Additional Business Details */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Primary Business Activity
          </label>
          <input
            name="business_activity"
            value={formData.business_activity || ""}
            onChange={handleChange}
            placeholder="Primary Business Activity"
            className="p-3 border rounded w-full"
          />
        </div>

        {/* 🧾 Ownership & Building Details */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ownership Status
          </label>
          <select
            name="ownership_status"
            value={formData.ownership_status || ""}
            onChange={handleChange}
            className="p-3 border rounded w-full"
          >
            <option value="">Select Ownership Status</option>
            <option value="Owner">Owner</option>
            <option value="Tenant">Tenant</option>
            <option value="Lessee">Lessee</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Building Type
          </label>
          <select
            name="building_type"
            value={formData.building_type || ""}
            onChange={handleChange}
            className="p-3 border rounded w-full"
          >
            <option value="">Select Building Type</option>
            <option value="Commercial">Commercial</option>
            <option value="Residential">Residential</option>
            <option value="Industrial">Industrial</option>
          </select>
        </div>


        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Capital Investment (₱)
          </label>
          <input
            type="number"
            name="capital_investment"
            value={formData.capital_investment || ""}
            onChange={handleChange}
            placeholder="Capital Investment (₱)"
            className="p-3 border rounded w-full"
          />
        </div>

        <div className="md:col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Brief Description of Business
          </label>
          <textarea
            name="business_description"
            value={formData.business_description || ""}
            onChange={handleChange}
            placeholder="Brief Description of Business"
            className="p-3 border rounded w-full"
          />
        </div>

      </div>
    </div>
  );

case 3:
  return (
    <div className="space-y-10">
      {/* SECTION 1: LOCATION, ZONING & BUSINESS ADDRESS */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Location, Zoning & Business Address</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 font-medium">
              House/Building Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="house_bldg_no"
              value={formData.house_bldg_no || ""}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Building Name</label>
            <input
              type="text"
              name="building_name"
              value={formData.building_name || ""}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Street <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="street"
              value={formData.street || ""}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Barangay <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="barangay"
              value={formData.barangay || ""}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              City/Municipality <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="city_municipality"
              value={formData.city_municipality || ""}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Province <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="province"
              value={formData.province || ""}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">ZIP Code</label>
            <input
              type="text"
              name="zip_code"
              value={formData.zip_code || ""}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg"
              maxLength="4"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Zone / District</label>
            <input
              type="text"
              name="zone_district"
              value={formData.zone_district || ""}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Business Zone <span className="text-red-500">*</span>
            </label>
            <select
              name="business_zone"
              value={formData.business_zone || ""}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg"
              required
            >
              <option value="">Select Zone</option>
              <option value="Commercial">Commercial</option>
              <option value="Industrial">Industrial</option>
              <option value="Residential">Residential</option>
              <option value="Mixed-use">Mixed-use</option>
            </select>
          </div>

          <div>
            <label className="block mb-2 font-medium">Type of Establishment</label>
            <select
              name="establishment_type"
              value={formData.establishment_type || ""}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg"
            >
              <option value="">Select Type</option>
              <option value="Store">Store</option>
              <option value="Office">Office</option>
              <option value="Factory">Factory</option>
              <option value="Others">Others</option>
            </select>
          </div>

          

          {/* NEWLY ADDED FIELDS */}
          <div>
            <label className="block mb-2 font-medium">
              Zoning Permit ID <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="zoning_permit_id"
              value={formData.zoning_permit_id || ""}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Sanitation Permit ID <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="sanitation_permit_id"
              value={formData.sanitation_permit_id || ""}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg"
              required
            />
          </div>
        </div>
      </div>

      {/* SECTION 2: OPERATIONS & EMPLOYMENT DETAILS */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Operations & Employment Details</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 font-medium">Business Area (in sq. m.)</label>
            <input
              type="number"
              name="business_area"
              value={formData.business_area || ""}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Number of Employees <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="no_of_employees"
              value={formData.no_of_employees || ""}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Business Operating Hours <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="operating_hours"
              value={formData.operating_hours || ""}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg"
              placeholder="e.g. 8:00 AM - 5:00 PM"
              required
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Type of Operation <span className="text-red-500">*</span>
            </label>
            <select
              name="operation_type"
              value={formData.operation_type || ""}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg"
              required
            >
              <option value="">Select Type</option>
              <option value="Main Office">Main Office</option>
              <option value="Branch">Branch</option>
              <option value="Franchise">Franchise</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">Clearances & Attachments</h3>
            <div className="mb-4">
              <label className="inline-flex items-center gap-2">
                <input type="checkbox" name="attachments_applicable" checked={formData.attachments_applicable} onChange={handleChange} />
                <span className="text-sm">I have the required documents / attachments (uncheck to skip uploading if not applicable)</span>
              </label>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-1">Barangay Clearance (upload)</label>
                <label className="cursor-pointer p-3 border rounded w-full inline-block text-center bg-white">{formData.barangay_clearance ? `Selected: ${formData.barangay_clearance.name}` : 'Choose file or click to upload'}<input type="file" name="barangay_clearance" onChange={handleFile} className="hidden" /></label>
              </div>
              <div>
                <label className="block text-sm mb-1">DTI / SEC / CDA Registration (upload)</label>
                <label className="cursor-pointer p-3 border rounded w-full inline-block text-center bg-white">{formData.registration_doc ? `Selected: ${formData.registration_doc.name}` : 'Choose file or click to upload'}<input type="file" name="registration_doc" onChange={handleFile} className="hidden" /></label>
              </div>

              <div>
                <label className="block text-sm mb-1">BIR Certificate of Registration (upload)</label>
                <label className="cursor-pointer p-3 border rounded w-full inline-block text-center bg-white">{formData.bir_certificate ? `Selected: ${formData.bir_certificate.name}` : 'Choose file or click to upload'}<input type="file" name="bir_certificate" onChange={handleFile} className="hidden" /></label>
              </div>

              <div>
                <label className="block text-sm mb-1">Lease Contract / Land Title (upload)</label>
                <label className="cursor-pointer p-3 border rounded w-full inline-block text-center bg-white">{formData.lease_or_title ? `Selected: ${formData.lease_or_title.name}` : 'Choose file or click to upload'}<input type="file" name="lease_or_title" onChange={handleFile} className="hidden" /></label>
              </div>

              <div>
                <label className="block text-sm mb-1">Fire Safety Inspection Certificate (FSIC) (upload)</label>
                <label className="cursor-pointer p-3 border rounded w-full inline-block text-center bg-white">{formData.fsic ? `Selected: ${formData.fsic.name}` : 'Choose file or click to upload'}<input type="file" name="fsic" onChange={handleFile} className="hidden" /></label>
              </div>

              <div>
                <label className="block text-sm mb-1">Sanitary / Health Permit (upload)</label>
                <label className="cursor-pointer p-3 border rounded w-full inline-block text-center bg-white">{formData.sanitary_permit ? `Selected: ${formData.sanitary_permit.name}` : 'Choose file or click to upload'}<input type="file" name="sanitary_permit" onChange={handleFile} className="hidden" /></label>
              </div>

              <div>
                <label className="block text-sm mb-1">Zoning Clearance (upload)</label>
                <label className="cursor-pointer p-3 border rounded w-full inline-block text-center bg-white">{formData.zoning_clearance ? `Selected: ${formData.zoning_clearance.name}` : 'Choose file or click to upload'}<input type="file" name="zoning_clearance" onChange={handleFile} className="hidden" /></label>
              </div>

              <div>
                <label className="block text-sm mb-1">Occupancy Permit (upload)</label>
                <label className="cursor-pointer p-3 border rounded w-full inline-block text-center bg-white">{formData.occupancy_permit ? `Selected: ${formData.occupancy_permit.name}` : 'Choose file or click to upload'}<input type="file" name="occupancy_permit" onChange={handleFile} className="hidden" /></label>
              </div>

              <div>
                <label className="block text-sm mb-1">Owner Valid ID (upload)</label>
                <label className="cursor-pointer p-3 border rounded w-full inline-block text-center bg-white">{formData.owner_valid_id ? `Selected: ${formData.owner_valid_id.name}` : 'Choose file or click to upload'}<input type="file" name="owner_valid_id" onChange={handleFile} className="hidden" /></label>
              </div>

              <div>
                <label className="block text-sm mb-1">2x2 ID Picture (upload)</label>
                <label className="cursor-pointer p-3 border rounded w-full inline-block text-center bg-white">{formData.id_picture ? `Selected: ${formData.id_picture.name}` : 'Choose file or click to upload'}<input type="file" name="id_picture" onChange={handleFile} className="hidden" /></label>
              </div>

              <div>
                <label className="block text-sm mb-1">Official Receipt of Payment (upload)</label>
                <label className="cursor-pointer p-3 border rounded w-full inline-block text-center bg-white">{formData.official_receipt_file ? `Selected: ${formData.official_receipt_file.name}` : 'Choose file or click to upload'}<input type="file" name="official_receipt_file" onChange={handleFile} className="hidden" /></label>
              </div>
            </div>
          </div>
        );

case 5:
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-800">
        Declaration & Approval
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 🖊️ Declaration Section */}
        <div className="md:col-span-2">
          <label className="block text-lg font-semibold text-gray-800 mb-2">
            Owner / Representative:
          </label>

          {/* Owner Type Radio */}
          <div className="flex items-center gap-4 mb-4">
            <label className="flex items-center gap-2 text-gray-700">
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

            <label className="flex items-center gap-2 text-gray-700">
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

          {/* Name Input */}
          <div className="mb-4">
            <label className="block mb-2 font-medium text-gray-700">
              Name:
            </label>
            <input
              type="text"
              name="owner_representative_name"
              value={formData.owner_representative_name || ""}
              onChange={handleChange}
              placeholder="Full Name of Owner or Representative"
              className="w-full p-3 border rounded-lg"
            />
          </div>

          {/* File Upload (Styled Box) */}
          <div className="mb-2">
            <label className="block mb-2 font-medium text-gray-700">
              Scanned ID of the Owner:
            </label>

            <label
              htmlFor="owner_scanned_id"
              className="flex flex-col items-center justify-center w-full border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition"
            >
              <svg
                className="w-10 h-10 text-gray-400 mb-2"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M7 16V4m0 12l-4-4m4 4l4-4M17 8v12m0-12l4 4m-4-4l-4 4"
                />
              </svg>
              <p className="text-sm text-gray-600">
                <span className="font-semibold text-blue-600">Click to upload</span> or drag & drop
              </p>
              <p className="text-xs text-gray-500 mt-1">Accepted: JPG, PNG, or PDF</p>
              <input
                id="owner_scanned_id"
                type="file"
                name="owner_scanned_id"
                accept=".jpg,.jpeg,.png,.pdf"
                onChange={handleFile}
                className="hidden"
              />
            </label>

            {formData.owner_scanned_id && (
              <p className="mt-2 text-sm text-green-600">
                ✅ Uploaded: {formData.owner_scanned_id.name || "File selected"}
              </p>
            )}

            <p className="text-sm text-red-600 mt-1">Required</p>
          </div>

          {/* Note */}
          <p className="text-sm text-gray-700 bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-3">
            <strong>Note:</strong> Do not upload other authorization forms besides
            the downloaded form from this website. Uploading other forms may lead
            to <span className="text-red-600 font-semibold">pending or rejection</span> of your application.
          </p>
        </div>

        {/* Date Submitted */}
        <input
          type="date"
          name="date_submitted"
          value={formData.date_submitted || ""}
          onChange={handleChange}
          className="p-3 border rounded"
        />

        {/* Remarks */}
        <textarea
          name="remarks"
          value={formData.remarks || ""}
          onChange={handleChange}
          placeholder="Remarks"
          className="p-3 border rounded md:col-span-2"
        />
      </div>
    </div>
  );

      default:
        return null;
    }
  };

  return (
    <div className="mx-1 mt-1 p-6 rounded-lg min-h-screen" style={{ background: '#fbfbfb', color: '#222' }}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-4xl font-bold" style={{ color: '#4a90e2' }}>Business Permit Application</h1>
          <p className="mt-2" style={{ color: '#9aa5b1' }}>Permit Type: <span className="font-semibold" style={{ color: '#4caf50' }}>{permitType}</span></p>
        </div>
        <div className="flex justify-end">
         <button
          onClick={() => navigate('/user/business/type')}
          className="px-4 py-2 rounded-lg text-white font-semibold"
          style={{ background: '#4CAF50' }}
          >
          Change Type
         </button>
        </div>

      </div>

      

      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-2" style={{ background: currentStep >= step.id ? '#4a90e2' : '#fff', borderColor: currentStep >= step.id ? '#4a90e2' : '#9aa5b1', color: currentStep >= step.id ? '#fff' : '#9aa5b1' }}>{step.id}</div>
              <div className="ml-3 hidden md:block"><p className="text-sm font-medium" style={{ color: currentStep >= step.id ? '#4a90e2' : '#9aa5b1' }}>{step.title}</p></div>
              {index < steps.length - 1 && <div className="hidden md:block w-16 h-0.5 mx-4" style={{ background: currentStep > step.id ? '#4a90e2' : '#9aa5b1' }} />}
            </div>
          ))}
        </div>
      </div>

      {submitStatus && <div className="p-4 mb-6 rounded" style={{ background: submitStatus.type === 'success' ? '#e6f9ed' : '#fdecea', color: submitStatus.type === 'success' ? '#4caf50' : '#e53935' }}>{submitStatus.message}</div>}

      <form onSubmit={handleSubmit} className="space-y-8">
        {renderStepContent()}

        <div className="flex justify-between pt-6">
          {currentStep > 1 && <button type="button" onClick={prevStep} className="px-6 py-3 rounded-lg" style={{ background: '#9aa5b1', color: '#fff' }}>Previous</button>}
          {currentStep < steps.length ? <button type="button" onClick={nextStep} className="px-6 py-3 rounded-lg" style={{ background: '#4a90e2', color: '#fff' }}>Next</button> : <button type="submit" disabled={isSubmitting} className="px-6 py-3 rounded-lg" style={{ background: isSubmitting ? '#9aa5b1' : '#4caf50', color: '#fff' }}>{isSubmitting ? 'Submitting...' : 'Review & Submit'}</button>}
        </div>
      </form>

      {showModal && ( 
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-[1px]">
    <div
      className="bg-white rounded-lg shadow-lg p-6 max-w-3xl w-full"
      style={{ border: '2px solid #4a90e2' }}
    >
      <h2
        className="text-xl font-bold mb-4"
        style={{ color: '#4a90e2' }}
      >
        Review your application
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[60vh] overflow-auto mb-6">
        {Object.entries(formData).map(([key, val]) => (
          <div key={key} className="p-3 border rounded">
            <strong className="capitalize">{key.replace(/_/g, ' ')}:</strong>
            <div className="text-sm break-words">
              {typeof val === 'object' && val !== null
                ? JSON.stringify(val)
                : String(val ?? '')}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between">
        <button
          onClick={() => setShowModal(false)}
          className="px-4 py-2 rounded-lg"
          style={{ background: '#9aa5b1', color: 'white' }}
        >
          Back to edit
        </button>

        <div className="flex gap-3">
          <button
            onClick={() => {
              setShowModal(false);
              setCurrentStep(1);
            }}
            className="px-4 py-2 rounded-lg"
            style={{ background: '#f3f4f6' }}
          >
            Start over
          </button>

          <button
            onClick={confirmSubmit}
            className="px-4 py-2 rounded-lg"
            style={{ background: '#4caf50', color: 'white' }}
            disabled={isSubmitting}
          >
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
