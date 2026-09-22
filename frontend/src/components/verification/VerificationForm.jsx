import React from 'react';
import Button from '../Button';

const VerificationForm = ({ method, onSubmit, isSubmitting }) => {
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
      <h3 className="text-xl font-bold text-gray-900 mb-6">
        {method === 'agristack' && 'AgriStack Verification'}
        {method === 'kcc' && 'Kisan Credit Card (KCC) Verification'}
        {method === 'bhulekh' && 'Bhulekh (Land Record) Verification'}
      </h3>

      <div className="space-y-5">
        {method === 'agristack' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">AgriStack ID</label>
            <input type="text" required placeholder="Enter your 12-digit AgriStack ID" className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
          </div>
        )}

        {method === 'kcc' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">KCC Account Number</label>
              <input type="text" required placeholder="Enter KCC Account No." className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Issuing Bank</label>
              <input type="text" required placeholder="e.g. SBI, HDFC" className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
            </div>
          </>
        )}

        {method === 'bhulekh' && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                <select required className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white">
                  <option value="">Select State</option>
                  <option value="up">Uttar Pradesh</option>
                  <option value="mh">Maharashtra</option>
                  <option value="mp">Madhya Pradesh</option>
                  <option value="pb">Punjab</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
                <input type="text" required placeholder="Enter District" className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Khata / Khasra No.</label>
              <input type="text" required placeholder="Enter Khata/Khasra Number" className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
            </div>
          </>
        )}
      </div>

      <div className="mt-8">
        <Button type="submit" fullWidth disabled={isSubmitting}>
          {isSubmitting ? 'Verifying...' : 'Demo Verification'}
        </Button>
        <p className="text-xs text-center text-gray-500 mt-4">
          Note: This is a demo verification step for the SIH prototype. No real API is connected.
        </p>
      </div>
    </form>
  );
};

export default VerificationForm;
