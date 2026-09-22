import React, { useState } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { ShieldCheck, CreditCard, FileText, BadgeCheck, Users, Search } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import VerificationMethodCard from '../components/verification/VerificationMethodCard';
import VerificationForm from '../components/verification/VerificationForm';
import VerificationStatus from '../components/verification/VerificationStatus';

const SellerVerification = () => {
  const navigate = useNavigate();
  const { user, login } = useAppContext();

  const [selectedMethod, setSelectedMethod] = useState(null); // 'agristack', 'kcc', 'bhulekh'
  const [verificationStatus, setVerificationStatus] = useState('idle'); // 'idle', 'progress', 'verified', 'failed', 'pending'

  // If accessed directly without being logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If already a seller, redirect to seller dashboard
  if (user.sellerVerified) {
    return <Navigate to="/seller/dashboard" replace />;
  }

  const handleVerify = () => {
    setVerificationState('progress');
    
    // Simulate API verification call
    setTimeout(() => {
      setVerificationState('verified');
    }, 2000);
  };
  
  // Wrap the state updater to match the VerificationForm props
  const setVerificationState = setVerificationStatus;

  const handleContinue = () => {
    // Upgrade user to seller, assign a mock farmer profile, and redirect to dashboard
    login({ ...user, sellerVerified: true, farmerId: 'f3' });
    navigate('/seller/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-green-100 text-green-600 rounded-full mb-4">
            <ShieldCheck size={32} />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Become a Farm2Home Seller</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Verify your farmer/occupation status to start selling directly to customers.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          <div className="lg:col-span-2">
            {verificationStatus === 'idle' ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  <VerificationMethodCard 
                    title="AgriStack ID" 
                    description="Verify through your AgriStack identity."
                    icon={BadgeCheck}
                    selected={selectedMethod === 'agristack'}
                    onClick={() => setSelectedMethod('agristack')}
                  />
                  <VerificationMethodCard 
                    title="Kisan Credit Card" 
                    description="Verify your active KCC status."
                    icon={CreditCard}
                    selected={selectedMethod === 'kcc'}
                    onClick={() => setSelectedMethod('kcc')}
                  />
                  <VerificationMethodCard 
                    title="Bhulekh Record" 
                    description="Verify your land record."
                    icon={FileText}
                    selected={selectedMethod === 'bhulekh'}
                    onClick={() => setSelectedMethod('bhulekh')}
                  />
                </div>

                {selectedMethod ? (
                  <VerificationForm 
                    method={selectedMethod} 
                    onSubmit={handleVerify} 
                    isSubmitting={verificationStatus === 'progress'}
                  />
                ) : (
                  <div className="bg-white rounded-2xl p-8 text-center border border-gray-100 shadow-sm">
                    <p className="text-gray-500">Please select a verification method above to continue.</p>
                  </div>
                )}
              </>
            ) : (
              <VerificationStatus 
                status={verificationStatus} 
                onContinue={handleContinue}
                onRetry={() => setVerificationStatus('idle')}
              />
            )}
          </div>

          {/* Sidebar - Why verify? */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 sticky top-24">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Why verify?</h3>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-8 h-8 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center">
                      <ShieldCheck size={18} />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-md font-semibold text-gray-900">Builds Trust</h4>
                    <p className="text-sm text-gray-500 mt-1">Customers prefer buying from verified farmers, leading to more sales.</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-8 h-8 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center">
                      <Users size={18} />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-md font-semibold text-gray-900">Identifies Genuine Farmers</h4>
                    <p className="text-sm text-gray-500 mt-1">Eliminates middlemen pretending to be farmers from the platform.</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-8 h-8 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center">
                      <Search size={18} />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-md font-semibold text-gray-900">Improves Transparency</h4>
                    <p className="text-sm text-gray-500 mt-1">Creates a transparent marketplace where food origin is known.</p>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default SellerVerification;
