import React, { useState } from 'react';
import { ShieldAlert, CheckCircle2 } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import Button from '../components/Button';

const UserSettings = () => {
  const { user } = useAppContext();
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    mobile: user?.mobile || '',
    contactPreference: 'whatsapp'
  });
  
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Defensive check
  if (!user) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Simulate API save
    setTimeout(() => {
      setIsSaving(false);
      setIsSaved(true);
      
      setTimeout(() => {
        setIsSaved(false);
      }, 3000);
    }, 1500);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Account Settings</h1>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        
        {/* Verification Status (Read-Only) */}
        <div className="bg-gray-50 p-6 border-b border-gray-100">
          <div className="flex items-start">
            <ShieldAlert className="text-gray-400 mr-3 mt-1 flex-shrink-0" size={20} />
            <div>
              <h3 className="text-sm font-bold text-gray-900 mb-1">Identity Information</h3>
              <p className="text-sm text-gray-500 mb-3">
                Your identity is verified via {user.authMethod === 'aadhaar' ? 'Aadhaar' : 'DigiLocker'}. 
                Core identity fields cannot be changed manually.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Status</label>
                  <div className="flex items-center text-sm font-medium text-green-700 bg-green-50 px-3 py-2 rounded-lg border border-green-100 w-max">
                    <CheckCircle2 size={16} className="mr-2" />
                    Verified
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Seller Status</label>
                  <div className={`flex items-center text-sm font-medium px-3 py-2 rounded-lg border w-max ${user.sellerVerified ? 'text-green-700 bg-green-50 border-green-100' : 'text-gray-700 bg-gray-100 border-gray-200'}`}>
                    {user.sellerVerified ? (
                      <><CheckCircle2 size={16} className="mr-2" /> Verified Seller</>
                    ) : (
                      'Not Verified'
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Editable Form */}
        <form onSubmit={handleSave} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all text-gray-900"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all text-gray-900"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mobile Number
              </label>
              <input
                type="tel"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all text-gray-900"
                required
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Preference
              </label>
              <select
                name="contactPreference"
                value={formData.contactPreference}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all text-gray-900 bg-white"
              >
                <option value="whatsapp">WhatsApp</option>
                <option value="sms">SMS</option>
                <option value="email">Email</option>
              </select>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-100 flex items-center justify-end">
            {isSaved && (
              <span className="text-green-600 flex items-center text-sm font-medium mr-4">
                <CheckCircle2 size={16} className="mr-1" />
                Changes Saved
              </span>
            )}
            <Button type="submit" disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default UserSettings;
