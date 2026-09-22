import React, { useState, useEffect } from 'react';
import { useNavigate, Link, Navigate, useParams } from 'react-router-dom';
import { Upload, CheckCircle2 } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { categories } from '../data/mockData';
import SellerLayout from '../components/SellerLayout';
import Button from '../components/Button';

const EditProduct = () => {
  const navigate = useNavigate();
  const { productId } = useParams();
  const { user, products, updateProduct } = useAppContext();
  
  const [formData, setFormData] = useState({
    name: '',
    categoryId: '',
    price: '',
    unit: 'kg',
    availableQuantity: '',
    harvestDate: '',
    description: '',
    image: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [productFound, setProductFound] = useState(true);

  useEffect(() => {
    if (user && products) {
      const product = products.find(p => p.id === productId && p.farmerId === user.farmerId);
      if (product) {
        setFormData({
          name: product.name || '',
          categoryId: product.categoryId || '',
          price: product.price || '',
          unit: product.unit || 'kg',
          availableQuantity: product.availableQuantity || '',
          harvestDate: product.harvestDate || '',
          description: product.description || '',
          image: product.image || ''
        });
      } else {
        setProductFound(false);
      }
    }
  }, [productId, user, products]);

  if (!user || !user.sellerVerified || !user.farmerId) {
    return <Navigate to="/login" replace />;
  }

  if (!productFound) {
    return <Navigate to="/seller/products" replace />;
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
      updateProduct(productId, formData);
      setIsSubmitting(false);
      setSuccess(true);
      
      setTimeout(() => {
        navigate('/seller/products');
      }, 1500);
    }, 1000);
  };

  return (
    <SellerLayout title="Edit Product">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-6 border-b border-gray-100 bg-earth-50">
          <p className="text-gray-600">Update the details of your product.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 md:p-8">
          
          <div className="mb-8">
            <label className="block text-sm font-bold text-gray-900 mb-4">Product Image</label>
            <div className="flex flex-col sm:flex-row gap-6 items-start">
              {formData.image ? (
                <img src={formData.image} alt="Preview" className="w-32 h-32 rounded-xl object-cover border-4 border-earth-100 flex-shrink-0" />
              ) : (
                <div className="w-32 h-32 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                  <Upload className="text-gray-400" />
                </div>
              )}
              <div className="flex-grow w-full">
                <input 
                  type="url" 
                  name="image" 
                  value={formData.image} 
                  onChange={handleInputChange} 
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white" 
                  placeholder="https://example.com/photo.jpg"
                />
                <p className="text-xs text-gray-500 mt-2">Paste an image URL for your product picture.</p>
              </div>
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
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                <input 
                  type="number" 
                  name="availableQuantity"
                  min="0"
                  required
                  value={formData.availableQuantity}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white"
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
              ></textarea>
            </div>
          </div>

          {success && (
            <div className="bg-green-50 text-green-700 p-4 rounded-xl border border-green-200 flex items-center mb-6">
              <CheckCircle2 className="mr-2" />
              Product updated successfully! Redirecting...
            </div>
          )}

          <div className="pt-6 border-t border-gray-100 flex flex-col-reverse sm:flex-row justify-end gap-4">
            <Link to="/seller/products" className="w-full sm:w-auto">
              <Button type="button" variant="outline" className="w-full">Cancel</Button>
            </Link>
            <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>
    </SellerLayout>
  );
};

export default EditProduct;
