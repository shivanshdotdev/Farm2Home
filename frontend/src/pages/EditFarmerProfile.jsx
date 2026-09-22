import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { Save, Image as ImageIcon, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import SellerLayout from '../components/SellerLayout';

const EditFarmerProfile = () => {
  const navigate = useNavigate();
  const { user, farmers, updateFarmer } = useAppContext();
  
  if (!user || !user.sellerVerified || !user.farmerId) {
    return <Navigate to="/login" replace />;
  }

  const farmer = farmers.find(f => f.id === user.farmerId);
  
  if (!farmer) {
    return <Navigate to="/farmers" replace />;
  }

  const [formData, setFormData] = useState({
    name: farmer.name || '',
    image: farmer.image || '',
    location: farmer.location || '',
    bio: farmer.bio || farmer.description || '',
    farmSize: farmer.farmSize || '',
    phone: farmer.phone || '',
    email: farmer.email || '',
    categories: farmer.categories ? farmer.categories.join(', ') : '',
    products: farmer.products ? farmer.products.join(', ') : ''
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      // Process comma separated lists
      const categories = formData.categories.split(',').map(c => c.trim()).filter(Boolean);
      const products = formData.products.split(',').map(p => p.trim()).filter(Boolean);
      
      updateFarmer(user.farmerId, {
        ...formData,
        categories,
        products
      });
      
      setIsSaving(false);
      setSaveSuccess(true);
      
      setTimeout(() => {
        navigate(`/seller/profile`);
      }, 1500);
    }, 1000);
  };

  return (
    <SellerLayout title="Edit Profile">
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-8">
        <div className="px-6 py-6 border-b border-gray-100 bg-earth-50">
          <p className="text-gray-600">Update your farm information and details.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8">
          
          {/* Identity & Verification (Read-Only) */}
          <div className="bg-green-50 p-6 rounded-2xl border border-green-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <ShieldCheck className="text-primary-600 mr-2" />
              Verified Information
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              These fields are verified by authorities and cannot be changed manually. If you need to update them, please undergo the verification process again.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center bg-white p-3 rounded-xl border border-gray-100">
                <CheckCircle2 className="text-green-500 mr-3" size={20} />
                <div>
                  <div className="text-xs text-gray-500 font-medium">Identity Status</div>
                  <div className="text-sm font-bold text-gray-900">Identity Verified</div>
                </div>
              </div>
              <div className="flex items-center bg-white p-3 rounded-xl border border-gray-100">
                <CheckCircle2 className="text-green-500 mr-3" size={20} />
                <div>
                  <div className="text-xs text-gray-500 font-medium">Farmer Status</div>
                  <div className="text-sm font-bold text-gray-900">Farmer Verification Completed</div>
                </div>
              </div>
            </div>
          </div>

          {/* Basic Info */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Profile Photo URL</label>
                <div className="flex flex-col sm:flex-row gap-4 items-start">
                  {formData.image ? (
                    <img src={formData.image} alt="Preview" className="w-20 h-20 rounded-full object-cover border-4 border-earth-100 flex-shrink-0" />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                      <ImageIcon className="text-gray-400" />
                    </div>
                  )}
                  <div className="flex-grow w-full">
                    <input 
                      type="url" 
                      name="image" 
                      value={formData.image} 
                      onChange={handleChange} 
                      className="w-full rounded-xl border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500" 
                      placeholder="https://example.com/photo.jpg"
                    />
                    <p className="text-xs text-gray-500 mt-1">Paste an image URL for your profile picture.</p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input 
                  type="text" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange} 
                  required 
                  className="w-full rounded-xl border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500" 
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input 
                  type="text" 
                  name="location" 
                  value={formData.location} 
                  onChange={handleChange} 
                  required 
                  className="w-full rounded-xl border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500" 
                  placeholder="e.g. Pune, Maharashtra"
                />
              </div>
            </div>
          </div>

          {/* Farm Details */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">Farm Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">About the Farm (Bio)</label>
                <textarea 
                  name="bio" 
                  value={formData.bio} 
                  onChange={handleChange} 
                  rows={4}
                  required 
                  className="w-full rounded-xl border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500" 
                  placeholder="Tell customers about your farm, your farming methods, and your story..."
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Farm Size</label>
                <input 
                  type="text" 
                  name="farmSize" 
                  value={formData.farmSize} 
                  onChange={handleChange} 
                  className="w-full rounded-xl border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500" 
                  placeholder="e.g. 5 Acres"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Farming Categories</label>
                <input 
                  type="text" 
                  name="categories" 
                  value={formData.categories} 
                  onChange={handleChange} 
                  className="w-full rounded-xl border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500" 
                  placeholder="e.g. Vegetables, Fruits, Organic (comma separated)"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Primary Products Grown</label>
                <input 
                  type="text" 
                  name="products" 
                  value={formData.products} 
                  onChange={handleChange} 
                  className="w-full rounded-xl border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500" 
                  placeholder="e.g. Tomatoes, Onions, Mangoes (comma separated)"
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input 
                  type="tel" 
                  name="phone" 
                  value={formData.phone} 
                  onChange={handleChange} 
                  className="w-full rounded-xl border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500" 
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address (Optional)</label>
                <input 
                  type="email" 
                  name="email" 
                  value={formData.email} 
                  onChange={handleChange} 
                  className="w-full rounded-xl border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500" 
                />
              </div>
            </div>
          </div>

          {saveSuccess && (
            <div className="bg-green-50 text-green-700 p-4 rounded-xl border border-green-200 flex items-center">
              <CheckCircle2 className="mr-2" />
              Profile updated successfully! Redirecting...
            </div>
          )}

          {/* Actions */}
          <div className="pt-6 border-t border-gray-100 flex flex-col-reverse sm:flex-row justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate(`/seller/profile`)}
              className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 w-full sm:w-auto text-center"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-3 border border-transparent text-white font-medium rounded-xl bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 flex justify-center items-center w-full sm:w-auto"
            >
              {isSaving ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  <Save size={18} className="mr-2" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </SellerLayout>
  );
};

export default EditFarmerProfile;
