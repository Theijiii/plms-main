import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

export default function OccupancyPermit() {
  const navigate = useNavigate();
  const API_BASE = "/backend/building_permit";
  const steps = [
    { id: 1, title: 'Project & Owner Info', description: 'Basic occupancy details' },
    { id: 2, title: 'Professional & Completion', description: 'Supervising professionals and completion certificates' },
    { id: 3, title: 'Ancillary Clearances', description: 'Certificates from specialty engineers' },
    { id: 4, title: 'Supporting Documents', description: 'Uploads and payment info' }
  ];

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Owner Info
    first_name: '',
    last_name: '',
    middle_initial: '',
    suffix: '',
    contact_no: '',
    email: '',
    citizenship: '',
    tin: '',
    home_address: '',
    form_of_ownership: '',
    // Project & Professional Info
    building_permit_number: '',
    professional_title: '',
    professional_name: '',
    prc_no: '',
    ptr_no: '',
    // Location
    lot_no: '',
    blk_no: '',
    street: '',
    barangay: '',
    city_municipality: '',
    province: '',
    tct_no: '',
    tax_dec_no: '',
    // Building Details
    permit_group: '',
    use_of_permit: '',
    number_of_units: '',
    number_of_storeys: '',
    total_floor_area: '',
    lot_area: '',
    // Supporting Documents
    signature: null,
    remarks: ''
  });
  const [submitStatus, setSubmitStatus] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "file" ? (files && files[0] ? files[0] : null) : (type === "text" || type === "email" || type === "tel" ? value.toUpperCase() : value),
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
      1: ['first_name', 'last_name', 'contact_no', 'email', 'building_permit_number'],
      2: ['professional_title', 'professional_name', 'prc_no', 'ptr_no'],
      3: ['lot_no', 'blk_no', 'street', 'barangay', 'city_municipality', 'province'],
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
      title: 'Submit Occupancy Permit?',
      text: 'Are you sure you want to submit this occupancy permit application?',
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
      html: 'Please wait while we process your occupancy permit application.',
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
          title: 'Application Submitted!',
          html: `<p>Your occupancy permit application has been submitted successfully.</p>
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
          text: data.message || 'Failed to submit application. Please try again.',
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
            <div>
              <h3 className="text-xl font-semibold mb-2" style={{ color: COLORS.secondary, fontFamily: COLORS.font }}>{steps[0].title}</h3>
              <p className="text-sm text-gray-600 mb-4">{steps[0].description}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: COLORS.secondary, fontFamily: COLORS.font }}>First Name <span className="text-red-500">*</span></label>
                <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} placeholder="Enter first name" className="p-3 border border-black rounded-lg w-full uppercase" style={{ color: COLORS.secondary, fontFamily: COLORS.font }} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: COLORS.secondary, fontFamily: COLORS.font }}>Last Name <span className="text-red-500">*</span></label>
                <input type="text" name="last_name" value={formData.last_name} onChange={handleChange} placeholder="Enter last name" className="p-3 border border-black rounded-lg w-full uppercase" style={{ color: COLORS.secondary, fontFamily: COLORS.font }} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: COLORS.secondary, fontFamily: COLORS.font }}>Contact Number <span className="text-red-500">*</span></label>
                <input type="tel" name="contact_no" value={formData.contact_no} onChange={handleChange} placeholder="09XXXXXXXXX" className="p-3 border border-black rounded-lg w-full uppercase" style={{ color: COLORS.secondary, fontFamily: COLORS.font }} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: COLORS.secondary, fontFamily: COLORS.font }}>Email Address <span className="text-red-500">*</span></label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="email@example.com" className="p-3 border border-black rounded-lg w-full uppercase" style={{ color: COLORS.secondary, fontFamily: COLORS.font }} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: COLORS.secondary, fontFamily: COLORS.font }}>Building Permit Reference Number <span className="text-red-500">*</span></label>
                <input type="text" name="building_permit_number" value={formData.building_permit_number} onChange={handleChange} placeholder="Enter permit number" className="p-3 border border-black rounded-lg w-full uppercase" style={{ color: COLORS.secondary, fontFamily: COLORS.font }} />
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-2" style={{ color: COLORS.secondary, fontFamily: COLORS.font }}>{steps[1].title}</h3>
              <p className="text-sm text-gray-600 mb-4">{steps[1].description}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: COLORS.secondary, fontFamily: COLORS.font }}>Professional Title <span className="text-red-500">*</span></label>
                <select name="professional_title" value={formData.professional_title} onChange={handleChange} className="p-3 border border-black rounded-lg w-full" style={{ color: COLORS.secondary, fontFamily: COLORS.font }}>
                  <option value="">Select Professional Title</option>
                  <option value="Architect">Architect</option>
                  <option value="Civil Engineer">Civil Engineer</option>
                  <option value="Structural Engineer">Structural Engineer</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: COLORS.secondary, fontFamily: COLORS.font }}>Professional Name <span className="text-red-500">*</span></label>
                <input type="text" name="professional_name" value={formData.professional_name} onChange={handleChange} placeholder="Enter professional name" className="p-3 border border-black rounded-lg w-full uppercase" style={{ color: COLORS.secondary, fontFamily: COLORS.font }} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: COLORS.secondary, fontFamily: COLORS.font }}>PRC Number <span className="text-red-500">*</span></label>
                <input type="text" name="prc_no" value={formData.prc_no} onChange={handleChange} placeholder="Enter PRC number" className="p-3 border border-black rounded-lg w-full uppercase" style={{ color: COLORS.secondary, fontFamily: COLORS.font }} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: COLORS.secondary, fontFamily: COLORS.font }}>PTR Number <span className="text-red-500">*</span></label>
                <input type="text" name="ptr_no" value={formData.ptr_no} onChange={handleChange} placeholder="Enter PTR number" className="p-3 border border-black rounded-lg w-full uppercase" style={{ color: COLORS.secondary, fontFamily: COLORS.font }} />
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-2" style={{ color: COLORS.secondary, fontFamily: COLORS.font }}>{steps[2].title}</h3>
              <p className="text-sm text-gray-600 mb-4">{steps[2].description}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: COLORS.secondary, fontFamily: COLORS.font }}>Lot Number <span className="text-red-500">*</span></label>
                <input type="text" name="lot_no" value={formData.lot_no} onChange={handleChange} placeholder="Lot No." className="p-3 border border-black rounded-lg w-full uppercase" style={{ color: COLORS.secondary, fontFamily: COLORS.font }} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: COLORS.secondary, fontFamily: COLORS.font }}>Block Number <span className="text-red-500">*</span></label>
                <input type="text" name="blk_no" value={formData.blk_no} onChange={handleChange} placeholder="Block No." className="p-3 border border-black rounded-lg w-full uppercase" style={{ color: COLORS.secondary, fontFamily: COLORS.font }} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: COLORS.secondary, fontFamily: COLORS.font }}>Street <span className="text-red-500">*</span></label>
                <input type="text" name="street" value={formData.street} onChange={handleChange} placeholder="Street" className="p-3 border border-black rounded-lg w-full uppercase" style={{ color: COLORS.secondary, fontFamily: COLORS.font }} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: COLORS.secondary, fontFamily: COLORS.font }}>Barangay <span className="text-red-500">*</span></label>
                <input type="text" name="barangay" value={formData.barangay} onChange={handleChange} placeholder="Barangay" className="p-3 border border-black rounded-lg w-full uppercase" style={{ color: COLORS.secondary, fontFamily: COLORS.font }} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: COLORS.secondary, fontFamily: COLORS.font }}>City / Municipality <span className="text-red-500">*</span></label>
                <input type="text" name="city_municipality" value={formData.city_municipality} onChange={handleChange} placeholder="City/Municipality" className="p-3 border border-black rounded-lg w-full uppercase" style={{ color: COLORS.secondary, fontFamily: COLORS.font }} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: COLORS.secondary, fontFamily: COLORS.font }}>Province <span className="text-red-500">*</span></label>
                <input type="text" name="province" value={formData.province} onChange={handleChange} placeholder="Province" className="p-3 border border-black rounded-lg w-full uppercase" style={{ color: COLORS.secondary, fontFamily: COLORS.font }} />
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-2" style={{ color: COLORS.secondary, fontFamily: COLORS.font }}>{steps[3].title}</h3>
              <p className="text-sm text-gray-600 mb-4">{steps[3].description}</p>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: COLORS.secondary, fontFamily: COLORS.font }}>Signature <span className="text-red-500">*</span></label>
                <div className="flex items-center gap-3 p-3 border border-black rounded-lg w-full bg-white">
                  <Upload className="w-5 h-5 text-gray-500" />
                  <input
                    type="file"
                    name="signature"
                    onChange={handleChange}
                    accept="image/*"
                    className="w-full text-sm file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-sm file:font-medium file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                    style={{ color: COLORS.secondary, fontFamily: COLORS.font }}
                  />
                </div>
              </div>
              <div>
                <label className="block mb-2 font-medium">Real Property Tax Receipt *</label>
                <input type="text" name="real_property_tax" value={formData.real_property_tax} onChange={handleChange} className="w-full p-3 border rounded-lg" required />
              </div>
              <div>
                <label className="block mb-2 font-medium">Barangay Clearance *</label>
                <input type="text" name="barangay_clearance" value={formData.barangay_clearance} onChange={handleChange} className="w-full p-3 border rounded-lg" required />
              </div>
              <div>
                <label className="block mb-2 font-medium">Payment Receipt *</label>
                <input type="text" name="payment_receipt" value={formData.payment_receipt} onChange={handleChange} className="w-full p-3 border rounded-lg" required />
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
          <h1 className="text-2xl md:text-4xl font-bold" style={{ color: COLORS.primary, fontFamily: COLORS.font }}>Occupancy Permit Application</h1>
          <p className="mt-2" style={{ color: COLORS.secondary, fontFamily: COLORS.font }}>
            Grants authorization from the Office of the Building Official to use and occupy a completed building or structure.
          </p>
        </div>
        <button
          onClick={() => navigate('/user/building/type')}
          className="px-4 py-2 rounded-lg font-semibold text-white transition-all duration-300 hover:shadow-lg"
          style={{ background: COLORS.success, fontFamily: COLORS.font }}
          onMouseEnter={e => e.currentTarget.style.background = COLORS.accent}
          onMouseLeave={e => e.currentTarget.style.background = COLORS.success}
        >
          Change Type
        </button>
      </div>

      <div className="mb-8 bg-white p-6 rounded-xl shadow-sm">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className="flex items-center justify-center w-12 h-12 rounded-full border-2 font-bold transition-all duration-300" style={{
                background: currentStep >= step.id ? COLORS.primary : '#fff',
                borderColor: currentStep >= step.id ? COLORS.primary : '#E5E7EB',
                color: currentStep >= step.id ? '#fff' : '#9CA3AF',
                fontFamily: COLORS.font,
                boxShadow: currentStep === step.id ? '0 4px 12px rgba(74, 144, 226, 0.3)' : 'none'
              }}>{step.id}</div>
              <div className="ml-3 hidden md:block">
                <p className="text-sm font-semibold" style={{ color: currentStep >= step.id ? COLORS.primary : '#6B7280', fontFamily: COLORS.font }}>{step.title}</p>
                <p className="text-xs text-gray-500" style={{ fontFamily: COLORS.font }}>{step.description}</p>
              </div>
              {index < steps.length - 1 && <div className="hidden md:block w-16 h-0.5 mx-4 transition-all duration-300" style={{ background: currentStep > step.id ? COLORS.primary : '#E5E7EB' }} />}
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          {renderStepContent()}
        </div>

        <div className="flex justify-between pt-6 bg-white p-6 rounded-xl shadow-sm">
          {currentStep > 1 && (
            <button
              type="button"
              onClick={prevStep}
              className="px-8 py-3 rounded-lg font-semibold text-white transition-all duration-300 hover:shadow-lg flex items-center gap-2"
              style={{ background: '#6B7280', fontFamily: COLORS.font }}
              onMouseEnter={e => e.currentTarget.style.background = '#4B5563'}
              onMouseLeave={e => e.currentTarget.style.background = '#6B7280'}
            >
              ← Previous
            </button>
          )}
          <div className={currentStep === 1 ? 'ml-auto' : ''}>
            {currentStep < steps.length ? (
              <button
                type="button"
                onClick={nextStep}
                className="px-8 py-3 rounded-lg font-semibold text-white transition-all duration-300 hover:shadow-lg flex items-center gap-2"
                style={{ background: COLORS.primary, fontFamily: COLORS.font }}
                onMouseEnter={e => e.currentTarget.style.background = COLORS.accent}
                onMouseLeave={e => e.currentTarget.style.background = COLORS.primary}
              >
                Next →
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-8 py-3 rounded-lg font-semibold text-white transition-all duration-300 ${!isSubmitting && 'hover:shadow-lg'} ${isSubmitting ? 'cursor-not-allowed opacity-60' : ''}`}
                style={{ background: isSubmitting ? '#9CA3AF' : COLORS.success, fontFamily: COLORS.font }}
                onMouseEnter={e => { if (!isSubmitting) e.currentTarget.style.background = COLORS.accent; }}
                onMouseLeave={e => { if (!isSubmitting) e.currentTarget.style.background = COLORS.success; }}
              >
                {isSubmitting ? '⏳ Submitting...' : '✓ Submit Application'}
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
