import React from "react";

export default function AutofillProfile({ onClose, onAutofill, isLoading, error }) {
  const handleAutofill = async () => {
    try {
      const response = await fetch('http://localhost/eplms-main/backend/login/get_profile.php?action=get', {
        method: 'GET',
        credentials: 'include', // This is crucial for PHP sessions
      });

      if (response.ok) {
        const result = await response.json();
        
        if (result.success && result.data) {
          onAutofill(result.data); // Pass the data to parent
          onClose(); // Close the modal
        } else {
          console.error('Profile fetch failed:', result.message);
        }
      } else {
        console.error('HTTP error:', response.status);
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm z-50 p-4">
      <div 
        className="p-6 rounded-lg shadow-lg w-full max-w-md border border-gray-200"
        style={{ 
          background: 'white',
          fontFamily: 'Montserrat, Arial, sans-serif',
        }}
      >
        <h2 className="text-xl font-bold mb-4 text-black">Autofill from Profile</h2>
        
        <div className="mb-6">
          <p className="text-sm text-gray-600 mb-4">
            Do you want to automatically fill the form with your profile information?
          </p>
          
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg mb-4">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          
          <button
            onClick={handleAutofill}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Loading...
              </div>
            ) : (
              'Autofill'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}