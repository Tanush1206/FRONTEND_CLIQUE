import GridBackground from '../components/GridBackground';
import sst from '../assets/sst.png';
import { useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';


export default function Login() {
  const [searchParams] = useSearchParams();
  const [error, setError] = useState('');

  useEffect(() => {
    const errorParam = searchParams.get('error');
    if (errorParam === 'invalid_domain') {
      setError('Only @sst.scaler.com email addresses are allowed');
    } else if (errorParam === 'server_error') {
      setError('An error occurred. Please try again.');
    }
  }, [searchParams]);

  const handleGoogleLogin = () => {
    // Clear any previous errors
    setError('');
    // Redirect to backend Google OAuth endpoint
    window.location.href = 'http://localhost:4000/api/auth/google';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white flex">
      {/* Left side - Login Form */}
      <div className="w-full md:w-1/2 p-8 flex flex-col justify-center items-center relative z-10 bg-gradient-to-br from-slate-900/90 via-blue-900/90 to-slate-800/90 backdrop-blur-sm" style={{ 
        boxShadow: '4px 0 15px rgba(0, 0, 0, 0.2)'
      }}>
        <div className="w-full max-w-md transform transition-all duration-300 hover:scale-[1.01]">
          {/* Scaler Logo */}
          <div className="flex justify-center mb-8">
            <img 
              src={sst}
              alt="SST Logo" 
              className="h-16 w-auto"
            />
          </div>
          
          <h1 className="text-3xl font-bold text-center mb-8 text-white">
            Log In to your Scaler Account
          </h1>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl backdrop-blur-sm">
              <p className="text-red-200 text-sm text-center">{error}</p>
            </div>
          )}
          
          {/* Google Sign In Button */}
          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 bg-white/10 backdrop-blur-sm text-white py-3 px-4 rounded-full font-medium mb-6 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-[1.02]"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Continue with Google
          </button>
          
          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/20"></div>
            </div>
          </div>
          
          <p className="mt-8 text-center text-blue-200 italic">
            "Become 1% better every day"
          </p>
        </div>
      </div>
      
      {/* Right side - Grid */}
      <GridBackground />
    </div>
  );
};