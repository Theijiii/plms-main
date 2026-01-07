import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Upload } from 'lucide-react';

export default function Register() {
  const [isCitizen, setIsCitizen] = useState(true);
  const [residentialCity, setResidentialCity] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [idFile, setIdFile] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  // Color scheme
  const colors = {
    primary: '#4CAF50',
    secondary: '#4A90E2',
    accent: '#FDA811',
    background: '#FBFBFB',
  };

  const handleIdChange = (e) => {
    const file = e.target.files[0] || null;
    setIdFile(file);
  };

  const validate = () => {
    setError('');
    if (!email) return setError('Kinakailangan ang email.') && false;
    if (!password || password.length < 8) return setError('Ang password ay dapat hindi bababa sa 8 na karakter.') && false;
    if (password !== confirmPassword) return setError('Hindi magkatugma ang mga password.') && false;
    if (!idFile) return setError('Mangyaring mag-upload ng valid ID.') && false;
    if (!isCitizen && !residentialCity) return setError('Kinakailangan ang residential city kung hindi citizen.') && false;
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validate()) return;

    setIsSubmitting(true);

    // Mock submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccess('Matagumpay ang pagrehistro. Maaari ka nang mag-login.');
      setTimeout(() => navigate('/login'), 1500);
    }, 1500);
  };

  return (
    <div
      className="min-h-screen bg-gray-50 py-8"
      style={{ 
        fontFamily: 'Montserrat, Segoe UI, Arial, Helvetica Neue, sans-serif',
        background: colors.background 
      }}
    >
      <div className="flex justify-center items-start px-4">
        <div className="max-w-md w-full bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          
          {/* Header Section */}
          <div className="text-center mb-6">
            <div className="mb-3">
              <h1 className="text-2xl font-bold mb-2" style={{ color: colors.primary }}>
                Magrehistro
              </h1>
              <div className="w-16 h-1 mx-auto rounded-full" style={{ background: colors.accent }}></div>
            </div>
            <p className="text-gray-600 text-sm" style={{ fontFamily: 'Montserrat' }}>
              Piliin kung citizen at punan ang kinakailangang impormasyon
            </p>
          </div>

          {/* Status Messages */}
          {error && (
            <div 
              className="mb-4 p-3 rounded-lg border border-red-200 text-red-700 text-sm font-medium"
              style={{ background: '#FEF2F2', fontFamily: 'Montserrat' }}
            >
              {error}
            </div>
          )}
          {success && (
            <div 
              className="mb-4 p-3 rounded-lg border border-green-200 text-green-700 text-sm font-medium"
              style={{ background: '#F0F9F4', fontFamily: 'Montserrat' }}
            >
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Citizen Selection */}
            <div>
              <label className="block text-xs font-semibold mb-2" style={{ fontFamily: 'Montserrat', color: '#374151' }}>
                Ikaw ba ay Citizen?
              </label>
              <div className="flex gap-4">
                <label className="flex items-center cursor-pointer">
                  <input 
                    type="radio" 
                    name="citizen" 
                    value="yes" 
                    checked={isCitizen === true} 
                    onChange={() => setIsCitizen(true)} 
                    className="mr-2 w-4 h-4 transition-all duration-200"
                    style={{ accentColor: colors.accent }}
                  />
                  <span 
                    className="text-sm"
                    style={{ fontFamily: 'Montserrat' }}
                  >
                    Oo, Ako ay Citizen
                  </span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input 
                    type="radio" 
                    name="citizen" 
                    value="no" 
                    checked={isCitizen === false} 
                    onChange={() => setIsCitizen(false)} 
                    className="mr-2 w-4 h-4 transition-all duration-200"
                    style={{ accentColor: colors.accent }}
                  />
                  <span 
                    className="text-sm"
                    style={{ fontFamily: 'Montserrat' }}
                  >
                    Hindi
                  </span>
                </label>
              </div>
            </div>

            {/* Residential City (only show if not citizen) */}
            {!isCitizen && (
              <div>
                <label className="block text-xs font-semibold mb-1" style={{ fontFamily: 'Montserrat', color: '#374151' }}>
                  Lungsod o Lugar ng Paninirahan *
                </label>
                <input
                  type="text"
                  value={residentialCity}
                  onChange={e => { setResidentialCity(e.target.value); setError(''); }}
                  required
                  className="w-full p-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all"
                  style={{ 
                    fontFamily: 'Montserrat',
                    background: colors.background,
                    focusRingColor: colors.accent
                  }}
                  placeholder="Ilagay ang iyong lungsod o lugar ng paninirahan"
                />
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold mb-1" style={{ fontFamily: 'Montserrat', color: '#374151' }}>
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={e => { setEmail(e.target.value); setError(''); }}
                required
                className="w-full p-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all"
                style={{ 
                  fontFamily: 'Montserrat',
                  background: colors.background,
                  focusRingColor: colors.accent
                }}
                placeholder="Ilagay ang iyong email address"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold mb-1" style={{ fontFamily: 'Montserrat', color: '#374151' }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={e => { setPassword(e.target.value); setError(''); }}
                required
                minLength={8}
                className="w-full p-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all"
                style={{ 
                  fontFamily: 'Montserrat',
                  background: colors.background,
                  focusRingColor: colors.accent
                }}
                placeholder="Gumawa ng password (min 8 na karakter)"
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-semibold mb-1" style={{ fontFamily: 'Montserrat', color: '#374151' }}>
                Kumpirmahin ang Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={e => { setConfirmPassword(e.target.value); setError(''); }}
                required
                minLength={8}
                className="w-full p-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all"
                style={{ 
                  fontFamily: 'Montserrat',
                  background: colors.background,
                  focusRingColor: colors.accent
                }}
                placeholder="Kumpirmahin ang iyong password"
              />
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold mb-1" style={{ fontFamily: 'Montserrat', color: '#374151' }}>
                Buong Pangalan <span className="text-gray-500 font-normal">(opsyonal)</span>
              </label>
              <input
                type="text"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                className="w-full p-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all"
                style={{ 
                  fontFamily: 'Montserrat',
                  background: colors.background,
                  focusRingColor: colors.accent
                }}
                placeholder="Ilagay ang iyong buong pangalan"
              />
            </div>

            {/* ID Upload */}
            <div className="p-4 rounded-lg border-2 border-dashed border-green-200 transition-all duration-200 hover:border-green-400"
                 style={{ background: '#F0F9F4' }}>
              <label className="block text-xs font-semibold mb-2 text-center" style={{ fontFamily: 'Montserrat', color: '#065F46' }}>
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Upload size={16} style={{ color: '#059669' }} />
                  Mag-upload ng Valid ID *
                </div>
              </label>
              
              <label className="cursor-pointer block">
                <div className="flex flex-col items-center justify-center p-4 rounded border-2 border-dashed border-green-300 hover:border-green-500 transition-all duration-200"
                     style={{ background: '#DCFCE7' }}>
                  <Upload size={24} style={{ color: '#059669', marginBottom: '8px' }} />
                  <span className="text-sm font-medium text-center" style={{ color: '#065F46', fontFamily: 'Montserrat' }}>
                    Pindutin para pumili ng file
                  </span>
                  <span className="text-xs text-center mt-1" style={{ color: '#047857', fontFamily: 'Montserrat' }}>
                    PDF, JPG, JPEG, PNG
                  </span>
                </div>
                <input
                  type="file"
                  onChange={handleIdChange}
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="hidden"
                />
              </label>
              
              <p className="text-xs text-green-700 mt-2 text-center" style={{ fontFamily: 'Montserrat' }}>
                Kinakailangan para sa verification
              </p>
              
              {idFile && (
                <div className="mt-3 p-2 rounded bg-green-100 border border-green-200 flex items-center gap-2">
                  <Check size={16} style={{ color: '#059669' }} />
                  <span className="text-xs font-semibold flex-1" style={{ color: '#065F46', fontFamily: 'Montserrat' }}>
                    {idFile.name}
                  </span>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full p-3 rounded-lg text-white font-semibold text-sm transition-all duration-300 hover:shadow disabled:opacity-70 disabled:cursor-not-allowed"
                style={{ 
                  background: isSubmitting ? '#9CA3AF' : colors.primary,
                  fontFamily: 'Montserrat'
                }}
                onMouseOver={(e) => {
                  if (!isSubmitting) {
                    e.target.style.backgroundColor = colors.accent;
                  }
                }}
                onMouseOut={(e) => {
                  if (!isSubmitting) {
                    e.target.style.backgroundColor = colors.primary;
                  }
                }}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center text-sm">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Nagre-rehistro...
                  </span>
                ) : (
                  'Magrehistro'
                )}
              </button>
            </div>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm" style={{ fontFamily: 'Montserrat' }}>
              Mayroon nang account?{' '}
              <button 
                onClick={() => navigate('/login')} 
                className="font-semibold hover:underline transition-all duration-200 hover:text-orange-600"
                style={{ color: colors.secondary, fontFamily: 'Montserrat' }}
              >
                Mag-login dito
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}