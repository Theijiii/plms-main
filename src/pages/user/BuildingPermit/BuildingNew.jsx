import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload } from "lucide-react";

const NATIONALITIES = [
  "Afghan", "Albanian", "Algerian", "American", "Andorran", "Angolan", "Antiguans", "Argentinean", "Armenian", "Australian", "Austrian", "Azerbaijani", "Bahamian", "Bahraini", "Bangladeshi", "Barbadian", "Barbudans", "Batswana", "Belarusian", "Belgian", "Belizean", "Beninese", "Bhutanese", "Bolivian", "Bosnian", "Brazilian", "British", "Bruneian", "Bulgarian", "Burkinabe", "Burmese", "Burundian", "Cambodian", "Cameroonian", "Canadian", "Cape Verdean", "Central African", "Chadian", "Chilean", "Chinese", "Colombian", "Comoran", "Congolese", "Costa Rican", "Croatian", "Cuban", "Cypriot", "Czech", "Danish", "Djibouti", "Dominican", "Dutch", "East Timorese", "Ecuadorean", "Egyptian", "Emirian", "Equatorial Guinean", "Eritrean", "Estonian", "Ethiopian", "Fijian", "Filipino", "Finnish", "French", "Gabonese", "Gambian", "Georgian", "German", "Ghanaian", "Greek", "Grenadian", "Guatemalan", "Guinea-Bissauan", "Guinean", "Guyanese", "Haitian", "Herzegovinian", "Honduran", "Hungarian", "I-Kiribati", "Icelander", "Indian", "Indonesian", "Iranian", "Iraqi", "Irish", "Israeli", "Italian", "Ivorian", "Jamaican", "Japanese", "Jordanian", "Kazakhstani", "Kenyan", "Kittian and Nevisian", "Kuwaiti", "Kyrgyz", "Laotian", "Latvian", "Lebanese", "Liberian", "Libyan", "Liechtensteiner", "Lithuanian", "Luxembourger", "Macedonian", "Malagasy", "Malawian", "Malaysian", "Maldivan", "Malian", "Maltese", "Marshallese", "Mauritanian", "Mauritian", "Mexican", "Micronesian", "Moldovan", "Monacan", "Mongolian", "Moroccan", "Mosotho", "Motswana", "Mozambican", "Namibian", "Nauruan", "Nepalese", "New Zealander", "Nicaraguan", "Nigerian", "Nigerien", "North Korean", "Northern Irish", "Norwegian", "Omani", "Pakistani", "Palauan", "Palestinian", "Panamanian", "Papua New Guinean", "Paraguayan", "Peruvian", "Polish", "Portuguese", "Qatari", "Romanian", "Russian", "Rwandan", "Saint Lucian", "Salvadoran", "Samoan", "San Marinese", "Sao Tomean", "Saudi", "Scottish", "Senegalese", "Serbian", "Seychellois", "Sierra Leonean", "Singaporean", "Slovakian", "Slovenian", "Solomon Islander", "Somali", "South African", "South Korean", "Spanish", "Sri Lankan", "Sudanese", "Surinamer", "Swazi", "Swedish", "Swiss", "Syrian", "Taiwanese", "Tajik", "Tanzanian", "Thai", "Togolese", "Tongan", "Trinidadian or Tobagonian", "Tunisian", "Turkish", "Tuvaluan", "Ugandan", "Ukrainian", "Uruguayan", "Uzbekistani", "Venezuelan", "Vietnamese", "Welsh", "Yemenite", "Zambian", "Zimbabwean"
];

