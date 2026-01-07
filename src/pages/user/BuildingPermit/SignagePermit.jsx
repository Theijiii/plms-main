import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

export default function SignagePermit() {
    const navigate = useNavigate();

  const steps = [
    { id: 1, title: 'Applicant & Project Info', description: 'Basic signage project details' },
    { id: 2, title: 'Design & Plans', description: 'Signage design, plans, and computations' },
    { id: 3, title: 'Clearances & Documents', description: 'Required uploads and clearances' },
    { id: 4, title: 'Payment & Submission', description: 'Payment and final submission' }
  ];

  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    first_name: '',
    middle_initial: '',
    last_name: '',
    suffix: '',
    applicant_contact: '',
    business_name: '',
    building_address: '',
    owner_consent: null,
    barangay_clearance: '',
    business_permit: '',
    sec_dti_registration: '',
    location_sketch: null,
    site_photos: null,
    signage_design: null,
    signage_plans: null,
    structural_computation: null,
    electrical_layout: null,
    bill_of_materials: null,
    fire_safety_clearance: null,
    tax_declaration: '',
    real_property_tax: '',
    payment_receipt: '',
    attachments: []
  });
  const [submitStatus, setSubmitStatus] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setFormData((prev) => ({ ...prev, [name]: files }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const nextStep = () => {
    if (currentStep === 1) {
      const e = {};
      if (!formData.first_name || formData.first_name.trim() === '') e.first_name = 'First name is required';
      if (!formData.last_name || formData.last_name.trim() === '') e.last_name = 'Last name is required';
      if (!formData.applicant_contact || formData.applicant_contact.trim() === '') e.applicant_contact = 'Contact is required';
      if (!formData.building_address || formData.building_address.trim() === '') e.building_address = 'Building address is required';
      if (Object.keys(e).length > 0) {
        setErrors(e);
        return;
      }
      setErrors({});
    }

    if (currentStep < steps.length) setCurrentStep(currentStep + 1);
  };
  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setSubmitStatus({ type: 'success', message: 'Signage permit application submitted!' });
      setIsSubmitting(false);
    }, 1500);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold mb-4">Applicant & Project Info</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <NameFields formData={formData} handleChange={handleChange} errors={errors} required />
              </div>
              <div>
                <label className="block mb-2 font-medium">Applicant Contact *</label>
                <input type="text" name="applicant_contact" value={formData.applicant_contact} onChange={handleChange} className={`w-full p-3 border rounded-lg ${errors.applicant_contact ? 'border-red-500' : ''}`} required />
                {errors.applicant_contact && <p className="text-red-600 text-sm">{errors.applicant_contact}</p>}
              </div>
              <div>
                <label className="block mb-2 font-medium">Business Name</label>
                <input type="text" name="business_name" value={formData.business_name} onChange={handleChange} className="w-full p-3 border rounded-lg" />
              </div>
              <div>
                <label className="block mb-2 font-medium">Building Address *</label>
                <input type="text" name="building_address" value={formData.building_address} onChange={handleChange} className={`w-full p-3 border rounded-lg ${errors.building_address ? 'border-red-500' : ''}`} required />
                {errors.building_address && <p className="text-red-600 text-sm">{errors.building_address}</p>}
              </div>
              <div>
                <label className="block mb-2 font-medium">Lot/Building Owner's Consent (if tenant)</label>
                <input type="file" name="owner_consent" onChange={handleChange} className="w-full p-3 border rounded-lg" />
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold mb-4">Design & Plans</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 font-medium">Location Sketch *</label>
                <input type="file" name="location_sketch" onChange={handleChange} className="w-full p-3 border rounded-lg" required />
              </div>
              <div>
                <label className="block mb-2 font-medium">Site Photographs *</label>
                <input type="file" name="site_photos" onChange={handleChange} className="w-full p-3 border rounded-lg" multiple required />
              </div>
              <div>
                <label className="block mb-2 font-medium">Signage Design *</label>
                <input type="file" name="signage_design" onChange={handleChange} className="w-full p-3 border rounded-lg" required />
              </div>
              <div>
                <label className="block mb-2 font-medium">Signage Plans (signed/sealed) *</label>
                <input type="file" name="signage_plans" onChange={handleChange} className="w-full p-3 border rounded-lg" required />
              </div>
              <div>
                <label className="block mb-2 font-medium">Structural Computation (if free-standing/large scale)</label>
                <input type="file" name="structural_computation" onChange={handleChange} className="w-full p-3 border rounded-lg" />
              </div>
              <div>
                <label className="block mb-2 font-medium">Electrical Layout (if with lighting/LED)</label>
                <input type="file" name="electrical_layout" onChange={handleChange} className="w-full p-3 border rounded-lg" />
              </div>
              <div>
                <label className="block mb-2 font-medium">Bill of Materials & Cost Estimate *</label>
                <input type="file" name="bill_of_materials" onChange={handleChange} className="w-full p-3 border rounded-lg" required />
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold mb-4">Clearances & Documents</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 font-medium">Barangay Clearance *</label>
                <input type="text" name="barangay_clearance" value={formData.barangay_clearance} onChange={handleChange} className="w-full p-3 border rounded-lg" required />
              </div>
              <div>
                <label className="block mb-2 font-medium">Business Permit / SEC/DTI Registration</label>
                <input type="text" name="business_permit" value={formData.business_permit} onChange={handleChange} className="w-full p-3 border rounded-lg" />
                <input type="text" name="sec_dti_registration" value={formData.sec_dti_registration} onChange={handleChange} className="w-full p-3 border rounded-lg mt-2" />
              </div>
              <div>
                <label className="block mb-2 font-medium">Fire Safety Clearance (for illuminated/LED) *</label>
                <input type="file" name="fire_safety_clearance" onChange={handleChange} className="w-full p-3 border rounded-lg" required />
              </div>
              <div>
                <label className="block mb-2 font-medium">Tax Declaration *</label>
                <input type="text" name="tax_declaration" value={formData.tax_declaration} onChange={handleChange} className="w-full p-3 border rounded-lg" required />
              </div>
              <div>
                <label className="block mb-2 font-medium">Real Property Tax Receipt *</label>
                <input type="text" name="real_property_tax" value={formData.real_property_tax} onChange={handleChange} className="w-full p-3 border rounded-lg" required />
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold mb-4">Payment & Submission</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 font-medium">Payment Receipt *</label>
                <input type="text" name="payment_receipt" value={formData.payment_receipt} onChange={handleChange} className="w-full p-3 border rounded-lg" required />
              </div>
              <div>
                <label className="block mb-2 font-medium">Additional Attachments</label>
                <input type="file" name="attachments" onChange={handleChange} className="w-full p-3 border rounded-lg" multiple />
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
          <h1 className="text-2xl md:text-4xl font-bold" style={{ color: '#4a90e2' }}>Signage Permit Application</h1>
          <p className="mt-2" style={{ color: '#9aa5b1' }}>
            To regulate the installation, construction, and display of signage, billboards, and outdoor advertisements within Quezon City. Ensures that signages are structurally safe, non-obstructive, and compliant with the National Building Code (PD 1096) and QC local ordinances. Prevents hazards to public safety, traffic flow, and city aesthetics.
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
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
