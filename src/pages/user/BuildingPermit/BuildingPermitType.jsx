import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft } from "lucide-react";

export default function BuildingPermitType({ building_permit_id }) {
  const [selectedType, setSelectedType] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isConfirmBackOpen, setIsConfirmBackOpen] = useState(false);
  const navigate = useNavigate();

  const permit_type = [
    { id: 'PROFESSIONAL', title: 'PROFESSIONAL / ENGINEER', description: 'Register yourself as a professional or engineer to be available for building projects.', color: 'bg-orange-500 hover:bg-orange-600' },
    { id: 'NEW', title: 'NEW', description: 'Apply for a new building permit for your project.', color: 'bg-green-500 hover:bg-green-600' },
    { id: 'RENEWAL', title: 'RENEWAL', description: 'Renew your current building permit quickly and easily.w your existing building permit', color: 'bg-blue-500 hover:bg-blue-600' },
    { id: 'OCCUPANCY', title: 'OCCUPANCY', description: 'Apply for a permit to legally occupy your building.', color: 'bg-pink-500 hover:bg-pink-600' },
    { id: 'ANCILLARY', title: 'ANCILLARY PERMITS', description: 'Apply for the required ancillary permits needed for specialized works in your building project.', color: 'bg-yellow-500 hover:bg-yellow-600' },
  ];

const handleTypeSelection = (typeId) => {
  setSelectedType(typeId);
  setIsModalOpen(true); // Always open modal for any permit type
};


  const handleContinue = () => {
    setIsModalOpen(false);

    const routeMap = {
      NEW: '/user/building/new',
      RENEWAL: '/user/building/renewal',
      OCCUPANCY: '/user/building/occupancy',
      PROFESSIONAL: '/user/building/professional',
      ANCILLARY: '/user/building/ancillary',
    };

    navigate(routeMap[selectedType] || '/user/building/new', {
      state: { permitType: selectedType },
    });
  };

  const handleConfirmYes = () => {
    setIsConfirmModalOpen(false);
    navigate('/user/building/new', { state: { permitType: 'NEW' } });
  };

  const handleConfirmNo = () => setIsConfirmModalOpen(false);

  return (
    <>
      <div className="mx-1 mt-1 p-6 dark:bg-slate-900 bg-white dark:text-slate-300 rounded-lg min-h-screen">
        <h1 className="text-2xl md:text-4xl font-bold mb-8 text-center">
          Building Permit Types
        </h1>
        <p className="mb-6 text-center">
          Please select the type of Building permit you need to apply for
        </p>

        {/* ✅ Permit Type Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full mt-6">
          {permit_type.map((type) => (
            <div
              key={type.id}
              onClick={() => handleTypeSelection(type.id)}
              className={`group cursor-pointer rounded-lg border border-gray-200 bg-white px-5 py-4 shadow-sm transition-all duration-200 hover:shadow-md hover:border-blue-400 hover:bg-blue-100`}
            >
              <h2 className="mb-3 text-2xl font-semibold flex items-center justify-between text-gray-800">
                {type.title}
                <ArrowRight className="ml-2 w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" />
              </h2>
              <p className="m-0 max-w-[30ch] text-sm text-gray-600">{type.description}</p>
            </div>
          ))}
        </div>

        {/* ✅ Back Button */}
        <div className="mt-8 text-center">
          <button
            onClick={() => setIsConfirmBackOpen(true)}
            className="inline-flex items-center gap-2 bg-green-600 hover:bg-orange-500 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            <ArrowLeft size={18} />
            Back to Dashboard
          </button>
        </div>

        {/* ✅ Confirm Back Modal */}
        {isConfirmBackOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-[1px]">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-lg w-full p-8 text-center">
              <h3 className="text-2xl font-semibold mb-6">
                Are you sure you want to go back?
              </h3>
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

        {/* ✅ Selection Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-[1px]">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-md w-full p-6">
              <h3 className="text-xl font-semibold mb-2">Selected Permit Type</h3>
              <p className="text-gray-600 dark:text-slate-300 mb-4">
                You have selected:{" "}
                <span className="font-bold text-blue-600">
                  {permit_type.find(t => t.id === selectedType)?.title}
                </span>
              </p>
              <p className="text-sm text-gray-500 dark:text-slate-400 mb-6">
                {permit_type.find(t => t.id === selectedType)?.description}
              </p>

              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg transition"
                >
                  Cancel
                </button>

                <button
                  onClick={handleContinue}
                  className="bg-green-600 hover:bg-orange-500 text-white font-semibold py-2 px-4 rounded-lg transition"
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
