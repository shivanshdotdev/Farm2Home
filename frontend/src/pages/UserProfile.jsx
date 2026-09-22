import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, ShieldAlert, Store, User, Mail, Phone, Calendar } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import Button from '../components/Button';

const UserProfile = () => {
  const { user } = useAppContext();

  // Defensive check since ProtectedRoute should handle this, but just in case
  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
        <Link to="/profile/settings">
          <Button variant="outline">Edit Settings</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Column - User Info Card */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center">
            <div className="w-24 h-24 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <User size={40} />
            </div>
            <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
            {user.identityVerified && (
              <div className="flex items-center justify-center gap-1 mt-2 text-green-600 font-medium">
                <CheckCircle2 size={16} />
                <span>Identity Verified</span>
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-bold text-gray-900 mb-4">Contact Information</h3>
            <div className="space-y-4 text-sm">
              <div className="flex items-start">
                <Mail size={18} className="text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-gray-500 mb-0.5">Email</p>
                  <p className="font-medium text-gray-900">{user.email}</p>
                </div>
              </div>
              <div className="flex items-start">
                <Phone size={18} className="text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-gray-500 mb-0.5">Mobile</p>
                  <p className="font-medium text-gray-900">{user.mobile}</p>
                </div>
              </div>
              <div className="flex items-start">
                <Calendar size={18} className="text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-gray-500 mb-0.5">Member Since</p>
                  <p className="font-medium text-gray-900">September 2026</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Verification Statuses */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Identity Verification */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Identity Verification</h3>
                <p className="text-gray-500 text-sm mb-4">
                  Your identity has been verified through our trusted partners, ensuring a safe platform for all users.
                </p>
              </div>
              {user.identityVerified ? (
                <div className="bg-green-100 text-green-700 p-2 rounded-full">
                  <CheckCircle2 size={24} />
                </div>
              ) : (
                <div className="bg-amber-100 text-amber-700 p-2 rounded-full">
                  <ShieldAlert size={24} />
                </div>
              )}
            </div>

            {user.identityVerified ? (
              <div className="bg-gray-50 p-4 rounded-xl flex items-center justify-between border border-gray-200">
                <div className="flex items-center">
                  <span className="w-2.5 h-2.5 bg-green-500 rounded-full mr-3"></span>
                  <span className="font-medium text-gray-900">Verified</span>
                </div>
                <div className="text-sm text-gray-500">
                  Method: <span className="font-medium text-gray-700 capitalize">{user.authMethod || 'Aadhaar / DigiLocker'}</span>
                </div>
              </div>
            ) : (
              <div className="bg-amber-50 p-4 rounded-xl border border-amber-200">
                <p className="text-sm text-amber-800 mb-3">Your identity is not verified.</p>
                <Button variant="primary" size="sm">Verify Now</Button>
              </div>
            )}
          </div>

          {/* Seller Verification */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Seller Verification</h3>
                <p className="text-gray-500 text-sm mb-4">
                  Users who want to list agricultural products must complete seller verification to confirm their farming occupation.
                </p>
              </div>
              {user.sellerVerified ? (
                <div className="bg-green-100 text-green-700 p-2 rounded-full">
                  <Store size={24} />
                </div>
              ) : (
                <div className="bg-gray-100 text-gray-400 p-2 rounded-full">
                  <Store size={24} />
                </div>
              )}
            </div>

            {user.sellerVerified ? (
              <div className="bg-green-50 p-5 rounded-xl border border-green-200">
                <div className="flex items-center mb-4">
                  <CheckCircle2 size={20} className="text-green-600 mr-2" />
                  <span className="font-bold text-green-900">Verified Seller</span>
                </div>
                <p className="text-sm text-green-800 mb-4">
                  You are approved to list products and sell directly to customers on Farm2Home.
                </p>
                <Link to="/seller/dashboard">
                  <Button variant="primary">Seller Dashboard</Button>
                </Link>
              </div>
            ) : (
              <div className="bg-blue-50 p-5 rounded-xl border border-blue-200">
                <p className="text-sm text-blue-800 mb-4">
                  You are currently a Customer. If you are a farmer, you can upgrade your account to start selling.
                </p>
                <Link to="/seller-verification">
                  <Button variant="primary">Become a Seller</Button>
                </Link>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default UserProfile;
