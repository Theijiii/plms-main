import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Upload } from "lucide-react";
import Swal from "sweetalert2";

const COLORS = {
  primary: '#4A90E2',
  secondary: '#000000',
  accent: '#FDA811',
  success: '#4CAF50',
  danger: '#E53935',
  background: '#FBFBFB',
  font: 'Montserrat, Arial, sans-serif'
};

export default function RenewalBuilding() {
    const navigate = useNavigate();
    const API_BASE = "/backend/building_permit";
  
  const steps = [
    { id: 1, title: 'Previous Permit Details', description: 'Your existing permit information' },
    { id: 2, title: 'Applicant Information', description: 'Personal details' },
    { id: 3, title: 'Updated Building Information', description: 'Changes to building details' },
    { id: 4, title: 'Uploads', description: 'Required documents' }
  ];

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Previous Permit Details
    previous_permit_number: '',
    previous_permit_expiry: '',
    // Applicant Information
    first_name: '',
    middle_initial: '',
    last_name: '',
    suffix: '',
    contact_no: '',
    email: '',
    citizenship: '',
    tin: '',
    home_address: '',
    form_of_ownership: '',
    // Updated Building Information
    permit_group: '',
    use_of_permit: '',
    proposed_date_of_construction: '',
    expected_date_of_completion: '',
    total_estimated_cost: '',
    // Project Site
    lot_no: '',
    blk_no: '',
    tct_no: '',
    tax_dec_no: '',
    street: '',
    barangay: '',
    city_municipality: '',
    province: '',
    // Occupancy & Cost
    number_of_units: '',
    number_of_storeys: '',
    total_floor_area: '',
    lot_area: '',
    building_cost: '',
    electrical_cost: '',
    mechanical_cost: '',
    electronics_cost: '',
    plumbing_cost: '',
    other_cost: '',
    equipment_cost: '',
    proposed_start: '',
    expected_completion: '',
    // Professional Info
    professional_title: '',
    professional_name: '',
    prc_no: '',
    ptr_no: '',
    gov_id_no: '',
    date_issued: '',
    place_issued: '',
    remarks: '',
    signature: null
  });
  const [errors, setErrors] = useState({});
  const [submitStatus, setSubmitStatus] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "file" ? (files && files[0] ? files[0] : null) : value,
    }));
  };

  const nextStep = () => {
    const result = validateStep(currentStep);
    if (!result.ok) {
      Swal.fire({ icon: 'warning', title: 'Missing Fields', text: result.message, confirmButtonColor: COLORS.primary });
      return;
    }
    if (currentStep < steps.length) setCurrentStep(currentStep + 1);
  };
  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const validateStep = (step) => {
    const isEmpty = (value) => value === undefined || value === null || value === '' || (Array.isArray(value) && value.length === 0);
    const stepFields = {
      1: ['previous_permit_number', 'previous_permit_expiry'],
      2: ['first_name', 'last_name', 'contact_no', 'email', 'citizenship', 'tin', 'home_address', 'form_of_ownership'],
      3: ['permit_group', 'use_of_permit', 'lot_no', 'blk_no', 'street', 'barangay', 'city_municipality', 'province'],
      4: ['signature']
    };
    const missing = [];
    if (stepFields[step]) {
      stepFields[step].forEach(field => {
        if (isEmpty(formData[field])) missing.push(field.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()));
      });
    }
    if (missing.length) return { ok: false, message: "Missing: " + missing.join(", ") };
    return { ok: true };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = validateStep(currentStep);
    if (!result.ok) {
      Swal.fire({ icon: 'warning', title: 'Missing Fields', text: result.message, confirmButtonColor: COLORS.primary });
      return;
    }

    const confirm = await Swal.fire({
      title: 'Submit Renewal?',
      text: 'Are you sure you want to submit this building permit renewal application?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: COLORS.success,
      cancelButtonColor: '#9aa5b1',
      confirmButtonText: 'Yes, Submit',
      cancelButtonText: 'Cancel',
      reverseButtons: true
    });

    if (!confirm.isConfirmed) return;

    setIsSubmitting(true);

    Swal.fire({
      title: 'Submitting...',
      html: 'Please wait while we process your renewal application.',
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      didOpen: () => { Swal.showLoading(); }
    });

    try {
      const submitData = new FormData();

      Object.keys(formData).forEach(key => {
        const value = formData[key];
        if (value instanceof File || value instanceof FileList) return;
        if (Array.isArray(value)) return;
        if (value !== null && value !== undefined && value !== '') {
          submitData.append(key, value);
        }
      });

      if (formData.prc_no) {
        submitData.append('prc_license', formData.prc_no);
      }

      if (formData.signature) submitData.append("signature", formData.signature);

      const response = await fetch(`${API_BASE}/building_permit.php`, {
        method: "POST",
        body: submitData,
      });

      const data = await response.json();

      if (data.success) {
        Swal.fire({
          icon: 'success',
          title: 'Renewal Submitted!',
          html: `<p>Your building permit renewal application has been submitted successfully.</p>
                 <p style="margin-top:8px;"><strong>Application ID:</strong> ${data.data?.application_id || 'N/A'}</p>`,
          confirmButtonColor: COLORS.success,
          confirmButtonText: 'OK'
        }).then(() => {
          navigate('/user/building/type');
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Submission Failed',
          text: data.message || 'Failed to submit renewal application. Please try again.',
          confirmButtonColor: COLORS.danger
        });
      }
    } catch (err) {
      console.error('Submit error:', err);
      Swal.fire({
        icon: 'error',
        title: 'Network Error',
        text: 'Could not connect to the server. Please check your connection and try again.',
        confirmButtonColor: COLORS.danger
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
            <h3 className="text-xl font-semibold mb-4">Previous Permit Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 font-medium">Previous Permit Number *</label>
                <input type="text" name="previous_permit_number" value={formData.previous_permit_number} onChange={handleChange} className="w-full p-3 border rounded-lg" required />
              </div>
              <div>
                <label className="block mb-2 font-medium">Previous Permit Expiry *</label>
                <input type="date" name="previous_permit_expiry" value={formData.previous_permit_expiry} onChange={handleChange} className="w-full p-3 border rounded-lg" required />
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold mb-4">Applicant Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <NameFields formData={formData} handleChange={handleChange} errors={errors} required />
              </div>
              <div>
                <label className="block mb-2 font-medium">Contact Number *</label>
                <input type="tel" name="contact_number" value={formData.contact_number} onChange={handleChange} className={`w-full p-3 border rounded-lg ${errors.contact_number ? 'border-red-500' : ''}`} required />
                {errors.contact_number && <p className="text-red-600 text-sm">{errors.contact_number}</p>}
              </div>
              <div>
                <label className="block mb-2 font-medium">Email Address *</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full p-3 border rounded-lg" required />
              </div>
              <div>
                <label className="block mb-2 font-medium">Birth Date *</label>
                <input type="date" name="birth_date" value={formData.birth_date} onChange={handleChange} className="w-full p-3 border rounded-lg" required />
              </div>
              <div>
                <label className="block mb-2 font-medium">Gender *</label>
                <select name="gender" value={formData.gender} onChange={handleChange} className="w-full p-3 border rounded-lg" required>
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block mb-2 font-medium">Civil Status *</label>
                <select name="civil_status" value={formData.civil_status} onChange={handleChange} className="w-full p-3 border rounded-lg" required>
                  <option value="">Select Civil Status</option>
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                  <option value="Widowed">Widowed</option>
                  <option value="Divorced">Divorced</option>
                </select>
              </div>
              <div>
                <label className="block mb-2 font-medium">Nationality *</label>
                <input type="text" name="nationality" value={formData.nationality} onChange={handleChange} className="w-full p-3 border rounded-lg" required />
              </div>
              <div>
                <label className="block mb-2 font-medium">TIN</label>
                <input type="text" name="tin" value={formData.tin} onChange={handleChange} className="w-full p-3 border rounded-lg" />
              </div>
              <div>
                <label className="block mb-2 font-medium">SSS Number</label>
                <input type="text" name="sss_no" value={formData.sss_no} onChange={handleChange} className="w-full p-3 border rounded-lg" />
              </div>
              <div>
                <label className="block mb-2 font-medium">PhilHealth Number</label>
                <input type="text" name="philhealth_no" value={formData.philhealth_no} onChange={handleChange} className="w-full p-3 border rounded-lg" />
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold mb-4">Updated Building Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 font-medium">Building Name *</label>
                <input type="text" name="building_name" value={formData.building_name} onChange={handleChange} className="w-full p-3 border rounded-lg" required />
              </div>
              <div>
                <label className="block mb-2 font-medium">Trade Name</label>
                <input type="text" name="trade_name" value={formData.trade_name} onChange={handleChange} className="w-full p-3 border rounded-lg" />
              </div>
              <div>
                <label className="block mb-2 font-medium">Building Structure *</label>
                <select name="building_structure" value={formData.building_structure} onChange={handleChange} className="w-full p-3 border rounded-lg" required>
                  <option value="">Select Structure</option>
                  <option value="Sole Proprietorship">Sole Proprietorship</option>
                  <option value="Partnership">Partnership</option>
                  <option value="Corporation">Corporation</option>
                  <option value="Cooperative">Cooperative</option>
                </select>
              </div>
              <div>
                <label className="block mb-2 font-medium">Ownership Status *</label>
                <select name="ownership_status" value={formData.ownership_status} onChange={handleChange} className="w-full p-3 border rounded-lg" required>
                  <option value="">Select Status</option>
                  <option value="Owned">Owned</option>
                  <option value="Leased">Leased</option>
                  <option value="Rented">Rented</option>
                </select>
              </div>
              <div>
                <label className="block mb-2 font-medium">Registration Number</label>
                <input type="text" name="registration_number" value={formData.registration_number} onChange={handleChange} className="w-full p-3 border rounded-lg" />
              </div>
              <div>
                <label className="block mb-2 font-medium">Building Activity *</label>
                <input type="text" name="building_activity" value={formData.building_activity} onChange={handleChange} className="w-full p-3 border rounded-lg" required />
              </div>
              <div className="md:col-span-2">
                <label className="block mb-2 font-medium">Building Description *</label>
                <textarea name="building_description" value={formData.building_description} onChange={handleChange} rows="3" className="w-full p-3 border rounded-lg" required />
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold mb-4">Uploads</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block mb-2 font-medium">Upload Required Documents *</label>
                <input type="file" name="attachments" onChange={handleChange} className="w-full p-3 border rounded-lg" multiple required />
              </div>
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
          <h1 className="text-2xl md:text-4xl font-bold" style={{ color: '#4a90e2' }}>Renewal Building Permit</h1>
          <p className="mt-2" style={{ color: '#9aa5b1' }}>
            Renew your existing building permit here. Please provide your previous permit details and any updated information.
          </p>
        </div>
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
              <div
                className="flex items-center justify-center w-10 h-10 rounded-full border-2"
                style={{
                  background: currentStep >= step.id ? '#4a90e2' : '#fff',
                  borderColor: currentStep >= step.id ? '#4a90e2' : '#9aa5b1',
                  color: currentStep >= step.id ? '#fff' : '#9aa5b1',
                }}
              >
                {step.id}
              </div>
              <div className="ml-3 hidden md:block">
                <p className="text-sm font-medium" style={{ color: currentStep >= step.id ? '#4a90e2' : '#9aa5b1' }}>{step.title}</p>
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
        <div className="p-4 mb-6 rounded" style={{ background: submitStatus.type === 'success' ? '#e6f9ed' : '#fdecea', color: submitStatus.type === 'success' ? '#4caf50' : '#e53935', border: `1px solid ${submitStatus.type === 'success' ? '#4caf50' : '#e53935'}` }}>
          {submitStatus.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {renderStepContent()}
        <div className="flex justify-between pt-6">
          {currentStep > 1 && (
            <button type="button" onClick={prevStep} className="px-6 py-3 rounded-lg font-semibold" style={{ background: '#9aa5b1', color: '#fff' }}>
              Previous
            </button>
          )}
          {currentStep < steps.length ? (
            <button type="button" onClick={nextStep} className="px-6 py-3 rounded-lg font-semibold" style={{ background: '#4a90e2', color: '#fff' }}>
              Next
            </button>
          ) : (
            <button type="submit" disabled={isSubmitting} className="px-6 py-3 rounded-lg font-semibold" style={{ background: isSubmitting ? '#9aa5b1' : '#4caf50', color: '#fff', cursor: isSubmitting ? 'not-allowed' : 'pointer' }}>
              {isSubmitting ? 'Submitting...' : 'Submit Renewal'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