export default function BuildingNew() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1
    last_name: '', first_name: '', middle_initial: '', suffix: '', tin: '', contact_no: '', email: '', citizenship: '', home_address: '', form_of_ownership: '',
    // Step 2
    permit_group: '', use_of_permit: '', proposed_date_of_construction: '', expected_date_of_completion: '', total_estimated_cost: '',
    // Step 3
    lot_no: '', blk_no: '', tct_no: '', tax_dec_no: '', street: '', barangay: '', city_municipality: '', province: '',
    // Step 4
    number_of_units: '', number_of_storeys: '', total_floor_area: '', lot_area: '', building_cost: '', electrical_cost: '', mechanical_cost: '', electronics_cost: '', plumbing_cost: '', other_cost: '', equipment_cost: '', proposed_start: '', expected_completion: '',
    // Step 5
    attachments: [], professional_title: '', professional_name: '', prc_no: '', ptr_no: '', gov_id_no: '', date_issued: '', remarks: '', place_issued: '', signature: null,
  });

  const steps = [
    { id: 1, title: 'Applicant Information', description: 'Personal and contact details' },
    { id: 2, title: 'Application Details', description: 'Ownership and permit info' },
    { id: 3, title: 'Project Site Information', description: 'Project location details' },
    { id: 4, title: 'Occupancy & Project Cost', description: 'Units, storeys, and cost' },
    { id: 5, title: 'Other Requirements & Professionals', description: 'Attachments and professionals' },
  ];

  const handleChange = (e) => {
    const { name, type, value, files } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "file" ? (files && files[0] ? files[0] : null) : value,
    }));
  };

  const validateStep = (step, formData) => { 
    const isEmpty = (value) => value === undefined || value === null || value === '' || (Array.isArray(value) && value.length === 0); 
    const stepFields = { 
      1: ['last_name','first_name','middle_initial','tin','contact_no','email','citizenship','home_address','form_of_ownership'], 
      2: ['permit_group','use_of_permit','proposed_date_of_construction','expected_date_of_completion','total_estimated_cost'], 
      3: ['lot_no','blk_no','tct_no','tax_dec_no','street','barangay','city_municipality','province'], 
      4: ['number_of_units','number_of_storeys','total_floor_area','lot_area','proposed_start','expected_completion'], 
      5: ['professional_title','professional_name','prc_no','ptr_no','gov_id_no','signature','date_issued','place_issued'], 
    }; 
    const missing = []; 
    stepFields[step].forEach(field => { 
      if (isEmpty(formData[field])) missing.push(field.replace(/_/g,' ').replace(/\b\w/g, c => c.toUpperCase())); 
    }); 
    if (missing.length) return { ok: false, message: "Missing: " + missing.join(", ") }; 
    return { ok: true }; 
  };

  const nextStep = () => {
    const result = validateStep(currentStep, formData);
    if (!result.ok) { alert(result.message); return; }
    if (currentStep < steps.length) setCurrentStep(currentStep + 1);
  };
 
  const prevStep = () => { if (currentStep > 1) setCurrentStep(currentStep - 1); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = validateStep(currentStep, formData);
    if (!result.ok) { alert(result.message); return; }

    setIsSubmitting(true);

    try {
      const submitData = new FormData();

      Object.keys(formData).forEach(key => {
        const value = formData[key];
        if (value instanceof File || value instanceof FileList) return;
        submitData.append(key, value);
      });

      if (formData.signature) submitData.append("signature", formData.signature);
      if (formData.professional_signature) submitData.append("professional_signature", formData.professional_signature);
      if (formData.attachments && formData.attachments.length > 0) {
        for (let i = 0; i < formData.attachments.length; i++) {
          submitData.append("attachments", formData.attachments[i]);
        }
      }

      const response = await fetch("/back-end/api/building_permit.php", {
        method: "POST",
        body: submitData,
      });

      const data = await response.json();
      if (response.ok) {
        setSubmitStatus({ type: "success", message: "Building permit application submitted!" });
        setFormData({}); 
        setCurrentStep(1);
      } else {
        setSubmitStatus({ type: "error", message: data.error || "Failed to submit application." });
      }
    } catch (err) {
      console.error(err);
      setSubmitStatus({ type: "error", message: "Error submitting application." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch(currentStep) {
      // ====== Step 1: Applicant Info ======
      case 1: return (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold mb-4">{steps[0].title}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">First Name</label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name || ""}
                onChange={handleChange}
                placeholder="Enter first name"
                className="p-3 border rounded w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Last Name</label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name || ""}
                onChange={handleChange}
                placeholder="Enter last name"
                className="p-3 border rounded w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Middle Name</label>
              <input
                type="text"
                name="middle_initial"
                value={formData.middle_initial || ""}
                onChange={handleChange}
                placeholder="Enter middle initial"
                className="p-3 border rounded w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Suffix</label>
              <input
                type="text"
                name="suffix"
                value={formData.suffix || ""}
                onChange={handleChange}
                placeholder="Enter suffix"
                className="p-3 border rounded w-full"
              />
            </div>

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
            
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">TIN Number</label>
              <input
                type="number"
                name="tin"
                value={formData.tin || ""}
                onChange={handleChange}
                placeholder="Enter TIN number"
                className="p-3 border rounded w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Contact Number</label>
              <input
                type="number"
                name="contact_no"
                value={formData.contact_no || ""}
                onChange={handleChange}
                placeholder="Enter contact number"
                className="p-3 border rounded w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email || ""}
                onChange={handleChange}
                placeholder="Enter email address"
                className="p-3 border rounded w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Home Address</label>
              <input
                type="text"
                name="home_address"
                value={formData.home_address || ""}
                onChange={handleChange}
                placeholder="Enter home address"
                className="p-3 border rounded w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Form of Ownership</label>
              <select
                name="form_of_ownership"
                value={formData.form_of_ownership || ""}
                onChange={handleChange}
                className="p-3 border rounded w-full bg-white"
              >
                <option value="">Select Ownership</option>
                <option value="Individual">Individual</option>
                <option value="Enterprise">Enterprise</option>
                <option value="Others">Others</option>
              </select>
            </div>
          </div>
        </div>
      );

      // ====== Step 2: Application Details ======
      case 2: return (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold mb-4">{steps[1].title}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Permit Group */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1 text-gray-700">Permit Group</label>
              <select
                id="permit_group"
                name="permit_group"
                value={formData.permit_group || ""}
                onChange={handleChange}
                className="p-3 border rounded w-full bg-white"
              >
                <option value="">Select Permit Group</option>
                <option value="GROUP A: Single / Duplex / Residential R-1, R-2">
                  GROUP A: Single / Duplex / Residential R-1, R-2
                </option>
                <option value="GROUP B: Hotel / Motel / Dormitory / Townhouse / Boardinghouse / Residential R-3, R-4, R-5">
                  GROUP B: Hotel / Motel / Dormitory / Townhouse / Boardinghouse / Residential R-3, R-4, R-5
                </option>
                <option value="GROUP C: School Building / Civic Center / Clubhouse / School Auditorium / Gymnasium / Church, Mosque, Temple, Chapel">
                  GROUP C: School Building / Civic Center / Clubhouse / School Auditorium / Gymnasium / Church, Mosque, Temple, Chapel
                </option>
                <option value="GROUP D: Hospital / Home for the Aged / Government Office">
                  GROUP D: Hospital / Home for the Aged / Government Office
                </option>
                <option value="GROUP E: Bank / Store / Shopping Center / Mall / Dining Establishment / Shop">
                  GROUP E: Bank / Store / Shopping Center / Mall / Dining Establishment / Shop
                </option>
                <option value="GROUP F: Factory / Plant (Non-Explosive)">
                  GROUP F: Factory / Plant (Non-Explosive)
                </option>
                <option value="GROUP G: Warehouse / Factory (Hazardous / Highly Flammable)">
                  GROUP G: Warehouse / Factory (Hazardous / Highly Flammable)
                </option>
                <option value="GROUP H: Theater / Auditorium / Convention Hall / Grandstand / Bleacher">
                  GROUP H: Theater / Auditorium / Convention Hall / Grandstand / Bleacher
                </option>
                <option value="GROUP I: Coliseum / Sports Complex / Convention Center and Similar Structure">
                  GROUP I: Coliseum / Sports Complex / Convention Center and Similar Structure
                </option>
                <option value="GROUP J-1: Barn / Granary / Poultry House / Piggery / Grain Mill / Grain Silo">
                  GROUP J-1: Barn / Granary / Poultry House / Piggery / Grain Mill / Grain Silo
                </option>
                <option value="GROUP J-2: Private Carport / Garage / Tower / Swimming Pool / Fence / Steel / Concrete Tank">
                  GROUP J-2: Private Carport / Garage / Tower / Swimming Pool / Fence / Steel / Concrete Tank
                </option>
                <option value="Others">Others</option>
              </select>
            </div>

            {/* Use of Permit */}
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Specify Permit use</label>
              <input
                type="text"
                name="use_of_permit"
                value={formData.use_of_permit || ""}
                onChange={handleChange}
                placeholder="E.g Hotel"
                className="p-3 border rounded w-full"
              />
            </div>

            {/* Proposed Date of Construction */}
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Proposed Date of Construction</label>
              <input
                type="date"
                name="proposed_date_of_construction"
                value={formData.proposed_date_of_construction || ""}
                onChange={handleChange}
                className="p-3 border rounded w-full"
              />
            </div>

            {/* Expected Date of Completion */}
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Expected Date of Completion</label>
              <input
                type="date"
                name="expected_date_of_completion"
                value={formData.expected_date_of_completion || ""}
                onChange={handleChange}
                className="p-3 border rounded w-full"
              />
            </div>

            {/* Total Estimated Cost */}
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Total Estimated Cost</label>
              <input
                type="number"
                name="total_estimated_cost"
                value={formData.total_estimated_cost || ""}
                onChange={handleChange}
                placeholder="Enter total estimated cost"
                className="p-3 border rounded w-full"
              />
            </div>
          </div>
        </div>
      );

      // ====== Step 3: Project Site ======
      case 3: return (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold mb-4">{steps[2].title}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Lot Number */}
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Lot Number</label>
              <input
                type="number"
                name="lot_no"
                value={formData.lot_no || ""}
                onChange={handleChange}
                placeholder="Enter Lot Number"
                className="p-3 border rounded w-full"
              />
            </div>

            {/* Block Number */}
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Block Number</label>
              <input
                type="number"
                name="blk_no"
                value={formData.blk_no || ""}
                onChange={handleChange}
                placeholder="Enter Block Number"
                className="p-3 border rounded w-full"
              />
            </div>

            {/* Street */}
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Street</label>
              <input
                type="text"
                name="street"
                value={formData.street || ""}
                onChange={handleChange}
                placeholder="Enter Street"
                className="p-3 border rounded w-full"
              />
            </div>

            {/* Barangay */}
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Barangay</label>
              <input
                type="text"
                name="barangay"
                value={formData.barangay || ""}
                onChange={handleChange}
                placeholder="Enter Barangay"
                className="p-3 border rounded w-full"
              />
            </div>

            {/* City / Municipality */}
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">City / Municipality</label>
              <input
                type="text"
                name="city_municipality"
                value={formData.city_municipality || ""}
                onChange={handleChange}
                placeholder="Enter City or Municipality"
                className="p-3 border rounded w-full"
              />
            </div>

            {/* Province */}
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Province</label>
              <input
                type="text"
                name="province"
                value={formData.province || ""}
                onChange={handleChange}
                placeholder="Enter Province"
                className="p-3 border rounded w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">TCT Number</label>
              <input
                type="number"
                name="tct_no"
                value={formData.tct_no || ""}
                onChange={handleChange}
                placeholder="Enter TCT Number"
                className="p-3 border rounded w-full"
              />
            </div>

            {/* Tax Declaration Number */}
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Tax Declaration Number</label>
              <input
                type="number"
                name="tax_dec_no"
                value={formData.tax_dec_no || ""}
                onChange={handleChange}
                placeholder="Enter Tax Declaration Number"
                className="p-3 border rounded w-full"
              />
            </div>
          </div>
        </div>
      );

      // ====== Step 4: Occupancy & Cost ======
      case 4: return (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold mb-4">{steps[3].title}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Number of Units */}
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Number of Units</label>
              <input
                type="number"
                name="number_of_units"
                value={formData.number_of_units || ""}
                onChange={handleChange}
                placeholder="Enter number of units"
                className="p-3 border rounded w-full"
              />
            </div>

            {/* Number of Storeys */}
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Number of Storeys</label>
              <input
                type="number"
                name="number_of_storeys"
                value={formData.number_of_storeys || ""}
                onChange={handleChange}
                placeholder="Enter number of storeys"
                className="p-3 border rounded w-full"
              />
            </div>

            {/* Total Floor Area */}
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Total Floor Area</label>
              <input
                type="number"
                name="total_floor_area"
                value={formData.total_floor_area || ""}
                onChange={handleChange}
                placeholder="Enter total floor area"
                className="p-3 border rounded w-full"
              />
            </div>

            {/* Lot Area */}
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Lot Area</label>
              <input
                type="number"
                name="lot_area"
                value={formData.lot_area || ""}
                onChange={handleChange}
                placeholder="Enter lot area"
                className="p-3 border rounded w-full"
              />
            </div>

            {/* Building Cost */}
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Building Cost</label>
              <input
                type="number"
                name="building_cost"
                value={formData.building_cost || ""}
                onChange={handleChange}
                placeholder="Enter building cost"
                className="p-3 border rounded w-full"
              />
            </div>

            {/* Electrical Cost */}
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Electrical Cost</label>
              <input
                type="number"
                name="electrical_cost"
                value={formData.electrical_cost || ""}
                onChange={handleChange}
                placeholder="Enter electrical cost"
                className="p-3 border rounded w-full"
              />
            </div>

            {/* Mechanical Cost */}
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Mechanical Cost</label>
              <input
                type="number"
                name="mechanical_cost"
                value={formData.mechanical_cost || ""}
                onChange={handleChange}
                placeholder="Enter mechanical cost"
                className="p-3 border rounded w-full"
              />
            </div>

            {/* Electronics Cost */}
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Electronics Cost</label>
              <input
                type="number"
                name="electronics_cost"
                value={formData.electronics_cost || ""}
                onChange={handleChange}
                placeholder="Enter electronics cost"
                className="p-3 border rounded w-full"
              />
            </div>

            {/* Plumbing Cost */}
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Plumbing Cost</label>
              <input
                type="number"
                name="plumbing_cost"
                value={formData.plumbing_cost || ""}
                onChange={handleChange}
                placeholder="Enter plumbing cost"
                className="p-3 border rounded w-full"
              />
            </div>

            {/* Equipment Cost */}
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Equipment Cost</label>
              <input
                type="number"
                name="equipment_cost"
                value={formData.equipment_cost || ""}
                onChange={handleChange}
                placeholder="Enter equipment cost"
                className="p-3 border rounded w-full"
              />
            </div>

            {/* Proposed Start Date */}
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Proposed Start Date</label>
              <input
                type="date"
                name="proposed_start"
                value={formData.proposed_start || ""}
                onChange={handleChange}
                className="p-3 border rounded w-full"
              />
            </div>

            {/* Expected Completion Date */}
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Expected Completion Date</label>
              <input
                type="date"
                name="expected_completion"
                value={formData.expected_completion || ""}
                onChange={handleChange}
                className="p-3 border rounded w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Other Cost</label>
              <input
                type="number"
                name="other_cost"
                value={formData.other_cost || ""}
                onChange={handleChange}
                placeholder="Enter other cost"
                className="p-3 border rounded w-full"
              />
            </div>
          </div>
        </div>
      );

      // ====== Step 5: Other Requirements & Professionals ======
      case 5: return (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold mb-4">{steps[4].title}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Professional Title */}
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Professional Title</label>
              <select
                name="professional_title"
                value={formData.professional_title || ""}
                onChange={handleChange}
                className="w-full p-3 border rounded"
              >
                <option value="">Select Professional Title</option>
                <option value="Architect">Architect</option>
                <option value="Civil Engineer">Civil Engineer</option>
                <option value="Electronics and Communications Engineering">Electronics and Communications Engineering</option>
                <option value="Electronics Engineer">Electronics Engineer</option>
                <option value="Geodetic Engineer">Geodetic Engineer</option>
                <option value="Interior Designer">Interior Designer</option>
                <option value="Master Electrician">Master Electrician</option>
                <option value="Master Plumber">Master Plumber</option>
                <option value="Mechanical Engineer">Mechanical Engineer</option>
                <option value="Professional Electrical Engineer">Professional Electrical Engineer</option>
                <option value="Professional Electronics Engineer">Professional Electronics Engineer</option>
                <option value="Professional Mechanical Engineer">Professional Mechanical Engineer</option>
                <option value="Registered Electrical Engineer">Registered Electrical Engineer</option>
                <option value="Sanitary Engineer">Sanitary Engineer</option>
              </select>
            </div>

            {/* Professional Name */}
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Professional Name</label>
              <input
                type="text"
                name="professional_name"
                value={formData.professional_name || ""}
                onChange={handleChange}
                placeholder="Enter Professional Name"
                className="p-3 border rounded w-full"
              />
            </div>

            {/* PRC Number */}
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">PRC Number</label>
              <input
                type="number"
                name="prc_no"
                value={formData.prc_no || ""}
                onChange={handleChange}
                placeholder="Enter PRC Number"
                className="p-3 border rounded w-full"
              />
            </div>

            {/* PTR Number */}
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">PTR Number</label>
              <input
                type="number"
                name="ptr_no"
                value={formData.ptr_no || ""}
                onChange={handleChange}
                placeholder="Enter PTR Number"
                className="p-3 border rounded w-full"
              />
            </div>

            {/* Government ID Number */}
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Government ID Number</label>
              <input
                type="number"
                name="gov_id_no"
                value={formData.gov_id_no || ""}
                onChange={handleChange}
                placeholder="Enter Government ID Number"
                className="p-3 border rounded w-full"
              />
            </div>

            {/* Date Issued */}
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Date Issued</label>
              <input
                type="date"
                name="date_issued"
                value={formData.date_issued || ""}
                onChange={handleChange}
                className="p-3 border rounded w-full"
              />
            </div>

            {/* Place Issued */}
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Place Issued</label>
              <input
                type="text"
                name="place_issued"
                value={formData.place_issued || ""}
                onChange={handleChange}
                placeholder="Enter Place Issued"
                className="p-3 border rounded w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Remarks</label>
              <input
                type="text"
                name="remarks"
                value={formData.remarks || ""}
                onChange={handleChange}
                placeholder="Enter remarks"
                className="p-3 border rounded w-full"
              />
            </div>

            {/* Professional Signature */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1 text-gray-700">Signature</label>
              <div className="flex items-center gap-3 p-3 border rounded w-full bg-white">
                <Upload className="w-5 h-5 text-gray-500" />
                <input
                  type="file"
                  name="signature"
                  onChange={handleChange}
                  className="w-full text-sm text-gray-700 file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-sm file:font-medium file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                />
              </div>
            </div>
          </div>
        </div>
      );

      default: return null;
    }
  };

  return (
    <div className="mx-1 mt-1 p-6 rounded-lg min-h-screen" style={{ background: '#fbfbfb', color: '#222' }}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-4xl font-bold" style={{ color: '#4a90e2' }}>Building Permit Application</h1>
          <p className="mt-2" style={{ color: '#9aa5b1' }}>Apply for a building permit. Fill out the required details below.</p>
        </div>
        
        {/* ✅ Change Type Button - Added to the right corner */}
        <button
          onClick={() => navigate('/user/building/type')}
          className="px-4 py-2 rounded-lg text-white font-semibold"
          style={{ background: '#4CAF50' }}
        >
          Change Type
        </button>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-2" style={{
                background: currentStep >= step.id ? '#4a90e2' : '#fff',
                borderColor: currentStep >= step.id ? '#4a90e2' : '#9aa5b1',
                color: currentStep >= step.id ? '#fff' : '#9aa5b1',
              }}>{step.id}</div>
              <div className="ml-3 hidden md:block">
                <p className="text-sm font-medium" style={{ color: currentStep >= step.id ? '#4a90e2' : '#9aa5b1' }}>{step.title}</p>
                <p className="text-xs" style={{ color: '#9aa5b1' }}>{step.description}</p>
              </div>
              {index < steps.length - 1 && <div className="hidden md:block w-16 h-0.5 mx-4" style={{ background: currentStep > step.id ? '#4a90e2' : '#9aa5b1' }}/>}
            </div>
          ))}
        </div>
      </div>

      {submitStatus && (
        <div className="p-4 mb-6 rounded" style={{
          background: submitStatus.type === 'success' ? '#e6f9ed' : '#fdecea',
          color: submitStatus.type === 'success' ? '#4caf50' : '#e53935',
          border: `1px solid ${submitStatus.type === 'success' ? '#4caf50' : '#e53935'}`,
        }}>
          {submitStatus.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {renderStepContent()}
        <div className="flex justify-between pt-6">
          {currentStep > 1 && <button type="button" onClick={prevStep} className="px-6 py-3 rounded-lg font-semibold" style={{ background: '#9aa5b1', color: '#fff', cursor: 'pointer' }}>Previous</button>}
          {currentStep < steps.length ? (
            <button type="button" onClick={nextStep} className="px-6 py-3 rounded-lg font-semibold" style={{ background: '#4a90e2', color: '#fff', cursor: 'pointer' }}>Next</button>
          ) : (
            <button type="submit" disabled={isSubmitting} className="px-6 py-3 rounded-lg font-semibold" style={{ background: isSubmitting ? '#9aa5b1' : '#4caf50', color: '#fff', cursor: isSubmitting ? 'not-allowed' : 'pointer' }}>
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}