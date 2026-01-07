import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from "lucide-react";

export default function BusinessChangeOwner() {
  const [selectedType, setSelectedType] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

const amendmentTypes = [
  { 
    id: 'LOCATION', 
    title: 'Transfer of Location', 
    description: 'Change the registered business address to a new location.' 
  },
  { 
    id: 'NAME', 
    title: 'Change of Business Name', 
    description: 'Update the official registered name of your business.' 
  },
  { 
    id: 'OWNERSHIP', 
    title: 'Change of Ownership', 
    description: 'Transfer the business permit to a new owner or entity.' 
  },
  { 
    id: 'SCOPE', 
    title: 'Change in Business Line/Scope', 
    description: 'Add or remove business activities covered by your permit.' 
  },
  { 
    id: 'CLOSURE', 
    title: 'Closure or Retirement of Business', 
    description: 'Apply for the closure or retirement of your business operations.' 
  },
  { 
    id: 'CANCELLATION', 
    title: 'Cancellation of Permit', 
    description: 'Cancel an existing business permit permanently.' 
  },
];

    const application_type = amendmentTypes;

  const handleTypeSelection = (typeId) => {
    setSelectedType(typeId);
    setIsModalOpen(true);
  };

  const handleContinue = () => {
  setIsModalOpen(false);

const routeMap = {
  LOCATION: '/user/businessamendment/locationbusiness',
  NAME: '/user/businessamendment/namebusiness',
  OWNERSHIP: '/user/businessamendment/ownershipbusiness',
  SCOPE: '/user/businessamendment/scopebusiness',
  CLOSURE: '/user/businessamendment/closurebusiness',
  CANCELLATION: '/user/businessamendment/cancellationbusiness',
};


  navigate(routeMap[selectedType] || '/user/businessamendment', { 
    state: { application_type: selectedType } 
  });
};


  return (
    <div className="mx-1 mt-1 p-6 dark:bg-slate-900 bg-white dark:text-slate-300 rounded-lg min-h-screen">
      <h1 className="text-2xl md:text-4xl font-bold mb-8 text-center">
        Amendment Permit Types
      </h1>
      <p className="mb-6 text-center">
        Please select the type of business permit you need to apply for
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full mt-6">
        {application_type.map((type) => (
          <div
            key={type.id}
            onClick={() => handleTypeSelection(type.id)}
            className={`cursor-pointer rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-orange-300 hover:bg-orange-100 shadow-lg shadow-orange-200/50 hover:shadow-orange-300/50 flex flex-col justify-between h-full`}
          >
            <h2 className="mb-3 text-2xl font-semibold flex items-center justify-between">
             {type.title}
             <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1 motion-reduce:transform-none" />
            </h2>

            <p className="m-0 max-w-[30ch] text-sm opacity-70">{type.description}</p>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && ( 
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
           <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-md w-full p-6"> 
        <h3 className="text-xl font-semibold mb-2">Selected Permit Type</h3>
        
        <p className="text-gray-600 dark:text-slate-300 mb-4"> You have selected:{" "} 

          <span className="font-bold text-orange-600"> 
            {application_type.find(t => t.id === selectedType)?.title} </span> 
            </p>

            <p className="text-sm text-gray-500 dark:text-slate-400 mb-6"> 
              {application_type.find(t => t.id === selectedType)?.description} 
              </p> 

              <div className="flex justify-end gap-4">
                <button onClick={() => setIsModalOpen(false)} 
                 className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-lg" > Cancel 
                 </button>
                 
                 <button onClick={handleContinue} className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-4 rounded-lg" > Continue 
                  </button> 
                  </div> 
                </div> 
              </div> 
            )} 
          <div className="mt-8 text-center"> 
          <button onClick={() => navigate('/user/business/type')} 
            className="text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-300 underline" > 
        ← Back to Business Permit Types
        </button>
      
        </div>
    </div>
  );
}