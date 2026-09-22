import React, { useState } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { Upload, CheckCircle2 } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { categories } from '../data/mockData';
import SellerLayout from '../components/SellerLayout';
import Button from '../components/Button';

const AddProduct = () => {
  const navigate = useNavigate();
  const { user } = useAppContext();
  
  const [formData, setFormData] = useState({
    name: '',
    categoryId: '',
    price: '',
    unit: 'kg',
    availableQuantity: '',
    harvestDate: '',
    description: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!user || !user.sellerVerified || !user.farmerId) {
    return <Navigate to="/login" replace />;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccess(true);
    }, 1000);
  };

  if (success) {
    return (
      <SellerLayout title="Add Product">
        <div className="bg-white rounded-3xl p-10 max-w-md mx-auto w-full text-center shadow-sm border border-gray-100 my-10">
          <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={40} />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Product Added!</h2>
          <p className="text-gray-600 mb-8">
            Your fresh produce is now listed on the marketplace for customers to buy.
          </p>
          <div className="space-y-4">
            <Button fullWidth onClick={() => { setSuccess(false); setFormData({name: '', categoryId: '', price: '', unit: 'kg', availableQuantity: '', harvestDate: '', description: ''}); }}>
              Add Another Product
            </Button>
            <Link to="/seller/products">
              <Button variant="outline" fullWidth>Go to My Products</Button>
            </Link>
          </div>
        </div>
      </SellerLayout>
    );
  }

  return (
    <SellerLayout title="List New Product">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-6 border-b border-gray-100 bg-earth-50">
          <p className="text-gray-600">Add details about your fresh produce so customers know exactly what they are buying.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 md:p-8">
          
          <div className="mb-8">
            <label className="block text-sm font-bold text-gray-900 mb-4">Product Image</label>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                <Upload className="text-primary-500" />
              </div>
              <p className="font-medium text-gray-900">Click to upload or drag and drop</p>
              <p className="text-sm text-gray-500 mt-1">SVG, PNG, JPG or GIF (max. 5MB)</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
              <input 
                type="text" 
                name="name"
                required
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white"
                placeholder="e.g. Organic Honeycrisp Apples"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select 
                name="categoryId"
                required
                value={formData.categoryId}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white appearance-none"
              >
                <option value="" disabled>Select a category</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Harvest Date</label>
              <input 
                type="date" 
                name="harvestDate"
                required
                value={formData.harvestDate}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price (₹)</label>
              <input 
                type="number" 
                name="price"
                min="1"
                required
                value={formData.price}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white"
                placeholder="e.g. 120"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                <input 
                  type="number" 
                  name="availableQuantity"
                  min="1"
                  required
                  value={formData.availableQuantity}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white"
                  placeholder="e.g. 50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Unit</label>
                <select 
                  name="unit"
                  value={formData.unit}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white appearance-none"
                >
                  <option value="kg">kg</option>
                  <option value="gram">gram</option>
                  <option value="piece">piece</option>
                  <option value="liter">liter</option>
                  <option value="bunch">bunch</option>
                  <option value="dozen">dozen</option>
                </select>
              </div>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Product Description</label>
              <textarea 
                name="description"
                required
                rows="4"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white resize-none"
                placeholder="Describe your product. How was it grown? Any special characteristics?"
              ></textarea>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-100 flex flex-col-reverse sm:flex-row justify-end gap-4">
            <Link to="/seller/products" className="w-full sm:w-auto">
              <Button type="button" variant="outline" className="w-full">Cancel</Button>
            </Link>
            <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
              {isSubmitting ? 'Publishing...' : 'Publish Product'}
            </Button>
          </div>
        </form>
      </div>
    </SellerLayout>
  );
};

export default AddProduct;
