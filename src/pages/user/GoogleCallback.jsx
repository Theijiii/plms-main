import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useAuth } from '../../context/AuthContext';

export default function GoogleCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const handleGoogleCallback = async () => {
      const code = searchParams.get('code');
      const error = searchParams.get('error');

      if (error) {
        Swal.fire({
          icon: 'error',
          title: 'Authentication Cancelled',
          text: 'You cancelled the Google authentication process.',
          confirmButtonColor: '#4CAF50'
        });
        navigate('/login');
        return;
      }

      if (!code) {
        Swal.fire({
          icon: 'error',
          title: 'Authentication Failed',
          text: 'No authorization code received from Google.',
          confirmButtonColor: '#4CAF50'
        });
        navigate('/login');
        return;
      }

      try {
        // Send the authorization code to backend
        const response = await fetch('http://localhost/backend/login/google-callback.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ code })
        });

        const data = await response.json();

        if (data.success) {
          // Store authentication data
          localStorage.setItem('authToken', data.token);
          localStorage.setItem('userId', data.user_id);
          localStorage.setItem('userEmail', data.email);
          
          // Update auth context
          await login({
            token: data.token,
            user_id: data.user_id,
            email: data.email,
            first_name: data.first_name,
            last_name: data.last_name
          });

          // Show success message
          await Swal.fire({
            icon: 'success',
            title: data.is_new_user ? 'Welcome!' : 'Welcome Back!',
            text: data.is_new_user 
              ? 'Your account has been created successfully.' 
              : 'You have been logged in successfully.',
            confirmButtonColor: '#4CAF50',
            timer: 2000,
            timerProgressBar: true
          });

          // Redirect to dashboard
          navigate('/user/dashboard');
        } else {
          throw new Error(data.message || 'Authentication failed');
        }
      } catch (error) {
        console.error('Google callback error:', error);
        Swal.fire({
          icon: 'error',
          title: 'Authentication Failed',
          text: error.message || 'Failed to complete Google authentication. Please try again.',
          confirmButtonColor: '#4CAF50'
        });
        navigate('/login');
      } finally {
        setIsProcessing(false);
      }
    };

    handleGoogleCallback();
  }, [searchParams, navigate, login]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-800 to-blue-900">
      <div className="text-center space-y-6">
        <div className="relative">
          <div className="w-24 h-24 border-4 border-t-white border-r-white border-b-transparent border-l-transparent rounded-full animate-spin mx-auto"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-white">
            {isProcessing ? 'Authenticating with Google...' : 'Processing Complete'}
          </h2>
          <p className="text-white/80">
            Please wait while we complete your authentication.
          </p>
        </div>

        <div className="flex items-center justify-center space-x-2 text-white/60 text-sm">
          <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  );
}
