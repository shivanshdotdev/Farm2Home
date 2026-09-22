import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Edit } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import SellerLayout from '../components/SellerLayout';
import VerifiedBadge from '../components/VerifiedBadge';
import Button from '../components/Button';

const SellerProfile = () => {
  const { user, farmers } = useAppContext();

  if (!user || !user.sellerVerified || !user.farmerId) {
    return <Navigate to="/login" replace />;
  }

  const farmer = farmers.find(f => f.id === user.farmerId);

  if (!farmer) {
    return <Navigate to="/" replace />;
  }

  return (
    <SellerLayout title="Farmer Profile">
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-8">
        <div className="p-8">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="flex-shrink-0">
              {farmer.image ? (
                <img 
                  src={farmer.image} 
                  alt={farmer.name} 
                  className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-earth-100 shadow-sm"
                />
              ) : (
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gray-100 border-4 border-earth-100 shadow-sm flex items-center justify-center text-4xl font-bold text-gray-400">
                  {farmer.name.charAt(0)}
                </div>
              )}
            </div>

            <div className="flex-grow">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">{farmer.name}</h2>
                  <div className="flex items-center gap-2">
                    {farmer.verified && <VerifiedBadge />}
                  </div>
                </div>
                <div className="mt-4 sm:mt-0">
                  <Link to="/seller/profile/edit">
                    <Button variant="outline" className="flex items-center">
                      <Edit size={16} className="mr-2" /> Edit Profile
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div>
                  <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Location</h4>
                  <p className="text-gray-900 font-medium">{farmer.location || 'Not specified'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Farm Size</h4>
                  <p className="text-gray-900 font-medium">{farmer.farmSize || 'Not specified'}</p>
                </div>
                <div className="md:col-span-2">
                  <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Farm Description</h4>
                  <p className="text-gray-900">{farmer.bio || farmer.description || 'No description provided.'}</p>
                </div>
                <div className="md:col-span-2">
                  <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Farming Categories</h4>
                  <p className="text-gray-900">{farmer.categories?.join(', ') || 'Not specified'}</p>
                </div>
                <div className="md:col-span-2">
                  <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Contact Information</h4>
                  <div className="space-y-1">
                    <p className="text-gray-900"><span className="text-gray-500 w-16 inline-block">Phone:</span> {farmer.phone || 'Not specified'}</p>
                    <p className="text-gray-900"><span className="text-gray-500 w-16 inline-block">Email:</span> {farmer.email || 'Not specified'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SellerLayout>
  );
};

export default SellerProfile;
