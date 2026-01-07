import React from 'react';

export default function FranchiseRenewal() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const permitType = state?.permitType || 'RENEWAL';

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    // Step 1: Renewal Information
    permit_type: permitType,
    renewal_date: new Date().toISOString().split('T')[0],
    franchise_number: '',

  // Step 2: Applicant Information
  first_name: '',
  middle_initial: '',
  last_name: '',
    contact_number: '',
    email: '',

    // Step 3: Attachments
    attachments: []
  });

  // Requirements list (customize as needed)
  const requirements = [
    'Previous Franchise Permit',
    'Proof of Payment',
    'Valid ID of Owner',
    'Updated Business Registration',
    'Other Supporting Documents'
  ];

  const steps = [
    { id: 1, title: 'Renewal Information', description: 'Franchise renewal details' },
    { id: 2, title: 'Applicant Information', description: 'Personal details' },
    { id: 3, title: 'Requirements Upload', description: 'Upload renewal documents' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({ ...prev, attachments: Array.from(e.target.files) }));
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowModal(true);
  };

  const confirmSubmit = async () => {
    setIsSubmitting(true);
    setShowModal(false);
    try {
      const form = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'attachments' && Array.isArray(value)) {
          value.forEach((file, idx) => {
            form.append(`attachments[${idx}]`, file);
          });
        } else {
          form.append(key, value);
        }
      });
      const response = await fetch('/api/Franchise-permit/renewal', {
        method: 'POST',
        body: form
      });
      const data = await response.json();
      if (data.success) {
        setSubmitStatus({ type: 'success', message: 'Renewal submitted successfully!' });
        setTimeout(() => {
          navigate('/user/dashboard');
        }, 2000);
      } else {
        setSubmitStatus({ type: 'error', message: data.message });
      }
    } catch (error) {
      setSubmitStatus({ type: 'error', message: 'Failed to submit renewal' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold mb-4">Renewal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 font-medium">Franchise Number *</label>
                <input
                  type="text"
                  name="franchise_number"
                  value={formData.franchise_number}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block mb-2 font-medium">Renewal Date</label>
                <input
                  type="date"
                  name="renewal_date"
                  value={formData.renewal_date}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-lg"
                  required
                />
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
                <label className="block mb-2 font-medium">Name *</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} placeholder="First Name *" className="p-3 border rounded-lg" required />
                  <input type="text" name="middle_initial" value={formData.middle_initial} onChange={handleChange} placeholder="M.I." className="p-3 border rounded-lg" maxLength={1} />
                  <input type="text" name="last_name" value={formData.last_name} onChange={handleChange} placeholder="Last Name *" className="p-3 border rounded-lg" required />
                </div>
              </div>
              <div>
                <label className="block mb-2 font-medium">Contact Number *</label>
                <input
                  type="tel"
                  name="contact_number"
                  value={formData.contact_number}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block mb-2 font-medium">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-lg"
                  required
                />
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold mb-4">Requirements Upload</h3>
            <ul className="mb-4 list-disc pl-6 text-gray-700">
              {requirements.map((req, idx) => (
                <li key={idx}>{req}</li>
              ))}
            </ul>
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              className="block w-full p-3 border rounded-lg bg-gray-50"
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
            />
            {formData.attachments && formData.attachments.length > 0 && (
              <div className="mt-2 text-sm text-gray-600">
                <strong>Selected files:</strong>
                <ul className="list-disc pl-6">
                  {formData.attachments.map((file, idx) => (
                    <li key={idx}>{file.name}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="mx-1 mt-1 p-6" style={{ background: '#fbfbfb', minHeight: '100vh', borderRadius: '0.75rem' }}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-4xl font-bold" style={{ color: '#4a90e2' }}>Franchise Permit Renewal</h1>
        </div>
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
                <p
                  className="text-sm font-medium"
                  style={{ color: currentStep >= step.id ? '#4a90e2' : '#9aa5b1' }}
                >
                  {step.title}
                </p>
                <p className="text-xs" style={{ color: '#9aa5b1' }}>{step.description}</p>
              </div>
              {index < steps.length - 1 && (
                <div
                  className="hidden md:block w-16 h-0.5 mx-4"
                  style={{ background: currentStep > step.id ? '#4a90e2' : '#9aa5b1' }}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {submitStatus && (
        <div
          className="p-4 mb-6 rounded"
          style={{ background: submitStatus.type === 'success' ? '#e6f4ea' : '#fdecea', color: submitStatus.type === 'success' ? '#4caf50' : '#d32f2f' }}
        >
          {submitStatus.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {renderStepContent()}

        <div className="flex justify-between pt-6">
          {currentStep > 1 && (
            <button
              type="button"
              onClick={prevStep}
              style={{ background: '#9aa5b1', color: 'white' }}
              className="px-6 py-3 rounded-lg font-semibold hover:bg-[#4a90e2]"
            >
              Previous
            </button>
          )}

          {currentStep < steps.length ? (
            <button
              type="button"
              onClick={nextStep}
              style={{ background: '#4a90e2', color: 'white' }}
              className="px-6 py-3 rounded-lg font-semibold hover:bg-[#4caf50]"
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              style={{ background: isSubmitting ? '#9aa5b1' : '#4caf50', color: 'white', cursor: isSubmitting ? 'not-allowed' : 'pointer' }}
              className="px-6 py-3 rounded-lg font-semibold"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Renewal'}
            </button>
          )}
        </div>
      </form>

      {/* Review & Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-3xl w-full" style={{ border: '2px solid #4a90e2' }}>
            <h2 className="text-xl font-bold mb-4" style={{ color: '#4a90e2' }}>Review your renewal</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[60vh] overflow-auto mb-6">
              {Object.entries(formData).map(([k, v]) => (
                <div key={k} className="p-3 border rounded">
                  <strong className="capitalize">{k.replace(/_/g, ' ')}:</strong>
                  <div className="text-sm break-words">{typeof v === 'object' && v !== null ? JSON.stringify(v) : String(v ?? '')}</div>
                </div>
              ))}
            </div>

            <div className="flex justify-between">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 rounded-lg font-semibold" style={{ background: '#9aa5b1', color: 'white' }}>Back to edit</button>
              <div className="flex gap-3">
                <button onClick={() => { setShowModal(false); setCurrentStep(1); }} className="px-4 py-2 rounded-lg font-semibold" style={{ background: '#f3f4f6', color: '#111' }}>Start over</button>
                <button onClick={confirmSubmit} className="px-4 py-2 rounded-lg font-semibold" style={{ background: '#4caf50', color: 'white' }} disabled={isSubmitting}>{isSubmitting ? 'Submitting...' : 'Confirm & Submit'}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
