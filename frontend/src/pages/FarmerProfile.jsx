import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Star, Calendar, ArrowLeft, ShieldCheck } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import ProductCard from '../components/ProductCard';
import EmptyState from '../components/EmptyState';
import SectionHeading from '../components/SectionHeading';
import VerifiedBadge from '../components/VerifiedBadge';

const FarmerProfile = () => {
  const { id } = useParams();
  const { farmers, products, user } = useAppContext();
  
  const farmer = farmers.find(f => f.id === id);
  const farmerProducts = products.filter(p => p.farmerId === id);

  if (!farmer) {
    return (
      <div className="py-20">
        <EmptyState 
          title="Farmer Not Found"
          message="We couldn't find the farmer profile you're looking for."
          actionText="View All Farmers"
          actionLink="/farmers"
        />
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/farmers" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-primary-600 mb-6 transition-colors">
          <ArrowLeft size={16} className="mr-1" /> Back to Farmers
        </Link>

        {/* Profile Header Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-12">
          {/* Cover Photo */}
          <div className="h-48 md:h-64 bg-earth-200 relative">
            <img 
              src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1200" 
              alt="Farm cover" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
          </div>
          
          <div className="px-8 pb-8">
            <div className="flex flex-col md:flex-row md:items-end -mt-16 md:-mt-20 mb-6 relative z-10">
              <img 
                src={farmer.image} 
                alt={farmer.name} 
                className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-white shadow-lg bg-white"
              />
              <div className="mt-4 md:mt-0 md:ml-6 flex-grow">
                <div className="flex flex-wrap items-center gap-3 mb-1">
                  <h1 className="text-3xl font-bold text-gray-900">{farmer.name}</h1>
                  {farmer.verified && <VerifiedBadge />}
                </div>
                <div className="flex items-center text-gray-600 font-medium">
                  <MapPin size={18} className="mr-1.5 text-primary-500" />
                  {farmer.location}
                </div>
              </div>
              
              {user?.sellerVerified && user?.farmerId === farmer.id && (
                <div className="mt-4 md:mt-0 flex-shrink-0">
                  <Link 
                    to="/seller/profile/edit" 
                    className="inline-flex items-center justify-center px-5 py-2.5 border-2 border-primary-500 text-primary-600 bg-white hover:bg-primary-50 rounded-xl font-bold transition-colors shadow-sm"
                  >
                    Edit Profile
                  </Link>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">About the Farm</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {farmer.bio}
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-earth-50 rounded-xl p-4 flex items-center">
                    <div className="bg-white p-2 rounded-lg shadow-sm mr-4">
                      <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">User Feedback</p>
                      <p className="font-bold text-gray-900">{farmer.rating} / 5.0 <span className="text-sm font-normal text-gray-500">({farmer.reviews} reviews)</span></p>
                    </div>
                  </div>
                  <div className="bg-earth-50 rounded-xl p-4 flex items-center">
                    <div className="bg-white p-2 rounded-lg shadow-sm mr-4">
                      <Calendar className="w-6 h-6 text-earth-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Joined</p>
                      <p className="font-bold text-gray-900">{farmer.joinedDate}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">Contact Details</h3>
                <ul className="space-y-4">
                  <li className="flex items-center text-gray-600">
                    <Phone className="w-5 h-5 mr-3 text-primary-500" />
                    {farmer.phone}
                  </li>
                  <li className="flex items-center text-gray-600">
                    <Mail className="w-5 h-5 mr-3 text-primary-500" />
                    {farmer.email}
                  </li>
                  <li className="flex items-start text-gray-600">
                    <MapPin className="w-5 h-5 mr-3 text-primary-500 shrink-0 mt-0.5" />
                    <span>{farmer.farmAddress || `${farmer.location}, India`}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Products Section */}
        <div className="mb-12">
          <SectionHeading title={`Products by ${farmer.name}`} />
          {farmerProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
              {farmerProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <EmptyState 
              title="No Products Available"
              message="This farmer hasn't listed any products yet."
            />
          )}
        </div>

      </div>
    </div>
  );
};

export default FarmerProfile;
