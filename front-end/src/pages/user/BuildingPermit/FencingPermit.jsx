import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function FencingPermit() {
  const navigate = useNavigate();
  
  const steps = [
    { id: 1, title: 'Project & Owner Info', description: 'Basic fencing project details' },
    { id: 2, title: 'Professional & Contractor', description: 'Professional credentials' },
    { id: 3, title: 'Plans & Specifications', description: 'Fencing plans and specs' },
    { id: 4, title: 'Supporting Documents', description: 'Required uploads' }
  ];

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    owner_name: '',
    owner_contact: '',
    property_address: '',
    barangay_clearance: '',
    proof_of_ownership: '',
    authorization: '',
    professional_name: '',
    professional_role: '',
    prc_id: '',
    ptr_number: '',
    prc_expiry: '',
    contractor_name: '',
    surveyor_name: '',
    fence_type: '',
    fence_height: '',
    fence_materials: '',
    site_plan: false,
    fence_elevations: false,
    structural_details: false,
    bill_of_materials: false,
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
      setSubmitStatus({ type: 'success', message: 'Fencing permit application submitted!' });
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
                <label className="block mb-2 font-medium">Proof of Ownership</label>
                <input type="text" name="proof_of_ownership" value={formData.proof_of_ownership} onChange={handleChange} className="w-full p-3 border rounded-lg" />
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
                <label className="block mb-2 font-medium">Professional Name *</label>
                <input type="text" name="professional_name" value={formData.professional_name} onChange={handleChange} className="w-full p-3 border rounded-lg" required />
              </div>
              <div>
                <label className="block mb-2 font-medium">Role *</label>
                <select name="professional_role" value={formData.professional_role} onChange={handleChange} className="w-full p-3 border rounded-lg" required>
                  <option value="">Select Role</option>
                  <option value="Architect">Architect</option>
                  <option value="Civil Engineer">Civil Engineer</option>
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
                <label className="block mb-2 font-medium">Surveyor Name</label>
                <input type="text" name="surveyor_name" value={formData.surveyor_name} onChange={handleChange} className="w-full p-3 border rounded-lg" />
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold mb-4">Plans & Specifications</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 font-medium">Fence Type *</label>
                <input type="text" name="fence_type" value={formData.fence_type} onChange={handleChange} className="w-full p-3 border rounded-lg" required />
              </div>
              <div>
                <label className="block mb-2 font-medium">Fence Height *</label>
                <input type="text" name="fence_height" value={formData.fence_height} onChange={handleChange} className="w-full p-3 border rounded-lg" required />
              </div>
              <div>
                <label className="block mb-2 font-medium">Fence Materials *</label>
                <input type="text" name="fence_materials" value={formData.fence_materials} onChange={handleChange} className="w-full p-3 border rounded-lg" required />
              </div>
              <div>
                <label className="block mb-2 font-medium">Site Development Plan *</label>
                <input type="checkbox" name="site_plan" checked={formData.site_plan} onChange={handleChange} className="mr-2" />
                <span>Included</span>
              </div>
              <div>
                <label className="block mb-2 font-medium">Fence Elevations *</label>
                <input type="checkbox" name="fence_elevations" checked={formData.fence_elevations} onChange={handleChange} className="mr-2" />
                <span>Included</span>
              </div>
              <div>
                <label className="block mb-2 font-medium">Structural Details *</label>
                <input type="checkbox" name="structural_details" checked={formData.structural_details} onChange={handleChange} className="mr-2" />
                <span>Included</span>
              </div>
              <div>
                <label className="block mb-2 font-medium">Bill of Materials & Cost Estimate *</label>
                <input type="checkbox" name="bill_of_materials" checked={formData.bill_of_materials} onChange={handleChange} className="mr-2" />
                <span>Included</span>
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
          <h1 className="text-2xl md:text-4xl font-bold" style={{ color: '#4a90e2' }}>Fencing Permit Application</h1>
          <p className="mt-2" style={{ color: '#9aa5b1' }}>
            Apply for a fencing works permit. Please provide details about the fencing project and required documents.
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
