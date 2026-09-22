import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle2, ShieldAlert } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import Button from '../components/Button';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAppContext();
  
  const [verificationState, setVerificationState] = useState('idle'); // 'idle', 'verifying', 'success'
  const [method, setMethod] = useState(''); // 'aadhaar' or 'digilocker'

  const handleVerify = (selectedMethod) => {
    setMethod(selectedMethod);
    setVerificationState('verifying');
    
    // Simulate API call to Aadhaar/DigiLocker OAuth
    setTimeout(() => {
      setVerificationState('success');
    }, 2000);
  };

  const handleContinue = (destination) => {
    // Generate a verified user object
    const user = {
      id: 'u' + Date.now(),
      name: 'Ramesh Kumar',
      email: 'ramesh.k@example.com',
      mobile: '+91 98765 43210',
      identityVerified: true,
      authMethod: method,
      sellerVerified: false
    };
    
    login(user);

    if (destination === 'explore') {
      navigate('/explore');
    } else if (destination === 'seller') {
      navigate('/seller-verification');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Verify your identity to continue
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Farm2Home requires identity verification to ensure a safe marketplace for everyone.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-10 px-6 shadow-sm sm:rounded-2xl sm:px-10 border border-gray-100 text-center">
          
          {verificationState === 'idle' && (
            <div className="space-y-4">
              <button
                onClick={() => handleVerify('aadhaar')}
                className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 shadow-sm text-sm font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                <img src="https://upload.wikimedia.org/wikipedia/en/thumb/c/cf/Aadhaar_Logo.svg/1200px-Aadhaar_Logo.svg.png" alt="Aadhaar" className="h-6 mr-3 object-contain" />
                Continue with Aadhaar
              </button>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">OR</span>
                </div>
              </div>

              <button
                onClick={() => handleVerify('digilocker')}
                className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 shadow-sm text-sm font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/DigiLocker_logo.svg/1200px-DigiLocker_logo.svg.png" alt="DigiLocker" className="h-6 mr-3 object-contain" />
                Continue with DigiLocker
              </button>
              
              <div className="mt-6 p-4 bg-blue-50 rounded-lg text-left flex items-start">
                <ShieldAlert className="text-blue-500 mr-3 flex-shrink-0 mt-0.5" size={20} />
                <p className="text-xs text-blue-700">
                  <strong>Demo Verification:</strong> This is a prototype. No actual API is connected. Clicking these buttons will simulate a successful identity verification.
                </p>
              </div>
            </div>
          )}

          {verificationState === 'verifying' && (
            <div className="py-8 flex flex-col items-center">
              <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mb-4"></div>
              <h3 className="text-lg font-medium text-gray-900">Connecting to {method === 'aadhaar' ? 'UIDAI' : 'DigiLocker'}...</h3>
              <p className="text-gray-500 text-sm mt-2">Waiting for user consent</p>
            </div>
          )}

          {verificationState === 'success' && (
            <div className="animate-in fade-in duration-500">
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={40} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Identity Verified!</h3>
              
              <div className="bg-gray-50 rounded-xl p-4 mb-8 text-left border border-gray-100">
                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-2">Verified Details</p>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div className="text-gray-500">Name:</div>
                  <div className="col-span-2 font-medium text-gray-900">Ramesh Kumar</div>
                  <div className="text-gray-500">Mobile:</div>
                  <div className="col-span-2 font-medium text-gray-900">+91 98765 43210</div>
                  <div className="text-gray-500">Email:</div>
                  <div className="col-span-2 font-medium text-gray-900">ramesh.k@example.com</div>
                </div>
              </div>

              <div className="space-y-3">
                <Button fullWidth onClick={() => handleContinue('explore')}>
                  Explore Products
                </Button>
                <Button fullWidth variant="outline" onClick={() => handleContinue('seller')}>
                  Become a Seller
                </Button>
              </div>
            </div>
          )}

        </div>
        
        <p className="mt-6 text-center text-sm text-gray-500">
          Don't have an account? No problem! The process is exactly the same.{' '}
          <Link to="/signup" className="font-medium text-primary-600 hover:text-primary-500">
            Sign up here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
