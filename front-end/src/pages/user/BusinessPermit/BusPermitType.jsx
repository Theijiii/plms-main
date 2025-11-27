import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft } from "lucide-react";

export default function BusPermitType({ business_permit_id }) {
  const [selectedType, setSelectedType] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isConfirmBackOpen, setIsConfirmBackOpen] = useState(false); // Back confirmation
  const [isBarangayModalOpen, setIsBarangayModalOpen] = useState(false); // Barangay permit modal
  const navigate = useNavigate();

  const application_type = [
    { id: 'NEW', title: 'NEW', description: 'Apply for a new business permit', color: 'bg-green-500 hover:bg-green-600' },
    { id: 'RENEWAL', title: 'RENEWAL', description: 'Renew your existing business permit', color: 'bg-blue-500 hover:bg-blue-600' },
    { id: 'SPECIAL', title: 'SPECIAL', description: 'Apply for special business permit or exemption', color: 'bg-purple-500 hover:bg-purple-600' },
    { id: 'LIQUOR_PERMIT', title: 'LIQUOR PERMIT', description: 'Apply for liquor license and related permits', color: 'bg-red-500 hover:bg-red-600' },
    { id: 'AMENDMENT', title: 'AMENDMENT', description: 'Make changes to your existing business permit', color: 'bg-yellow-500 hover:bg-yellow-600' },
  ];

  const handleTypeSelection = (typeId) => {
    setSelectedType(typeId);
    // Open Barangay Permit modal first
    setIsBarangayModalOpen(true);
  };

  const handleContinue = () => {
    setIsModalOpen(false);

    const routeMap = {
      RENEWAL: '/user/business/renewal',
      SPECIAL: '/user/business/special',
      LIQUOR_PERMIT: '/user/business/liquor',
      AMENDMENT: '/user/business/amendment',
    };
    
    navigate(routeMap[selectedType] || '/user/business/new', {
      state: { application_type: selectedType }
    });
  };

  return (
    <div className="mx-1 mt-1 p-6 dark:bg-slate-900 bg-white dark:text-slate-300 rounded-lg min-h-screen">
      <h1 className="text-2xl md:text-4xl font-bold mb-8 text-center">Business Permit Types</h1>
      <p className="mb-6 text-center">Please select the type of business permit you need to apply for</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full mt-6">
        {application_type.map((type) => (
          <div
            key={type.id}
            onClick={() => handleTypeSelection(type.id)}
            className={`cursor-pointer rounded-lg border px-5 py-4 transition-colors hover:border-blue-300 hover:bg-blue-100 shadow-lg shadow-blue-200/50 hover:shadow-blue-300/50 flex flex-col justify-between h-full
              ${selectedType === type.id ? 'border-blue-400 bg-blue-50' : 'border-transparent'}`}
          >
            <h2 className="mb-3 text-2xl font-semibold flex items-center justify-between">
              {type.title}
              <ArrowRight className="ml-2 w-5 h-5 transition-transform" />
            </h2>
            <p className="m-0 max-w-[30ch] text-sm opacity-70">{type.description}</p>
          </div>
        ))}
      </div>

      {/* Barangay Permit Modal */}
{/* Barangay Permit Modal */}
{/* Barangay Permit Modal */}
{isBarangayModalOpen && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-[1px]">
    <div className="bg-[#FBFBFB] dark:bg-slate-800 rounded-lg shadow-xl max-w-md w-full p-8 text-center min-h-[300px]">
      <h3 className="text-2xl font-semibold mb-4">Do you have an existing Barangay Permit?</h3>
      <p className="text-gray-600 dark:text-slate-300 mb-8">
        Before applying for a business permit, we need to check if you already have a valid Barangay Permit.
        If you don't have one, you will be redirected to the Barangay Permit application page.
      </p>
      <div className="flex justify-center gap-6">
        {/* Yes button - Green */}
        <button
          onClick={() => {
            setIsBarangayModalOpen(false);
            setIsModalOpen(true); // Continue to the main permit modal
          }}
          className="bg-[#4CAF50] hover:bg-[#FDA811] text-white font-semibold py-3 px-8 rounded-lg transition-colors"
        >
          Yes
        </button>

        {/* No button - Blue */}
        <button
          onClick={() => navigate('/user/barangay/type')}
          className="bg-[#4A90E2] hover:bg-[#FDA811] text-white font-semibold py-3 px-8 rounded-lg transition-colors"
        >
          No
        </button>
      </div>
    </div>
  </div>
)}


      {/* Selection Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-[1px]">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-semibold mb-2">Selected Permit Type</h3>
            <p className="text-gray-600 dark:text-slate-300 mb-4">
              You have selected:{" "}
              <span className="font-bold text-blue-600">
                {application_type.find(t => t.id === selectedType)?.title}
              </span>
            </p>
            <p className="text-sm text-gray-500 dark:text-slate-400 mb-6">
              {application_type.find(t => t.id === selectedType)?.description}
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg transition"
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#FDA811";
                  e.currentTarget.style.color = "#FFFFFF";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#D1D5DB";
                  e.currentTarget.style.color = "#1F2937";
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleContinue}
                className="text-white font-semibold py-2 px-4 rounded-lg transition"
                style={{ backgroundColor: "#4CAF50" }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#FDA811")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#4CAF50")}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Back to Dashboard Button */}
      <div className="mt-8 text-center">
        <button
          onClick={() => setIsConfirmBackOpen(true)}
          className="inline-flex items-center gap-2 bg-green-600 hover:bg-orange-500 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </button>
      </div>

      {/* Confirm Back Modal */}
      {isConfirmBackOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-[1px]">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-lg w-full p-8 text-center">
            <h3 className="text-2xl font-semibold mb-6">Are you sure you want to go back?</h3>
            <div className="flex justify-center gap-6">
              <button
                onClick={() => setIsConfirmBackOpen(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => navigate('/user/dashboard')}
                className="bg-green-600 hover:bg-orange-500 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Yes, Go Back
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
