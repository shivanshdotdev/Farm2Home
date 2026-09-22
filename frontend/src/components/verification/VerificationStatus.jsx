import React from 'react';
import { CheckCircle2, Clock, XCircle, AlertCircle } from 'lucide-react';
import Button from '../Button';

const VerificationStatus = ({ status, onContinue, onRetry }) => {
  return (
    <div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-100 text-center flex flex-col items-center">
      {status === 'pending' && (
        <>
          <div className="w-20 h-20 bg-yellow-50 text-yellow-500 rounded-full flex items-center justify-center mb-6">
            <Clock size={40} />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Verification Pending</h3>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Your verification request has been submitted. It usually takes 24-48 hours to manually verify the details.
          </p>
          <Button onClick={onContinue}>Continue to Dashboard</Button>
        </>
      )}

      {status === 'verified' && (
        <>
          <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mb-6">
            <CheckCircle2 size={40} />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Verified Successfully!</h3>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Your farmer profile is now verified. You will receive a 'Verified' badge which helps build trust with customers.
          </p>
          <Button onClick={onContinue}>Continue to Dashboard</Button>
        </>
      )}

      {status === 'failed' && (
        <>
          <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6">
            <XCircle size={40} />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Verification Failed</h3>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            We could not verify the details provided. Please check the information and try again.
          </p>
          <Button onClick={onRetry} variant="outline">Try Again</Button>
        </>
      )}

      {status === 'progress' && (
        <>
          <div className="w-20 h-20 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-6 animate-pulse">
            <AlertCircle size={40} />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Verifying...</h3>
          <p className="text-gray-600 max-w-md mx-auto">
            Please wait while we check your details with the database.
          </p>
        </>
      )}
    </div>
  );
};

export default VerificationStatus;
