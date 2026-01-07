import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';


export default function DemolitionPermit() {
    const navigate = useNavigate();

  

  const steps = [
    { id: 1, title: 'Project & Owner Info', description: 'Basic demolition project details' },
    { id: 2, title: 'Professional & Contractor', description: 'Supervising professional and contractor' },
    { id: 3, title: 'Plans & Safety', description: 'Demolition plan and safety measures' },
    { id: 4, title: 'Supporting Documents', description: 'Required uploads' }
  ];

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    owner_name: '',
    owner_contact: '',
    property_address: '',
    tct_or_tax_dec: '',
    barangay_clearance: '',
    authorization: '',
    professional_name: '',
    professional_role: '',
    prc_id: '',
    ptr_number: '',
    prc_expiry: '',
    contractor_name: '',
    safety_officer: '',
    demolition_method: '',
    demolition_plan: false,
    safety_measures: false,
    bill_of_materials: false,
    cost_estimate: '',
    sketch_plan: false,
    ecc_clearance: '',
    payment_receipt: '',
    attachments: []
  });
  const [submitStatus, setSubmitStatus] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, files, checked } = e.target;
    if (type === 'file') {
      setFormData((prev) => ({ ...prev, attachments: files }));
    } else if (type === 'checkbox') {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const nextStep = () => {
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
      setSubmitStatus({ type: 'success', message: 'Demolition permit application submitted!' });
      setIsSubmitting(false);
    }, 1500);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold mb-4">Project & Owner Info</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 font-medium">Owner Name *</label>
                <input type="text" name="owner_name" value={formData.owner_name} onChange={handleChange} className="w-full p-3 border rounded-lg" required />
              </div>
              <div>
                <label className="block mb-2 font-medium">Owner Contact *</label>
                <input type="text" name="owner_contact" value={formData.owner_contact} onChange={handleChange} className="w-full p-3 border rounded-lg" required />
              </div>
              <div>
                <label className="block mb-2 font-medium">Property Address *</label>
                <input type="text" name="property_address" value={formData.property_address} onChange={handleChange} className="w-full p-3 border rounded-lg" required />
              </div>
              <div>
                <label className="block mb-2 font-medium">Barangay Clearance</label>
                <input type="text" name="barangay_clearance" value={formData.barangay_clearance} onChange={handleChange} className="w-full p-3 border rounded-lg" />
              </div>
              <div>
                <label className="block mb-2 font-medium">TCT / Tax Declaration</label>
                <input type="text" name="tct_or_tax_dec" value={formData.tct_or_tax_dec} onChange={handleChange} className="w-full p-3 border rounded-lg" />
              </div>
              <div>
                <label className="block mb-2 font-medium">Authorization / SPA</label>
                <input type="text" name="authorization" value={formData.authorization} onChange={handleChange} className="w-full p-3 border rounded-lg" />
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold mb-4">Professional & Contractor</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 font-medium">Supervising Professional Name *</label>
                <input type="text" name="professional_name" value={formData.professional_name} onChange={handleChange} className="w-full p-3 border rounded-lg" required />
              </div>
              <div>
                <label className="block mb-2 font-medium">Role *</label>
                <select name="professional_role" value={formData.professional_role} onChange={handleChange} className="w-full p-3 border rounded-lg" required>
                  <option value="">Select Role</option>
                  <option value="Civil Engineer">Civil Engineer</option>
                  <option value="Architect">Architect</option>
                </select>
              </div>
              <div>
                <label className="block mb-2 font-medium">PRC ID *</label>
                <input type="text" name="prc_id" value={formData.prc_id} onChange={handleChange} className="w-full p-3 border rounded-lg" required />
              </div>
              <div>
                <label className="block mb-2 font-medium">PTR Number *</label>
                <input type="text" name="ptr_number" value={formData.ptr_number} onChange={handleChange} className="w-full p-3 border rounded-lg" required />
              </div>
              <div>
                <label className="block mb-2 font-medium">PRC Expiry Date *</label>
                <input type="date" name="prc_expiry" value={formData.prc_expiry} onChange={handleChange} className="w-full p-3 border rounded-lg" required />
              </div>
              <div>
                <label className="block mb-2 font-medium">Contractor Name</label>
                <input type="text" name="contractor_name" value={formData.contractor_name} onChange={handleChange} className="w-full p-3 border rounded-lg" />
              </div>
              <div>
                <label className="block mb-2 font-medium">Safety Officer</label>
                <input type="text" name="safety_officer" value={formData.safety_officer} onChange={handleChange} className="w-full p-3 border rounded-lg" />
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold mb-4">Plans & Safety</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 font-medium">Demolition Method *</label>
                <input type="text" name="demolition_method" value={formData.demolition_method} onChange={handleChange} className="w-full p-3 border rounded-lg" required />
              </div>
              <div>
                <label className="block mb-2 font-medium">Demolition Plan Signed & Sealed *</label>
                <input type="checkbox" name="demolition_plan" checked={formData.demolition_plan} onChange={handleChange} className="mr-2" />
                <span>Uploaded</span>
              </div>
              <div>
                <label className="block mb-2 font-medium">Safety Measures *</label>
                <input type="checkbox" name="safety_measures" checked={formData.safety_measures} onChange={handleChange} className="mr-2" />
                <span>Included</span>
              </div>
              <div>
                <label className="block mb-2 font-medium">Sketch / Location Plan *</label>
                <input type="checkbox" name="sketch_plan" checked={formData.sketch_plan} onChange={handleChange} className="mr-2" />
                <span>Included</span>
              </div>
              <div>
                <label className="block mb-2 font-medium">Bill of Materials & Cost Estimate *</label>
                <input type="checkbox" name="bill_of_materials" checked={formData.bill_of_materials} onChange={handleChange} className="mr-2" />
                <span>Included</span>
              </div>
              <div>
                <label className="block mb-2 font-medium">Cost Estimate</label>
                <input type="text" name="cost_estimate" value={formData.cost_estimate} onChange={handleChange} className="w-full p-3 border rounded-lg" />
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold mb-4">Supporting Documents</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 font-medium">PRC ID & PTR *</label>
                <input type="file" name="attachments" onChange={handleChange} className="w-full p-3 border rounded-lg" multiple required />
              </div>
              <div>
                <label className="block mb-2 font-medium">ECC / DENR Clearance</label>
                <input type="text" name="ecc_clearance" value={formData.ecc_clearance} onChange={handleChange} className="w-full p-3 border rounded-lg" />
              </div>
              <div>
                <label className="block mb-2 font-medium">Payment Receipt</label>
                <input type="text" name="payment_receipt" value={formData.payment_receipt} onChange={handleChange} className="w-full p-3 border rounded-lg" />
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
          <h1 className="text-2xl md:text-4xl font-bold" style={{ color: '#4a90e2' }}>Demolition Permit Application</h1>
          <p className="mt-2" style={{ color: '#9aa5b1' }}>
            Apply for a demolition works permit. Please provide details about the demolition project and required documents.
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
